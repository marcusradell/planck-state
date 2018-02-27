import React, { Component } from 'react'
// @TODO: Import a local file that proxies rxjs so we can import a subset of the library.
import Rx from 'rxjs'

/**
 *
 * @param {Object} services a record/object of services where keys are the service names and values are the service functions.
 * @param {Object} actionsProxy contains a single key `actions` which is populated
 * after this function is run. This is a common circular dependency solution.
 * @returns {Object} updaters a record of updaters to convert to actions and actionStreams.
 */
export const servicesToUpdaters = (services, actionsProxy) =>
  Object.keys(services).reduce((acc, key) => {
    const successKey = `${key}Success`
    const errorKey = `${key}Error`
    // eslint-disable-next-line no-param-reassign
    acc[successKey] = success => state => ({
      ...state,
      ...success,
      loading: false,
    })
    // @TODO(MANI): Remove if new code works
    // accumulator[successKey] = epics[key].successUpdater;

    // eslint-disable-next-line no-param-reassign
    acc[errorKey] = errors => state => ({
      ...state,
      errors,
      loading: false,
    })
    // @TODO(MANI): Remove if new code works
    // accumulator[errorKey] = epics[key].errorUpdater;

    // eslint-disable-next-line no-param-reassign
    acc[key] = event => state => {
      services[key](event).then(
        result =>
          result.errors
            ? actionsProxy.actions[errorKey](result.errors)
            : actionsProxy.actions[successKey](result.data)
      )
      // @TODO: Could this happen after the Promise resolves?
      // Check that the loadingUpdater always happens first.
      return {
        ...state,
        loading: true,
        errors: null,
      }
      // @TODO(MANI): Remove if new code works
      // return epics[key].loadingUpdater(event)(state);
    }

    return acc
  }, {})

/**
 *
 * @param {Object} props props is currently just passed through to the ConnectedView.
 * @param {Object} model has initialState, updaters, and epics.
 * @returns {Object} connectedModel gives an object with props, stateStream, actionStreams, and actions.
 */
export const ConnectedModel = props => ({
  initialState,
  updaters,
  services,
}) => {
  // Epics need actions, and actions need epics.
  // We need a proxy to late bind actions and resolve the circular dependency.
  const actionsProxy = { actions: {} }
  const serviceUpdaters = servicesToUpdaters(services, actionsProxy)
  const allUpdaters = { ...updaters, ...serviceUpdaters }

  const actionsAndActionStreams = Object.keys(allUpdaters).reduce(
    (acc, key) => {
      const actionSubject = new Rx.Subject()
      // eslint-disable-next-line no-param-reassign
      acc.actions[key] = data => {
        actionSubject.next(data)
      }
      // map Subject into an Observable with a => a
      // eslint-disable-next-line no-param-reassign
      acc.actionStreams[key] = actionSubject.map(a => a)
      return acc
    },
    { actions: {}, actionStreams: {} }
  )

  const { actions, actionStreams } = actionsAndActionStreams
  // Actions are now created so service results can trigger them.
  actionsProxy.actions = actions

  // Transform object structure into an array.
  const updaterStreamsArray = Object.keys(actionStreams).map(key =>
    // Transform each actionStream's eventData into a state updater function.
    actionStreams[key].map(data => allUpdaters[key](data))
  )

  // stateStream is a standard Redux-like store implementation in reactive programming.
  const stateStream = Rx.Observable
    // All updaterStreams are merged into one single stream.
    .merge(...updaterStreamsArray)
    // Before any updaterStream triggers, emit the initialState first.
    .startWith({ ...initialState, loading: null, errors: null })
    // it's like reduce, but runs for each emitted item (reduce runs once on completion).
    // For each action: nextState = event + prevState. The updater adds the event data to the prevState.
    .scan((state, updater) => updater(state))
    // We hold the latest value, starting with initialState, so new subscribers get at least one state.
    .shareReplay(1)

  return { props, stateStream, actionStreams, actions }
}

export const ConnectedView = ({
  connectedModel,
  viewDataStream,
}) => PureViewFactory => {
  const { props } = connectedModel
  const { actions, stateStream: modelStateStream } = connectedModel
  const PureView = PureViewFactory({ props, actions })
  const viewStateStream = viewDataStream
    ? modelStateStream.combineLatest(viewDataStream, (self, viewState) => ({
        self,
        viewState,
      }))
    : modelStateStream

  class View extends Component {
    componentDidMount() {
      this.subscription = viewStateStream.subscribe(
        state => {
          this.setState(() => state)
        },
        console.error, // eslint-disable-line no-console,
        () => {
          console.log(
            'Observable::completed called inside componentDidMount in the connectView function. This should not happen since the state cannot update anymore.'
          )
        }
      )
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }

    render() {
      return this.state && React.createElement(PureView, { state: this.state })
    }
  }

  return Object.assign({}, connectedModel, {
    View,
    PureView,
    viewStateStream,
    props,
  })
}

/**
 * The Connected factory, and the core of this API.
 * You can partially apply the arguments to create a common model for multiple views.
 * @param {Object} props a constant property bag with user defined properties.
 * @param {Object} model a planck-state model.
 * @param {function} makeView a planck-state react view factory.
 * @returns {Object} a model and view connected together into a reactive planckStateComponent.
 */
export const makeComponent = props => model => makeView =>
  ConnectedView({ connectedModel: ConnectedModel(props)(model) })(makeView)
