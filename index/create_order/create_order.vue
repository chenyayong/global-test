<template>
	<view class="order_back">
		<view v-if="show">
			<view class="buy-type-box">
				
				<view v-show="!myself">
					<!-- <view class="buy-item">
						<view class="item-tlt">报单人手机号</view>
						<view class="area-box">
							<picker :range="list" range-key="area_name" @change="picker_change1">
								<view class="left">
									<text>{{area_name1 || '归属地'}}</text>
									<image src="/static/more.png"></image>
								</view>
							</picker>
							<input type="text" v-model="buy_mobile" placeholder="请填写报单人手机号" />
						</view>
					</view> -->
					<!-- <view class="buy-item">
						<view class="item-tlt">报单人姓名</view>
						<view class="check-info">
							<input type="text" v-model="buy_name" placeholder="请填写报单人姓名" />
						</view>
					</view> -->
					<!-- <view class="buy-item">
						<view class="item-tlt">验证码</view>
						<view class="code-box">
							<input type="number" v-model="mobile_code" placeholder="请输入验证码" />
							<vercode class="right" v-model="buy_mobile" :timeout="timeout" :area="area"></vercode>
						</view>
					</view> -->

					<!-- <view class="buy-item">
						<view class="item-tlt">分享人ID</view>
						<view class="check-info">
							<input type="text" v-model="parentid" placeholder="请填写分享人ID" />
							<view class="btn" @tap="checkForm">校验</view>
						</view>
					</view> -->
					<!-- <view class="buy-item">
						<view class="item-tlt">分享人信息</view>
						<view class="check-info">
							<view class="user-box">
								<text v-if="shareInfo.nickname">{{shareInfo.nickname}}</text>
								<text v-if="!shareInfo.nickname&&isCheck">暂无上级</text>
								<text v-if="shareInfo.mobile">({{shareInfo.mobile}})</text>
							</view>
						</view>
					</view> -->
				</view>
			</view>
			<!-- <view class="buy-type-box" v-show="!myself">
				<view class="buy-item no-show">
					<view class="item-tlt">推荐方手机号</view>
					<view class="area-box">
						<picker :range="list" range-key="area_name" @change="picker_change">
							<view class="left">
								<text>{{area_name || '归属地'}}</text>
								<image src="/static/more.png"></image>
							</view>
						</picker>
						<input type="text" v-model="parent_mobile" placeholder="请填写推荐方手机号" />
					</view>
				</view>
				<view class="buy-item">
					<view class="item-tlt">验证码</view>
					<view class="code-box">
						<input type="number" v-model="mobile_code" placeholder="请输入验证码" />
						<vercode class="right" v-model="parent_mobile" :timeout="timeout" :area="area"></vercode>
					</view>
				</view>
				<view class="buy-item">
					<view class="item-tlt">推荐方姓名</view>
					<view class="check-info">
						<text v-if="shareInfo.realname && isCheck">{{shareInfo.realname}}</text>
						<text v-else style="color: #B3B3B3;">无</text>
						<view class="btn" @tap="checkForm">校验</view>
					</view>
				</view>
			</view> -->
			<!-- <view class="buy-type-box" v-show="!myself">
				<view class="buy-item no-show">
					<view class="item-tlt">服务商ID</view>
					<view class="check-info">
						<input type="text" v-model="service_id" placeholder="请填写服务商ID" />
					</view>
				</view>
			</view> -->
			<view @tap="choose_adress" hover-class="none" class="address-box flex-row">
				<image src="/static/adress.png" class="poi-img" mode=""></image>
				<!-- <view class="box-text">添加收货地址</view> -->
				<view class="box-text">
					<view class="flex-row">
						<text>收货人：{{address.consignee}}</text>
						<text>{{address.mobile}}</text>
					</view>
					<view class="box-desc">收货地址：{{address.address1}}{{address.address}}</view>
				</view>
				<image src="/static/small_more.png" class="small-right" mode=""></image>
			</view>
			<image src="/static/icon_1.png" class="page-line" mode=""></image>
			<view class="pro-section" v-for="(item,index) in cartList" :key="index">
				<view class="pro-box flex-row">
					<image :src="item.goods?$image+item.goods.original_img:''" class="box-cover" mode=""></image>
					<view class="box-info">
						<view class="info-name ellipsis-two">{{item.goods_name}}</view>
						<view class="info-spec">{{item.spec_key_name}}</view>
						<view>¥{{item.member_goods_price?(+item.member_goods_price).toFixed(2):''}}</view>
					</view>
					<view class="box-num">x{{item.goods_num}}</view>
				</view>
			</view>
			<view class="gift-box" @tap="goGift" v-if="free_goods_num">
				<view class="left">
					<view class="hot-logo">赠</view>
					<view>赠品(最高{{free_goods_num}}件)</view>
				</view>
				<view class="right">
					<view>已选<text class="num">{{free_goods | sumNum}}</text>件</view>
					<image src="/static/small_more.png"></image>
				</view>
			</view>
			<view v-if="userCartCouponList.length" class="page-mark flex-row bdb-1px" @tap="coupon=true">
				<text class="mark-text">优惠券</text>
				<text class="picker-value">{{coupon_text}}</text>
			</view>
			<!-- <view class="page-mark flex-row bdb-1px">
				<text class="mark-text">余额：</text>
				<input type="number" v-model="pay_points" @blur="getPayPoint" class="mark-input" :placeholder="'可用余额：'+user_money"
					placeholder-style="color:#999999">
			</view> -->
			<view class="page-mark flex-row">
				<text class="mark-text">备注信息：</text>
				<input type="text" v-model="user_note" class="mark-input" style="flex: 2;" placeholder="请填写备注信息"
					placeholder-style="color:#999999">
			</view>
			<view class="order-info">
				<view class="info-li flex-row">
					<text>商品总价</text>
					<text class="c-333">¥{{order_data.goodsFee.toFixed(2)}}</text>
				</view>
				<view class="info-li flex-row">
					<text>运费</text>
					<text class="red-text">+¥{{order_data.postFee}}</text>
				</view>
				<view class="info-li flex-row">
					<text>优惠券</text>
					<text class="red-text">-¥{{(+order_data.couponFee).toFixed(2)}}</text>
				</view>
				<view class="info-li flex-row">
					<text>积分抵扣</text>
					<text class="red-text">-¥{{(+order_data.order_integral_money).toFixed(2)}}</text>
					<!-- <text class="red-text">-¥{{(+order_data.pointsFee).toFixed(2)}}</text> -->
				</view>
				<!-- <view class="info-li flex-row">
					<text>余额</text>
					<text class="red-text">-¥{{(+order_data.balance).toFixed(2)}}</text>
				</view> -->
				<!-- <view class="info-li flex-row">
					<text>消费抵扣券</text>
					<text class="red-text">-¥{{(+order_data.deduction_amount).toFixed(2)}}</text>
				</view> -->
				<view class="info-li flex-row">
					<text>应付金额</text>
					<text class="red-text">¥{{order_data.payables.toFixed(2)}}</text>
				</view>
			</view>
			<view style="height: 110rpx;"></view>
			<view class="page-bot flex-row">
				<view class="bot-text">
					总计：<text style="color: #FF3C51;">¥{{order_data.payables.toFixed(2)}}</text>
				</view>
				<view class="bot-btn font-30" @click="takePay">去支付</view>
			</view>
		</view>

		<coupon v-model="coupon" :list="userCartCouponList" @choose_item="choose_item">
			<!-- 优惠券 -->
		</coupon>
		<pay-method v-model="is_pay" :user_money="user_money" :list="pay_list" @over_pay="over_pay" @other_pay="other_pay"
			@close="pay_method_close" @user_pay="user_pay" @offline_pay="offline_pay" @paypal_pay="paypal"
			@replace_pay="replace_pay">
			<!-- 支付方式 -->
		</pay-method>
		<!-- :pay_price="order_data.payables.toFixed(2)"  -->
		<pay-password ref="pay" v-model="pay_password" @close="closePsw" @check_word="check_word">
			<!-- 输入密码 -->
		</pay-password>
		<no-password v-model="no_password" @check="set_password" :back="false">
			<!-- 还没设置密码 -->
		</no-password>
		<view class="config" v-if="show_adress">
			<view class="config-content">
				<view class="title font-40">提示</view>
				<view class="tip font-32">请先添加地址</view>
				<view class="config-buttom font-32">
					<view @tap="back">取消</view>
					<view class="ok-btn" @tap="to_adress">确定</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import coupon from '../components/coupon.vue'
	import payMethod from '../components/pay_method.vue'
	import payPassword from '../components/pay_password.vue'
	import noPassword from '../components/no_password.vue'
	import vercode from "@/components/get_verification.vue"
	export default {
		data() {
			return {
				newData: '',
				myself: true,
				area: '',
				area_name: '',
				area1: '',
				area_name1: '',
				list: [],
				timeout: 0,
				service_id: '',
				buy_mobile: '',
				mobile_code: '',
				parentid: '',
				isNew: true,
				isCheck: false,
				shareInfo: '',
				parent_mobile: '',
				buy_name: '',

				pay_points: '',
				user_note: '',
				coupon: false, //优惠券
				is_pay: false, //支付方式
				pay_password: false, //输入密码
				no_password: false, //没设置密码
				query: {},
				show_adress: false,
				show: false,
				address: {},
				cartList: [],
				userCartCouponList: [],
				order_data: {
					goodsFee: 0,
					postFee: 0,
					couponFee: 0,
					order_integral_money: 0,
					payables: 0,
					balance: 0
				},
				coupon_text: '',
				coupon_id: '',
				order_id: '',
				user_money: '',
				pay_list: [],
				timer: null,
				isSubmit: true,
				free_goods_num: '',
				free_goods: []
			}
		},
		onLoad(val) {
			if (uni.getStorageSync('addList')) {
				uni.removeStorageSync('addList')
			}
			this.query = {
				action: val.action,
				goods_id: +val.id,
				item_id: +val.item,
				goods_num: +val.num,
			}
		},
		async onShow() {
			if (uni.getStorageSync('addList')) {
				this.free_goods = uni.getStorageSync('addList')
			}
			// await this.$http('get|api/User/is_paypwd').then(res=>{
			// 	this.no_password=true;//没有密码
			// })
			await this.$http('post|api/Cart/cart2', this.query).then(res => {
				console.log(res);
				this.show = true;
				this.address = res.result.address;
				this.cartList = res.result.cartList;
				this.free_goods_num = res.result.free_goods_num
				this.service_id = res.result.user_id
				this.user_money = res.result.user_money
				this.userCartCouponList = res.result.userCartCouponList.map(row => {
					row.active = false
					return row
				})
				// let data = {
				// 	address_id: res.result.address.address_id,
				// 	...this.query
				// }
				// this.change_order(data);
				let data = {
					address_id: this.address.address_id,
					...this.query,
					coupon_id: this.coupon_id,
					user_money: this.pay_points
				}
				this.change_order(data, () => {
					this.pay_points = '';
				});
			}).catch(err => {
				if (err.status === -2) {
					this.show_adress = true;
					return
				}
				if (err.status === -3) {
					uni.showModal({
						title: '提示',
						content: err.msg,
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack();
							} else if (res.cancel) {
								uni.navigateBack();
							}
						}
					});
					return
				} 
				if (err.status === -8) {
					uni.showModal({
						title: '提示',
						content: err.msg,
						showCancel:false,
						confirmText:'确定',
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack();
							}
						}
					});
					return
				}else {
					this.$toastApp(err.msg);
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}
			});
			this.$http('get|api/Api/send_validate_code').then(res => {
				this.list = res.result.country_area;
				this.timeout = +res.result.sms_time_out
			})
		},
		methods: {
			checkMyself() {
				if (this.myself) return
				this.myself = true
				this.isCheck = false
				// this.checkForm()
			},
			checkForm() {
				if (!this.area_name1) {
					this.$toastApp('请选择报单人手机号码归属地')
					return
				}
				this.$http('post|api/Cart/verify_user', {
					buy_mobile: this.buy_mobile,
					mobile_code: this.mobile_code,
					parent_mobile: this.parent_mobile,
					buy_name: this.buy_name
				}).then(res => {
					if (res.status == 1) {
						this.shareInfo = res.result
						this.isCheck = true
					}
				}).catch(e => {
					this.isCheck = false
					this.$toastApp(e.msg)
				})
			},
			picker_change(e) {
				let index = e.detail.value;
				this.area = this.list[index].area
				this.area_name = this.list[index].area_name
			},
			picker_change1(e) {
				let index = e.detail.value;
				this.area1 = this.list[index].area
				this.area_name1 = this.list[index].area_name
			},
			paypal() {
				// console.log(this.$image);
				uni.showLoading({
					mask: true
				})
				this.$http('post|api/Order/paypalh5', {
					order_id: this.order_id,
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
			getPayPoint() {
				if (this.pay_points > this.order_data.payables) {
					this.$toastApp('输入金额不可大于应付金额')
					this.pay_points = ''
					return
				}
				let data = {
					address_id: this.address.address_id,
					...this.query,
					coupon_id: this.coupon_id,
					user_money: this.pay_points
				}
				this.change_order(data, () => {
					this.pay_points = '';
				});
			},
			choose_item(index) {
				if (index !== '') {
					this.userCartCouponList.forEach(el => {
						el.active = false
					})
					this.userCartCouponList[index].active = true;
					this.coupon_text = `${+this.userCartCouponList[index].coupon.money}元优惠券`
					this.coupon_id = this.userCartCouponList[index].id;
				}
				let data = {
					address_id: this.address.address_id,
					...this.query,
					coupon_id: this.coupon_id,
					user_money: this.pay_points
				}
				this.change_order(data);
			},
			change_order(data, fn) {
				if (!this.myself) {
					data.buy_mobile = this.buy_mobile
					data.mobile_code = this.mobile_code
					data.parent_mobile = this.parent_mobile,
						data.buy_name = this.buy_name
					data.service_id = this.service_id
				}
				data.cart_type = this.myself ? 0 : 2,
					this.$http('post|api/Cart/cart3', data).then(res => {
						this.order_data = res.result
						// console.log(res);
					}).catch(e => {
						// console.log(e);
						this.$toastApp(e.msg)
						if (fn) {
							fn();
						}
					})
			},
			back() {
				uni.navigateBack();
			},
			to_adress() {
				uni.navigateTo({
					url: '/my/address_management/address_management?choose=1'
				});
				setTimeout(() => {
					this.show_adress = false;
				}, 500);
			},
			choose_adress() {
				uni.navigateTo({
					url: '/my/address_management/address_management?choose=1'
				});
			},
			set_password() {
				//todo设置密码
				this.no_password = false;
				setTimeout(() => {
					uni.navigateTo({
						url: '/my/mdf_password/mdf_password'
					});
				}, 500)
			},
			over_pay() {
				//余额支付
				this.$http('get|api/User/is_paypwd').then(res => {
					this.no_password = true; //没有密码
				}).catch(e => {
					this.pay_password = true;
				})
				// this.pay_password=true
			},
			closePsw() {
				this.$refs.pay.passworld = [];
				this.pay_password = false
			},
			pay_method_close() {
				uni.redirectTo({
					url: `/shop_card/my_order/my_order?type=WAITPAY`
				})
			},
			offline_pay() {
				//线下支付
				uni.redirectTo({
					url: `/index/offline_pay/offline_pay?order_id=${this.order_id}`
				});
			},
			replace_pay() {
				// 找人代付
				uni.redirectTo({
					// url: `/shop_card/order_detail/order_detail?order_id=${this.order_id}`
					url: `/shop_card/order_detail/order_detail?id=${this.order_id}`
				});
			},
			user_pay() {
				//代付
				uni.redirectTo({
					url: `/shop_card/instead_pay/instead_pay?order_id=${this.order_id}`
				});
			},
			other_pay(e) {
				// console.log(e);
				this.$http('post|api/Payment/getCode', {
					order_id: this.order_id,
					pay_radio: 'pay_code=' + e.code
				}).then(res => {
					let code = res.result;
					// #ifdef H5
					// 公众号微信支付
					this.$get_appId(['chooseWXPay'], _ => {
						$wx.chooseWXPay({
							timestamp: code.timeStamp,
							nonceStr: code.nonceStr,
							package: code.package,
							signType: 'MD5',
							paySign: code.paySign,
							success: ok => {
								uni.redirectTo({
									url: `/index/pay_success/pay_success`
								});
							}
						});
					})
					// #endif
					// 其他支付  微信/支付宝
					// #ifdef APP-PLUS
					if (e.is_pay == 'alipay') {
						uni.requestPayment({
							provider: 'alipay',
							orderInfo: code,
							success: function(res) {
								// console.log('success:' + JSON.stringify(res));
								uni.redirectTo({
									url: `/index/pay_success/pay_success`
								});
							},
							fail: function(err) {
								// console.log('fail:' + JSON.stringify(err));
							}
						});
					}
					if (e.is_pay == 'wx') {
						// console.log('wx');
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: JSON.stringify(code),
							success: function(res) {
								// console.log('success:' + JSON.stringify(res));
								uni.redirectTo({
									url: `/index/pay_success/pay_success`
								});
							},
							fail: function(err) {
								// console.log('fail:' + JSON.stringify(err));
							}
						});
					}
					// #endif
				})
			},
			check_word(e) {
				this.newData.paypwd = e
				this.payPay()
				// this.$http('post|api/Order/pay_user_money', {
				// 	order_id: this.order_id,
				// 	paypwd: e,
				// 	pay_radio: 'user_money'
				// }).then(res => {
				// 	// console.log(1111);
				// 	this.$toastApp(res.msg);
				// 	uni.redirectTo({
				// 		url: `/index/pay_success/pay_success`
				// 	});
				// }).catch(e => {
				// 	console.log(e);
				// 	this.$toastApp(e.msg, 'none');
				// 	this.$refs.pay.passworld = [];
				// 	this.$refs.pay.closeTap()
				// })
			},
			takePay() {
				if (!this.myself) {
					if (!this.buy_mobile) {
						this.$toastApp('请输入报单人手机号')
						return
					}
					if (!this.area_name1) {
						this.$toastApp('请选择报单人手机号码归属地')
						return
					}
					if (!this.buy_name) {
						this.$toastApp('请输入报单人姓名')
						return
					}
					if (!this.parent_mobile) {
						this.$toastApp('请输入推荐人姓名')
						return
					}
					if (!this.isCheck) {
						this.$toastApp('请先校验信息')
						return
					}
				}
				if (!this.isSubmit) return
				this.isSubmit = false
				this.$http('get|api/User/is_paypwd').then(res => {
					this.no_password = true; //没有密码
					this.isSubmit = true
				}).catch(_ => {
					let data = {
						address_id: this.address.address_id,
						coupon_id: this.coupon_id,
						user_money: this.pay_points,
						user_note: this.user_note,
						act: 'submit_order',
					}
					if (this.query.goods_id) {
						data = Object.assign(data, {
							goods_id: this.query.goods_id,
							goods_num: this.query.goods_num,
							item_id: this.query.item_id,
							action: 'buy_now',
						})
					}
					data.free_goods = this.free_goods
					if (!this.myself) {
						data.buy_mobile = this.buy_mobile
						data.mobile_code = this.mobile_code
						data.service_id = this.service_id
						data.parent_mobile = this.parent_mobile,
							data.buy_name = this.buy_name
					}
					data.cart_type = this.myself ? 0 : 2
					this.newData = data
					if (this.pay_points > 0) {
						this.pay_password = true;
						return
					}
					this.payPay()
				})
			},
			goGift() {
				uni.navigateTo({
					url: '/index/create_order/gift?num=' + this.free_goods_num
				})
			},
			payPay() {
				uni.showLoading({
					mask: true
				})
				this.$http("post|api/Cart/cart3", this.newData).then(res => {
					this.order_id = +res.result;
					this.pay_password = false
					this.$refs.pay.passworld = [];
					this.$http('post|api/Cart/cart4', {
						order_id: this.order_id,
						// #ifdef APP-PLUS
						scene: 3
						// #endif
					}).then(res => {
						this.isSubmit = true
						this.is_pay = true;
						this.user_money = res.result.user_money;
						this.pay_list = res.result.paymentList
						console.log(res);
					}).catch(err => {
						this.isSubmit = true
						if (err.status == -7) {
							uni.redirectTo({
								url: `/index/pay_success/pay_success`
							});
							this.$toastApp(err.msg)
						}
					})
				}).catch(err => {
					uni.hideLoading()
					console.log("post|api/Cart/cart3", err)
					if (err.status != 1) {
						this.$toastApp(err.msg)
						this.$refs.pay.passworld = [];
					}
					this.isSubmit = true
				})
			}
		},
		onUnload() {
			this.remScroll();
		},
		watch: {
			address_id(val) {
				let data = {
					address_id: val,
					...this.query
				}
				this.$http('post|api/Cart/cart2', data).then(res => {
					this.address = res.result.address;
					this.cartList = res.result.cartList;
					this.userCartCouponList = res.result.userCartCouponList.map(row => {
						row.active = false
						return row
					})
					this.address.address_id = val
					let data = {
						address_id: res.result.address.address_id,
						...this.query
					}
					this.change_order(data);
				}).catch(err => {
					this.$toastApp(err.msg);
				})
			}
		},
		computed: {
			address_id() {
				return this.$store.getters.get_address;
			}
		},
		components: {
			coupon,
			payMethod,
			payPassword,
			noPassword,
			vercode
		},
		filters: {
			sumNum(arr) {
				let temp = 0
				arr.forEach(item => {
					temp += item.goods_num
				})
				return temp
			}
		}
	}
</script>

<style lang="less">
	.buy-type-box {
		padding: 0 30rpx;
		background-color: #FFFFFF;
		margin-bottom: 20rpx;
	}

	.ok-btn {
		color: var(--theme);
	}

	.buy-type-box .buy-item {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 -2rpx 0 0 rgba(230, 230, 230, 1);
	}

	.buy-type-box .no-show {
		box-shadow: none;
	}

	.buy-type-box .buy-item .item-tlt {
		font-size: 30rpx;
		color: #343434;
	}

	.buy-type-box .buy-item .type-box {
		width: 344rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.buy-type-box .buy-item .type-box .type-item {
		color: #333333;
		font-size: 30rpx;
		display: flex;
		align-items: center;
	}

	.buy-type-box .buy-item .type-box .type-item image {
		width: 36rpx;
		height: 36rpx;
		margin-right: 16rpx;
	}

	.buy-item input {
		width: 50%;
		font-size: 30rpx;
		color: #343434;
		height: 100%;
		text-align: right;
	}

	.buy-item .area-box {
		display: flex;
		align-items: center;
	}

	.buy-item .area-box .left {
		font-size: 24rpx;
		color: #343434;
		padding-right: 30rpx;
		margin-right: 30rpx;
		box-shadow: 2rpx 0 0 0 rgba(230, 230, 230, 1);
	}

	.buy-item .area-box input {
		font-size: 30rpx;
		color: #343434;
		height: 100%;
		width: 300rpx;
	}

	.buy-item .area-box .left image {
		width: 16rpx;
		height: 16rpx;
		margin-left: 10rpx;
		transform: rotate(90deg);
	}

	.user-box {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #343434;
	}

	.user-box .avatar {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.user-box .close-btn {
		width: 36rpx;
		height: 36rpx;
		margin-left: 20rpx;
	}

	.check-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.check-info input {
		width: 300rpx;
		height: 100%;
	}

	.check-info .btn {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		font-size: 28rpx;
		margin-left: 30rpx;
		width: 120rpx;
		height: 64rpx;
		border-radius: 6rpx;
		background-color: var(--theme);
	}

	.code-box {
		display: flex;
		align-items: center;
	}

	.code-box input {
		width: 300rpx;
		height: 100%;
		padding-right: 30rpx;
		box-shadow: 2rpx 0 0 0 rgba(230, 230, 230, 1);
	}

	.order_back {
		background-color: #F7F7F7;
		min-height: calc(100vh - 88rpx);
		box-sizing: border-box;
	}

	.address-box {
		min-height: 190rpx;
		background: white;
		padding: 0 30rpx;
		font-size: 32rpx;
		color: #353535;
	}

	.address-box .poi-img {
		width: 44rpx;
		height: 44rpx;
	}

	.address-box .box-text {
		flex: 1;
		margin: 0 20rpx;
	}

	.address-box .box-text .box-desc {
		font-size: 26rpx;
		color: #999999;
		line-height: 36rpx;
		margin-top: 16rpx;
	}

	.small-right {
		height: 24rpx;
		width: 14rpx;
	}

	.page-line {
		width: 100%;
		height: 8rpx;
		display: block;
	}

	.pro-section {
		background: white;
		margin: 20rpx 0;
	}

	.pro-section .sec-head {
		height: 80rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #454545;
		justify-content: flex-start;
	}

	.pro-section .sec-head .head-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}

	.pro-section .pro-box {
		padding: 20rpx 30rpx;
		align-items: flex-start;
	}

	.pro-section .box-cover {
		width: 200rpx;
		height: 200rpx;
	}

	.pro-section .box-info {
		flex: 1;
		margin: 0 20rpx;
		font-size: 28rpx;
		color: #292D33;
	}

	.pro-section .info-spec {
		font-size: 26rpx;
		color: #999999;
		margin: 20rpx 0;
	}

	.pro-section .box-num {
		font-size: 34rpx;
		color: #474F59;
		margin-left: 30rpx;
	}

	.page-mark {
		margin-top: 2rpx;
		height: 100rpx;
		background: white;
		padding: 0 30rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.page-mark .mark-text {
		flex: 1;
	}

	.page-mark .mark-input {
		flex: 1;
		background: white;
		font-size: 30rpx;
		margin-right: 10rpx;
		text-align: right;
	}

	.order-info {
		background: white;
		padding: 30rpx;
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #666666;
	}

	.order-info .info-li {
		margin-bottom: 26rpx;
	}

	.order-info .info-li:last-child {
		margin-bottom: 0;
	}

	.order-info .info-li .c-333 {
		color: #333333;
	}

	.order-info .info-li .red-text {
		color: #FF3C51;
	}

	.page-bot {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 98rpx;
		background: white;
		z-index: 8;
		box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
	}

	.page-bot .bot-text {
		flex: 1;
		padding: 0 30rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.page-bot .bot-btn {
		width: 250rpx;
		height: 100%;
		line-height: 98rpx;
		background: var(--theme);
		text-align: center;
		color: #FFFFFF;
	}

	.picker-value {
		padding-right: 34rpx;
		position: relative;
	}

	.picker-value::after {
		content: '';
		height: 24rpx;
		width: 14rpx;
		background-image: url(../../static/small_more.png);
		background-size: 100%;
		position: absolute;
		right: 0;
		top: 50%;
		margin-top: -12rpx;
	}

	.add_adress {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.7);
	}

	.gift-box {
		height: 100rpx;
		background-color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;

		.left {
			display: flex;
			align-items: center;
			color: #626262;
			font-size: 30rpx;

			.hot-logo {
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

		.right {
			display: flex;
			align-items: center;
			color: #333333;
			font-size: 30rpx;

			image {
				width: 14rpx;
				height: 24rpx;
				margin-left: 20rpx;
			}

			.num {
				color: #FF2C29;
			}
		}
	}
</style>
