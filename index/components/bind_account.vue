<template>
    <view class="dialog" v-if="dialog">
        <view class="content">
            <view class="font-40">绑定手机号</view>
            <view class="from-item">
                <view class="font-30 label">手机号</view>
                <input class="font-30" type="number" placeholder="请输入您的手机号" v-model="mobile" @blur="getStatus">
            </view>
            <picker :range="list" range-key="area_name" @change="picker_change">
                <view class="from-item">
                    <view class="font-30 label">
                        归属地
                    </view>
                    <view class="font-30" :style="{
                            textAlign:'left',
                            flex:1,
                            color:area_name?'#333333':'grey'
                            }">
                        {{area_name?area_name:'号码归属地'}}
                    </view>
                </view>
            </picker>
            <view class="from-item">
                <view class="font-30 label">验证码</view>
                <input type="text" class="font-30" placeholder="请输入验证码" v-model="code">
                <get-code v-model="mobile" class="code" :timeout="timeout" :area="area"></get-code>
            </view>
            <view class="from-item" v-if="isNewUser">
                <view class="font-30 label">邀请码</view>
                <input class="font-30" type="text" placeholder="请输入邀请码" v-model="invite">
                <!-- <view v-else class="font-30" style="text-align:left;flex:1">
                    {{invite}}
                </view> -->
            </view>
            <!--<view class="from-item" v-if="isNewUser">-->
                <!--<view class="font-30 label">-->
                    <!--原 ID-->
                <!--</view>-->
                <!--<input type="text" class="font-30" placeholder="原NEW3 ID" v-model="new_id">-->
            <!--</view>-->
            <view class="bottom font-32" @tap="submit">
                确认
            </view>
            <!-- <view src="" @tap="dialog=false">gb</view> -->
        </view>
    </view>
</template>

<script>
import getCode from 'components/get_verification.vue'
export default {
    props:{
        value:{},
        set_mobel:{}
    },
    data(){
        return{
            dialog:false,
            mobile:'',
            code:'',
            invite:'',
            new_id:'',
            is_set:false,
            can_set:false,
            list:[],
            area:'',
            area_name:'',
            timeout:0,
			isNewUser:false
        }
    },
    mounted(){
        this.$http('get|api/Api/send_validate_code').then(res=>{
            this.list=res.result.country_area;
            this.timeout=+res.result.sms_time_out
        })
    },
    methods:{
		getStatus(){
			this.isNewUser = false
			this.$http('post|api/Api/issetMobile',{
				mobile:this.mobile
			}).then(res => {
				if (res.status == 1) {
					this.isNewUser = true
					console.log(true);
				}
			})
		},
        submit(){
            // 17758557940
            // 15992822532
			// 18181981578
            // this.$http('post|api/User/do_login',{
            //     mobile:'15766489534',
            //     password:'111111'
            // }).then(res=>{
            //     this.dialog=false;
            // })
            // return
            if(!this.mobile){
                this.$toastApp('请输入手机号');
                return
            }
            if(!$check_mobel(this.mobile)){
                this.$toastApp('手机格式不正确');
                return
            }
            if(!this.code){
                this.$toastApp('请输入验证码');
                return
            }
            
            if(this.is_set){
                //邀请进入
                this.$http('post|api/User/setMobile',{
                    mobile:this.mobile,
                    mobile_code:this.code,
                    invite:this.invite,
                    new_id:this.new_id,
                }).then(res=>{
                    this.$toastApp(res.msg);
                    setTimeout(() => {
                        this.dialog=false                    
                    }, 2000);
                }).catch(err=>{
                    this.$toastApp(err.msg);
                })
            }else{
                //直接进入
                this.$http('post|api/User/bind_account',{
                    mobile:this.mobile,
                    code:this.code,
                    invite:this.invite,
                    new_id:this.new_id,
                }).then(res=>{
                    this.$toastApp(res.msg);
                    setTimeout(() => {
                        this.dialog=false                    
                    }, 2000);
                }).catch(err=>{
                    this.$toastApp(err.msg);
                })
            }
        },
        picker_change(e){
            let index=e.detail.value;
            this.area=this.list[index].area
            this.area_name=this.list[index].area_name
        }
    },
    watch:{
        value(val){
            if(val){
                this.noScroll();
                this.is_set=this.set_mobel;
                if(this.is_set){
                    this.$http('get|api/User/setMobile').then(res=>{
                        this.invite=res.result;
                    })
                }else{
                    this.invite=uni.getStorageSync('invite');
                    if(!this.invite){
                        this.can_set=true
                    }else{
                        this.can_set=false;
                    }
                }
            }else{
                this.remScroll();
            }
            this.dialog=val;
        },
        dialog(val){
            this.$emit('input',val);
        }
    },
    components:{
        getCode
    }
}
</script>

<style lang="scss">
    .dialog{
        position: fixed;
        background-color: rgba(0,0,0,0.7);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        .content{
            width: 690rpx;
            padding: 40rpx 50rpx;
            box-sizing: border-box;
            background-color: #ffffff;
            border-radius:20rpx;
            .font-40{
                color: #666666;
                text-align: center;
            }
            .from-item{
                width: 550rpx;
                height: 90rpx;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow:0px 1px 0px 0px rgba(223,227,230,1);
                .label{
                    width: 140rpx;
                }
                input{
                    flex: 1;
                }
            }
            .bottom{
                width:550rpx;
                height:90rpx;
                background:var(--theme);
                box-shadow:0px 4rpx 14rpx 0px rgba(0,186,249,0.3);
                border-radius:45rpx;
                text-align: center;
                line-height: 90rpx;
                margin: 0 auto;
                margin-top: 60rpx;
                color: #ffffff;
            }
        }
    }
</style>