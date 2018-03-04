import Rx from 'rxjs'
import { makeEpics } from './epics'

test('makeEpics', () => {
  const succeededActions = {
    getDataSucceeded: () => null,
  }

  const failedActions = {
    getDataFailed: () => null,
  }

  const epicActionStreams = {
    getData: Rx.Observable.of({ value: 'test value' }),
  }

  const services = {
    getData: () => null,
  }

  const epics = makeEpics(
    succeededActions,
    failedActions,
    epicActionStreams,
    services
  )

  expect(epics).toEqual(false)
})

// export const makeEpics = (
//   succeededActions,
//   failedActions,
//   epicActionStreams,
//   services
// ) =>
//   Object.entries(epicActionStreams).reduce(
//     (acc, [key, epicActionStream]) =>
//       epicActionStream.switchMap(data => services[key](data)).map(response => {
//         const { success, body } = response
//         const actions = success ? succeededActions : failedActions
//         actions[key](body)
//         return response
//       }),
//     {}
//   )
