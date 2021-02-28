<template>
  <view class="empty-container">
    <image src="../../static/warning-1.png" mode="widthFix" class="icon-big"></image>
    <text class="message">{{ message }}</text>
  </view>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: ""
    }
  }
}
</script>

<style lang="less">
@import url("empty.less");
</style>
