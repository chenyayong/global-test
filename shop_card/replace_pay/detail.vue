<template>
	<view>
		<view class="top-card">
			<view>我在 global3 上挑了样好东西，</view>
			<view>请您帮我付个款吧~</view>
		</view>
		<view class="contxt-box">
			<view class="info-item">
				<text class="tlt">订单编号：</text>
				<text class="txt">{{info.order_sn}}</text>
			</view>
			<view class="info-item">
				<text class="tlt">下单人：</text>
				<text class="txt">{{userInfo.realname | newName}}*({{userInfo.mobile}})</text>
			</view>
			<view class="replace-num">
				<view class="tlt">代付金额</view>
				<view class="input-box">
					<text>¥</text>
					<input type="number" v-model="money" placeholder="请输入代付金额" placeholder-class="no-in"/>
					<image v-show="money>0" @tap="money = ''" class="close-btn" src="/static/close_new.png"></image>
				</view>
				<view class="all-box">
					<text>剩余代付金额: ¥{{info.order_amount}}</text>
					<text class="all-btn" @tap="money = info.order_amount">全部代付</text>
				</view>
			</view>
			<view class="tips-box">
				<view>付款说明</view>
				<view class="txt" v-for="(item,index) in explain" :key="index">{{item}}</view>
			</view>
			<view class="pay-btn" :class="{'is-ok':money>0}" @tap="takePay">立即支付</view>
			<view class="goods-big-tlt">代付商品</view>
		</view>
		<view class="goods-item" v-for="(item,index) in info.goods_list" :key="index">
			<image class="thumb" :src="$image+item.original_img"></image>
			<view class="right-box">
				<view class="top-box">
					<view class="goods-tlt">{{item.goods_name}}</view>
					<view class="sum-num">x{{item.goods_num}}</view>
				</view>
				<view class="mid-box">{{item.spec_key_name}}</view>
				<view class="price-box">¥{{item.member_goods_price}}</view>
			</view>
		</view>
		<view class="ios-btm"></view>
		<pay-password ref="pay" :pay_price="money" v-model="pay_password" @check_word="check_word"></pay-password>
		<pay-type v-model="showPay" @over_pay="over_pay" @integral_pay="integral_pay"></pay-type>
	</view>
</template>

<script>
	import payType from './child/pay-type.vue'
	import payPassword from './child/pay_password.vue'
	export default {
		components:{
			payType,
			payPassword
		},
		data() {
			return {
				id:'',
				info:'',
				userInfo:'',
				explain:[],
				money:'',
				showPay:false,
				pay_radio:'',
				pay_password: false, //输入密码
			}
		},
		onLoad(opt) {
			this.id = opt?.id
			this.getDetail()
		},
		methods:{
			getDetail(){
				this.$http('get|api/Order/multi_another_order_detail',{
					order_id: this.id
				}).then(res => {
					if (res.status == 1) {
						console.log(res);
						this.info = res.result.order_info
						this.userInfo = res.result.userinfo
						this.userInfo.mobile = this.$phoneFilter(this.userInfo.mobile)
						this.explain = res.result.explain
					}
				}).catch(e => {
					this.$toastApp(e.msg)
					if (e.status == -7) {
						setTimeout(() => {
							uni.navigateBack()
						},400)
					}
				})
			},
			takePay(){
				if (this.money) {
					if (this.money > this.info.order_amount) {
						this.$toastApp('支付金额大于剩余代付金额')
						return
					}
					this.showPay = true
				}
			},
			check_word(e){
				this.submit(e)
			},
			integral_pay(){
				this.pay_radio = 'pay_points'
				this.showPay = false
				this.pay_password = true
			},
			over_pay(){
				this.pay_radio = 'user_money'
				this.showPay = false
				this.pay_password = true
			},
			submit(psw){
				this.$http('get|api/Order/multi_another_pay',{
					order_id: this.id,
					pay_radio: this.pay_radio,
					amount: this.money,
					paypwd: psw
				}).then(res => {
					if (res.status == 1) {
						uni.navigateBack()
						this.$toastApp(res.msg)
					}
				}).catch(e => {
					this.$refs.pay.passworld = []
					this.$toastApp(e.msg)
					this.getDetail()
				})
			}
		},
		filters:{
			newName(val){
				return val?val.substring(0,val.length-1):''
			}
		}
	}
</script>

<style lang="scss">
	view{
		box-sizing: border-box;
	}
	.top-card{
		width: 100vw;
		height: 300rpx;
		/* #ifdef APP-PLUS */
		background-image: url("/static/instead_pay.png");
		background-size: 100%;
		/* #endif */
		/* #ifdef H5 */
		// background-image: url("/static/instead_pay.png");
		background: linear-gradient(225deg, #02D86D 0%, #00B159 100%);
		/* #endif */
		padding-left: 160rpx;
		padding-top: 100rpx;
		color: #F2F5FF;
		font-size: 36rpx;
		line-height: 50rpx;
	}
	.contxt-box{
		padding: 0 30rpx;
		.info-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100rpx;
			font-size: 30rpx;
			box-shadow: 0 2rpx 0 0 #EEEEEE;
			.tlt{
				color: #808080;
			}
			.txt{
				color: #333333;
			}
		}
	}
	.replace-num{
		.tlt{
			padding: 30rpx 0;
			color: #333333;
			font-size: 30rpx;
		}
		.input-box{
			display: flex;
			align-items: center;
			font-size: 48rpx;
			color: #FF340A;
			height: 70rpx;
			input{
				margin-left: 6rpx;
				width: 600rpx;
				font-weight: bold;
				font-size: 60rpx;
				// line-height: 70rpx;
				font-family: DINAlternate-Bold, DINAlternate;
			}
			.no-in{
				font-size: 32rpx;
				color: #BEBEBE;
				// font-weight: 400;
			}
			.close-btn{
				width: 36rpx;
				height: 36rpx;
			}
		}
		.all-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 10rpx;
			color: #BEBEBE;
			font-size: 24rpx;
			line-height: 34rpx;
			margin-top: 20rpx;
			box-shadow: 0 -2rpx 0 0 #EEEEEE;
			.all-btn{
				color: var(--theme);
			}
		}
	}
	.tips-box{
		padding: 30rpx;
		background-color: #F7F7F7;
		border-radius: 10rpx;
		color: #969799;
		font-size: 26rpx;
		line-height: 36rpx;
		margin-top: 60rpx;
		.txt{
			margin-top: 16rpx;
		}
	}
	.pay-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #C8C7CC;
		height: 90rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		border-radius: 45rpx;
		margin-top: 60rpx;
	}
	.is-ok{
		background-color: var(--theme);
	}
	.goods-big-tlt{
		color: #969799;
		font-size: 32rpx;
		line-height: 44rpx;
		padding: 30rpx 0 ;
		margin-top: 30rpx;
	}
	.goods-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		.thumb{
			width: 200rpx;
			height: 200rpx;
		}
		.right-box{
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			width: 470rpx;
			height: 200rpx;
			.top-box{
				width: 470rpx;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				.goods-tlt{
					width: 380rpx;
					color: #292D33;
					font-size: 28rpx;
					line-height: 40rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.sum-num{
					color: #474F59;
					font-size: 34rpx;
					line-height: 48rpx;
				}
			}
			.mid-box{
				color: #999999;
				font-size: 26rpx;
				line-height: 36rpx;
			}
			.price-box{
				color: #474F59;
				font-size: 32rpx;
				line-height: 44rpx;
			}
		}
	}
	.goods-item:not(:first-child){
		box-shadow: 0 2rpx 0 0 #EEEEEE;
	}
	
	.ios-btm {
		height: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		height: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
	}
</style>
