const LoadingScreenPlugin = require('loading-screen')
const colors = require('@poi/dev-utils/colors')

exports.name = 'loading-screen'

exports.apply = api => {
  if (!api.args.has('s') && !api.args.has('serve')) return
  /**
   * Prepare arguments for open browser
   */
  const { args, config } = api
  const { host, port } = config.devServer
  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'
  const prettyHost = isUnspecifiedHost ? 'localhost' : host

  /**
   * Make poi lose ability to open browser
   */
  delete config.devServer.open

  api.hook('createWebpackChain', config => {
    config.plugin('print-loading-screen-serve').use({
      apply(compiler) {
        compiler.hooks.afterPlugins.tap('print-loading-screen-serve', () => {
          console.log()
          console.log('You can now view your app in the browser:')
          console.log(
            `Local:             http://${prettyHost}:${colors.bold(port)}`
          )
          console.log()
        })
      }
    })
    /**
     * Override poi progress plugin
     */
    config.plugin('progress').init(
      (_, [handler]) =>
        new LoadingScreenPlugin({
          logo: 'https://i.loli.net/2018/09/12/5b98e77352c9d.png',
          handler,
          port,
          // Real • open browser
          callback() {
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
