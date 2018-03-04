export const makeEpics = (
  succeededActions,
  failedActions,
  epicActionStreams,
  services
) =>
  Object.entries(epicActionStreams).reduce(
    (acc, [key, epicActionStream]) =>
      epicActionStream.switchMap(data => services[key](data)).map(response => {
        const { success, body } = response
        const actions = success ? succeededActions : failedActions
        actions[key](body)
        return response
      }),
    {}
  )
