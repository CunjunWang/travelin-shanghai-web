<template>
  <view class="page">
    <view class="search">
      <search-bar></search-bar>
    </view>
    <map class="map-container" id="index-map"
         :scale='14'
         :longitude="curLocation.lon"
         :latitude="curLocation.lat"
         :markers="markers"
         :show-location="true"
         :enable-zoom="false">
      <cover-image src="../../static/back-to-cur-location-1.png" mode="widthFix"
                   class="back-icon" @tap.stop="backToCurLocation()">
      </cover-image>
    </map>
    <view class="title-container">
      <title
          :title="'附近的公交站:'"
          :icon="'../../static/bus-station-1.png'">
      </title>
    </view>
    <view class="station-list">
      <loading class="loading-block" v-if="buses.length === 0"
               :title="'附近的公交站列表载入中'"></loading>
      <station-card v-else v-for="(b, i) in buses"
                    :key="i" :type="'bus'" :data="b">
      </station-card>
    </view>
    <view class="title-container">
      <title
          :title="'附近的地铁站:'"
          :icon="'../../static/sh-metro-1.png'">
      </title>
    </view>
    <view class="station-list">
      <loading class="loading-block" v-if="metros.length === 0"
               :title="'附近的地铁站列表载入中'"></loading>
      <station-card v-else v-for="(m, i) in metros"
                    :key="i" :data="m" :type="'metro'">
      </station-card>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";

import SearchBar from "../../components/search_bar/search_bar";
import Loading from "../../components/loading/loading";
import Title from "../../components/title/title";
import StationCard from "../../components/station_card/station_card";

export default {
  components: {
    SearchBar,
    Loading,
    Title,
    StationCard
  },
  data() {
    return {
      keyword: "",
      buses: [],
      metros: [],
      markers: [],
      curLocation: {}
    }
  },
  onLoad: function () {
    let that = this;
    uni.getLocation({
      type: constant.LOCATION_TYPE_GCJ02,
      success: function (resp) {
        let lat = resp.latitude;
        let lon = resp.longitude;
        that.curLocation = {lat, lon};
        let busUrl = `${that.url.bus.nearbyStations}?curLat=${lat}&curLon=${lon}`;
        let metroUrl = `${that.url.metro.nearbyStations}?curLat=${lat}&curLon=${lon}`;
        that.ajax(busUrl, constant.HTTP_METHOD_GET, null, function (resp) {
          that.buses = resp.data.list;
          for (let b of that.buses) {
            let marker = {
              title: b.stationName + "-公交站",
              latitude: b.stationLat,
              longitude: b.stationLon,
              iconPath: '../../static/location-2.png',
              width: 25,
              height: 25
            }
            that.markers.push(marker);
          }
        });
        that.ajax(metroUrl, constant.HTTP_METHOD_GET, null, function (resp) {
          that.metros = resp.data.list;
          for (let m of that.metros) {
            let marker = {
              title: m.stationName + "-地铁站",
              latitude: m.stationLat,
              longitude: m.stationLon,
              iconPath: '../../static/location-2.png',
              width: 25,
              height: 25
            }
            that.markers.push(marker);
          }
        });
      }
    });
  },
  methods: {
    backToCurLocation: function () {
      let mapCtx = uni.createMapContext("index-map");
      mapCtx.moveToLocation();
    }
  }
}
</script>

<style lang="less">
@import url("index.less");
</style>
