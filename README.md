# easy-stop

`easy-stop` is a quick util of control node server start / stop.
It can helps you start singleton web server by one folder.

### Start Server
```javascript
const easyStop = require('easy-stop');
easyStop.start().then(function () {
	// Start your server like express...
});
```
`start` will check current running instance.
Return `Promise` - `onSuccess` if no instance is running.

### Stop Server
#### by code
```javascript
const easyStop = require('easy-stop');
easyStop.stop();
```
`stop` will close the running instance.

#### by cli
```
easy-stop stop
```

### Arguments
start(pidDirPath = `current folder`, pidFileName = 'process.pid')

stop(pidDirPath = `current folder`, pidFileName = 'process.pid')

restart(pidDirPath = `current folder`, pidFileName = 'process.pid')
