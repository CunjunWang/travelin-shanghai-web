<template>
  <view class="subtitle">
    <image v-if="icon !== ''" :src="icon" mode="widthFix" class="icon"></image>
    <text class="content">{{ content }}</text>
  </view>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  }
}
</script>

<style lang="less">
@import url("subtitle.less");
</style>
