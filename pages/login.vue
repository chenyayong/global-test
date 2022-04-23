<template>
  <view>
    <view class="login-title">
      <view>欢迎登录</view>
      <!-- <view class="language-box">
        <view class="language-item">
          <view class="checks" @tap=";(showCountry = !showCountry), (showLanguage = false)">
            <image style="border-radius: 50%;" :src="`/static/${checkCountry.icon}.jfif`"></image>
            <text>{{ checkCountry.name }}</text>
            <image src="/static/filter_b.png"></image>
          </view>
          <view class="check-box" style="width: 140rpx;" v-show="showCountry">
            <view class="check-item" v-for="(item, index) in countryList" :key="index" @tap="checkC(item)">
              <image :src="`/static/${item.icon}.jfif`"></image>
              <text>{{ item.name }}</text>
            </view>
          </view>
        </view>
        <view class="language-item">
          <view class="checks" @tap=";(showLanguage = !showLanguage), (showCountry = false)">
            <image src="/static/lan_b.png"></image>
            <text>中文</text>
            <image src="/static/filter_b.png"></image>
          </view>
          <view class="check-box" v-show="showLanguage"><view class="check-item" @tap=";(showLanguage = false), $toast('暂未开放')">En</view></view>
        </view>
      </view> -->
    </view>
    <view class="register">
      <text>没有账号？</text>
      <text class="blue" @click="go_register">立即注册</text>
    </view>
    <view class="from">
      <view class="from-item">
        <view class="label font-28">登录账号</view>
        <input v-model="from.mobile" class="font-28" type="number" :placeholder="`请输入手机号${psw_login ? '/用户ID' : ''}`" placeholder-class="placeholder" @blur="getStatus" />
        <image class="item-img" src="../static/close_new.png" @tap="clearMobile" />
      </view>
      <view>
        <view v-if="psw_login" class="from-item">
          <view class="label font-28">登录密码</view>
          <input v-model="from.password" class="font-28 no-bor" :type="isPsw ? 'text' : 'password'" placeholder="请输入密码" placeholder-class="placeholder" />
          <image class="item-img" :src="isPsw ? pswYes : pswNo" @tap="isPsw = !isPsw" />
        </view>
        <view v-else>
          <picker :range="list" range-key="area_name" @change="picker_change">
            <view class="from-item">
              <view class="font-30 label">归属地</view>
              <view
                class="font-30"
                :style="{
                  textAlign: 'left',
                  flex: 1,
                  color: area_name ? '#333333' : 'grey'
                }"
              >
                {{ area_name ? area_name : '号码归属地' }}
              </view>
            </view>
          </picker>
          <view class="from-item rel">
            <view class="label font-28">验证码</view>
            <input v-model="from.mobile_code" class="font-28" type="number" maxlength="4" placeholder="验证码" placeholder-class="placeholder" />
            <vercode v-model="from.mobile" class="right" :timeout="timeout" :area="area" />
          </view>
          <view v-if="isNewUser" class="from-item">
            <view class="label font-28">邀请码</view>
            <input v-model="from.invite" class="font-28 no-bor" placeholder="请输入邀请码" placeholder-class="placeholder" />
          </view>
        </view>
      </view>
      <view class="psw-login">
        <text @click="psw_login = !psw_login">{{ psw_login ? '验证码登录' : '密码登录' }}</text>
        <text class="forget-psw" @tap="go_forget">忘记密码</text>
      </view>
    </view>
    <view class="buttom font-32" @tap="save">登录</view>
    <!-- <view class="wx-login">
      <view class="wx-title">
        <view class="line"></view>
        <text>使用第三方登录</text>
        <view class="line"></view>
      </view>
      <view class="logo-box" @click="wx_login">
        <image src="../static/wx_logo.png"></image>
        <text>微信</text>
      </view>
    </view> -->
  </view>
</template>

<script>
import vercode from '@/components/get_verification.vue'
export default {
  components: {
    vercode
  },
  data() {
    return {
      from: {
        mobile: '',
        password: '',
        mobile_code: '',
        invite: ''
      },
      area: '',
      area_name: '',
      list: [],
      timeout: 0,
      psw_login: true,
      isPsw: false,
      pswNo: '../static/psw_no.png',
      pswYes: '../static/psw_yes.png',
      isNewUser: false,
      showLanguage: false,
      showCountry: false,
      checkCountry: {
        icon: 'china',
        name: '中国'
      },
      countryList: [
        {
          icon: 'china',
          name: '中国'
        },
        {
          icon: 'hk',
          name: '香港'
        },
        {
          icon: 'am',
          name: '澳门'
        },
        {
          icon: 'canada',
          name: '加拿大'
        },
        {
          icon: 'mg',
          name: '美国'
        },
        {
          icon: 'tw',
          name: '台湾'
        },
        {
          icon: 'mlxy',
          name: '马来西亚'
        },
        {
          icon: 'xjp',
          name: '新加坡'
        },
        {
          icon: 'rb',
          name: '日本'
        },
        {
          icon: 'yn',
          name: '越南'
        }
      ]
    }
  },
  mounted() {
    this.$http('get|api/Api/send_validate_code').then(res => {
      this.list = res.result.country_area
      this.timeout = +res.result.sms_time_out
    })
  },
  methods: {
    checkC(item) {
      this.checkCountry = item
      this.showCountry = false
    },
    getStatus() {
      this.isNewUser = false
      this.$http('post|api/Api/issetMobile', {
        mobile: this.from.mobile
      }).then(res => {
        if (res.status === 1) {
          this.isNewUser = true
        }
      })
    },
    clearMobile() {
      this.from.mobile = ''
    },
    save() {
      uni.showLoading({
        mask: true
      })
      if (this.psw_login) {
        if (this.from.mobile || this.from.password) {
          // console.log(uni.getStorageSync('PHPSESSID'))
          this.$http('post|api/User/do_login', {
            mobile: this.from.mobile,
            password: this.from.password,
            // #ifdef APP-PLUS
            push_id: plus.push.getClientInfo().clientid
            // #endif
          })
            .then(res => {
              uni.hideLoading()
              this.$toastApp(res.msg)
              setTimeout(() => {
                uni.switchTab({
                  url: '/pages/my'
                })
              }, 1000)
            })
            .catch(err => {
              uni.hideLoading()
              this.$toastApp(err.msg)
            })
        } else {
          this.$toastApp('手机号或密码不能为空')
        }
      } else {
        if (this.from.mobile || this.from.mobile_code) {
          // console.log(uni.getStorageSync('PHPSESSID'))
          this.$http('post|api/User/code_login', {
            mobile: this.from.mobile,
            mobile_code: this.from.mobile_code,
            // #ifdef APP-PLUS
            push_id: plus.push.getClientInfo().clientid,
            // #endif
            invite: this.from.invite
          })
            .then(res => {
              uni.hideLoading()
              // console.log(res)
              this.$toastApp(res.msg)
              setTimeout(() => {
                uni.switchTab({
                  url: '/pages/my'
                })
              }, 500)
            })
            .catch(err => {
              uni.hideLoading()
              this.$toastApp(err.msg)
              // console.log(err)
            })
        } else {
          this.$toastApp('手机号或验证码不能为空')
        }
      }
    },
    go_register() {
      uni.redirectTo({
        url: '/pages/register'
      })
    },
    go_forget() {
      uni.navigateTo({
        url: '/pages/forgetPSW?type=2'
      })
    },
    picker_change(e) {
      let index = e.detail.value
      this.area = this.list[index].area
      this.area_name = this.list[index].area_name
    },
    showItem() {
      this.itemShow = true
    },
    wx_login() {
      uni.showLoading({
        title: '登录中'
      })
      uni.login({
        provider: 'weixin',
        success: loginRes => {
          // this.$toastApp(loginRes);
          // console.log(loginRes)
          // 获取用户信息
          uni.getUserInfo({
            provider: 'weixin',
            success: infoRes => {
              // console.log('用户昵称为：' + infoRes.userInfo.nickName)
              // console.log('头像：' + infoRes.userInfo.avatarUrl)
              // console.log('unionid：' + loginRes.authResult.unionid)
              // console.log('openId：' + infoRes.userInfo.openId)

              this.$http('post|api/User/bind_guide', {
                nickname: infoRes.userInfo.nickName,
                head_pic: infoRes.userInfo.avatarUrl,
                unionid: loginRes.authResult.unionid,
                openid: infoRes.userInfo.openId
              })
                .then(res => {
                  this.$toastApp(res.msg)
                  setTimeout(() => {
                    uni.navigateBack()
                  }, 500)
                })
                .catch(err => {
                  this.$toastApp(err.msg)
                  if (err.status === -1) {
                    setTimeout(() => {
                      uni.redirectTo({
                        url: '/pages/bind_account'
                      })
                    }, 500)
                  }
                })
            }
          })
        }
      })
    }
  },
  onShow() {
    // console.log(uni.getStorageSync('PHPSESSID'))
  }
}
</script>

<style lang="scss">
.login-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 66rpx;
  font-size: 48rpx;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #313133;
  line-height: 66rpx;
  // padding: 0 20rpx;
  margin-left: 60rpx;
  .language-box {
    // position: absolute;
    // top: 24rpx;
    // right: 20rpx;
    display: flex;
    align-items: center;
    margin-right: 20rpx;

    .language-item {
      margin-left: 20rpx;
    }

    .checks {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      color: #333333;

      image {
        width: 32rpx;
        height: 32rpx;
      }

      text {
        margin-left: 10rpx;
      }
    }

    .check-box {
      position: absolute;
      z-index: 9999;
      width: 120rpx;
      margin-top: 6rpx;
      background-color: #ffffff;
      border: 2rpx solid #cccccc;

      .check-item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60rpx;
        color: #333333;
        font-size: 24rpx;

        image {
          width: 24rpx;
          height: 24rpx;
          border-radius: 50%;
          margin-right: 4rpx;
        }
      }
    }
  }
}

.register {
  height: 36rpx;
  font-size: 26rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #919298;
  line-height: 36rpx;
  margin-left: 60rpx;
  margin-top: 14rpx;

  .blue {
    color: var(--theme);
  }
}

.psw-login {
  position: relative;
  height: 36rpx;
  font-size: 26rpx;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #919298;
  line-height: 36rpx;
  margin-top: 24rpx;

  .forget-psw {
    position: absolute;
    right: 0;
    padding: 10rpx;
  }
}

.from {
  padding: 60rpx;
  padding-bottom: 0;
  box-sizing: border-box;

  .rel {
    position: relative;
  }

  .right {
    position: absolute;
    right: 0;
  }

  .from-item {
    display: flex;
    border-bottom: 1rpx solid #f2f3f6;
    height: 100rpx;
    width: 630rpx;
    align-items: center;
    position: relative;

    .label {
      width: 140rpx;
    }

    .placeholder {
      color: #d7d7d9;
    }

    input {
      width: 60%;
    }

    .no-bor {
      border: none;
      outline: none;
    }

    .item-img {
      position: absolute;
      top: 50%;
      right: 20rpx;
      transform: translateY(-50%);
      width: 36rpx;
      height: 36rpx;
    }
    .isChoose {
      width: 80%;
      height: 100%;
      line-height: 100rpx;
    }
  }
}

.buttom {
  width: 630rpx;
  height: 100rpx;
  background: var(--theme);
  border-radius: 50rpx;
  text-align: center;
  line-height: 100rpx;
  margin: 0 auto;
  margin-top: 60rpx;
  color: #ffffff;
}

.wx-login {
  position: absolute;
  bottom: 60rpx;
  left: 0;
  right: 0;

  .line {
    display: inline-block;
    width: 122rpx;
    height: 4rpx;
    vertical-align: middle;
    background-color: #d7d7d7;
  }

  .wx-title {
    // display: inline-block;
    font-size: 28rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    // text-align: left;
    color: #b9b9b9;
    line-height: 40rpx;
    letter-spacing: 1rpx;
    text-align: center;

    text {
      padding: 0 20rpx;
    }
  }

  .logo-box {
    margin-top: 70rpx;
    text-align: center;

    image {
      width: 68rpx;
      height: 68rpx;
    }

    text {
      display: block;
      font-size: 26rpx;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #999999;
      line-height: 36rpx;
      letter-spacing: -1px;
    }
  }
}
</style>
