window.env = require 'env'
window.utils = require 'utils'
window.constants = require 'constants'
window.app = require 'application'

_.mixin _.string.exports()

# Set up messenger defaults
$._messengerDefaults =
    extraClasses: 'messenger-fixed messenger-on-top messenger-theme-air'
    maxMessages: 1

$ -> app.initialize()