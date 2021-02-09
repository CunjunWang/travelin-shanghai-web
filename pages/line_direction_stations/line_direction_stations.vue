<template>
  <view class="page">
    TODO: 引入地图在地图上展示线路
    <view class="direction-info">
      <view class="line-and-direction">
        <text class="line-name">{{ name }}</text>
        <text class="line-direction">{{ data.direction }} 方向</text>
      </view>
      <view class="direction-detail">
        <view class="row time-row">
          <view>
            <span class="small-text first">首</span>
            <text class="small-content">{{ data.first }}</text>
          </view>
          <view>
            <span class="small-text last">末</span>
            <text class="small-content">{{ data.last }}</text>
          </view>
        </view>
        <view class="row station-row">
          <span class="small-text origin">起</span>
          <text class="small-content">{{ data.origin }}</text>
        </view>
        <view class="row station-row">
          <span class="small-text dest">终</span>
          <text class="small-content">{{ data.dest }}</text>
        </view>
      </view>
    </view>
    <view class="title">站点列表</view>
    <view class="station-list" v-if="stations.length !== 0">
      <view class="station-container" v-for="(s, i) in stations" @tap="stationDetail(s.stationName)">
        <view class="row station-row">
          <view class="station-info">
            <text class="station-seq">{{ s.stationSeq }}.</text>
            <text class="station-name">{{ s.stationName }}</text>
          </view>
          <view class="realtime" v-if="type === 'bus'" @tap.stop="realtimeInfo(s, i)">实时</view>
        </view>
        <view class="row location-row">
          <image src="../../static/location-1.png" mode="widthFix" class="icon"></image>
          <span class="desc city">{{ s.city }}</span>
          <span class="desc district">{{ s.district }}</span>
        </view>
        <view class="row realtime-row" v-if="s.realtimeShow">
          <view class="realtime-loading" v-if="realtimeLoading">
            <image src="../../static/loading-1.png" mode="widthFix" class="loading"></image>
            <text>实时公交信息请求中...</text>
          </view>
          <view class="realtime-container" v-else>
            <text v-if="realtimeData.message === '等待发车'">暂无在途车辆, 等待起点站发车</text>
            <view v-else class="realtime-data">
              <view class="data-block">
                <image src="../../static/station-1.png" mode="widthFix" class="icon"></image>
                <span>还有 {{ realtimeData.stops }} 站</span>
              </view>
              <view class="data-block">
                <image src="../../static/distance-1.png" mode="widthFix" class="icon"></image>
                <span>{{ realtimeData.distanceKM }}</span>
              </view>
              <view class="data-block">
                <image src="../../static/time-1.png" mode="widthFix" class="icon"></image>
                <span>{{ realtimeData.timeMinutes }}</span>
              </view>
              <view class="data-block">
                <image src="../../static/plate-1.png" mode="widthFix" class="icon"></image>
                <span>{{ realtimeData.plateNumber }}</span>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "123路",
      type: "bus",
      data: {
        direction: "上行",
        origin: "大柏树",
        dest: "东体育会路",
        first: "05:30",
        last: "23:30"
      },
      stations: [
        {
          busName: "21路",
          city: "上海市",
          direction: "上行",
          district: "虹口区",
          lat: "123",
          lon: "456",
          stationSeq: 1,
          stationName: "大柏树",
          realtimeShow: false
        },
        {
          busName: "21路",
          city: "上海市",
          direction: "上行",
          district: "虹口区",
          lat: "123",
          lon: "456",
          stationSeq: 2,
          stationName: "甘河路",
          realtimeShow: false
        },
        {
          busName: "21路",
          city: "上海市",
          direction: "上行",
          district: "虹口区",
          lat: "123",
          lon: "456",
          stationSeq: 3,
          stationName: "东体育会路",
          realtimeShow: false
        }
      ],
      realtimeLoading: false,
      realtimeData: {
        // message: null,
        // distanceKM: "2.5公里",
        // timeMinutes: "约5分40秒",
        // plateNumber: "沪D-98448",
        // stops: 8,
      }
    }
  },
  onLoad: function (data) {
    let that = this;
    that.name = data.name;
    that.type = data.type;
    that.data = JSON.parse(data.data);
    let url = that.url.busLineDirectionStations.format(that.name, that.data.direction);
    that.ajax(url, "GET", null, function (res) {
      that.stations = res.data.data;
      for (let s of that.stations)
        s.realtimeShow = false;
    });
  },
  methods: {
    stationDetail: function (stationName) {
      uni.navigateTo({
        url: `../station_detail/station_detail?stationName=${stationName}`
      });
    },
    realtimeInfo: function (s, i) {
      let that = this;
      that.toggleRealtimeShow(i);
      console.log("seq: " + (i + 1) + ", realtime: " + s.realtimeShow);
      // 如果当前点击打开了实时信息行 再去请求接口
      if (s.realtimeShow) {
        that.realtimeLoading = true;
        let url = that.url.busRealtime + `?routeName=${s.busName}&direction=${s.direction}&station=${s.stationSeq}`
        that.ajax(url, "GET", null, function (res) {
          let r = {};
          r.message = res.data.data.message;
          r.distanceKM = res.data.data.distanceKM;
          r.timeMinutes = res.data.data.timeMinutes;
          r.plateNumber = res.data.data.plateNumber;
          r.stops = res.data.data.stops;
          that.realtimeData = r;
          that.realtimeLoading = false;
          console.log(that.realtimeData);
        });
      }
    },
    toggleRealtimeShow: function (index) {
      // 找到点击的station对象
      let s = this.stations[index];
      // 向这个对象中添加 realtime 属性
      s.realtimeShow = !s.realtimeShow;
      // 把添加完 realtime 属性的新对象set()进data数据中
      this.$set(this.stations, index, s);
      // 把其他站点的realtime设置为false;
      for (let i = 0; i < this.stations.length; i++)
        if (i !== index) {
          let station = this.stations[i];
          station.realtimeShow = false;
          this.$set(this.stations, i, station);
        }
    }
  }
}
</script>

<style lang="less">
@import url("line_direction_stations.less");
</style>
