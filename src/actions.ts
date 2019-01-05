import { Subject } from "rxjs";
import { ActionTriggers, ActionStreams } from "./types";

export function createActions(
  actionNames: string[]
): [ActionTriggers, ActionStreams] {
  return actionNames.reduce(
    (acc, name) => {
      const subject = new Subject();

      acc[0][name] = data => subject.next(data);
      acc[1][name] = subject;

      return acc;
    },
    [{}, {}] as [ActionTriggers, ActionStreams]
  );
}
