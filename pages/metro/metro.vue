<template>
  <view class="page">
    <view class="tab-container">
      <view :class="['tab-item', getActive('lines')]"
            @tap="changeMode('lines')">
        <image src="../../static/line-1.png" mode="widthFix" class="icon"></image>
        <text class="nav">线路查询</text>
      </view>
      <view :class="['tab-item', getActive('stations')]"
            @tap="changeMode('stations')">
        <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon"></image>
        <text class="nav">站点查询</text>
      </view>
    </view>
    <view v-if="mode === 'stations'" class="search-bar">
      <search-bar :placeholder="'输入您想搜索的地铁站点'"
                  v-model="keyword"
                  @keyword="onKeywordChange($event)">
      </search-bar>
    </view>
    <view class="data-container" @touchstart="start" @touchend="end">
      <view v-if="mode === 'lines'" class="data-container metro-lines-container">
        <view class="lines-container">
          <metro-line-card v-for="(l, i) in lines" :key="i" :line="l"
                           :show-station-list="true"
                           @toggle-station-list="onToggleStationList($event, i)">
          </metro-line-card>
        </view>
      </view>
      <view v-if="mode === 'stations'" class="data-container metro-stations-container">
        <!--        <scroll-view scroll-y class="lines-list-container">-->
        <!--          <view class="line-brief-block">-->
        <!--            <text class="line-name">全部</text>-->
        <!--            <text class="line-english-name">All</text>-->
        <!--          </view>-->
        <!--          <view v-for="(l, i) in lines" :key="i" class="line-brief-block"-->
        <!--                :style="{color: l.color}">-->
        <!--            <text class="line-name">{{ l.name }}</text>-->
        <!--            <text class="line-english-name">{{ l.englishName }}</text>-->
        <!--          </view>-->
        <!--        </scroll-view>-->
        <!--        <scroll-view scroll-y class="stations-list-container" >-->
        <!--          站点列表-->
        <!--        </scroll-view>-->
        <view class="stations-container">
          <station-card v-for="(s, i) in stations"
                        :key="i" :type="'metro'" :data="s"
                        :show-location="true">
          </station-card>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";
import Loading from "../../components/loading/loading";
import MetroLineCard from "../../components/metro_line_card/metro_line_card";
import StationCard from "../../components/station_card/station_card";

import {constant} from "../../common/constant";
import {global} from "../../common/global";

export default {
  components: {
    SearchBar,
    Loading,
    MetroLineCard,
    StationCard
  },
  data() {
    return {
      touchStart: {},
      keyword: '',
      mode: 'lines',
      lines: [],
      stations: [],
      pageNum: 1,
      pageSize: 10,
      isLastPage: false,
    }
  },
  onLoad: function () {
    let that = this;
    let url = `${that.url.metro.lineList}?city=${global.GLOBAL_CITY.cityName}`
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
      let lines = [];
      for (let l of res.data.list) {
        l.stationsShow = false;
        lines.push(l);
      }
      that.lines = lines;
    });
  },
  onShow: function () {
    let that = this;
    that.initMetroStations();
    that.loadStationsData(that);
  },
  onReachBottom: function () {
    let that = this;
    if (that.mode === 'stations') {
      if (that.isLastPage)
        return;
      that.pageNum = that.pageNum + 1;
      that.loadStationsData(that, that.keyword);
    }
  },
  methods: {
    changeMode: function (mode) {
      let that = this;
      that.mode = mode;
      if (mode === 'stations') {
        that.initMetroStations();
        that.keyword = '';
        that.loadStationsData(that);
      }
    },
    getActive: function (activeMode) {
      if (this.mode === activeMode)
        return 'tab-active';
      return '';
    },
    onToggleStationList: function (e, i) {
      let that = this;
      that.$set(that.lines, i, e);
      for (let k = 0; k < that.lines.length; k++)
        if (k !== i) {
          let l = that.lines[k];
          l.stationsShow = false;
          that.$set(that.lines, k, l);
        }
    },
    onKeywordChange: function (e) {
      let that = this;
      that.initMetroStations();
      that.keyword = e;
      that.loadStationsData(that, e);
    },
    initMetroStations: function () {
      let that = this;
      that.stations = [];
      that.keyword = '';
      that.pageNum = 1;
      that.isLastPage = false;
      uni.pageScrollTo({
        scrollTop: '0'
      });
    },
    loadStationsData: function (ref, keyword) {
      let url;
      if (keyword && keyword !== '')
        url = `${ref.url.metro.stationListByKeyword}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&keyword=${keyword}&city=${global.GLOBAL_CITY.cityName}`;
      else
        url = `${ref.url.metro.stationList}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&city=${global.GLOBAL_CITY.cityName}`;

      ref.ajax(url, constant.HTTP_METHOD_GET, null, function (resp) {
        let result = resp.data.list;
        if (result == null || result.length === 0) {
          ref.isLastPage = true;
          ref.pageNum = ref.pageNum - 1;
          uni.showToast({
            icon: 'none',
            title: '已经到底了'
          });
          return;
        }

        if (ref.pageNum === 1)
          ref.stations = [];

        ref.stations = ref.stations.concat(result);

        if (ref.pageNum > 1)
          uni.showToast({
            icon: 'none',
            title: `又加载了${ref.pageSize}条数据`
          });
      });
    },
    start(e) {
      this.touchStart.clientX = e.changedTouches[0].clientX;
      this.touchStart.clientY = e.changedTouches[0].clientY;
    },
    end(e) {
      const subX = e.changedTouches[0].clientX - this.touchStart.clientX;
      const subY = e.changedTouches[0].clientY - this.touchStart.clientY;
      if (subX > 200) {
        if (this.mode !== 'lines')
          this.changeMode('lines');
      } else if (subX < -200) {
        if (this.mode !== 'stations')
          this.changeMode('stations');
      }
    }
  }
}
</script>

<style lang="less">
@import url("metro.less");
</style>
