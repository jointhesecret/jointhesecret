exports.config =

    paths:
        public: 'public'

    files:

        javascripts:

            defaultExtension: 'coffee'

            joinTo:
                'static/js/app.js': /^app/
                'static/js/vendor.js': /^vendor/

            order:
                before: [
                    'vendor/scripts/core.coffee'
                    'vendor/scripts/console-helper.js'
                    'vendor/scripts/jquery-1.7.2.js'
                    'vendor/scripts/jquery-ui-min.js'
                    'vendor/scripts/jquery.cookie.js'
                    'vendor/scripts/jquery.mousewheel.js'
                    'vendor/scripts/underscore-1.3.1.js'
                    'vendor/scripts/underscore.string.js'
                    'vendor/scripts/backbone-0.9.2.js'
                    'vendor/scripts/backbone-query-string-param-patch.js'
                    'vendor/scripts/messenger.js'
                    'vendor/scripts/moment.js'
                    'vendor/scripts/d3.v2.js'
                    'vendor/scripts/md5.js'
                    'vendor/scripts/urlize.js'
                    'vender/scripts/bootstrap/bootstrap-transition.js'
                    'vender/scripts/bootstrap/bootstrap-alert.js'
                    'vender/scripts/bootstrap/bootstrap-modal.js'
                    'vender/scripts/bootstrap/bootstrap-dropdown.js'
                    'vender/scripts/bootstrap/bootstrap-scrollspy.js'
                    'vender/scripts/bootstrap/bootstrap-tab.js'
                    'vender/scripts/bootstrap/bootstrap-tooltip.js'
                    'vender/scripts/bootstrap/bootstrap-z_popover.js'
                    'vender/scripts/bootstrap/bootstrap-button.js'
                    'vender/scripts/bootstrap/bootstrap-collapse.js'
                    'vender/scripts/bootstrap/bootstrap-carousel.js'
                    'vender/scripts/bootstrap/bootstrap-typeahead.js'
                ]

        stylesheets:
            defaultExtension: 'styl'
            joinTo: 'static/css/app.css'
            order:
                before: [
                    'vendor/styles/messenger.css'
                    'vendor/styles/messenger-theme-air.css'
                ]

        templates:
            defaultExtension: 'hbs'
            joinTo: 'static/js/app.js'

    server:
        base: ''