# planck-state
[![Build Status](https://travis-ci.org/LinasMatkasse/planck-state.svg?branch=master)](https://travis-ci.org/LinasMatkasse/planck-state)

## What's this?
A state-management system in javascript.

It's main features are:
* Builds on fundamentals from React and Redux.

* No lifting state upwards.

* Separation between view and model.

* Models and views are pure functions.

* Less boilerplate.

* Handles async events like http out of the box.

## Installation
`yarn add @linasmatkasse/planck-state`

## Usage example

```jsx
import React from "react";
import ReactDOM from "react-dom";
import PlanckStateComponent from "@linasmatkasse/planck-state";

const initialState = {
  value: ""
};

const setValue = value => state => Object.assign({}, state, { value });

const updaters = { setValue };

const model = { initialState, updaters };

const makeView = ({ props, actions }) => {
  const onChange = domEvent => {
    actions.setValue(domEvent.target.value);
  };

  return ({ state }) =>
    <div>
      <div>
        <input type="text" onChange={onChange} value={state.value} /> id:
        {props.id} value: {state.value}
      </div>
    </div>;
};

const props = {
  id: "d6f06daa-da16-4bd2-b59e-9f3b42af754c"
};

const component = PlanckStateComponent(props)(model)(makeView);

ReactDOM.render(<component.View />, document.querySelector("[data-app]"));
```

## API

### export default connect

`PlanckStateComponent = props => model => makeView => planckStateComponent`

* `props`: Constant/static object that is passed to the view. This is conceptually the same as React's `props`, but should never change during the component lifecycle. In that sense, it also works like React's `context`.

* `model`: an object that contains `initialState`, and optionally `updaters`, and `epics`.

* `initialState`: A data structure that contains the first state. This is then held in the `planckStateComponent.stateStream`, which React subscribes to.

* `updaters`: Syncronous updater/reducer functions. These change the state of the component. `planck-state` converts these updaters to action triggering functions (action creators) found via `planckStateComponent.actions[updaterName]`. You can also subscribe to an action stream via `planckStateComponent.actionStreams[updaterName]` for debugging purposes or combining some event with some state, like on form submits.

* `epics`: an object/record where each key will be the epic name, and the value will be another object with four keys: `service`, `actionUpdater`, `successUpdater`, and `errorUpdater`. Example:

```
const epics = {
  createTodo: {
    service,
    actionUpdater,
    successUpdater,
    errorUpdater
  }
}
```

`service` should return a promise. `actionUpdater` will trigger the `service`, and then change the state. if the `service`'s resolved result contains a truthy `errors` key, the `errorUpdater` function is called. Otherwise `successUpdater` is called.

The above would create `actions` and``actionStreams` named `createTodo`, `createTodoSuccess`, and `createTodoError`. Any single argument given to the `epics` `updater` function will be passed along to the services call.

* `makeView`: A factory function (higher-order function) that returns a React pure function view. The factory will recieve `props` and `actions`, and the inner React view function will get the current state as the only React prop. Everything else is handled outside of React to keep the view and model separated. The connected view is then accessed via `planckStateComponent.View`.

* `planckStateComponent`: an object with the shape `{props, actions, actionStreams, stateStream, View, PureView, and viewStateStream}`.

## Q&A
* Q: When is something uppercased?
* A: When the function creates a new object, and isn't explicitly named `makeFoo`, `createFoo`, or `fooFactory`. Note that React components are created via React.createElement, and thus aren't really factories. We've chosen to use uppercase `View` and `PureView` to follow React conventions even though they break our own conventions.

* Q: Why use taken terms like `props` and `component` when they are already used by React?
* A: Although this makes getting started harder, it also shows that the `planck-state` API works very similar to the internals of React. `planck-state` `props` is a bag of user defined properties given to a constructor, and never changed during the lifetime of the `planckStateComponent`. A `planck-state` `component` can be composed into a higher order component. The children define their own state and actions, which are open for extension, but closed for change. React does not provide state composition so far, only view composition. Note that the terms `prop` and `component` were never React specific.

* Q: Is this code usable?
* A: `planck-state` is being used internally at Linas Matkasse, but needs to evolve more before public 3rd party usage. Consider it to be in beta mode. With that said, we aim to follow proper semver versioning, where any breaking change will be a major update.

* Q: Is there any complete example application?
* A: There's a minimal usage example in the `examples/` folder. You can git clone the project and run the example from that folder with `yarn start`.

* Q: I see that there is some `connected-parent.js` code. What's that about?
* A: It's the first version for handling forms. The API is not ready yet, but it's also working internally at Linas Matkasse. The `examples/` code uses this feature to gather multiple input states into one form state.

* Q: RxJS is scary and complicated. Why not use Redux/MobX/Vanilla React?
* A: This library aims to keep the API small so people don't get stuck with RxJS operators. It is local-first like React, uses events to reduce new state as Redux, and observes changes like Mobx. Hopefully this is easy to use. That being said, it's early on, and as soon as you can't do something inside `planck-state`, you will need to solve it with RxJS, or bail out with `.subscribe()` or `.forEach().then()` and write imperative code (*that* is scary).
