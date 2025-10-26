import './style.css'
import { TextBoxComponent } from './TextBoxComponent.js';
import { SendButtonComponent } from './SendButtonComponent.js';
import { QuestionSelectorComponent } from './QuestionSelectorComponent.js';
import { CharacterMoveComponent } from './CharacterMoveComponent.js';
import { AnswerBoxComponent } from './AnswerBoxComponent.js';
import { MovieComponent } from './MovieComponent.js';
import { CharacterVoiceComponent } from './CharacterVoiceComponent.js';

document.querySelector('#app').innerHTML = `
  <div>
    <h1></h1>
    <div id="now-loading" />
    <div id="controls" />
    <div id="text-box" />
    <div id="answer-box" />
    <div id="loading-indicator">
      <div class="loading-spinner"></div>
      <span>考え中...</span>
    </div>
    <div id="send-button2"></div>
  </div>
`;


const container = document.querySelector('#text-box');
const answerBox = new AnswerBoxComponent();
container.appendChild(answerBox.getElement());

const textBox = new TextBoxComponent();
container.appendChild(textBox.getElement());

const movie = new MovieComponent();
container.appendChild(movie.getElement());

// Question selector を controls にマウントし、選択時に textarea に反映
const questions = [
  "昨日ギラヴァンツ北九州が勝ってましたね！自己紹介お願いします！",
  "PKってなに？相手に決められたときどう思います？",
  "コーナーキックってなに？相手に決められた際にどう思いますか？",
  "サッカーのサポーターってどんなことをするんですか？",
];

new QuestionSelectorComponent(questions, (value) => {
  textBox.setValue(value);
  const ta = textBox.getTextarea();
  if (ta) ta.focus();
}, '#controls');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// document.querySelector('#send-button2').innerHTML = `送信`;
// document.querySelector('#send-button2').element = `button`;

// const sendButton2 = new SendButtonComponent(textBox, 1.3, document.querySelector('#send-button2'), (answer, video_url, video_start, voice_length) => {
// buuton 要素を作成
const sendButtonElement = document.createElement('button');
sendButtonElement.id = 'send-button';
sendButtonElement.type = 'button';
sendButtonElement.textContent = '送信';

// SendButtonComponent に button要素を渡す
//   const sendButton2 = new SendButtonComponent(textBox, 1.3, sendButtonElement, (answer, video_url, video_start, voice_length) => {
//   const x = voice_length / answer.length;
//     answerBox.setValueAnimated(answer,90);
//     character.startShaking();
//     delay(answer.length * 90).then(() => {
//       character.stopShaking();
//       movie.play(video_url,video_start);
//     });
// });

const sendButton2 = new SendButtonComponent(textBox, 1.0, sendButtonElement);
// イベントリスナーをmain.jsで管理
// ボタンクリックで送信
sendButtonElement.addEventListener('click', async () => {
  console.log('送信ボタンがクリックされました');

  // 動画をリセット
  movie.stop();

  // ローディング表示を開始
  const loadingIndicator = document.querySelector('#loading-indicator');
  loadingIndicator.classList.add('show');

  // ボタンを無効化
  sendButtonElement.disabled = true;
  sendButtonElement.style.opacity = '0.6';
  sendButtonElement.style.cursor = 'not-allowed';

  try {
    const result = await sendButton2.send();

    if (result) {
      const { answer, video_url, video_start, voice_length, fel_id2
      } = result;
      console.log('fel_id2:', fel_id2);

      if (fel_id2 !== undefined) {
        character.showCharacter(cha_list[fel_id],cha_list[fel_id2], cha_position[fel_id],cha_position[fel_id2]);
        fel_id = fel_id2;
      }

      answerBox.setValueAnimated(answer, 120);
      character.startShaking();
      delay(answer.length * 120).then(() => {
        character.stopShaking();
        movie.play(video_url, video_start);
      });
    }
  } finally {
    // ローディング表示を終了
    loadingIndicator.classList.remove('show');

    // ボタンを再度有効化
    sendButtonElement.disabled = false;
    sendButtonElement.style.opacity = '1';
    sendButtonElement.style.cursor = 'pointer';
  }
});

const cha_list = ['./assets/coach_upbody.png', 
                  './assets/coach_smile.png', 
                  './assets/coach_anger_special.png', 
                  './assets/coach_sad_special.png',
                  './assets/coach_enjoy.png', 
                  ];
const cha_size = 1024 / 1.8;
const cha_position = [
  { width: 781 / 2 + 781 / 3, height: 633 / 2 + 633 / 3, position: {x: -100, y: 0} },// upbody
  { width: cha_size, height: cha_size, position: {x: -55, y: 0} }, // smile
  { width: cha_size, height: cha_size, position: {x: -35, y: 0} }, // anger_special
  { width: cha_size, height: cha_size, position: {x: -30, y: 0} }, // sad_special
  { width: cha_size, height: cha_size, position: {x: -10, y: 0} } //enjoy
];

// キャラクター画像を表示
const character = new CharacterMoveComponent(document.querySelector('#app'));
let fel_id = 0;
character.showCharacter(cha_list[fel_id],null, cha_position[fel_id]);
character.setPosition(-90, 0);
// Enter キーで送信
// document.addEventListener('keydown', (event) => {
//   if (event.key === 'Enter' && !event.repeat) {
//     event.preventDefault();
//     console.log('Enterキーが押されました');
//     sendButton2.send();
//   }
// });

// const sendButton = new SendButtonComponent(textBox, 1.3, (answer, video_url,video_start,voice_length) => {
//   const x = voice_length / answer.length;
//     answerBox.setValueAnimated(answer,90);
//     character.startShaking();
//     delay(answer.length * 90).then(() => {
//       character.stopShaking();
//       movie.play(video_url,video_start);
//     });
// });
document.querySelector('#send-button2').appendChild(sendButtonElement);
