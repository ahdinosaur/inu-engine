const start = require('../')
const html = require('yo-yo')
const pull = require('pull-stream')

const compose = require('./compose')

const main = document.querySelector('.main')

const engines = [
  require('./title'),
  require('./counter'),
  require('./routing'),
  require('./clock')
]

const engine = compose(engines)

const sources = start(engine)

pull(
  sources.views(),
  pull.drain(function (view) {
    html.update(main, view)
  })
)
