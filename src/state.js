import { merge } from 'rxjs'
import { map, startWith, scan, shareReplay } from 'rxjs/operators'

export const makeStateStream = ({ initialState, actionStreams, updaters }) => {
  const updaterStreamsArr = Object.entries(actionStreams).reduce(
    (acc, [key, actionStream]) => {
      acc.push(actionStream.pipe(map(updaters[key])))
      return acc
    },
    []
  )

  return merge(...updaterStreamsArr).pipe(
    startWith({ ...initialState }),
    scan((state, updater) => updater(state)),
    shareReplay(1)
  )
}
