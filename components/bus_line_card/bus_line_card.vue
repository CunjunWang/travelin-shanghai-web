<template>
  <view class="line-info-container">
    <view class="info-row">
      <view class="name-tag-row">
        <image src="../../static/bus-1.png" mode="widthFix" class="icon"></image>
        <text class="name">
          {{ line.busName }}
        </text>
        <view class="tags-block">
          <text v-if="line.typeCode === 1" class="tag night">夜宵线</text>
          <text v-if="line.typeCode === 2" class="tag busy">高峰线</text>
          <text v-if="line.realtime === 1" class="tag realtime">实时</text>
          <text v-if="line.busTag && line.busTag !== ''" class="tag district-bus">{{ line.busTag }}</text>
        </view>
      </view>
      <view class="desc-block">
        <text class="detail underline" @tap.stop="lineDirectionDetail()">
          线路详情
        </text>
      </view>
    </view>
    <view class="english-name-row">
      <text class="english-name">
        {{ line.englishName }}
      </text>
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
  </view>
</template>

<script>
export default {
  props: {
    line: {
      type: Object,
      default: {
        busName: "",
        englishName: "",
        origin: "",
        dest: "",
        originEnglish: "",
        destEnglish: ""
      }
    }
  },
  methods: {
    lineDirectionDetail: function () {
      let that = this;
      let line = {
        lineName: that.line.busName,
        lineEnglishName: that.line.englishName,
      };
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?type=bus&line=${JSON.stringify(line)}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("bus_line_card.less");
</style>
