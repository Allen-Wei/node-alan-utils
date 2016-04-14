/// <reference path="../_config.js" />
/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../services/user.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/auth.js" />


/*
 * 车主 -> 主页
 */
angular.module(AutoHome.ngModules.modules + ".owner.home", [
    AutoHome.ngModules.services + ".activity"
])
    .controller("OwnerHomeCtrl", function ($location, $routeParams, ActivitySvc, UserSvc, ShopSvc) {
        var self = this;
        this.seriesCar = ShopSvc.confirm;
        this.user = UserSvc;
        this.activityId = ActivitySvc.activityId;

        /*
         * home: 车主主页
         * series: 更换车系车型
         * change: 更换类型为 buyer
         */
        this.screen = "home";

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

            if (self.screen === "change") {
                var reset = this.reset;
                //切换用户类型为 buyer
                UserSvc.bindCar({ carSeriesId: series.seriesId, carSpecId: car.specId, type: "buyer" })
                    .then(function (rep) {

                        rep = rep.data;
                        if (rep.success) {
                            reset();
                            $location.path("/buyer/home");

                        } else {
                            alert(rep.message);
                        }
                    });
                return;
            }
        };

        this.selectCancel = function () {
            self.screen = "home";
        };

        /*更改用户类型*/
        this.changeTypeTo = function (type) {
            var typeDescription = type === "owner" ? "用车状态" : "买车状态";
            var continueChange = confirm("确定切换到" + typeDescription);
            if (!continueChange) {
                log.i("cancel change type");
                return;
            }

            UserSvc.changeUserType(type).then(function (rep) {
                rep = rep.data;
                if (rep.success) {
                    $location.path("/buyer/home");
                    ShopSvc.updateSelectedInfo(UserSvc.info.dealerId, UserSvc.info.carSeriesId, UserSvc.info.carSpecId);
                } else {
                    log.i("更改用户类型失败: " + rep.message);
                    self.screen = "change";
                }
            });
        };


    });
