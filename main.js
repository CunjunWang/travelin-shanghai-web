import Vue from 'vue'
import App from './App'
import bus from "./pages/bus/bus";

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// 全局接口链接
let host = "172.20.10.3"
let busBaseUrl = `http://${host}:9090/api/bus`
let metroBaseUrl = `http://${host}:9091/api/metro`
Vue.prototype.url = {
    busStationsNear: busBaseUrl + "/query/stations/nearby",
    metroStationsNear: metroBaseUrl + "/query/stations/nearby",
    busLineDirectionTime: busBaseUrl + "/query/basic/{}",
    metroLineDirectionTime: metroBaseUrl + "/query/basic/{}",
    busLineDirectionStations: busBaseUrl + "/query/stations/{}/{}",
    metroLineDirectionStations: metroBaseUrl + "/query/stations/{}/{}",
    busRealtime: busBaseUrl + "/query/realtime",
    busRealtimeStationLines: busBaseUrl + "/query/realtime/station/{}"
}

// 全局ajax方法
Vue.prototype.ajax = function (url, method, data, fun) {
    uni.request({
        url, method, data,
        // "header": {
        //     token: uni.getStorageSync("token")
        // },
        success: function (resp) {
            fun(resp)
            // if (resp.statusCode === 401) {
            //     uni.redirectTo({
            //         url: '../login/login'
            //     });
            // } else if (resp.statusCode === 200 && resp.data.code === 200) {
            //     let data = resp.data;
            //     if (data.hasOwnProperty("token")) {
            //         console.log(resp.data);
            //         let token = data.token;
            //         uni.setStorageSync("token", token);
            //     }
            //     fun(resp);
            // } else {
            //     uni.showToast({
            //         icon: "none",
            //         title: resp.data
            //     });
            // }
        }
    });
}

String.prototype.format = function () {
    let i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};
