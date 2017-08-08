import { epicsToUpdaters } from "./index";
// NOTE: It's hard to test this code since the callbacks are executed
// inside a Promise, but Jest doesn't know about it.
// We can't use expect() inside promise callbacks,
// since they get swallowed by the promise.
// Next best thing is to call the done() callback to ensure the pipe works.
// Normally we have access to the Promise, but here we only have the Promise callback.

const Epics = () => {
  const service = isSuccess =>
    isSuccess
      ? Promise.resolve({ data: "success value" })
      : Promise.resolve({ errors: ["error!"] });

  const actionUpdater = () => state => state;

  const successUpdater = () => state => state;

  const errorUpdater = () => state => state;

  const epics = {
    foo: {
      service,
      actionUpdater,
      successUpdater,
      errorUpdater
    }
  };

  return epics;
};

test("epicsToUpdaters success", done => {
  const initialState = {};

  const actionsProxy = {
    actions: null
  };

  const updaters = epicsToUpdaters(Epics(), actionsProxy);

  actionsProxy.actions = {
    fooSuccess: () => {
      done();
    },
    fooError: () => null
  };

  updaters.foo(true)(initialState);
});

test("epicsToUpdaters error", done => {
  const initialState = {};

  const actionsProxy = {
    actions: null
  };

  const updaters = epicsToUpdaters(Epics(), actionsProxy);

  actionsProxy.actions = {
    fooSuccess: () => null,
    fooError: () => {
      done();
    }
  };

  updaters.foo(false)(initialState);
});
