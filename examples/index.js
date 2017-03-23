global.setImmediate = require('set-immediate-shim')  

const Engine = require('../')
//const pull = require('pull-stream')

//const compose = require('./compose')

const main = document.querySelector('.main')

const apps = [
//  require('./title'),
//  require('./counter'),
//  require('./routing'),
  require('./clock')
]

//const app = compose(apps)

const engine = Engine(apps[0])

document.body.appendChild(engine.view)
