var ps = require('ps-node');
var fs = require('fs');
var path = require('path');

function getPidPath(pidDirPath, pidFileName) {
	return path.resolve(pidDirPath || '.', pidFileName || 'process.pid');
}

function getPrevPid(path) {
	if(!fs.existsSync(path)) {
		return -1;
	}
	return Number(fs.readFileSync(path, 'utf-8') || -1);
}

function start(pidDirPath, pidFileName) {
	var pidPath = getPidPath(pidDirPath, pidFileName);
	var prevPid = getPrevPid(pidPath);

	return new Promise(function (resolve, reject) {
		ps.lookup({ pid: prevPid }, function(err, resultList) {
			// Check process exist
			if(err) {
				console.log('OPS:', err);
				reject(err);
				process.exit(1);
			}

			if(resultList[0]) {
				console.log('Process already exist!');
				reject(err);
				process.exit(0);
			}

			// Record pid
			var pid = process.pid + '';
			fs.writeFile(pidPath, pid, 'utf-8', function (err) {
				resolve(pid);
			});
		});
	});
}

function stop(pidDirPath, pidFileName) {
	var pidPath = getPidPath(pidDirPath, pidFileName);
	var pid = getPrevPid(pidPath);

	return new Promise(function (resolve, reject) {
		if(!pid || pid === -1) {
			console.log('No pid found. Skipped!');
			resolve('-1');
			return;
		}

		ps.kill(pid, { signal: 9 }, function (err) {
			if(err) {
				err = err + '';
				console.log('Stop failed:', err);
				if(err.indexOf('not found') === -1) {
					reject(pid);
				} else {
					resolve(pid);
				}
				return;
			}

			console.log('Stop success!');
			fs.unlinkSync(pidPath);
			resolve(pid);
		});
	});
}

if(module) {
	module.exports = {
		getPidPath: getPidPath,
		start: start,
		stop: stop,
		restart: function (pidDirPath, pidFileName) {
			return stop(pidDirPath, pidFileName).then(function () {
				return start(pidDirPath, pidFileName);
			});
		}
	};
}
