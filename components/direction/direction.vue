<template>
  <view class="direction-info">
    <!-- TODO: 设置条件样式 :style="border ? borderStyle : {}">-->
    <view class="line-and-direction">
      <text class="line-name">{{ name }}</text>
      <text class="line-direction"
            @tap.stop="lineDirectionDetail(name, data)">{{ data.direction }}</text>
    </view>
    <view class="direction-detail">
      <view class="row time-row">
        <view>
          <span class="small-text first">首</span>
          <text class="small-content">{{ data.first }}</text>
        </view>
        <view>
          <span class="small-text last">末</span>
          <text class="small-content">{{ data.last }}</text>
        </view>
      </view>
      <view class="row station-row">
        <span class="small-text origin">起</span>
        <text v-if="!stationActive" class="small-content">{{ data.origin }}</text>
        <text v-else class="small-content station" @tap.stop="stationDetail(data.origin, $event)">{{ data.origin }}</text>
      </view>
      <view class="row station-row">
        <span class="small-text dest">终</span>
        <text v-if="!stationActive" class="small-content">{{ data.dest }}</text>
        <text v-else class="small-content station" @tap.stop="stationDetail(data.dest, $event)">{{ data.dest }}</text>
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
    data: {
      type: Object,
      default: {}
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
    lineDirectionDetail: function (name, data) {
      let dataStr = JSON.stringify(data);
      console.log(name);
      uni.navigateTo({
        url: `../line_direction_stations/line_direction_stations?name=${name}&type=${this.type}&data=${dataStr}`
      });
    },
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
