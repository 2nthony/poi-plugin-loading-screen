const LoadingScreenPlugin = require('loading-screen')
const colors = require('@poi/dev-utils/colors')
const ip = require('address').ip()

exports.name = 'loading-screen'

exports.when = api => api.args.has('s') || api.args.has('serve')

exports.apply = api => {
  /**
   * Disable poi open browser behavior
   */
  const {
    args,
    config: { devServer }
  } = api
  const { host, port } = devServer
  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'
  const prettyHost = isUnspecifiedHost ? 'localhost' : host
  delete devServer.open

  console.log()
  console.log('You can now view your app in the browser:')
  console.log(`Local:             http://${prettyHost}:${colors.bold(port)}`)
  console.log(`On Your Network:   http://${ip}:${colors.bold(port)}`)
  console.log()

  /**
   * Override poi progress plugin
   */
  api.hook('createWebpackChain', config => {
    config.plugin('progress').init(
      (_, [handler]) =>
        new LoadingScreenPlugin({
          logo:
            'https://camo.githubusercontent.com/5ae09d1630be8e50dd69a50d9d45b326a0cb41ab/68747470733a2f2f692e6c6f6c692e6e65742f323031382f30392f31322f356239386537373335326339642e706e67',
          handler,
          serverCallback() {
            // Real • open browser
            if (args.has('o') || args.has('open')) {
              require('@poi/dev-utils/openBrowser')(
                `http://${prettyHost}:${port}`
              )
            }
          }
        })
    )
  })
}
