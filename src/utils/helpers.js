/**
 * ユーティリティ関数集
 */

/**
 * 指定されたミリ秒だけ待機
 * @param {number} ms - 待機時間（ミリ秒）
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * AudioContextを作成・再開
 * @param {AudioContext|null} existingContext - 既存のコンテキスト
 * @returns {AudioContext}
 */
export const ensureAudioContext = (existingContext = null) => {
  let audioCtx = existingContext;
  
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  return audioCtx;
};

/**
 * 要素を無効化/有効化する
 * @param {HTMLElement} element - 対象要素
 * @param {boolean} disabled - 無効化するかどうか
 */
export const setElementDisabled = (element, disabled) => {
  element.disabled = disabled;
  element.style.opacity = disabled ? '0.6' : '1';
  element.style.cursor = disabled ? 'not-allowed' : 'pointer';
};
