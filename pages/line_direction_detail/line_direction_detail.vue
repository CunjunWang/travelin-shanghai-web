<template>
  <view class="page">
    <map class="map-container"
         :longitude="curLocation.lon"
         :latitude="curLocation.lat"
         :scale='scale'
         :polyline="polyline"
         :include-points="includePoints"
         :show-location="true">
    </map>
    <view class="title-container">
      <title :title="buildLineName()"
             :icon="type === 'bus' ? '../../static/line-1.png' : getMetroIcon()"
             :data="{
               desc: buildLineDesc(),
               titleColor: line.lineColor,
               englishName: line.lineEnglishName
             }">
      </title>
    </view>
    <view class="direction-container">
      <loading v-if="directions.length === 0" :title="'方向信息载入中...'"></loading>
      <view v-for="(d, i) in directions" :key="i">
        <direction :line-name="line.lineName" :type="type" :data="d"
                   :border="true" :station-active="true"
                   @tap="showRoute(d)">
        </direction>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";
import {secret} from "../../common/secret";
import {global} from "../../common/global";

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
      type: "",
      line: {
        lineName: "",
        lineEnglishName: "",
        lineColor: ""
      },
      curLocation: {
        lon: "",
        lat: ""
      },
      scale: 16,
      directions: [],
      polyline: [],
      includePoints: []
    }
  },
  onLoad: function (data) {
    let that = this;
    that.line = JSON.parse(data.line);
    that.type = data.type;
    let lineName = that.line.lineName;
    let type = that.type;

    uni.getLocation({
      type: constant.LOCATION_TYPE_GCJ02,
      success: function (resp) {
        that.curLocation.lat = resp.latitude;
        that.curLocation.lon = resp.longitude;
      }
    });

    let url;
    if (type === constant.TRAVEL_TYPE_BUS)
      url = `${that.url.bus.lineDirectionTime.format(lineName)}?city=${global.GLOBAL_CITY.cityName}`;
    else if (type === constant.TRAVEL_TYPE_METRO)
      url = `${that.url.metro.lineDirectionTime.format(lineName)}?city=${global.GLOBAL_CITY.cityName}`;
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
    });
  },
  methods: {
    buildLineName: function () {
      let that = this;
      return that.line.lineName + (that.line.lineStatus === 1 ? '(建设中)' : '');
    },
    buildLineDesc: function () {
      let that = this;
      let status = that.line.lineStatus;
      let desc = '线路详情';
      if (status === undefined || status === 0)
        desc += '(点击卡片查看走向)';
      return desc;
    },
    showRoute: function (d) {
      let that = this;
      if (that.line.lineStatus !== 0)
        return;
      let url = `${that.url.metro.directionPolyline.format(d.name)}?origin=${d.origin}&dest=${d.dest}`
      that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
        let data = res.data.result;
        that.polyline = [
          {
            points: JSON.parse(data.polyline),
            color: data.color,
            width: 4,
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
    getMetroIcon: function () {
      return `../../static/${global.GLOBAL_CITY.abbreviation}-metro-1.png`;
    }
  }
}
</script>

<style lang="less">
@import url("line_direction_detail.less");
</style>
