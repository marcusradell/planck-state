import { merge, Observable } from "rxjs";
import { map, startWith, scan, shareReplay } from "rxjs/operators";
import { ActionStream, Reducers, Updater } from "./types";

export function createState<S>(
  initialState: S,
  actionStreams: ActionStream,
  reducers: Reducers
) {
  const updaterStreams = Object.entries(actionStreams).reduce(
    (acc, [key, actionStream]) => {
      acc.push(actionStream.pipe(map(reducers[key])));
      return acc;
    },
    [] as Observable<Updater>[]
  );

  return merge(...updaterStreams).pipe(
    // Needed to get the scan to emit once.
    startWith(s => s),
    scan<Updater, S>((state, updater) => updater(state), initialState),
    shareReplay(1)
  );
}
