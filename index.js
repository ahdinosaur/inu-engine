const { keys } = Object
const Store = require('inu')
const Watch = require('mutant/watch')


var watch = Store(function (state, action, { emit, watch }) {
  console.log('state is', state) // state while action is being emitted
  console.log('action is', action) // action being emitted
  console.log('emit is:', emit) // function to emit actions
  console.log('watch is:', watch) // object of functions to watch inu observables
})

function Store (update = identity) {

  const state = Value()
  const action = Value()
  const view = computed(([state, action]) => {
    nextState = update(state, action, store)
    if (nextState !== undefined) state.set(nextState)
  })

  const obs = { state, view, action }
  const watch = keys(obs).reduce((sofar, key) => {
    sofar[key] = Watcher(obs[key])
    return sofar
  }, {})

  const store = { emit, watch }

  return store

  function emit (action) {
    action.set(action)
  }
}

function Watcher (obs) {
  return listener => Watch(obs, listener)
}

function identity (value) {
  return value
}
