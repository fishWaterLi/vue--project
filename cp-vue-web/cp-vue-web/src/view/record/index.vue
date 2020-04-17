<template>
    <div class="recordIndex">
        <Breadcrumb>
            <BreadcrumbItem to="/control/property">{{$t('control.balance')}}</BreadcrumbItem>
            <BreadcrumbItem>{{$t('control.financial')}}</BreadcrumbItem>
        </Breadcrumb>
        <div class="header">
            <router-link to="/record/recharge" :class="{active:pathName=='recharge'}">{{$t('record.despoitRecord')}}</router-link>
            <router-link to="/record/withdraw" :class="{active:pathName=='withdraw'}">{{$t('record.withdrawRecord')}}</router-link>
            <router-link to="/record/earnings" :class="{active:pathName=='earnings'}">{{$t('record.income')}}</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'recordIndex',
    data() {
        return {
            pathName:'recharge',
        }
    },
    watch: {
        $route(newVal){
            this.pathName = newVal.name;
        }
    },
    created() {
        if(localStorage.getItem('userInfo')==null||localStorage.getItem('userInfo')=='null') {
            this.$router.push(`/user/${'login'}`);
            return;
        }
    },
    mounted() {
        this.pathName = this.$route.name;
    },
    methods: {}
}
</script>

<style lang="less" scoped>
.recordIndex{
     padding-top: 20px;
    >div{
        width: 1200px;
        margin: auto;
    }
    .ivu-breadcrumb{
        padding-bottom: 20px;
    }
    .header{
        background: #ffffff;
        height: 56px;
        line-height: 55px;
        display: flex;
        margin-bottom: 17px;
        a{
            display: inline-block;
            padding: 0 15px;
            font-size: 19px;
            color: #FF6005;
        }
        a.active{
            color: #fff;
            background: #FF6005;
        }
    }
}
</style>
