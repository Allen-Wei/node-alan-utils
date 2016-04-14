/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../_config.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/auth.js" />
/// <reference path="../services/activity.js" />
/// <reference path="../services/analyse.js" />
/// <reference path="../services/auth.js" />
/// <reference path="../services/services.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/utils.js" />

/*
 * 买车 -> 主页
 */
(function () {
    angular.module(AutoHome.ngModules.modules + ".buyer.home", [
        AutoHome.ngModules.services
    ])
        .controller("BuyerHomeCtrl", function ($location, $routeParams, ActivitySvc, UserSvc, ShopSvc, UtilsSvc) {
            var self = this;
            this.promotions = [];   //优惠促销列表
            this.seriesCar = ShopSvc.confirm;   //车系
            this.user = UserSvc;
            this.activityId = ActivitySvc.activityId;

            this.screen = "home";

            /*
             * 取消选择车系车型
             */
            this.selectCancel = function () {
                self.screen = "home";
            },

            /*
             * 车系选择完成后的回调
             */
            this.selectCompletely = function (series, car) {
                if (self.screen === "series") {
                    //更换车系车型
                    self.seriesCar = { series: series, car: car };
                    self.screen = "home";

                    UserSvc.changeCar(series.seriesId, car.specId)
                        .then(function (rep) {
                            rep = rep.data;
                            if (rep.success) {
                                ShopSvc.confirm.series = Object.clone(series);
                                ShopSvc.confirm.car = Object.clone(car);
                            } else {
                                alert("换车失败: " + rep.message);
                            }
                        });

                    this.reset();
                    return;
                }

            };

            //所有促销优惠
            this.allPromotionsLink = function () {
                return "http://dealer.m.autohome.com.cn/{dealer}/discount".format({
                    dealer: UserSvc.info.dealerId
                });
            }

            /*更改类型*/
            this.changeTypeTo = function (type) {
                var typeDescription = type === "owner" ? "用车状态" : "买车状态";
                var continueChange = confirm("确定切换到" + typeDescription);
                if (!continueChange) {
                    log.i("cancel change type");
                    return;
                }

                //更新用户类型
                UserSvc.changeUserType(type)
                    .then(function (rep) {
                        rep = rep.data;

                        if (rep.success) {
                            $location.path("/owner/home");
                            ShopSvc.updateSelectedInfo(UserSvc.info.dealerId, UserSvc.info.carSeriesId, UserSvc.info.carSpecId);
                        } else {
                            log.i("更改用户类型失败: " + rep.message);
                            $location.path("/owner/bind");
                        }
                    });
            };

            //查询促销优惠列表
            UtilsSvc.asyncWaitPromise(function () {
                var value = Object.query(ShopSvc, "confirm.series.seriesName");
                return !value;
            }, function () {
                return ShopSvc.getPromotions(UserSvc.info.dealerId, ShopSvc.confirm.series.seriesName);
            }).then(function (data) {
                self.promotions = data;
            });
        });
})();