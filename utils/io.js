var fs = require("fs"),
	utils = require("./utils.js"),
	nodeUtil = require("util");

var io = module.exports = {
	
	/**
	 * 获取文件名
	 * @param {string} dir 文件路径
	 * @returns {string}
	 */
	getFileName : function (dir) {
		var splits = this.combinePath(dir).split("/");
		return splits[splits.length - 1];
	},
	
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
			value = value.replace(/\/{2,}/g, "/");
			
			return value;

		};
		
		var allPaths = [];
		for (var index = 0; index < arguments.length; index++) {
			var path = arguments[index];
			path = trim(path);
			if (path === "") {
				continue;
			}
			allPaths.push(path);
		}
		return trim(allPaths.join("/"));
	},
	
	/**
	 * 合并多个文件至单个文件
	 * @param {string[]} srcs 多个源文件地址
	 * @param {string} dest 目标文件地址
	 * @param {boolean} keepSrc 
	 * @returns {} 
	 */
	concatFiles: function (srcs, dest, keepSrc) {
		srcs.forEach(function (src) {
			io.appendFile(src, dest, keepSrc);
		});
		return this;
	},
	
	/**
	 * 追加文件内容
	 * @param {string} src 源文件
	 * @param {string} dest 目标文件
	 * @param {object} options {keep: boolean, append: bolean}
	 * @returns {} 
	 */
	appendFile: function (src, dest, keepSrc) {
		
		fs.appendFileSync(dest, fs.readFileSync(src));
		
		if (!keepSrc) {
			fs.unlinkSync(src);
		}
		return this;
	},
	
	
	/**
	 * 复制文件/递归复制目录
	 * @param {string} src 源文件/目录
	 * @param {string} dest 目标文件/目录地址
	 * @returns {this}
	 */
	copy: function (src, dest) {
		var src = this.combinePath(src);
		var dest = this.combinePath(dest);
		
		if (!fs.existsSync(src)) {
			throw "src is not exist.";
		}
		
		
		var srcState = fs.statSync(src);
		
		if (srcState.isDirectory()) {
			//如果src是个目录, dest也必须是个目录.
			if (fs.existsSync(dest)) {
				if (!fs.statSync(dest).isDirectory()) {
					throw "if src is directory, dest must be direcotry too.";
				}
			} else {
				this.mkdir(dest);
			}
			
			//执行目录及目录下的文件拷贝.
			this.getFileAndDirs(src, true, function (state) {
				var leftPath = state.path.substr(src.length, state.path.length + 1);
				var destDirPath = io.combinePath(dest, leftPath);
				if (state.isFile) {
					io.writeTo(state.path, destDirPath);
				} else {
					io.mkdir(destDirPath);
				}
				return true;
			});
			return this;
		} else {
			//如果源是个文件, 执行文件拷贝.
			
			if (fs.existsSync(dest)) {
				var destState = fs.statSync(dest);
				//如果dest存在
				if (destState.isDirectory()) {
					/*
					 * 如果dest是个目录, 将dest转换成包含文件名的地址.
					 * 
					 * copy("./src/filename.ext", "./dest/")
					 * 
					 */
					dest = this.combinePath(dest, this.getFileName(src));
				}
			}
			
			this.writeTo(src, dest);
			return this;
		}

	},
	
	/**
     * 删除目录/文件
     * @param {string} dir 目录/文件 地址
     * @returns {bool} 是否删除
     */
	rm: function (dir) {
		if (!fs.existsSync(dir)) {
			return this;
		}
		
		dir = this.combinePath(dir);
		
		var dirStat = fs.statSync(dir);
		if (dirStat.isFile()) {
			fs.unlinkSync(dir);
		} else {
			fs.readdirSync(dir).forEach(function (file) {
				
				var path = io.combinePath(dir, file);
				var stat = fs.statSync(path);
				
				if (stat.isDirectory()) {
					io.rm(path);
				} else {
					fs.unlinkSync(path);
				}
			});
			fs.rmdirSync(dir);
		}
		return this;
	},
	
	/**
	 * 递归创建目录
	 * @param {string} dir 目录地址
	 */
	mkdir: function (dir) {
		if (fs.existsSync(dir)) {
			return this;
		}
		dir = this.combinePath(dir);
		var dirs = dir.split("/");
		for (var index = 0; index < dirs.length; index++) {
			var subDir = dirs.slice(0, index + 1).join("/");
			if (fs.existsSync(subDir)) {
				var subDirStat = fs.statSync(subDir);
				if (!subDirStat.isDirectory()) {
					throw subDir + " is not a directory.";
				}
			} else {
				fs.mkdirSync(subDir);
			}
		}
		return this;
	},
	
	/**
	 * 写到
	 * @param {string/array} src 源
	 * @param {string} dest 目标
	 * @returns {this}
	 */
	writeTo: function (src, dest) {
		if (nodeUtil.isArray(src)) {
			src.forEach(function (per) {
				io.writeTo(per, dest);
			});
			return this;
		}
		fs.writeFileSync(dest, fs.readFileSync(src));
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
	},
	
	/**
	 * 文本文件内容替换
	 * @param {string} file 文件路径
	 * @param {regex|string} pattern 匹配
	 * @param {string|function} replaced 替换后的文本或返回替换文本的函数
	 * 
	 * */
	replace: function(file, pattern, replaced)	{
		if(!fs.existsSync(file)){
			throw "file not found: " + file;
		}
		var fileText = fs.readFileSync(file).toString();
 		var replacedText = fileText.replace(pattern, replaced);
		 if(fileText === replacedText) { return false; }
		 fs.writeFileSync(file, replacedText);
		 return true;
	}

};

