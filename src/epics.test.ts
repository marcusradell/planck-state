import { Subject, of } from "rxjs";
import { take } from "rxjs/operators";
import { createEpics } from "./epics";

test("epicsStream", () => {
  expect.assertions(2);

  const actions = {
    anotherAction: () => null,
    getDataAsyncSucceeded: jest.fn,
    getDataAsyncFailed: () => null
  };

  const getDataAsyncSubject = new Subject();

  const actionStreams = {
    getDataAsync: getDataAsyncSubject
  };

  const services = {
    getDataAsync: () =>
      Promise.resolve({ succeeded: true, payload: "test value" })
  };

  const epicsStream = createEpics(actions, actionStreams, services);

  const resultP = epicsStream.pipe(take(1)).forEach(data => {
    expect(actions.getDataAsyncSucceeded.length).toEqual(1);
    expect(data).toEqual({ succeeded: true, payload: "test value" });
  });

  getDataAsyncSubject.next();

  return resultP;
});
