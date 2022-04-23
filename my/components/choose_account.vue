<template>
    <view class="pay-account-back" v-if="dialog">
        <view class="content">
            <image @tap="dialog=false" class="close" src="/static/close.png" mode="" />
            <view class="header font-32">
                选择收款账户
            </view>
            <view @tap="to_active(item)" :class="['list-item more']" v-for="(item,index) in card_list" :key="index">
                <image class="image-44" :src="item.iamge" mode="" />
                <view class="font-30">{{item.label}}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        value:{},
        card_id:{}
    },
    data(){
        return{
            dialog:false,
            card_list:[
                {
                    iamge:'/static/bank_card.png',
                    label:"个人银行账户",
                    url:'/my/pay_account/bank_add/bank_add'
                },
                {
                    iamge:'/static/icon_13.png',
                    label:"支付宝",
                    url:'/my/pay_account/other_add/other_add'
                }
            ]
        }
    },
    methods:{
        to_active(item){
           uni.navigateTo({
                url:item.url
           });
           setTimeout(() => {
               this.dialog=false
           }, 500);
        },
    },
    watch:{
        value(val){
            this.dialog=val;
        },
        dialog(val){
            this.$emit('input',val)
        }
    }
}
</script>

<style lang="less">
    .pay-account-back{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0,0,0,0.7);
        .content{
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: #ffffff;
            animation: toShow 0.3s;
            .close{
                position: absolute;
                height: 36rpx;
                width: 36rpx;
                right: 30rpx;
                top:30rpx;
            }
            .header{
                width: 100%;
                height:100rpx;
                background:rgba(255,255,255,1);
                box-shadow:0px -1rpx 0px 0px rgba(237,239,243,1);
                text-align: center;
                line-height: 100rpx;
            }
            .list-item{
                height:120rpx;
                box-shadow:0px -1rpx 0px 0px rgba(237,239,243,1);
                margin-top: 2rpx;
                padding: 0 30rpx;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                position: relative;
                >view{
                    padding-left: 20rpx;
                    box-sizing: border-box;
                    flex: 1;
                }
            }
            .more::after{
                position: absolute;
                right: 30rpx;
                top: 50rpx;
                height: 36rpx;
                width: 36rpx;
                content: '';
                background-image: url(../../static/more.png);
                background-size: 100%;
            }
            .check::after{
                height: 36rpx;
                width: 36rpx;
                right: 30rpx;
                top: 50%;
                margin-top: -18rpx;
                position: absolute;
                content: '';
								/* #ifdef APP-PLUS */
								background-image: url(../../static/is_check.png);
								/* #endif */
								/* #ifdef H5 */
								background-image: url(../../static/h5_is_check.png);
								/* #endif */
                background-size: 100%;
            }
            .no_check::after{
                height: 36rpx;
                width: 36rpx;
                right: 30rpx;
                top: 50%;
                margin-top: -18rpx;
                position: absolute;
                content: '';
                background-image: url(../../static/no_check.png);
                background-size: 100%;
            }
            .add-card{
                height:120rpx;
                padding: 0 30rpx;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                image{
                    height: 60rpx;
                    width: 60rpx;
                }
                >view{
                    padding-left: 20rpx;
                    box-sizing: border-box;
                    flex: 1;
                }
            }
        }
    }
</style>