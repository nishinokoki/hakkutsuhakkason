export class MovieComponent {
  constructor(container = document.body) {
    this.container = container;
    this.iframeElement = document.createElement('iframe');
    this.iframeElement.id = 'assist-video';
    this.iframeElement.setAttribute('frameborder', '0');
    this.iframeElement.setAttribute('allow', 'autoplay; encrypted-media');
    this.iframeElement.setAttribute('allowfullscreen', '');
    this.container.appendChild(this.iframeElement);
  }

  play(url, video_start) {
    if (!url) {
      console.error('動画URLが指定されていません');
      return; 
    }

    const videoId = this.extractYouTubeId(url);
    if (!videoId) {
      console.error('無効なYouTube URLです:', url);
      return;
    }

    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: videoId
    });
    
    // video_start が指定されていればそれを使う、なければURLから抽出
    const startTime = video_start ?? this.extractStartTime(url);
    if (startTime !== undefined && startTime >= 0) {
      params.set('start', String(startTime));
    }
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    this.iframeElement.src = embedUrl;
  }

  extractYouTubeId(url) {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return shortMatch[1];

    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (longMatch) return longMatch[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

    return null;
  }

  extractStartTime(url) {
    const match = url.match(/[?&]t=(\d+)/);
    return match ? parseInt(match[1], 10) : undefined;
  }

  getElement() {
    return this.iframeElement;
  }

  stop() {
    this.iframeElement.src = '';
  }
}