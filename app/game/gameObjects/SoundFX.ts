import { log } from "../utils/utils";
import * as CON from '../utils/constants'


export class SoundFX {
  private audioContext: AudioContext;
  private gainValue: number;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainValue = 0.5;
  }

  async play(frequency: number, duration: number) {
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
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  setVolume(config: string, volume: number) {
    if (volume < 0 || volume > 1) {
      log(`GameScript: "SoundFX: volume set to default. set value must be between 0 and 1`);
      this.gainValue = CON.config[config].defaultVolume;
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
    this.play(300, 0.1);
  }
  
  playCountdown1() {
    this.play(400, 0.1);
  }
  
  playStart() {
    this.play(500, 0.3);
  }
  
  playGoal() {
    this.play(440, 0.1);
  }
  
  reinitialize() {
    this.audioContext.close();
    this.audioContext = new AudioContext();
  }
}