<template>
  <view class="page">
    TODO: 引入地图在地图上展示线路
    <view class="title">
      <text class="line-name">{{ name }}</text>
      <text class="desc">线路详情</text>
    </view>
    <view class="direction-container">
      <view class="direction-info" v-for="d in directions" @tap="lineDirectionDetail(name, d)">
        <view class="line-and-direction">
          <text class="line-name">{{ name }}</text>
          <text class="line-direction">{{ d.direction }} 方向</text>
        </view>
        <view class="direction-detail">
          <view class="row time-row">
            <view>
              <span class="small-text first">首</span>
              <text class="small-content">{{ d.first }}</text>
            </view>
            <view>
              <span class="small-text last">末</span>
              <text class="small-content">{{ d.last }}</text>
            </view>
          </view>
          <view class="row station-row">
            <span class="small-text origin">起</span>
            <text class="small-content station" @tap.stop="stationDetail(d.origin, $event)">{{ d.origin }}</text>
          </view>
          <view class="row station-row">
            <span class="small-text dest">终</span>
            <text class="small-content station" @tap.stop="stationDetail(d.dest, $event)">{{ d.dest }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

export default {
  data() {
    return {
      name: "",
      type: "",
      directions: []
    }
  },
  onLoad: function (data) {
    let that = this;
    let name = data.name;
    let type = data.type;

    that.name = name;
    that.type = type;
    let url;
    if (type === constant.TRAVEL_TYPE_BUS) {
      url = that.url.busLineDirectionTime.format(name);
    } else if (type === constant.TRAVEL_TYPE_METRO)
      url = that.url.metroLineDirectionTime + `?`;
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (resp) {
      let dir = [];
      for (let ldt of resp.data.result.data) {
        let d = {
          direction: ldt.direction,
          origin: ldt.origin,
          dest: ldt.dest,
        }
        if (type === constant.TRAVEL_TYPE_BUS) {
          d.first = ldt.firstBus;
          d.last = ldt.lastBus;
        } else if (type === constant.TRAVEL_TYPE_METRO) {
          d.first = ldt.firstMetro;
          d.last = ldt.lastMetro;
        }
        dir.push(d);
      }
      that.directions = dir;
    })
  },
  methods: {
    lineDirectionDetail: function (name, data) {
      let dataStr = JSON.stringify(data);
      uni.navigateTo({
        url: `../line_direction_stations/line_direction_stations?name=${name}&type=${this.type}&data=${dataStr}`
      });
    },
    stationDetail: function (stationName) {
      uni.navigateTo({
        url: `../station_detail/station_detail?stationName=${stationName}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("line_direction_detail.less");
</style>
