<template>
  <view class="page">
    <view class="tab-container">
      <text :class="['nav', getActive('lines')]"
            @tap="changeMode('lines')">线路查询
      </text>
      <text :class="['nav', getActive('stations')]"
            @tap="changeMode('stations')">站点查询
      </text>
    </view>
    <view class="search-bar">
      <search-bar :placeholder="buildSearchPlaceHolder()"
                  v-model="keyword"
                  @keyword="onKeywordChange($event)">
      </search-bar>
    </view>
    <view v-if="mode === 'lines'" class="data-container bus-lines-container">
      <view class="lines-container">
        <bus-line-card v-for="(l, i) in lines"
                       :key="i" :line="l">
        </bus-line-card>
      </view>
    </view>
    <view v-if="mode === 'stations'" class="data-container bus-stations-container">
      <view class="stations-container">
        <!-- TODO -->
        <view v-for="(s, i) in stations" :key="i">
          {{ s.stationName }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";
import BusLineCard from "../../components/bus_line_card/bus_line_card";
import {constant} from "../../common/constant";

export default {
  components: {
    SearchBar,
    BusLineCard
  },
  data() {
    return {
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
          url = `${ref.url.bus.lineListByKeyword}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&keyword=${keyword}`;
        else if (mode === 'stations')
          url = `${ref.url.bus.stationListByKeyword}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}&keyword=${keyword}`;
      } else {
        if (mode === 'lines')
          url = `${ref.url.bus.lineList}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}`;
        else if (mode === 'stations')
          url = `${ref.url.bus.stationList}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}`;
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
            title: `又加载了${ref.pageSize}条数据'`
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
    }
  }
}
</script>

<style lang="less">
@import url("bus.less");
</style>
