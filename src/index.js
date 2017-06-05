import React, { Component } from "react";

// @TODO: Import a local file that proxies rxjs so we can import a subset of the library.
import Rx from "rxjs";

const epicsToUpdaters = (epics, actionsProxy) => {
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
        .service()
        .then(
          result =>
            result.errors
              ? actionsProxy.actions[errorKey](result.errors)
              : actionsProxy.actions[successKey](result.data)
        );
      return epics[key].actionUpdater(eventData)(state);
    };
    return accumulator;
  }, {});

  return updaters;
};

export const ConnectedModel = props => ({
  initialState,
  updaters = {},
  epics = {}
}) => {
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
      // eslint-disable-next-line no-param-reassign
      accumulator.actionStreams[key] = actionSubject.map(data => data); // removes .next
      return accumulator;
    },
    { actions: {}, actionStreams: {} }
  );

  const { actions, actionStreams } = actionsAndActionStreams;
  actionsProxy.actions = actions;

  const updaterStreamsArray = Object.keys(actionStreams).map(key =>
    actionStreams[key].map(data => allUpdaters[key](data))
  );

  const stateStream = Rx.Observable
    .merge(...updaterStreamsArray)
    .startWith(initialState)
    .scan((state, updater) => updater(state))
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
        // @TODO: This should never happen, and should be removed when stable
        () => {
          console.log(
            "Completed called inside componentDidMount in the connectView function"
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

// @TODO: Separate view connector from model connector
export default props => model => PureViewFactory =>
  ConnectedView({ connectedModel: ConnectedModel(props)(model) })(
    PureViewFactory
  );
