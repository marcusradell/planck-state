import Rx from 'rxjs'
import { makeStateStream } from './state'

test('makeStateStream', () => {
  const initialState = {
    value: 'foo',
  }

  const actionSubject = new Rx.Subject()

  const actionStreams = {
    setValue: actionSubject,
  }

  const updaters = {
    setValue: value => state => ({ ...state, value }),
  }

  const stateStream = makeStateStream({ initialState, actionStreams, updaters })

  const resultP = stateStream
    .skip(1)
    .take(1)
    .forEach(state => {
      expect(state).toEqual({ value: 'bar' })
    })

  actionSubject.next({ value: 'bar' })

  return resultP
})
