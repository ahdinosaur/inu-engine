const html = require('yo-yo')
const pull = require('pull-stream')
const many = require('pull-many')

// engines as groupoid
module.exports = compose

function compose (engines, template = defaultTemplate) {
  return {

    init () {
      return composeStates(
        engines.map((engine) => engine.init())
      )
    },

    update (models, actions) {
      return composeStates(
        engines.map((engine, i) => {
          const m = models[i]
          const a = actions[i]
          return a ? engine.update(m, a) : { model: m }
        })
      )
    },

    view (models, dispatch) {
      const dispatchByengine = i =>
        action => dispatch(item(action, i))

      return template(
        engines.map((engine, i) => {
          const m = models[i]
          return engine.view(m, dispatchByengine(i))
        })
      )
    },

    run (effects, sources) {
      const nextActions = engines.map((engine, i) => {
        const eff = effects[i]
        return eff
          ? pull(
              engine.run(eff, {
                actions: () => pull(
                  sources.actions(),
                  pull.map(value => value[i]),
                  pull.filter(isNotNil)
                )
              }) || pull.empty(),
              pull.map(action => item(action, i))
            )
          : pull.empty()
      })
      return many(nextActions)
    }
  }
}

function composeStates (states) {
  console.log('compose state', states)
  return {
    model: states.map(s => s.model),
    effect: states.some(s => s.effect)
      ? states.map(s => s.effect) : null
  }
}

function defaultTemplate (views) {
  return html`
    <div>
    ${
      views.map((view, i) => html`
        <div class=${`engine-${i}`}>
          ${view}
        </div>`
      )
    }
    </div>
  `
}

function isNotNil (x) { return x != null }
function item (value, i) {
  var arr = []
  arr[i] = value
  return arr
}
