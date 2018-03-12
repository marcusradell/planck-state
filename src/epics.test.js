import Rx from 'rxjs'
import { makeEpics } from './epics'

test('epicsStream', () => {
  const actions = {
    getDataAsyncSucceeded: () => null,
    getDataAsyncFailed: () => null,
  }

  const actionStreams = {
    getDataAsync: Rx.Observable.of(null),
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

  return epicsStream.take(1).forEach(data => {
    expect(data).toEqual({ succeeded: true, body: 'test value' })
  })
})
