<template>
  <view class="page">
    <map class="map-container"
         :scale='18'
         :longitude="latLon.lon"
         :latitude="latLon.lat"
         show-location>
    </map>
    <view class="title-container">
      <title
          :title="stationName"
          :icon="type === 'bus' ? '../../static/bus-station-1.png' : '../../static/sh-metro-1.png'"
          :desc="getStationType(type)"
          :location="stationInfo">
      </title>
    </view>
    <view class="lines-container">
      <loading v-if="lines.length === 0"
               :title="'线路列表载入中...'">
      </loading>
      <view v-for="(l, i) in lines" :key="i">
        <bus-station-line
            v-if="type === 'bus'"
            :data="l"
            :station-name="stationName"
            :type="type"
            @update-line="onLineUpdate($event, i)">
        </bus-station-line>
        <metro-line-card
            v-if="type === 'metro'"
            :line="l"
            :station-name="stationName"
            :show-station-list="false"
            :show-washroom-list="true"
            @toggle-washroom-list="onToggleWashroomList($event, i)">
        </metro-line-card>
      </view>
    </view>
    <view v-if="type === 'metro'" class="exit-container">
      TODO: 出口信息
    </view>
    <view class="bus-transfer-container">
      TODO: {{ type === 'metro' ? '公交' : '地铁' }} 换乘信息
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import Title from "../../components/title/title";
import Subtitle from "../../components/subtitle/subtitle";
import Loading from "../../components/loading/loading";
import TravelMap from "../../components/travel_map/travel_map"
import BusStationLine from "../../components/bus_station_line/bus_station_line";
import MetroLineCard from "../../components/metro_line_card/metro_line_card";

export default {
  components: {
    Title,
    Subtitle,
    TravelMap,
    Loading,
    BusStationLine,
    MetroLineCard,
  },
  data() {
    return {
      lines: [],
      type: "",
      stationName: "",
      latLon: {},
      stationInfo: {},
      washrooms: {}
    }
  },
  onLoad: function (data) {
    let that = this;
    that.stationName = data.stationName;
    that.type = data.type;
    let infoUrl, linesUrl;
    if (that.type === constant.TRAVEL_TYPE_BUS) {
      infoUrl = that.url.busStationBasicInfo.format(that.stationName);
      linesUrl = that.url.busRealtimeStationLines.format(that.stationName);
    } else if (that.type === constant.TRAVEL_TYPE_METRO) {
      infoUrl = that.url.metroStationBasicInfo.format(that.stationName);
      linesUrl = that.url.metroStationLines.format(that.stationName);
    }
    that.ajax(linesUrl, constant.HTTP_METHOD_GET, null, function (res) {
      that.lines = res.data.list;
      if (that.type === constant.TRAVEL_TYPE_BUS)
        for (let l of that.lines)
          l.realtimeLoading = false;
    });
    that.ajax(infoUrl, constant.HTTP_METHOD_GET, null, function (res) {
      that.stationInfo = res.data.result;
      that.latLon = {
        lat: that.stationInfo.lat,
        lon: that.stationInfo.lon
      }
      if (!that.latLon.lat || !that.latLon.lon) {
        uni.getLocation({
          type: constant.LOCATION_TYPE_GCJ02,
          success: function (resp) {
            that.latLon.lat = resp.latitude;
            that.latLon.lon = resp.longitude;
          }
        });
      }
    });

  },
  methods: {
    onLineUpdate: function (e, i) {
      // 把添加完 realtimeLoading 属性的新对象set()进数据中
      this.$set(this.lines, i, e);
    },
    onToggleWashroomList: function (e, i) {
      this.$set(this.lines, i, e);
    },
    getStationType: function (t) {
      let that = this;
      if (t === 'bus')
        return '公交站';
      else if (t === 'metro') {
        let s = '地铁站';
        let status = that.stationInfo.status;
        if (status === 1)
          return `${s}(建设中)`;
        else if (status === 2)
          return `${s}(规划中)`;
        else
          return s;
      } else
        return null;
    }
  }
}
</script>

<style lang="less">
@import url("station_detail.less");
</style>
