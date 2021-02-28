<template>
  <view>
    <map class="map-container" :scale='14'
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
    </view>
    <view class="transfer-container">
      <view v-for="(t, i) in transfers" :key="i">
        <station-card :type="type === 'bus' ? 'metro' : 'bus'" :data="t"></station-card>
      </view>
    </view>
  </view>
</template>

<script>
import StationCard from '../../components/station_card/station_card';
import {constant} from "../../common/constant";

export default {
  components: {
    StationCard,
  },
  data() {
    return {
      type: "",
      station: {
        stationName: "",
        englishName: "",
        stationLon: "",
        stationLat: "",
        city: "",
        district: ""
      },
      markers: [],
      transfers: []
    }
  },
  onLoad: function (d) {
    let that = this;
    that.type = d.type;
    that.station = JSON.parse(d.station);
    let stationSuffix = that.type === constant.TRAVEL_TYPE_BUS ? '-公交站' : '-地铁站';
    that.addMarker({
      title: that.station.stationName + stationSuffix,
      latitude: that.station.stationLat,
      longitude: that.station.stationLon,
      iconPath: '../../static/cur-location-1.png'
    });
    let url;
    if (that.type === constant.TRAVEL_TYPE_METRO)
      url = `${that.url.metro.transferToBus}?station=${that.station.stationName}`;
    else if (that.type === constant.TRAVEL_TYPE_BUS)
      url = `${that.url.bus.transferToMetro}?station=${that.station.stationName}`;
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
      let list = res.data.list;
      for (let stationData of list) {
        let t = {
          stationName: stationData.stationName,
          englishName: stationData.englishName,
          distance: stationData.distance,
          lines: stationData.transfers
        }
        that.transfers.push(t);
        let stationSuffix = that.type === constant.TRAVEL_TYPE_BUS ? '-公交站' : '-地铁站';
        that.addMarker({
          title: stationData.stationName + stationSuffix,
          latitude: stationData.stationLat,
          longitude: stationData.stationLon,
          iconPath: '../../static/location-2.png',
        });
      }
    });
  },
  methods: {
    addMarker: function (obj) {
      let that = this;
      let marker = {}
      Object.assign(marker, obj);
      if (obj.size) {
        marker.width = obj.size;
        marker.height = obj.size;
      } else if (obj.width && obj.height) {
        marker.width = obj.width;
        marker.height = obj.height;
      } else {
        marker.width = 40;
        marker.height = 40;
      }
      that.markers.push(marker);
    },
    buildTitleData: function () {
      let that = this;
      return {
        desc: `${that.type === 'bus' ? '公交站' : '地铁站'}-${that.type === 'bus' ? '地铁' : '公交'}换乘信息`,
        englishName: that.station.englishName
      }
    }
  }
}
</script>

<style lang="less">
@import url("transfer.less");
</style>
