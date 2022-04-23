<template>
    <view class="pay-account-back" v-if="dialog">
        <view class="content">
            <image @tap="dialog=false" class="close" src="/static/close.png" mode="" />
            <view class="header font-32">
                选择收款账户
            </view>
            <view @tap="to_active(item)" :class="['list-item',item.active?'check':'no_check']" v-for="(item,index) in list" :key="index">
                <image class="image-44" src="/static/bank_card.png" mode=""  v-if="item.bank_type===1"/>
                <view class="font-30" v-if="item.bank_type===1">银行卡: {{item.bankname}}({{item.bank_card}})</view>

                <image class="image-44" src="/static/zhifubao.png" mode=""  v-if="item.bank_type===2"/>
                <view class="font-30" v-if="item.bank_type===2">支付宝: {{item.bank_card}}</view>
            </view>
            <view class="add-card" @tap="to_add">
                <image src="/static/add_card.png" mode="" />
                <view class="font-30">添加新收款账户</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        value:{},
        bank_id:{},
        list:{},
		go:{
			default:true
		}
    },
    data(){
        return{
            dialog:false,
        }
    },
    methods:{
        to_active(item){
            this.list.forEach(el=>{
                el.active=false;
            })
            item.active=true;
            this.$emit("change",item)
        },
        to_add(){
			if(this.go){
				uni.navigateTo({
					url: "/my/pay_account/pay_account"
				});
			}else{
				this.$emit('to_add')
			}

        },
    },
    watch:{
        value(val){
            this.dialog=val;
/*            if(val){
                this.open();
            } */
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
            animation: toShow 0.2s;
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