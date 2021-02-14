<template>
  <view class="search-bar">
    <image src="../../static/search-1.png" mode="widthFix" class="icon"></image>
    <input class="search" type="text" v-model="keyword" placeholder="输入您想搜索的站点, 线路等..."/>
  </view>
</template>

<script>
export default {
}
</script>

<style lang="less">
@import url("search_bar.less");
</style>
