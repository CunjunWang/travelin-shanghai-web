<template>
  <view class="page">
    线路 {{ name }} {{ direction }} 站点列表
    <view class="station-list" v-if="stations.length !== 0">
      <view class="station-container" v-for="s in stations">
        <text>{{ s.stationSeq }}. </text>
        <text>{{ s.stationName }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      direction: "",
      stations: [],
    }
  },
  onLoad: function(data) {
    console.log(data);
    let that = this;
    that.name = data.name;
    that.direction = data.dir;
    let url = that.url.busLineDirectionStations.format(that.name, that.direction);
    that.ajax(url, "GET", null, function(res) {
      console.log(res.data.data.data[0].stations);
      that.stations = res.data.data.data[0].stations;
    })
  },
  methods: {}
}
</script>

<style lang="less">
@import url("line_direction_stations.less");
</style>
