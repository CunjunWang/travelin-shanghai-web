<template>
  <view class="page">
    <view class="map">
      <travel-map v-if="Object.keys(latLon).length !== 0"
                  :location="latLon"
                  :title="`${stationName}[${type}]`"
                  :scale="18">
      </travel-map>
    </view>
    <view class="title-container">
      <title
          :title="stationName"
          :icon="type === 'bus' ? '../../static/bus-station-1.png' : '../../static/sh-metro-1.png'"
          :desc="type === 'bus' ? '公交站' : '地铁站'"
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
        <metro-station-line
            v-if="type === 'metro'"
            :data="l"
            :station-name="stationName"
            :type="type">
        </metro-station-line>
      </view>
    </view>
    <view v-if="type === 'metro'" class="exit-container">
      TODO: 出口信息
    </view>
    <view v-if="type === 'metro'" class="washroom-container">
      TODO: 洗手间信息
    </view>
    <view class="bus-transfer-container">
      TODO: {{ type === 'metro' ? '公交' : '地铁' }} 换乘信息
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import Title from "../../components/title/title";
import Loading from "../../components/loading/loading";
import TravelMap from "../../components/travel_map/travel_map"
import BusStationLine from "../../components/bus_station_line/bus_station_line";
import MetroStationLine from "../../components/metro_station_line/metro_station_line";

export default {
  components: {
    TravelMap,
    Loading,
    BusStationLine,
    MetroStationLine,
    Title,
  },
  data() {
    return {
      stationName: "",
      type: "",
      stationInfo: {},
      lines: [],
      latLon: {}
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
    });
  },
  methods: {
    onLineUpdate: function (e, i) {
      // 把添加完 realtimeLoading 属性的新对象set()进数据中
      this.$set(this.lines, i, e);
    }
  }
}
</script>

<style lang="less">
@import url("station_detail.less");
</style>
