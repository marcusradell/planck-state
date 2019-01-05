import { Subject } from "rxjs";
import { skip, take } from "rxjs/operators";
import { createState } from "./state";

test("createState", () => {
  type State = {
    value: string;
  };

  const initialState: State = {
    value: "foo"
  };

  const actionSubject = new Subject();

  const actionStreams = {
    setValue: actionSubject
  };

  const reducers = {
    setValue: value => state => ({ ...state, value })
  };

  const stateStream = createState<State>(initialState, actionStreams, reducers);

  const resultP = stateStream
    .pipe(
      skip(1),
      take(1)
    )
    .forEach(state => {
      expect(state).toEqual({ value: "bar" });
    });

  actionSubject.next("bar");

  return resultP;
});
