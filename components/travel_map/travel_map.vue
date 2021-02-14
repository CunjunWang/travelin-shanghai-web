<template>
  <view class="map-container">
    <map class="map"
         :longitude="location.lon"
         :latitude="location.lat"
         scale='16'
         show-location>
    </map>
  </view>
</template>

<script>
import {secret} from "../../common/secret";

let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
let qqMapSdk;

export default {
  props: {
    location: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {}
  },
  onLoad: function () {
    // 实例化API核心类
    qqMapSdk = new QQMapWX({
      key: secret.WX_MAP_KEY
    });
  },
  methods: {}
}
</script>

<style lang="less">
@import url("travel_map.less");
</style>
