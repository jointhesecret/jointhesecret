View = require './view'

# https://www.google.com/intl/en/chrome/demos/speech.html
class SpeechRecognition

    @defaults:
        recognitionOptions:
            lang: 6
            continuous: true
            #interimResults: true
        listening: -> log('Listening...')
        notListening: -> log('Done listening.')
        error: (error) -> log('Speech Recognition Error: ', error)
        result: (phrase, event) -> log(phrase, event)

    constructor: (options) ->
        @options = $.extend true, {}, SpeechRecognition.defaults, options
        @detect()

    detect: ->
        @speechRecognitionAvailable = 'webkitSpeechRecognition' of window
        if @speechRecognitionAvailable
            @setup()
        else
            @message '''Sorry, your computer does not support Speech recognition.'''

    setup: ->
        return unless @speechRecognitionAvailable

        @recognition = new webkitSpeechRecognition()
        $.extend @recognition, @options.recognitionOptions

        @recognition.onstart = =>
            $('.js-permissions-bar').removeClass('show')
            @message 'Listening...'
            @recognizing = true
            @options.listening()

        @recognition.onerror = (event) =>
            $('.js-permissions-bar').removeClass('show')
            $('.js-toggle-speech').removeClass('listening').removeClass('disabled')
            @recognizing = false

            switch event.error
                when 'audio-capture'
                    # @message 'An audio capture error occurred. Please try again.'
                    setTimeout ->
                        window.location.reload()
                    , 300
                    # @stop()
                    # @start()
                when 'no-speech'
                    @message '''You'll need to speak up. Please try again.'''
                when 'not-allowed'
                    @message '''Please choose "Allow" to continue.'''

        @recognition.onend = =>
            @recognizing = false
            @lastMessage.hide() if @lastMessage and @lastMessage.options.message is 'Listening...'
            @options.notListening()

        @recognition.onresult = (event) =>
            if typeof (event.results) is 'undefined'
                @recognition.onend = null
                @recognition.stop()
                @options.result('', event)
                @message 'Sorry, we were unable to detect your speech.'
                return

            phrase = $.trim event.results[event.resultIndex][0].transcript
            @options.result(phrase, event)

    start: ->
        return unless @recognition
        try
            @recognition.start()
            $('.js-permissions-bar').addClass('show')
        catch error
            @message 'Please choose "Allow" above.'

    stop: ->
        return unless @recognition
        @recognition.stop()

    message: (message) ->
        @lastMessage = $.globalMessenger().post
            type: 'info'
            message: message
            hideAfter: 5
        #@options.error $.error message

class AppManager

    apps: {}
    commands: []

    constructor: (options) ->
        @options = options

    registerApp: (app) ->
        if @apps[app.id]
            log 'Cannot register App', app.id, '. It already exists.'

        else
            @apps[app.id] = app

        if app.commands.length
            @registerCommands app

        app

    registerCommands: (app) ->
        _.each app.commands, (command) =>
            command._appId = app.id
            @commands.push command

    checkSpeechForCommand: (phrase, event) ->
        for command in @commands
            if (command.regex and command.regex.test phrase) or (command.phrases and _.contains command.phrases, phrase.toLowerCase())
                log 'Command executed for app', @apps[command._appId]
                command.callback phrase, event
                return true # TODO - handle multiple matches

        return false

class OSCommandManager

    constructor: ->
        @commands = @getCommands()

    getCommands: ->
        [
            {
                phrases: ['cancel', 'cancel that', 'please cancel', 'please cancel that']
                callback: @cancel
            }
            {
                phrases: ['close', 'close window', 'close this window']
                callback: @closeWindow
            }
            {
                phrases: ['undo', 'undo that', 'please undo', 'please undo that', 'under', 'under that']
                callback: @undo
            }
            {
                phrases: ['play', 'play video', 'play the video', 'resume', 'resume video', 'resume the video', 'resume playing', 'resume playing video', 'resume playing the video']
                callback: @play
            }
            {
                phrases: ['pause', 'pause video', 'pause the video', 'boss']
                callback: @pause
            }
            {
                phrases: ['mute', 'mute video', 'mute the video', 'music video', 'nude']
                callback: @mute
            }
            {
                phrases: ['unmute', 'unmute video', 'unmute the video']
                callback: @unMute
            }
        ]

    checkSpeechForCommand: (phrase, event) ->
        for command in @commands
            if (command.regex and command.regex.test phrase) or (command.phrases and _.contains command.phrases, phrase.toLowerCase())
                command.callback phrase, event
                return true

        return false

    closeWindow: (phrase, event) ->
        log 'Command: Close window'
        application.uiManager.closeWindow()

    cancel: (phrase, event) -> log 'Command: Cancel (Not implemented)'
    undo: (phrase, event) -> log 'Command: Undo (Not implemented)'

    play: ->
        log 'Command: Play'
        youTubePlayer = $('#js-youtube-player')[0]
        youTubePlayer.playVideo() if youTubePlayer

    pause: ->
        log 'Command: Pause'
        youTubePlayer = $('#js-youtube-player')[0]
        youTubePlayer.pauseVideo() if youTubePlayer

    mute: ->
        log 'Command: Mute'
        youTubePlayer = $('#js-youtube-player')[0]
        youTubePlayer.mute() if youTubePlayer

    unMute: ->
        log 'Command: Unmute'
        youTubePlayer = $('#js-youtube-player')[0]
        youTubePlayer.unMute() if youTubePlayer

    # setVideoVolume = ->
    #     volume = parseInt(document.getElementById("volumeSetting").value)
    #     if isNaN(volume) or volume < 0 or volume > 100
    #         alert "Please enter a valid volume between 0 and 100."
    #     else youTubePlayer.setVolume volume if youTubePlayer

class UIManager

    windowId: 0
    zIndex: 1

    @defaults:
        window:
            extraClasses: ''

    $appContainer: $('.js-app-window-container')

    constructor: ->
        mouseMoveTimeout = undefined
        $(window).mousemove ->
            clearTimeout mouseMoveTimeout if mouseMoveTimeout
            $('.js-toggle-speech').addClass('mousemove')
            mouseMoveTimeout = setTimeout ->
                $('.js-toggle-speech').removeClass('mousemove')
            , 2000

        $(document).dblclick ->
            if $('html').hasClass('dark')
                $('html').removeClass('dark')
            else
                $('html').addClass('dark')

    createWindow: (options) ->
        $('.js-toggle-speech').addClass('hidden')

        windowOptions = $.extend true, {}, UIManager.defaults.window, options

        $window = $('<div class="js-app-window app-window" />')
        $window.data().id = @windowId++
        $window.css zIndex: @zIndex++

        $window.addClass windowOptions.extraClasses
        $window.html windowOptions.html

        @$appContainer.append $window

        $window

    closeWindow: (limitClass) ->
        $('.js-toggle-speech').removeClass('hidden')

        if limitClass
            @$appContainer.find(".#{limitClass}").remove()
        else
            @$appContainer.find('.js-app-window').last().remove()

class Application

    @defaults: {}

    constructor: (options) ->
        @options = $.extend true, {}, Application.defaults, options

    render: ->
        that = @

        @setupDom()
        @setupUIManager()
        @setupOSCommandManager()
        @setupSpeechRecognition()
        @setupSpeechButton()
        @registerDefaultApps()

        # @speechRecognition.start()
        # application.appManager.apps.weather.commands[0].callback()

    setupDom: ->
        @$speechButton = $('.js-toggle-speech')

    setupUIManager: ->
        @uiManager = new UIManager

    setupOSCommandManager: ->
        @osCommandManager = new OSCommandManager

    setupSpeechButton: ->
        @$speechButton.click =>
            if @speechRecognition.recognizing
                @speechRecognition.stop()
            else
                @$speechButton.addClass('disabled')
                @speechRecognition.start()

    setupSpeechRecognition: ->
        appCommandTimeouts = {}

        @speechRecognition = new SpeechRecognition
            listening: =>
                log 'Listening...'
                @$speechButton.removeClass('disabled').addClass('listening')

            notListening: =>
                log 'Done listening.'
                @$speechButton.removeClass('disabled').removeClass('listening')

            error: (error) =>
                log 'Speech Recognition Error: ', error

            result: (phrase, event) =>
                commandExecuted = @osCommandManager.checkSpeechForCommand(phrase, event)
                if commandExecuted
                    return
                else
                    log('OS Ignored: ', phrase)

                clearTimeout appCommandTimeouts[event.resultIndex] if appCommandTimeouts[event.resultIndex]
                appCommandTimeouts[event.resultIndex] = setTimeout =>
                    commandExecuted = @appManager.checkSpeechForCommand(phrase, event)
                    log('No app: ', phrase) unless commandExecuted
                , 2000

    registerDefaultApps: ->
        @appManager = new AppManager
        _.each defaultApps, (app) =>
            @appManager.registerApp app(@)

defaultApps =

    youTube: (api) ->

        updatePlayerInfoInterval = undefined

        loadVideo = (containerId, videoId) ->
            swfURL = 'http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=player1'
            width = '480'
            height = '295'
            params = allowScriptAccess: 'always'
            atts = id: 'js-youtube-player'

            clearInterval(updatePlayerInfoInterval) if updatePlayerInfoInterval

            # Stupid Google requires the callback to be in the global namespace :(
            window.onYouTubePlayerReady = ->
                youTubePlayer = $('#js-youtube-player')[0]

                updatePlayerInfo = ->
                    return unless youTubePlayer and youTubePlayer.getDuration
                    # log 'videoDuration', youTubePlayer.getDuration()
                    # log 'videoCurrentTime', youTubePlayer.getCurrentTime()
                    # log 'bytesTotal', youTubePlayer.getVideoBytesTotal()
                    # log 'startBytes', youTubePlayer.getVideoStartBytes()
                    # log 'bytesLoaded', youTubePlayer.getVideoBytesLoaded()
                    # log 'volume', youTubePlayer.getVolume()

                updatePlayerInfoInterval = setInterval updatePlayerInfo, 250
                updatePlayerInfo()

                window.onPlayerError = (errorCode) ->
                    log 'An error occured of type:' + errorCode

                window.onPlayerStateChange = (newState) ->
                    if newState is 0
                        application.uiManager.closeWindow 'js-youtube-window'
                    log 'playerState', newState

                youTubePlayer.addEventListener 'onStateChange', 'onPlayerStateChange'
                youTubePlayer.addEventListener 'onError', 'onPlayerError'

                youTubePlayer.cueVideoById videoId
                youTubePlayer.playVideo()

            swfobject.embedSWF swfURL, containerId, width, height, '9', null, null, params, atts

        search = (searchQuery) ->
            return unless searchQuery or searchQuery is ''

            log 'Searching YouTube for', searchQuery

            jsonp = '&alt=json-in-script&callback=?'
            containerId = 'js-youtube-video-container-' + (+ Date())

            $.getJSON "http://gdata.youtube.com/feeds/api/videos?max-results=1&vq=#{escape(searchQuery)}#{jsonp}", (data) ->
                return unless data.feed.entry.length
                item = data.feed.entry[0]
                apiId = item.id.$t
                apiId.match /\/(\w+?)$/
                videoId = RegExp.$1
                title = item.title.$t

                log 'Playing YouTube video', title

                # TODO - switch to chromeless player
                # http://stackoverflow.com/questions/1107553/adding-control-buttons-to-chromeless-youtube
                api.uiManager.closeWindow 'js-youtube-window'
                $window = api.uiManager.createWindow
                    extraClasses: 'js-youtube-window'
                    html: """<div class="video-container"><div id="#{containerId}"></div></div>"""

                loadVideo containerId, videoId

        {
            id: 'youtube'
            commands: [
                {
                    regex: /youtube/i
                    callback: (phrase) ->
                        searchQuery = $.trim phrase.replace(/youtube/i, '')

                        # words = new Lexer().lex phrase
                        # taggedWords = new POSTagger().tag words
                        # log taggedWords

                        search searchQuery
                }
            ]
        }

    pandora: (api) ->

        openWindowedPlayer = (searchQuery) ->
            return unless searchQuery or searchQuery is ''

            params = [
                'height=' + $(window).height()
                'width=' + $(window).width()
                'fullscreen=yes'
            ].join(',')

            popup = window.open('http://www.pandora.com/station/play/' + searchQuery, 'popup_window', params)
            popup.moveTo(window.screenLeft, window.screenTop + 49)

        {
            id: 'pandora'
            commands: [
                {
                    regex: /pandora/i
                    callback: (phrase) ->
                        searchQuery = $.trim phrase.replace(/pandora/i, '')
                        openWindowedPlayer searchQuery
                }
            ]
        }

    weather: (api) ->

        APPID = 'rXWEQm62'
        DEG = 'f'
        weatherIconMap = ['storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail', 'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow', 'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake', 'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun', 'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain', 'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning']

        $weather = undefined
        $days = undefined
        $location = undefined

        locationSuccess = (position) ->
            lat = position.coords.latitude
            lon = position.coords.longitude
            geoAPI = "http://where.yahooapis.com/geocode?location=#{lat},#{lon}&flags=J&gflags=R&appid=#{APPID}"

            # Forming the query for Yahoo's weather forecasting API with YQL
            # http://developer.yahoo.com/weather/
            wsql = "select * from weather.forecast where woeid=WID and u=\"" + DEG + "\""
            weatherYQL = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(wsql) + "&format=json&callback=?"
            code = undefined
            city = undefined
            results = undefined
            woeid = undefined
            #log "Coordinates: %f %f", lat, lon  if window.console and window.console.info
            $.getJSON(geoAPI, (r) ->
                return unless parseInt(r.ResultSet.Found, 10) is 1
                results = r.ResultSet.Results
                city = results[0].city
                code = results[0].statecode or results[0].countrycode
                woeid = results[0].woeid
                $.getJSON weatherYQL.replace("WID", woeid), (r) ->
                    if r.query and r.query.count is 1
                        item = r.query.results.channel.item.condition
                        unless item
                            showError "We can't find weather information about your city!"
                            #log "%s, %s; woeid: %d", city, code, woeid  if window.console and window.console.info
                            return false
                        addWeather item.code, "Now", item.text + " <b>" + item.temp + "°" + DEG + "</b>"
                        i = 0

                        while i < 2
                            item = r.query.results.channel.item.forecast[i]
                            addWeather item.code, item.day + " <b>" + item.date.replace("d+$", "") + "</b>", item.text + " <b>" + item.low + "°" + DEG + " / " + item.high + "°" + DEG + "</b>"
                            i++
                        $location.html city + ", <b>" + code + "</b>"
                        $weather.addClass "loaded"

                    else
                        showError "Error retrieving weather data!"

            ).error ->
                showError "Your browser does not support CORS requests!"

        addWeather = (code, day, condition) ->
            markup = "<li>" + "<img src=\"images/weather/" + weatherIconMap[code] + ".png\" />" + " <p class=\"day\">" + day + "</p> <p class=\"cond\">" + condition + "</p></li>"
            $days.append markup

        locationError = (error) ->
            switch error.code
                when error.TIMEOUT
                    showError 'A timeout occured! Please try again!'
                when error.POSITION_UNAVAILABLE
                    showError '''We can't detect your location. Sorry!'''
                when error.PERMISSION_DENIED
                    showError 'Please allow geolocation access for this to work.'
                when error.UNKNOWN_ERROR
                    showError 'An unknown error occured!'

        showError = (msg) ->
            $weather.addClass("error").html msg

        {
            id: 'weather'
            commands: [
                {
                    phrases: ['weather', 'local weather', 'show weather', 'what\'s the weather like']
                    callback: (phrase) ->
                        api.uiManager.createWindow
                            extraClasses: 'weather-window'
                            html: """
                                <div class="js-weather-container weather-container">
                                    <ul class="js-days-container days-container"></ul>
                                    <p class="js-weather-location location"></p>
                                </div>
                            """

                        $weather = $('.js-weather-container')
                        $days = $weather.find('.js-days-container')
                        $location = $weather.find('.js-weather-location')

                        if navigator.geolocation
                            navigator.geolocation.getCurrentPosition locationSuccess, locationError
                        else
                            showError "Your browser does not support Geolocation!"
                }
            ]
        }

module.exports = Application