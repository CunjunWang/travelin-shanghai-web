<template>
  <view class="page">
    <view class="direction-container">
      <direction :line-name="lineName" :type="type" :data="data"
                 :border="false" :station-active="false">
      </direction>
    </view>
    <view class="title">站点列表</view>
    <view class="station-list" v-if="stations.length !== 0">
      <view class="station-container" v-for="(s, i) in stations" @tap="stationDetail(s)">
        <view class="row station-row">
          <view class="station-info">
            <text class="station-seq">{{ s.stationSeq }}.</text>
            <text class="station-name">{{ buildNameByStatus(s.stationName, s.status) }}</text>
            <text class="english-name">{{ s.stationEnglishName }}</text>
          </view>
          <view class="realtime" v-if="type === 'bus'" @tap.stop="realtimeInfo(s, i)">实时</view>
          <view class="transfer" v-if="type === 'metro'">
            <span v-for="(t, j) in s.transfers" class="transfer-line"
                  :key="j" :style="{backgroundColor: t.lineColor}"
                  @tap.stop="lineDirectionDetail(t, 'metro')">
              {{ buildNameByStatus(t.lineName.replace("号线", ""), t.lineStatus) }}
            </span>
          </view>
        </view>
        <view class="row location-row"
              v-if="type === 'bus' || (type === 'metro' && s.status === 0)">
          <image src="../../static/location-1.png" mode="widthFix" class="icon"></image>
          <span class="desc city">{{ s.city }}</span>
          <span class="desc district">{{ s.district }}</span>
        </view>
        <view class="row realtime-row" v-if="s.realtimeShow">
          <realtime-card :loading="realtimeLoading"
                         :data="realtimeData">
          </realtime-card>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import {global} from "common/global";

import Direction from "../../components/direction/direction"
import RealtimeCard from "../../components/realtime_card/realtime_card"

export default {
  components: {
    Direction,
    RealtimeCard
  },
  data() {
    return {
      type: "",
      lineName: "",
      data: {
        direction: "",
        origin: "",
        dest: ""
      },
      realtimeData: {},
      stations: [],
      realtimeLoading: false,
    }
  },
  onLoad: function (data) {
    let that = this;
    that.type = data.type;
    that.lineName = data.lineName;
    that.data = JSON.parse(data.data);
    let url
    if (that.type === constant.TRAVEL_TYPE_BUS)
      url = that.url.bus.lineDirectionStations.format(that.lineName, that.data.direction);
    else if (that.type === constant.TRAVEL_TYPE_METRO)
      url = that.url.metro.lineDirectionStations.format(that.lineName, that.data.direction) +
          `?origin=${that.data.origin}&dest=${that.data.dest}&city=${global.GLOBAL_CITY.cityName}`;
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
      that.stations = res.data.list;
      if (that.type === constant.TRAVEL_TYPE_BUS)
        for (let s of that.stations)
          s.realtimeShow = false;
    });
  },
  methods: {
    stationDetail: function (s) {
      console.log(s);
      let that = this;
      let station = {
        stationName: s.stationName,
        englishName: s.stationEnglishName,
        stationLon: s.lon,
        stationLat: s.lat,
        city: s.city,
        district: s.district
      };
      uni.navigateTo({
        url: `../station_detail/station_detail?type=${that.type}&station=${JSON.stringify(station)}`
      });
    },
    buildNameByStatus: function (name, status) {
      let that = this;
      if (that.type === 'bus')
        return name;
      if (status === 1)
        return name + '(建)';
      else if (status === 2)
        return name + '(规)';
      else
        return name;
    },
    lineDirectionDetail: function (line, type) {
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?type=${type}&line=${JSON.stringify(line)}`
      });
    },
    realtimeInfo: function (s, i) {
      let that = this;
      that.toggleRealtimeShow(i);
      // 如果当前点击打开了实时信息行 再去请求接口
      if (s.realtimeShow) {
        that.realtimeLoading = true;
        let url = that.url.bus.realtime + `?routeName=${s.busName}&direction=${s.direction}&station=${s.stationSeq}`
        that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
          let r = {};
          Object.assign(r, res.data.result);
          that.realtimeData = r;
          that.realtimeLoading = false;
        });
      }
    },
    toggleRealtimeShow: function (index) {
      // 找到点击的station对象
      let s = this.stations[index];
      // 向这个对象中添加 realtime 属性
      s.realtimeShow = !s.realtimeShow;
      // 把添加完 realtime 属性的新对象set()进data数据中
      this.$set(this.stations, index, s);
      // 把其他站点的realtime设置为false;
      for (let i = 0; i < this.stations.length; i++)
        if (i !== index) {
          let station = this.stations[i];
          station.realtimeShow = false;
          this.$set(this.stations, i, station);
        }
    }
  }
}
</script>

<style lang="less">
@import url("line_direction_stations.less");
</style>
