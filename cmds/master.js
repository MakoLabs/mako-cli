'use strict';

var shelljs = require('shelljs');

module.exports = function (program) {



    program
        .command('master <action> [name] [host]')
        .version('0.0.1')
        .description('Update remote masters along with associated objects')
        .option('-p, --port [value]', 'The master port', 4000)
        .option('-s, --secret [value]', 'The master secret', 'shortfin')
        .action(function (args) {
            var command, protocol = 'http://';
            var repoName = program.config.get('name') + '-' + program.config.get('id');
            shelljs.cd(program.distro.destDir);


            if (args.action === 'add') {
                if (args.name && args.host) {

                    var uri = protocol + 'git' + ':' + options.secret + '@' + args.host + ':' + options.port + '/'+ repoName;
                    command = 'git remote add ' + name + ' ' + uri;
                    console.log(command);
                    return shelljs.exec(command);
                } else {
                    return console.log('name and host required')
                }
            }

            if (args.action === 'show') {
                if (args.name) {
                    command = 'git remote show ' + args.name;
                    console.log(command);
                    shelljs.exec(command);
                } else {
                    return console.log('name required');
                }
            }

            if (args.action === 'rm') {
                if (args.name) {
                    command = 'git remote rm ' + args.name;
                    console.log(command);
                    return shelljs.exec(command);
                } else {
                    return console.log('name required');
                }
            }

            if (args.action === 'list') {
                command = 'git remote -v';
                console.log(command);
                return shelljs.exec(command);
            }

        });

};
