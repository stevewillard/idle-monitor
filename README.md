### IdleMonitor
A simple AMD component which fires Backbone [Events](http://backbonejs.org/#Events) if the user is idle.

### Features
- Very small
- Works across tabs using localStorage
- Unopinionated events

#### Dependencies
Backbone (and Underscore)

#### Install
```
bower install idle-monitor
```

#### Usage
This is an AMD component, and it is designed to be loaded with things like [RequireJS](http://requirejs.org/) or [Almond](https://github.com/jrburke/almond). This code simply fires events -- it's up to the consumer to react to these events.

```javascript
// An example AMD module
define(function(require) {
    // Pull in the idle-monitor
    var IdleMonitor = require("idle-monitor");
    
    // Initialize a new one
    idleMonitor = new IdleMonitor();
    
    // Starting will poll for idleness
    idleMonitor.start({
        checkIntervalSecs : 10,
        events : {
            document : "click keyup"
        },
        warningSecs : 60 * 14,
        timeoutSecs : 60 * 15
    });
    
    // Do something when the user has been idle for awhile
    idleMonitor.on("warning", function() {
        console.log("Wow -- you're not doing anything.");
    });
    
    // Fires when user fires a non-idle event
    idleMonitor.on("action", function() {
        console.log("Oh hi. You're here.");
    });
    
    // You've had your warning, you're TOO idle
    idleMonitor.on("timeout", function() {
        console.log("Ok... we're going to log you out");
    });
    
    // Stop will stop polling
    idleMonitor.stop();
});
```

#### Options
##### checkIntervalSecs
How often the idle-monitor should poll.
_default: 10_

##### events
A mapping of jQuery selectors and events which "reset" the idleness.

_default:_
```json
events : {
    document : "click keyup"
}
```
##### warningSecs
Number of seconds before trigger a warning event.
_default: 60 * 14_

##### timeoutSecs
Number of seconds before triggering a timeout event.
_default: 60 * 15_
