import { merge } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

export const makeEpics = ({ actions, actionStreams, services }) =>
  merge(
    ...Object.entries(actionStreams)
      .filter(([actionStreamName]) => actionStreamName.endsWith('Async'))
      .reduce((acc, [key, epicActionStream]) => {
        acc.push(
          epicActionStream.pipe(
            switchMap(data => services[key](data)),
            map(response => {
              const { success, body } = response
              const suffix = success ? 'Succeeded' : 'Failed'
              actions[`${key}${suffix}`](body)
              return response
            })
          )
        )
        return acc
      }, [])
  )
