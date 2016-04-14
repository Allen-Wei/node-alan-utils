/// <reference path="../scripts/config.js" />
/// <reference path="../vendor/angularjs/angular.js" />


//路由模块
(function () {
    var route = angular.module(AutoHome.ngModules.route, ["ngRoute"]);
    route.config(function ($routeProvider, $locationProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "home/home.tpl.html",
                controller: "HomeCtrl as main"
            })
            .when("/owner/bind", {
                templateUrl: "owner/owner.bind.tpl.html",
                controller: "OwnerBindCtrl as main"
            })
            .when("/owner/home", {
                templateUrl: "owner/owner.home.tpl.html",
                controller: "OwnerHomeCtrl as main"
            })
            .when("/owner/home/games/list", {
                templateUrl: "owner/owner.games.list.tpl.html",
                controller: "OwnerGamesListCtrl as main"
            })
            .when("/owner/center", {
                templateUrl: "owner/owner.center.tpl.html",
                controller: "OwnerCenterCtrl as main"
            })
            .when("/owner/center/orders", {
                templateUrl: "owner/owner.orders.tpl.html",
                controller: "OwnerOrdersCtrl as main"
            })
            .when("/owner/center/activities", {
                templateUrl: "owner/owner.activities.tpl.html",
                controller: "OwnerActivitiesCtrl as main"
            })
            .when("/buyer/home", {
                templateUrl: "buyer/buyer.home.tpl.html",
                controller: "BuyerHomeCtrl as main"
            })
            .when("/buyer/center", {
                templateUrl: "buyer/buyer.center.tpl.html",
                controller: "BuyerCenterCtrl as main"
            })
            .when("/buyer/center/orders", {
                templateUrl: "buyer/buyer.orders.tpl.html",
                controller: "BuyerOrdersCtrl as main"
            })
            .when("/buyer/center/activities", {
                templateUrl: "buyer/buyer.activities.tpl.html",
                controller: "BuyerActivitiesCtrl as main"
            })
            .when("/faq/:name", {
                templateUrl: "faq/faq.tpl.html",
                controller: "FaqCtrl as main"
            })
            .otherwise("/");

    });

})();