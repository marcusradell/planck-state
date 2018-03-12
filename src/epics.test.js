import Rx from 'rxjs'
import { makeEpics } from './epics'

test('epicsStream', () => {
  const succeededActions = {
    getData: () => null,
  }

  const failedActions = {
    getData: () => null,
  }

  const epicActionStreams = {
    getData: Rx.Observable.of(null),
  }

  const services = {
    getData: () =>
      Rx.Observable.of({ succeeded: true, body: 'test value' }).take(1),
  }

  const epicsStream = makeEpics({
    succeededActions,
    failedActions,
    epicActionStreams,
    services,
  })

  return epicsStream.take(1).forEach(data => {
    expect(data).toEqual({ succeeded: true, body: 'test value' })
  })
})
