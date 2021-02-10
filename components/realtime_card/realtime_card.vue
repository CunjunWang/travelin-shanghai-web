<template>
  <view class="realtime-loading" v-if="loading">
    <image src="../../static/loading-1.png" mode="widthFix" class="loading"></image>
    <text>实时公交信息请求中...</text>
  </view>
  <view class="realtime-container" v-else>
    <text v-if="data.message === '等待发车'" class="realtime-data">
      暂无在途车辆, 等待起点站发车
    </text>
    <view v-else class="realtime-data">
      <view class="data-block">
        <image src="../../static/station-1.png" mode="widthFix" class="icon"></image>
        <span>还有 {{ data.stops }} 站</span>
      </view>
      <view class="data-block">
        <image src="../../static/distance-1.png" mode="widthFix" class="icon"></image>
        <span>{{ data.distanceKM }}</span>
      </view>
      <view class="data-block">
        <image src="../../static/time-1.png" mode="widthFix" class="icon"></image>
        <span>{{ data.timeMinutes }}</span>
      </view>
      <view class="data-block">
        <image src="../../static/plate-1.png" mode="widthFix" class="icon"></image>
        <span>{{ data.plateNumber }}</span>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: {}
    }
  },
}
</script>

<style lang="less">
@import url("realtime_card.less");
</style>
