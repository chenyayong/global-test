<template>
    <view class="dialog no-conditions" v-if="dialog">
        <view class="content">
            <image src="/static/close.png" class="close" @tap="dialog=false" mode="" />
            <image :src="`/static/${ok?'is_':''}conditions.png`" class="img" mode=""/>
            <view class="font-36">
                {{conditions.title}}
            </view>
            <view class="font-30">
                {{conditions.message}}
            </view>
            <view class="button" v-if="conditions.botton" @tap="button_tap">
                {{conditions.botton}}
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        conditions:{},
        ok:{},
        value:{}
    },
    data(){
        return{
            dialog:false
        }
    },
    methods:{
        button_tap(){
            this.dialog=false;
            this.$emit('change')
        }
    },
    watch:{
        value(val){
            this.dialog=val;
        },
        dialog(val){
            this.$emit('input',val);
        }
    }
}
</script>

<style lang="scss">
    .no-conditions{
        z-index:999;
        display: flex;
        justify-content: center;
        align-items: center;
        .content{
            padding: 60rpx;
            box-sizing: border-box;
            width: 570rpx;
            background-color: #ffffff;
            border-radius: 10rpx;
            position: relative;
            text-align: center;
            .close{
                height: 36rpx;
                width: 36rpx;
                position: absolute;
                right: 30rpx;
                top: 30rpx;
            }
            .img{
                height: 160rpx;
                width: 160rpx;
                margin: 0 auto;
                display: block;
            }
            .font-36{
                margin-top: 20rpx;
            }
            .font-30{
                margin: 0 auto;
                margin-top: 20rpx;
                line-height:42rpx;
                color: #919298;
                width: 100%;
            }
            .button{
                width:450rpx;
                height:90rpx;
                background:var(--theme);
                border-radius:45rpx;
                color: #ffffff;
                line-height: 90rpx;
                text-align: center;
                font-size: 30rpx;
                margin: 25rpx auto 0 auto;
            }
        }
    }
</style>