<template>
    <view>
        <view class="header">
            <view class="yue">
                <!-- <view class="font-26">股数</view> -->
                <view class="font-26">荟萃国际</view>
                <view class="font-72 bold">{{ stock_sum }}</view>
            </view>
            <view class="yue">
                <view class="font-26">共创值</view>
                <view class="font-72 bold">{{ new_points }}</view>
            </view>
        </view>
        <view class="list-box">
            <view v-for="(item, index) in list" :key="index" class="list-item">
                <view>
                    <view class="font-30">{{ item.type }}</view>
                    <view class="font-26">{{ item.change_time }}</view>
                </view>
                <view class="font-34" :style="{ color: item.give_sum < 0 ? '#F41613' : '#333333' }">{{ item.give_sum }}</view>
            </view>
        </view>
        <!-- <no-more v-model="option[active].have"  @more="more(option[active])"></no-more> -->
        <view v-if="list.length > 0"><view v-if="noMore" class="no-more">我是有底线的</view></view>
        <no-data v-else></no-data>
    </view>
</template>

<script>
export default {
    data() {
        return {
            new_points: '',
            stock_sum: '',
            page: 1,
            noMore: false,
            list: []
        }
    },
    methods: {
        get_list() {
            this.$http('get|api/user/stock_points', {
                // type:item.value,
                p: this.page
            })
                .then(res => {
                    this.new_points = res.result.new_points
                    this.stock_sum = res.result.stock_sum
                    let stock_points_log = res.result.stock_points_log
                    if (stock_points_log && stock_points_log.length) {
                        this.list = [...this.list, ...stock_points_log]
                        // this.list = stock_points_log.map( e => e).concat(stock_points_log.map( e => e),stock_points_log.map( e => e),stock_points_log.map( e => e))
                    } else {
                        this.noMore = true
                    }
                    // console.log('stock_points', this.list)
                })
                .finally(() => {
                    // setTimeout(() => {
                    //     uni.hideLoading()
                    // }, 2000)
                })
        },
        more(item) {
            this.page++
            this.get_list()
        }
    },
    onLoad() {
        this.get_list()
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
    background: #f7f7f7;
}
.header {
    display: flex;
    justify-content: center;
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
        flex: 1;
        position: relative;
    }
    .yue:first-child::after {
        content: '';
        position: absolute;
        right: 0;
        top: 70rpx;
        bottom: 70rpx;
        background-color: #fff;
        width: 1px;
        transform: scaleX(0.5);
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
