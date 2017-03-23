const h = require('mutant/h')
const Value = require('mutant/value')

const Batch = require('../batch')

// clock demo
module.exports = {
  state: 0,
  action: 'SCHEDULE_TICK',
  update: (state, action, watch) => {
    console.log('state is', state) // state while action is being emitted
    console.log('action is', action) // action being emitted
    console.log('watch is:', watch) // object of functions to watch inu observables

    switch (action) {
      case 'TICK':
        return Batch([
          'INCREMENT_TICK',
          'SCHEDULE_TICK'
        ])
      case 'INCREMENT_TICK':
        return state === 59 ? 0 : state + 1
      case 'SCHEDULE_TICK':
        return Delay('TICK', 1000)
    }
  },
  view: (state, emit) => {
    console.log('state', state) // state observable
    console.log('emit', emit) // function to emit actions

    return h('div', [
      'Seconds Elapsed ',
      state
    ])
  }
}

function Delay (value, timeout) {
  const obs = Value()
  setTimeout(() => {
    obs.set(value)
  }, timeout)
  return obs
}
