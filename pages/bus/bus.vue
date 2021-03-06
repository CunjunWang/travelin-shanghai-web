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
        <image src="../../static/bus-station-1.png" mode="widthFix" class="icon"></image>
        <text class="nav">站点查询</text>
      </view>
    </view>
    <view class="search-bar">
      <search-bar :placeholder="buildSearchPlaceHolder()"
                  v-model="keyword" @keyword="onKeywordChange($event)">
      </search-bar>
    </view>
    <view class="data-container" @touchstart="start" @touchend="end">
      <view v-if="mode === 'lines'" class="data-container bus-lines-container">
        <view class="lines-container">
          <bus-line-card v-for="(l, i) in lines" :key="i" :line="l"></bus-line-card>
        </view>
      </view>
      <view v-if="mode === 'stations'" class="data-container bus-stations-container">
        <view class="stations-container">
          <station-card v-for="(s, i) in stations"
                        :key="i" :type="'bus'" :data="s"
                        :show-location="true">
          </station-card>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";
import BusLineCard from "../../components/bus_line_card/bus_line_card";
import StationCard from "../../components/station_card/station_card";
import {constant} from "../../common/constant";
import {global} from "../../common/global"

export default {
  components: {
    SearchBar,
    BusLineCard,
    StationCard
  },
  data() {
    return {
      touchStart: {},
      mode: 'lines',
      pageNum: 1,
      pageSize: 10,
      isLastPage: false,
      keyword: '',
      lines: [],
      stations: []
    }
  },
  onLoad: function () {
    let that = this;
    that.mode = 'lines'
  },
  onShow: function () {
    let that = this;
    that.initBusLines();
    that.loadData(that);
  },
  onReachBottom: function () {
    let that = this;
    if (that.isLastPage)
      return;
    that.pageNum = that.pageNum + 1;
    that.loadData(that, that.keyword);
  },
  methods: {
    changeMode: function (mode) {
      let that = this;
      that.mode = mode;
      that.initBusLines();
      that.keyword = '';
      that.loadData(that);
    },
    getActive: function (activeMode) {
      if (this.mode === activeMode)
        return 'tab-active';
      return '';
    },
    onKeywordChange: function (e) {
      let that = this;
      that.initBusLines();
      that.keyword = e;
      that.loadData(that, e);
    },
    buildSearchPlaceHolder: function () {
      let that = this;
      if (that.mode === 'lines')
        return '输入你想搜索的公交线路...'
      else if (that.mode === 'stations')
        return '输入你想搜索的公交站点...'
    },
    loadData: function (ref, keyword) {
      let url;
      let mode = ref.mode;
      if (keyword && keyword !== '') {
        if (mode === 'lines')
          url = `${ref.url.bus.lineListByKeyword}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&keyword=${keyword}&city=${global.GLOBAL_CITY.cityName}`;
        else if (mode === 'stations')
          url = `${ref.url.bus.stationListByKeyword}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&keyword=${keyword}&city=${global.GLOBAL_CITY.cityName}`;
      } else {
        if (mode === 'lines')
          url = `${ref.url.bus.lineList}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&city=${global.GLOBAL_CITY.cityName}`;
        else if (mode === 'stations')
          url = `${ref.url.bus.stationList}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&city=${global.GLOBAL_CITY.cityName}`;
      }

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

        if (ref.pageNum === 1) {
          if (mode === 'lines')
            ref.lines = [];
          else if (mode === 'stations')
            ref.stations = [];
        }

        if (mode === 'lines')
          ref.lines = ref.lines.concat(result);
        else if (mode === 'stations')
          ref.stations = ref.stations.concat(result);

        if (ref.pageNum > 1)
          uni.showToast({
            icon: 'none',
            title: `又加载了${ref.pageSize}条数据`
          });
      });
    },
    initBusLines: function () {
      let that = this;
      that.lines = [];
      that.stations = [];
      that.keyword = '';
      that.pageNum = 1;
      that.isLastPage = false;
      uni.pageScrollTo({
        scrollTop: '0'
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
@import url("bus.less");
</style>
