/* manifest commander component
 * To use add require('../cmds/manifest.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var path = require('path');
var shelljs = require('shelljs');
var hogan = require('hogan');
var prettyjson = require('prettyjson');
var prompt = require('prompt');

module.exports = function(program) {
    var name, environment, host, options, template;

    name = program.distro.package.name ? program.distro.package.name + '-' + program.config.get('id') : program.config.get('id');
    host = program.distro.package.name ? program.distro.package.name + '.com' : 'example.com';
    environment = {};


    template =  hogan.compile(shelljs.cat(path.resolve(__dirname, '..', 'templates', 'manifest.json')));


    function toContinue(message,callback){
        prompt.get({
            properties: {
                toContinue: {
                    description: message.green
                }
            }
        }, function (err, result) {
            if (result.toContinue.toUpperCase() !== 'Y'){
                process.exit(0)
            } else {
                callback();
            }

        });
    }

    function env(val, memo) {
        var eVar;
        eVar = val.split('=');
        if (eVar.length == 2) {
            environment[eVar[0]] = eVar[1];
        }

        return JSON.stringify(environment);
    }

    function writeManifest(prompt, manifest, callback){
        if (!prompt){
            shelljs.echo(manifest).to(program.distro.manifestFile);
            callback();
        } else {
            console.log('New Manifest:'.green);
            console.log(manifest);
            toContinue('Write this manifest?', function(){
                shelljs.echo(manifest).to(program.distro.manifestFile);
                callback();
            })
        }

    }

    function saveName(name){
        console.log('Name saved', name);
        program.config.set("name", name);
        program.config.save();
    }

    function isManifest(){
        if (!shelljs.test('-f', program.distro.manifestFile)){
            return false;
        }
        console.log('Existing Manifest:'.green);
        console.log(shelljs.cat(program.distro.manifestFile));
        return true;
    }

    program
		.command('manifest-gen')
		.version('0.0.1')
		.description('Manifest management')
        .option('-n, --name <value> ', 'The name of the manifest')
        .option('-i, --instances [value]', 'Number of instances to run total; * runs 1 on every minion', '*')
        .option('-l, --load [value]', 'The relative load between 0..1', 1)
        .option('-d, --domain <value>', 'The domain used for routing, i.e app.example.com')
        .option('-m, --main <value>', 'The main script to run, examples: index.js|app.js|server.js')
        .option('-e, --env [value]', 'Environment <key>=<value> pairs can be listed more than once', env,'PORT=RANDOM_PORT')
        .option('-o, --overwrite', 'If present will automatically overwrite the existing manifest without prompting')
		.action(function(options){
            if(!(options.name && options.domain && options.main)){
                console.log('\n  name, domain, and main are required');
                return options.help();
            } else {
                if (!program.config.get('id')){
                    return console.log('\nRepo not initialized; call "mako-cli init"');
                }
                options.id = program.config.get('id');
                var manifest = template.render(options);
                if (!options.overwrite && isManifest()){
                    toContinue('Manifest found, do you want to continue? (Y)', function(){
                        writeManifest(true, manifest, function(){
                            saveName(options.name);
                        });
                    });
                } else {
                    writeManifest(false, manifest, function(){
                        saveName(options.name);
                    });
                }
            }

		});

};
