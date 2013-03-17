View = require './view'

class NavigationView extends View

    render: =>
        @renderTitle()

    renderTitle: =>
        subtitle = utils.getHTMLTitleFromHistoryFragment(Backbone.history.fragment)
        subtitle = ' — ' + subtitle if subtitle isnt ''
        $('head title').text("Secret#{subtitle}")

module.exports = NavigationView