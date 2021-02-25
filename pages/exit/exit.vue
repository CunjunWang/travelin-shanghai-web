<template>
  <view class="page">
    <map class="map-container"
         :scale='18'
         :longitude="latLon.lon"
         :latitude="latLon.lat"
         :markers="markers"
         show-location>
    </map>
    <view class="title-container">
      <title
          :title="station"
          :icon="'../../static/sh-metro-1.png'"
          :desc="'出入口信息'"
          :location="stationInfo">
      </title>
    </view>
    <view class="exits-container">
      <view class="exit-item" v-for="(k, i) in Object.keys(exits)" :key="i">
        <view class="exit-name-row">
          <image src="../../static/exit-1.png" mode="widthFix" class="exit-icon"></image>
          <text class="exit-name">{{ k }}</text>
        </view>
        <view class="item-container" v-for="(it, j) in exits[k].items" :key="j"
              @tap.stop="addMarker(it)">
          <view class="item-name-row">
            <text class="item-name">{{ it.item }}</text>
            <text class="item-type">{{ it.itemType }}</text>
          </view>
          <view class="address-row">
            <image src="../../static/location-1.png" mode="widthFix" class="location-icon"></image>
            <text class="address">{{ it.address }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

export default {
  data() {
    return {
      station: "",
      exits: {},
      stationInfo: {},
      latLon: {},
      markers: [],
    }
  },
  onLoad: function (d) {
    let that = this;
    that.station = d.stationName;
    that.stationInfo = JSON.parse(d.stationInfo);
    that.latLon = JSON.parse(d.latLon);
    let url = that.url.metro.stationExits.format(that.station);
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
      that.exits = res.data.result;
    })
  },
  methods: {
    addMarker: function (item) {
      console.log(item);
      let that = this;
      that.latLon = {
        lat: item.itemLat,
        lon: item.itemLon
      }

      that.markers.length = 0;
      let marker = {
        title: item.item,
        latitude: item.itemLat,
        longitude: item.itemLon,
        iconPath: '../../static/location-2.png',
        width: 35,
        height: 35
      }
      that.markers.push(marker);
    }
  }
}
</script>

<style lang="less">
@import url("exit.less");
</style>
