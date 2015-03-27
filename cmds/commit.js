/* commit commander component
 * To use add require('../cmds/commit.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var path = require('path');
var shelljs = require('shelljs');

module.exports = function(program) {

	program
		.command('commit [message]')
		.version('0.0.1')
		.description('Record changes to the distribution')
        .option('-m, --message', 'commit message')
		.action(function(message){
            if (!message){
                message = '"Random build?  Should be passed a message!"';
            }
            shelljs.cd(program.distro.sourceDir);
			if (shelljs.exec('git diff').output.length != 0){
                console.log('Changes detected in working directory; all changes must be committed for distribution');
                process.exit(1);
            }

            shelljs.exec('rsync -av  --exclude-from ' + program.distro.excludeFile + ' . ' + program.distro.destDir);

            if (shelljs.exec('npm install && zip -r -0 ' + program.distro.nodeModulesZip + ' ./node_modules').code !== 0){
                console.log('Failed to download dependencies');
                process.exit(1);
            }

            shelljs.cd(program.distro.destDir);
            shelljs.exec('git add --ignore-removal .');
            if (shelljs.exec('git commit -am ' + message ).code !== 0){
                console.log('Failed to commit changes to distribution'.red);
            } else{
                console.log('Commit Successful! Ready to push to master');
            }


		});

};
