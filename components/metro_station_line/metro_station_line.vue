<template>
  <view class="line-info-container"
        :style="{border: `solid 1rpx #${data.color}`}"
        @tap="directionDetail(data.name)">
    <view class="info-row">
      <view class="line-name">
        <image src="../../static/sh-metro-1.png" mode="widthFix" class="icon"></image>
        <text class="name" :style="{color: `#${data.color}`}">{{ data.name }}</text>
        <text class="english-name" :style="{color: `#${data.color}`}">{{ data.englishName }}</text>
      </view>
    </view>
    <view class="direction-block">
      <view class="chinese-row">
        <text :class="['direction', 'origin', underline(data.origin)]"
              @tap.stop="stationDetail(data.origin)">{{ data.origin }}
        </text>
        -
        <text :class="['direction', 'dest', underline(data.dest)]"
              @tap.stop="stationDetail(data.dest)">{{ data.dest }}
        </text>
      </view>
      <view class="english-row">
        <text class="direction origin"
              @tap.stop="stationDetail(data.origin)">{{ data.originEnglish }}
        </text>
        -
        <text class="direction dest"
              @tap.stop="stationDetail(data.dest)">{{ data.destEnglish }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

export default {
  props: {
    data: {
      type: Object,
      default: {}
    },
    stationName: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  methods: {
    directionDetail: function (line) {
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?name=${line}&type=metro`
      });
    },
    underline: function (station) {
      return this.stationName !== station ? 'underline' : '';
    },
    stationDetail: function (station) {
      if (this.stationName !== station)
        uni.navigateTo({
          url: `../station_detail/station_detail?stationName=${station}&type=${this.type}`
        });
    },
  }
}
</script>

<style lang="less">
@import url("metro_station_line.less");
</style>
