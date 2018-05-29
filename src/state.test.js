import { Subject } from 'rxjs'
import { skip, take } from 'rxjs/operators'
import { makeStateStream } from './state'

test('makeStateStream', () => {
  const initialState = {
    value: 'foo',
  }

  const actionSubject = new Subject()

  const actionStreams = {
    setValue: actionSubject,
  }

  const updaters = {
    setValue: value => state => ({ ...state, value }),
  }

  const stateStream = makeStateStream({ initialState, actionStreams, updaters })

  const resultP = stateStream
    .pipe(
      skip(1),
      take(1)
    )
    .forEach(state => {
      expect(state).toEqual({ value: 'bar' })
    })

  actionSubject.next('bar')

  return resultP
})
