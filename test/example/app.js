/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="services/auth.js" />
/// <reference path="services/shop.js" />
/// <reference path="services/user.js" />
/// <reference path="routes/routes.js" />
/// <reference path="scripts/config.js" />
/// <reference path="scripts/log.js" />


/*获取参数*/
(function () {
    var paras = {
        weChatId: undefined,
        userId: undefined,
        type: undefined
    };



    var errorRedirectUrl = "error.html";


    paras.weChatId = location.params(location.href, "wechat") || document.getCookie("wechat");
    paras.userId = location.params(location.href, "user") || document.getCookie("user");
    paras.type = location.params(location.href, "type") || document.getCookie("type");

    if (!paras.weChatId) {
        location.href = errorRedirectUrl + "?msg=" + encodeURI("微信公众号标识(wechat)数不能为空");
    }
    if (!paras.userId) {
        location.href = errorRedirectUrl + "?msg=" + encodeURI("微信用户标识(user)参数不能为空");
    }
    if (!paras.type) {
        log.e("用户类型(type)参数不能为空");
    }
    if (paras.type !== "buyer" && paras.type !== "owner") {
        log.e("用户类型必须是我要买车(buyer)或者我是车主(owner)参数不能为空");
    }

    AutoHome.user.weChatId = paras.weChatId;
    AutoHome.user.userId = paras.userId;
    AutoHome.user.type = paras.type;


    //添加ajax日志模块
    log.addModule(log.ajax);
})();



/*
 * App Startup
 */
(function () {

    var app = angular.module(AutoHome.appName, [
        AutoHome.ngModules.route                //路由模块
        , AutoHome.ngModules.services
        , AutoHome.ngModules.filters
        , AutoHome.ngModules.directives

        , AutoHome.ngModules.modules + ".home"    //首页模块
        , AutoHome.ngModules.modules + ".owner"   //车主
        , AutoHome.ngModules.modules + ".buyer"   //买车
        , AutoHome.ngModules.modules + ".faq"     //用车指南, 买保险, 贷款说明
    ]);

    //执行认证模块
    app.run(function ($location, $rootScope, $route, AuthSvc, ShopSvc, UserSvc) {
        AuthSvc.working = false;
        AuthSvc
            .setIsInRole(function (roles) {
                //如果 用户类型为空 则用户属于 anonymous 角色用户
                var role = UserSvc.info.type || "anonymous";
                return roles.indexOf(role) !== -1;
            })
            //> / 只允许 anonymouse 用户访问
            .map("/", "anonymous", function () {
                $location.path("/{0}/home".format([UserSvc.info.type]));
            })
            //> 只允许 buyer 访问
            .map("/buyer/home", "buyer", "/")
            //> 只允许 owner 访问
            .map(["/owner/home", "/owner/center", "/owner/center/activities", "/owner/center/orders"], "owner", "/")

            .map("/owner/bind", ["anonymous", "buyer"], "/owner/home");
    });

    app.controller("BodyCtrl", function (UserSvc, ShopSvc, AuthSvc, $location, $route) {

        this.dev = {
            user: UserSvc,
            shop: ShopSvc
        };

        //查询用户
        UserSvc.login(AutoHome.user.weChatId, AutoHome.user.userId).then(function (rep) {
            rep = rep.data;

            var userType = rep.type || AutoHome.user.type;

            AuthSvc.working = true;

            if (userType) {
                //当前用户类型已经确定
                if (rep.userCarId && rep.userCarId > 0) {
                    var ctrl = AuthSvc.getCurrentCtrl();
                    AuthSvc.auth(ctrl);

                    //更新车信息
                    ShopSvc.updateSelectedInfo(UserSvc.info.dealerId, UserSvc.info.carSeriesId, UserSvc.info.carSpecId);
                } else {
                    if (userType === "buyer") {
                        $location.path("/").search({
                            screen: "buyer"
                        });
                    } else {
                        $location.path("/owner/bind");
                    }
                }
            } else {
                //前去选择用户类型
                $location.path("/");
            }
        }, function () {
            alert("用户查询失败");
            //location.href = "error.html?msg=" + encodeURI("用户查询失败");
        });
    });


})();