<template>
  <view>
    {{ station }}-出入口信息
  </view>
</template>

<script>
export default {
  data() {
    return {
      station: "",
    }
  },
  onLoad: function (d) {
    let that = this;
    that.station = d.stationName;
  },
  methods: {}
}
</script>

<style lang="less">
@import url("exit.less");
</style>
