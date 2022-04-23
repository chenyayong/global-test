<template>
	<view class="page">
		<view class="option">
			<view 
				@tap="to_active(item)"
				v-for="(item,index) in option" 
				:key="index" 
				:class="[item.active?'active':'']">
				{{item.label}}
			</view>
		</view>
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
					<view class="use font-24" @tap="to_index">
						去使用
					</view>
				</view>
				<view class="dashed"></view>
				<view class="boll"></view>
				<view class="boll boll-bottom"></view>
			</view>
		</view>
		<no-data v-else></no-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				option:[
					{
						label:'待使用',
						value:0,
						active:true
					},
					{
						label:'已失效',
						value:2,
						active:false
					}
				],
				coupon_list:[],
				option_type:0
			}
		},
		mounted(){
			this.get_list();
		},
		methods: {
			to_active(item){
				this.option.forEach(el=>{
					el.active=false;
				})
				item.active=true;
				this.option_type=item.value;
				this.get_list();
			},
			to_index(){
				uni.switchTab({
					 url: '/pages/index'
				});
			},
			get_list(){
				this.$http('get|api/User/coupon',{
					type:this.option_type
				}).then(res=>{
					this.coupon_list=res.result
				})
			}
		}
	}
</script>

<style lang="scss">
.page{
	background-color: #F7F7F7;
	min-height: 100vh;
	// #ifdef H5
	min-height: calc( 100vh - 88rpx);
	// #endif
}
	.option{
		display: flex;
		background-color: #ffffff;
		>view{
			flex: 1;
			text-align: center;
			font-size: 30rpx;
			line-height: 90rpx;
			color: #808080;
		}
		.active{
			color: var(--theme);
			position: relative;
		}
		.active::after{
			position: absolute;
			content: '';
			width:160rpx;
			height:2rpx;
			background-color: var(--theme);
			bottom: 0;
			left: 50%;
			margin-left: -80rpx;
		}
	}
	.list-item{
		height: 188rpx;
		width: 690rpx;
		margin: 0 auto;
		position: relative;
		display: flex;
		border-radius: 10rpx;
		overflow: hidden;
		margin-top: 20rpx;
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
			/* #ifdef APP-PLUS */
			background:linear-gradient(225deg,rgba(116,155,255,1) 0%,rgba(65,100,244,1) 100%);
			/* #endif */
			/* #ifdef H5 */
			background: linear-gradient(225deg, #02D86D 0%, #00B159 100%);
			/* #endif */
			// background-color: #CCCCCC;
			text-align: center;
			box-sizing: border-box;
			box-sizing: border-box;
			color: #ffffff;
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
				border:1px solid #ffffff
			}
		}
		.dashed{
			height: 100%;
			border-left:4rpx dashed #4164F4;
			// border-color: #CCCCCC;
			position: absolute;
			left: 459rpx;
			top: 0;
		}
		.boll{
			height: 26rpx;
			width: 26rpx;
			background-color: #F7F7F7;
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
</style>
