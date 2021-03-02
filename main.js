import Vue from 'vue'
import App from './App'
import txMap from './libs/qqmap-wx-jssdk.min';

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount();

// 全局接口链接
let host = "172.17.4.160";
let busBaseUrl = `http://${host}:9090/api/bus`;
let metroBaseUrl = `http://${host}:9091/api/metro`;
Vue.prototype.url = {
    bus: {
        nearbyStations: busBaseUrl + "/query/station/nearby",
        stationBasicInfo: busBaseUrl + "/query/station/basic/{}",
        lineDirectionTime: busBaseUrl + "/query/basic/{}",
        lineDirectionStations: busBaseUrl + "/query/stations/{}/{}",
        realtime: busBaseUrl + "/query/realtime",
        realtimeStationLines: busBaseUrl + "/query/realtime/station/{}",
        transferToMetro: busBaseUrl + "/query/transfer/metro",
        lineList: busBaseUrl + "/query/lines",
        lineListByKeyword: busBaseUrl + "/query/lines/keyword",
        stationList: busBaseUrl + "/query/stations",
        stationListByKeyword: busBaseUrl + "/query/stations/keyword"
    },
    metro: {
        nearbyStations: metroBaseUrl + "/query/station/nearby",
        stationBasicInfo: metroBaseUrl + "/query/station/basic/{}",
        lineBasicInfo: metroBaseUrl + "/query/basic/{}",
        lineDirectionTime: metroBaseUrl + "/query/schedule/{}",
        lineDirectionStations: metroBaseUrl + "/query/station/{}/{}",
        stationLines: metroBaseUrl + "/query/station/{}/lines",
        lineList: metroBaseUrl + "/query/lines",
        lineStationList: metroBaseUrl + "/query/station/{}",
        directionPolyline: metroBaseUrl + "/query/polyline/{}",
        stationLineWashrooms: metroBaseUrl + "/query/station/{}/washrooms/line/{}",
        stationExits: metroBaseUrl + "/query/station/{}/exits",
        transferToBus: metroBaseUrl + "/query/transfer/bus"
    }
};

Vue.prototype.txMap = txMap;

// 全局ajax方法
Vue.prototype.ajax = function (url, method, data, fun) {
    uni.request({
        url, method, data,
        // "header": {
        //     token: uni.getStorageSync("token")
        // },
        success: function (resp) {
            // if (resp.statusCode === 401) {
            //     uni.redirectTo({
            //         url: '../login/login'
            //     });
            // } else
            if (resp.statusCode === 200 && resp.data.code === 200) {
                let data = resp.data;
                // if (data.hasOwnProperty("token")) {
                //     console.log(resp.data);
                // let token = data.token;
                // uni.setStorageSync("token", token);
                // }
                fun(resp);
            } else {
                uni.showToast({
                    icon: "none",
                    title: "请求失败, 请稍后重试"
                });
            }
        }
    });
}

String.prototype.format = function () {
    let i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};
