<template>
  <view>
    <button open-type="getUserInfo" @tap="login()">登录</button>
    <view>
      <view class="change-city">
        <view class="title">切换城市</view>
      </view>
      <picker-view v-if="visible" :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
        <picker-view-column>
          <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="(item,index) in months" :key="index">{{item}}月</view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="(item,index) in days" :key="index">{{item}}日</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

export default {
  data() {
    return {
      cities: [
        {
          name: '上海市',
          englishName: 'Shanghai'
        },
        {
          name: '杭州市',
          englishName: 'Hangzhou'
        }
      ]
    }
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
    }
  }
}
</script>

<style>

</style>
