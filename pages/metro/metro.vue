<template>
  <view class="page">
    <view class="search-bar">
      <search-bar></search-bar>
    </view>
    <view class="lines-container">
      <view v-for="(l, i) in lines" :key="i" class="line-container">
        <view class="row name-row">
          <view class="name-block">
            <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon"></image>
            <text class="line-name" :style="{color: '#' + l.color + ';'}">{{ l.name }}</text>
            <text class="english-name" :style="{color: '#' + l.color + ';'}">{{ l.english }}</text>
          </view>
          <view class="desc-block">
            <text class="detail underline"
                  @tap.stop="directionDetail(l.name)">
              线路详情
            </text>
            <text class="stations underline"
                  @tap.stop="stationList(i)">
              {{ l.stationsShow ? '收起' : '站点列表' }}
            </text>
          </view>
        </view>
        <view class="row direction-row">
          <text class="direction origin">{{ l.origin }}</text>
          -
          <text class="direction dest">{{ l.dest }}</text>
        </view>
        <view class="row direction-english-row">
          <text class="direction origin">{{ l.originEnglish }}</text>
          -
          <text class="direction dest">{{ l.destEnglish }}</text>
        </view>
        <view class="stations-block" v-if="l.stationsShow">
          <loading :title="`${l.name}站点列表载入中...`"
                   v-if="stationsLoading">
          </loading>
          <view v-else class="stations-container">
            <view v-for="(s, j) in stations" :key="j" class="station-item">
              <view class="info-row">
                <view class="seq-and-name">
                  <text class="station-seq">{{ j + 1 }}.</text>
                  <text class="station-name"
                        @tap.stop="stationDetail(s.stationName)">{{ s.stationName }}</text>
                </view>
                <view class="location">
                  <image src="../../static/location-1.png" mode="widthFix" class="location-icon"></image>
                  <text class="city">{{ s.city }}</text>
                  <text class="district"> {{ s.district }}</text>
                </view>
              </view>
              <view class="station-english-row">
                {{ s.stationEnglishName }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";
import Loading from "../../components/loading/loading";
import {constant} from "../../common/constant";

export default {
  components: {
    SearchBar,
    Loading
  },
  data() {
    return {
      lines: [],
      stationsLoading: false,
      stations: [],
      lineStations: []
    }
  },
  onLoad: function () {
    let that = this;
    that.ajax(that.url.metroLinesList, constant.HTTP_METHOD_GET, null, function (res) {
      let lines = [];
      for (let l of res.data.list) {
        l.stationsShow = false;
        lines.push(l);
        that.lineStations.push([]);
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
    stationList: function (index) {
      let that = this;
      that.toggleStationsShow(index);
      let l = that.lines[index];
      if (l.stationsShow) {
        // if (that.lineStations[index].length !== 0) {
        //   that.stations = that.lineStations[index];
        //   return;
        // }
        that.stationsLoading = true;
        let url = `${that.url.metroLineStationList.format(l.name)}?origin=${l.origin}&dest=${l.dest}`;
        that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
          that.stationsLoading = false;
          that.stations = res.data.list;
          that.lineStations[index] = res.data.list;
        });
      }
    },
    toggleStationsShow: function (index) {
      let that = this;
      let l = that.lines[index];
      l.stationsShow = !l.stationsShow;
      that.$set(that.stations, index, l);
      for (let i = 0; i < that.lines.length; i++)
        if (i !== index) {
          let l = that.lines[i];
          l.stationsShow = false;
          that.$set(that.lines, i, l);
        }
    }
  }
}
</script>

<style lang="less">
@import url("metro.less");
</style>
