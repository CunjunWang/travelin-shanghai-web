<template>
  <view class="page">
    <search-bar></search-bar>
    地铁查询
  </view>
</template>

<script>
import SearchBar from "../../components/search_bar/search_bar";

export default {
  components: {
    SearchBar
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less">
@import url("metro.less");
</style>
