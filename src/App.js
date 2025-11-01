import { TextBoxComponent } from './TextBoxComponent.js';
import { SendButtonComponent } from './SendButtonComponent.js';
import { QuestionSelectorComponent } from './QuestionSelectorComponent.js';
import { CharacterMoveComponent } from './CharacterMoveComponent.js';
import { AnswerBoxComponent } from './AnswerBoxComponent.js';
import { MovieComponent } from './MovieComponent.js';
import { LoadingIndicator } from './components/LoadingIndicator.js';
import { AppLayout } from './components/AppLayout.js';
import { ApiService, AudioUtils } from './services/apiService.js';
import { delay, ensureAudioContext, setElementDisabled } from './utils/helpers.js';
import {
  CHARACTER_IMAGES,
  CHARACTER_POSITIONS,
  PRESET_QUESTIONS,
  ANIMATION_CONFIG,
} from './config/constants.js';

/**
 * メインアプリケーションクラス
 * アプリ全体の状態とコンポーネントを管理
 */
export class App {
  constructor() {
    // 状態管理
    this.state = {
      currentFeelingId: 0,
      audioContext: null,
    };

    // レイアウトの初期化
    this.layout = new AppLayout();

    // コンポーネントの初期化
    this.components = this.initializeComponents();

    // イベントリスナーの設定
    this.setupEventListeners();
  }

  /**
   * 全コンポーネントを初期化
   * @returns {Object} コンポーネントの参照
   */
  initializeComponents() {
    const layout = this.layout;

    // UI コンポーネント
    const textBox = new TextBoxComponent();
    const answerBox = new AnswerBoxComponent();
    const movie = new MovieComponent();
    const loadingIndicator = new LoadingIndicator();

    // 送信ボタン
    const sendButtonElement = document.createElement('button');
    sendButtonElement.id = 'send-button';
    sendButtonElement.type = 'button';
    sendButtonElement.textContent = '送信';
    const sendButton = new SendButtonComponent(textBox, ANIMATION_CONFIG.CHARACTER_SHAKE_SPEED, sendButtonElement);

    // 質問セレクタ
    const questionSelector = new QuestionSelectorComponent(
      PRESET_QUESTIONS,
      (value) => {
        textBox.setValue(value);
        const ta = textBox.getTextarea();
        if (ta) ta.focus();
      },
      layout.getContainer('controls')
    );

    // キャラクター
    const character = new CharacterMoveComponent(layout.getRoot());
    character.showCharacter(
      CHARACTER_IMAGES[this.state.currentFeelingId],
      null,
      CHARACTER_POSITIONS[this.state.currentFeelingId]
    );
    character.setPosition(-90, 0);

    // コンポーネントをレイアウトにマウント
    const textBoxArea = layout.getContainer('textBoxArea');
    textBoxArea.appendChild(answerBox.getElement());
    textBoxArea.appendChild(textBox.getElement());
    textBoxArea.appendChild(movie.getElement());

    const sendButtonArea = layout.getContainer('sendButtonArea');
    sendButtonArea.appendChild(sendButtonElement);

    layout.getRoot().appendChild(loadingIndicator.getElement());

    return {
      textBox,
      answerBox,
      movie,
      loadingIndicator,
      sendButton,
      sendButtonElement,
      questionSelector,
      character,
    };
  }

  /**
   * イベントリスナーを設定
   */
  setupEventListeners() {
    const { sendButtonElement } = this.components;

    // 送信ボタンクリック
    sendButtonElement.addEventListener('click', () => this.handleSend());

    // Enterキーで送信（オプション）
    // document.addEventListener('keydown', (event) => {
    //   if (event.key === 'Enter' && !event.repeat) {
    //     event.preventDefault();
    //     this.handleSend();
    //   }
    // });
  }

  /**
   * 送信処理のハンドラ
   */
  async handleSend() {
    const {
      textBox,
      answerBox,
      movie,
      loadingIndicator,
      sendButton,
      sendButtonElement,
      character,
    } = this.components;

    console.log('送信ボタンがクリックされました');

    // 動画をリセット
    movie.stop();

    // ローディング表示を開始
    loadingIndicator.show();

    // ボタンを無効化
    setElementDisabled(sendButtonElement, true);

    try {
      // AudioContextの準備
      this.state.audioContext = ensureAudioContext(this.state.audioContext);

      // API送信
      const result = await sendButton.send();

      if (result) {
        const { answer, video_url, video_start, voice_length, fel_id2 } = result;
        console.log('fel_id2:', fel_id2);

        // キャラクター表情の更新
        if (fel_id2 !== undefined && fel_id2 !== this.state.currentFeelingId) {
          character.showCharacter(
            CHARACTER_IMAGES[this.state.currentFeelingId],
            CHARACTER_IMAGES[fel_id2],
            CHARACTER_POSITIONS[this.state.currentFeelingId],
            CHARACTER_POSITIONS[fel_id2]
          );
          this.state.currentFeelingId = fel_id2;
        }

        // 回答をアニメーション表示
        answerBox.setValueAnimated(answer, ANIMATION_CONFIG.ANSWER_DELAY_PER_CHAR);

        // キャラクターを揺らす
        character.startShaking();

        // アニメーション終了後に動画を再生
        await delay(answer.length * ANIMATION_CONFIG.ANSWER_DELAY_PER_CHAR);
        character.stopShaking();
        movie.play(video_url, video_start);
      }
    } catch (error) {
      console.error('送信エラー:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      // ローディング表示を終了
      loadingIndicator.hide();

      // ボタンを再度有効化
      setElementDisabled(sendButtonElement, false);
    }
  }

  /**
   * アプリケーションをマウント
   * @param {string|HTMLElement} target - マウント先
   */
  mount(target = '#app') {
    this.layout.mount(target);
  }
}
