console.log("run test.js...");

var fs = require("fs"), 
	io = require("./utils/io.js");


console.log("combinePath: ", io.combinePath("./test/backup", "/dir1/", "/dir2", "dir3/"));


console.log("copy: ");
io.copy("./test/example", "./test/dest/example");



io.getFileAndDirs("./test/dest/example", true, function (state) {
	console.log("./test/dest/example dir or file: ", state.path);
	return true;
});


console.log("make dir: ");
io.mkdir("./test/dest/mkdir/hello/world/toping/bing");

console.log("copy file: ");
io.copy("./test/dest/example/app.js", "./test/dest/mkdir");
io.copy("./test/dest/example/app.js", "./test/dest/mkdir/index.js");
io.copy("./test/dest/example/app.js", "./test/dest/mkdir/home.js");

console.log("concat file: ");
io.concatFiles([
	"./test/dest/mkdir/app.js",
	"./test/dest/mkdir/index.js",
	"./test/dest/mkdir/home.js"
], "./test/dest/mkdir/concat.js", true);

console.log("find fiels:");
var jsFiles = io.getFiles("./test/dest", true).filter(function (fn) {
	return fn.indexOf(".js") !== -1;
}).map(function (fn) {
	return io.combinePath(fs.realpathSync(fn));
});

console.log(jsFiles);

console.log("complete.");