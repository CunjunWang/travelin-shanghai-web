<template>
  <view class="page">
    TODO: 在地图上显示站点
    <title
        :title="stationName"
        :icon="'../../static/bus-station-1.png'"
        :desc="type === 'bus' ? '公交站' : '地铁站'"
        :location="stationInfo">
    </title>
    <view class="lines-container">
      <view v-for="(l, i) in lines" :key="i">
        <bus-station-line
            v-if="type === 'bus'"
            :data="l"
            :station-name="stationName"
            :type="type"
            @update-line="onLineUpdate($event, i)">
        </bus-station-line>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import Title from "../../components/title/title";
import BusStationLine from "../../components/bus_station_line/bus_station_line";

export default {
  components: {
    BusStationLine,
    Title,
  },
  data() {
    return {
      stationName: "",
      type: "",
      stationInfo: {},
      lines: [],
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
    })
    that.ajax(infoUrl, constant.HTTP_METHOD_GET, null, function (res) {
      that.stationInfo = res.data.result;
    })
  },
  methods: {
    onLineUpdate: function (e, i) {
      console.log(e);
      // 把添加完 realtimeLoading 属性的新对象set()进数据中
      this.$set(this.lines, i, e);
    }
  }
}
</script>

<style lang="less">
@import url("station_detail.less");
</style>
