import { makeComponent } from 'planck-state'

import makeViewBasic from './views/basic'
import makeViewDebug from './views/debug'

const makeModel = context => {
  const { services } = context
  const model = {
    services,
  }
  return makeComponent()(model)
}

export const BasicDataFetcher = context => makeModel(context)(makeViewBasic)
export const DebugDataFetcher = context => makeModel(context)(makeViewDebug)
