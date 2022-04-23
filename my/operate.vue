<template>
    <view>
        <view class="list-box">
            <view class="item">
                <view class="tlt">运营中心名称</view>
                <view class="txt">{{ operator.operator_title }}</view>
            </view>
            <view class="item">
                <view class="tlt">运营中心负责人</view>
                <view class="txt">{{ operator.operator_name }}</view>
            </view>
            <view class="item">
                <view class="tlt">客服电话</view>
                <view class="txt">{{ operator.service_phone }}</view>
            </view>
            <view class="item">
                <view class="tlt">客服微信</view>
                <view class="txt">{{ operator.service_WeChat }}</view>
            </view>
            <view class="item">
                <view class="tlt">地址</view>
                <view class="txt">{{ operator.service_address }}</view>
            </view>
        </view>
        <view class="service_qr" v-if="operator.service_qr">
            <image :src="$serve + operator.service_qr" mode="widthFix"></image>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            operator: {}
        }
    },
    onLoad() {
        this.$http('get|api/User/index').then(res => {
            this.operator = res.result.operator
        })
    }
}
</script>

<style lang="scss">
.service_qr{
    padding-top: 70rpx;
    image{
        width: 400rpx;
        display: block;
        margin: auto;
    }
}
.list-box {
    padding: 20rpx 30rpx;
    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100rpx;
        font-size: 30rpx;
        box-shadow: 0 2rpx 0 0 #eeeeee;
        .tlt {
            color: #333333;
        }
        .txt {
            width: 70%;
            color: #808080;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
