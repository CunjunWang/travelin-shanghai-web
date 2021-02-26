<template>
  <view class="line-info-container">
    <view class="info-row">
      <view class="line-name">
        <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon"></image>
        <text class="name" :style="{color: '#' + line.color + ';'}">
          {{ line.name + (line.status === 1 ? '(建设中)' : '') }}
        </text>
        <text class="english-name" :style="{color: '#' + line.color + ';'}">
          {{ line.englishName }}
        </text>
      </view>
      <view class="desc-block">
        <text v-if="showWashroomList" class="washrooms underline" @tap.stop="toggleWashroomList()">
          {{ line.washroomShow ? '收起' : '洗手间' }}
        </text>
        <text class="detail underline" @tap.stop="directionDetail(line.name)">
          线路详情
        </text>
        <text v-if="showStationList && line.status === 0" class="stations underline"
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
    <!--    <view class="stations-block" v-if="line.stationsShow">-->
    <scroll-view class="stations-block" scroll-y="true" v-if="line.stationsShow">
      <loading v-if="line.stationsLoading" :title="`${line.name}站点列表载入中...`"></loading>
      <view v-else class="stations-container">
        <view v-for="(s, j) in stations" :key="j" class="station-item">
          <view class="info-row">
            <view class="seq-and-name">
              <text class="station-seq">{{ j + 1 }}.</text>
              <text class="station-name" @tap.stop="stationDetail(s)">{{ s.stationName }}</text>
            </view>
            <view class="location">
              <image src="../../static/location-1.png" mode="widthFix" class="location-icon"></image>
              <text class="city">{{ s.city }}</text>
              <text class="district"> {{ s.district }}</text>
            </view>
          </view>
          <view class="station-english-row">{{ s.englishName }}</view>
        </view>
      </view>
    </scroll-view>
    <!--    </view>-->
    <view class="washrooms-block" v-if="line.washroomShow">
      <loading v-if="line.washroomsLoading" :title="`${line.name}洗手间信息载入中...`"></loading>
      <view v-else class="washrooms-container">
        <view class="subtitle">
          <text class="content">图例:</text>
          <text class="position both">付费区外</text>
          <text class="position in">付费区内</text>
          <text class="position no">站内无卫生设施</text>
        </view>
        <view v-for="(w, j) in washrooms" :key="j" class="washroom-item">
          <image :src="getIconPath(w)" mode="widthFix" class="icon"></image>
          <text class="desc">{{ `${w.type}  ${w.description}` }}</text>
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
    stationName: {
      type: String,
      default: ""
    },
    showStationList: {
      type: Boolean,
      default: false
    },
    showWashroomList: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      stationsLoading: false,
      stations: [],
      washrooms: {},
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
    stationDetail: function (station) {
      station = JSON.stringify(station);
      uni.navigateTo({
        url: `../station_detail/station_detail?type=metro&station=${station}`
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
        let url = `${that.url.metro.lineStationList.format(l.name)}?origin=${l.origin}&dest=${l.dest}`;
        that.ajax(url, constant.HTTP_METHOD_GET, null, function (res) {
          that.stations = res.data.list;
          l.stationsLoading = false;
          that.$emit("toggle-station-list", l);
        });
      }
    },
    toggleWashroomList: function () {
      let l = this.line;
      let that = this;
      l.washroomShow = !l.washroomShow;
      that.$emit("toggle-washroom-list", l);

      if (l.washroomShow) {
        l.washroomsLoading = true;
        let washroomsUrl = that.url.metro.stationLineWashrooms.format(that.stationName, l.name);
        that.ajax(washroomsUrl, constant.HTTP_METHOD_GET, null, function (res) {
          that.washrooms = res.data.list;
          l.washroomsLoading = false;
          that.$emit("toggle-washroom-list", l);
        })
      }
    },
    getIconPath: function (w) {
      console.log(w);
      let type;
      if (w.type === '普通洗手间')
        type = 'normal'
      else
        type = 'inability';

      if (type === 'normal')
        if (w.position === '费区外' || w.position === '费区内外')
          return '../../static/washroom-both-1.png';
        else if (w.position === '费区内')
          return '../../static/washroom-in-1.png';
        else
          return '../../static/washroom-no-1.png';
      else if (type === 'inability')
        if (w.position === '费区外' || w.position === '费区内外')
          return '../../static/inability-both-1.png';
        else if (w.position === '费区内')
          return '../../static/inability-in-1.png';
        else
          return '../../static/inability-no-1.png';
      else
        return null;
    }
  }
}
</script>

<style lang="less">
@import url("metro_line_card.less");
</style>
