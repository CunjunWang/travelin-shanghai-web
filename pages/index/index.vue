<template>
  <view class="page">
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
    <view class="stations-container"
          @touchstart="start" @touchend="end">
      <view class="tab-container">
        <view :class="['tab-item', getActive('metros')]"
              @tap="changeMode('metros')">
          <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon"></image>
          <text class="nav">附近的地铁站</text>
        </view>
        <view :class="['tab-item', getActive('buses')]"
              @tap="changeMode('buses')">
          <image src="../../static/bus-station-1.png" mode="widthFix" class="icon"></image>
          <text class="nav">附近的公交站</text>
        </view>
      </view>
      <view v-if="mode === 'metros'" class="station-list">
        <loading class="loading-block" v-if="metros.length === 0"
                 :title="'附近的地铁站列表载入中'"></loading>
        <station-card v-else v-for="(m, i) in metros"
                      :key="i" :data="m" :type="'metro'"
                      :user-location="curLocation"
                      :show-distance="true">
        </station-card>
      </view>
      <view v-if="mode === 'buses'" class="station-list">
        <loading class="loading-block" v-if="buses.length === 0"
                 :title="'附近的公交站列表载入中'"></loading>
        <station-card v-else v-for="(b, i) in buses"
                      :key="i" :type="'bus'" :data="b"
                      :show-distance="true">
        </station-card>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import {secret} from "../../common/secret";

import Loading from "../../components/loading/loading";
import Title from "../../components/title/title";
import StationCard from "../../components/station_card/station_card";

let QQMapWx = require('../../libs/qqmap-wx-jssdk.min')
let qqMapSdk;

export default {
  components: {
    Loading,
    Title,
    StationCard
  },
  data() {
    return {
      mode: 'metros',
      touchStart: {},
      keyword: "",
      buses: [],
      metros: [],
      markers: [],
      curLocation: {}
    }
  },
  onLoad: function () {
    qqMapSdk = new QQMapWx({
      key: secret.WX_MAP_KEY
    });

    let that = this;
    uni.getLocation({
      type: constant.LOCATION_TYPE_GCJ02,
      success: function (resp) {
        let lat = resp.latitude;
        let lon = resp.longitude;

        qqMapSdk.reverseGeocoder({
          location: {
            latitude: resp.latitude,
            longitude: resp.longitude
          },
          success: function (resp) {
            console.log(resp);
            let addressComponent = resp.result.address_component;
            let city = addressComponent.city;
            if (!city)
              city = addressComponent.nation;
            that.ajax(that.url.metadata.getCityList, constant.HTTP_METHOD_GET, null, function (res) {
              let supportCities = res.data.list;
              let foundCity = false;
              for (let c of supportCities) {
                if (city === c.cityName) {
                  that.curLocation = {lat, lon};
                  that.setGlobalCity(city);
                  foundCity = true;
                }
              }
              if (!foundCity) {
                uni.showModal({
                  title: "提示信息",
                  content: `暂未支持您当前所在位置[${city}], 默认切换到上海市`
                });
                lat = 31.228725;
                lon = 121.475186;
                that.curLocation = {lat, lon};
                that.setGlobalCity("上海市");
              }

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
            });
          }
        });
      }
    });
  },
  methods: {
    backToCurLocation: function () {
      let mapCtx = uni.createMapContext("index-map");
      mapCtx.moveToLocation();
    },
    changeMode: function (mode) {
      let that = this;
      that.mode = mode;
    },
    getActive: function (activeMode) {
      let that = this;
      if (that.mode === activeMode)
        return 'tab-active';
      return '';
    },
    start(e) {
      this.touchStart.clientX = e.changedTouches[0].clientX;
      this.touchStart.clientY = e.changedTouches[0].clientY;
    },
    end(e) {
      const subX = e.changedTouches[0].clientX - this.touchStart.clientX;
      const subY = e.changedTouches[0].clientY - this.touchStart.clientY;
      if (subX > 200) {
        if (this.mode !== 'metros')
          this.changeMode('metros');
      } else if (subX < -200) {
        if (this.mode !== 'buses')
          this.changeMode('buses');
      }
    }
  }
}
</script>

<style lang="less">
@import url("index.less");
</style>
