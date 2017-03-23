const { keys, assign } = Object
const Value = require('mutant/value')
const Watch = require('mutant/watch')

module.exports = Engine

function Engine (options = {}) {
  const {
    state: initialState,
    action: initialAction,
    update: updateHandler = identity,
    view: viewHandler = noop
  } = options

  const obs = {
    state: Value(),
    action: Value()
  }
  const emit = obs.action.set

  const watch = keys(obs).reduce((sofar, key) => {
    sofar[key] = Watcher(obs[key])
    return sofar
  }, {})

  const end = obs.action(action => {
    const state = obs.state()
    const next = updateHandler(state, action, watch)
    if (isUndefined(next)) return
    else if (isObserv(next)) next(emit)
    else if (next !== state) obs.state.set(next)
  })

  if (!isUndefined(initialState)) obs.state.set(initialState)
  if (!isUndefined(initialAction)) obs.action.set(initialAction)

  const view = viewHandler(obs.state, emit)

  return assign({ emit, view, end }, watch)
}

function Watcher (obs) {
  return listener => Watch(obs, listener)
}

function isObserv (value) {
  return isFunction(value)
}

function isFunction (value) {
  return typeof value === 'function'
}
 
function isUndefined (value) {
  return typeof value === 'undefined'
}

function identity (value) {
  return value
}

function noop () {}
