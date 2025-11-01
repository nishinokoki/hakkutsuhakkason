import { API_CONFIG } from '../config/constants.js';

/**
 * APIサービス - サーバーとの通信を管理
 */
export class ApiService {
  /**
   * 質問を送信して回答を取得
   * @param {string} message - 送信する質問
   * @param {number} speed - 音声速度
   * @returns {Promise<Object>} レスポンスデータ
   */
  static async sendQuestion(message, speed = 1.0) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANSWER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: message, 
          include_audio: true, 
          speed 
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        answer: data.answer,
        videoUrl: data.video_url,
        videoStart: data.video_start,
        voiceLength: data.audio?.length || 0,
        feelingId: data.feeling_id,
        audioData: data.audio?.data || null,
      };
    } catch (error) {
      console.error('API送信エラー:', error);
      throw error;
    }
  }
}

/**
 * オーディオユーティリティ
 */
export class AudioUtils {
  /**
   * Base64文字列をBlobに変換
   * @param {string} base64 - Base64文字列
   * @param {string} mimeType - MIMEタイプ
   * @returns {Blob}
   */
  static base64ToBlob(base64, mimeType) {
    const cleaned = base64.includes(',') ? base64.split(',').pop() : base64;
    const bin = atob(cleaned);
    const len = bin.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  }

  /**
   * 音声を再生（音量ブースト付き）
   * @param {string} audioData - Base64エンコードされた音声データ
   * @param {AudioContext} audioContext - Web Audio APIのコンテキスト
   * @param {number} volume - 音量（1.0が標準）
   */
  static async playAudio(audioData, audioContext, volume = 3.0) {
    if (!audioData) return;

    try {
      const audioBlob = AudioUtils.base64ToBlob(audioData, 'audio/mpeg');
      const arrayBuf = await audioBlob.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuf);

      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;

      source.connect(gainNode).connect(audioContext.destination);
      source.start(0);

      // 終了時のクリーンアップ
      source.onended = () => {
        try {
          source.disconnect();
          gainNode.disconnect();
        } catch (e) {
          // 既に切断されている場合は無視
        }
      };
    } catch (error) {
      console.error('音声再生エラー:', error);
    }
  }
}
