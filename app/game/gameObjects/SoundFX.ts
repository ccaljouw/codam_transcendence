export class SoundFX {
  private audioContext: AudioContext;

  constructor() {
      this.audioContext = new AudioContext();
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
    gainNode.gain.value = 0.5;
    oscillator.type = "square";
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playPaddleHit() {
    this.play(200, 0.1);
  }
  
  playWallHit() {
    this.play(100, 0.1);
  }
  
  playGoal() {
    this.play(500, 0.1);
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
  
  reinitialize() {
    this.audioContext.close();
    this.audioContext = new AudioContext();
  }
}