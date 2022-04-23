<script>
export default {
    onLaunch: function() {
        // console.log('App Launch');
        // #ifdef APP-PLUS
        // var info = plus.push.getClientInfo();
        /* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送 */
        plus.push.addEventListener(
            'click',
            function(msg) {
                // console.log("click:"+JSON.stringify(msg));
                // console.log(msg)
                // let payload = JSON.parse(msg.payload)
            },
            false
        )
        // 监听接收透传消息事件
        plus.push.addEventListener(
            'receive',
            function(msg) {
                // 处理透传消息的业务逻辑代码
                // console.log('透传消息：' + JSON.stringify(msg));
                if (msg.type === 'receive') {
                    let payload = JSON.stringify(msg.payload)
                    plus.push.createMessage(msg.content, payload, {
                        title: msg.title
                    })
                }
            },
            false
        )
        // #endif
    },
    onShow: function() {
        // console.log('App Show')
    },
    onHide: function() {
        // console.log('App Hide')
    }
}
</script>

<style lang="scss">
@import '/globe/index.scss';

/* #ifdef APP-PLUS */
page {
    --theme: #4e6ef3;
}
/* #endif */
/* #ifdef H5 */
page {
    --theme: #00be5f;
}
/* #endif */

.ios-btm {
    height: 20rpx;
    height: constant(safe-area-inset-bottom);
    /* 兼容 iOS < 11.2 */
    height: env(safe-area-inset-bottom);
    /* 兼容 iOS >= 11.2 */
}
</style>
