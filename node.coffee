express = require('express')
#debug = require('debug')('Server')
#gitHubPackageManager = require('./package_managers/github')()

app = express()

# app.get '/api/list-packages', (req, res) ->
#     gitHubPackageManager.getPackageList().then (packages) ->
#         res.send JSON.stringify(packages, null, 4)

app.get '/api/time', (req, res) ->
    res.send (+new Date()).toString()

app.use express.static(__dirname + '/public')

port = process.env.PORT ? 5000

app.listen port, ->
    console.log('Listening on ' + port)