import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()


// 全局接口链接
let busBaseUrl = "http://localhost:9090/api/bus"
let metroBaseUrl = "http://localhost:9091/api/metro"
Vue.prototype.url = {
    busStationsNear: busBaseUrl + "/query/stations/nearby",
    metroStationsNear: metroBaseUrl + "/query/stations/nearby"
}

// 全局ajax方法
Vue.prototype.ajax = function (url, method, data, fun) {
    uni.request({
        "url": url,
        "method": method,
        // "header": {
        //     token: uni.getStorageSync("token")
        // },
        "data": data,
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
