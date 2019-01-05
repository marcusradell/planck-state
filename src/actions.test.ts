import { take } from "rxjs/operators";
import { createActions } from "./actions";

test("createActions", () => {
  const actionSubjectNames = ["setValue", "resetValue"];
  const [actionTriggers, actionStreams] = createActions(actionSubjectNames);

  const resultP = actionStreams.setValue
    .pipe(take(1))
    .forEach(val => expect(val).toEqual("test value"));

  actionTriggers.setValue("test value");

  return resultP;
});
