<template>
  <view class="page">
    TODO: 在地图上显示站点
    <view class="title">
      <span class="station-name">{{ stationName }}</span>
      <span class="desc">{{ type === 'bus' ? '公交' : '地铁' }}站</span>
    </view>
    <view class="lines-container">
      <view v-for="l in lines" class="line-info-container">
        <view class="info-row">
          <view class="line-direction">
            <text class="line-name">{{ l.name }}</text>
            <text class="direction">开往: {{ l.dest }}</text>
          </view>
          <span class="update">更新</span>
        </view>
        <realtime-card
            :loading="false"
            :data="l.realtime">
        </realtime-card>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import RealtimeCard from "../../components/realtime_card/realtime_card";

export default {
  components: {
    RealtimeCard
  },
  data() {
    return {
      stationName: "",
      type: "",
      lines: [],
    }
  },
  onLoad: function (data) {
    let that = this;
    that.stationName = data.stationName;
    that.type = data.type;
    let url;
    if (that.type === constant.TRAVEL_TYPE_BUS)
      url = that.url.busRealtimeStationLines.format(that.stationName);
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
      that.lines = res.data.result;
      console.log(that.lines);
    })
  },
  methods: {}
}
</script>

<style lang="less">
@import url("station_detail.less");
</style>
