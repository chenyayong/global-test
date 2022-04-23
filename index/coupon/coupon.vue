<template>
	<view class="coupon">
		<image src="/static/coupon.png" class="back-img" mode="" />
		<view class="list" v-if="coupon_list.length>0">
			<view class="list-item" v-for="(item,index) in coupon_list" :key="index">
				<view class="content">
					<view class="font-36 bold">
						{{item.name}}
					</view>
					<view class="font-24">
						全平台满{{item.condition}}元可减{{item.money}}元
					</view>
					<view class="font-24">
						有效期至{{item.use_end_time}}
					</view>
				</view>
				<view class="num">
					<view class="bold">
						<view class="font-36 inline">￥</view>
						<view class="font-84 inline">{{item.money}}</view>
					</view>
					<view class="receive font-24" @tap="to_receive(item,index)">
						立即领取
					</view>
					<!-- <view class="use font-24" v-else>
						去使用
					</view> -->
				</view>
				<view class="dashed"></view>
				<view class="boll"></view>
				<view class="boll boll-bottom"></view>
			</view>
			<!-- <no-more v-model="have" @more="more"></no-more> -->
		</view>
		<no-data v-else></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				coupon_list:[],
				have:true,
				page:1
			}
		},
		onShow(){
			this.page=1;
			this.get_list(true);
		},
		methods: {
			get_list(bool=false){
				this.$http("get|api/Activity/coupon_list",{
					p:this.page
				}).then(res=>{
					if(res.result.length===0){
						this.have=false;
					}
					if(bool){
						this.coupon_list=[]
					}
					this.coupon_list=[...this.coupon_list,...res.result];
				})
			},
			more(){
				this.page+=1;
				this.get_list();
			},
			to_receive(item,index){
				this.$http('get|api/Activity/getCoupon',{
					coupon_id:item.id
				}).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(()=>{
						this.page=1
						this.get_list(true);
					},2000)
				}).catch(e=>{
					this.$toastApp(e.msg);
				})
			}
		},
		onReachBottom() {
			this.page+=1;
			this.get_list();
		}
	}
</script>

<style lang="scss">
.no-more{
	background-color: #FE4601;
}
	.coupon{
		background-color: #FE4601;
		min-height: 100vh;
		// #ifdef H5
		min-height: calc( 100vh - 88rpx);
		// #endif
		padding-bottom: 40rpx;
	}
	.back-img{
		height: 512rpx;
		width: 100%;
		background-size: 100%;
	}
	.list-item{
		height: 188rpx;
		width: 690rpx;
		margin: 0 auto;
		position: relative;
		display: flex;
		border-radius: 10rpx;
		overflow: hidden;
		.content{
			background-color: #ffffff;
			width: 460rpx;
			height: 100%;
			padding: 24rpx;
			box-sizing: border-box;
			.font-36{
				margin-bottom: 18rpx;
			}
			.font-24{
				color: #999999;
				line-height: 34rpx;
			}
		}
		.num{
			height: 100%;
			flex: 1;
			background:linear-gradient(180deg,rgba(255,222,132,1) 0%,rgba(255,179,0,1) 100%);
			// padding-left:24rpx;
			text-align: center;
			box-sizing: border-box;
			color: #F41613;
			.font-84{
				line-height: 120rpx;
			}
			.receive{
				width:134rpx;
				background:rgba(244,22,19,1);
				border-radius:20rpx;
				color: #ffffff;
				text-align: center;
				line-height: 38rpx;
				margin: 0 auto;
			}
			.use{
				width:134rpx;
				border-radius:20rpx;
				text-align: center;
				line-height: 38rpx;
				margin: 0 auto;
				border-radius:20px;
				border:1px solid rgba(244,22,19,1)
			}
		}
		.dashed{
			height: 100%;
			border-left:4rpx dashed #F41613;
			position: absolute;
			left: 459rpx;
			top: 0;
		}
		.boll{
			height: 26rpx;
			width: 26rpx;
			background-color: #FE4601;
			border-radius: 50%;
			position: absolute;
			left: 460rpx;
			margin-left: -13rpx;
			top: -13rpx;
		}
		.boll-bottom{
			top:auto;
			bottom: -13rpx;
		}
	}
	.list-item+.list-item{
		margin-top: 20rpx;
	}

</style>
