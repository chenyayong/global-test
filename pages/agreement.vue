<template>
    <view>
        <!-- <view class="title">{{title}}</view> -->
        <view class="content"><rich-text :nodes="xxData.topic_content"></rich-text></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            xxData: '',
            title: ''

        }
    },
    onShow() {
        uni.setNavigationBarTitle({
            title: this.title
        })
    },
    onLoad(options) {
        this.title = options.title
        this.$http('get|api/Article/regulation', {
            id: options.type
        }).then(res => {
            this.xxData = res.result
        })
    }
}
</script>

<style lang="scss">
.title {
    font-size: 40rpx;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #313133;
    line-height: 56rpx;
    margin: auto;
    margin-top: 50rpx;
}
.content {
    padding: 60rpx 40rpx;
}
</style>
