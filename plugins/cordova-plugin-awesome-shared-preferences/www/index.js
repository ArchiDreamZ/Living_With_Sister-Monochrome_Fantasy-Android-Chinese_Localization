cordova.define("cordova-plugin-awesome-shared-preferences.SharedPreferences", function(require, exports, module) {
/** @module window.plugins.SharedPreferences */

var exec = require('cordova/exec')

var SERVICE = 'SharedPreferences'

var MISSING_KEY = /missing key/i

/**
 * Creates a `SharedPreferences` instance
 *
 * @constructor
 * @param {String} [name] The name of the preferences file
 */
function SharedPreferences(name) {
    this.name = name
}

/**
 * Retrieves a boolean value from the preferences.
 *
 * @function
 * @param {String} key The name of the preference to retrieve.
 * @param {Boolean} [defaultValue] The value to return if the key doesn't exist. If omitted,
 * `errorCallback` will be invoked if key is missing.
 * @param {Function} successCallback A callback which is called if the key exists.
 * Invoked with `(value)`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`.
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. No default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var successCallback = function(value) {
 *   // it won't be invoked
 * }
 * var errorCallback = function(err) {
 *   expect(err).toBeDefined()
 *   expect(err instanceof Error).toBe(true)
 *   expect(err.message).toMatch(/missing key/i)
 * }
 *
 * sharedPreferences.getBoolean(key, successCallback, errorCallback)
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. Default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var defaultValue = false
 * var successCallback = function(value) {
 *   expect(value).toBe(defaultValue)
 * }
 * var errorCallback = function(err) {
 *   // it won't be invoked
 * }
 *
 * sharedPreferences.getBoolean(key, defaultValue, successCallback, errorCallback)
 */
SharedPreferences.prototype.getBoolean = createGetter(isBoolean, identity, 'getBoolean')

/**
 * Sets a boolean value in the preferences.
 *
 * @function
 * @param {String} key The name of the preference to set.
 * @param {Boolean} value The new value for the preference.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.putBoolean = createSetter(isBoolean, 'putBoolean')

/**
 * Retrieves a number from the preferences.
 *
 * @function
 * @param {String} key The name of the preference to retrieve.
 * @param {Boolean} [defaultValue] The value to return if the key doesn't exist. If omitted,
 * `errorCallback` will be invoked if key is missing.
 * @param {Function} successCallback A callback which is called if the key exists.
 * Invoked with `(value)`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`.
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. No default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var successCallback = function(value) {
 *   // it won't be invoked
 * }
 * var errorCallback = function(err) {
 *   expect(err).toBeDefined()
 *   expect(err instanceof Error).toBe(true)
 *   expect(err.message).toMatch(/missing key/i)
 * }
 *
 * sharedPreferences.getNumber(key, successCallback, errorCallback)
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. Default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var defaultValue = false
 * var successCallback = function(value) {
 *   expect(value).toBe(defaultValue)
 * }
 * var errorCallback = function(err) {
 *   // it won't be invoked
 * }
 *
 * sharedPreferences.getNumber(key, defaultValue, successCallback, errorCallback)
 */
SharedPreferences.prototype.getNumber = createGetter(
    isNumber,
    function(value) {
        // https://issues.apache.org/jira/browse/CB-13842
        // Javascript numbers are mapped to native data type, double.
        // Android implementation of PluginResult doesn't handle double value:
        // we have to wrap it around JSONArray
        return isArray(value) ? value[0] : value
    },
    'getNumber'
)

/**
 * Sets a number in the preferences.
 *
 * @function
 * @param {String} key The name of the preference to set.
 * @param {Boolean} value The new value for the preference.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.putNumber = createSetter(isNumber, 'putNumber')

/**
 * Retrieves a string value from the preferences.
 *
 * @function
 * @param {String} key The name of the preference to retrieve.
 * @param {Boolean} [defaultValue] The value to return if the key doesn't exist. If omitted,
 * `errorCallback` will be invoked if key is missing.
 * @param {Function} successCallback A callback which is called if the key exists.
 * Invoked with `(value)`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`.
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. No default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var successCallback = function(value) {
 *   // it won't be invoked
 * }
 * var errorCallback = function(err) {
 *   expect(err).toBeDefined()
 *   expect(err instanceof Error).toBe(true)
 *   expect(err.message).toMatch(/missing key/i)
 * }
 *
 * sharedPreferences.getString(key, successCallback, errorCallback)
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. Default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var defaultValue = false
 * var successCallback = function(value) {
 *   expect(value).toBe(defaultValue)
 * }
 * var errorCallback = function(err) {
 *   // it won't be invoked
 * }
 *
 * sharedPreferences.getString(key, defaultValue, successCallback, errorCallback)
 */
SharedPreferences.prototype.getString = createGetter(isString, identity, 'getString')

/**
 * Sets a string in the preferences.
 *
 * @function
 * @param {String} key The name of the preference to set.
 * @param {Boolean} value The new value for the preference.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.putString = createSetter(isString, 'putString')

/**
 * Retrieves a value from the preferences using JSON parsing.
 *
 * @function
 * @param {String} key The name of the preference to retrieve.
 * @param [defaultValue] The value to return if the key doesn't exist. If omitted,
 * `errorCallback` will be invoked if key is missing.
 * @param {Function} successCallback A callback which is called if the key exists.
 * Invoked with `(value)`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`.
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. No default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var successCallback = function(value) {
 *   // it won't be invoked
 * }
 * var errorCallback = function(err) {
 *   expect(err).toBeDefined()
 *   expect(err instanceof Error).toBe(true)
 *   expect(err.message).toMatch(/missing key/i)
 * }
 *
 * sharedPreferences.get(key, successCallback, errorCallback)
 *
 * @example
 * // Retrieve the value for a key that doesn't exist. Default value provided.
 *
 * var key = 'missingKey' // the key doesn't exist
 * var defaultValue = false
 * var successCallback = function(value) {
 *   expect(value).toBe(defaultValue)
 * }
 * var errorCallback = function(err) {
 *   // it won't be invoked
 * }
 *
 * sharedPreferences.get(key, defaultValue, successCallback, errorCallback)
 */
SharedPreferences.prototype.get = function(key, aDefaultValue, aSuccessCallback, aErrorCallback) {
    var defaultValue
    var successCallback
    var errorCallback

    if (typeof aDefaultValue === 'function') {
        successCallback = aDefaultValue
        errorCallback = aSuccessCallback || noop
    } else {
        defaultValue = aDefaultValue
        successCallback = aSuccessCallback
        errorCallback = aErrorCallback || noop
    }

    if (!isFunction(successCallback)) {
        throw new TypeError("Missing or invalid argument, 'successCallback'. Function expected.")
    }

    if (!isFunction(errorCallback)) {
        throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
    }

    if (!isString(key)) {
        errorCallback(new TypeError("Missing or invalid argument, 'key'. String expected."))
        return
    }

    var hasDefaultValue = !isUndefined(defaultValue)

    var onSuccess = function(aValue) {
        var value
        try {
            value = JSON.parse(aValue)
        } catch (err) {
            errorCallback(err)
            return
        }
        successCallback(value)
    }
    var onError = function(errMessage) {
        if (MISSING_KEY.test(errMessage) && hasDefaultValue) {
            successCallback(defaultValue)
            return
        }
        errorCallback(toError(errMessage))
    }

    exec(onSuccess, onError, SERVICE, 'getString', [this.name, key])
}

/**
 * Sets a value in the preferences using JSON serialization.
 *
 * @function
 * @param {String} key The name of the preference to set.
 * @param value The new value for the preference.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.put = function(key, aValue, aSuccessCallback, aErrorCallback) {
    var successCallback = aSuccessCallback || noop
    var errorCallback = aErrorCallback || noop

    if (!isFunction(successCallback)) {
        throw new TypeError("Missing or invalid argument, 'successCallback'. Function expected.")
    }

    if (!isFunction(errorCallback)) {
        throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
    }

    if (!isString(key)) {
        errorCallback(new TypeError("Missing or invalid argument, 'key'. String expected."))
        return
    }

    var value
    try {
        value = JSON.stringify(aValue)
    } catch (err) {
        errorCallback(err)
        return
    }

    var onSuccess = function() {
        successCallback()
    }
    var onError = function(errMessage) {
        errorCallback(toError(errMessage))
    }
    exec(onSuccess, onError, SERVICE, 'putString', [this.name, key, value])
}

/**
 * Removes a value from the preferences.
 *
 * @param {String} key The name of the preference to remove.
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.del = function(key, aSuccessCallback, aErrorCallback) {
    var successCallback = aSuccessCallback || noop
    var errorCallback = aErrorCallback || noop

    if (!isFunction(successCallback)) {
        throw new TypeError("Missing or invalid argument, 'successCallback'. Function expected.")
    }

    if (!isFunction(errorCallback)) {
        throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
    }

    if (!isString(key)) {
        errorCallback(new TypeError("Missing or invalid argument, 'key'. String expected."))
        return
    }

    var onSuccess = function() {
        successCallback()
    }
    var onError = function(errMessage) {
        errorCallback(toError(errMessage))
    }
    exec(onSuccess, onError, SERVICE, 'del', [this.name, key])
}

/**
 * Checks whether the preferences contains a preference.
 *
 * @param {String} key The name of the preference to check.
 * @param {Function} successCallback A callback which is called if the operation is completed
 * successfully. Invoked with `(result)`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.has = function(key, successCallback, aErrorCallback) {
    var errorCallback = aErrorCallback || noop

    if (!isFunction(successCallback)) {
        throw new TypeError("Missing or invalid argument, 'successCallback'. Function expected.")
    }

    if (!isFunction(errorCallback)) {
        throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
    }

    if (!isString(key)) {
        errorCallback(new TypeError("Missing or invalid argument, 'key'. String expected."))
        return
    }

    var onError = function(errMessage) {
        errorCallback(toError(errMessage))
    }
    exec(successCallback, onError, SERVICE, 'has', [this.name, key])
}

/**
 * Retrieves all keys from the preferences.
 *
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `(keys)`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.keys = function(successCallback, aErrorCallback) {
    var errorCallback = aErrorCallback || noop

    if (!isFunction(successCallback)) {
        throw new TypeError("Missing or invalid argument, 'successCallback'. Function expected.")
    }

    if (!isFunction(errorCallback)) {
        throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
    }

    var onError = function(errMessage) {
        errorCallback(toError(errMessage))
    }
    exec(successCallback, onError, SERVICE, 'keys', [this.name])
}

/**
 * Removes all values from the preferences.
 *
 * @param {Function} [successCallback] A callback which is called if the operation is completed
 * successfully. Invoked with `()`.
 * @param {Function} [errorCallback] A callback which is called if an error occurs.
 * Invoked with `(err)`.
 */
SharedPreferences.prototype.clear = function(successCallback, aErrorCallback) {
    var errorCallback = aErrorCallback || noop

    if (!isFunction(successCallback)) {
        throw new TypeError("Missing or invalid argument, 'successCallback'. Function expected.")
    }

    if (!isFunction(errorCallback)) {
        throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
    }

    var onError = function(errMessage) {
        errorCallback(toError(errMessage))
    }
    exec(successCallback, onError, SERVICE, 'clear', [this.name])
}

var registry = {}

/**
 * Returns a SharedPreferences instance
 *
 * @param {String} [name] The name of the preferences file.
 * @returns {SharedPreferences}
 */
exports.getInstance = function(aName) {
    var name = aName || ''
    if (!isString(name)) {
        throw new TypeError("Invalid argument, 'name'. String expected.")
    }

    if (!registry[name]) {
        registry[name] = new SharedPreferences(name)
    }

    return registry[name]
}

function createGetter(validator, accessor, action) {
    return function(key, aDefaultValue, aSuccessCallback, aErrorCallback) {
        var defaultValue
        var successCallback
        var errorCallback

        if (typeof aDefaultValue === 'function') {
            successCallback = aDefaultValue
            errorCallback = aSuccessCallback || noop
        } else {
            defaultValue = aDefaultValue
            successCallback = aSuccessCallback
            errorCallback = aErrorCallback || noop
        }

        if (!isFunction(successCallback)) {
            throw new TypeError(
                "Missing or invalid argument, 'successCallback'. Function expected."
            )
        }

        if (!isFunction(errorCallback)) {
            throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
        }

        if (!isString(key)) {
            errorCallback(new TypeError("Missing or invalid argument, 'key'. String expected."))
            return
        }

        var hasDefaultValue = !isUndefined(defaultValue)

        if (hasDefaultValue) {
            if (!validator(defaultValue)) {
                errorCallback(new TypeError("Invalid argument, 'defaultValue'."))
                return
            }
        }

        var onSuccess = function(value) {
            successCallback(accessor(value))
        }
        var onError = function(errMessage) {
            if (MISSING_KEY.test(errMessage) && hasDefaultValue) {
                successCallback(defaultValue)
                return
            }
            errorCallback(toError(errMessage))
        }

        exec(onSuccess, onError, SERVICE, action, [this.name, key])
    }
}

function createSetter(validator, action) {
    return function(key, value, aSuccessCallback, aErrorCallback) {
        var successCallback = aSuccessCallback || noop
        var errorCallback = aErrorCallback || noop

        if (!isFunction(successCallback)) {
            throw new TypeError(
                "Missing or invalid argument, 'successCallback'. Function expected."
            )
        }

        if (!isFunction(errorCallback)) {
            throw new TypeError("Invalid argument, 'errorCallback'. Function expected.")
        }

        if (!isString(key)) {
            errorCallback(new TypeError("Missing or invalid argument, 'key'. String expected."))
            return
        }

        if (!validator(value)) {
            errorCallback(new TypeError("Invalid argument, 'value'."))
            return
        }

        var onSuccess = function() {
            successCallback()
        }
        var onError = function(errMessage) {
            errorCallback(toError(errMessage))
        }
        exec(onSuccess, onError, SERVICE, action, [this.name, key, value])
    }
}

function isArray(value) {
    return /^\[object Array\]$/.test(Object.prototype.toString.call(value))
}

function identity(value) {
    return value
}

function isBoolean(value) {
    return typeof value === 'boolean'
}

function isFunction(value) {
    return typeof value === 'function'
}

function isNumber(value) {
    return typeof value === 'number'
}

function isString(value) {
    return typeof value === 'string'
}

function isUndefined(value) {
    return typeof value === 'undefined'
}

function noop() {}

function toError(errMessage) {
    return new Error(errMessage)
}

});
