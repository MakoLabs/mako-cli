/* init commander component
 * To use add require('../cmds/init.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var path = require('path');
var shelljs = require('shelljs');
var uuid = require('uuid');

module.exports = function(program) {

    function action(){
        var excludeTemplate;
        shelljs.mkdir('-p', program.distro.localDir);
        shelljs.exec('git init ' + program.distro.destDir);
        excludeTemplate = path.resolve(__dirname, '..', 'templates', 'exclude.txt');
        shelljs.cat(excludeTemplate).to(program.distro.excludeFile);
        shelljs.echo(JSON.stringify({id:uuid.v4()})).to(program.distro.configFile);
    }

	program
		.command('init')
		.version('0.0.1')
		.description('Create an empty distribution or reinitialize and existing one')
		.action(action);

};
