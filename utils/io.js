var fs = require("fs"),
	utils = require("./utils.js");

var io = {
	
	/**
	 * 合并路径
	 * @returns {} 
	 */
	combinePath: function () {
		var trim = function (value) {
			if (typeof (value) !== "string" || /^\s*$/g.test(value)) {
				throw "path is empty";
			}
			value = value.replace(/\\/g, "/");
			if (value[value.length - 1] === "/") {
				value = value.substr(0, value.length - 1);
			}
			return value;
		};
		
		var allPaths = [];
		for (var index = 0; index < arguments.length; index++) {
			var path = arguments[index];
			path = trim(path);
			allPaths.push(path);
		}
		return allPaths.join("/");
	},
	
	/**
	 * 合并多个文件至单个文件
	 * @param {string[]} srcs 多个源文件地址
	 * @param {string} dest 目标文件地址
	 * @param {boolean} keepSrc 
	 * @returns {} 
	 */
	concatFiles: function (srcs, dest, keepSrc) {
		var option = {
			keep: keepSrc,
			writeFlags: "a"
		};
		srcs.forEach(function (src) {
			io.moveFile(src, dest, option);
		});
		return this;
	},
	
	/**
	 * 拷贝/移动文件
	 * @param {string} src 源文件
	 * @param {string} dest 目标文件
	 * @param {object} options {keep: boolean, append: bolean}
	 * @returns {} 
	 */
	moveFile: function (src, dest, options) {
		var defOpts = {
			keep: false,
			writeFlags: "w"
		};
		utils.extend(defOpts, options);
		
		var read = fs.createReadStream(src);
		
		var writeOpt = {
			flags: options.writeFlags
		}
		var write = fs.createWriteStream(dest, writeOpt);
		read.pipe(write);
		if (!options.keep) {
			fs.unlinkSync(src);
		}
		return this;
	},
	
	/**
     * 删除目录
     * @param {string} dir 目录
     * @param {boolean} force 是否强制(递归)删除
     * @returns {this} 
     */
	rm: function (dir, force) {
		dir = this.combinePath(dir);
		
		if (!force) {
			fs.rmdirSync(dir);
			return this;
		}
		
		fs.readdirSync(dir).forEach(function (file) {
			var path = io.combinePath(dir, file);
			var stat = fs.statSync(path);
			
			if (stat.isDirectory()) {
				io.rm(path, force);
			} else {
				fs.unlinkSync(path);
			}
		});
		io.rm(dir, false);
		return this;
		
	},
	
	/**
     * 获取所有文件
     * @param {string} path 目录地址
     * @param {boolean} recurse 是否递归获取
     * @returns {string[]} 
     */
	getFiles: function (path, recurse) {
		var files = [];
		
		this.getFileAndDirs(path, recurse, function (item) {
			if (item.isFile) {
				files.push(item.path);
			}
			return true;
		});
		return files;
	},
	
	/**
	 * 获取所有子目录
	 * @param {string} path 目录地址
	 * @param {boolean} recurse 递归获取
	 * @returns {string[]} 
	 */
	getDirs: function (path, recurse) {
		var dirs = [];
		
		this.getFileAndDirs(path, recurse, function (item) {
			if (item.isDir) {
				dirs.push(item.path);
			}
			return true;
		});
		return dirs;
	},
	
	/**
     * 获取目录下的文件/目录列表
     * @param {object} dir {path:string, isFile: boolean, isDir: boolean, children:[]}
     * @param {boolean} recurse 是否递归查询
     * @param {function} filter 过滤器回调函数 filter(dir, root)
     * @returns {} 
     */
	getFileAndDirs: function (dir, recurse, filter) {
		
		if (typeof (dir) === "string") {
			dir = {
				path: dir,
				isFile: false,
				isDir: true
			};
		}
		if (typeof (dir) !== "object") {
			throw "param dir must be a string or an object.";
		}
		
		if (typeof (filter) !== "function") {
			filter = function () { return true; };
		}
		
		
		var fileAndDirs = fs.readdirSync(dir.path);
		var dirStat = fs.statSync(dir.path);
		dir.isDir = dirStat.isDirectory();
		dir.isFile = dirStat.isFile();
		dir.stat = dirStat;
		
		dir.children = [];
		
		for (var index = 0; index < fileAndDirs.length; index++) {
			var fileAndDir = fileAndDirs[index];
			
			var path = io.combinePath(dir.path, fileAndDir);
			var stat = fs.statSync(path);
			
			var item = {
				path: path,
				stat: stat,
				isFile: stat.isFile(),
				isDir: stat.isDirectory()
			};
			if (filter.apply(io, [item, dir])) {
				dir.children.push(item);
				
				if (item.isDir) {
					io.getFileAndDirs(item, recurse, filter);
				}
			}
			
		}
		
		return dir;
	}

};

module.exports = io;