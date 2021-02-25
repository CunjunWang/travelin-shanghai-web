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
          :title="buildLineName()"
          :title-color="line.color"
          :desc="'线路详情' + (line.status !== 0 ? '' : '(点击卡片查看走向)')"
          :location="line">
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
      line: {},
      scale: 16,
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
      url = that.url.bus.lineDirectionTime.format(name);
    } else if (type === constant.TRAVEL_TYPE_METRO)
      url = that.url.metro.lineDirectionTime.format(name);
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

    if (type === constant.TRAVEL_TYPE_METRO) {
      url = that.url.metro.lineBasicInfo.format(name);
      that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
        // color: "6c6602" line: "14号线" lineEnglishName: "Line 14" status: 1
        that.line = res.data.result;
        that.line.englishName = that.line.lineEnglishName;
      });
    }
  },
  methods: {
    buildLineName: function () {
      let that = this;
      let lineName = that.name + (that.line.status === 1 ? '(建设中)' : '');
      console.log('line: ' + lineName);
      return lineName;
    },
    showRoute: function (d) {
      let that = this;
      if (that.line.status !== 0)
        return;
      let url = `${that.url.metro.directionPolyline.format(that.name)}?origin=${d.origin}&dest=${d.dest}`
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
  }
}
</script>

<style lang="less">
@import url("line_direction_detail.less");
</style>
