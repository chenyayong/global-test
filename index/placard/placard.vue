<template>
	<view>
		<view 
			v-for="(item,index) in list" 
			:key="index" 
			class="list-item"
			@tap="to_detail(item)">
			<view class="title-header">
				<view class="font-32 ellipsis">{{item.title}}</view>
				<view class="font-26">{{item.add_time}}</view>
			</view>
			<view class="message font-26">
				{{item.description}}
			</view>
			<view class="more font-26">
				查看详情
				<image src="/static/more.png" mode="" />
			</view>
		</view>
		<!-- <no-more v-model="have" @more="more" style="background-color:#ffffff"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				page:1,
				have:true
			}
		},
		mounted(){
			this.get_news_list();
		},
		methods: {
			to_detail(item){
				uni.navigateTo({
					url: `/index/placard/placard_item?id=${item.article_id}`
				});
			},
			get_news_list(){
				this.$http('post|api/Article/news_list',{
					p:this.page
				}).then(res=>{
					if(res.result.news.length===0){
						this.have=false;
					}else{
						this.list=[...this.list,...res.result.news];
					}
				})
			},
			more(){
				this.page+=1;
				this.get_news_list();
			}
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			this.more()
		}
	}
</script>

<style lang="scss">
	.list-item{
		width:690rpx;
		height:270rpx;
		background:rgba(255,255,255,1);
		box-shadow:0px 4rpx 20rpx 0px rgba(0,0,0,0.08);
		border-radius:6rpx;
		margin: 46rpx auto 0 auto;
		padding: 30rpx;
		box-sizing: border-box;
		position: relative;
		.title-header{
			display: flex;
			justify-content: space-between;
			.font-32{
				position: relative;
				max-width: 350rpx;
			}
			.font-32::after{
				position: absolute;
				content: '';
				right: -24rpx;
				top: -6rpx;
				width:24rpx;
				height:24rpx;
				background:rgba(251,85,67,1);
				border-radius: 50%;
			}
			.font-26{
				color: #919298;
			}
		}
		.message{
			margin-top: 20rpx;
			color: #919298;
			overflow: hidden;
			text-overflow:ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
		.more{
			position: absolute;
			right: 30rpx;
			bottom: 30rpx;
			color: #919298;
			image{
				vertical-align: middle;
				height: 32rpx;
				width: 32rpx;
				margin-left: 12rpx;
			}
		}
	}
	.no-more {
		color: #999999;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 26rpx;
		background-color: #F7F7F7;
	}
</style>
