<template>
	<view>
		<view class="header">
			<view class="yue">
				<view class="font-26">联创积分(经验值)</view>
				<view class="font-72 bold">{{ points }}</view>
			</view>
		</view>
		<view class="list-box">
			<view v-for="(item, index) in list" :key="index" class="list-item">
				<view>
					<view class="font-30">{{ item.remark }}</view>
					<view class="font-26">{{ item.change_time }}</view>
				</view>
				<view class="font-34" :style="{ color: item.give_sum < 0 ? '#F41613' : '#333333' }">{{ item.give_sum }}</view>
			</view>
		</view>
		
		<view v-if="list.length > 0"><view v-if="!have" class="no-more">我是有底线的</view></view>
		<no-data v-else></no-data>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			have: true,
			points: ''
		};
	},
	onShow() {
		this.get_list(true);
	},
	methods: {
		get_list(bool) {
			// api/user/exp_value // api/User/points_list
			this.$http('get|api/user/exp_value').then(res => {
				console.log('get_list', res);
				if (res.result.exp_value_log.length === 0) {
					this.have = false;
				}
				if (bool) {
					this.list = [];
				}
				this.points = res.result.exp_value;
				this.list = [...this.list, ...res.result.exp_value_log]
			});
		},
		more(item) {
			// item.page += 1;
			// this.get_list(item);
		},
		to_active(item, index) {
			// this.option.forEach(el => {
			// 	el.active = false;
			// });
			// this.active = index;
			// item.page = 1;
			// item.active = true;
			// this.get_list(item, true);
		},
		to_rule() {
			// uni.navigateTo({
			// 	url: '/my/about/about?title=积分规则&id=9'
			// });
		}
	},
	onReachBottom() {
		// uni.showLoading({
		// 	title: '加载中...'
		// });
		// this.more(this.option[this.active]);
	}
};
</script>

<style lang="scss">
page {
	background: #f7f7f7;
}

.header {
	height: 300rpx;
	/* #ifdef APP-PLUS */
	background-image: url(../../static/integral.png);
	/* #endif */
	/* #ifdef H5 */
	background-image: url(../../static/h5_integral.png);
	/* #endif */
	background-size: 100%;
	width: 100%;
	position: relative;
	.rule {
		width: 132rpx;
		height: 46rpx;
		/* #ifdef APP-PLUS */
		background: #88a8fd;
		/* #endif */
		/* #ifdef H5 */
		background-color: #33da87;
		/* #endif */
		border-radius: 104rpx 0px 0px 104rpx;
		position: absolute;
		top: 30rpx;
		right: 0;
		text-align: center;
		line-height: 46rpx;
		color: rgba(255, 255, 255, 0.7);
	}
	.yue {
		text-align: center;
		padding-top: 70rpx;
		color: #ffffff;
	}
}
.option {
	display: flex;
	box-shadow: 0px -1rpx 0px 0px rgba(223, 227, 230, 1);
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
.list-box {
	padding: 0 30rpx;
	box-sizing: border-box;
	background-color: #ffffff;
	.list-item {
		border-bottom: 1rpx solid #ececec;
		height: 148rpx;
		padding: 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.font-26 {
			color: #999999;
		}
	}
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
.no-more {
	color: #999999;
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	font-size: 26rpx;
	background-color: #f7f7f7;
}
</style>
