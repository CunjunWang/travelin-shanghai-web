<template>
	<view>
		公交方向详情: {{ name + "-" + direction }}
	</view>
</template>

<script>
	export default {
		data() {
			return {
			  name: "",
        direction: ""
			}
		},
    onLoad: function (data) {
		  this.name = data.name;
		  this.direction = data.direction;
    },
		methods: {

		}
	}
</script>

<style>

</style>
