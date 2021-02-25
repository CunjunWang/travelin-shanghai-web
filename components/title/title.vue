<template>
  <view class="title-container">
    <view class="title-row">
      <view class="title-block">
        <image v-if="icon !== ''" :src="icon" mode="widthFix" class="icon-big"></image>
        <span class="title" :style="data.titleColor !== '' ? `color: #${data.titleColor};` : ''">
          {{ title }}
        </span>
        <span class="desc">{{ data.desc }}</span>
      </view>
      <view v-if="data.city && data.district" class="location">
        <image src="../../static/location-1.png" mode="widthFix" class="icon"></image>
        <span class="desc city">{{ data.city }}</span>
        <span class="desc district">{{ data.district }}</span>
      </view>
    </view>
    <view v-if="data.englishName" class="subtitle"
          :style="data.titleColor !== '' ? `color: #${data.titleColor};` : ''">
      {{ data.englishName }}
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
    icon: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="less">
@import url("title.less");
</style>
