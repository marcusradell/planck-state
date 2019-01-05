import { merge, Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { ActionTriggers, ActionStreams, EpicServices } from "./types";

export function createEpics(
  actionTriggers: ActionTriggers,
  actionStreams: ActionStreams,
  epicServices: EpicServices
): Observable<any> {
  return merge(
    ...Object.entries(actionStreams)
      .filter(([actionStreamName]) => actionStreamName.endsWith("Async"))
      .reduce(
        (acc, [key, epicActionStream]) => {
          acc.push(
            epicActionStream.pipe(
              switchMap(data => epicServices[key](data)),
              map(response => {
                const suffix = response.succeeded ? "Succeeded" : "Failed";
                actionTriggers[`${key}${suffix}`](response.payload);
                return response;
              })
            )
          );
          return acc;
        },
        [] as Observable<any>[]
      )
  );
}
