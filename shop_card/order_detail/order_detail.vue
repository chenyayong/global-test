<template>
	<view class="page">
		<view class="header-image" v-if="order_info.order_status_code==='WAITPAY'">
			<view>
				<view class="font-34">等待买家付款</view>
				<view class="font-26">请尽快付款</view>
			</view>
			<image src="/static/icon_14.png" mode="" />
		</view>
		<view class="header-image" v-if="order_info.order_status_code==='WAITSEND'">
			<view>
				买家已付款
			</view>
			<image src="/static/icon_18.png" mode="" />
		</view>
		<view class="header-image quxiao" v-if="order_info.order_status_code==='CANCEL'">
			<view>
				交易关闭
			</view>
			<image src="/static/icon_15.png" mode="" />
		</view>
		<view class="header-image" v-if="order_info.order_status_code==='WAITRECEIVE'">
			<view>
				<view class="font-34">卖家已发货</view>
				<view class="font-26">还剩{{order_info.auto_confirm_date|filterTime}}自动确认</view>
			</view>
			<image src="/static/icon_16.png" mode="" />
		</view>
		<view class="header-image" v-if="order_info.order_status_code==='WAITCCOMMENT'">
			<view>
				交易成功！
			</view>
			<image src="/static/icon_19.png" mode="" />
		</view>
		<view class="header-image" v-if="order_info.order_status_code==='REFUND'">
			<view>
				退款中
			</view>
			<image src="/static/icon_21.png" mode="" />
		</view>
		<view v-if="adress.length>0" class="adress" @tap="to_adress">
			<image src="/static/icon_17.png" mode="" />
			<view>
				<view class="font-30 ellipsis">
					{{adress[0].status}}
				</view>
				<view class="font-26">
					{{adress[0].time}}
				</view>
				<image src="/static/small_more.png" class="small" mode="" />
			</view>
		</view>
		<view class="adress">
			<image src="/static/adress_2.png" mode="" />
			<view class="adress-right">
				<view class="font-30">
					<view>收货人:{{order_info.consignee}}</view>
					<view>{{order_info.mobile}}</view>
				</view>
				<view class="ellipsis-two font-26">
					收货地址：{{order_info.address1}}{{order_info.address}}
				</view>
			</view>
		</view>
		<view class="good-list">
			<view class="order-title font-28">
				<text>订单编号：{{order_info.order_sn}}</text>
				<image src="/static/copy_icon.png" @tap="$copy(order_info.order_sn)"></image>
			</view>
			<view  class="order-good">
				<view 
					class="order-item"
					v-for="(item,index) in order_info.goods_list" 
					:key="index" @tap="to_good_detail(item)">
					<image :src="$image+item.original_img" mode="" />
					<view class="good-item">
						<view class="flex">
							<view class="ellipsis-two font-28">{{item.goods_name}}</view>
							<view class="font-34">X{{item.goods_num}}</view>
						</view>
						<view class="font-26">
							{{item.spec_key_name}}
						</view>
						<view class="flex flex2">
							<view class="font-32">
								￥{{item.member_goods_price}}
							</view>
							<view class="font-26 refund" v-if="order_info.return_btn==1&&item.is_send<2&&order_info.order_prom_type==0&&order_info.order_prom_id==0" @tap.stop="to_return_btn(item)">
								售后
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="gift-box" v-if="order_info.free_goods_num" @tap="goGift">
				<view class="left">
					<view class="hot-logo">赠</view>
					<text>赠品</text>
				</view>
				<view class="right">
					<view>{{order_info.free_goods_num}}件</view>
					<image src="/static/small_more.png"></image>
				</view>
			</view>
			<view class="service font-30" @tap="server_img=true">
				<image src="/static/service.png" mode="" />
				联系客服
			</view>
		</view>
		<view class="other-price">
			<view>
				<view>商品总价</view>
				<view>￥{{order_info.total_amount}}</view>
			</view>
			<view>
				<view>运费</view>
				<view>￥{{order_info.shipping_price}}</view>
			</view>
			<view>
				<view>优惠券</view>
				<view>-￥{{order_info.coupon_price}}</view>
			</view>
			<view>
				<view>积分抵扣</view>
				<view>-￥{{order_info.order_integral_money}}</view>
				<!-- <view>-￥{{order_info.integral_money}}</view> -->
			</view>
			<!-- <view>
				<view>消费抵扣券</view>
				<view>-￥{{order_info.deduction_amount}}</view>
			</view> -->
			<view>
				<view>实付现金</view>
				<view>￥{{order_info.order_amount}}</view>
			</view>
			<!-- <view>
				<view>实付余额</view>
				<view>￥{{order_info.user_money}}</view>
			</view> -->
		</view>
		<view class="create-time font-26" v-if="order_info.buy_user_id">
			<view>报单人姓名：{{buy_name.realname}}</view>
			<view>报单人昵称：{{buy_name.nickname}}</view>
			<view>报单人手机号：{{buy_name.mobile}}</view>
		</view>
		<view class="replace-box" v-if="order_another.length">
			<view class="tlt">代付明细</view>
			<view class="item" v-for="(item,index) in order_another" :key="index"> 
				<view class="txt">{{item.nickname}}</view>
				<view class="txt">￥{{item.amount}}</view>
				<view class="txt txt-r">{{item.pay_time}}</view>
			</view>
		</view>
		<view class="create-time font-26">
			<view>
				下单时间：{{order_info.add_time}}
			</view>
			<view v-if="order_info.pay_status==1">
				付款时间：{{order_info.pay_time}}
			</view>
			<view v-if="order_info.shipping_status==1">
				发货时间：{{order_info.shipping_time}}
			</view>
		</view>
		<view class="fixed font-30" v-if="get_show">
			<view v-if="order_info.cancel_btn==1&&order_info.pay_status!=1" @tap="cancel(order_info)">
				取消订单
			</view>
			<view class="option-1" v-if="order_info.cancel_btn==1&&order_info.pay_status==1&&order_info.order_prom_type==0&&order_info.order_prom_id==0" @tap="cancel_pay()">
				取消订单
				<!-- 已支付 -->
			</view>
			<view class="option-2" v-if="order_info.pay_btn===1 && order_info.pay_code!='offline_pay' && order_info.pay_doc_status==0" @tap="to_pay">
				立即付款
			</view>
			<view class="option-2" v-if="order_info.remind_btn==1" @tap="remind(order_info)">
				提醒发货
			</view>
			<!-- <view class="option-2" v-if="item.commission_btn==1" @tap="showCom(item)">确认分发</view> -->
			<view class="option-2" v-if="order_info.commission_btn==1" @tap="showCom(order_info)">
				确认分发
			</view>
			<view class="option-2" v-if="order_info.receive_btn==1" @tap="order_confirm(order_info)">
				确认收货
			</view>
		</view>
		<cancel-dialog v-model="cancel_dialog" :id="id" @check="get_detail">
			<!-- 取消订单 -->
		</cancel-dialog>
		<pay-method 
			v-model="is_pay"
			:user_money="user_money"
			:list="pay_list"
			@over_pay="over_pay"
			@other_pay="other_pay"
			@user_pay="user_pay"
			@offline_pay="offline_pay"
			@paypal_pay="paypal">
			<!-- 支付方式 -->
		</pay-method>
		<no-password v-model="no_password" @check="set_password">
			<!-- 还没设置密码 -->
		</no-password>
		<pay-password 
			ref="pay"
			:pay_price="order_info.order_amount"
			v-model="pay_password"
			@check_word="check_word">
			<!-- 输入密码 -->
		</pay-password>
		<server-img v-model="server_img"></server-img>

	</view>
</template>

<script>
import cancelDialog from './components/cancel_dialog.vue';
import payMethod from 'index/components/pay_method.vue';
import noPassword from 'index/components/no_password.vue'
import payPassword from 'index/components/pay_password.vue'
	export default {
		data() {
			return {
				id:'',
				order_info:{
					goods_list:[],
				},
				cancel_dialog:false,
				is_pay:false,
				pay_list:[],
				no_password:false,
				user_money:'',
				pay_password:false,
				adress:[],
				server_img:false,
				buy_name:'',
				order_another:''
			}
		},
		async onLoad(val){
			this.id=+val.id;
			await this.get_detail();
			if(val.do){
				this[val.do]()
			}
		},
		methods: {
			showCom(item){
				uni.showModal({
					title: '提示',
					content: '是否确认分发？',
					success: re=> {
						if (re.confirm) {
							uni.showLoading({
								mask:true
							})
							this.$http("post|api/Order/exec_commission",{
								order_id:item.order_id
							}).then(res=>{
								uni.hideLoading()
								this.$toastApp(res.msg);
								this.get_detail();
							}).catch(e =>{
								uni.hideLoading()
								this.$toastApp(e.msg);
							})
						}
					}
				});
			},
			goGift(){
				uni.navigateTo({
					url:'/shop_card/order_detail/lookGift?id=' + this.order_info.order_id
				})
			},
			paypal(){
				console.log('国际支付',this.id);
				uni.showLoading({
					mask: true
				})
				this.$http('post|api/Order/paypalh5', {
					order_id: this.id,
					pay_radio: 'paypal'
				}).then(res => {
					// console.log(res);
					if (res.status == 1) {
						uni.hideLoading()
						uni.redirectTo({
							url: '../../pages/paypal?order_id=' + res.result.order_id
						})
						// window.location.href = this.$image + '/mobile/index/pay_button?order_id=' + res.result.order_id
					}
				})
			},
			to_pay(){
				// #ifndef H5
				uni.showLoading()
				// #endif
				this.$http('post|api/Cart/cart4',{
					order_id:this.id,
					// #ifdef APP-PLUS
					scene:3
					// #endif
				}).then(res=>{
					this.is_pay=true;
					this.user_money=res.result.user_money;
					this.pay_list=res.result.paymentList
					// console.log(res.result.paymentList);
				})
			},
			set_password(){
				this.no_password=false;
				setTimeout(()=>{
					uni.navigateTo({
						url: '/my/mdf_password/mdf_password'
					});
				},500)
			},
			cancel_pay(){
				this.cancel_dialog=true
				console.log(this.id);
			},
			over_pay(){
				//余额支付
				this.$http('get|api/User/is_paypwd').then(res=>{
					this.no_password=true;//没有密码
				}).catch(e=>{
					this.pay_password=true;
				})
			},
			offline_pay(){
				//线下支付
				uni.navigateTo({
					url: `/index/offline_pay/offline_pay?order_id=${this.id}`
				});
			},
			other_pay(e){
				// console.log('pay_code='+e.code);
				console.log(e);
				this.$http('post|api/Payment/getCode',{
					order_id:this.id,
					pay_radio:'pay_code='+e.code
				}).then(res=>{
					let code=res.result;
					console.log(res);
					// #ifdef H5
					this.$get_appId(['chooseWXPay'],_=>{
						$wx.chooseWXPay({
							timestamp:code.timeStamp, 
							nonceStr: code.nonceStr, 
							package: code.package, 
							signType: 'MD5', 
							paySign: code.paySign, 
							success: ok=> {
								uni.redirectTo({
									url: `/index/pay_success/pay_success`
								});
							}
						});
					})
					// #endif
					// #ifdef APP-PLUS
					if (e.is_pay=='alipay') {
						uni.requestPayment({
						    provider: 'alipay',
						    orderInfo: code,
						    success: function (res) {
						        console.log('success:' + JSON.stringify(res));
								uni.redirectTo({
									url: `/index/pay_success/pay_success`
								});
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
						    }
						});
					}
					if (e.is_pay=='wx') {
						console.log('wx');
						uni.requestPayment({
						    provider: 'wxpay',
						    orderInfo: JSON.stringify(code),
						    success: function (res) {
						        console.log('success:' + JSON.stringify(res));
								uni.redirectTo({
									url: `/index/pay_success/pay_success`
								});
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
						    }
						});
					}
					// #endif
				})
				// 其他支付  微信
			},
			user_pay(){
				uni.redirectTo({
					url: `/shop_card/instead_pay/instead_pay?order_id=${this.id}`
				});
				//代付
			},
			remind(item){
				this.$http('get|api/Order/remind_order',{
					order_id:item.order_id
				}).then(res=>{
					this.$toastApp(res.msg)
				}).catch(e=>{
					this.$toastApp(e.msg)
				})
			},
			check_word(e){
				this.$http('post|api/Order/pay_user_money',{
					order_id:this.id,
					paypwd:e,
					pay_radio:'user_money'
				}).then(res=>{
					this.pay_password=false;
					this.$toastApp(res.msg);
					setTimeout(() => {
						this.get_detail();
					}, 2000);
				}).catch(e=>{
					this.$toastApp(e.msg);
					this.$refs.pay.passworld=[];
				})
			},
			async get_detail(){
				await this.$http('post|api/Order/order_detail',{
					order_id:this.id
				}).then(res=>{
					console.log(res);
					this.order_info=res.result.order_info;
					this.buy_name = res.result.buy_name
					this.order_another = res.result.order_another
					if(this.order_info.invoice_no!==''){
						this.get_invoice();
					}
				})
			},
			get_invoice(){
				this.$http('get|api/Order/queryExpress',{
					order_id:this.order_info.order_id,
					invoice_no:this.order_info.invoice_no
				}).then(res=>{
					this.adress=res.result.shopping;
				})
			},
			cancel(item){
				uni.showModal({
					title: '提示',
					content: '确认取消订单？',
					success: re=> {
						if (re.confirm) {
							this.$http("post|api/Order/cancel_order",{
								order_id:item.order_id
							}).then(res=>{
								this.get_detail();
							})
						} else if (re.cancel) {
							this.$toastApp('取消操作');
						}
					}
				});
			},
			order_confirm(item){
				this.$http('get|api/Order/order_confirm',{
					order_id:item.order_id
				}).then(res=>{
					this.$toastApp(res.msg);
					setTimeout(()=>{
						this.get_detail();
					},2000)
				}).catch(e=>{
					this.$toastApp(e.msg);
				})
			},
			to_adress(){
				uni.navigateTo({
					 url: `/shop_card/invoice/invoice?id=${this.order_info.order_id}&invoice_no=${this.order_info.invoice_no}&code=${this.order_info.shipping_name}`
				});
			},
			to_return_btn(item){
				uni.navigateTo({
					 url: `/shop_card/to_refund/to_refund?id=${item.rec_id}`
				});
			},
			to_good_detail(item){
				uni.navigateTo({
					url: `/index/good_detail/good_detail?id=${item.goods_id}`
				});
			}
		},
		computed:{
			get_show(){
				if(this.order_info.order_status_code==='WAITCCOMMENT'){
					return false
				}
				if(this.order_info.order_status_code==='FINISH'){
					return false
				}
				return true
			}
		},
		onUnload(){
			this.remScroll();
		},
		filters:{
			filterTime(val){
				let data = new Date(val*1000)-new Date();
				let day=parseInt(data/86400000);
				let hour=parseInt((data-day*86400000)/(1000*60*60));
				return `${day}天${hour}小时`
			}
		},
		components:{
			cancelDialog,
			payMethod,
			noPassword,
			payPassword,
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F7F7F7;
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
	.adress{
		padding: 30rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		display: flex;
		justify-content: flex-start;
		image{
			height: 44rpx;
			width: 44rpx;
		}
		.adress-right{
			padding-left: 24rpx;
			flex: 1;
			box-sizing: border-box;
			>.font-30{
				display: flex;
				justify-content: space-between;
			}
			.ellipsis-two{
				color: #777777;
				line-height: 36rpx;
				margin-top: 20rpx;
			}
		}
	}
	.good-list{
		margin-top: 20rpx;
		background-color: #ffffff;
		.order-title{
			display: flex;
			align-items: center;
			height: 80rpx;
			padding: 0 30rpx;
			line-height: 80rpx;
			image{
				width: 32rpx;
				height: 32rpx;
				margin-left: 20rpx;
			}
		}
		.order-good{
			padding: 20rpx 30rpx;
			box-sizing: border-box;
			box-shadow:0px -1px 0px 0px rgba(223,227,230,1);
			border-bottom: 1rpx solid rgba(223,227,230,1);
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
			image{
				height: 36rpx;
				width: 36rpx;
				margin-right: 20rpx;
			}
		}
	}
	.other-price{
		background-color: #ffffff;
		padding:30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		>view{
			display: flex;
			justify-content: space-between;
			font-size: 26rpx;
			line-height: 36rpx;
			margin-bottom: 10rpx;
			color: #B3B3B3;
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
	.page::after{
		display: block;
		content: '';
		height: 130rpx;
	}
	.fixed{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		>view{
			margin-right: 30rpx;
			width:172rpx;
			height:60rpx;
			border-radius:8rpx;
			border:1px solid rgba(180,180,180,1);
			text-align: center;
			line-height: 60rpx;
			box-sizing: border-box;
		}
		.option-2{
			border: none;
			background-color: var(--theme);
			color: #ffffff;
		}
	}
	.quxiao{
		background:#B3B3B3!important;
	}
	.adress{
		height:138rpx;
		background:rgba(255,255,255,1);
		position: relative;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: flex-start;
		image{
			height: 44rpx;
			width: 44rpx;
		}
		.small{
			height: 24rpx;
			width: 14rpx;
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -12rpx;
		}
		>view{
			flex: 1;
			padding-left: 14rpx;
			height: 100%;
			position: relative;
		}
		.ellipsis{
			max-width: 600rpx;
		}
		.font-26{
			color: #999999;
			margin-top: 12rpx;
		}
	}
	.adress::after{
		width: 690rpx;
		background-color: #F1F1F1;
		height: 2rpx;
		transform: scaleY(0.5);
		position: absolute;
		left: 50%;
		margin-left: -345rpx;
		content: '';
		bottom: 0;
	}
	.flex2{
		align-items: center!important;
	}
	.refund{
		width:90rpx;
		height:50rpx;
		border-radius:8rpx;
		border:2rpx solid var(--theme);
		box-sizing: border-box;
		text-align: center;
		line-height: 48rpx;
		color: var(--theme)!important;
	}
	
	.gift-box{
		height: 100rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		border-bottom: 1rpx solid rgba(223,227,230,1);
		.left{
			display: flex;
			align-items: center;
			color: #626262;
			font-size: 30rpx;
			.hot-logo{
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #FF2C29;
				width: 36rpx;
				height: 36rpx;
				border-radius: 4rpx;
				color: #FFFFFF;
				font-size: 24rpx;
				margin-right: 10rpx;
			}
		}
		.right{
			display: flex;
			align-items: center;
			color: #333333;
			font-size: 30rpx;
			image{
				width: 14rpx;
				height: 24rpx;
				margin-left: 20rpx;
			}
			.num{
				color: #FF2C29;
			}
		}
	}
	
	.replace-box{
		margin-top: 20rpx;
		padding: 0 30rpx;
		padding-bottom: 20rpx;
		background-color: #FFFFFF;
		.tlt{
			padding: 20rpx 0;
			color: #333333;
			font-size: 28rpx;
			font-weight: 500;
			;height: 42rpx;
		}
		.item{
			display: flex;
			align-items: center;
			margin-top: 10rpx;
			.txt{
				flex: 1;
				color: #9B9B9B;
				font-size: 26rpx;
				line-height: 36rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.txt1{
				flex: 2;
			}
			.txt-r{
				// flex: 2;
				text-align: right;
			}
		}
	}
</style>
