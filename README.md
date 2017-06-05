# planck-state
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## What's this?
A state-management system in javascript.

You can create model-components with their state and behavior, where reusing is as simple as creating another instance.

You can connect the model-component to a pure view function factory, and get a stateful React view back.

## Installation
@TODO: install via npm/yarn.

Currently, you should be able to install it via the github URL.

## Usage example
@TODO:

```jsx
import * as planckState from 'planck-state'

// Any constant property. Usually used for labels, IDs, and such.
const props = {id}

const initialState = {
  value: ''
}

const setValue = value => state => Object.assign({}, state, {value})

const updaters = {setValue}

const model = {initialState, updaters}

const View = ({props, actions}) => {
  const onChange = (domEvent) => {actions.setValue(domEvent.target.value)}

  return ({state}) => (
    <div>
    <div>
      <code>id: {props.id}</code>
      <strong>value: {state.value}</strong>
    </div>
    <div>
      <input type="text" onChange={onChange} value={state.value}/>
    </div>  
    </div>
  )
}

const component = planckState.Connect(props)(model)(View)
const ComponentView = component.view

ReactDOM.render(<ComponentView />, document.querySelector('[data-app]'))
```