import { makeActionSubjects } from './action-subjects'

test('makeActionSubjects', () => {
  const actionSubjectNames = ['setValue', 'resetValue']
  const { actions, actionStreams } = makeActionSubjects(actionSubjectNames)

  expect(Object.keys(actions)).toEqual(actionSubjectNames)
  expect(Object.keys(actionStreams)).toEqual(actionSubjectNames)
})

test('action triggers actionStream', () => {
  const actionSubjectNames = ['setValue', 'resetValue']
  const { actions, actionStreams } = makeActionSubjects(actionSubjectNames)

  const resultP = actionStreams.setValue
    .take(1)
    .forEach(val => expect(val).toEqual('test value'))

  actions.setValue('test value')

  return resultP
})
