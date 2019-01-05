import { Observable } from "rxjs";

export type ActionStream = { [k: string]: Observable<any> };

export type ActionTriggers = {
  [k: string]: (value: any) => void;
};

export type ActionStreams = {
  [k: string]: Observable<any>;
};

export type EpicServices = {
  [k: string]: (value: any) => Promise<{ succeeded: boolean; payload: any }>;
};

export type Updater = <T>(state: T) => T;

export type Reducer = (event: any) => Updater;

export type Reducers = {
  [k: string]: Reducer;
};
