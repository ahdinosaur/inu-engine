const Value = require('mutant/value')

module.exports = function Batch (actions = []) { 
  var actionObs = Value()

  // onListen?
  process.nextTick(() => {
    actions.forEach(actionObs.set)
  })

  return actionObs
}
