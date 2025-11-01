import { ApiService, AudioUtils } from './services/apiService.js';
import { ensureAudioContext } from './utils/helpers.js';

/**
 * 送信ボタンコンポーネント
 * テキストボックスの内容をAPIに送信し、音声を再生
 */
export class SendButtonComponent {
  constructor(textBox, speed = 1.0, buttonElement) {
    this.textBox = textBox;
    this.speed = speed;
    this.element = buttonElement;
    this.audioCtx = null;
  }

  /**
   * 要素を取得
   * @returns {HTMLElement}
   */
  getElement() {
    return this.element;
  }

  /**
   * メッセージを送信
   * @returns {Promise<Object|null>} APIレスポンス
   */
  async send() {
    try {
      // テキストボックスから値を取得
      const message = this.getTextBoxValue();
      console.log('送信メッセージ:', message);

      // API送信
      const data = await ApiService.sendQuestion(message, this.speed);

      // 音声再生
      if (data.audioData) {
        this.audioCtx = ensureAudioContext(this.audioCtx);
        await AudioUtils.playAudio(data.audioData, this.audioCtx, 3.0);
      }

      // 結果を返す
      return {
        answer: data.answer,
        video_url: data.videoUrl,
        video_start: data.videoStart,
        voice_length: data.voiceLength,
        fel_id2: data.feelingId,
      };
    } catch (error) {
      console.error('送信エラー:', error);
      throw error;
    }
  }

  /**
   * テキストボックスから値を取得（互換性維持）
   * @returns {string}
   */
  getTextBoxValue() {
    if (typeof this.textBox.getValue === 'function') {
      return this.textBox.getValue();
    }
    if (this.textBox.getTextarea) {
      return this.textBox.getTextarea()?.value || '';
    }
    return '';
  }
}