<template>
  <view class="title-container">
    <view class="title-block">
      <image v-if="icon !== ''" :src="icon" mode="widthFix" class="icon-big"></image>
      <span class="title">{{ title }}</span>
      <span class="desc">{{ desc }}</span>
    </view>
    <view v-if="Object.keys(location).length !== 0" class="location">
      <image src="../../static/location-1.png" mode="widthFix" class="icon"></image>
      <span class="desc city">{{ location.city }}</span>
      <span class="desc district">{{ location.district }}</span>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    desc: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    location: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="less">
@import url("title.less");
</style>
