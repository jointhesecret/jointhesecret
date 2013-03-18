Application = require 'views/app'
PageNotFoundView = require 'views/page_not_found'
NavigationView = require 'views/navigation'

navHandler = ->
    if not app.views.navigationView?
        app.views.navigationView = new NavigationView
    app.views.navigationView.render()

class Router extends Backbone.Router

    routes:
        # '': 'appHandler'
        # '/': 'appHandler'

        #'*anything': 'show404Page'
        '*anything': 'appHandler'

    # basicPageHandler: ->
    #     navHandler()
    #     app.views.current_view = undefined
    #     $('#page').html require "../views/templates/#{Backbone.history.fragment}"

    appHandler: ->
        log 'app handler'
        # navHandler()
        # if not app.views.appView?
        #     app.views.appView = new Application
        # app.views.current_view = app.views.appView
        # app.views.appView.render()

    # show404Page: ->
    #     navHandler()
    #     if not app.views.pageNotFoundView?
    #         app.views.pageNotFoundView = new PageNotFoundView
    #     app.views.current_view = app.views.pageNotFoundView
    #     app.views.pageNotFoundView.render()

module.exports = Router