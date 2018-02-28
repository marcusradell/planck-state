/* globals document */

import React from 'react'
import ReactDOM from 'react-dom'
import { Data, Errors } from './data'
import ApplicationView from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

const fetch = () =>
  new Promise(resolve => {
    setTimeout(() => {
      // eslint-disable-next-line no-unused-expressions
      Math.random() > 0.5
        ? resolve({ data: { items: Data(10) } })
        : resolve({ errors: Errors(5) })
    }, 1000)
  })

const services = {
  fetch,
}

const View = ApplicationView({ services })

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<View />, document.getElementById('root'))
registerServiceWorker()
