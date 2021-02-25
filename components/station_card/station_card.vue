<template>
  <view class="station-container">
    <view class="station-info"
          @tap="stationDetail()">
      <view class="station-distance">
        <text class="station-name">{{ data.stationName }}</text>
        <view class="distance-container">
          <image src="../../static/walk-1.png" mode="widthFix" class="distance-icon"></image>
          <text class="distance">{{ data.distance }}</text>
        </view>
      </view>
      <view class="english-name">
        {{ data.englishName }}
      </view>
      <view class="lines">
        <image v-if="type === 'bus'" src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
        <image v-if="type === 'metro'" src="../../static/metro-1.png" mode="widthFix" class="icon"></image>
        <text class="desc">本站线路:</text>
        <div v-if="type === 'bus'" class="bus-line" v-for="(l, j) in data.lines" :key="j"
             @tap.stop="directionDetail(l, 'bus')">
          {{ l.name }}
        </div>
        <span v-if="type === 'metro'" class="metro-line" v-for="(l, j) in data.lines" :key="j"
              @tap.stop="directionDetail(l, 'metro')"
              :style="{backgroundColor: '#' + l.lineColor}">
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
      default: {}
    }
  },
  methods: {
    buildMetroLineName: function (l) {
      let name = l.name;
      let status = l.status;
      if (status === 1)
        return name + '(建)';
      else if (status === 2)
        return name + '(规)';
      else
        return name;
    },
    directionDetail: function (line, type) {
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?name=${line.name}&type=${type}`
      });
    },
    stationDetail: function () {
      let that = this;
      let station = {
        stationName: that.data.stationName,
        englishName: that.data.englishName,
        stationLat: that.data.stationLat,
        stationLon: that.data.stationLon,
        stationStatus: that.data.stationStatus,
        city: that.data.city,
        district: that.data.district
      };
      console.log(station);
      station = JSON.stringify(station);
      uni.navigateTo({
        url: `../station_detail/station_detail?type=${this.type}&station=${station}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("station_card.less");
</style>
