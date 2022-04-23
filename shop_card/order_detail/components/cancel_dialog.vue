<template>
    <view v-if="dialog" class="dialog-box">
        <view class="content">
            <image src="/static/close.png" mode="" class="close" @tap="dialog=false"/>
            <view class="title font-30">
                取消订单
            </view>
            <view class="tip font-30">
                请选择取消订单的原因（必选）：
            </view>
            <view v-for="(item,index) in list" :key="index" class="list-item font-30" @tap="to_active(item)">
               <check-box v-model="item.active" class="check-box" ></check-box>
                {{item.label}}
            </view>
            <view class="bottom font-30" @tap="submit">
                确认取消
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        value:{},
        id:{}
    },
    data(){
        return{
            dialog:false,
            list:[],
        }
    },
    mounted(){
        this.$http('get|api/Order/refund_order').then(res=>{
            this.list=res.note.map(row=>{
                return{
                    active:false,
                    label:row
                }
            })
            this.list[0].active=true
        })
    },
    methods:{
        to_active(item){
            this.list.forEach(el=>{
                el.active=false
            })
            item.active=true;
        },
        submit(){
            let find=this.list.find(row=>row.active==true)
			// console.log(this.id);
			// console.log(find.label);
			// console.log(uni.getStorageSync('PHPSESSID'));
			uni.showModal({
				title: '提示',
				content: '确认取消订单？',
				success: re=> {
					if (re.confirm) {
						this.$http("post|api/Order/record_refund_order",{
						    order_id:this.id,
						    user_note:find.label
						}).then(res=>{
							console.log('ddd');
						    this.$toastApp(res.msg);
						    this.dialog=false;
						    this.$emit('check')
						})
					} else if (re.cancel) {
						// this.$toastApp('取消操作');
					}
				}
			});
        }
    },
    watch:{
        value(val){
            this.dialog=val
        },
        dialog(val){
            this.$emit('input',val);
        }
    }
}
</script>

<style lang="scss">
    .dialog-box{
        background-color: rgba(0,0,0,0.7);
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        .content{
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: #ffffff;
            box-sizing: border-box;
            animation: toShow 0.2s;
            .close{
                height: 36rpx;
                width: 36rpx;
                position: absolute;
                right: 30rpx;
                top: 30rpx;
            }
            .title{
                height: 90rpx;
                text-align: center;
                line-height: 90rpx;
            }
            .tip{
                line-height: 100rpx;
                padding: 0 30rpx;
            }
            .check-box{
                margin-right: 40rpx;
            }
            .list-item{
                display: flex;
                align-items: center;
                height: 100rpx;
                padding: 0 30rpx;
            }
            .bottom{
                text-align: center;
                line-height: 90rpx;
                background-color: var(--theme);
                color: #ffffff;
            }
        }
    }
</style>