/* globals document */

import React from 'react'
import ReactDOM from 'react-dom'
import { makeData, makeError } from './data'
import ApplicationView from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

const fetch = () =>
  new Promise(resolve => {
    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      Math.random() > 0.5
        ? resolve({ success: true, body: { items: makeData(10) } })
        : resolve({ success: false, body: makeError() })
    }, 1000)
  })

const services = {
  fetch,
}

const View = ApplicationView({ services })

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<View />, document.getElementById('root'))
registerServiceWorker()
