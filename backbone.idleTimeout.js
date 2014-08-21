(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["backbone", "underscore"], factory);
    }
}(function(Backbone, _) {
    var LOCAL_STORAGE_KEY = "idleTimeout.actionTime";

    function IdleTimeout() {
        _.extend(this, Backbone.Events);
        this.timeout = null;
        this.warningFired = false;
    }

    IdleTimeout.prototype.init = function(options) {
        this.options = _.defaults(options, {
            "checkIntervalSecs" : 10,
            "events" : {
                "document" : "click keyup"
            },
            "warningDurationSecs" : 60 * 14,
            "triggerDurationSecs" : 60 * 15
        });

        console.log(this.options);

        // Apply action callbacks
        _.each(_.keys(this.options.events), function(selector) {
            var s = (selector === "document" ? document : selector);
            Backbone.$(s).on(this.options.events[selector], _.bind(this.actionCallback, this));
        });
    };

    IdleTimeout.prototype.actionCallback = function() {
        console.log("action callback");
        sessionStorage.setItem(LOCAL_STORAGE_KEY, (new Date()).getTime());
    };

    IdleTimeout.prototype.checkCallback = function() {
        console.log("check callback");
        var lastActionUnixTime = parseInt(sessionStorage.getItem(LOCAL_STORAGE_KEY), 10),
            timeDiff = ((new Date()).getTime() - (new Date(lastActionUnixTime)).getTime()) / 1000;

        if (!this.warningFired && timeDiff >= this.options.warningDurationSecs) {
            this.trigger("warning");
            this.warningFired = true;
        }

        if (timeDiff >= this.options.triggerDurationSecs) {
            this.trigger("timeout");
        }
    };

    IdleTimeout.prototype.start = function() {
        console.log("started");
        this.stop();
        this.actionCallback();
        console.log("options: ");
        console.log(this.options);
        this.timeout = setInterval(_.bind(this.checkCallback, this),
                this.options.checkIntervalSecs * 1000);
    };

    IdleTimeout.prototype.stop = function() {
        console.log("stopped");
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.warningFired = false;
        sessionStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    return IdleTimeout;
}));