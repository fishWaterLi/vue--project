import Vue from 'vue'
import Router from 'vue-router'
import home from './view/home.vue'
import { resolve } from 'q';
// import store from './store'

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/home', //首页
            name: 'home',
            component: home
        },
        {
            path: '/userInfo', //个人中心
            name: 'userInfo',
            meta: { requireAuth: true },
            component: resolve => require(["./view/user/userInfo"], resolve)
        },
        {
            path: '/auth', //KYC认证
            name: 'auth',
            meta: { requireAuth: true },
            component: resolve => require(["./view/user/auth.vue"], resolve)
        },
        {
            path: '/google', //绑定谷歌
            name: 'google',
            meta: { requireAuth: true },
            component: resolve => require(["./view/user/google.vue"], resolve)
        },
        {
            path: '/user/:name', //登录注册
            name: 'user',
            component: resolve => require(["./view/user/userLogin"], resolve),
        },
        {
            path: '/forget', //忘记密码
            name: 'forget',
            component: resolve => require(["./view/user/forget"], resolve)
        },
        {
            path: '/price',
            name: 'price',
            component: resolve => require(["./view/price"], resolve)
        },
        {
            path: '/spotGoods',
            name: 'spotGoods',
            component: resolve => require(["./view/spotGoods"], resolve)
        },
        {
            path: '/order',
            name: 'order',
            component: resolve => require(["./view/order"], resolve)
        },
        {
            path: '/experience',
            name: 'experience',
            component: resolve => require(["./view/experience"], resolve)
        },
        {
            path: '/control',
            name: 'controlIndex',
            component: resolve => require(["./view/control/index"], resolve),
            children: [{
                    path: '/',
                    name: 'control',
                    component: resolve => require(["./view/control/control.vue"], resolve)
                },
                {
                    path: 'control',
                    name: 'control',
                    component: resolve => require(["./view/control/control.vue"], resolve)
                },
                {
                    path: 'property',
                    name: 'property',
                    component: resolve => require(["./view/control/property.vue"], resolve)
                },
                {
                    path: 'ticket',
                    name: 'ticket',
                    component: resolve => require(["./view/control/ticket.vue"], resolve)
                },
                {
                    path: 'invite',
                    name: 'invite',
                    component: resolve => require(["./view/control/invite.vue"], resolve)
                },
            ]
        },
        {
            path: '/record',
            name: 'recordlIndex',
            component: resolve => require(["./view/record/index"], resolve),
            children: [{
                    path: '/',
                    name: 'recharge',
                    component: resolve => require(["./view/record/recharge"], resolve)
                },
                {
                    path: 'recharge',
                    name: 'recharge',
                    component: resolve => require(["./view/record/recharge.vue"], resolve)
                },
                {
                    path: 'withdraw',
                    name: 'withdraw',
                    component: resolve => require(["./view/record/withdraw.vue"], resolve)
                },
                {
                    path: 'earnings',
                    name: 'earnings',
                    component: resolve => require(["./view/record/earnings.vue"], resolve)
                },
            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (!to.matched.length) {
        next({ path: '/home' });
        return
    }
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (localStorage.getItem('userInfo') !== null || localStorage.getItem('userInfo') !== 'null') {
            next();
        } else {
            store.commit('changeStatus', false);
            next({ path: '/userlogin' });
        }
    } else {
        next();
    }
});

export default router;