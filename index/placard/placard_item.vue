<template>
	<view class="placard-item">
		<rich-text :nodes="node"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				node:''
			}
		},
		onLoad({id}){
			this.$http('get|api/Article/news_detail',{
				article_id:id
			}).then(res=>{
				this.node=res.result.content;
				uni.setNavigationBarTitle({
					title: res.result.title
				});
			})
		},
		methods: {
			
		}
	}
</script>

<style>
	.placard-item{
		padding: 30rpx;
	}
</style>
