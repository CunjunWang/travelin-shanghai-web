<template>
  <view class="station-container">
    <view class="station-info"
          @tap="stationDetail()">
      <view class="station-distance-location">
        <text class="station-name">{{ data.stationName }}</text>
        <view v-if="showDistance" class="distance-container">
          <image src="../../static/walk-1.png" mode="widthFix" class="distance-icon"></image>
          <text class="distance">{{ data.distance }}</text>
        </view>
        <view v-if="showLocation" class="location">
          <image src="../../static/location-1.png" mode="widthFix" class="icon"></image>
          <span class="desc city">{{ data.city }}</span>
          <span class="desc district">{{ data.district }}</span>
        </view>
      </view>
      <view class="english-name">
        {{ data.englishName }}
      </view>
      <view v-if="data.lines && data.lines.length !== 0" class="lines">
        <image v-if="type === 'bus'" src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
        <image v-if="type === 'metro'" src="../../static/metro-1.png" mode="widthFix" class="icon"></image>
        <text class="desc">本站线路:</text>
        <div v-if="type === 'bus'" class="bus-line" v-for="(l, j) in data.lines" :key="j"
             @tap.stop="directionDetail(l, 'bus')">
          {{ l.lineName }}
        </div>
        <span v-if="type === 'metro'" class="metro-line" v-for="(l, j) in data.lines" :key="j"
              @tap.stop="directionDetail(l, 'metro')"
              :style="{backgroundColor: l.lineColor}">
        {{ buildMetroLineName(l) }}
      </span>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ""
    },
    data: {
      type: Object,
      default: {
        stationName: "",
        englishName: "",
        distance: 0,
        lines: []
      }
    },
    userLocation: {
      type: Object,
      default: {}
    },
    showLocation: {
      type: Boolean,
      default: false
    },
    showDistance: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    buildMetroLineName: function (l) {
      let name = l.lineName;
      let status = l.lineStatus;
      if (status === 1)
        return name + '(建)';
      else if (status === 2)
        return name + '(规)';
      else
        return name;
    },
    directionDetail: function (line, type) {
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?type=${type}&line=${JSON.stringify(line)}`
      });
    },
    stationDetail: function () {
      let that = this;
      let station = {};
      Object.assign(station, that.data);
      delete station['lines'];
      delete station['distance'];
      delete station['pureDistance'];
      station = JSON.stringify(station);
      uni.navigateTo({
        url: `../station_detail/station_detail?type=${this.type}&station=${station}&userLocation=${that.userLocation}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("station_card.less");
</style>
