#!/usr/bin/env node

var fs = require('fs');
var cmdr = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var rest = require('restler');
var assertFileExists = function(inFile) {
        var instr = inFile.toString();
        if (!fs.existsSync(instr)) {
                console.log("%s does not exist. Exiting.", instr);
                process.Exit(1);
        }
        return instr;
};

var getHtml = function(htmlFile) {
        return fs.readFileSync(htmlFile);
};

var loadChecks = function(checksfile)  {
        return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtml = function(html, checksfile) {

        $ = cheerio.load(html);
        var checks = loadChecks(checksfile).sort();
        var out={};
        for (var ii in checks) {
                var present = $(checks[ii]).length > 0;
                out[checks[ii]] = present;
        }
        return out;
};

var restResponse = function(result, response) {
        if (result instanceof Error) {
                console.error('Error: ' + result)
        } else {
                var html = result;
                gradeJson(html);
        }
};

var gradeJson = function(html) {
		var checkJson = checkHtml(html, cmdr.checks);
                var outJson = JSON.stringify(checkJson, null, 4);
                console.log(outJson);
};

//var gradeJson = function(html) {
//		var checkJson = checkHtml(html, cmdr.checks);
  //      var outJson = JSON.stringify(checkJson, null, 4);
//                        console.log(outJson);
//}

//clones a function
var clone = function(fn) {
        return fn.bind({});
};


if (require.main == module) {
        cmdr
                .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists),CHECKSFILE_DEFAULT)
                .option('-f, --file <html_file>',     'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
                .option('-u, --url <url>',     'URL you want to check')
                .parse(process.argv);

	        var checkJson=null;
                if (cmdr.url==null)
                {
                        var html = getHtml(cmdr.file);
			gradeJson(html);			
                } else {
                        rest.get(cmdr.url).on('complete', restResponse);
                }

} else {
        exports.checkHtmlFile = checkHtmlFile;
}
