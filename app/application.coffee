Login = require 'lib/login'
Router = require 'lib/router'

class Application

    initialize: =>
        @login = new Login env

        @views = {}
        @collections = {}

        # @login.verifyUser (data) =>
        #     # Pretend to be somebody else :)
        #     # @login.context.user.email = 'email@hubspot.com'

        #     # Get employees before
        #     # actually starting the app
        #     @fetchResources =>

        #         $('#loader').hide()

        #         @router = new Router

        #         Backbone.history.start
        #             pushState: location.href.split('.')[0].replace(/https?:\/\//,'').toLowerCase() isnt 'local'
        #             root: '/'

        #         Object.freeze? @

        @router = new Router

        Backbone.history.start
            pushState: location.href.split('.')[0].replace(/https?:\/\//,'').toLowerCase() isnt 'local'
            root: '/'

        Object.freeze? @

    # fetchResources: (success) =>
    #     @resolve_countdown = 0

    #     resolve = =>
    #         @resolve_countdown -= 1
    #         success() if @resolve_countdown is 0

    #     resources = [{
    #         collection_key: 'employees'
    #         collection: Employees
    #         error_phrase: 'employees'
    #     }]

    #     _.each resources, (r) =>
    #         @resolve_countdown += 1
    #         @collections[r.collection_key] = new r.collection
    #         @collections[r.collection_key].fetch
    #             error: -> utils.simpleError("An error occurred while trying to load #{constants.company_name} #{r.error_phrase}.")
    #             success: -> resolve()

module.exports = new Application