<template>
    <view class="bottom-loading">
        <view class="spin" v-if="have"></view>
        {{have?'正在加载···':'我是有底线的'}}
    </view>
</template>

<script>
export default {
    props:{
        have:{
            default:true
        }
    },
    mounted(){
        document.addEventListener("scroll",e=>{
            // #ifdef H5
            var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            //滚动条滚动距离
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            //窗口可视范围高度
            var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight,document.body.clientHeight);
            
            if(clientHeight + scrollTop  >= scrollHeight){
                this.$emit('more')
            }
            // #endif
        })
    }
}
</script>

<style lang="scss">
    .bottom-loading{
        height: 80rpx;
        width: 100%;
        font-size: 26rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999999;
        background-color: #F7F7F7;
      .spin{
          height: 25rpx;
          width: 25rpx;
          border: 4rpx solid #D0D3D4;
          border-radius: 50%;
          border-top-color:  #626567;
          animation: roate 1.5s infinite linear;
          margin-right: 10rpx;
      }
    }
    @keyframes roate {
        from{
            transform: rotate(0deg);
        }
        to{
            transform: rotate(365deg);
        }
    }
</style>