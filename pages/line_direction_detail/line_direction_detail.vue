<template>
  <view class="page">
    TODO: 引入地图在地图上展示线路
    <title
        :icon="'../../static/line-1.png'"
        :title="name"
        :desc="'线路详情'"
        :stick-height="1">
    </title>
    <view class="direction-container">
      <direction
          v-for="d in directions"
          @tap="lineDirectionDetail(name, d)"
          :name="name"
          :type="type"
          :direction="d.direction"
          :first="d.first"
          :last="d.last"
          :origin="d.origin"
          :dest="d.dest"
          :border="true"
          :station-active="true">
      </direction>
      <view v-if="type === 'metro' && intervals.length !== 0" class="interval">区间线</view>
      <direction
          v-if="type === 'metro'"
          v-for="d in intervals"
          @tap="lineDirectionDetail(name, d)"
          :name="name"
          :type="type"
          :direction="d.direction"
          :first="d.first"
          :last="d.last"
          :origin="d.origin"
          :dest="d.dest"
          :border="true"
          :stationActive="true">
      </direction>
    </view>
  </view>
</template>

<script>
import {constant} from "../../common/constant";

import Title from "../../components/title/title"
import Direction from "../../components/direction/direction"

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
      intervals: [],
    }
  },
  onLoad: function (data) {
    let that = this;
    let name = data.name;
    let type = data.type;
    that.name = name;
    that.type = type;
    console.log(that.type);
    let url;
    if (type === constant.TRAVEL_TYPE_BUS) {
      url = that.url.busLineDirectionTime.format(name);
    } else if (type === constant.TRAVEL_TYPE_METRO)
      url = that.url.metroLineDirectionTime.format(name);
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (resp) {
      let dir = [];
      for (let ldt of resp.data.result) {
        let d = {
          direction: ldt.direction,
          origin: ldt.origin,
          dest: ldt.dest,
          first: ldt.first,
          last: ldt.last,
        }
        if (that.type === constant.TRAVEL_TYPE_METRO) {
          d.color = ldt.color;
          d.isInterval = ldt.isInterval;
          if (ldt.isInterval === 1) {
            that.intervals.push(d);
            continue;
          }
        }
        dir.push(d);
      }
      that.directions = dir;
    })
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
