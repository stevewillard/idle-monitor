(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["backbone", "underscore"], factory);
    }
}(function(Backbone, _) {
    var LOCAL_STORAGE_KEY = "idleTimeout.actionTime";

    function IdleTimeout(options) {
        _.extend(this, Backbone.Events);
        this.timeout = null;
        this.lastAction = null;
        this.warningFired = false;

        this.options = _.defaults(options || {}, {
            "checkIntervalSecs" : 10,
            "events" : {
                "document" : "click keyup"
            },
            "warningSecs" : 60 * 14,
            "timeoutSecs" : 60 * 15
        });

        // Apply action callbacks
        _.each(_.keys(this.options.events), _.bind(function(selector) {
            var s = (selector === "document" ? document : selector);
            Backbone.$(s).on(this.options.events[selector], _.bind(this.actionCallback, this));
        }, this));
    }

    IdleTimeout.prototype.actionCallback = function() {
        localStorage.setItem(LOCAL_STORAGE_KEY, (new Date()).getTime());
        this.trigger("action");
    };

    IdleTimeout.prototype.checkCallback = function() {
        console.log("check callback");
        var lastActionUnixTime = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY), 10),
            timeDiff = ((new Date()).getTime() - (new Date(lastActionUnixTime)).getTime()) / 1000;

        // Store the last time an action happened
        if (this.lastAction && this.lastAction !== lastActionUnixTime) {
            this.trigger("action");
            this.warningFired = false;
            this.lastAction = lastActionUnixTime;
            return;
        }
        this.lastAction = lastActionUnixTime;

        // Fire warning
        if (!this.warningFired && timeDiff >= this.options.warningSecs) {
            this.trigger("warning");
            this.warningFired = true;
        }

        // Fire timeout
        if (timeDiff >= this.options.timeoutSecs) {
            this.trigger("timeout");
        }
    };

    IdleTimeout.prototype.start = function() {
        this.stop();
        this.actionCallback();
        this.timeout = setInterval(_.bind(this.checkCallback, this),
                this.options.checkIntervalSecs * 1000);
    };

    IdleTimeout.prototype.stop = function() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.warningFired = false;
    };

    return IdleTimeout;
}));