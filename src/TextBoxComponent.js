export class TextBoxComponent {
  constructor() {
    this.element = document.createElement('div');
    this.render();  
  };

  render() {
    this.element.innerHTML = `
        <div class="text-box-component">
            <input type="text" placeholder="テキストを入力">
        </div>
    `;  
  }

  getElement() {
    return this.element;
  }
}