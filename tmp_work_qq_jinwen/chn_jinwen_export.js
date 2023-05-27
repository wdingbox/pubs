// Version 2021-10-19
//

//var Uti = require("../Uti.Module").Uti
const fs = require('fs');
var path = require('path');
const net = require('net');

var Uti = {
    proc_argv2obj: function () {
        var argv = process.argv.slice(2);
        var obj = {};
        argv.forEach(function (str) {
            var pos = str.indexOf(":");
            if (pos > 0) {
                var key = str.substr(0, pos);
                var val = str.substr(1 + pos);
                obj[key] = val;
            }
            else {
                console.log("err:" + str);
            }
        });
        return { obj: obj, argv: argv };
    }
}

var DirFileUti = {
    getDirectories: function (srcpath) {
        return fs.readdirSync(srcpath).filter(function (file) {
            if ("." === file[0]) return false;
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    },
    getPathfiles: function (srcpath) {
        return fs.readdirSync(srcpath).filter(function (file) {
            if ("." === file[0]) return false;
            return fs.statSync(srcpath + '/' + file).isFile();
        });
    },

    genJs: function (srcPath, output) {
        var fary = this.getPathfiles(srcPath);
        var dary = this.getDirectories(srcPath);

        output[srcPath] = []
        for (var k = 0; k < fary.length; k++) {
            var sfl = fary[k];
            var pathfile = path.join(srcPath, sfl);
            var stats = fs.statSync(pathfile);
            var ob = {}
            ob[sfl] = stats.size
            output[srcPath].push(ob);// += stats.size;
        }
        for (var i = 0; i < dary.length; i++) {
            var spath = dary[i];
            this.genJs(path.join(srcPath, spath), output);
        }
    },
    genJs_writefile: function () {
        var output = {}
        this.genJs("./", output)
        var str = "var idxobj = " + JSON.stringify(output, null, 4)
        //console.log(output)
        fs.writeFileSync("idxobj.json.js", str, "utf8")
    }
}



function watch_dir(cbf) {
    var myArgs = process.argv.slice(2);
    var IgnoreFiles = [".", "index.html", "index.htm", "idxobj.json.js"]
    if (myArgs.length === 1) {
        var watchDir = myArgs[0]
        fs.watch(watchDir, { recursive: true }, function (eventType, filename) {
            console.log(`\n-event type: ${eventType}\n-filename: ${filename}`);
            if (filename && IgnoreFiles.indexOf(filename) < 0) {
                //console.log(`-filename provided: ${filename}`);
                setTimeout(function () {
                    if (cbf) cbf();
                }, 1000)
                if (eventType === 'remane') {
                }
            } else {
                console.log(`-filename not provided.`);
            }

        })
        return watchDir
    }
}




DirFileUti.genJs_writefile();
var ret = watch_dir(() => {
    DirFileUti.genJs_writefile();
});
console.log("v2021_10_25 watchDir:", ret)

