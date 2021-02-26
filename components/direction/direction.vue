<template>
  <view class="direction-info">
    <!-- TODO: 设置条件样式 :style="border ? borderStyle : {}">-->
    <view class="line-and-direction">
      <text class="line-name">{{ lineName }}</text>
      <text class="line-direction"
            @tap.stop="lineDirectionDetail()">{{ data.direction }}
      </text>
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
        <text v-else class="small-content station" @tap.stop="stationDetail(data.origin, $event)">
          {{ data.origin }}
        </text>
      </view>
      <view class="row station-row">
        <span class="small-text dest">终</span>
        <text v-if="!stationActive" class="small-content">{{ data.dest }}</text>
        <text v-else class="small-content station" @tap.stop="stationDetail(data.dest, $event)">
          {{ data.dest }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

export default {
  props: {
    lineName: {
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
    return {}
  },
  methods: {
    lineDirectionDetail: function () {
      let that = this;
      let data = JSON.stringify(that.data);
      uni.navigateTo({
        url: `../line_direction_stations/line_direction_stations?type=${that.type}&lineName=${that.lineName}&data=${data}`
      });
    },
    stationDetail: function (stationName) {
      let that = this;
      let url;
      if (that.type === constant.TRAVEL_TYPE_BUS)
        url = that.url.bus.stationBasicInfo.format(stationName);
      else
        url = that.url.metro.stationBasicInfo.format(stationName);
      that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
        let result = res.data.result;
        let station = {}
        Object.assign(station, result);
        uni.navigateTo({
          url: `../station_detail/station_detail?type=${that.type}&station=${JSON.stringify(station)}`
        });
      });
    },
  },
}
</script>

<style lang="less">
@import url("direction.less");
</style>
