import { ConnectedModel } from "../src";

test("initialState", () => {
  const initialState = {
    value: "initial"
  };
  const updaters = {};
  const epics = {};

  const connectedModel = ConnectedModel()({ initialState, updaters, epics });

  return connectedModel.stateStream.take(1).forEach(state => {
    expect(state).toEqual({ value: "initial" });
  });
});

test("actions", () => {
  const initialState = {
    value: "initial"
  };

  const updaters = {
    setValue: value => state => Object.assign({}, state, { value })
  };

  const epics = {};

  const connectedModel = ConnectedModel()({ initialState, updaters, epics });

  const expectationPromise = connectedModel.stateStream
    .skip(1)
    .take(1)
    .forEach(state => {
      expect(state).toEqual({ value: "new value" });
    });

  connectedModel.actions.setValue("new value");

  return expectationPromise;
});

test("epics", () => {
  const initialState = {
    value: "initial",
    loading: null
  };

  const updaters = {};

  let actionCallCount = 0;

  const epics = {
    loadValue: {
      actionUpdater: () => state => {
        actionCallCount += 1;
        return Object.assign({}, state, { loading: true });
      },
      successUpdater: value => state =>
        Object.assign({}, state, { loading: false, value }),
      errorUpdater: () => state => state,
      service: () => Promise.resolve({ data: "new promised value" })
    }
  };

  const connectedModel = ConnectedModel()({ initialState, updaters, epics });

  const expectationPromise1 = connectedModel.stateStream
    .skip(1)
    .take(1)
    .forEach(loadingState => {
      expect(loadingState).toEqual({
        value: "initial",
        loading: true
      });
    });
  const expectationPromise2 = connectedModel.stateStream
    .skip(2)
    .take(1)
    .forEach(state => {
      expect(actionCallCount).toBe(1);
      expect(state).toEqual({ value: "new promised value", loading: false });
    });

  connectedModel.actions.loadValue();

  return Promise.all([expectationPromise1, expectationPromise2]);
});
