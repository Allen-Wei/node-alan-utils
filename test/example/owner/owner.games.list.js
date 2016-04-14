/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../services/activity.js" />
/// <reference path="../services/analyse.js" />
/// <reference path="../services/auth.js" />
/// <reference path="../services/services.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/utils.js" />
/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />

angular.module(AutoHome.ngModules.modules + ".owner.games.list", [AutoHome.ngModules.services])
    .controller("OwnerGamesListCtrl", function (UtilsSvc, UserSvc, ShopSvc) {
        var main = this;
        main.games = [];//游戏列表

        UtilsSvc.asyncWaitPromise(function () {
            return !UserSvc.wechat.DeveloperID;
        }, function () {
            return ShopSvc.getGames(UserSvc.wechat.DeveloperID);
        }).then(function (rep) {
            angular.forEach(rep, function (g) {
                g.Url = "/games/turnable/app.html?user={user}&activity={activity}&wechat={wechat}".format({
                    user: UserSvc.info.id,
                    activity: g.Id,
                    wechat: UserSvc.wechat.DeveloperID
                });
            });
            main.games = rep;
        }, function (error) {
            alert(error || "游戏列表获取失败");
        });
    });