
var io = require("./index.js").io;

var root = { path : "D:\\WebSites\\Autohome.Dealer.WebChat.WebApp\\release" }

var fs = require("fs");

//var read1 = fs.createReadStream("D:\\WebSites\\AngularJS\\README.md");
//var read2 = fs.createReadStream("D:\\WebSites\\AngularJS\\index.html");
//var write = fs.createWriteStream("D:\\write.html", { 'flags': 'a' });
//read1.pipe(write);
//read2.pipe(write);
//fs.unlinkSync("D:\\WebSites\\Autohome.Dealer.WebChat.WebApp\\release\\app.html");

io.concatFiles([
	"D:\\WebSites\\angular-app\\server\\config.js"
	, "D:\\WebSites\\angular-app\\server\\gruntFile.js"
	, "D:\\WebSites\\angular-app\\server\\initDB.js"
], "D:/concat.html", true);

console.log("complete");