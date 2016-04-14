(function () {

    window.Log = function () {
        var _modules = [];

        /**
         * 添加日志模块
         * @param {function} module function(type, ...)
         * @returns {} 
         */
        this.addModule = function (module) {
            for (var index = 0; index < _modules.length; index++) {
                if (_modules[index] === module) {
                    return;
                }
            }
            _modules.push(module);
            return this;
        };

        /**
         * 输出日志
         * @param {string} type 日志类型
         * @returns {} 
         */
        this.log = function (type) {
            var self = this;
            var args = Array.prototype.slice.call(arguments);
            _modules.forEach(function (m) {
                m.apply(self, args);
            });
            return this;
        };

        /**
         * 输出log日志
         * @returns {} 
        */
        this.w = function () {
            var args = ["log"].concat(Array.prototype.slice.call(arguments));
            return this.log.apply(this, args);
        };
        /**
         * 输出info日志
         * @returns {} 
         */
        this.i = function () {
            var args = ["info"].concat(Array.prototype.slice.call(arguments));
            return this.log.apply(this, args);
        };
        /**
         * 输出error日志
         * @returns {} 
         */
        this.e = function () {
            var args = ["error"].concat(Array.prototype.slice.call(arguments));
            return this.log.apply(this, args);
        };


        /**
         * 控制台日志模块
         * @param {} type 
         * @returns {} 
         */
        this.console = function (type) {
            var args = Array.prototype.slice.apply(arguments, [1, arguments.length]);
            var print = console[type] || console.log;
            print.apply(console, args);
            return this;
        };

        /**
         * ajax日志模块
         * @param {string} type 类型
         * @returns {} 
         */
        this.ajax = function (type) {

            var args = arguments;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/Api/Tools/Log", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(args));
            return this;
        };
    };

    window.log = new Log();
    log.addModule(log.console);

})();