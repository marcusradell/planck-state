import Rx from 'rxjs'

export const makeStateStream = ({ initialState, actionStreams, updaters }) => {
  const updaterStreamsArr = Object.entries(actionStreams).reduce(
    (acc, [key, actionStream]) => {
      acc.push(actionStream.map(updaters[key]).do(console.log))
      return acc
    },
    []
  )

  return Rx.Observable.merge(...updaterStreamsArr)
    .startWith({ ...initialState })
    .scan((state, updater) => updater(state))
    .shareReplay(1)
}
