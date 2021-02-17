<template>
  <view class="line-info-container">
    <view class="info-row">
      <view class="line-name">
        <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon"></image>
        <text class="name" :style="{color: '#' + line.color + ';'}">
          {{ line.name }}
        </text>
        <text class="english-name" :style="{color: '#' + line.color + ';'}">
          {{ line.englishName }}
        </text>
      </view>
      <view class="desc-block">
        <text class="detail underline"
              @tap.stop="directionDetail(line.name)">
          线路详情
        </text>
        <text v-if="showStationList"
              class="stations underline"
              @tap.stop="toggleStationList()">
          {{ line.stationsShow ? '收起' : '站点列表' }}
        </text>
      </view>
    </view>
    <view class="direction-block">
      <view class="chinese-row">
        <text class="direction origin">{{ line.origin }}</text>
        -
        <text class="direction dest">{{ line.dest }}</text>
      </view>
      <view class="english-row">
        <text class="direction origin">{{ line.originEnglish }}</text>
        -
        <text class="direction dest">{{ line.destEnglish }}</text>
      </view>
    </view>
    <view class="stations-block" v-if="line.stationsShow">
      <loading :title="`${line.name}站点列表载入中...`"
               v-if="line.stationsLoading">
      </loading>
      <view v-else class="stations-container">
        <view v-for="(s, j) in stations" :key="j" class="station-item">
          <view class="info-row">
            <view class="seq-and-name">
              <text class="station-seq">{{ j + 1 }}.</text>
              <text class="station-name" @tap.stop="stationDetail(s.stationName)">
                {{ s.stationName }}
              </text>
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
</template>

<script>
import Loading from "../../components/loading/loading";

import {constant} from "../../common/constant";

export default {
  components: {
    Loading
  },
  props: {
    line: {
      type: Object,
      default: {}
    },
    showStationList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stationsLoading: false,
      stations: [],
      lineStations: []
    }
  },
  onLoad: function () {
    if (this.showStationList)
      this.line.stationsShow = false;
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
    toggleStationList: function () {
      let l = this.line;
      let that = this;
      // 向这个对象中设置 stationsShow 属性
      l.stationsShow = !l.stationsShow;
      that.$emit("toggle-station-list", l);

      if (l.stationsShow) {
        l.stationsLoading = true;
        let url = `${that.url.metroLineStationList.format(l.name)}?origin=${l.origin}&dest=${l.dest}`;
        that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
          that.stations = res.data.list;
          l.stationsLoading = false;
          that.$emit("toggle-station-list", l);
        });
      }
    },
  }
}
</script>

<style lang="less">
@import url("metro_line_card.less");
</style>
