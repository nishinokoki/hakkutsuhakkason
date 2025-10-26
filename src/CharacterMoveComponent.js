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
  showCharacter(src, src2, options = {}, options2 = {}) {
    // src2がない場合は通常の画像切り替え
    if (!src2) {
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
      if (options.position) {
        this.position = options.position;
        this.setPosition(this.position.x, this.position.y);
      }
      return;
    }

    // src2がある場合はフェード切り替え
    if (!this.imgElement) {
      // 初回は新しい画像を直接表示
      this.imgElement = document.createElement('img');
      this.imgElement.className = 'character-image';
      this.imgElement.src = src2;
      this.container.appendChild(this.imgElement);

      // options2を適用
      if (options2.width) {
        this.imgElement.style.width = typeof options2.width === 'number' ? `${options2.width}px` : options2.width;
      }
      if (options2.height) {
        this.imgElement.style.height = typeof options2.height === 'number' ? `${options2.height}px` : options2.height;
      }
      if (options2.position) {
        this.position = options2.position;
        this.setPosition(this.position.x, this.position.y);
      }
    } else {
      // 既存の画像がある場合はフェード切り替え
      const oldImg = this.imgElement;
      const newImg = document.createElement('img');
      newImg.className = 'character-image';
      newImg.src = src2;

      // 新しい画像にoptions2を適用
      if (options2.width) {
        newImg.style.width = typeof options2.width === 'number' ? `${options2.width}px` : options2.width;
      }
      if (options2.height) {
        newImg.style.height = typeof options2.height === 'number' ? `${options2.height}px` : options2.height;
      }

      // 新しい位置を設定
      if (options2.position) {
        this.position = options2.position;
        newImg.style.left = `${this.position.x}px`;
        newImg.style.top = `${this.position.y}px`;
      } else {
        newImg.style.left = oldImg.style.left;
        newImg.style.top = oldImg.style.top;
      }

      newImg.style.opacity = '0';
      newImg.style.transition = 'opacity 0.5s ease-in-out';

      this.container.appendChild(newImg);

      // フェードアニメーション開始
      requestAnimationFrame(() => {
        oldImg.style.transition = 'opacity 0.75s ease-in-out';
        oldImg.style.opacity = '0';
        newImg.style.opacity = '1';
      });

      // アニメーション終了後に古い画像を削除
      setTimeout(() => {
        if (oldImg.parentNode) {
          oldImg.parentNode.removeChild(oldImg);
        }
        this.imgElement = newImg;
      }, 500);

      this.imgElement = newImg;
    }

    console.log('Character image transitioning from:', src, 'to:', src2);
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
