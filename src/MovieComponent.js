export class MovieComponent {
  constructor(container = document.body) {
    this.container = container;
    this.videoElement = document.createElement('video');
    this.videoElement.id = 'assist-video';
    this.videoElement.autoplay = true;
    this.videoElement.loop = true;
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;
    this.container.appendChild(this.videoElement);
  }

  // 動画URLを設定して再生
  play(url) {
    if (!url) {
      console.error('動画URLが指定されていません');
      return; 
    }

    this.videoElement.src = url;
    this.videoElement.load();

    const playPromise = this.videoElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('動画の再生に失敗しました:', error);
      });
    }
  }

  getElement() {
    return this.videoElement;
  }

  //ボリューム設定(0.0 ~ 1.0)
  setVolume(volume) {
    this.videoElement.volume = Math.max(0, Math.min(1, volume));
  }
}