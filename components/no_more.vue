<template>
    <view class="no-more" v-if="value" @tap="get_more">
        <image src="/static/get_more.png" mode="" />
        加载更多
    </view>
    <view v-else  class="no-more">
        我是有底线的
    </view>
</template>

<script>
export default {
    props:{
        value:{
            default:false
        }
    },
    methods:{
        get_more(){
			uni.showLoading({
				title:'加载中...'
			})
            this.$emit("more")
        }
    }
}
</script>

<style lang="scss">
    .no-more{
        color: #999999;
        height: 80rpx;
        text-align: center;
        line-height: 80rpx;
        font-size: 26rpx;
        background-color: #F7F7F7;
        image{
            height: 32rpx;
            width: 32rpx;
            vertical-align: middle;
            margin-right: 16rpx;
        }
    }
    
</style>