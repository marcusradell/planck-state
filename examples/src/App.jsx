import React from 'react'
import * as DataFetcher from './data-fetcher'

export default ({ services }) => {
  const basicDataFetcher = DataFetcher.BasicDataFetcher({ services })
  const debugDataFetcher = DataFetcher.DebugDataFetcher({ services })

  const View = () => (
    <div style={{ margin: '30px' }}>
      <h1>planck-state examples</h1>
      <div>
        <div style={{ marginTop: '50px' }}>
          npm:
          <a href="https://www.npmjs.com/package/planck-state">planck-state</a>
        </div>
      </div>
      <div style={{ paddingTop: '100px' }}>
        <h2>Epics and multi-view example</h2>
        <p>
          You only define fetch services (Promises) and state updaters.
          Planck-state makes it work.
        </p>
        <p>
          Write your component state once, and the team can extend it with
          multiple views.
        </p>
        <h3>Basic data fetcher view</h3>
        <basicDataFetcher.View />
        <h3>Debug data fetcher view</h3>
        <debugDataFetcher.View />
      </div>
    </div>
  )

  return View
}
