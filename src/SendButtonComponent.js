// import React, { useState, useEffect } from "react";
// import fs from 'fs/promises';
// import path from 'path';

export class SendButtonComponent {
  constructor(textBox, speed = 1.0, buttonelement) {
    this.textBox = textBox;
    this.speed = speed;
    // this.element = document.createElement('button');
    // this.element.type = 'button';
    this.element = buttonelement;
    this.audioCtx = null;
    // this.render();
    // イベントリスナーの設定は外部で行うため、ここでは呼ばない
    // this.setupEventLitener();
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AC();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // render() {
  //   this.element.id = 'send-button';
  //   // this.element.textContent = `送信`;
  // }
  getElement() {
    return this.element;
  }

  async send() {
    try {
      const message = (typeof this.textBox.getValue === 'function')
        ? this.textBox.getValue()
        : (this.textBox.getTextarea ? (this.textBox.getTextarea()?.value || '') : '');

      console.log('送信メッセージ:', message);
      const response = await fetch('https://fastapi-render-gemini-13.onrender.com/api/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "text": message, "include_audio": true, "speed": this.speed, "actor": "dori" })
      });


      if (!response.ok) {
        throw new Error('送信に失敗しました');
      }

      const data = await response.json();
      console.log(data.audio);

      if (data.audio?.data) {
        // Base64 -> Blob に変換
        const audioBlob = base64ToBlob(data.audio.data, 'audio/mpeg');

        // 音量ブーストして再生（Web Audio API）
        const ctx = this.ensureAudioContext();
        const arrayBuf = await audioBlob.arrayBuffer();
        const buffer = await ctx.decodeAudioData(arrayBuf);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gainNode = ctx.createGain();
        gainNode.gain.value = 3.0; // 1.0=等倍, 2.0=約2倍（上げすぎ注意）
        source.connect(gainNode).connect(ctx.destination);
        source.start(0);
        // 終了時の後処理
        source.onended = () => {
          try { source.disconnect(); gainNode.disconnect(); } catch { }
        };
      }

      // if (this.onSuccess) this.onSuccess(data.answer, data.video_url, data.video_start,data.audio.length); // ← ここで main に渡す
      return {
        answer: data.answer,
        video_url: data.video_url,
        video_start: data.video_start,
        voice_length: data.audio.length,
        fel_id2: data.feeling_id
      };
  } catch(error) {
    console.error('エラーが発生しました:', error);
  }
}
}

// ここにユーティリティを追加
function base64ToBlob(base64, mimeType) {
  // 先頭に data:...;base64, が付いていたら取り除く
  const cleaned = base64.includes(',') ? base64.split(',').pop() : base64;
  const bin = atob(cleaned);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}