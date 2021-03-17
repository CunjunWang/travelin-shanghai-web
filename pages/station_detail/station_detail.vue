<template>
  <view class="page">
    <map class="map-container" :scale='16'
         :longitude="station.stationLon"
         :latitude="station.stationLat"
         :markers="markers"
         :show-location="true"
         :enable-zoom="false"
         :enable-scroll="false">
    </map>
    <view class="title-container">
      <title :title="station.stationName"
             :icon="type === 'bus' ? '../../static/bus-station-1.png' : '../../static/sh-metro-1.png'"
             :data="buildTitleData()">
      </title>
      <view v-if="type === 'metro'" class="subtitle-container" @tap.stop="exitDetail()">
        <view class="content">
          <image src="../../static/exit-1.png" mode="widthFix" class="icon"></image>
          <text class="text">出入口信息 Exits</text>
        </view>
        <view class="arrow">
          <image src="../../static/right-arrow-1.png" mode="widthFix" class="icon"></image>
        </view>
      </view>
      <view class="subtitle-container" @tap.stop="transferDetail()">
        <view class="content">
          <image src="../../static/transfer-2.png" mode="widthFix" class="icon"></image>
          <text class="text">
            {{ type === 'metro' ? '公交' : '地铁' }}换乘信息 {{ type === 'metro' ? 'Bus ' : 'Metro ' }}Transfers
          </text>
        </view>
        <view class="arrow">
          <image src="../../static/right-arrow-1.png" mode="widthFix" class="icon"></image>
        </view>
      </view>
    </view>

    <view class="lines-container">
      <loading v-if="lines.length === 0"
               :title="'线路列表载入中...'">
      </loading>
      <view v-for="(l, i) in lines" :key="i">
        <bus-station-line
            v-if="type === 'bus'"
            :type="type" :data="l"
            :station-name="station.stationName"
            @update-line="onLineUpdate($event, i)">
        </bus-station-line>
        <metro-line-card
            v-if="type === 'metro'"
            :line="l"
            :station-name="station.stationName"
            :show-station-list="false"
            :show-washroom-list="true"
            @toggle-washroom-list="onToggleWashroomList($event, i)">
        </metro-line-card>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import {global} from "common/global";

import Title from "../../components/title/title";
import Subtitle from "../../components/subtitle/subtitle";
import Loading from "../../components/loading/loading";
import BusStationLine from "../../components/bus_station_line/bus_station_line";
import MetroLineCard from "../../components/metro_line_card/metro_line_card";

export default {
  components: {
    Title,
    Subtitle,
    Loading,
    BusStationLine,
    MetroLineCard,
  },
  data() {
    return {
      type: "",
      lines: [],
      markers: [],
      station: {
        stationName: "",
        englishName: "",
        stationLon: "",
        stationLat: "",
        city: "",
        district: ""
      },
      washrooms: {}
    }
  },
  onLoad: function (data) {
    let that = this;
    that.type = data.type;
    that.station = JSON.parse(data.station);
    let stationName = that.station.stationName;
    let linesUrl;
    if (that.type === constant.TRAVEL_TYPE_BUS)
      linesUrl = that.url.bus.realtimeStationLines.format(stationName);
    else if (that.type === constant.TRAVEL_TYPE_METRO)
      linesUrl = `${that.url.metro.stationLines.format(stationName)}?city=${global.GLOBAL_CITY.cityName}`;
    that.ajax(linesUrl, constant.HTTP_METHOD_GET, null, function (res) {
      that.lines = res.data.list;
      if (that.type === constant.TRAVEL_TYPE_BUS)
        for (let l of that.lines)
          l.realtimeLoading = false;
    });
    let stationSuffix = that.type === constant.TRAVEL_TYPE_BUS ? '-公交站' : '-地铁站';
    let marker = {
      title: stationName + stationSuffix,
      latitude: that.station.stationLat,
      longitude: that.station.stationLon,
      iconPath: '../../static/location-2.png',
      width: 40,
      height: 40
    }
    that.markers.push(marker);
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
        let status = that.station.stationStatus;
        if (status === 1)
          return `${s}(建设中)`;
        else if (status === 2)
          return `${s}(规划中)`;
        else
          return s;
      } else
        return null;
    },
    buildTitleData: function () {
      let that = this;
      return {
        desc: that.getStationType(that.type),
        city: that.station.city,
        district: that.station.district,
        englishName: that.station.englishName
      }
    },
    exitDetail: function () {
      let that = this;
      uni.navigateTo({
        url: `../exit/exit?station=${JSON.stringify(that.station)}`
      });
    },
    transferDetail: function () {
      let that = this;
      uni.navigateTo({
        url: `../transfer/transfer?type=${that.type}&station=${JSON.stringify(that.station)}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("station_detail.less");
</style>
