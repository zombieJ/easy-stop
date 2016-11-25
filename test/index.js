/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const easyStop = require('../index');

console.log('process id:', process.pid);

describe('Server', function() {
	var pidPath = easyStop.getPidPath();

	/*before(function () {
		if(fs.existsSync(pidPath)) {
			fs.unlink(pidPath);
		}
	});*/

	describe('Start', function() {
		this.timeout(30000);

		it('save pid in current path', function () {
			return easyStop.start().then(function () {
				assert(fs.existsSync(pidPath));

				fs.unlink(pidPath);
			});
		});
	});

	describe('Stop', function() {
		this.timeout(30000);

		it('kill current process', function (done) {
			const spawn = require('child_process').spawn;
			const lp = spawn('node', ['./test/loopProcess.js']);
			var kill = false;

			lp.stdout.on('data', function (data) {
				data = (data + '').trim();
				console.log('stdout:', data);

				if(data === 'Loop' && !kill) {
					console.log('do stop!');
					kill = true;
					easyStop.stop().then(function () {
						setTimeout(done, 1000);
					});
				}
			});
		});
	});
});
