import { log } from "../utils/utils";

export class SoundFX {
  private audioContext: AudioContext;
  private gainValue: number;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainValue = 0.5; // default volume
  }

  async play(frequency: number, duration: number, delay: number = 0) {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    let oscillator = this.audioContext.createOscillator();
    let gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = this.gainValue;
    oscillator.type = "square";
    
    oscillator.start(this.audioContext.currentTime + delay);
    oscillator.stop(this.audioContext.currentTime + delay + duration);
  }

  setVolume(config: string, volume: number) {
    if (volume < 0 || volume > 1) {
      log(`GameScript: "SoundFX: volume set to default. set value must be between 0 and 1`);
    } else {
      this.gainValue = volume;
    }
  }

  playPaddleHit() {
    this.play(200, 0.1);
  }
  
  playWallHit() {
    this.play(100, 0.1);
  }

  playCountdown2() {
    this.play(250, 0.1);
  }
  
  playCountdown1() {
    this.play(400, 0.1);
  }
  
  playStart() {
    this.play(450, 0.2);
  }

  playGoal() {
    this.play(440, 0.1);
    this.play(460, 0.1, 0.1);
    this.play(480, 0.1, 0.2);
  }

  playWin() {
    this.play(500, 0.3);
    this.play(600, 0.3, 0.3);
    this.play(700, 0.4, 0.6);
  }

  playLose() {
    this.play(300, 0.3);
    this.play(250, 0.3, 0.3);
    this.play(200, 0.4, 0.6);
  }

  reinitialize() {
    this.audioContext.close();
    this.audioContext = new AudioContext();
  }

  stopAll() {
    this.audioContext.close();
  }
}