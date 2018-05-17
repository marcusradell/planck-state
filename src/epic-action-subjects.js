import { makeActionSubjects } from './action-subjects'

export const makeEpicActionSubjects = actionNames => {
  const { actions, actionStreams } = makeActionSubjects(actionNames)
  const {
    actions: succeededActions,
    actionStreams: succeededActionStreams,
  } = makeActionSubjects(actionNames)
  const {
    actions: failedActions,
    actionStreams: failedActionStreams,
  } = makeActionSubjects(actionNames)

  return {
    actions,
    actionStreams,
    succeededActions,
    succeededActionStreams,
    failedActions,
    failedActionStreams,
  }
}
