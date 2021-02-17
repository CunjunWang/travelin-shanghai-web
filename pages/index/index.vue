<template>
  <view class="page">
    <view class="search">
      <search-bar></search-bar>
    </view>
    <map class="map-container"
         :scale='16'
         :longitude="location.lon"
         :latitude="location.lat"
         show-location>
    </map>
    <view class="info-container">
      <title
          :title="'附近的公交站:'"
          :icon="'../../static/bus-station-1.png'">
      </title>
    </view>
    <loading class="loading-block"
             v-if="buses.length === 0"
             :title="'附近的公交站列表载入中'">
    </loading>
    <station v-else :data="buses" :type="'bus'"></station>
    <view class="info-container">
      <title
          :title="'附近的地铁站:'"
          :icon="'../../static/sh-metro-1.png'">
      </title>
    </view>
    <loading v-if="metros.length === 0" :title="'附近的地铁站列表载入中'"></loading>
    <station v-else :data="metros" :type="'metro'"></station>
  </view>
</template>

<script>
import {constant} from "common/constant";

import SearchBar from "../../components/search_bar/search_bar";
import TravelMap from "../../components/travel_map/travel_map";
import Loading from "../../components/loading/loading";
import Title from "../../components/title/title";
import Station from "../../components/station/station";

export default {
  components: {
    TravelMap,
    SearchBar,
    Loading,
    Title,
    Station
  },
  data() {
    return {
      keyword: "",
      buses: [],
      metros: [],
      location: {}
    }
  },
  onLoad: function () {
    let that = this;
    uni.getLocation({
      type: constant.LOCATION_TYPE_GCJ02,
      success: function (resp) {
        let lat = resp.latitude;
        let lon = resp.longitude;
        that.location = {lat, lon};
        let busUrl = `${that.url.busStationsNear}?curLat=${lat}&curLon=${lon}`;
        let metroUrl = `${that.url.metroStationsNear}?curLat=${lat}&curLon=${lon}`;
        that.ajax(busUrl, constant.HTTP_METHOD_GET, null, function (resp) {
          that.buses = resp.data.list;
        })
        that.ajax(metroUrl, constant.HTTP_METHOD_GET, null, function (resp) {
          that.metros = resp.data.list;
        })
      }
    });
  },
  methods: {}
}
</script>

<style lang="less">
@import url("index.less");
</style>
