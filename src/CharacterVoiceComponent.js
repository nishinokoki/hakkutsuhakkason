export class CharacterVoiceComponent {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
  }

  play(audioSource) {
    if (!audioSource) {
      console.error('音声ソースが指定されていません');
      return;
    }

    this.stop();

    if (audioSource instanceof Blob) {
      this.audioElement.src = URL.createObjectURL(audioSource);
    } else {
      this.audioElement.src = audioSource;
    }

     const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('音声再生開始');
        })
        .catch(error => {
          console.error('音声の再生に失敗しました:', error);
        });
    }
  }

    // 停止
  stop() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  setVolume(volume) {
    this.audioElement.volume = Math.max(0, Math.min(1, volume));
  }

  isPlaying() {
    return !this.audioElement.paused;
  }
}
