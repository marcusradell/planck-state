import { makeEpicActionSubjects } from './epic-action-subjects'

test('makeEpicActionSubjects', () => {
  const actionSubjectNames = ['setValue', 'resetValue']
  const {
    actions,
    actionStreams,
    succeededActions,
    succeededActionStreams,
    failedActions,
    failedActionStreams,
  } = makeEpicActionSubjects(actionSubjectNames)

  expect(Object.keys(actions)).toEqual(actionSubjectNames)
  expect(Object.keys(actionStreams)).toEqual(actionSubjectNames)
  expect(Object.keys(succeededActions)).toEqual(actionSubjectNames)
  expect(Object.keys(succeededActionStreams)).toEqual(actionSubjectNames)
  expect(Object.keys(failedActions)).toEqual(actionSubjectNames)
  expect(Object.keys(failedActionStreams)).toEqual(actionSubjectNames)
})
