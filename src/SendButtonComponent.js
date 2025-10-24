export class SendButtonComponent {
  constructor(textBox, onSuccess = null) {
    this.textBox = textBox;
    this.onSuccess = onSuccess;
    this.element = document.createElement('button');
    this.element.type = 'button';
    this.render();
    this.setupEventLitener();
  }

  render() {
    this.element.id = 'send-button';
    this.element.textContent = `送信`;
  }
  getElement() {
    return this.element;
  }

  // クリックと Enter キーで送信するように設定
  setupEventLitener() {
    // ボタンクリックで送信
    this.element.addEventListener('click', () => {
      this.send();
    });

    // Enter キーで送信（どこにフォーカスがあっても送信）
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.repeat) {
        event.preventDefault(); // textareaでの改行を防ぎたい場合は有効にする
        this.send();
      }
    });
  }


  async send() {
    try {
      const message = (typeof this.textBox.getValue === 'function')
        ? this.textBox.getValue()
        : (this.textBox.getTextarea ? (this.textBox.getTextarea()?.value || '') : '');

        console.log('送信メッセージ:', message);
      const response = await fetch('https://fastapi-render-3-fz7f.onrender.com/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"text": message })
      });


      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }


      const data = await response.json();
      if (this.onSuccess) this.onSuccess(data.answer, data); // ← ここで main に渡す
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }
}