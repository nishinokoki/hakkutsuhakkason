export class QuestionSelectorComponent {
  constructor(questions = [], onSelect = null, mountPoint = document.body) {
    this.questions = questions;
    this.onSelect = onSelect;
    this.mountPoint = (typeof mountPoint === 'string') ? document.querySelector(mountPoint) : mountPoint;
    this.element = document.createElement('form');
    this.element.className = 'question-selector';
    this.render();
    this.mount();
  }

  render() {
    this.element.innerHTML = '';
    const select = document.createElement('select');
    select.id = 'question-select';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '質問を選択してください';
    select.appendChild(placeholder);

    this.questions.forEach(q => {
      const opt = document.createElement('option');
      opt.value = q;
      opt.textContent = q;
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      const v = e.target.value;
      if (v && this.onSelect) this.onSelect(v);
    });

    this.element.appendChild(select);
  }

  mount() {
    if (this.mountPoint) this.mountPoint.appendChild(this.element);
  }

  getElement() {
    return this.element;
  }
}