<template>
  <view class="page">
    <button @tap="stationsNear">附近</button>
    <view class="info-container">
      <view class="title-container">
        <image src="../../static/bus-station-1.png" mode="widthFix" class="icon-big"></image>
        <text class="title">附近的公交站:</text>
      </view>
      <view v-if="buses" class="station-container">
        <view v-for="b in buses" class="station-info">
          <view class="station-distance">
            <text class="station-name">{{ b.stationName }}</text>
            <text class="distance">{{ b.distance }}</text>
          </view>
          <view class="lines">
            <image src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
            <text class="desc">本站线路:</text>
            <span class="line" v-for="l in b.lines">{{ l + ", " }}</span>
          </view>
        </view>
      </view>
    </view>
    <view class="info-container">
      <view class="title-container">
        <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon-big"></image>
        <text class="title">附近的地铁站:</text>
      </view>
      <view v-if="metros" class="station-container">
        <view v-for="m in metros" class="station-info">
          <view class="station-distance">
            <text class="station-name">{{ m.stationName }}</text>
            <text class="distance">{{ m.distance }}</text>
          </view>
          <view class="lines">
            <image src="../../static/metro-1.png" mode="widthFix" class="icon"></image>
            <text class="desc">本站线路:</text>
            <span class="line" v-for="l in m.lines">{{ l + ", " }}</span>
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
      buses: [
        {
          stationName: "广粤路丰镇路", distance: "55.8 米",
          lines: ["21路-上行", "21路-下行"]
        },
        {
          stationName: "凉城路丰镇路", distance: "125.5 米",
          lines: ["874路-上行", "875路-下行", "745路-上行", "132路-下行"]
        },
      ],
      metros: [
        {
          stationName: "宝山路", distance: "1333 米",
          lines: ["3号线", "4号线"]
        }
      ],
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
          console.log(resp);
          let lat = resp.latitude;
          let lon = resp.longitude;
          let busUrl = `${that.url.busStationsNear}?curLat=${lat}&curLon=${lon}`;
          let metroUrl = `${that.url.metroStationsNear}?curLat=${lat}&curLon=${lon}`;
          that.ajax(busUrl, "GET", null, function (resp) {
            console.log(resp);
            that.buses = resp.data.data;
          })
          that.ajax(metroUrl, "GET", null, function (resp) {
            console.log(resp);
            that.metros = resp.data.data;
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
@import url("index.less");
</style>
