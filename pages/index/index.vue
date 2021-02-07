<template>
  <view class="page">
    <view v-if="buses.length !== 0" class="info-container">
      <view class="title-container">
        <image src="../../static/bus-station-1.png" mode="widthFix" class="icon-big"></image>
        <text class="title">附近的公交站:</text>
      </view>
      <view class="station-container">
        <view v-for="b in buses" class="station-info">
          <view class="station-distance">
            <text class="station-name">{{ b.stationName }}</text>
            <view class="distance-container">
              <image src="../../static/walk-1.png" mode="widthFix" class="distance-icon"></image>
              <text class="distance">{{ b.distance }}</text>
            </view>
          </view>
          <view class="lines">
            <image src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
            <text class="desc">本站线路:</text>
            <span class="bus-line" v-for="l in b.lines" @tap="directionDetail(l, 'bus')">{{ l.name }}</span>
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
            <view class="distance-container">
              <image src="../../static/walk-1.png" mode="widthFix" class="distance-icon"></image>
              <text class="distance">{{ m.distance }}</text>
            </view>
          </view>
          <view class="lines">
            <image src="../../static/metro-1.png" mode="widthFix" class="icon"></image>
            <text class="desc">本站线路:</text>
            <span class="metro-line" v-for="l in m.lines" @tap="directionDetail(l, 'metro')"
                  :style="{backgroundColor: '#' + l.lineColor}">{{ l.name }}</span>
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
  onLoad: function () {
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
  methods: {
    directionDetail: function (line, type) {
      console.log(line)
      console.log(type)
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?name=${line.name}&type=${type}`
      });
    },
  }
}
</script>

<style lang="less">
@import url("index.less");
</style>
