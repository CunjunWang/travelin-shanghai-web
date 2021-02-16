<template>
  <view class="page">
    <view class="search-bar">
      <search-bar></search-bar>
    </view>
    <view class="lines-container">
      <view v-for="(l, i) in lines" :key="i" class="line-container">
        <!--                    :style="{border: 'solid 3rpx #' + l.color + ';'}">-->
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
            <text class="stations underline">
              站点列表
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
      </view>
    </view>
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";
import {constant} from "../../common/constant";

export default {
  components: {
    SearchBar
  },
  data() {
    return {
      lines: []
    }
  },
  onLoad: function () {
    let that = this;
    that.ajax(that.url.metroLinesList, constant.HTTP_METHOD_GET, null, function (res) {
      console.log(res);
      that.lines = res.data.list;
    });
  },
  methods: {
    directionDetail: function (line) {
      uni.navigateTo({
        url: `../line_direction_detail/line_direction_detail?name=${line}&type=metro`
      });
    },
  }
}
</script>

<style lang="less">
@import url("metro.less");
</style>
