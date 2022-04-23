<template>
    <view class="box">
        <rich-text :nodes="node"></rich-text>
    </view>
</template>

<script>
export default {
    props:{
        node:{}
    },
}
</script>

<style>
    .box{
        width:100%;
        
    }
    >>> div{
        width: 100%;
    }
    >>> img{
        display: inline-block;
        width:100%;
    }
</style>