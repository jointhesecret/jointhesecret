Collection = require './collection'

class Employees extends Collection

    url: ->
        if location.href.split('.')[0].replace(/https?:\/\//,'').toLowerCase() isnt 'local'
            "https://api.hubapi.com/awth/v1/users?active=true&realm-id=3&active-permissions=true&access_token=#{app.login.context.auth.access_token.token}"
        else
            'https://api.hubapi.com/awth/v1/users?active=true&realm-id=3&active-permissions=true&hapikey=1ede2a35-94a6-40c0-a4ff-5fa72c6dc1c2'

    parse: (data) ->
        _.map data.users, (employee) ->
            employee.gravatar = "https://secure.gravatar.com/avatar/#{CryptoJS.MD5(employee.email)}?d=http://i48.tinypic.com/mhrdpf_th.png"
            employee

module.exports = Employees