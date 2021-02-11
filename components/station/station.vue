<template>
  <view class="station-container">
    <view v-for="d in data" class="station-info">
      <view class="station-distance">
        <text class="station-name">{{ d.stationName }}</text>
        <view class="distance-container">
          <image src="../../static/walk-1.png" mode="widthFix" class="distance-icon"></image>
          <text class="distance">{{ d.distance }}</text>
        </view>
      </view>
      <view class="lines">
        <image src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
        <text class="desc">本站线路:</text>
        <div v-if="type === 'bus'" class="bus-line" v-for="l in d.lines" @tap="directionDetail(l, 'bus')">
          {{ l.name }}
        </div>
        <span v-if="type === 'metro'" class="metro-line" v-for="l in d.lines" @tap="directionDetail(l, 'metro')"
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
  }
}
</script>

<style lang="less">
@import url("station.less");
</style>
