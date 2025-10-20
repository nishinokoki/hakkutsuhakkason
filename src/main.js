import './style.css'
import { setupCounter } from './counter.js'
import { TextBoxComponent } from './TextBoxComponent.js';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>H</h1>
    <div id="text-box-container">
    </div>
    <div>
      <button></button>
    </div>
    <p>
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

const textBox = new TextBoxComponent();
document.querySelector('#text-box-container').appendChild(textBox.getElement());