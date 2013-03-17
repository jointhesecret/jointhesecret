(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  (function() {
    var Application, Login, Router,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Login = require('lib/login');

    Router = require('lib/router');

    Application = (function() {

      function Application() {
        this.initialize = __bind(this.initialize, this);
      }

      Application.prototype.initialize = function() {
        this.login = new Login(env);
        this.views = {};
        this.collections = {};
        this.router = new Router;
        Backbone.history.start({
          pushState: location.href.split('.')[0].replace(/https?:\/\//, '').toLowerCase() !== 'local',
          root: '/'
        });
        return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
      };

      return Application;

    })();

    module.exports = new Application;

  }).call(this);
  
}});

window.require.define({"collections/collection": function(exports, require, module) {
  (function() {
    var Collection,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection() {
        Collection.__super__.constructor.apply(this, arguments);
      }

      return Collection;

    })(Backbone.Collection);

  }).call(this);
  
}});

window.require.define({"constants": function(exports, require, module) {
  (function() {
    var constants;

    constants = {
      company_name: 'HubSpot',
      app_name: 'facewall',
      api_base: 'kumonga/v2',
      autoplay: true,
      autoplay_seconds: 6,
      useAutoSizing: true,
      columnWidth: 150,
      threedee: false,
      styles: {
        background: '#445560',
        color_rgb: '198,198,198'
      }
    };

    module.exports = constants;

  }).call(this);
  
}});

window.require.define({"env": function(exports, require, module) {
  (function() {

    module.exports = {
      API_BASE: 'api.jointhesecret.com'
    };

  }).call(this);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  (function() {

    window.env = require('env');

    window.utils = require('utils');

    window.constants = require('constants');

    window.app = require('application');

    _.mixin(_.string.exports());

    $._messengerDefaults = {
      extraClasses: 'messenger-fixed messenger-on-top messenger-theme-air',
      maxMessages: 1
    };

    $(function() {
      return app.initialize();
    });

  }).call(this);
  
}});

window.require.define({"lib/login": function(exports, require, module) {
  (function() {
    var Login,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    Login = (function() {

      function Login(env) {
        this.env = env;
        this.verifyUser = __bind(this.verifyUser, this);
        this.verify_url = "https://" + env.API_BASE + "/login/api-verify";
      }

      Login.prototype.verifyUser = function(onSuccess) {
        return onSuccess({
          auth: {
            access_token: {
              expires_at: 1363576707475,
              token: "7218feb4-8f37-11e2-86bf-cb7fb382b28d"
            }
          },
          user: {
            email: "aschwartz@hubspot.com",
            id: 1
          }
        });
      };

      return Login;

    })();

    module.exports = Login;

  }).call(this);
  
}});

window.require.define({"lib/router": function(exports, require, module) {
  (function() {
    var Application, NavigationView, PageNotFoundView, Router, navHandler,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Application = require('views/app');

    PageNotFoundView = require('views/page_not_found');

    NavigationView = require('views/navigation');

    navHandler = function() {
      if (!(app.views.navigationView != null)) {
        app.views.navigationView = new NavigationView;
      }
      return app.views.navigationView.render();
    };

    Router = (function(_super) {

      __extends(Router, _super);

      function Router() {
        Router.__super__.constructor.apply(this, arguments);
      }

      Router.prototype.routes = {
        '*anything': 'appHandler'
      };

      Router.prototype.appHandler = function() {
        navHandler();
        if (!(app.views.appView != null)) app.views.appView = new Application;
        app.views.current_view = app.views.appView;
        return app.views.appView.render();
      };

      return Router;

    })(Backbone.Router);

    module.exports = Router;

  }).call(this);
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  (function() {

    Handlebars.registerHelper('ifLT', function(v1, v2, options) {
      if (v1 < v2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('ifGT', function(v1, v2, options) {
      if (v1 > v2) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('pluralize', function(number, single, plural) {
      if (number === 1) {
        return single;
      } else {
        return plural;
      }
    });

    Handlebars.registerHelper('eachWithFn', function(items, options) {
      var _this = this;
      return _(items).map(function(item, i, items) {
        item._counter = i;
        item._1counter = i + 1;
        item._first = i === 0 ? true : false;
        item._last = i === (items.length - 1) ? true : false;
        item._even = (i + 1) % 2 === 0 ? true : false;
        item._thirded = (i + 1) % 3 === 0 ? true : false;
        item._sixthed = (i + 1) % 6 === 0 ? true : false;
        _.isFunction(options.hash.fn) && options.hash.fn.apply(options, [item, i, items]);
        return options.fn(item);
      }).join('');
    });

  }).call(this);
  
}});

window.require.define({"models/model": function(exports, require, module) {
  (function() {
    var Model,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    module.exports = Model = (function(_super) {

      __extends(Model, _super);

      function Model() {
        Model.__super__.constructor.apply(this, arguments);
      }

      return Model;

    })(Backbone.Model);

  }).call(this);
  
}});

window.require.define({"utils": function(exports, require, module) {
  (function() {
    var Utils;

    Utils = (function() {

      function Utils() {}

      Utils.prototype.safeHTML = function(str) {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, "&#039;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        return str;
      };

      Utils.prototype.getHTMLTitleFromHistoryFragment = function(fragment) {
        return _.capitalize(fragment.split('\/').join(' '));
      };

      Utils.prototype.getUserModel = function(id) {
        var key;
        if (/^\d+$/.test(_.trim(id))) return app.collections.users.get(parseDec(id));
        key = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(id) ? 'email' : 'login';
        return app.collections.users.find(function(u) {
          return u.get(key) === id;
        });
      };

      Utils.prototype.unknownUser = function(username) {
        var email, user;
        email = "" + username + "@hubspot.com";
        user = new Backbone.Model({
          unknown: true,
          id: username,
          login: username,
          username: username,
          name: name,
          email: email,
          gravatar: this.gravatarFromEmail(email)
        });
        app.collections.users.add(user);
        return user;
      };

      Utils.prototype.simpleError = function(body, callback) {
        if (callback == null) callback = function() {};
        return this.simpleConfirm({
          header: 'An error occurred',
          body: body,
          callback: callback,
          buttons: [
            {
              text: 'Ok',
              "class": 'btn btn-primary',
              close: true
            }
          ]
        });
      };

      Utils.prototype.simpleConfirm = function(options) {
        var body, height, id, modal, scrollHeight;
        if (typeof options === 'string') {
          options = {
            body: options
          };
        }
        id = "" + (+new Date()) + "_" + (parseDec(Math.random() * 10000));
        options = _.extend({}, {
          id: id,
          callback: function() {},
          header: 'Confirm',
          body: 'Are you sure?',
          buttons: [
            {
              text: 'Ok',
              "class": 'btn btn-primary',
              close: true
            }, {
              text: 'Cancel',
              "class": 'btn btn-secondary',
              close: true
            }
          ]
        }, options);
        $(require('./views/templates/modal')(options)).modal();
        modal = $('#' + options.id);
        $('body > .modal-backdrop, #' + options.id).bind('mousewheel', function(e) {
          return e.preventDefault();
        });
        body = modal.find('.modal-body');
        height = body.height();
        scrollHeight = body.get(0).scrollHeight;
        body.bind('mousewheel', function(e, d) {
          if ((this.scrollTop === (scrollHeight - height) && d < 0) || (this.scrollTop === 0 && d > 0)) {
            return e.preventDefault();
          }
        });
        modal.find('.btn-primary').unbind().click(function() {
          return options.callback(true);
        });
        return modal.find('.btn-secondary').unbind().click(function() {
          return options.callback(false);
        });
      };

      return Utils;

    })();

    module.exports = new Utils;

  }).call(this);
  
}});

window.require.define({"views/app": function(exports, require, module) {
  (function() {
    var AppManager, Application, OSCommandManager, SpeechRecognition, UIManager, View, defaultApps;

    View = require('./view');

    SpeechRecognition = (function() {

      SpeechRecognition.defaults = {
        recognitionOptions: {
          lang: 6,
          continuous: true
        },
        listening: function() {
          return log('Listening...');
        },
        notListening: function() {
          return log('Done listening.');
        },
        error: function(error) {
          return log('Speech Recognition Error: ', error);
        },
        result: function(phrase, event) {
          return log(phrase, event);
        }
      };

      function SpeechRecognition(options) {
        this.options = $.extend(true, {}, SpeechRecognition.defaults, options);
        this.detect();
      }

      SpeechRecognition.prototype.detect = function() {
        this.speechRecognitionAvailable = 'webkitSpeechRecognition' in window;
        if (this.speechRecognitionAvailable) {
          return this.setup();
        } else {
          return this.message('Sorry, your computer does not support Speech recognition.');
        }
      };

      SpeechRecognition.prototype.setup = function() {
        var _this = this;
        if (!this.speechRecognitionAvailable) return;
        this.recognition = new webkitSpeechRecognition();
        $.extend(this.recognition, this.options.recognitionOptions);
        this.recognition.onstart = function() {
          $('.js-permissions-bar').removeClass('show');
          _this.message('Listening...');
          _this.recognizing = true;
          return _this.options.listening();
        };
        this.recognition.onerror = function(event) {
          $('.js-permissions-bar').removeClass('show');
          $('.js-toggle-speech').removeClass('listening').removeClass('disabled');
          _this.recognizing = false;
          switch (event.error) {
            case 'audio-capture':
              return setTimeout(function() {
                return window.location.reload();
              }, 300);
            case 'no-speech':
              return _this.message('You\'ll need to speak up. Please try again.');
            case 'not-allowed':
              return _this.message('Please choose "Allow" to continue.');
          }
        };
        this.recognition.onend = function() {
          _this.recognizing = false;
          if (_this.lastMessage && _this.lastMessage.options.message === 'Listening...') {
            _this.lastMessage.hide();
          }
          return _this.options.notListening();
        };
        return this.recognition.onresult = function(event) {
          var phrase;
          if (typeof event.results === 'undefined') {
            _this.recognition.onend = null;
            _this.recognition.stop();
            _this.options.result('', event);
            _this.message('Sorry, we were unable to detect your speech.');
            return;
          }
          phrase = $.trim(event.results[event.resultIndex][0].transcript);
          return _this.options.result(phrase, event);
        };
      };

      SpeechRecognition.prototype.start = function() {
        if (!this.recognition) return;
        try {
          this.recognition.start();
          return $('.js-permissions-bar').addClass('show');
        } catch (error) {
          return this.message('Please choose "Allow" above.');
        }
      };

      SpeechRecognition.prototype.stop = function() {
        if (!this.recognition) return;
        return this.recognition.stop();
      };

      SpeechRecognition.prototype.message = function(message) {
        return this.lastMessage = $.globalMessenger().post({
          type: 'info',
          message: message,
          hideAfter: 5
        });
      };

      return SpeechRecognition;

    })();

    AppManager = (function() {

      AppManager.prototype.apps = {};

      AppManager.prototype.commands = [];

      function AppManager(options) {
        this.options = options;
      }

      AppManager.prototype.registerApp = function(app) {
        if (this.apps[app.id]) {
          log('Cannot register App', app.id, '. It already exists.');
        } else {
          this.apps[app.id] = app;
        }
        if (app.commands.length) this.registerCommands(app);
        return app;
      };

      AppManager.prototype.registerCommands = function(app) {
        var _this = this;
        return _.each(app.commands, function(command) {
          command._appId = app.id;
          return _this.commands.push(command);
        });
      };

      AppManager.prototype.checkSpeechForCommand = function(phrase, event) {
        var command, _i, _len, _ref;
        _ref = this.commands;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          command = _ref[_i];
          if ((command.regex && command.regex.test(phrase)) || (command.phrases && _.contains(command.phrases, phrase.toLowerCase()))) {
            log('Command executed for app', this.apps[command._appId]);
            command.callback(phrase, event);
            return true;
          }
        }
        return false;
      };

      return AppManager;

    })();

    OSCommandManager = (function() {

      function OSCommandManager() {
        this.commands = this.getCommands();
      }

      OSCommandManager.prototype.getCommands = function() {
        return [
          {
            phrases: ['cancel', 'cancel that', 'please cancel', 'please cancel that'],
            callback: this.cancel
          }, {
            phrases: ['close', 'close window', 'close this window'],
            callback: this.closeWindow
          }, {
            phrases: ['undo', 'undo that', 'please undo', 'please undo that', 'under', 'under that'],
            callback: this.undo
          }, {
            phrases: ['play', 'play video', 'play the video', 'resume', 'resume video', 'resume the video', 'resume playing', 'resume playing video', 'resume playing the video'],
            callback: this.play
          }, {
            phrases: ['pause', 'pause video', 'pause the video', 'boss'],
            callback: this.pause
          }, {
            phrases: ['mute', 'mute video', 'mute the video', 'music video', 'nude'],
            callback: this.mute
          }, {
            phrases: ['unmute', 'unmute video', 'unmute the video'],
            callback: this.unMute
          }
        ];
      };

      OSCommandManager.prototype.checkSpeechForCommand = function(phrase, event) {
        var command, _i, _len, _ref;
        _ref = this.commands;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          command = _ref[_i];
          if ((command.regex && command.regex.test(phrase)) || (command.phrases && _.contains(command.phrases, phrase.toLowerCase()))) {
            command.callback(phrase, event);
            return true;
          }
        }
        return false;
      };

      OSCommandManager.prototype.closeWindow = function(phrase, event) {
        log('Command: Close window');
        return application.uiManager.closeWindow();
      };

      OSCommandManager.prototype.cancel = function(phrase, event) {
        return log('Command: Cancel (Not implemented)');
      };

      OSCommandManager.prototype.undo = function(phrase, event) {
        return log('Command: Undo (Not implemented)');
      };

      OSCommandManager.prototype.play = function() {
        var youTubePlayer;
        log('Command: Play');
        youTubePlayer = $('#js-youtube-player')[0];
        if (youTubePlayer) return youTubePlayer.playVideo();
      };

      OSCommandManager.prototype.pause = function() {
        var youTubePlayer;
        log('Command: Pause');
        youTubePlayer = $('#js-youtube-player')[0];
        if (youTubePlayer) return youTubePlayer.pauseVideo();
      };

      OSCommandManager.prototype.mute = function() {
        var youTubePlayer;
        log('Command: Mute');
        youTubePlayer = $('#js-youtube-player')[0];
        if (youTubePlayer) return youTubePlayer.mute();
      };

      OSCommandManager.prototype.unMute = function() {
        var youTubePlayer;
        log('Command: Unmute');
        youTubePlayer = $('#js-youtube-player')[0];
        if (youTubePlayer) return youTubePlayer.unMute();
      };

      return OSCommandManager;

    })();

    UIManager = (function() {

      UIManager.prototype.windowId = 0;

      UIManager.prototype.zIndex = 1;

      UIManager.defaults = {
        window: {
          extraClasses: ''
        }
      };

      UIManager.prototype.$appContainer = $('.js-app-window-container');

      function UIManager() {
        var mouseMoveTimeout;
        mouseMoveTimeout = void 0;
        $(window).mousemove(function() {
          if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
          $('.js-toggle-speech').addClass('mousemove');
          return mouseMoveTimeout = setTimeout(function() {
            return $('.js-toggle-speech').removeClass('mousemove');
          }, 2000);
        });
        $(document).dblclick(function() {
          if ($('html').hasClass('dark')) {
            return $('html').removeClass('dark');
          } else {
            return $('html').addClass('dark');
          }
        });
      }

      UIManager.prototype.createWindow = function(options) {
        var $window, windowOptions;
        $('.js-toggle-speech').addClass('hidden');
        windowOptions = $.extend(true, {}, UIManager.defaults.window, options);
        $window = $('<div class="js-app-window app-window" />');
        $window.data().id = this.windowId++;
        $window.css({
          zIndex: this.zIndex++
        });
        $window.addClass(windowOptions.extraClasses);
        $window.html(windowOptions.html);
        this.$appContainer.append($window);
        return $window;
      };

      UIManager.prototype.closeWindow = function(limitClass) {
        $('.js-toggle-speech').removeClass('hidden');
        if (limitClass) {
          return this.$appContainer.find("." + limitClass).remove();
        } else {
          return this.$appContainer.find('.js-app-window').last().remove();
        }
      };

      return UIManager;

    })();

    Application = (function() {

      Application.defaults = {};

      function Application(options) {
        this.options = $.extend(true, {}, Application.defaults, options);
      }

      Application.prototype.render = function() {
        var that;
        that = this;
        this.setupDom();
        this.setupUIManager();
        this.setupOSCommandManager();
        this.setupSpeechRecognition();
        this.setupSpeechButton();
        return this.registerDefaultApps();
      };

      Application.prototype.setupDom = function() {
        return this.$speechButton = $('.js-toggle-speech');
      };

      Application.prototype.setupUIManager = function() {
        return this.uiManager = new UIManager;
      };

      Application.prototype.setupOSCommandManager = function() {
        return this.osCommandManager = new OSCommandManager;
      };

      Application.prototype.setupSpeechButton = function() {
        var _this = this;
        return this.$speechButton.click(function() {
          if (_this.speechRecognition.recognizing) {
            return _this.speechRecognition.stop();
          } else {
            _this.$speechButton.addClass('disabled');
            return _this.speechRecognition.start();
          }
        });
      };

      Application.prototype.setupSpeechRecognition = function() {
        var appCommandTimeouts,
          _this = this;
        appCommandTimeouts = {};
        return this.speechRecognition = new SpeechRecognition({
          listening: function() {
            log('Listening...');
            return _this.$speechButton.removeClass('disabled').addClass('listening');
          },
          notListening: function() {
            log('Done listening.');
            return _this.$speechButton.removeClass('disabled').removeClass('listening');
          },
          error: function(error) {
            return log('Speech Recognition Error: ', error);
          },
          result: function(phrase, event) {
            var commandExecuted;
            commandExecuted = _this.osCommandManager.checkSpeechForCommand(phrase, event);
            if (commandExecuted) {
              return;
            } else {
              log('OS Ignored: ', phrase);
            }
            if (appCommandTimeouts[event.resultIndex]) {
              clearTimeout(appCommandTimeouts[event.resultIndex]);
            }
            return appCommandTimeouts[event.resultIndex] = setTimeout(function() {
              commandExecuted = _this.appManager.checkSpeechForCommand(phrase, event);
              if (!commandExecuted) return log('No app: ', phrase);
            }, 2000);
          }
        });
      };

      Application.prototype.registerDefaultApps = function() {
        var _this = this;
        this.appManager = new AppManager;
        return _.each(defaultApps, function(app) {
          return _this.appManager.registerApp(app(_this));
        });
      };

      return Application;

    })();

    defaultApps = {
      youTube: function(api) {
        var loadVideo, search, updatePlayerInfoInterval;
        updatePlayerInfoInterval = void 0;
        loadVideo = function(containerId, videoId) {
          var atts, height, params, swfURL, width;
          swfURL = 'http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=player1';
          width = '480';
          height = '295';
          params = {
            allowScriptAccess: 'always'
          };
          atts = {
            id: 'js-youtube-player'
          };
          if (updatePlayerInfoInterval) clearInterval(updatePlayerInfoInterval);
          window.onYouTubePlayerReady = function() {
            var updatePlayerInfo, youTubePlayer;
            youTubePlayer = $('#js-youtube-player')[0];
            updatePlayerInfo = function() {
              if (!(youTubePlayer && youTubePlayer.getDuration)) {}
            };
            updatePlayerInfoInterval = setInterval(updatePlayerInfo, 250);
            updatePlayerInfo();
            window.onPlayerError = function(errorCode) {
              return log('An error occured of type:' + errorCode);
            };
            window.onPlayerStateChange = function(newState) {
              if (newState === 0) {
                application.uiManager.closeWindow('js-youtube-window');
              }
              return log('playerState', newState);
            };
            youTubePlayer.addEventListener('onStateChange', 'onPlayerStateChange');
            youTubePlayer.addEventListener('onError', 'onPlayerError');
            youTubePlayer.cueVideoById(videoId);
            return youTubePlayer.playVideo();
          };
          return swfobject.embedSWF(swfURL, containerId, width, height, '9', null, null, params, atts);
        };
        search = function(searchQuery) {
          var containerId, jsonp;
          if (!(searchQuery || searchQuery === '')) return;
          log('Searching YouTube for', searchQuery);
          jsonp = '&alt=json-in-script&callback=?';
          containerId = 'js-youtube-video-container-' + (+Date());
          return $.getJSON("http://gdata.youtube.com/feeds/api/videos?max-results=1&vq=" + (escape(searchQuery)) + jsonp, function(data) {
            var $window, apiId, item, title, videoId;
            if (!data.feed.entry.length) return;
            item = data.feed.entry[0];
            apiId = item.id.$t;
            apiId.match(/\/(\w+?)$/);
            videoId = RegExp.$1;
            title = item.title.$t;
            log('Playing YouTube video', title);
            api.uiManager.closeWindow('js-youtube-window');
            $window = api.uiManager.createWindow({
              extraClasses: 'js-youtube-window',
              html: "<div class=\"video-container\"><div id=\"" + containerId + "\"></div></div>"
            });
            return loadVideo(containerId, videoId);
          });
        };
        return {
          id: 'youtube',
          commands: [
            {
              regex: /youtube/i,
              callback: function(phrase) {
                var searchQuery;
                searchQuery = $.trim(phrase.replace(/youtube/i, ''));
                return search(searchQuery);
              }
            }
          ]
        };
      },
      pandora: function(api) {
        var openWindowedPlayer;
        openWindowedPlayer = function(searchQuery) {
          var params, popup;
          if (!(searchQuery || searchQuery === '')) return;
          params = ['height=' + $(window).height(), 'width=' + $(window).width(), 'fullscreen=yes'].join(',');
          popup = window.open('http://www.pandora.com/station/play/' + searchQuery, 'popup_window', params);
          return popup.moveTo(window.screenLeft, window.screenTop + 49);
        };
        return {
          id: 'pandora',
          commands: [
            {
              regex: /pandora/i,
              callback: function(phrase) {
                var searchQuery;
                searchQuery = $.trim(phrase.replace(/pandora/i, ''));
                return openWindowedPlayer(searchQuery);
              }
            }
          ]
        };
      },
      weather: function(api) {
        var $days, $location, $weather, APPID, DEG, addWeather, locationError, locationSuccess, showError, weatherIconMap;
        APPID = 'rXWEQm62';
        DEG = 'f';
        weatherIconMap = ['storm', 'storm', 'storm', 'lightning', 'lightning', 'snow', 'hail', 'hail', 'drizzle', 'drizzle', 'rain', 'rain', 'rain', 'snow', 'snow', 'snow', 'snow', 'hail', 'hail', 'fog', 'fog', 'fog', 'fog', 'wind', 'wind', 'snowflake', 'cloud', 'cloud_moon', 'cloud_sun', 'cloud_moon', 'cloud_sun', 'moon', 'sun', 'moon', 'sun', 'hail', 'sun', 'lightning', 'lightning', 'lightning', 'rain', 'snowflake', 'snowflake', 'snowflake', 'cloud', 'rain', 'snow', 'lightning'];
        $weather = void 0;
        $days = void 0;
        $location = void 0;
        locationSuccess = function(position) {
          var city, code, geoAPI, lat, lon, results, weatherYQL, woeid, wsql;
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          geoAPI = "http://where.yahooapis.com/geocode?location=" + lat + "," + lon + "&flags=J&gflags=R&appid=" + APPID;
          wsql = "select * from weather.forecast where woeid=WID and u=\"" + DEG + "\"";
          weatherYQL = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(wsql) + "&format=json&callback=?";
          code = void 0;
          city = void 0;
          results = void 0;
          woeid = void 0;
          return $.getJSON(geoAPI, function(r) {
            if (parseInt(r.ResultSet.Found, 10) !== 1) return;
            results = r.ResultSet.Results;
            city = results[0].city;
            code = results[0].statecode || results[0].countrycode;
            woeid = results[0].woeid;
            return $.getJSON(weatherYQL.replace("WID", woeid), function(r) {
              var i, item;
              if (r.query && r.query.count === 1) {
                item = r.query.results.channel.item.condition;
                if (!item) {
                  showError("We can't find weather information about your city!");
                  return false;
                }
                addWeather(item.code, "Now", item.text + " <b>" + item.temp + "°" + DEG + "</b>");
                i = 0;
                while (i < 2) {
                  item = r.query.results.channel.item.forecast[i];
                  addWeather(item.code, item.day + " <b>" + item.date.replace("d+$", "") + "</b>", item.text + " <b>" + item.low + "°" + DEG + " / " + item.high + "°" + DEG + "</b>");
                  i++;
                }
                $location.html(city + ", <b>" + code + "</b>");
                return $weather.addClass("loaded");
              } else {
                return showError("Error retrieving weather data!");
              }
            });
          }).error(function() {
            return showError("Your browser does not support CORS requests!");
          });
        };
        addWeather = function(code, day, condition) {
          var markup;
          markup = "<li>" + "<img src=\"images/weather/" + weatherIconMap[code] + ".png\" />" + " <p class=\"day\">" + day + "</p> <p class=\"cond\">" + condition + "</p></li>";
          return $days.append(markup);
        };
        locationError = function(error) {
          switch (error.code) {
            case error.TIMEOUT:
              return showError('A timeout occured! Please try again!');
            case error.POSITION_UNAVAILABLE:
              return showError('We can\'t detect your location. Sorry!');
            case error.PERMISSION_DENIED:
              return showError('Please allow geolocation access for this to work.');
            case error.UNKNOWN_ERROR:
              return showError('An unknown error occured!');
          }
        };
        showError = function(msg) {
          return $weather.addClass("error").html(msg);
        };
        return {
          id: 'weather',
          commands: [
            {
              phrases: ['weather', 'local weather', 'show weather', 'what\'s the weather like'],
              callback: function(phrase) {
                api.uiManager.createWindow({
                  extraClasses: 'weather-window',
                  html: "<div class=\"js-weather-container weather-container\">\n    <ul class=\"js-days-container days-container\"></ul>\n    <p class=\"js-weather-location location\"></p>\n</div>"
                });
                $weather = $('.js-weather-container');
                $days = $weather.find('.js-days-container');
                $location = $weather.find('.js-weather-location');
                if (navigator.geolocation) {
                  return navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
                } else {
                  return showError("Your browser does not support Geolocation!");
                }
              }
            }
          ]
        };
      }
    };

    module.exports = Application;

  }).call(this);
  
}});

window.require.define({"views/navigation": function(exports, require, module) {
  (function() {
    var NavigationView, View,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    View = require('./view');

    NavigationView = (function(_super) {

      __extends(NavigationView, _super);

      function NavigationView() {
        this.renderTitle = __bind(this.renderTitle, this);
        this.render = __bind(this.render, this);
        NavigationView.__super__.constructor.apply(this, arguments);
      }

      NavigationView.prototype.render = function() {
        return this.renderTitle();
      };

      NavigationView.prototype.renderTitle = function() {
        var subtitle;
        subtitle = utils.getHTMLTitleFromHistoryFragment(Backbone.history.fragment);
        if (subtitle !== '') subtitle = ' — ' + subtitle;
        return $('head title').text("Secret" + subtitle);
      };

      return NavigationView;

    })(View);

    module.exports = NavigationView;

  }).call(this);
  
}});

window.require.define({"views/page_not_found": function(exports, require, module) {
  (function() {
    var H, PageNotFoundView, Particle, View, W, animloop, canvas, ctx, dist, distance, draw, ever_rendered, i, minDist, paintCanvas, particleCount, particles, update,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    View = require('./view');

    H = void 0;

    Particle = void 0;

    W = void 0;

    animloop = void 0;

    canvas = void 0;

    ctx = void 0;

    dist = void 0;

    distance = void 0;

    draw = void 0;

    i = void 0;

    minDist = void 0;

    paintCanvas = void 0;

    particleCount = void 0;

    particles = void 0;

    update = void 0;

    ever_rendered = false;

    PageNotFoundView = (function(_super) {

      __extends(PageNotFoundView, _super);

      function PageNotFoundView() {
        this.render = __bind(this.render, this);
        PageNotFoundView.__super__.constructor.apply(this, arguments);
      }

      PageNotFoundView.prototype.template = require('./templates/404');

      PageNotFoundView.prototype.render = function() {
        $(this.el).html(this.template);
        canvas = document.getElementById("page-not-found-canvas");
        ctx = canvas.getContext("2d");
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        particleCount = 150;
        particles = [];
        minDist = 70;
        dist = void 0;
        i = 0;
        while (i < particleCount) {
          particles.push(new Particle());
          i++;
        }
        return animloop();
      };

      return PageNotFoundView;

    })(View);

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
    })();

    paintCanvas = function() {
      ctx.fillStyle = $('body').css('background-color');
      return ctx.fillRect(0, 0, W, H);
    };

    Particle = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = -1 + Math.random() * 2;
      this.vy = -1 + Math.random() * 2;
      this.radius = 4;
      this.draw = function() {
        ctx.fillStyle = "rgb(" + constants.styles.color_rgb + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        return ctx.fill();
      };
    };

    draw = function() {
      var p;
      i = void 0;
      p = void 0;
      paintCanvas();
      i = 0;
      while (i < particles.length) {
        p = particles[i];
        p.draw();
        i++;
      }
      return update();
    };

    update = function() {
      var j, p, p2, _results;
      i = void 0;
      j = void 0;
      p = void 0;
      p2 = void 0;
      _results = void 0;
      i = 0;
      _results = [];
      while (i < particles.length) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x + p.radius > W) {
          p.x = p.radius;
        } else {
          if (p.x - p.radius < 0) p.x = W - p.radius;
        }
        if (p.y + p.radius > H) {
          p.y = p.radius;
        } else {
          if (p.y - p.radius < 0) p.y = H - p.radius;
        }
        j = i + 1;
        while (j < particles.length) {
          p2 = particles[j];
          distance(p, p2);
          j++;
        }
        _results.push(i++);
      }
      return _results;
    };

    distance = function(p1, p2) {
      var ax, ay, dx, dy;
      ax = void 0;
      ay = void 0;
      dist = void 0;
      dx = void 0;
      dy = void 0;
      dist = void 0;
      dx = p1.x - p2.x;
      dy = p1.y - p2.y;
      dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= minDist) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(" + constants.styles.color_rgb + "," + (1.2 - dist / minDist) + ")";
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();
        ax = dx / 2000;
        ay = dy / 2000;
        p1.vx -= ax;
        p1.vy -= ay;
        p2.vx += ax;
        return p2.vy += ay;
      }
    };

    animloop = function() {
      draw();
      if ($('#page-not-found-canvas').length) return requestAnimFrame(animloop);
    };

    module.exports = PageNotFoundView;

  }).call(this);
  
}});

window.require.define({"views/templates/404": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/app": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"js-permissions-bar permissions-bar\"><div class=\"stripe\"></div></div>\n\n<!--input type=\"text\" placeholder=\"\" speech x-webkit-speech /--> <!-- TODO - see if this can be worked with -->\n<a class=\"js-toggle-speech speach-button\">\n    <div class=\"microphone-icon-shadow\">\n        <div class=\"cardioid\"></div>\n        <div class=\"stand\">\n            <div class=\"stand-inner\"></div>\n        </div>\n        <div class=\"stand-base-horizontal\"></div>\n        <div class=\"stand-base-vertical\"></div>\n    </div>\n    <div class=\"microphone-icon\">\n        <div class=\"cardioid\"></div>\n        <div class=\"stand\">\n            <div class=\"stand-inner\"></div>\n        </div>\n        <div class=\"stand-base-horizontal\"></div>\n        <div class=\"stand-base-vertical\"></div>\n    </div>\n</a>\n<div class=\"js-app-window-container\"></div>";});
}});

window.require.define({"views/view": function(exports, require, module) {
  (function() {
    var View,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    require('lib/view_helper');

    View = (function(_super) {

      __extends(View, _super);

      function View() {
        this.routeLink = __bind(this.routeLink, this);
        View.__super__.constructor.apply(this, arguments);
      }

      View.prototype.el = '#page';

      View.prototype.events = {
        'click a': 'routeLink'
      };

      View.prototype.routeLink = function(e) {
        var $link, url;
        $link = $(e.target);
        url = $link.attr('href');
        if ($link.attr('target') === '_blank' || typeof url === 'undefined' || url.substr(0, 4) === 'http') {
          return true;
        }
        e.preventDefault();
        if (url.indexOf('.') === 0) {
          url = url.substring(1);
          if (url.indexOf('/') === 0) url = url.substring(1);
        }
        if ($link.data('route') || $link.data('route') === '') {
          url = $link.data('route');
        }
        return app.router.navigate(url, {
          trigger: true
        });
      };

      return View;

    })(Backbone.View);

    module.exports = View;

  }).call(this);
  
}});

