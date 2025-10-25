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
    <div id="now-loading">
    </div>
    <div id="controls">
    </div>
    <div id="text-box">
    </div>
    <div id="answer-box">
    </div>
    <p>AI監督</p>
  </div>
`;

// キャラクター画像を表示
const character = new CharacterMoveComponent(document.querySelector('#app'));
character.showCharacter('./assets/coach_upbody.png', {
  width: 781/2 + 781/3,
  height: 633/2 + 633/3,
  anchor: 'topleft'
});
character.setPosition(-100, 0);  // 表示位置を設定

const voice = new CharacterVoiceComponent();


const container = document.querySelector('#text-box');
const answerBox = new AnswerBoxComponent();
container.appendChild(answerBox.getElement());

const textBox = new TextBoxComponent();
container.appendChild(textBox.getElement());

const movie = new MovieComponent();
container.appendChild(movie.getElement());

// Question selector を controls にマウントし、選択時に textarea に反映
const questions = [
  "オフサイドとは何ですか？",
  "ギラヴァンツ北九州の一番有名なプレイヤーは誰ですか？",
  "スローインの正しい投げ方を教えてください。",
  "PKの成功率を挙げるコツは何ですか？",
  "PKってなんですか？"
];

new QuestionSelectorComponent(questions, (value) => {
  textBox.setValue(value);
  const ta = textBox.getTextarea();
  if (ta) ta.focus();
}, '#controls');


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const sendButton = new SendButtonComponent(textBox, (answer, data,video_url,video_start) => {
    answerBox.setValueAnimated(answer, 50);
    character.startShaking();
    voice.play('./assets/sample.mp3');
    delay(answer.length * 50).then(() => {
      character.stopShaking();
      movie.play(video_url,video_start);
    });
});
container.appendChild(sendButton.getElement());
