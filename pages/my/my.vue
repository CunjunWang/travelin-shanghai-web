<template>
  <view>
    <button open-type="getUserInfo" @tap="login()">登录</button>
    <view class="change-city">
      <view class="title" @tap="changeCity()">切换城市</view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

export default {
  data() {
    return {}
  },
  methods: {
    login: function () {
      let that = this;
      uni.login({
        provider: constant.API_PROVIDER_WECHAT,
        success: function (resp) {
          console.log(resp);
          let wxCode = resp.code;
          uni.getUserInfo({
            provider: constant.API_PROVIDER_WECHAT,
            success: function (resp) {
              console.log(resp);
              let nickname = resp.userInfo.nickName;
              let avatarUrl = resp.userInfo.avatarUrl;
              let data = {
                wxCode, avatarUrl, nickname,
              };
              // that.ajax(that.url.register, constant.HTTP_METHOD_POST, data, function (resp) {
              //   let permissions = resp.data.permissions;
              //   uni.setStorageSync(constant.STORAGE_KEY_PERMISSIONS, permissions);
              //   uni.switchTab({
              //     url: '../index/index'
              //   });
              // });
            }
          });
        }
      });
    },
    changeCity: function () {
      uni.navigateTo({
        url: `../change_city/change_city`
      });
    }
  }
}
</script>

<style>

</style>
