<template>
  <view class="page">
    <view class="current-container">
      <view class="title">
        当前城市
      </view>
      <view class="city-item current">
        {{ current.cityName }}, {{ current.englishName }}
      </view>
    </view>
    <view class="support-container">
      <view class="title">
        支持的城市
      </view>
      <view class="city-item" v-for="(c, i) in cities" :key="i"
            @tap="setGlobalCity(c)">
        {{ c.cityName }}, {{ c.englishName }}
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";
import {global} from "../../common/global";

export default {
  data() {
    return {
      current: {},
      cities: []
    }
  },
  onLoad: function () {
    let that = this;
    that.current = global.GLOBAL_CITY;
    that.ajax(that.url.metadata.getCityList, constant.HTTP_METHOD_GET, null, function (res) {
      let temp = res.data.list;
      let cities = [];
      for (let c of temp)
        if (c.cityName !== global.GLOBAL_CITY.cityName)
          cities.push(c);
      that.cities = cities;
    });
  },
  methods: {
    setGlobalCity: function (c) {
      global.GLOBAL_CITY = c;
      uni.reLaunch({
        url: `../index/index?city=${JSON.stringify(c)}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("change_city.less");
</style>
