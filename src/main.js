import './style.css'
import { TextBoxComponent } from './TextBoxComponent.js';
import { SendButtonComponent } from './SendButtonComponent.js';
import { QuestionSelectorComponent } from './QuestionSelectorComponent.js';
import { CharacterMoveComponent } from './CharacterMoveComponent.js';
import { AnswerBoxComponent } from './AnswerBoxComponent.js';

document.querySelector('#app').innerHTML = `
  <div>
    <h1></h1>
    <div id="controls">
    </div>
    <div id="text-box">
    </div>
    <div id="answer-box">
    </div>
    <p>
    </p>
  </div>
`;

// キャラクター画像を表示
const character = new CharacterMoveComponent(document.querySelector('#app'));
character.showCharacter('/assets/coach_upbody.png', {
  width: 781/2 + 781/3,
  height: 633/2 + 633/3,
  anchor: 'topleft'
});
character.setPosition(-100, 0);  // 表示位置を設定

const container = document.querySelector('#text-box');
const answerBox = new AnswerBoxComponent();
container.appendChild(answerBox.getElement());

const textBox = new TextBoxComponent();
container.appendChild(textBox.getElement());

const sendButton = new SendButtonComponent(textBox, (answer, data) => {
    answerBox.setValueAnimated(answer, 100);
    character.startShaking();
    delay(answer.length * 1).then(() => {
      character.stopShaking();
    });
});
container.appendChild(sendButton.getElement());

// Question selector を controls にマウントし、選択時に textarea に反映
const questions = [
  "オフサイドとは何ですか？",
  "ギラヴァンツ北九州の一番有名なプレイヤーは誰ですか？",
  "スローインの正しい投げ方を教えてください。",
];

new QuestionSelectorComponent(questions, (value) => {
  textBox.setValue(value);
  const ta = textBox.getTextarea();
  if (ta) ta.focus();
}, '#controls');

