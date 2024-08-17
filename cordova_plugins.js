cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-awesome-shared-preferences.SharedPreferences",
    "file": "plugins/cordova-plugin-awesome-shared-preferences/www/index.js",
    "pluginId": "cordova-plugin-awesome-shared-preferences",
    "clobbers": [
      "window.plugins.SharedPreferences"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-awesome-shared-preferences": "0.1.0"
};
// BOTTOM OF METADATA
});