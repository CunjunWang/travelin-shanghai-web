<template>
  <view class="page">
    TODO: 引入地图在地图上展示线路
    <view class="direction-info">
      <view class="line-and-direction">
        <text class="line-name">{{ name }}</text>
        <text class="line-direction">{{ data.direction }} 方向</text>
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
          <text class="small-content">{{ data.origin }}</text>
        </view>
        <view class="row station-row">
          <span class="small-text dest">终</span>
          <text class="small-content">{{ data.dest }}</text>
        </view>
      </view>
    </view>
    <view class="title">站点列表</view>
    <view class="station-list" v-if="stations.length !== 0">
      <view class="station-container" v-for="s in stations" @tap="stationDetail(s.stationName)">
        <view class="station-row">
          <view class="station-info">
            <text class="station-seq">{{ s.stationSeq }}.</text>
            <text class="station-name">{{ s.stationName }}</text>
          </view>
          <view class="realtime" @tap.stop="realtimeInfo(s.stationName)">实时到站</view>
        </view>
        <view class="row">
          <image src="../../static/location-1.png" mode="widthFix" class="icon"></image>
          <span class="desc city">{{ s.city }}</span>
          <span class="desc district">{{ s.district }}</span>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "123路",
      data: {
        direction: "上行",
        origin: "大柏树",
        dest: "东体育会路",
        first: "05:30",
        last: "23:30"
      },
      stations: [
        {
          busName: "21路",
          city: "上海市",
          direction: "上行",
          district: "虹口区",
          lat: "123",
          lon: "456",
          stationSeq: 1,
          stationName: "大柏树",
        },
        {
          busName: "21路",
          city: "上海市",
          direction: "上行",
          district: "虹口区",
          lat: "123",
          lon: "456",
          stationSeq: 2,
          stationName: "甘河路",
        },
        {
          busName: "21路",
          city: "上海市",
          direction: "上行",
          district: "虹口区",
          lat: "123",
          lon: "456",
          stationSeq: 3,
          stationName: "东体育会路",
        }
      ],
    }
  },
  onLoad: function (data) {
    let that = this;
    that.name = data.name;
    that.data = JSON.parse(data.data);
    let url = that.url.busLineDirectionStations.format(that.name, that.data.direction);
    that.ajax(url, "GET", null, function (res) {
      that.stations = res.data.data;
      console.log(that.stations);
    })
  },
  methods: {
    stationDetail: function (stationName) {
      uni.navigateTo({
        url: `../station_detail/station_detail?stationName=${stationName}`
      });
    },
    realtimeInfo: function (stationName) {
      // TODO:
      console.log("实时信息: " + stationName);
    }
  }
}
</script>

<style lang="less">
@import url("line_direction_stations.less");
</style>
