import Rx from 'rxjs'

export const makeEpics = ({ actions, actionStreams, services }) =>
  Rx.Observable.merge(
    ...Object.entries(actionStreams)
      .filter(([actionStreamName]) => actionStreamName.endsWith('async'))
      .reduce((acc, [key, epicActionStream]) => {
        acc.push(
          epicActionStream
            .switchMap(data => services[key](data))
            .map(response => {
              const { success, body } = response
              const suffix = success ? 'succeeded' : 'failed'
              actions[`${key}${suffix}`](body)
              return response
            })
        )
        return acc
      }, [])
  )
