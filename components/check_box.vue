<template>
    <view v-if="value" class="check-box" @tap="val=!val">
        <image src="/static/is_check.png" mode="" />
    </view>
    <view v-else class="check-box" @tap="val=!val">
        <image src="/static/no_check.png" mode="" />
    </view>
</template>

<script>
export default {
    props:{
        value:{
            default:false
        },
    },
    data(){
        return{
            val:false
        }
    },
    watch:{
        value(val){
            this.val=val;
        },
        val(val){
            this.$emit('input',val);
        }
    }
}
</script>

<style lang="scss">
    .check-box{
        display: inline-block;
        height: 36rpx;
        width: 36rpx;
        font-size:0;
        image{
            height: 100%;
            width: 100%;
        }
    }
</style>