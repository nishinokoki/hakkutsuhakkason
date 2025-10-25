import React, { useState, useEffect } from "react";

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
      const response = await fetch('https://fastapi-render-gemini-6.onrender.com/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"text": message })
      });


      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      const data = await response.json();
      
      try { 
        // Node.jsのfsモジュールを使ってファイル保存
            const fs = window.require('fs').promises;
            const path = window.require('path');
            // ファイル名生成
            const filename = `character_voice.mp3`;
            const filepath = path.join(src, filename);
            
            // Base64デコードして保存
            const audioBuffer = Buffer.from(data.audio.data, 'base64');
            await fs.writeFile(filepath, audioBuffer);
            
            console.log(`✅ Audio saved: ${filepath}`);
            console.log(`📁 File size: ${audioBuffer.length} bytes`);
            
            return filepath;
        } catch (error) {
            console.error('Failed to save audio:', error);
            throw error;
        }

      if (this.onSuccess) this.onSuccess(data.answer, data,data.video_url,data.video_start); // ← ここで main に渡す
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }
}