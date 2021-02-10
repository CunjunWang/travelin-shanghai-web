<template>
  <view class="direction-info">
    <!-- TODO: 设置条件样式 :style="border ? borderStyle : {}">-->
    <view class="line-and-direction">
      <text class="line-name">{{ name }}</text>
      <text class="line-direction">{{ direction }}</text>
    </view>
    <view class="direction-detail">
      <view class="row time-row">
        <view>
          <span class="small-text first">首</span>
          <text class="small-content">{{ first }}</text>
        </view>
        <view>
          <span class="small-text last">末</span>
          <text class="small-content">{{ last }}</text>
        </view>
      </view>
      <view class="row station-row">
        <span class="small-text origin">起</span>
        <text v-if="!stationActive" class="small-content">{{ origin }}</text>
        <text v-else class="small-content station" @tap.stop="stationDetail(origin, $event)">{{ origin }}</text>
      </view>
      <view class="row station-row">
        <span class="small-text dest">终</span>
        <text v-if="!stationActive" class="small-content">{{ dest }}</text>
        <text v-else class="small-content station" @tap.stop="stationDetail(dest, $event)">{{ dest }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    },
    direction: {
      type: String,
      default: ""
    },
    first: {
      type: String,
      default: ""
    },
    last: {
      type: String,
      default: ""
    },
    origin: {
      type: String,
      default: ""
    },
    dest: {
      type: String,
      default: ""
    },
    border: {
      type: Boolean,
      default: false
    },
    stationActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      borderStyle: {
        border: "solid 1rpx #c0c0c0",
        borderRadius: "5rpx",
        marginBottom: "1rpx"
      }
    }
  },
  methods: {
    stationDetail: function (stationName) {
      uni.navigateTo({
        url: `../station_detail/station_detail?stationName=${stationName}&type=${this.type}`
      });
    },
  },
}
</script>

<style lang="less">
@import url("direction.less");
</style>
