<template>
    <view :class="['img',show?'':'no-show']" @tap="show=!show">
        <image :src="src" mode=""/>
    </view>
    <!-- <view class="box">
        <view style="width:20%">
        </view>
    </view> -->
</template>

<script>
export default {
    data(){
        return{
            show:false,
            src:''
        }
    },
    mounted(){
        this.$http('get|api/Index/wx_qr').then(res=>{
            this.src=this.$image+res.result
        })  
    }
}
</script>

<style lang="scss">
    .img{
        height: 300rpx;
        width: 300rpx;
        position: fixed;
        top:40%;
        right: 0;
        transition: all 0.2s;
        border-radius: 10rpx;
        overflow: hidden;
        image{
            height: 100%;
            width: 100%;
        }
    }
    .no-show{
       height: 60rpx;
       width: 60rpx;
       margin-top: 120rpx;
    }
    .box{
        width:100%;
        position:relative;
        height:2px;
        background-color: #cccccc;
        margin: 20rpx 0;
        view{
             position:absolute;
            top:0;
            left:0;
            height: 100%;
            background-color: red;
        }
        view:after{
            position: absolute;
            right: 0;
            top: -5rpx;
            height: 10rpx;
            width: 10rpx;
            content: '';
            background-color: blue;
            border-radius: 50%;
        }
    }
</style>