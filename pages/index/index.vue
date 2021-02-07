<template>
  <view class="page">
    <button @tap="stationsNear">附近</button>
    <view v-if="buses.length !== 0" class="info-container">
      <view class="title-container">
        <image src="../../static/bus-station-1.png" mode="widthFix" class="icon-big"></image>
        <text class="title">附近的公交站:</text>
      </view>
      <view class="station-container">
        <view v-for="b in buses" class="station-info">
          <view class="station-distance">
            <text class="station-name">{{ b.stationName }}</text>
            <text class="distance">{{ b.distance }}</text>
          </view>
          <view class="lines">
            <image src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
            <text class="desc">本站线路:</text>
            <span class="bus-line" v-for="(l, i) in b.lines" :key="i" @tap="busDirectionDetail(l)">{{ l.name }}</span>
          </view>
        </view>
      </view>
    </view>
    <view v-if="metros.length !== 0" class="info-container">
      <view class="title-container">
        <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon-big"></image>
        <text class="title">附近的地铁站:</text>
      </view>
      <view class="station-container">
        <view v-for="m in metros" class="station-info">
          <view class="station-distance">
            <text class="station-name">{{ m.stationName }}</text>
            <text class="distance">{{ m.distance }}</text>
          </view>
          <view class="lines">
            <image src="../../static/metro-1.png" mode="widthFix" class="icon"></image>
            <text class="desc">本站线路:</text>
            <span class="metro-line" v-for="l in m.lines" :style="{backgroundColor: '#' + l.lineColor}">{{ l.name }}</span>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      buses: [],
      metros: []
    }
  },
  onLoad() {
  },
  methods: {
    stationsNear: function () {
      let that = this;
      uni.getLocation({
        type: "gps",
        success: function (resp) {
          let lat = resp.latitude;
          let lon = resp.longitude;
          let busUrl = `${that.url.busStationsNear}?curLat=${lat}&curLon=${lon}`;
          let metroUrl = `${that.url.metroStationsNear}?curLat=${lat}&curLon=${lon}`;
          that.ajax(busUrl, "GET", null, function (resp) {
            that.buses = resp.data.data;
          })
          that.ajax(metroUrl, "GET", null, function (resp) {
            console.log(resp)
            that.metros = resp.data.data;
          })
        }
      })
    },
    busDirectionDetail: function (line) {
      console.log(line);
      uni.navigateTo({
        url: `../bus_direction_detail/bus_direction_detail?name=${line.name}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("index.less");
</style>
