/**
 * アプリケーションのレイアウトを管理するコンポーネント
 */
export class AppLayout {
  constructor() {
    this.containers = this.createLayout();
  }

  /**
   * レイアウト構造を作成
   * @returns {Object} 各コンテナへの参照
   */
  createLayout() {
    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';

    // ヘッダー
    const header = document.createElement('h1');

    // コントロールエリア（質問選択）
    const controls = document.createElement('div');
    controls.id = 'controls';

    // テキストボックスエリア
    const textBoxArea = document.createElement('div');
    textBoxArea.id = 'text-box';

    // 回答ボックスエリア
    const answerBoxArea = document.createElement('div');
    answerBoxArea.id = 'answer-box';

    // 送信ボタンエリア
    const sendButtonArea = document.createElement('div');
    sendButtonArea.id = 'send-button2';

    // レイアウトを組み立て
    appContainer.appendChild(header);
    appContainer.appendChild(controls);
    appContainer.appendChild(textBoxArea);
    appContainer.appendChild(answerBoxArea);
    appContainer.appendChild(sendButtonArea);

    return {
      root: appContainer,
      header,
      controls,
      textBoxArea,
      answerBoxArea,
      sendButtonArea,
    };
  }

  /**
   * ルート要素を取得
   * @returns {HTMLElement}
   */
  getRoot() {
    return this.containers.root;
  }

  /**
   * 特定のコンテナを取得
   * @param {string} name - コンテナ名
   * @returns {HTMLElement}
   */
  getContainer(name) {
    return this.containers[name];
  }

  /**
   * アプリケーションをマウント
   * @param {string|HTMLElement} target - マウント先のセレクタまたは要素
   */
  mount(target) {
    const container = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (container) {
      container.innerHTML = '';
      container.appendChild(this.containers.root);
    }
  }
}
