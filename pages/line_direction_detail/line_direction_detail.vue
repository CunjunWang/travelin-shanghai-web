<template>
  <view class="page">
    <!--    v-if="polyline.length !== 0"-->
    <map class="map-container"
         :longitude="lon"
         :latitude="lat"
         :scale='scale'
         :polyline="polyline"
         :include-points="includePoints"
         show-location>
    </map>
    <view class="title-container">
      <title
          :icon="'../../static/line-1.png'"
          :title="name"
          :desc="'线路详情(点击方向查看线路走向)'">
      </title>
    </view>
    <view class="direction-container">
      <direction
          v-for="(d, i) in directions" :key="i"
          :name="name"
          :type="type"
          :data="d"
          :border="true"
          :station-active="true"
          @tap="showRoute(d)">
      </direction>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";
import {secret} from "../../common/secret";

import Title from "../../components/title/title"
import Direction from "../../components/direction/direction"

let txMap = require('../../libs/qqmap-wx-jssdk.min')
let map = new txMap({
  key: secret.WX_MAP_KEY,
});

export default {
  components: {
    Title,
    Direction
  },
  data() {
    return {
      name: "",
      type: "",
      lat: "",
      lon: "",
      curOrigin: "",
      curDest: "",
      scale: 16,
      originLocation: {},
      destLocation: {},
      directions: [],
      polyline: [],
      includePoints: []
    }
  },
  onLoad: function (data) {
    let that = this;

    uni.getLocation({
      type: constant.LOCATION_TYPE_GPS,
      success: function (resp) {
        that.lat = resp.latitude;
        that.lon = resp.longitude;
      }
    });

    let name = data.name;
    let type = data.type;
    that.name = name;
    that.type = type;
    let url;
    if (type === constant.TRAVEL_TYPE_BUS) {
      url = that.url.busLineDirectionTime.format(name);
    } else if (type === constant.TRAVEL_TYPE_METRO)
      url = that.url.metroLineDirectionTime.format(name);
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (resp) {
      let dir = [];
      for (let ldt of resp.data.result) {
        let d = {}
        Object.assign(d, ldt);
        if (that.type === constant.TRAVEL_TYPE_METRO)
          d.color = ldt.color;
        dir.push(d);
      }
      that.directions = dir;
      that.getStationInfo(dir[0]);
    });
  },
  methods: {
    // TODO: 这里有选择线路的bug
    showRoute: function (d) {
      let that = this;
      if (d.origin !== that.curOrigin && d.dest !== that.curDest) {
        that.curDirection = d.direction;
        that.getStationInfo(d);
      }
      map.direction({
        mode: 'transit',
        from: that.originLocation,
        to: that.destLocation,
        policy: 'LEAST_TRANSFER',
        success: function (res) {
          let route = res.result.routes[0];
          let steps = route.steps;
          let lines = [];
          for (let step of steps)
            if (step.mode === 'TRANSIT') {
              lines = step.lines;
              break;
            }
          console.log(lines);
          let coors = lines[0].polyline;
          let pl = [];
          // 坐标解压（返回的点串坐标，通过前向差分进行压缩）
          let kr = 1000000;
          for (let i = 2; i < coors.length; i++)
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          // 将解压后的坐标放入点串数组pl中
          for (let i = 0; i < coors.length; i += 2)
            pl.push({latitude: coors[i], longitude: coors[i + 1]});
          that.polyline = [
            {
              points: pl,
              color: '#555555',
              width: 4
            }
          ]
          let bounds = route.bounds.split(',');
          let pts = [];
          for (let i = 0; i < bounds.length; i += 2)
            pts.push({latitude: bounds[i], longitude: bounds[i + 1]});
          that.includePoints = pts;
        },
        fail: function (err) {
          console.log(err);
        }
      });
    },
    getStationInfo: async function (d) {
      let that = this;
      let stationInfoUrl;
      if (that.type === constant.TRAVEL_TYPE_BUS)
        stationInfoUrl = that.url.busStationBasicInfo;
      else if (that.type === constant.TRAVEL_TYPE_METRO)
        stationInfoUrl = that.url.metroStationBasicInfo;

      let originInfoUrl = stationInfoUrl.format(d.origin);
      that.ajax(originInfoUrl, constant.HTTP_METHOD_GET, null, function (resp) {
        that.curOrigin = d.origin;
        that.originLocation.latitude = resp.data.result.lat;
        that.originLocation.longitude = resp.data.result.lon;
      });
      let destInfoUrl = stationInfoUrl.format(d.dest);
      that.ajax(destInfoUrl, constant.HTTP_METHOD_GET, null, function (resp) {
        that.curDest = d.dest;
        that.destLocation.latitude = resp.data.result.lat;
        that.destLocation.longitude = resp.data.result.lon;
      });
    },
  }
}
</script>

<style lang="less">
@import url("line_direction_detail.less");
</style>
