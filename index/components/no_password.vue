<template>
   <view class="config" v-if="dialog">
        <view class="config-content">
            <view class="title font-40">提示</view>
            <view class="tip font-32">您还未设置支付密码</view>
            <view class="config-buttom font-32">
                <view @tap="quxiao">取消</view>
                <view class="set-btn" @tap="check">去设置</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
     props:{
        value:{},
        back:{
            default:true
        }
    },
    data(){
        return{
            dialog:false,
        }
    },
    methods:{
        check(){
            this.dialog=false;
            this.$emit('check');
        },
        quxiao(){
            this.dialog=false;
            if(this.back){
                uni.navigateBack();
            }
        }
    },
    watch:{
        value(val){
            this.dialog=val;
            if(val){
                this.noScroll();
            }else{
                this.remScroll();
            }
        },
        dialog(val){
            this.$emit("input",val);
        }
    }
}
</script>

<style lang="scss">
    .no-password{
        position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99;
        background-color: rgba(0,0,0,0.7);
    }
		.set-btn{
			color: var(--theme);
		}
</style>