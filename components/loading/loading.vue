<template>
  <view class="container">
    <image src="../../static/loading-1.png" mode="widthFix" class="loading"></image>
    <text class="title">{{ title }}</text>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "载入中..."
    }
  }
}
</script>

<style lang="less">
@import url("loading.less");
</style>
