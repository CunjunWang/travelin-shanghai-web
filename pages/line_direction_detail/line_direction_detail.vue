<template>
  <view class="page">
    <title
        :icon="'../../static/line-1.png'"
        :title="name"
        :desc="'线路详情'">
    </title>
    <view class="direction-container">
      <direction
          v-for="(d, i) in directions" :key="i"
          @tap="lineDirectionDetail(name, d)"
          :name="name"
          :type="type"
          :data="d"
          :border="true"
          :station-active="true">
      </direction>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

import Title from "../../components/title/title"
import Direction from "../../components/direction/direction"
import {secret} from "../../common/secret";

export default {
  components: {
    Title,
    Direction
  },
  data() {
    return {
      name: "",
      type: "",
      directions: [],
    }
  },
  onLoad: function (data) {
    let that = this;
    let name = data.name;
    let type = data.type;
    that.name = name;
    that.type = type;
    let url;
    if (type === constant.TRAVEL_TYPE_BUS) {
      url = that.url.busLineDirectionTime.format(name);
    } else if (type === constant.TRAVEL_TYPE_METRO)
      url = that.url.metroLineDirectionTime.format(name);
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (resp) {
      let dir = [];
      for (let ldt of resp.data.result) {
        let d = {}
        Object.assign(d, ldt);
        if (that.type === constant.TRAVEL_TYPE_METRO)
          d.color = ldt.color;
        dir.push(d);
      }
      that.directions = dir;
    })
  },
  onShow() {
  },
  methods: {
    lineDirectionDetail: function (name, data) {
      let dataStr = JSON.stringify(data);
      console.log(name);
      uni.navigateTo({
        url: `../line_direction_stations/line_direction_stations?name=${name}&type=${this.type}&data=${dataStr}`
      });
    }
  }
}
</script>

<style lang="less">
@import url("line_direction_detail.less");
</style>
