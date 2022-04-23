<template>
	<view v-if="list.length>0">
		<view class="list-item" v-for="(item,index) in list" :key="index" @tap="to_detail(item)">
			<view class="title font-26">
				<view>退款编号:{{item.order_sn}}</view>
				<view style="color:#F41613">
					{{item.status_deac}}
				</view>
			</view>
			<view class="order-good">
				<view class="order-item" v-for="(ite,index) in item.goods_list" :key="index">
					<image :src="$image+ite.original_img" mode="" />
					<view class="good-item">
						<view class="flex">
							<view class="ellipsis-two font-28">{{ite.goods_name}}</view>
							<view class="font-34">X{{ite.goods_num}}</view>
						</view>
						<view class="font-26">
							{{ite.spec_key_name}}
						</view>
						<view class="flex flex2">
							<view class="font-32">
								￥{{ite.member_goods_price}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="option" v-if="item.status===0">
				<view class="font-28" @tap.stop="cancel(item)">
					取消退款
				</view>
			</view>
		</view>
		<!-- <no-more v-model="have" @more="more"></no-more> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</view>
	<no-data v-else></no-data>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				have: true,
				list: []
			}
		},
		onShow() {
			this.get_list(true);
		},
		methods: {
			get_list(bool) {
				this.$http('post|api/Order/return_goods_list', {
					p: this.page
				}).then(res => {
					if (res.result.length == 0) {
						this.have = false;
						return
					}
					if (bool) {
						this.list = [];
					}
					this.list = [...this.list, ...res.result];
				})
			},
			cancel(item) {
				uni.showModal({
					title: '提示',
					content: '确认取消退款',
					success: (res) => {
						if (res.confirm) {
							this.$http('get|api/Order/return_goods_cancel', {
								id: item.id
							}).then(res => {
								this.$toastApp(res.msg);
								setTimeout(() => {
									this.page = 1;
									this.get_list(true);
								}, 2000)
							}).catch(e => {
								this.$toastApp(e.msg)
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			to_detail(item) {
				uni.navigateTo({
					url: `/shop_card/sale_detail/sale_detail?id=${item.id}`
				});
			},
			more() {
				this.page += 1;
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
	page {
		background-color: #f7f7f7;
		padding-top: 20rpx;
	}

	.list-item {
		margin-bottom: 20rpx;
		background-color: #ffffff;

		.title {
			height: 80rpx;
			line-height: 80rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			border-bottom: 2rpx solid #F4F4F4;
			display: flex;
			justify-content: space-between;
		}
	}

	.order-good {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		box-shadow: 0px -1px 0px 0px rgba(223, 227, 230, 1);
		border-bottom: 1rpx solid rgba(223, 227, 230, 1);

		image {
			height: 200rpx;
			width: 200rpx;
		}

		.order-item {
			display: flex;

			.good-item {
				flex: 1;
				padding-left: 20rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.flex {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;

					.ellipsis-two {
						max-width: 380rpx;
					}
				}

				.font-26 {
					color: #999999;
				}
			}
		}
	}

	.option {
		padding: 20rpx 30rpx;
		height: 100rpx;
		box-sizing: border-box;
		background-color: #ffffff;
		width: 100%;

		>view {
			float: right;
			width: 172rpx;
			height: 60rpx;
			background: rgba(78, 110, 243, 1);
			border-radius: 8rpx;
			line-height: 60rpx;
			color: #ffffff;
			text-align: center;
		}
	}

	.option::after {
		clear: both;
		content: '';
		display: block;
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
