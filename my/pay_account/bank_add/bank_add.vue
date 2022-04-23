<template>
    <view>
        <view class="from">
            <view class="from-item">
                <view class="font-30">姓名</view>
                <input type="text" v-model="from.realname" class="font-30" placeholder="请输入真实姓名" placeholder-class="D7" />
            </view>
            <view class="from-item">
                <view class="font-30">身份证</view>
                <input type="idcard" v-model="from.idcard" class="font-30" placeholder="请输入身份证号码" placeholder-class="D7" />
            </view>
            <view class="from-item">
                <view class="font-30">银行账号</view>
                <input type="number" v-model="from.bank_card" class="font-30" placeholder="请输入银行账号" placeholder-class="D7" />
            </view>
            <picker :range="bank_list" range-key="bankname" @change="bank_change">
                <view class="from-item">
                    <view class="font-30">开户行</view>
                    <view class="more font-30">{{ bank_text }}</view>
                    <!-- <input type="text" v-model="from.bank_branch" class="font-30" placeholder="请输入开户行名称" placeholder-class="D7"> -->
                </view>
            </picker>
            <view class="from-item">
                <view class="font-30">银行支行</view>
                <input type="text" v-model="from.bank_branch" class="font-30" placeholder="请输入银行账号" placeholder-class="D7" />
            </view>
            <view class="from-item">
                <view class="font-30">手机号</view>
                <input type="number" v-model="from.mobile" class="font-30" placeholder="银行预留手机号码" placeholder-class="D7" />
            </view>
        </view>
        <view class="buttom font-30" @tap="input_password">确定</view>
        <pay-password ref="pay" v-model="pay_dialog" :show="false" @check_word="save"></pay-password>
    </view>
</template>

<script>
import payPassword from 'index/components/pay_password.vue'
export default {
    data() {
        return {
            from: {
                bank_type: 1,
                realname: '',
                idcard: '',
                bank_branch: '',
                mobile: '',
                bank_card: '',
                bank_name: '',
                paypwd: ''
            },
            pay_dialog: false,
            bank_list: [],
            bank_text: '请选择'
        }
    },
    mounted() {
        this.$http('get|api/User/add_bankcard').then(res => {
            this.bank_list = res.result.bank_type
        })
    },
    methods: {
        input_password() {
            if (!this.from.realname) {
                this.$toastApp('请输入姓名')
                return
            }
            if (!this.from.idcard) {
                this.$toastApp('请输入身份证号码')
                return
            }
            if (!this.from.bank_card) {
                this.$toastApp('请输入银行账号')
                return
            }
            if (!this.from.bank_name) {
                this.$toastApp('请选择开户行')
                return
            }
            if (!this.from.bank_branch) {
                this.$toastApp('请输入银行支行')
                return
            }
            if (!this.from.mobile) {
                this.$toastApp('请输入手机号')
                return
            }
            this.pay_dialog = true
        },
        save(e) {
            // #ifndef H5
            uni.showLoading()
            // #endif
            this.from.paypwd = e
            this.$http('post|api/User/add_bankcard', this.from)
                .then(res => {
                    this.$toastApp(res.msg)
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 1000)
                })
                .catch(e => {
                    this.$toastApp(e.msg)
                    this.$refs.pay.passworld = []
                })
        },
        bank_change(e) {
            let index = e.target.value
            this.bank_text = this.bank_list[index].bankname
            this.from.bank_name = this.bank_list[index].id
        }
    },
    components: {
        payPassword
    }
}
</script>

<style lang="scss">
.from {
    padding: 0 30rpx;
    box-sizing: border-box;
    .from-item {
        height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0px 1rpx 0px 0px rgba(223, 227, 230, 1);
        margin-top: 2rpx;
        input {
            text-align: right;
        }
    }
    .D7 {
        color: #d7d7d9;
    }
}
.buttom {
    width: 690rpx;
    height: 100rpx;
    background: rgba(51, 135, 255, 1);
    border-radius: 45rpx;
    margin: 0 auto;
    margin-top: 60rpx;
    text-align: center;
    line-height: 90rpx;
    color: #ffffff;
}
.more {
    padding-right: 40rpx;
    position: relative;
}
.more::after {
    position: absolute;
    height: 36rpx;
    width: 36rpx;
    background-image: url(../../../static/more.png);
    background-size: 100%;
    right: 0;
    top: 50%;
    margin-top: -18rpx;
    content: '';
}
</style>
