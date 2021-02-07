<template>
  <view>
    线路详情: {{ name }}-{{ type }}
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      type: ""
    }
  },
  onLoad: function (data) {
    let that = this;
    that.name = data.name;
    that.type = data.type;
  },
  methods: {}
}
</script>

<style>

</style>
