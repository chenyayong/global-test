<template>
	<view v-if="list.length>0">
		<view class="box">
			<view v-for="(item,index) in list" :key="index" class="list-item">
				<view>
					<view class="font-30 ellipsis">订单号: {{item.order_sn}}</view>
					<view class="font-36">{{item.total_amount}}</view>
				</view>
				<view>
					<view class="font-26">{{item.pay_data}}</view>
					<view class="font-26"></view>
				</view>
			</view>
		</view>
		<!-- <no-more v-model="have" @more="more"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</view>
	<view v-else>
		<no-data></no-data>
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
			this.get_list();
		},
		methods: {
			get_list(){
				this.$http('get|api/User/sale_list',{
					p:this.page
				}).then(res=>{
					if(res.result.order_list.length===0){
						this.have=false
						return
					}
					this.list=[...this.list,...res.result.order_list];
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
	.list-item{
		height: 148rpx;
		padding: 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #F3F3F3;
		>view{
			display: flex;
			justify-content: space-between;
		}
		.font-30{
			max-width: 400rpx;
		}
		.font-26{
			color: #999999;
		}
		.font-36{
			color: #FF4C57;
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
