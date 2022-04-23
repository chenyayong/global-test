<template>
    <view class="coupon" v-if="dialog">
        <view class="content" >
            <view class="header">
                <view class="font-32 cancel" @tap="dialog=false">取消</view>
                <view class="font-32 flex-1">选择优惠券</view>
                <view class="font-32 check" @tap="check">确定</view>
            </view>
            <view v-for="(item,index) in coupon_list" :key="index" class="list-item" @tap="choose_item(item,index)">
                <view class="price bold">
                    <view class="font-36 inline">￥</view>
                    <view class="font-72 inline">{{+item.coupon.money}}</view>
                </view>
                <view class="msg">
                    <view>
                        <view class="font-24">全平台满{{item.coupon.condition}}元可减{{item.coupon.money}}元</view>
                        <view class="font-24">有效期至{{item.coupon.use_end_time|filterTime}}</view>
                    </view>
                    <image v-if="item.active" class="general-image" src="/static/choose.png" mode="" />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        value:{},
        list:{}
    },
    data(){
        return{
            dialog:false,
            coupon_list:[],
            active_index:'',
        }
    },
    methods:{
        check(){
            this.$emit('choose_item',this.active_index);
            this.dialog=false
        },
        choose_item(item,index){
           this.coupon_list.forEach(el=>{
               el.active=false;
           })
           item.active=true;
           this.active_index=index;
        }
    },
    watch:{
        value(val){
            this.dialog=val;
            if(val){
                this.coupon_list=JSON.parse(JSON.stringify(this.list))
                this.noScroll();
            }else{
                this.remScroll();
            }
        },
        dialog(val){
            this.$emit("input",val);
        }
    },
    filters:{
        filterTime(val){
            let date=new Date(val*1000)
            let mian=date.getFullYear();
            let yue=date.getMonth()+1;
            let ri=date.getDate();
            yue=yue>9?yue:0+yue
            ri=ri>9?ri:0+ri
            return `${mian}年${yue}月${ri}日`
        }
    }
}
</script>

<style lang="scss">
    .coupon{
        position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99;
        background-color: rgba(0,0,0,0.7);
        .content{
            position: absolute;
            bottom: 0;
            width: 100%;
            animation: toShow 0.3s;
            background-color: #ffffff;
            .header{
                height: 84rpx;
                padding: 0 30rpx;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                .flex-1{
                    flex: 1;
                    text-align: center;
                }
                .cancel{
                    color: #999999;
                }
                .check{
                    color: var(--theme);
                }
            }
            .list-item{
                display: flex;
                border-top: 2rpx solid #E2E2E2;
            }
            .price{
                width: 166rpx;
                text-align: center;
                color: #F41613;
                position: relative;
            }
            .price::after{
                position: absolute;
                width:2rpx;
                height:64rpx;
                background:rgba(230,230,230,1);
                content: '';
                right: 0;
                top: 50%;
                margin-top: -32rpx;
            }
            .msg{
                flex: 1;
                padding:30rpx;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                >view{
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .font-24{
                        color: #999999;
                    }
                }
            }
        }
    }

</style>