import { createActions } from "./actions";

export function createEpicActions(actionNames: string[]) {
  const actions = createActions(actionNames);
  const succeeded = createActions(actionNames);
  const failed = createActions(actionNames);
  return {
    actions,
    succeeded,
    failed
  };
}
