<template>
  <view class="page">
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
          :icon="type === 'bus' ? '../../static/line-1.png' : '../../static/sh-metro-1.png'"
          :title="name"
          :desc="'线路详情(点击方向查看线路走向)'">
      </title>
    </view>
    <view class="direction-container">
      <loading v-if="directions.length === 0"
               :title="'方向信息载入中...'">
      </loading>
      <view v-for="(d, i) in directions" :key="i">
        <direction :name="name"
                   :type="type"
                   :data="d"
                   :border="true"
                   :station-active="true"
                   @tap="showRoute(d)">
        </direction>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";
import {secret} from "../../common/secret";

import Title from "../../components/title/title"
import Loading from "../../components/loading/loading"
import Direction from "../../components/direction/direction"

let txMap = require('../../libs/qqmap-wx-jssdk.min')
let map = new txMap({
  key: secret.WX_MAP_KEY,
});

export default {
  components: {
    Title,
    Loading,
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
    let name = data.name;
    let type = data.type;
    that.name = name;
    that.type = type;

    uni.getLocation({
      type: constant.LOCATION_TYPE_GCJ02,
      success: function (resp) {
        that.lat = resp.latitude;
        that.lon = resp.longitude;
      }
    });

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
      // that.getStationInfo(dir[0]);
    });
  },
  methods: {
    showRoute: function (d) {
      let that = this;
      let url = `${that.url.metroDirectionPolylineUrl.format(that.name)}?origin=${d.origin}&dest=${d.dest}`
      that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
        let data = res.data.result;
        that.polyline = [
          {
            points: JSON.parse(data.polyline),
            color: `#${data.color}`,
            width: 6,
            borderColor: '#000',
            borderWidth: 1
          }
        ]
        let bounds = data.bounds.split(',');
        let pts = [];
        for (let i = 0; i < bounds.length; i += 2)
          pts.push({latitude: bounds[i], longitude: bounds[i + 1]});
        that.includePoints = pts;
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
