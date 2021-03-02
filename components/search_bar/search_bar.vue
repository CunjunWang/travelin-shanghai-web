<template>
  <view class="search-bar">
    <image src="../../static/search-1.png" mode="widthFix" class="icon"></image>
    <input class="search" type="text" v-model="keyword"
           :placeholder="placeholder"/>
  </view>
</template>

<script>
import {debounce} from "../../common/utils";

export default {
  props: {
    placeholder: {
      type: String,
      default: "输入您想搜索的站点, 线路等..."
    }
  },
  data() {
    return {
      keyword: ''
    }
  },
  // 使用created hook去监听query变化, 而不是使用watch的理由:
  created() {
    this.$watch('keyword', debounce((newQuery) => {
      this.$emit('keyword', newQuery)
    }, 200));
  },
  methods: {
    clear() {
      this.keyword = ''
    },
    setQuery(keyword) {
      this.keyword = keyword
    },
    blur() {
      this.$refs.keyword.blur()
    }
  }
}
</script>

<style lang="less">
@import url("search_bar.less");
</style>
