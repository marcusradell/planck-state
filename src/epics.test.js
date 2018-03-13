import Rx from 'rxjs'
import { makeEpics } from './epics'

test('epicsStream', () => {
  expect.assertions(2)

  const actions = {
    anotherAction: () => null,
    getDataAsyncSucceeded: jest.fn,
    getDataAsyncFailed: () => null,
  }

  const getDataAsyncSubject = new Rx.Subject()

  const actionStreams = {
    getDataAsync: getDataAsyncSubject,
  }

  const services = {
    getDataAsync: () =>
      Rx.Observable.of({ succeeded: true, body: 'test value' }).take(1),
  }

  const epicsStream = makeEpics({
    actions,
    actionStreams,
    services,
  })

  const resultP = epicsStream.take(1).forEach(data => {
    expect(actions.getDataAsyncSucceeded.length).toEqual(1)
    expect(data).toEqual({ succeeded: true, body: 'test value' })
  })

  getDataAsyncSubject.next()

  return resultP
})
