<template>
	<view v-if="card.length>0">
		<!-- 		<view class="header">
			<view class="font-26">
				共
				<view class="inline">{{num}}</view>
				件商品
			</view>
			<view class="font-28" @tap="is_edit">
				{{edit?'完成':'编辑'}}
			</view>
		</view>
		<view class="list-box">
			<view class="card-item" v-for="(item,index) in card" :key="index">
				<check-box v-model="item.active" @click.native="box_change(item.active)"></check-box>
				<view class="content" @tap="to_detail(item)">
					<image :src="$image+item.img" mode="" />
					<view>
						<view class="font-28 ellipsis-two">{{item.goods_name}}</view>
						<view class="font-24 ellipsis">{{item.spec_key_name}}</view>
						<view class="flex">
							<view class="font-32">¥{{item.member_goods_price}}</view>
							<view class="flex comp">
								<view class="less font-34" @tap.stop="reduce(item)">-</view>
								<view class="num font-34">{{item.goods_num}}</view>
								<view class="add font-34" @tap.stop="add(item)">+</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view> -->
		<view class="page-top-tips flex-row">
			<text>共<text class="c-4E6EF3">{{num}}</text>件商品</text>
			<view class="tips-btn" @click="edit=!edit">{{edit?'完成':'编辑'}}</view>
		</view>
		<view class="pro-section">
			<view class="con-li flex-row bdb-1px" v-for="(item,index) in card" :key='index'>
				<view class="li-select" :class="item.active?'li-sel':''" @click="takeSel(index)"></view>
				<image :src="$image+item.img" class="li-cover" mode=""></image>
				<view class="li-info" @click="to_detail(item)">
					<view class="info-name mowrap">{{item.goods_name}}</view>
					<view class="info-spec">{{item.spec_key_name}}</view>
					<view class="info-bot flex-row">
						<view class="bot-price">¥{{item.member_goods_price}}</view>
						<view class="number-box flex-row">
							<view class="con-oper" @click.stop="reduce(item)">-</view>
							<view class="con-number">{{item.goods_num}}</view>
							<view class="con-oper" @click.stop="add(item)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="like">
			<view class="font-26">猜你喜欢</view>
			<view class="text"></view>
		</view>
		<good-list v-model="list"></good-list>
		<!-- <no-more v-model="have" @more="more" v-if="list.length>0"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
		<view class="bottom-box"></view>

		<!-- <view class="fxied">
			<view class="content">
				<view class="flex">
					<check-box v-model="check_all" class="check-box" @click.native="all_check"></check-box>
					<view class="inline font-30">全选</view>
				</view>
				<view class="font-30">
					<view>总计：</view>
					<view style="color:#F41613">¥{{total_price}}</view>
				</view>
			</view>
			<view class="font-30 bottom" @tap="to_sumbit">{{bottom_text}}</view>
		</view> -->
		<!-- 底部结算栏 -->
		<view class="page-bot flex-row">
			<view class="bot-all" :class="allStatus?'all-sel':''" @click="takeAll">全选</view>
			<view class="bot-price" v-if="!edit">
				总计：<text class="c-FF3C51">¥{{total_price}}</text>
			</view>
			<view class="bot-btn" @click="to_sumbit">{{bottom_text}}</view>
		</view>

	</view>
	<no-data v-else>
		<view class="to_buy font-30" @tap="to_buy">
			去逛逛
		</view>
		<view class="like">
			<view class="font-26">猜你喜欢</view>
			<view class="text"></view>
		</view>
		<good-list v-model="list"></good-list>
		<!-- <no-more v-model="have" @more="more" v-if="list.length>0"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</no-data>
</template>

<script>
	import noData from 'components/no_data.vue'
	export default {
		data() {
			return {
				card: [],
				// bottom_text:'结算',
				total_price: '0.00',
				edit: false,
				check_all: false,
				num: 0,
				time_out: null,
				page: 1,
				list: [],
				have: true,
				allStatus: false
			}
		},
		methods: {
			async hot_good(bool) {
				await this.$http("get|api/Index/favourite", {
					p: this.page
				}).then(res => {
					if (bool) {
						this.list = []
					}
					if (res.result.favourite_goods.length == 0) {
						this.have = false;
					} else {
						this.have = true;
						this.list = [...this.list, ...res.result.favourite_goods]
					}
				})
			},
			more() {
				this.page += 1;
				this.hot_good();
			},
			to_detail(item) {
				uni.navigateTo({
					url: `/index/good_detail/good_detail?id=${item.goods_id}`
				});
			},
			get_card(isRefresh) {
				this.$http("get|api/Cart/index").then(async res => {
					this.card = res.result.cartList.map(row => {
						row = Object.assign(row, {
							active: row.selected === 1
						})
						row.img = row.goods.original_img
						return row;
					})
					this.updata_card()
					this.num = res.result.userCartGoodsTypeNum;
					this.allStatus = this.card.length > 0 ? this.checkListSel(this.card) : false
					if (this.card.length === 0) {
						return
					}
					// this.box_change();
					// let bool = this.card.find(row => !row.active);
					// if (bool) {
					// 	this.check_all = false
					// } else {
					// 	this.check_all = true
					// }
					if (isRefresh) {
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						})
						uni.stopPullDownRefresh();
					}
				})
			},
			box_change() {
				let bool = this.card.find(row => !row.active);
				if (bool) {
					this.check_all = false
				} else {
					this.check_all = true
				}
				this.updata_card();
			},
			takeSel(index) { // 点击选中商品
				this.card[index].active = !this.card[index].active
				this.allStatus = this.checkListSel(this.card)
				this.card.sort()
				this.getSelIds()
				this.updata_card()
			},
			checkListSel(list) { // 判断列表是否全选
				for (let i in list) {
					if (!list[i].active) {
						return false
					}
				}
				return true
			},
			getSelIds() { // 获取选中商品的id
				this.selIds = []
				for (let i in this.resList) {
					if (this.resList[i].isSel) this.selIds.push(this.resList[i].id)
				}
			},
			takeAll() { // 点击全选
				this.allStatus = !this.allStatus
				this.card.map(item => item.active = this.allStatus)
				this.getSelIds()
				this.updata_card()
			},
			reduce(item) {
				if (item.goods_num == 1) {
					return;
				}
				clearTimeout(this.time_out)
				item.goods_num--;
				this.time_out = setTimeout(() => {
					this.card_changeNum(item);
				}, 500)
			},
			add(item) {
				clearTimeout(this.time_out)
				item.goods_num++;
				this.time_out = setTimeout(() => {
					this.card_changeNum(item);
				}, 500)
			},
			card_changeNum(item) {
				this.$http('post|api/Cart/changeNum', {
					id: item.id,
					goods_num: item.goods_num
				}).then(res => {
					this.updata_card();
				})
			},
			all_check() {
				this.card.forEach(el => {
					el.active = this.check_all
				})
				this.updata_card();
			},
			is_edit() {
				this.edit = !this.edit
			},
			to_sumbit() {
				if (this.edit) {
					let delete_card = this.card.filter(row => row.active)
					console.log(delete_card);
					if (delete_card == '') {
						this.$toastApp('您当前未选中商品');
						return
					}
					this.$http("post|api/Cart/delete", {
						cart_ids: delete_card.map(row => row.id)
					}).then(res => {
						this.updata_card();
						delete_card.forEach(el => {
							let find = this.card.findIndex(ro => ro.id === el.id);
							this.card.splice(find, 1)
						})
					})
				} else {
					// #ifdef APP-PLUS
					this.$toastApp('请到公众号进行操作')
					// #endif
					// #ifdef H5
					uni.navigateTo({
						url: '/index/create_order/create_order'
					});
					// #endif
				}
			},
			updata_card() {
				let cart = this.card.map(row => {
					row.selected = row.active ? 1 : 0
					return row
				})
				this.$http('post|api/Cart/AsyncUpdateCart', {
					cart
				}).then(res => {
					// console.log(res);
					this.total_price = res.result.total_fee.toFixed(2)
				})
			},
			to_buy() {
				uni.switchTab({
					url: "/pages/index"
				});
			}
		},
		computed: {
			bottom_text() {
				if (this.edit) {
					return `删除(${this.card.filter(row=>row.active).length})`
				} else {
					return `结算(${this.card.filter(row=>row.active).length})`
				}
			}
		},
		components: {
			noData
		},
		onShow() {
			this.get_card();
			this.page = 1
			this.hot_good(true)
		},
		onPullDownRefresh() {
			this.get_card(true)
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			this.page += 1;
			this.hot_good();
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
		box-sizing: border-box;
	}

	.bottom-box {
		width: 100vw;
		height: 100rpx;
		background-color: #F7F7F7;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 30rpx;

		.inline {
			color: var(--theme);
		}
	}

	.list-box {
		background-color: #ffffff;
		padding: 0 30rpx;

		.card-item {
			height: 240rpx;
			box-shadow: 0px 1px 0px 0px rgba(229, 229, 229, 1);
			display: flex;
			align-items: center;
			justify-content: space-between;

			.content {
				padding-left: 26rpx;
				flex: 1;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				align-items: center;

				image {
					height: 180rpx;
					width: 180rpx;
				}

				>view {
					flex: 1;
					padding-left: 20rpx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 180rpx;
					width: 430rpx;

					.flex {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.font-24 {
						color: #B3B3B3;
					}

					.font-32 {
						color: #F41613;
					}

					.less,
					.add {
						width: 46rpx;
						height: 46rpx;
						line-height: 46rpx;
						text-align: center;
						color: #999999;
						border: 1rpx solid #CFCFCF;
					}

					.num {
						width: 76rpx;
						height: 46rpx;
						line-height: 46rpx;
						text-align: center;
						border-top: 1rpx solid #CFCFCF;
						border-bottom: 1rpx solid #CFCFCF;
					}
				}
			}
		}
	}

	.like {
		color: #333333;
		padding: 0 50rpx;
		height: 90rpx;
		text-align: left;
		background-color: #ffffff;
		margin-top: 20rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.text {
			height: 28rpx;
			position: relative;
		}

		.text::after {
			content: "Like";
			position: absolute;
			left: 0;
			font-size: 24rpx;
			top: 0;
			transform: scale(0.83);
		}
	}

	.like::before {
		width: 4rpx;
		height: 60rpx;
		background: rgba(51, 51, 51, 1);
		content: '';
		left: 30rpx;
		top: 50%;
		margin-top: -30rpx;
		display: block;
		position: absolute;
	}

	.fxied {
		position: fixed;
		/* #ifdef H5 */
		bottom: 92rpx;
		/* #endif */
		/* #ifndef H5 */
		bottom: 0;
		/* #endif */
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		width: 100%;
		background-color: #ffffff;

		.content {
			flex: 1;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.flex {
				display: flex;
				align-items: center;

				.inline {
					margin-left: 20rpx;
				}
			}

			>.font-30 {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}

		.bottom {
			width: 220rpx;
			line-height: 100rpx;
			background: var(--theme);
			text-align: center;
			color: #ffffff;
		}
	}

	.to_buy {
		width: 278rpx;
		height: 90rpx;
		background: var(--theme);
		border-radius: 200rpx;
		line-height: 90rpx;
		text-align: center;
		color: #ffffff;
		margin: 60rpx auto 0 auto;
	}

	.top-nav-bg {
		padding: 20rpx 0;
		background: white;
	}

	.top-nav-bg .nav-box {
		width: 480rpx;
		height: 60rpx;
		border-radius: 8rpx;
		margin: 0 auto;
	}

	.top-nav-bg .nav-box .con-nav {
		border: 1px solid #CCCCCC;
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #4D4D4D;
		height: 100%;
		line-height: 58rpx;
		overflow: hidden;
	}

	.top-nav-bg .nav-box .con-nav.sel-nav {
		border-color: var(--theme);
		background: var(--theme);
		color: white;
	}

	.page-top-tips {
		height: 80rpx;
		padding: 0 30rpx;
		font-size: 26rpx;
		color: #A2A7BA;
	}

	.page-top-tips .tips-btn {
		font-size: 28rpx;
		color: #4D4D4D;
	}

	.pro-section {
		background: white;
		padding: 0 30rpx;
	}

	.pro-section .con-li {
		height: 220rpx;
	}

	.pro-section .con-li .li-select {
		height: 100%;
		width: 60rpx;
		background: url(../static/sel_icon.png) no-repeat center left;
		background-size: 36rpx;
	}

	.pro-section .con-li .li-select.li-sel {
		/* #ifdef APP-PLUS */
		background-image: url(../static/is_check.png);
		/* #endif */
		/* #ifdef H5 */
		background-image: url(../static/h5_is_check.png);
		/* #endif */
	}

	.pro-section .con-li .li-cover {
		width: 160rpx;
		height: 160rpx;
		margin-right: 20rpx;
	}

	.pro-section .con-li .li-info {
		flex: 1;
		position: relative;
	}

	.pro-section .con-li .info-name {
		font-size: 28rpx;
		color: #454545;
		line-height: 40rpx;
	}

	.pro-section .con-li .info-spec {
		font-size: 24rpx;
		color: #B3B3B3;
		margin: 10rpx 0;
	}

	.pro-section .con-li .bot-price {
		font-size: 28rpx;
		color: #F41613;
	}

	.pro-section .con-li .con-number {
		width: 80rpx;
		height: 58rpx;
		border-top: 1px solid #CFCFCF;
		border-bottom: 1px solid #CFCFCF;
		text-align: center;
		line-height: 54rpx;
		font-size: 34rpx;
		color: #606165;
	}

	.pro-section .con-li .con-oper {
		width: 58rpx;
		height: 58rpx;
		border: 1px solid #CFCFCF;
		font-size: 36rpx;
		color: #606165;
		line-height: 54rpx;
		text-align: center;
	}

	.page-mid-head {
		height: 90rpx;
		position: relative;
		padding: 14rpx 0 0 46rpx;
		font-size: 26rpx;
		color: #333333;
		background: white;
		margin: 20rpx 0;
	}

	.page-mid-head::after {
		content: '';
		position: absolute;
		top: 16rpx;
		left: 30rpx;
		width: 4rpx;
		height: 60rpx;
		background: #333333;
	}

	.page-bot {
		position: fixed;
		/* #ifdef H5 */
		bottom: 90rpx;
		/* #endif */
		/* #ifndef H5 */
		bottom: 0;
		/* #endif */
		left: 0;
		width: 100%;
		height: 100rpx;
		background: white;
		z-index: 8;
		font-size: 30rpx;
		color: #333333;
		/* #ifdef H5 */
		padding-left: 30rpx;
		/* #endif */
	}

	.page-bot .bot-all {
		width: 150rpx;
		/* #ifdef H5 */
		width: 120rpx;
		/* #endif */
		text-align: right;
		height: 100%;
		line-height: 100rpx;
		background: url(../static/sel_icon.png) no-repeat center left 30rpx;
		background-size: 36rpx;
	}

	.page-bot .bot-all.all-sel {
		/* #ifdef APP-PLUS */
		background-image: url(../static/is_check.png);
		/* #endif */
		/* #ifdef H5 */
		background-image: url(../static/h5_is_check.png);
		/* #endif */
	}

	.page-bot .bot-price {
		flex: 1;
		margin: 0 30rpx;
		text-align: right;
	}

	.page-bot .bot-btn {
		width: 220rpx;
		height: 100%;
		line-height: 100rpx;
		background: var(--theme);
		text-align: center;
		color: #FFFFFF;
	}

	.c-FF3C51 {
		color: #F41613;
	}

	.c-4E6EF3 {
		color: var(--theme);
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
