import React, { Component } from "react";
// @TODO: Import a local file that proxies rxjs so we can import a subset of the library.
import Rx from "rxjs";

export { default as ConnectedParent } from "./connected-parent";

/**
 *
 * @param {Object} epics a record of epics where each epic is a record with
 * a service, updater, success, and error key.
 * @param {Object} actionsProxy contains a single key `actions` which is populated
 * after this function is run. This is a common circular dependency solution.
 * @returns {Object} updaters a record of updaters to convert to actions and actionStreams.
 */
export const epicsToUpdaters = (epics, actionsProxy) => {
  const updaters = Object.keys(epics).reduce((accumulator, key) => {
    const successKey = `${key}Success`;
    const errorKey = `${key}Error`;
    // eslint-disable-next-line no-param-reassign
    accumulator[successKey] = epics[key].successUpdater;
    // eslint-disable-next-line no-param-reassign
    accumulator[errorKey] = epics[key].errorUpdater;
    // eslint-disable-next-line no-param-reassign
    accumulator[key] = eventData => state => {
      epics[key]
        .service(eventData)
        .then(
          result =>
            result.errors
              ? actionsProxy.actions[errorKey](result.errors)
              : actionsProxy.actions[successKey](result.data)
        );
      // @TODO: Could this happen after the Promise resolves?
      // Guarantee that the actionUpdater always happens first!
      return epics[key].actionUpdater(eventData)(state);
    };
    return accumulator;
  }, {});

  return updaters;
};

/**
 *
 * @param {Object} props props is currently just passed through to the ConnectedView.
 * @param {Object} model has initialState, updaters, and epics.
 * @returns {Object} connectedModel gives an object with props, stateStream, actionStreams, and actions.
 */
export const ConnectedModel = props => ({
  initialState,
  updaters = {},
  epics = {}
}) => {
  // Epics need actions, and actions need epics.
  // We need a proxy to late bind actions and resolve the circular dependency.
  const actionsProxy = { actions: {} };
  const epicUpdaters = epicsToUpdaters(epics, actionsProxy);
  const allUpdaters = Object.assign({}, updaters, epicUpdaters);

  const actionsAndActionStreams = Object.keys(allUpdaters).reduce(
    (accumulator, key) => {
      const actionSubject = new Rx.Subject();
      // eslint-disable-next-line no-param-reassign
      accumulator.actions[key] = data => {
        actionSubject.next(data);
      };
      // map Subject into an Observable with a => a
      // eslint-disable-next-line no-param-reassign
      accumulator.actionStreams[key] = actionSubject.map(a => a);
      return accumulator;
    },
    { actions: {}, actionStreams: {} }
  );

  const { actions, actionStreams } = actionsAndActionStreams;
  // Actions are now created.
  // Epics can call created success and error actions via actionsProxy.
  actionsProxy.actions = actions;

  // Transform object structure into an array.
  const updaterStreamsArray = Object.keys(actionStreams).map(key =>
    // Transform each actionStream's eventData into a state updater function.
    actionStreams[key].map(data => allUpdaters[key](data))
  );

  // stateStream is a standard Redux-like store implementation in reactive programming.
  const stateStream = Rx.Observable
    // All updaterStreams are merged into one single stream.
    .merge(...updaterStreamsArray)
    // Before any updaterStream triggers, emit the initialState first.
    .startWith(initialState)
    // it's like reduce, but runs for each emitted item (reduce runs once on completion).
    // For each action: nextState = event + prevState. The updater adds the event data to the prevState.
    .scan((state, updater) => updater(state))
    // We hold the latest value, starting with initialState, so new subscribers get at least one state.
    .shareReplay(1);

  return { props, stateStream, actionStreams, actions };
};

export const ConnectedView = ({
  connectedModel,
  viewDataStream
}) => PureViewFactory => {
  const props = connectedModel.props;
  const { actions, stateStream: modelStateStream } = connectedModel;
  const PureView = PureViewFactory({ props, actions });
  const viewStateStream = viewDataStream
    ? modelStateStream.combineLatest(viewDataStream, (self, viewState) => {
        return {
          self,
          viewState
        };
      })
    : modelStateStream;

  class View extends Component {
    componentDidMount() {
      this.subscription = viewStateStream.subscribe(
        state => {
          this.setState(() => state);
        },
        console.error, // eslint-disable-line no-console,
        () => {
          console.log(
            "Observable::completed called inside componentDidMount in the connectView function. This should not happen since the state cannot update anymore."
          );
        }
      );
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return this.state && React.createElement(PureView, { state: this.state });
    }
  }

  return Object.assign({}, connectedModel, {
    View,
    PureView,
    viewStateStream,
    props
  });
};

/**
 * The Connected factory, and the core of this API.
 * You can partially apply the arguments to create a common model for multiple views.
 * @param {Object} props a constant property bag with user defined properties.
 * @param {Object} model a planck-state model.
 * @param {function} makeView a planck-state react view factory.
 * @returns {Object} a model and view connected together into a reactive planckStateComponent.
 */
export default props => model => makeView =>
  ConnectedView({ connectedModel: ConnectedModel(props)(model) })(makeView);
