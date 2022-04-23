<template>
    <view class="box">
        <view class="table" v-if="list.length>0">
            <view class="tr" v-for="(item,index) in list" :key="index">
                <view class="td label">{{item.attr_name}}</view>
                <view class="td value">{{item.attr_value}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        list:{}
    }
}
</script>

<style lang="scss">
    .box{
        margin: 20rpx 0;
        min-height:calc(100vh - 88rpx - 200rpx - 20rpx) ;
        .table{
            width: 690rpx;
            margin: 0 auto;
            border-radius:6rpx;
            border:1rpx solid rgba(232,232,232,1);
            font-size: 24rpx;
            color: #7E7F80;
            .tr{
                border-bottom:1rpx solid rgba(232,232,232,1);
                display: flex;
                .td{
                    height: 82rpx;
                    text-align: left;
                    padding-left:30rpx;
                    line-height: 82rpx;
                }
                .label{
                    width: 234rpx;
                    border-right: 1rpx solid rgba(232,232,232,1);
                }
                .value{
                    flex: 1;
                }
            }
        }
        .tr:nth-last-child(1){
            border-bottom:none;
        }
    }
</style>