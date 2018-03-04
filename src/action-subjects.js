import Rx from 'rxjs'

export const makeActionSubjects = actionNames =>
  actionNames.reduce(
    (acc, name) => {
      const subject = new Rx.Subject()

      acc.actions[name] = data => subject.next(data)
      acc.actionStreams[name] = subject.map(a => a)

      return acc
    },
    { actions: {}, actionStreams: {} }
  )
