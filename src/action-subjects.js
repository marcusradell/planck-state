import { Subject } from 'rxjs'

export const makeActionSubjects = actionNames =>
  actionNames.reduce(
    (acc, name) => {
      const subject = new Subject()

      acc.actions[name] = data => subject.next(data)
      acc.actionStreams[name] = subject

      return acc
    },
    { actions: {}, actionStreams: {} }
  )
