<template>
  <view class="line-info-container">
    <view class="info-row">
      <view class="line-direction">
        <image src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
        <text class="line-name">{{ data.name }}</text>
        <text class="direction">开往:</text>
        <text :class="['direction', underline(data.dest)]"
              @tap="stationDetail(data.dest)">{{ data.dest }}
        </text>
      </view>
      <span class="update" @tap.stop="updateRealtime()">更新</span>
    </view>
    <realtime-card
        :loading="data.realtimeLoading"
        :data="data.realtime">
    </realtime-card>
  </view>
</template>

<script>
import RealtimeCard from "../realtime_card/realtime_card"
import {constant} from "../../common/constant";

export default {
  components: {
    RealtimeCard
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    stationName: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      line: this.data
    }
  },
  methods: {
    updateRealtime: function (i) {
      // 向这个对象中设置 realtimeLoading 属性
      if (!this.line.realtimeLoading)
        this.line.realtimeLoading = true;
      // TODO: 这个解决办法要记笔记
      this.$emit("update-line", this.line);

      let l = this.line;
      let url = this.url.bus.realtime + `?routeName=${l.name}&direction=${l.direction}&station=${l.stationSeq}`
      let that = this;
      this.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
        let r = {};
        r.message = res.data.result.message;
        r.distanceKM = res.data.result.distanceKM;
        r.timeMinutes = res.data.result.timeMinutes;
        r.plateNumber = res.data.result.plateNumber;
        r.stops = res.data.result.stops;

        that.line.realtime = r;
        that.line.realtimeLoading = false;
        that.$emit("update-line", that.line);
      });
    },
    underline: function (dest) {
      return this.stationName !== dest ? 'underline' : '';
    },
    stationDetail: function (stationName) {
      if (this.stationName !== stationName)
        uni.navigateTo({
          url: `../station_detail/station_detail?stationName=${stationName}&type=${this.type}`
        });
    },
  },
}
</script>

<style lang="less">
@import url("bus_station_line.less");
</style>
