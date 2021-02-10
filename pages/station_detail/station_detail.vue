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
      <view v-for="(l, i) in lines" class="line-info-container">
        <view class="info-row">
          <view class="line-direction">
            <text class="line-name">{{ l.name }}</text>
            <text class="direction">开往:</text>
            <text :class="['direction', underline(l.dest)]"
                  @tap="stationDetail(l.dest)">{{ l.dest }}
            </text>
          </view>
          <span class="update" @tap.stop="updateRealtime(i)">更新</span>
        </view>
        <realtime-card
            :loading="l.realtimeLoading"
            :data="l.realtime">
        </realtime-card>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "common/constant";
import Title from "../../components/title/title";
import RealtimeCard from "../../components/realtime_card/realtime_card";

export default {
  components: {
    Title,
    RealtimeCard
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
      infoUrl = "";
      linesUrl = "";
    }
    that.ajax(linesUrl, constant.HTTP_METHOD_GET, null, function (res) {
      that.lines = res.data.result;
      for (let l of that.lines)
        l.realtimeLoading = false;
    })
    that.ajax(infoUrl, constant.HTTP_METHOD_GET, null, function (res) {
      console.log(res);
      that.stationInfo = res.data.result;
    })
  },
  methods: {
    updateRealtime: function (i) {
      // 找到点击的station对象
      let l = this.lines[i];
      // 向这个对象中设置 realtimeLoading 属性
      if (!l.realtimeLoading)
        l.realtimeLoading = true;
      // 把添加完 realtimeLoading 属性的新对象set()进数据中
      this.$set(this.lines, i, l);

      let url = this.url.busRealtime + `?routeName=${l.name}&direction=${l.direction}&station=${l.stationSeq}`
      let that = this;
      this.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
        let r = {};
        r.message = res.data.result.message;
        r.distanceKM = res.data.result.distanceKM;
        r.timeMinutes = res.data.result.timeMinutes;
        r.plateNumber = res.data.result.plateNumber;
        r.stops = res.data.result.stops;

        l.realtime = r;
        l.realtimeLoading = false;
        that.$set(that.lines, i, l);
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
  computed: {}
}
</script>

<style lang="less">
@import url("station_detail.less");
</style>
