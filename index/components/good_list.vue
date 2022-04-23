<template>
    <view class="list">
        <view class="list-item"  v-for="(item,index) in value" :key="index" @tap="item_tap(item)">
            <image :src="$image+item.original_img" mode="" />
            <view class="title font-28">{{item.goods_name}}</view>
            <view class="price font-36 bold">￥{{item.shop_price}}</view>
            <view class="other font-24">
                <view class="old-price">原价：{{item.market_price}}元</view>
                <!-- <view>已售{{item.sales_sum}}件</view> -->
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        value:{
            default:[
                // {
                //     image:'/static/good.png',
                //     title:'华为nova6钢化膜6se手机膜全屏覆盖5g版防窥膜华为nova6钢化膜6se手机膜全屏覆盖5g版防窥膜',
                //     price:"59.00",
                //     old_price:'2000',
                //     is_pay:200
                // }
            ]
        },
    },
    methods:{
        item_tap(item){
			uni.navigateTo({
				url: `/index/good_detail/good_detail?id=${item.goods_id}`
			});
        }
    }
}
</script>

<style lang="scss">
    .list{
		margin-top: 20rpx;
		padding: 0 25rpx;
		background-color: #ffffff;
		.list-item{
			float: left;
			width: 336rpx;
			image{
				height: 336rpx;
				width: 336rpx;
			}
			.title{
				line-height: 40rpx;
				margin-top: 20rpx;
				 overflow: hidden;
				text-overflow:ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				height: 76rpx;
				color: #333333;
				text-align: left;
			}
			.price{
				margin-top: 14rpx;
				color: #F41613;
				text-align: left;
			}
			.other{
				display: flex;
				justify-content: space-between;
				color: #999999;
				margin-top: 10rpx;
				margin-bottom: 26rpx;
				.old-price{
					color: #B3B3B3;
					position: relative;
					margin-left: 6rpx;
					font-weight: 400;
				}
				.old-price::after{
					content: "";
					position: absolute;
					height: 2rpx;
					width: 100%;
					background-color: #B3B3B3;
					top: 50%;
					left: 0;
				}
			}
		}
		.list-item:nth-child(2n){
			margin-left: 25rpx;
		}
	}
	.list::after{
		content: '';
		clear: both;
		display: block;
	}
</style>