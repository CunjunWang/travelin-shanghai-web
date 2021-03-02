<template>
  <view class="page">
    <view class="search-bar">
      <search-bar></search-bar>
    </view>
    <view class="lines-container">
      <bus-line-card v-for="(l, i) in lines"
                     :key="i" :line="l">
      </bus-line-card>
    </view>
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";
import BusLineCard from "../../components/bus_line_card/bus_line_card";
import {constant} from "../../common/constant";

export default {
  components: {
    SearchBar,
    BusLineCard
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      isLastPage: false,
      lines: []
    }
  },
  onShow: function () {
    let that = this;
    that.lines = [];
    that.pageNum = 1;
    that.isLastPage = false;
    uni.pageScrollTo({
      scrollTop: '0'
    });
    that.loadMessageList(that);
  },
  onReachBottom: function () {
    let that = this;
    if (that.isLastPage)
      return;
    that.pageNum = that.pageNum + 1;
    that.loadMessageList(that);
  },
  methods: {
    loadMessageList: function (ref) {
      let url = `${ref.url.bus.lineList}?pageNum=${ref.pageNum}&pageSize=${ref.pageSize}`;
      ref.ajax(url, constant.HTTP_METHOD_GET, null, function (resp) {
        let result = resp.data.list;
        if (result == null || result.length === 0) {
          ref.isLastPage = true;
          ref.pageNum = ref.pageNum - 1;
          uni.showToast({
            icon: 'none',
            title: '已经到底了'
          });
          return;
        }

        if (ref.pageNum === 1)
          ref.lines = [];

        ref.lines = ref.lines.concat(result);
        if (ref.pageNum > 1)
          uni.showToast({
            icon: 'none',
            title: '又加载了' + ref.pageSize + '条公交数据'
          });
      });
    }
  }
}
</script>

<style lang="less">
@import url("bus.less");
</style>
