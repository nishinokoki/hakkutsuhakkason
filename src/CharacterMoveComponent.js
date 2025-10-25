export class CharacterMoveComponent {
  constructor(characterElement) {
    this.characterElement = characterElement;
    this.position = { x: -200, y: 100 };
    this.movementSpeed = 5;

    // 内部で使う要素
    this.container = this.characterElement || document.body;
    this.imgElement = null;
    this.anchor = 'topleft'; // 描画位置の基準（'center' or 'topleft'）
    this.shakeTimerId = null;  // 震えアニメーション用タイマー
    this.originalPosition = null;  // 元の位置を保存
  }

  // PNGなど画像のURLを受け取って画面に表示する
  showCharacter(src, options = {}) {
    if (!this.imgElement) {
      this.imgElement = document.createElement('img');
      this.imgElement.className = 'character-image';
      this.container.appendChild(this.imgElement);
    }
    this.imgElement.src = src;
    console.log('Character image source set to:', src);
    if (options.width) {
      this.imgElement.style.width = typeof options.width === 'number' ? `${options.width}px` : options.width;
    }
    if (options.height) {
      this.imgElement.style.height = typeof options.height === 'number' ? `${options.height}px` : options.height;
    }
    if (options.anchor) this.anchor = options.anchor;
  }

  setPosition(x, y) {
    // デフォルト値を設定
    if (x === undefined) x = this.position.x;
    if (y === undefined) y = this.position.y;
    this.position.x = x;
    this.position.y = y;
    if (this.imgElement) {
      this.imgElement.style.left = `${x}px`;
      this.imgElement.style.top = `${y}px`;
    }
  }

  startShaking(intensity = 2, intervalMs = 100) {
    // 既に震えている場合は停止
    this.stopShaking();

    // 元の位置を保存
    this.originalPosition = { ...this.position };

    this.shakeTimerId = setInterval(() => {
      if (!this.imgElement) return;

      // ランダムに少しずらす
      const offsetX = (Math.random() - 0.5) * intensity * 2 * 0;
      const offsetY = (Math.random() - 0.5) * intensity * 4;

      this.imgElement.style.left = `${this.originalPosition.x + offsetX}px`;
      this.imgElement.style.top = `${this.originalPosition.y + offsetY}px`;
    }, intervalMs);
  }

  stopShaking() {
    if (this.shakeTimerId) {
      clearInterval(this.shakeTimerId);
      this.shakeTimerId = null;

      // 元の位置に戻す
      if (this.originalPosition && this.imgElement) {
        this.imgElement.style.left = `${this.originalPosition.x}px`;
        this.imgElement.style.top = `${this.originalPosition.y}px`;
      }
    }
  } 
}
