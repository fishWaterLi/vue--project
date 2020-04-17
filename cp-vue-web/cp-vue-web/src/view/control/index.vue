<template>
    <div class="controlIndex">
        <div class="header">
            <router-link to="/control/control" :class="{active:pathName=='control'}">{{$t('control.dashboard')}}</router-link>
            <router-link to="/control/property" :class="{active:pathName=='property'}">{{$t('control.balance')}}</router-link>
            <!--<router-link to="/control/ticket" :class="{active:pathName=='ticket'}">{{$t('control.ticket')}}</router-link>-->
            <router-link v-if="status" to="/control/invite" :class="{active:pathName=='invite'}">{{$t('control.invite')}}</router-link>
            <Tooltip :content="$t('invite.inviteError')" placement="top" v-else>
                <span  class="noPermission">{{$t('control.invite')}}</span>
            </Tooltip>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    name: 'controlIndex',
    data() {
        return {
            pathName:'control',
            status: false,
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
        this.permission()
    },
    methods: {
        // 邀请权限
        permission(){
            this.$inviteStatus({},res=>{
                this.status = res.data.status
            })
        }
    }
}
</script>

<style lang="less" scoped>
.controlIndex{
     padding-top: 200px;
    >div{
        width: 1200px;
        margin: auto;
    }
    .header{
        background: #ffffff;
        height: 56px;
        line-height: 55px;
        display: flex;
        justify-content: center;
        margin-bottom: 17px;
        position: relative;
        a,span{
            display: inline-block;
            padding: 0 25px;
            font-size: 19px;
        }
        a.active{
            color: #fff;
            background: #FF6005;
        }
        span:hover.noPermission{
            color: #fff;
            background: #cccccc;
            cursor: pointer !important;
        }
    }
}
</style>
