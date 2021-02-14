<template>
  <view class="page">
    <travel-map :location="location"></travel-map>
    <search-bar></search-bar>
    <view v-if="buses.length !== 0" class="info-container">
      <title
          class="title"
          :title="'附近的公交站:'"
          :icon="'../../static/bus-station-1.png'"
          :stick-height="575">
      </title>
      <station :data="buses" :type="'bus'"></station>
    </view>
    <view v-if="metros.length !== 0" class="info-container">
      <title
          class="title"
          :title="'附近的地铁站:'"
          :icon="'../../static/sh-metro-1.png'"
          :stick-height="575">
      </title>
      <station :data="metros" :type="'metro'"></station>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";

import SearchBar from "../../components/search_bar/search_bar";
import TravelMap from "../../components/travel_map/travel_map";
import Title from "../../components/title/title";
import Station from "../../components/station/station";

export default {
  components: {
    TravelMap,
    SearchBar,
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
      type: constant.LOCATION_TYPE_GPS,
      success: function (resp) {
        let lat = resp.latitude;
        let lon = resp.longitude;
        that.location = {lat, lon};
        let busUrl = `${that.url.busStationsNear}?curLat=${lat}&curLon=${lon}&limit=10`;
        let metroUrl = `${that.url.metroStationsNear}?curLat=${lat}&curLon=${lon}&limit=10`;
        that.ajax(busUrl, constant.HTTP_METHOD_GET, null, function (resp) {
          that.buses = resp.data.list;
        })
        that.ajax(metroUrl, constant.HTTP_METHOD_GET, null, function (resp) {
          that.metros = resp.data.list;
        })
      }
    })
  },
  methods: {}
}
</script>

<style lang="less">
@import url("index.less");
</style>
