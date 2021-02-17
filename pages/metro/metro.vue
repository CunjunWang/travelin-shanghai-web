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
    onToggleStationList: function (e, i) {
      let that = this;
      that.$set(that.lines, i, e);
      for (let k = 0; k < that.lines.length; k++)
        if (k !== i) {
          let l = that.lines[k];
          l.stationsShow = false;
          that.$set(that.lines, k, l);
        }
    }
  }
}
</script>

<style lang="less">
@import url("metro.less");
</style>
