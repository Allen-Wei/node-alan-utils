


//配置模块
(function () {
    function AutoHomeFn() {
        var prefix = "autoHome";

        //当前模式: dev, release
        this.mode = "release";
        this.appName = "AutoHomeApp";
        this.ngModules = {
            route: prefix + ".routes",
            modules: prefix + ".modules",
            services: prefix + ".services",
            directives: prefix + ".directives",
            filters: prefix + ".filters"
        };

        this.user = {
            weChatId: undefined,
            userId: undefined,
            type: undefined,
            dealerId: undefined
        };
    }

    window.AutoHome = new AutoHomeFn();
})();

