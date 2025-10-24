export class TextBoxComponent {
  constructor() {
    this.element = document.createElement('div');
    this.render();  
  };

  render() {
    this.element.innerHTML = `
        <div class="text-box-component">
            <textarea id="text-box" type="text" placeholder="質問したいことを入力してください"></textarea>
        </div>
    `;  
  }

  getElement() {
    return this.element;
  }

  setValue(value) {
    const textarea = this.element.querySelector('textarea');    if (textarea) {
      textarea.value = value;
    }
  }
  getTextarea() {
    return this.element.querySelector('textarea');
  }
}