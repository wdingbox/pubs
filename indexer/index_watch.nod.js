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


function gen_htm(obj) {
    var localhostbase = obj.localhostbase;
    var machine = "/Users/weiding/Sites";
    var urlbase = "http://localhost/";
    var localurl = "http://localhost//weidroot/weidroot_2017-01-06/app/bitbucket/wdingsoft/utis/zfrqCalc/htm/index.htm";

    var htm = `
<HTML>
    <HEAD>
        <TITLE>idxr</TITLE>
        <META http-equiv="Content-Type" content="text/html;" charset="UTF-8">
        <META name="viewport" content="width=device-witdh, initial-scale=1, maximum-scale=1, user-scale=0">
        <base target="_blank" />
    
        <script src="https://wdingbox.github.io/assetjs/libs/jq/jquery-2_1_3.min.js"></script>
        <script src="https://wdingbox.github.io/assetjs/libs/table/table_sorter.js"></script>
        <script src="https://wdingbox.github.io/assetjs/libs/table/table_indexer.js"></script>
        <script src="https://wdingbox.github.io/assetjs/libs/table/Pinyin7kzi.js?v=2"></script>

        <script src="./index.js"></script>

      
        <style>
        #paneltoggler, #panel{
            position:fixed;
            background-color: lightblue;
        }
        #paneltoggler{
            right:20px;
        }
        #explorePanel{
            margine-top:100px;
            padding-top:100px;
        }
        #hilipathfile{
            width: 100%;
        }

            textarea {
                width: 500px;
                height: 500px;
            }
            .dir{
                display:block;
            }
            ol{
                left:10px;
            }
            .collapse{
                visibility:hidden;
                display: none;
            }
            .expand{
                visibility:visible;
            }
            .pathdir_expand{
                background-color:cyan;
            }
            .Mark{
                background-color:red;
            }
            .RemeberClosed{
                background-color:lightgrey;

            }
            .file_open_Mark{
                background-color:pink;
            }
            .toggleMarkFile{
                background-color:lightgreen;
            }

            .hili{
                background-color:lightgreen;
            }
            .HideItm{
                display: none;
                visibility: hidden;
                
            }
            xa[href]{
                background-color:cyan;
            }
            xxspan{
                display:block;
            }
            
        </style>
    
        <script>
            function init_localhost_anchor(){
                if(!localStorage.localhostbase){
                    localStorage.localhostbase = ${localhostbase};//"/weidroot/";
                }
                var curUrl = ""+window.location.href;
                var posi = curUrl.indexOf(localStorage.localhostbase);
                var localhost = "http://localhost/"+curUrl.substr(posi);
                $("#panel").prepend(\`<input value='\${localStorage.localhostbase}'></input><a onclick="localStorage.localhostbase=$(this).prev().val();">*</a><a href='\${localhost}'>\${localhost}</a><br>\`);
            };///////////////

            $(function () {
                init_localhost_anchor();

                $("#paneltoggler").click(function(){
                    $("#panel").toggle();
                });

                $(".base").click(function(){
                    var base = $(this).text();
                    var sdir = $(this).prev().text();
                    $(this).attr("href", sdir+base);
                })

                $(".dir").click(function(){
                    var spath = $(this).find("a:eq(0)").attr("path");
                    $("#hilipathfile").val(spath);
                });
                $(".dirNode").click(function(){
                    $(this).parent().next().toggleClass("collapse");
                    $(this).toggleClass("pathdir_expand");
                    var totDir = $(this).parent().next().find("ol").length;
                    var totFile = $(this).parent().next().find("li").length;
                    var totSize=0;
                    $(this).parent().next().find(".fsize").each(function(){
                        totSize += parseInt( $(this).text() );
                    })
                    $(this).parent().find(".totInfo").text(" dir:" + totDir.toLocaleString()+", file:"+totFile.toLocaleString() +", size:"+totSize.toLocaleString());
                })
                $(".NumFiles").click(function(){
                    $(this).parent().next().children("li").toggleClass("collapse");
                    $(this).toggleClass("RemeberClosed");
                });
                $(".NumDirs").click(function(){
                    $(this).parent().next().children("span").toggleClass("collapse");
                    $(this).toggleClass("RemeberClosed");
                });
                $(".file").click(function(){
                    $(".file_open_Mark").removeClass("file_open_Mark");
                    $(this).addClass("file_open_Mark");
                })
                $(".lifile").click(function(){
                    $(this).toggleClass("toggleMarkFile");
                })

                $(".idx").click(function(){
                    $(this).toggleClass("hili");
                    var sdir0 = $(this).next().text();
                    $(".dir").not(".hili").each(function(i){
                        if(0===i) return;
                        var sdir = $(this).text();
                        if(sdir0 === sdir){
                            $(this).parent().toggleClass("HideItm");
                        }
                    })
                });
            });
        </script>
    </HEAD>
    
    <body>
    <button id="paneltoggler">+</button>
    <div id="panel">
    <input readonly id="hilipathfile" value="generated by: ${module.filename}"></input>
    <a>totDirs: ${obj.m_totDirs.toLocaleString()}, totFiles: ${obj.m_totFiles.toLocaleString()}, size: ${obj.m_totSize.toLocaleString()} B</a><br>
    <a href='./indexer/github_home.htm'>github_home.htm</a>
    </div>

    <div id="explorePanel">
    ${obj.m_olis}
    </div>
    </body>
</HTML>`;//////==htm
    return htm;
}


var DirFileUti = {
    output: {
        m_olis: "",
        m_totSize: 0,
        m_totFiles: 0,
        m_totDirs: 0,
        reset: function () {
            this.m_olis = ""
            this.m_totSize = this.m_totFiles = m_totDirs = 0
        }
    },
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
    getFary: function (srcPath, output) {
        var fary = this.getPathfiles(srcPath);
        var dary = this.getDirectories(srcPath);

        output.m_totDirs += dary.length;
        output.m_totFiles += fary.length;
        var nodnam = path.basename(srcPath);
        if (nodnam === ".") nodnam = "[ . / ]";
        output.m_olis += `<span class='dir'><a class='dirNode' path='./${srcPath}'>${nodnam}</a> <a class='NumDirs'>( ${dary.length}</a> / <a class='NumFiles'>${fary.length} )</a><a class='totInfo'></a></span>\n
        <ol class='collapse'>\n`;
        for (var i = 0; i < dary.length; i++) {
            var spath = dary[i];
            //console.log(spath)
            this.getFary(path.join(srcPath, spath), output);
        }
        for (var k = 0; k < fary.length; k++) {
            var sfl = fary[k];
            var pathfile = path.join(srcPath, sfl);
            var stats = fs.statSync(pathfile);
            output.m_totSize += stats.size;
            output.m_olis += `<li class='lifile'><a class='file' href='${pathfile}'>${sfl}</a>  (<a class='fsize'>${stats.size.toLocaleString()}</a> B)</li>\n`;
        }
        output.m_olis += "</ol>";
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
        var str = "var indobj = " + JSON.stringify(output, null, 4)
        console.log(output)
        fs.writeFileSync("indobj.json.js", str, "utf8")
    }
}

function update_indxhtm() {

    var fname = "index.htm";

    var obj = DirFileUti.output;
    obj.reset()
    DirFileUti.getFary("./", obj);
    obj.localhostbase = "/weidroot/";
    fs.writeFileSync(fname, gen_htm(obj), "utf8");
    console.log("Update: " + fname);

    var jsfname = "indusr.js";
    if (!fs.existsSync(jsfname)) {
        fs.writeFileSync(jsfname, "//for local users only.\n", "utf8");
    }
}

function watch_dir(cbf) {
    var myArgs = process.argv.slice(2);
    var IgnoreFiles = [".", "index.html", "index.htm", "indobj.json.js"]
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




update_indxhtm();
DirFileUti.genJs_writefile();
var ret = watch_dir(() => {
    update_indxhtm();
    DirFileUti.genJs_writefile();
});
console.log("watchDir:", ret)

