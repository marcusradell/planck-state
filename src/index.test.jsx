import React from 'react'
import { makeComponent } from './index'

test('test', () => {
  const initialState = {}
  const updaters = {}
  const services = {
    doStuff: data => Promise.resolve(data),
  }

  const model = {
    initialState,
    updaters,
    services,
  }

  const makeView = ({ props, actions }) => (
    <button onClick={() => actions.doStuff()}>{props.id}</button>
  )

  const component = makeComponent({ id: '123-abc' })(model)(makeView)

  expect(Object.keys(component)).toEqual([
    'props',
    'stateStream',
    'actionStreams',
    'actions',
    'View',
    'PureView',
    'viewStateStream',
  ])
})
