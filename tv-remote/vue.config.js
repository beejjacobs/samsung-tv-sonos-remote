module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  },
  devServer: {
    https: false,
    public: "http://192.168.0.158:8080"
  }
}
