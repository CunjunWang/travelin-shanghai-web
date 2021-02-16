<template>
  <view class="page">
    <view class="search-bar">
      <search-bar></search-bar>
    </view>
    <view class="lines-container">
      <metro-line-card v-for="(l, i) in lines" :key="i"
                       :line="l"
                       :type="'metro'"
                       :show-station-list="true"
                       @toggle-station-list="onToggleStationList($event, i)">
      </metro-line-card>
    </view>
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";
import Loading from "../../components/loading/loading";
import MetroLineCard from "../../components/metro_line_card/metro_line_card";

import {constant} from "../../common/constant";

export default {
  components: {
    SearchBar,
    Loading,
    MetroLineCard
  },
  data() {
    return {
      lines: []
    }
  },
  onLoad: function () {
    let that = this;
    that.ajax(that.url.metroLinesList, constant.HTTP_METHOD_GET, null, function (res) {
      let lines = [];
      for (let l of res.data.list) {
        l.stationsShow = false;
        lines.push(l);
      }
      that.lines = lines;
    });
  },
  methods: {
    directionDetail: function (line) {
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?name=${line}&type=metro`
      });
    },
    stationDetail: function (stationName) {
      uni.navigateTo({
        url: `../station_detail/station_detail?stationName=${stationName}&type=metro`
      });
    },
    onToggleStationList: function (e, i) {
      this.$set(this.lines, i, e);
    }
  }
}
</script>

<style lang="less">
@import url("metro.less");
</style>
