import Connected from "@linasmatkasse/planck-state";
import Model from "./model";
import makeViewBasic from "./views/basic";
import makeViewDebug from "./views/debug";

const makeModel = ({ services }) => {
  const { fetchService } = services;
  const model = Model({ fetchService });
  return Connected()(model);
};

export const BasicDataFetcher = context => makeModel(context)(makeViewBasic);
export const DebugDataFetcher = context => makeModel(context)(makeViewDebug);
