/* manifest commander component
 * To use add require('../cmds/manifest.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var request = require('request');

module.exports = function(program) {

    function displayHelp(){
        console.log('  Commands:');
        console.log();
        console.log('    $ manifest rm - removes the manifest file from the master');
        console.log('    $ manifest show - displays the contents of the manifest file');
        console.log('    $ manifest push - push the contents of the manifest file to the master');
        console.log();
        process.exit();
    }

    function req(options,callback){
        var repoName = program.config.get('name') + '-' + program.config.get('id');
        var manifestFile = {};
        var protocol = 'http://';
        manifestFile.file = repoName;
        manifestFile.manifest = JSON.parse(shelljs.cat(program.distro.manifestFile));

        var params = {
            uri: protocol + 'git' + ':' + options.secret + '@' + options.host + ':' + options.port + options.path
        };
        if (options.json){
            params.json = options.json;
        }
        request(params, function(err, res, body) {
            if (err){
                return callback(err);
            } else {
                return callback(null,{status:res.statusCode, body:body} );
            }
        });
    }

    program
        .command('manifest <action>')
        .version('0.0.1')
        .description('Simple manifest management')
        .option('-h, --host <value> ', 'The master hostname')
        .option('-p, --port [value]', 'The master port', 4000)
        .option('-s, --secret [value]', 'The master secret', 'shortfin')
        .action(function(args, options){
            if (!args.length){
                displayHelp();
            }

            if(!(options.host && options.secret)){
                console.log('\n  host and secret are required');
                return options.help();
            } else {

                var manifestFile = {};
                manifestFile.file = repoName;
                manifestFile.manifest = JSON.parse(shelljs.cat(program.distro.manifestFile));

                if (args.action === 'push') {
                    options.path = '/manifestFile';
                    options.json = manifestFile;
                    req(options, function(err, result){
                        if (err){
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    });
                }

                if (args.action === 'rm') {
                    options.path = '/manifestFile/remove';
                    options.json = manifestFile;
                    req(options, function(err, result){
                        if (err){
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    });
                }

                if (args.action === 'show') {
                    options.path = '/manifest';
                    req(options, function(err, result){
                        if (err){
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    });
                }
            }
        }).on('--help', displayHelp);

};
