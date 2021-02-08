import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()


// 全局接口链接
let host = "169.254.61.163"
let busBaseUrl = `http://${host}:9090/api/bus`
let metroBaseUrl = `http://${host}:9091/api/metro`
Vue.prototype.url = {
    busStationsNear: busBaseUrl + "/query/stations/nearby",
    metroStationsNear: metroBaseUrl + "/query/stations/nearby",
    busLineDirectionTime: busBaseUrl + "/query/basic/",
    metroLineDirectionTime: metroBaseUrl + "/query/basic/"
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
