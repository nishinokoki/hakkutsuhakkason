import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export const TextBoxComponent = forwardRef((props, ref) => {
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue: () => textareaRef.current?.value || '',
    setValue: (value) => {
      if (textareaRef.current) {
        textareaRef.current.value = value;
      }
    },
    getTextarea: () => textareaRef.current,
  }));

  return (
    <div className="text-box-component">
      <textarea
        ref={textareaRef}
        placeholder="質問を入力してください..."
      />
    </div>
  );
});

// 旧バージョン（互換性のため残す）
export class TextBoxComponent_Old {
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