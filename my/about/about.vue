<template>
	<view>
		<view class="content font-30">
    		<rich-text :nodes="node"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				node:''
			}
		},
		onLoad({title,id}){
			// uni.setNavigationBarTitle({
			// 	title
			// });
			// this.title=title
			this.$http("post|api/Article/regulation",{
				id:id
			}).then(res=>{
				this.node=res.result.topic_content;
				this.title=res.result.topic_title;
				uni.setNavigationBarTitle({
					title:this.title
				});
			})
		},
		methods: {
			
		}
	}
</script>

<style lang='scss'>
	.content{
		padding: 0 30rpx;
		box-sizing: border-box;
		margin: 0 auto;
		width: 690rpx;
		color: #3C424D;
		line-height: 60rpx;
		/deep/img{
			width: 100%;
		}
	}
</style>
