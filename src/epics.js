import Rx from 'rxjs'

export const makeEpics = ({
  succeededActions,
  failedActions,
  epicActionStreams,
  services,
}) =>
  Rx.Observable.merge(
    ...Object.entries(epicActionStreams).reduce(
      (acc, [key, epicActionStream]) => {
        acc.push(
          epicActionStream
            .switchMap(data => services[key](data))
            .map(response => {
              const { success, body } = response
              const resultActions = success ? succeededActions : failedActions
              resultActions[key](body)
              return response
            })
        )
        return acc
      },
      []
    )
  )
