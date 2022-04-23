<template>
	<view class="page" v-if="list.length>0">
		<view class="item" v-for="(item,index) in list" :key="index">
			<view class="header">
				<view class="font-32">{{item.title}}</view>
				<view class="font-26">{{item.send_time}}</view>
			</view>
			<view class="content">
				<view class="text font-28 ellipsis-three">{{item.message}}</view>
				<image :src="$image+item.data.original_img" mode="" />
			</view>
		</view>
		<!-- <no-more v-model="have"  @more="more"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</view>
	<no-data v-else></no-data>
</template>

<script>
	export default {
		data() {
			return {
				page:1,
				have:true,
				list:[]
			}
		},
		onLoad(){
			this.get_list();
		},
		methods: {
			get_list(bool){
				this.$http('get|api/User/ajax_message_notice',{
					p:this.page
				}).then(res=>{
					if(res.result.length===0){
						this.have=false;
						return
					}
					if(bool){
						this.list=[]
					}
					this.list=[...this.list,...res.result]
				})
			},
			more(){
				this.page+=1;
				this.get_list();
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
	.page{
		background-color: #F7F7F7;
		min-height: calc(100vh - 88rpx);
		padding: 30rpx;
		box-sizing: border-box;
		.item{
			width:690rpx;
			height:260rpx;
			background:rgba(255,255,255,1);
			border-radius:8rpx;
			margin: 0 auto;
			margin-bottom: 20rpx;
			padding: 30rpx;
			box-sizing: border-box;
			.header{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.font-26{
					color: #999999;
				}
			}
			.content{
				margin-top: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.text{
					flex: 1;
					line-height: 44rpx;
					padding-right: 30rpx;
					box-sizing: border-box;
					color: #666666;
				}
				image{
					height: 130rpx;
					width: 130rpx;
				}
			}
		}
	}
	.ellipsis-three{
		overflow: hidden;
		text-overflow:ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
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
