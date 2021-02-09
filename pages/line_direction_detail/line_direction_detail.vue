<template>
  <view class="page">
    TODO: 引入地图在地图上展示线路
    <view class="title">
      <text class="line-name">{{ name }}</text>
      <text class="desc">线路详情</text>
    </view>
    <view class="direction-container">
      <direction
          v-for="d in directions"
          @tap="lineDirectionDetail(name, d)"
          :line-name="name"
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
import Direction from "../../components/direction/direction"

export default {
  components: {
    Direction
  },
  data() {
    return {
      name: "",
      type: "",
      directions: []
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
      url = that.url.metroLineDirectionTime + `?`;
    that.ajax(url, constant.HTTP_METHOD_GET, null, function (resp) {
      let dir = [];
      for (let ldt of resp.data.result.data) {
        let d = {
          direction: ldt.direction,
          origin: ldt.origin,
          dest: ldt.dest,
        }
        if (type === constant.TRAVEL_TYPE_BUS) {
          d.first = ldt.firstBus;
          d.last = ldt.lastBus;
        } else if (type === constant.TRAVEL_TYPE_METRO) {
          d.first = ldt.firstMetro;
          d.last = ldt.lastMetro;
        }
        dir.push(d);
      }
      that.directions = dir;
    })
  },
  methods: {
    lineDirectionDetail: function (name, data) {
      let dataStr = JSON.stringify(data);
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
