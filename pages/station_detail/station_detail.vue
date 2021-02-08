<template>
  <view>
    {{ stationName }} 站点信息
  </view>
</template>

<script>
export default {
  data() {
    return {
      stationName: "",
    }
  },
  onLoad: function (data) {
    this.stationName = data.stationName;
  },
  methods: {}
}
</script>

<style lang="less">
@import url("station_detail.less");
</style>
