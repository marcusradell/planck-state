import Rx from 'rxjs'

export const makeStateStream = (initialState, actionStreams, updaters) => {
  const updaterStreamsArr = Object.entries(actionStreams).reduce(
    (acc, [key, actionStream]) => {
      acc.push(actionStream.map(updaters[key]))
      return acc
    },
    []
  )

  return Rx.Observable.merge(...updaterStreamsArr)
    .startWith({ ...initialState, loading: null, error: null, service: null })
    .scan((state, updater) => updater(state))
    .shareReplay(1)
}
