class Login

    constructor: (@env) ->
        # if you want to hardcode or force a portal ID, do it here
        @verify_url = "https://#{env.API_BASE}/login/api-verify"

    verifyUser: (onSuccess) =>
        onSuccess
            auth:
                access_token:
                    expires_at: 1363576707475
                    token: "7218feb4-8f37-11e2-86bf-cb7fb382b28d"
            user:
                email: "aschwartz@hubspot.com"
                id: 1

        # $.ajax
        #     type: 'GET'
        #     url: @verify_url
        #     dataType: 'json'
        #     xhrFields:
        #         withCredentials: true
        #     success: (data) =>
        #         @context = data
        #         @env.portalId = data.portal.portal_id
        #         onSuccess data
        #     error: =>
        #         log "verification of #{@verify_url} failed"
        #         window.location = "https://#{@env.LOGIN_BASE}/login/?loginRedirectUrl=#{window.location}"

module.exports = Login