import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export const AnswerBoxComponent = forwardRef((props, ref) => {
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setValueAnimated: (text, delayPerChar = 120) => {
      if (!textareaRef.current) return;
      
      textareaRef.current.value = '';
      let index = 0;
      
      const intervalId = setInterval(() => {
        if (index < text.length) {
          textareaRef.current.value += text[index];
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, delayPerChar);
    },
  }));

  return (
    <div className="answer-box-component">
      <textarea
        ref={textareaRef}
        readOnly
        placeholder="回答がここに表示されます..."
      />
    </div>
  );
});

// 旧バージョン（互換性のため残す）
export class AnswerBoxComponent_Old {
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