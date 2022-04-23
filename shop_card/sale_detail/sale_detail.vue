<template>
	<view>
		<view class="header-image">
			<view>
				{{return_goods.status_deac}}
			</view>
			<image src="/static/icon_20.png" mode="" />
		</view>
		<view class="box">
			<view class="tip font-30">
				{{return_goods.status_notice}}
			</view>
			<view class="font-24">
				<view v-for="(item,index) in notice" :key="index" >
					· {{item}}
				</view>	
			</view>
		</view>
		<view class="history font-32 more" @tap="to_history">
			协商历史
		</view>
		<view class="number font-28">
			退款编号：{{return_goods.order_sn}}
		</view>
		<view class="order-good">
			<view 
				class="order-item">
				<image :src="$image+return_goods.goods_list.original_img" mode="" />
				<view class="good-item">
					<view class="flex">
						<view class="ellipsis-two font-28">{{return_goods.goods_list.goods_name}}</view>
						<view class="font-34">X{{return_goods.goods_list.goods_num}}</view>
					</view>
					<view class="font-26">
						{{return_goods.goods_list.spec_key_name}}
					</view>
					<view class="flex flex2">
						<view class="font-32">
							￥{{return_goods.goods_list.member_goods_price}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="service font-30" @tap="server_img=true">
			<image src="/static/service.png" mode="" />
			联系客服
		</view>
		<view class="create-time font-26">
			<view>
				退款原因：{{return_goods.reason}}
			</view>
			<view>
				退款金额：￥{{return_goods.refund_deposit}}
			</view>
			<view>
				申请时间：{{return_goods.addtime}}
			</view>
		</view>
		<view class="option" v-if="return_goods.status===0">
			<view class="font-28" @tap="cancel(return_goods)">
				取消退款
			</view>
		</view>
		<server-img v-model="server_img"></server-img>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				return_goods:{
					goods_list:{}
				},
				id:'',
				notice:[],
				server_img:false
			}
		},
		onLoad({id}){
			this.id=+id;
			
		},
		onShow(){
			this.get_list();
		},
		methods: {
			get_list(){
				this.$http('get|api/Order/return_goods_info',{
					id:this.id
				}).then(res=>{
					this.return_goods=res.result.return_goods;
					this.notice=res.result.notice
				})
			},
			cancel(item){
				uni.showModal({
					title: '提示',
					content: '确认取消退款',
					success:  (res)=> {
						if (res.confirm) {
							this.$http('get|api/Order/return_goods_cancel',{
								id:item.id
							}).then(res=>{
								this.$toastApp(res.msg);
								setTimeout(()=>{
									this.get_list();
								},2000)
							}).catch(e=>{
								this.$toastApp(e.msg)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			to_history(){
				uni.navigateTo({
					url:`/shop_card/history/history?id=${this.id}`
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}
	page::after{
		content: '';
		display: block;
		height: 140rpx;
	}
	.header-image{
		padding: 40rpx 60rpx;
		box-sizing: border-box;
		/* #ifdef APP-PLUS */
		background: linear-gradient(225deg, rgba(116, 155, 255, 1) 0%, rgba(65, 100, 244, 1) 100%);
		/* #endif */
		/* #ifdef H5 */
		background: linear-gradient(225deg, #02D86D 0%, #00B159 100%);
		/* #endif */
		height:184rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #ffffff;
		image{
			width: 100rpx;
			height: 100rpx;
		}
	}
	.box{
		padding: 0 30rpx;
		background-color: #ffffff;
		box-sizing: border-box;
		.tip{
			box-shadow: 0px 1rpx 0rpx 0rpx #DFDFDF;
			line-height: 100rpx;
		}
		.font-24{
			line-height: 34rpx;
			padding: 20rpx 0;
			color: #999999;
		}
	}
	.history{
		padding: 0 30rpx;
		line-height: 100rpx;
		margin-top: 20rpx;
		background-color: #ffffff;
	}
	.more{
		position: relative;
	}
	.more::after{
		background-image:url(../../static/small_more.png);
		background-size: 100%;
		height: 24rpx;
		width: 14rpx;
		content: '';
		position: absolute;
		right: 30rpx;
		top: 50%;
		margin-top:-12rpx ;
	}
	.number{
		margin-top: 20rpx;
		background-color: #ffffff;
		height: 80rpx;
		padding: 0 30rpx;
		line-height: 80rpx;
	}
	.order-good{
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		box-shadow:0px -1px 0px 0px rgba(223,227,230,1);
		border-bottom: 1rpx solid rgba(223,227,230,1);
		background-color: #ffffff;
		image{
			height: 200rpx;
			width: 200rpx;
		}
		.order-item{
			display: flex;
			.good-item{
				flex: 1;
				padding-left: 20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.flex{
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.ellipsis-two{
						max-width: 380rpx;
					}
				}
				.font-26{
					color: #999999;
				}
			}
		}
	}
	.service{
		height: 80rpx;
		display: flex; 
		justify-content: center;
		align-items: center;
		background-color: #ffffff;
		image{
			height: 36rpx;
			width: 36rpx;
			margin-right: 20rpx;
		}
	}
	.create-time{
		min-height: 100rpx;
		padding:30rpx;
		background-color: #ffffff;
		margin-top: 20rpx;
		box-sizing: border-box;
		>view{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			color: #9B9B9B;
			line-height: 36rpx;
		}
	}
	.option{
		height: 100rpx;
		background-color: #ffffff;
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 30rpx;
		box-sizing: border-box;
		.font-28{
			line-height: 60rpx;
			width: 170rpx;
			background-color: var(--theme);
			text-align: center;
			color: #ffffff;
			border-radius:8rpx;
		}
	}
</style>
