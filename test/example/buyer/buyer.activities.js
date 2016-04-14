/// <reference path="../scripts/config.js" />
/// <reference path="../scripts/log.js" />
/// <reference path="../scripts/utils.js" />
/// <reference path="../services/analyse.js" />
/// <reference path="../services/auth.js" />
/// <reference path="../services/services.js" />
/// <reference path="../services/shop.js" />
/// <reference path="../services/user.js" />
/// <reference path="../vendor/angularjs/angular.js" />
/// <reference path="../services/activity.js" />


/**
 * 
 * @description 我参与过的活动
 * @version 2016-04-08 16:37
 */
angular.module(AutoHome.ngModules.modules + ".buyer.activities", [
AutoHome.ngModules.services + ".activity"
]).controller("BuyerActivitiesCtrl", function (ActivitySvc) {
    var main = this;
    ActivitySvc.getWinAwards().then(function (rep) {
        /*
         * { success: bool, data: [{"ActivityId":9,"ActivityName":"超级幸运星","AwardName":"劳斯莱斯","Prize":3,"WinPrize":"2016-04-07T14:39:17.69","Mobile":null,"Status":3}]}
         */
        rep = rep.data;
        if (rep && rep.success) {
            main.awards = rep.data || [];

            angular.forEach(main.awards, function (item) {
                item.ActivityType = "幸运大转盘";    //活动类型

                var chineseLevels = ["零", "一", "二", "三", "四", "五", "七", "八", "九"];
                if (item.Prize === 0) {
                    item.PrizeDesc = "未中奖";
                } else {
                    item.PrizeDesc = chineseLevels[item.Prize] + "等奖 " + item.AwardName;
                }

                //未中奖 = 1,未领取 = 2,已领取 = 3
                switch (item.Status) {
                    case 1:
                        item.StatusDesc = "未中奖";
                        break;
                    case 2:
                        item.StatusDesc = "未领取";
                        break;
                    case 3:
                        item.StatusDesc = "已领取";
                        break;
                    default:
                        item.StatusDesc = "未知";
                }
            });
        } else {
            alert(rep.message);
        }
    }, function (rep) {
        log.e("获取中奖纪录失败: ", rep);
    });

});