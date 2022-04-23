<template>
	<view>
		<view class="pro-section">
			<view class="con-li flex-row bdb-1px" v-for="(item,index) in list" :key='index' @tap="takeSel(index)">
				<view class="li-select" :class="item.active?'li-sel':''"></view>
				<image :src="$image+item.original_img" class="li-cover" mode=""></image>
				<view class="li-info">
					<view class="info-name mowrap">{{item.goods_name}}</view>
					<!-- <view class="info-spec">{{item.spec_key_name}}</view> -->
					<view class="info-bot flex-row">
						<view class="bot-price">¥{{item.shop_price}}</view>
						<view class="number-box flex-row">
							<view class="con-oper" @tap.stop="reduce(item,index)">-</view>
							<view class="con-number">{{item.goods_num}}</view>
							<view class="con-oper" @tap.stop="add(item,index)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="height: 100rpx;"></view>
		<view class="ok-btn" @tap="ok">确定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				num: 0,
				free_goods: [], //要添加的商品
				tempNum: 0,
				pageNo: 1
			};
		},
		methods: {
			getList() {
				this.$http("get|api/Cart/free_goods", {
					p: this.pageNo
				}).then(res => {
					if (this.pageNo == 1) {
						this.list = res.result.goods_list
					} else {
						this.list = [...this.list, ...res.result.goods_list]
					}
					this.list.forEach(item => {
						item.goods_num = 1
					})
					if (uni.getStorageSync('addList')) {
						this.free_goods = uni.getStorageSync('addList')
						this.free_goods.forEach(Bitem => {
							this.list.forEach(item => {
								if (Bitem.goods_id == item.goods_id) {
									item.active = true
									item.goods_num = Bitem.goods_num
								}
							})
						})
					}
					uni.stopPullDownRefresh();
				})
			},
			takeSel(index) { // 点击选中商品
				this.list[index].active = !this.list[index].active
				this.list.sort()
			},
			reduce(item, i) {
				if (item.goods_num == 1) {
					return;
				}
				this.list[i].goods_num--
				this.$forceUpdate()
			},
			add(item, i) {
				this.list[i].goods_num++
				this.$forceUpdate()
			},
			ok() {
				let temp = 0
				this.free_goods = []
				this.list.forEach(item => {
					if (item.active) {
						this.free_goods.push({
							goods_id: item.goods_id,
							goods_num: item.goods_num
						})
					}
				})
				this.free_goods.forEach(item => {
					temp += item.goods_num
				})
				console.log(this.free_goods);
				if (temp > this.num) {
					this.$toastApp('赠品数量不得超过' + this.num + '件')
					return
				}
				if (temp < this.num) {
					this.$toastApp('赠品数量不得低于' + this.num + '件')
					return
				}
				// let pages = getCurrentPages();  //获取所有页面栈实例列表
				// let nowPage = pages[ pages.length - 1];  //当前页页面实例
				// let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				// prevPage.$vm.free_goods = this.free_goods;   //修改上一页data里面的数据
				uni.setStorageSync('addList', this.free_goods)
				uni.navigateBack()
			}
		},
		onLoad(opt) {
			this.num = opt.num
			console.log(this.num);
			this.getList()
		},
		onReachBottom() {
			this.pageNo++
			this.getList()
		},
		onPullDownRefresh() {
			this.pageNo = 1
			this.getList()
		},
		onShow() {

		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}

	.pro-section {
		background: white;
		padding: 0 30rpx;
		// margin-top: 20rpx;
	}

	.pro-section .con-li {
		height: 240rpx;
		border-top: 1rpx solid #E5E5E5;
	}

	.pro-section .con-li:nth-child(1) {
		border-top: none;
	}

	.pro-section .con-li .li-select {
		height: 100%;
		width: 60rpx;
		background: url(../../static/sel_icon.png) no-repeat center left;
		background-size: 36rpx;
	}

	.pro-section .con-li .li-select.li-sel {
		/* #ifdef APP-PLUS */
		background-image: url(../../static/is_check.png);
		/* #endif */
		/* #ifdef H5 */
		background-image: url(../../static/h5_is_check.png);
		/* #endif */
	}

	.pro-section .con-li .li-cover {
		width: 180rpx;
		height: 180rpx;
		margin-right: 26rpx;
	}

	.pro-section .con-li .li-info {
		flex: 1;
		position: relative;
		height: 180rpx;
		display: flex;
		flex-flow: column;
		justify-content: space-between;
	}

	.pro-section .con-li .info-name {
		width: 420rpx;
		font-size: 28rpx;
		color: #454545;
		line-height: 40rpx;
		overflow: hidden; //超出的文本隐藏
		text-overflow: ellipsis; //溢出用省略号显示
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
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

	.ok-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100rpx;
		background: var(--theme);
		box-shadow: 0 0 16rpx 0 rgba(0, 0, 0, 0.06);
		color: #FFFFFF;
		font-size: 26rpx;
	}
</style>
