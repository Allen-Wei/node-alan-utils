/// <reference path="../_config.js" />
/// <reference path="../vendor/angularjs/angular.js" />

/*
 * 车主 -> 填写表单 绑定车型
 */
angular.module(AutoHome.ngModules.modules + ".owner.bind", [])
    .controller("OwnerBindCtrl", function ($location, UserSvc, CarNoSvc, ShopSvc) {
        var self = this;

        this.screen = "series"; //series, forms

        this.wechat = UserSvc.wechat;

        /*车型车系选择*/
        this.series = undefined;
        this.car = undefined;

        this.selectCancel = function () {
            self.screen = "forms";
        };
        this.selectCompletely = function (series, car) {
            self.series = series;
            self.car = car;
            self.screen = "forms";
            this.reset();
        }

        /*表单信息*/
        this.carNoLocs = [];
        this.form = {
            name: undefined,
            phone: undefined,
            carNoLoc: {},
            carNo: undefined,
            submiting: false,
            submit: function () {
                if (this.submiting) {
                    alert("表单已经提交, 请勿重复提交.");
                    return;
                }
                this.submiting = true;

                UserSvc
                    .bindCar({
                        carSeriesId: self.series.seriesId,
                        carSpecId: self.car.specId,
                        carNo: self.form.carNo,
                        userName: self.form.name,
                        phone: self.form.phone,
                        type: "owner"
                    })
                    .then(function (rep) {
                        rep = rep.data;
                        if (rep.success) {
                            ShopSvc.confirm.series = self.series;
                            ShopSvc.confirm.car = self.car;
                            $location.path("/owner/home");
                        } else {
                            alert("绑定失败: " + rep.message);
                        }
                    });
            }
        };

        //加载车牌号区域信息
        CarNoSvc.getCarNoLocs().then(function (rep) {
            self.carNoLocs = rep;
            self.form.carNoLoc = self.carNoLocs[0];
        });

    });