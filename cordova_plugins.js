cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-awesome-shared-preferences.SharedPreferences",
      "file": "plugins/cordova-plugin-awesome-shared-preferences/www/index.js",
      "pluginId": "cordova-plugin-awesome-shared-preferences",
      "clobbers": [
        "window.plugins.SharedPreferences"
      ]
    },
    {
      "id": "cordova-plugin-httpd.CorHttpd",
      "file": "plugins/cordova-plugin-httpd/www/CorHttpd.js",
      "pluginId": "cordova-plugin-httpd",
      "clobbers": [
        "cordova.plugins.CorHttpd"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-awesome-shared-preferences": "0.1.0",
    "cordova-plugin-httpd": "0.9.3"
  };
});