/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../services/analyse.js" />
/// <reference path="../services/auth.js" />
/// <reference path="../services/services.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/user.js" />

angular.module(AutoHome.ngModules.modules + ".faq", [
    , AutoHome.ngModules.services + ".user"
    , AutoHome.ngModules.services + ".shop"
])
    .controller("FaqCtrl", function (UserSvc, $routeParams) {
        this.screen = $routeParams.name;
        this.navText = UserSvc.info.type === "buyer" ? "我要买车" : "我是车主";

    });