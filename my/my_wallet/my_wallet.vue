<template>
	<view class="main">
		<view class="top-header">
			<text>钱包总额</text>
			<view class="head-num">{{ money }}</view>
		</view>
		<view class="top-oper flex-row">
			<view @click="handleWithdraw" url="/my/withdraw/withdraw" hover-class="none" class="con-oper">
				<image src="/static/wallet_icon1.png" class="oper-icon" mode=""></image>
				<text>提现</text>
			</view>
			<navigator url="/my/transfer/transfer" hover-class="none" class="con-oper">
				<image src="/static/wallet_icon2.png" class="oper-icon" mode=""></image>
				<text>转账</text>
			</navigator>
			<navigator url="/my/top_up/top_up" hover-class="none" class="con-oper">
				<image src="/static/wallet_icon3.png" class="oper-icon" mode=""></image>
				<text>提现记录</text>
			</navigator>
		</view>
		<view class="option">
			<view @tap="to_active(item, index)" v-for="(item, index) in option" :key="index" :class="[item.active ? 'active' : '']">{{ item.label }}</view>
		</view>

		<view class="con-li flex-row bdb-1px" v-for="(item, index) in option[option_active].list" :key="index">
			<view class="li-left">
				<view class="left-name">{{ item.desc }}</view>
				<text>{{ item.change_data }}</text>
			</view>
			<view class="li-right">
				<view class="right-num" :style="{ color: item.user_money < 0 ? '#FF4C57' : '#333333' }">{{ item.user_money }}</view>
			</view>
		</view>
		<!-- <no-more v-model="option[option_active].have" v-if="option[option_active].list.length>0" @more="more(option[option_active])"></no-more> -->
		<view v-if="option[option_active].list.length > 0"><view v-if="!option[option_active].have" class="no-more">我是有底线的</view></view>
		<no-data v-if="option[option_active].list.length === 0"></no-data>
	</view>
</template>

<script>
export default {
	data() {
		return {
			money: 0,
			resList: [],
			option: [
				{
					label: '全部',
					value: 'all',
					active: true,
					list: [],
					page: 1,
					have: true
				},
				{
					label: '收入',
					value: 'plus',
					active: false,
					list: [],
					page: 1,
					have: true
				},
				{
					label: '支出',
					value: 'minus',
					active: false,
					list: [],
					page: 1,
					have: true
				}
			],
			option_active: 0
		};
	},
	onShow() {
		this.getResList(this.option[this.option_active], true);
	},
	methods: {
		handleWithdraw() {
			const that = this;
			uni.navigateTo({
				url: '/my/withdraw/withdraw'
			});
			// uni.showActionSheet({
			// 	itemList: ['企业提现', '个人提现'],
			// 	success: function(res) {
			// 		if (res.tapIndex === 0) {
			// 			that.businessWithdraw();
			// 		} else {
			// 			that.personalWithdraw();
			// 		}
			// 		console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
			// 	}
			// });
		},
		// 企业提现
		businessWithdraw() {
			uni.navigateTo({
				url: '/my/agent/agent'
			});
		},
		// 个人提现
		personalWithdraw() {
			uni.navigateTo({
				url: '/my/withdraw/withdraw'
			});
		},
		to_active(item, index) {
			this.option.forEach(el => {
				el.active = false;
			});
			item.active = true;
			item.have = true;
			item.page = 1;
			this.getResList(item, true);
			this.option_active = index;
		},
		getResList(item, bool) {
			this.$http('get|api/User/account_list', {
				type: item.value,
				p: item.page
			}).then(res => {
				if (res.result.account_log.length === 0) {
					item.have = false;
					return;
				}
				this.money = res.result.money;
				if (bool) {
					item.list = [];
				}
				item.list = [...item.list, ...res.result.account_log];
			});
		},
		more(item) {
			item.page += 1;
			this.getResList(item);
		}
	},
	onReachBottom() {
		uni.showLoading({
			title: '加载中...'
		});
		this.more(this.option[this.option_active]);
	}
};
</script>

<style lang="scss">
page {
	background: #f7f7f7;
}

.top-header {
	position: relative;
	height: 300rpx;
	padding-top: 70rpx;
	font-size: 26rpx;
	color: #ffe7e7;
	text-align: center;
	/* #ifdef APP-PLUS */
	background: linear-gradient(225deg, rgba(116, 155, 255, 1) 0%, rgba(65, 100, 244, 1) 100%);
	/* #endif */
	/* #ifdef H5 */
	background: linear-gradient(225deg, #02d86d 0%, #00b159 100%);
	/* #endif */
}

.top-header .head-num {
	font-size: 72rpx;
	color: #ffffff;
	font-weight: bold;
	margin-top: 10rpx;
}

.top-header .head-nav {
	position: absolute;
	top: 30rpx;
	right: 0;
	width: 140rpx;
	height: 50rpx;
	line-height: 50rpx;
	text-align: center;
	border-radius: 104rpx 0 0 104rpx;
	background: rgba(255, 255, 255, 0.2);
	font-size: 24rpx;
	color: #ffffff;
	z-index: 3;
}

.top-oper {
	width: 710rpx;
	height: 164rpx;
	margin: 20rpx auto;
	border-radius: 12rpx;
	background: white;
}

.top-oper .con-oper {
	flex: 1;
	font-size: 26rpx;
	color: #666666;
	text-align: center;
}

.top-oper .con-oper .oper-icon {
	width: 64rpx;
	height: 64rpx;
	margin: 0 auto 4rpx;
	display: block;
}

.page-scroll {
	height: 90rpx;
	white-space: nowrap;
	background: white;
	overflow-y: hidden;
	overflow-x: scroll;
	padding: 0 35rpx;
}

.page-scroll .con-nav {
	position: relative;
	display: inline-block;
	vertical-align: top;
	line-height: 90rpx;
	text-align: center;
	font-size: 30rpx;
	color: #808080;
	margin-right: 80rpx;
}

.page-scroll .con-nav:last-child {
	margin-right: 0;
}

.page-scroll .con-nav.sel-nav {
	color: #ff3c51;
}

.page-scroll .sel-nav::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4rpx;
	background: #ff3c51;
}

.con-li {
	height: 150rpx;
	background: white;
	padding: 0 30rpx;
	font-size: 26rpx;
	color: #999999;
}

.con-li .left-name {
	font-size: 30rpx;
	color: #2e2e2e;
	margin-bottom: 12rpx;
}

.con-li .li-right {
	text-align: right;
}

.con-li .right-num {
	font-size: 36rpx;
	color: #333333;
}

.option {
	display: flex;
	background-color: #ffffff;

	> view {
		flex: 1;
		text-align: center;
		font-size: 30rpx;
		line-height: 90rpx;
		color: #808080;
	}

	.active {
		color: var(--theme);
		position: relative;
	}

	.active::after {
		position: absolute;
		content: '';
		width: 64rpx;
		height: 2rpx;
		background-color: var(--theme);
		bottom: 0;
		left: 50%;
		margin-left: -32rpx;
	}
}

.no-more {
	color: #999999;
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	font-size: 26rpx;
	background-color: #f7f7f7;
}
</style>
