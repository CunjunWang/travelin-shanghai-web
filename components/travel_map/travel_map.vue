<template>
  <view class="map-container">
    <map class="map"
         :scale='scale'
         :longitude="location.lon"
         :latitude="location.lat"
         show-location>
    </map>
  </view>
</template>

<script>
import {secret} from "../../common/secret";

export default {
  props: {
    location: {
      type: Object,
      default: {}
    },
    title: {
      type: String,
      default: ""
    },
    scale: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {}
  },
  onShow: function () {
    let that = this;
    let txMap = new that.txMap({
      key: secret.WX_MAP_KEY
    });
    txMap.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      location: {
        latitude: that.location.lat,
        longitude: that.location.lon
      },
      // get_poi: 1, // 是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
      success: function (res) {
        console.log(res);
        // 成功后的回调
        res = res.result;
        let mks = [];
        mks.push({
          title: that.title,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../static/location-2.png',
          width: 20,
          height: 20,
          callout: { // 在markers上展示位置名称，根据需求是否需要
            content: that.title,
            color: '#000',
            display: 'ALWAYS'
          }
        });
        that.txMap.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      }
    });
  },
  methods: {},
}
</script>

<style lang="less">
@import url("travel_map.less");
</style>
