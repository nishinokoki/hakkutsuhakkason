import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    </a>
    <h1>H</h1>
    <div>
      <button></button>
    </div>
    <p>
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
