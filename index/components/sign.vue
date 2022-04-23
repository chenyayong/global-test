<template>
    <view class="fixed" v-if="value">
        <view class="content">
            <view class="sign-back">
                <view class="add bold">+5积分</view>
            </view>
            <image src="/static/sign_buttom.png" mode="" @tap="receive"/>
        </view>
    </view>    
</template>

<script>
export default {
    props:{
        value:{}
    },
    methods:{
        receive(){
            this.$emit("close")
        }
    }
}
</script>

<style lang="scss">
    .fixed{
        position: fixed;
        background-color: rgba(0,0,0,0.7);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .sign-back{
            width: 648rpx;
            height: 528rpx;
            background-image: url("/static/sign.png");
            background-size: 100% 100%;
            background-repeat: no-repeat;
            position: relative;
            color: #FF2623;
            .add{
                position: absolute;
                bottom: 104rpx;
                width: 100%;
                text-align: center;
            }
        }
        image{
            height: 96rpx;
            width: 320rpx;
            display: block;
            margin: 0 auto;
        }
    }

</style>