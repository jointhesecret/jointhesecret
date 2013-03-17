class Utils

    safeHTML: (str) ->
        str = str.replace(/&/g, "&amp;")
        str = str.replace(/"/g, "&quot;")
        str = str.replace(/'/g, "&#039;")
        str = str.replace(/</g, "&lt;")
        str = str.replace(/>/g, "&gt;")
        str

    getHTMLTitleFromHistoryFragment: (fragment) ->
        _.capitalize(fragment.split('\/').join(' '))

    getUserModel: (id) ->
        return app.collections.users.get(parseDec id) if /^\d+$/.test _.trim id
        key = if /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test id then 'email' else 'login'
        app.collections.users.find (u) -> u.get(key) is id

    unknownUser: (username) ->
        email = "#{username}@hubspot.com"

        user = new Backbone.Model
            unknown: true
            id: username
            login: username
            username: username
            name: name
            email: email
            gravatar: @gravatarFromEmail(email)

        app.collections.users.add user

        user

    simpleError: (body, callback = ->) ->
        @simpleConfirm
            header: 'An error occurred'
            body: body
            callback: callback
            buttons: [
                text: 'Ok'
                class: 'btn btn-primary'
                close: true
            ]

    simpleConfirm: (options) ->
        options = body: options if typeof options is 'string'

        id = "#{+new Date()}_#{parseDec(Math.random() * 10000)}"

        options = _.extend {},
            id: id
            callback: ->
            header: 'Confirm'
            body: 'Are you sure?'
            buttons: [{
                text: 'Ok'
                class: 'btn btn-primary'
                close: true
            }
            {
                text: 'Cancel'
                class: 'btn btn-secondary'
                close: true
            }]
        , options

        $(require('./views/templates/modal')(options)).modal()

        modal = $('#' + options.id)

        $('body > .modal-backdrop, #' + options.id).bind 'mousewheel', (e) -> e.preventDefault()

        body = modal.find('.modal-body')
        height = body.height()
        scrollHeight = body.get(0).scrollHeight

        body.bind 'mousewheel', (e, d) ->
            e.preventDefault() if (@scrollTop is (scrollHeight - height) and d < 0) or (@scrollTop is 0 and d > 0)

        modal.find('.btn-primary').unbind().click -> options.callback true
        modal.find('.btn-secondary').unbind().click -> options.callback false

module.exports = new Utils