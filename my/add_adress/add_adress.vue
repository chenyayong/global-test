<template>
  <view class="page">
    <view class="from">
      <view class="from-item">
        <view class="font-30 c6">收货人姓名</view>
        <input type="text" v-model="consignee" />
      </view>
      <view class="from-item">
        <view class="font-30 c6">联系电话</view>
        <input type="number" v-model="mobile" />
      </view>
      <view class="from-item" @tap="show_adress = true">
        <view class="font-30 c6">所在地区</view>
        <view class="input more font-30 choose ellipsis" v-if="region === '请选择'">
          {{ region }}
        </view>
        <view class="input more font-30 ellipsis" v-else>
          {{ region }}
        </view>
      </view>
      <view class="from-textarea">
        <view class="font-30 c6">详细地址</view>
        <textarea class="font-30" v-model="address" />
      </view>
    </view>
    <view class="from" style="margin-top: 20rpx">
      <view class="from-item">
        <view class="font-30 c6">设为默认地址</view>
        <!-- <check-box v-model="is_check"></check-box> -->
        <!-- #ifdef APP-PLUS -->
        <image
          class="check-def"
					@tap="to_default"
          :src="is_check ? '/static/is_check.png' : '/static/sel_icon.png'"
        ></image>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <image
          class="check-def"
					@tap="to_default"
          :src="is_check ? '/static/h5_is_check.png' : '/static/sel_icon.png'"
        ></image>
        <!-- #endif -->
      </view>
    </view>
    <view class="save font-32" @tap="save"> 保存 </view>
    <choose-adress v-model="show_adress" @adress="change_adress"></choose-adress>
  </view>
</template>

<script>
import chooseAdress from 'components/choose_address.vue'
export default {
  data() {
    return {
      region: '请选择',
      show_adress: false,
      consignee: '',
      mobile: '',
      address: '',
      adress_arr: [],
      is_check: false,
      edit: false,
      id: ''
    }
  },
  onLoad(val) {
    console.log(val)
    if (val.edit) {
      this.edit = true
      this.id = +val.id
      this.$http('get|api/User/edit_address', {
        id: +val.id
      }).then((res) => {
        this.mobile = res.result.mobile
        this.consignee = res.result.consignee
        this.region = res.result.address1
        this.address = res.result.address
        this.is_check = res.result.is_default === 1
        this.adress_arr = [res.result.province, res.result.city, res.result.district]
      })
    }
  },
  methods: {
    change_adress(e, text) {
      this.adress_arr = e
      this.region = text
    },
		to_default(){
			this.is_check = !this.is_check
		},
    save() {
      if (!this.consignee) {
        this.$toastApp('请输入收货人姓名')
        return
      }
      if (!this.mobile) {
        this.$toastApp('请输入联系电话')
        return
      }
      // if(this.adress_arr.length!==3){
      // 	this.$toastApp('请选择所在地区')
      // 	return
      // }
      // for (const i of this.adress_arr) {
      // 	if(!i){
      // 		this.$toastApp('请选择所在地区');
      // 		return
      // 	}
      // }
      if (!this.address) {
        this.$toastApp('请输入详细地址')
        return
      }
      let data = {
        consignee: this.consignee,
        mobile: this.mobile,
        province: this.adress_arr[0],
        city: this.adress_arr[1],
        district: this.adress_arr[2],
        address: this.address,
        is_default: this.is_check ? 1 : 0
      }
      if (this.edit) {
        // #ifndef H5
        uni.showLoading()
        // #endif
        this.$http('post|api/User/edit_address', Object.assign(data, { id: this.id }))
          .then((res) => {
            this.$toastApp(res.msg)
            setTimeout(() => {
              uni.navigateBack()
            }, 500)
          })
          .catch((err) => {
            this.$toastApp(err.msg)
          })
      } else {
        this.$http('post|api/User/add_address', data)
          .then((res) => {
            this.$toastApp(res.msg)
            setTimeout(() => {
              uni.navigateBack()
            }, 500)
          })
          .catch((err) => {
            this.$toastApp(err.msg)
          })
      }
    }
  },
  components: {
    chooseAdress
  }
}
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
.page {
  padding-top: 10rpx;
  box-sizing: border-box;
  .from {
    padding: 0 30rpx;
    background-color: #ffffff;
    .from-item {
      height: 100rpx;
      box-shadow: 0px 1rpx 0px 0px rgba(223, 227, 230, 1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      input,
      .input {
        flex: 1;
      }
      .check-def {
        width: 32rpx;
        height: 32rpx;
      }
      .more {
        position: relative;
        padding-right: 50rpx;
        box-sizing: border-box;
      }
      .more::after {
        position: absolute;
        content: '';
        height: 40rpx;
        width: 40rpx;
        right: 0;
        top: 50%;
        margin-top: -20rpx;
        background-image: url(../../static/more.png);
        background-size: 100%;
      }
      .choose {
        text-align: right;
        color: #999999;
      }
    }
    .c6 {
      color: #666666;
      width: 230rpx;
    }
    .from-textarea {
      display: flex;
      padding: 30rpx 0;
      box-sizing: border-box;
      textarea {
        height: 120rpx;
      }
    }
  }
  .save {
    width: 690rpx;
    height: 90rpx;
    background: var(--theme);
    border-radius: 45rpx;
    margin: 0 auto;
    margin-top: 60rpx;
    text-align: center;
    line-height: 90rpx;
    color: #ffffff;
  }
}
</style>
