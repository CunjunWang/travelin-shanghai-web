<template>
  <view class="station-container">
    <view v-for="(d, i) in data" :key="i" class="station-info"
          @tap="stationDetail(d.stationName)">
      <view class="station-distance">
        <text class="station-name">{{ d.stationName }}</text>
        <view class="distance-container">
          <image src="../../static/walk-1.png" mode="widthFix" class="distance-icon"></image>
          <text class="distance">{{ d.distance }}</text>
        </view>
      </view>
      <view v-if="type === 'metro'" class="english-name">
        {{ d.englishName }}
      </view>
      <view class="lines">
        <image v-if="type === 'bus'" src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
        <image v-if="type === 'metro'" src="../../static/metro-1.png" mode="widthFix" class="icon"></image>
        <text class="desc">本站线路:</text>
        <div v-if="type === 'bus'" class="bus-line" v-for="(l, j) in d.lines" :key="j"
             @tap.stop="directionDetail(l, 'bus')">
          {{ l.name }}
        </div>
        <span v-if="type === 'metro'" class="metro-line" v-for="(l, j) in d.lines" :key="j"
              @tap.stop="directionDetail(l, 'metro')"
              :style="{backgroundColor: '#' + l.lineColor}">
        {{ l.name }}
      </span>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    type: {
      type: String,
      default: ""
    }
  },
  methods: {
    directionDetail: function (line, type) {
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?name=${line.name}&type=${type}`
      });
    },
    stationDetail: function (stationName) {
      uni.navigateTo({
        url: `../station_detail/station_detail?stationName=${stationName}&type=${this.type}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("station.less");
</style>
