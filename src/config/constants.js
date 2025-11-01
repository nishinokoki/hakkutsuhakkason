// アプリケーション全体の定数管理

// キャラクター画像のパス
export const CHARACTER_IMAGES = [
  './assets/coach_upbody.png',
  './assets/coach_smile.png',
  './assets/coach_anger_special.png',
  './assets/coach_sad_special.png',
  './assets/coach_enjoy.png',
];

// キャラクターサイズと位置の設定
const CHARACTER_SIZE = 1024 / 1.8;

export const CHARACTER_POSITIONS = [
  { 
    width: 781 / 2 + 781 / 3, 
    height: 633 / 2 + 633 / 3, 
    position: { x: -100, y: 0 } 
  }, // upbody
  { 
    width: CHARACTER_SIZE, 
    height: CHARACTER_SIZE, 
    position: { x: -55, y: 0 } 
  }, // smile
  { 
    width: CHARACTER_SIZE, 
    height: CHARACTER_SIZE, 
    position: { x: -35, y: 0 } 
  }, // anger_special
  { 
    width: CHARACTER_SIZE, 
    height: CHARACTER_SIZE, 
    position: { x: -30, y: 0 } 
  }, // sad_special
  { 
    width: CHARACTER_SIZE, 
    height: CHARACTER_SIZE, 
    position: { x: -10, y: 0 } 
  } // enjoy
];

// 質問の選択肢
export const PRESET_QUESTIONS = [
  "昨日ギラヴァンツ北九州が勝ってましたね！自己紹介お願いします！",
  "PKってなに？相手に決められたときどう思います？",
  "コーナーキックってなに？相手に決められた際にどう思いますか？",
  "サッカーのサポーターってどんなことをするんですか？",
];

// アニメーション設定
export const ANIMATION_CONFIG = {
  ANSWER_DELAY_PER_CHAR: 120, // ミリ秒
  CHARACTER_SHAKE_SPEED: 1.0,
};

// API設定
export const API_CONFIG = {
  BASE_URL: 'https://fastapi-render-gemini-14.onrender.com',
  ENDPOINTS: {
    ANSWER: '/api/answer',
  },
};
