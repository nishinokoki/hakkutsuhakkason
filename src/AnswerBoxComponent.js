export class AnswerBoxComponent {
  constructor() {
    this.element = document.createElement('div');
    this.render();  
  }

   render() {
    this.element.innerHTML = `
        <div class="answer-box-component">
            <textarea id="answer-box" readonly placeholder="ここに回答が表示されます"></textarea>
        </div>
    `;  
  }

  getElement() {
    return this.element;
  }

  getTextarea() {
    return this.element.querySelector('#answer-box');
  }

  // プログラムから書き込む用
  setValue(text) {
    const ta = this.getTextarea();
    if (ta) {
      ta.value = text ?? '';
      ta.scrollTop = ta.scrollHeight; // 末尾までスクロール
    }
  }

  // 一文字ずつ表示（アニメーション）
  setValueAnimated(text, delayMs = 50) {
    // 既存のアニメーションを停止
    if (this.animationTimerId) {
      clearInterval(this.animationTimerId);
    }

    const ta = this.getTextarea();
    if (!ta || !text) {
      this.setValue(text);
      return;
    }

    ta.value = '';  // 一旦クリア
    let index = 0;

    this.animationTimerId = setInterval(() => {
      if (index < text.length) {
        ta.value += text.charAt(index);
        index++;
        ta.scrollTop = ta.scrollHeight; // 末尾までスクロール
      } else {
        clearInterval(this.animationTimerId);
      }
    }, delayMs);
  }

  // アニメーションを即座に完了させる
  skipAnimation() {
    if (this.animationTimerId) {
      clearInterval(this.animationTimerId);
      this.animationTimerId = null;
    }
  }

  clear() {
    this.skipAnimation();
    this.setValue('');
  }
}