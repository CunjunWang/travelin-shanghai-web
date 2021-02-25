<template>
  <view>
    {{ station.stationName }} 公交换乘信息
  </view>
</template>

<script>
export default {
  data() {
    return {
      station: {},
    }
  },
  onLoad: function (d) {
    let that = this;
    that.station = JSON.parse(d.station);
  },
  methods: {}
}
</script>

<style lang="less">
@import url("transfer.less");
</style>
