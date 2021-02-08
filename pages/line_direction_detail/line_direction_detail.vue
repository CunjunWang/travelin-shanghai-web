<template>
  <view>
    TODO: 引入地图在地图上展示线路
    <view class="title">
      <text class="line-name">{{ name }}</text>
      <text class="desc">线路详情</text>
    </view>
    <view class="direction-container">
      <view class="direction-info" v-for="d in directions">
        {{ name }}-开往: {{ d.dest }}
        <view>
          <text>首班车: {{ d.first }}</text>
          <text>末班车: {{ d.last }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      directions: []
    }
  },
  onLoad: function (data) {
    let that = this;
    let name = data.name;
    let type = data.type;

    that.name = name;
    let url;
    if (type === "bus") {
      url = that.url.busLineDirectionTime;
    } else if (type === "metro")
      url = that.url.metroLineDirectionTime;
    url = url + name
    that.ajax(url, "GET", null, function (resp) {
      let dir = [];
      for (let ldt of resp.data.data.data) {
        let d = {
          direction: ldt.direction,
          origin: ldt.origin,
          dest: ldt.origin
        }
        if (type === "bus") {
          d.first = ldt.firstBus;
          d.last = ldt.lastBus;
        } else if (type === "metro") {
          d.first = ldt.firstMetro;
          d.last = ldt.lastMetro;
        }
        dir.push(d);
      }
      that.directions = dir;
    })
  },
  methods: {}
}
</script>

<style lang="less">
@import url("line_direction_detail.less");
</style>
