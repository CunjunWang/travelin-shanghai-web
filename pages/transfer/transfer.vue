<template>
  <view>
    {{ station }} 公交换乘信息
  </view>
</template>

<script>
export default {
  data() {
    return {
      station: "",
      stationInfo: {},
      latLon: {}
    }
  },
  onLoad: function (d) {
    let that = this;
    that.station = d.stationName;
    that.stationInfo = JSON.parse(d.stationInfo);
    that.latLon = JSON.parse(d.latLon);
  },
  methods: {}
}
</script>

<style lang="less">
@import url("transfer.less");
</style>
