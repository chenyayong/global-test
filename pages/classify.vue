<template>
	<!-- <view class="main">
		<view class="header-input-input" @tap="to_search">
			<image src="/static/input_search.png" mode="" />
			<view class="font-26">搜索商品名称</view>
		</view>
		<view class="class-left">
			<view class="con-left" :class="leftTab===index?'sel-left':''" v-for="(item,index) in resList" :key='index' @click="takeLeft(index)">{{item.name}}</view>
		</view>
		<scroll-view scroll-y class="class-container" v-if="resList.length">
			<view class="sort-section" v-for="(item1,index1) in resList[leftTab].tmenu" :key='index1'>
				<view class="sort-head">{{item1.name}}</view>
				<view class="sort-box">
					<view class="con-sort" v-for="(item2,index2) in item1.sub_menu" :key='index2' @click="catClick(item2.id)">
						<image :src="$image + item2.image" class="sort-img" mode=""></image>
						<text>{{item2.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view> -->
	<view>
		<good-list v-model="list"></good-list>
		<!-- <no-more v-model="have" @more="more"></no-more> -->
		<!-- <view class="no-more" v-if="have" @tap="get_more">
			<image src="/static/get_more.png" mode="" />
			加载更多
		</view> -->
		<view v-if="!have" class="no-more">我是有底线的</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// leftTab: 0,
				// resList: []
				list: [],
				have: false,
				page: 1,
			}
		},
		// #ifdef H5
		onShow() {
			this.page = 1;
			this.hot_good(this.page, true)
		},
		// #endif
		// #ifdef APP-PLUS
		onLoad() {
			this.page = 1;
			this.hot_good(this.page, true)
		},
		// #endif
		methods: {
			async hot_good(p = 1, bool, isRefresh) {
				await this.$http("get|api/Index/favourite", {
					p
				}).then(res => {
					if (bool) {
						this.list = [];
					}
					if (res.result.favourite_goods.length == 0) {
						this.have = false;
					} else {
						this.have = true;
						this.list = [...this.list, ...res.result.favourite_goods]
					}
					if (isRefresh) {
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						})
						uni.stopPullDownRefresh();
					}
				})
			},
			get_more() {
				uni.showLoading({
					title: '加载中...'
				})
				this.hot_good(this.page += 1)
			},
			// to_search(){
			// 	uni.navigateTo({
			// 		url: "/index/search/search"
			// 	});
			// },
			// takeLeft(index){
			// 	this.$http('post|api/Goods/categoryList').then(res=>{
			// 		this.resList = res.result.goods_category_tree
			// 		if(this.leftTab != index) this.leftTab = index
			// 	})
			// },
			// catClick(cat_id){
			// 	uni.navigateTo({
			// 		url: `/index/good_page/good_page?cat_id=${cat_id}`
			// 	});
			// }
		},
		onPullDownRefresh() {
			this.page = 1;
			this.hot_good(this.page, true, true)
		},
		onReachBottom() {
			uni.showLoading({
				title: '加载中...'
			})
			this.hot_good(this.page += 1)
		}
	}
</script>

<style lang="scss">
	.main {
		padding-top: 14rpx;
		box-sizing: border-box;
	}

	.header-input-input {
		margin-bottom: 14rpx;
	}

	.class-left {
		width: 200rpx;
		height: calc(100vh - 188rpx);
		display: inline-block;
		background: #F7F7F7;
		vertical-align: top;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.class-left .con-left {
		position: relative;
		padding: 40rpx 30rpx;
		text-align: center;
		font-size: 30rpx;
		color: #5D606E;
	}

	.class-left .con-left.sel-left {
		color: #FF3C51;
		background: #ffffff;
	}

	.class-left .sel-left::after {
		content: '';
		position: absolute;
		top: 36rpx;
		left: 0;
		width: 6rpx;
		height: 48rpx;
		background: #FF3C51;
		z-index: 2;
	}

	.class-container {
		display: inline-block;
		vertical-align: top;
		width: 550rpx;
		height: calc(100vh - 188rpx);
		padding: 30rpx 0rpx 30rpx 26rpx;
		box-sizing: border-box;
	}

	.class-container .classs-ad {
		width: 500rpx;
		height: 180rpx;
		display: block;
		margin-bottom: 60rpx;
	}

	.sort-section {
		margin-bottom: 40rpx;
	}

	.sort-section .sort-head {
		font-size: 30rpx;
		color: #464854;
		margin-bottom: 40rpx;
	}

	.sort-section .sort-box {
		>view {
			float: left;
			margin-right: 22rpx;
		}
	}

	.sort-box::after {
		clear: both;
		content: '';
		display: block;
	}

	.sort-section .con-sort {
		width: 150rpx;
		font-size: 26rpx;
		color: #5D606E;
		text-align: center;
	}

	.sort-section .con-sort .sort-img {
		width: 150rpx;
		height: 150rpx;
		display: block;
		margin: 0 auto 16rpx;
	}

	.no-more {
		color: #999999;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 26rpx;
		background-color: #F7F7F7;

		image {
			height: 32rpx;
			width: 32rpx;
			vertical-align: middle;
			margin-right: 16rpx;
		}
	}
</style>
