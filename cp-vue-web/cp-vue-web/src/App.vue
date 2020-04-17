<template>
    <div id="app" :class="{'full':pathName=='user'}">
        <header :class="{'bg':pathName=='user'||pathName=='home','active':hide,'not-active':!hide}" id="header">
            <div class="top">
                <div v-if="userInfo">
                    <router-link to="/control/control">{{$t('header.controlPanel')}}</router-link>
                </div>
                <!-- 账户 -->
                <div v-if="userInfo">
                    <Dropdown trigger="hover" @on-click="selectUser">
                        <a href="javascript:void(0)">{{userInfo.name}}
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="0">{{$t('header.userInfo')}}</DropdownItem>
                            <DropdownItem :name="1">{{$t('header.back')}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div v-if="!userInfo">
                    <span><a @click="toLogin('login')"  class="loginText">{{$t('header.login')}}</a></span>
                    <b>/</b>
                    <span><a @click="toLogin('register')">{{$t('header.reg')}}</a></span>
                </div>
                <!-- 中英文切换 -->
                <div>
                    <Dropdown trigger="hover" @on-click="selectLang">
                        <a href="javascript:void(0)">
                            <img src="./assets/images/ko.png" alt="" v-if="languageId=='ko'">
                            <img src="./assets/images/zh.png" alt="" v-if="languageId=='zh'">
                            <img src="./assets/images/ja.png" alt="" v-if="languageId=='ja'">
                            <img src="./assets/images/en.png" alt="" v-if="languageId=='en'">
                            <img src="./assets/images/ru.png" alt="" v-if="languageId=='ru'">
                            {{language}}
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem v-for="item in options" :name="item.value" :key="item.value">
                                <img src="./assets/images/ko.png" alt="" v-if="item.value=='ko'">
                                <img src="./assets/images/zh.png" alt="" v-if="item.value=='zh'">
                                    <img src="./assets/images/ja.png" alt="" v-if="item.value=='ja'">
                                <img src="./assets/images/en.png" alt="" v-if="item.value=='en'">
                                <img src="./assets/images/ru.png" alt="" v-if="item.value=='ru'">
                                    {{item.label}}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            <div class="bottom">
                <router-link to="/home"><img src="../src/assets/images/logo (2).png" width="23" height="36" alt=""></router-link>
                <div :style="{'margin-left':languageId=='ru'?'-100px':'0'}">
                    <span :class="{'active': pathName=='home'||(oldName=='home'&&pathName=='order')}"><router-link
                            to="/home">{{$t('header.index')}}</router-link></span>
                    <span :class="{'active': pathName=='price'||(oldName=='price'&&pathName=='order')}"><router-link
                            to="/price">{{$t('header.price')}}</router-link></span>
                    <span :class="{'active': pathName=='spotGoods'||(oldName=='spotGoods'&&pathName=='order')}"><router-link
                            to="/spotGoods">{{$t('header.spotGoods')}}</router-link></span>
                    <span :class="{'active': pathName=='experience'||(oldName=='experience'&&pathName=='order')}" class="headerExperience"><router-link
                            to="/experience">{{$t('header.exp')}}</router-link> <em><img src="./assets/images/hot.gif" alt=""></em></span>
                    <!-- <span :class="{'active': pathName=='help'}">
                        <a @click="guide">{{$t('footer.introduce[2]')}}</a></span> -->
                    <span :class="{'active': pathName=='investment'}">
                        <a @click="investment">{{$t('header.investment')}}</a></span>
                </div>
            </div>
        </header>
        <div>
            <router-view></router-view>
        </div>
        <footer v-if="pathName!='user'" :class="{background:pathName=='order'}">
            <div>
                <div class="footer-first">
                    <div>
                        <img src="../src/assets/images/logo (2).png" width="23" height="36" alt="">
                    </div>
                    <div>
                        <img src="../src/assets/images/u86.png" alt="" @mouseenter="showQr=true" @mouseout="showQr=false">
                        <a href="https://www.facebook.com/elechash" target="_blank"><img src="../src/assets/images/u94.png" alt=""></a>
                        <a href="https://www.youtube.com/channel/UCNWu2clX3iwhg8UPMsqqVpg?disable_polymer=true" target="_blank"><img src="../src/assets/images/u96.png" alt=""></a>
                        <div v-if="showQr">
                            <img src="./assets/images/weixin.png" alt="">
                        </div>
                    </div>

                </div>
                <div v-if="languageId=='zh'">
                    <p>{{$t('footer.introduce[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/zh-cn/articles/360026633854" target="_blank">{{$t('footer.introduce[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/zh-cn/articles/360033177454" target="_blank">{{$t('footer.introduce[2]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/zh-cn/articles/360033711253" target="_blank">{{$t('footer.introduce[3]')}}</a></span>
                </div>
                <div v-if="languageId=='zh'">
                    <p>{{$t('footer.terms[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/zh-cn/articles/360033172894" target="_blank">{{$t('footer.terms[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/zh-cn/articles/360033707673" target="_blank">{{$t('footer.terms[2]')}}</a></span>
                </div>

                <div v-if="languageId=='ja'">
                    <p>{{$t('footer.introduce[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/ja/articles/360026633854" target="_blank">{{$t('footer.introduce[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ja/articles/360033177454" target="_blank">{{$t('footer.introduce[2]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ja/articles/360033711253" target="_blank">{{$t('footer.introduce[3]')}}</a></span>
                </div>
                <div v-if="languageId=='ja'">
                    <p>{{$t('footer.terms[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/ja/articles/360033172894" target="_blank">{{$t('footer.terms[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ja/articles/360033707673" target="_blank">{{$t('footer.terms[2]')}}</a></span>
                </div>
                <div v-if="languageId=='ko'">
                    <p>{{$t('footer.introduce[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/ko/articles/360026633854" target="_blank">{{$t('footer.introduce[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ko/articles/360031941594" target="_blank">{{$t('footer.introduce[2]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ko/articles/360033711253" target="_blank">{{$t('footer.introduce[3]')}}</a></span>
                </div>
                <div v-if="languageId=='ko'">
                    <p>{{$t('footer.terms[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/ko/articles/360033172894" target="_blank">{{$t('footer.terms[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ko/articles/360033707673" target="_blank">{{$t('footer.terms[2]')}}</a></span>
                </div>
                <div v-if="languageId=='en'">
                    <p>{{$t('footer.introduce[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/en-gb/articles/360026633854" target="_blank">{{$t('footer.introduce[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/en-gb/articles/360033177454" target="_blank">{{$t('footer.introduce[2]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/en-gb/articles/360033711253" target="_blank">{{$t('footer.introduce[3]')}}</a></span>
                </div>
                <div v-if="languageId=='en'">
                    <p>{{$t('footer.terms[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/en-gb/articles/360033172894" target="_blank">{{$t('footer.terms[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/en-gb/articles/360033707673" target="_blank">{{$t('footer.terms[2]')}}</a></span>
                </div>
                <div v-if="languageId=='ru'">
                    <p>{{$t('footer.introduce[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/ru/articles/360026633854" target="_blank">{{$t('footer.introduce[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ru/articles/360033177454" target="_blank">{{$t('footer.introduce[2]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ru/articles/360033711253" target="_blank">{{$t('footer.introduce[3]')}}</a></span>
                </div>
                <div v-if="languageId=='ru'">
                    <p>{{$t('footer.terms[0]')}}</p>
                    <span><a href="https://elechash.zendesk.com/hc/ru/articles/360033172894" target="_blank">{{$t('footer.terms[1]')}}</a></span>
                    <span><a href="https://elechash.zendesk.com/hc/ru/articles/360033707673" target="_blank">{{$t('footer.terms[2]')}}</a></span>
                </div>
                <div>
                    <p>{{$t('footer.relation[0]')}}</p>
                    <span v-if="languageId=='zh'"><a href="##">{{$t('footer.relation[1]')}}  supportcn@elechash.com</a></span>
                    <span v-if="languageId=='ja'"><a href="##">{{$t('footer.relation[1]')}}  supportjp1@elechash.com supportjp2@elechash.com</a></span>
                    <span v-if="languageId=='ko'"><a href="##">{{$t('footer.relation[1]')}}  supportkr@elechash.com</a></span>
                    <span v-if="languageId=='en'"><a href="##">{{$t('footer.relation[1]')}}  supporten@elechash.com</a></span>
                    <span v-if="languageId=='ru'"><a href="##">{{$t('footer.relation[1]')}}   supportru@elechash.com</a></span>
                    
                    <span><a href="##">{{$t('footer.relation[2]')}}  business@elechash.com</a></span>
                </div>
            </div>
            <div>
                <div>©{{new Date().getFullYear()}} elechash.com All Right Reserved</div>
            </div>
        </footer>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex'

    export default {
        name: 'app',
        data() {
            return {
                language: '简体中文',
                pathName: '',
                userInfo: null,
                showQr: false,
                oldName:'',
                options: [
                    {
                        label: '简体中文',
                        value: 'zh',
                    },
                    {
                        label: 'English',
                        value: 'en',
                    },
                    {
                        label: '日本語',
                        value: 'ja',
                    },
                    {
                        label: '한국어',
                        value: 'ko',
                    },
                    {
                        label: 'Русский',
                        value: 'ru',
                    }
                ],
                languageId:'zh',
                hide: false,
            }
        },
        computed:{
            currentLanguage(){
                return this.$store.state.language
            }
        },
        watch: {
            $route(newVal,oldVal) {
                this.pathName = newVal.name;
                this.oldName = oldVal.name;
                // this.get_coupinMsg();
                if (localStorage.getItem('userInfo')) {
                    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                }
            }
        },
        created() {
            let language = ['zh', 'en', 'ja', 'ko', 'ru',]
            let JsSrc = (navigator.language || navigator.browserLanguage).toLowerCase();
            JsSrc = JsSrc == 'zh-cn' ? 'zh' : JsSrc
            if(window.performance.navigation.type != 1){
                if(language.indexOf(JsSrc) > -1){
                    this.$store.commit('changeLanguage', JsSrc);
                }else {
                    this.$store.commit('changeLanguage', 'en');
                }
            }
            window.addEventListener('setInfo', () => {
                this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            })
            window.addEventListener('setLanguage', () => {
                document.title= this.$t('title')
            })
            this.pathName = this.$route.name;
            if (localStorage.getItem('language')) {
                this.language = this.$i18n.locale = this.$store.getters.getLanguage
            } else {
                this.language = this.$i18n.locale = 'en'
            }
            this.languageId = this.language;
            if (this.language === 'en') {
                this.language = 'English';
            } else if (this.language === 'zh') {
                this.language = '简体中文';
            } else if (this.language === 'ja') {
                this.language = '日本語';
            } else if (this.language === 'ko') {
                this.language = '한국어';
            }else if(this.language === 'ru') {
                this.language =  'Русский'
            }
            if (localStorage.getItem('userInfo')) {
                this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
            }
            if (localStorage.getItem('coinList')==null||localStorage.getItem('coinList')==undefined) {
                this.get_coinList();
            }
        },
        mounted(){
            document.title= this.$t('title')
            window.addEventListener('scroll',this.handleScroll,true)
        },
        methods: {
            ...mapMutations(['changeStatus']),
            handleScroll(){
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; 
                if(scrollTop>=35) {
                    this.hide = true;
                }else{
                    this.hide = false;
                }
            },
            toLogin(tag) {
                this.$router.push({path: `/user/${tag}`})
            },
            //获取转增信息
            get_coupinMsg() {
                this.$couponMsg({cancel: 'msg'}, res => {
                    if (res.code == 0) {
                        this.$Notice.info({
                            title: res.data,
                            desc: '',
                        });
                    }
                });
            },
            //新手教程
            guide() {
               let url = '';
                if(this.currentLanguage=='zh'){
                    url = 'https://elechash.zendesk.com/hc/zh-cn/articles/360033177454'
                }else if(this.currentLanguage=='ja'){
                    url = 'https://elechash.zendesk.com/hc/ja/articles/360033177454'
                }else if(this.currentLanguage=='ko'){
                    url = 'https://elechash.zendesk.com/hc/ko/articles/360033177454'
                }else if(this.currentLanguage=='en'){
                    url = 'https://elechash.zendesk.com/hc/en-gb/articles/360033177454'
                }else{
                    url = 'https://elechash.zendesk.com/hc/ru/articles/360033177454'
                }
                window.open(url,'_blank')
            },
            //推广
            investment() {
               let url = '';
                if(this.currentLanguage=='zh'){
                    url = 'https://elechash.zendesk.com/hc/zh-cn/articles/360034742493'
                }else if(this.currentLanguage=='ja'){
                    url = 'https://elechash.zendesk.com/hc/ja/articles/360034742493'
                }else if(this.currentLanguage=='ko'){
                    url = 'https://elechash.zendesk.com/hc/ko/articles/360034742493'
                }else if(this.currentLanguage=='en'){
                    url = 'https://elechash.zendesk.com/hc/en-gb/articles/360034742493'
                }else{
                    url = 'https://elechash.zendesk.com/hc/ru/articles/360034742493'
                }
                window.open(url,'_blank')
            },
            //用户信息
            selectUser(value) {
                if (value === 0) {
                    this.$router.push({path: '/userInfo'});
                }
                if (value === 1) {
                    this.goBack();
                }
            },
            //   切换中英文
            selectLang(value) {
                if (value === 'en') {
                    this.language = 'English';
                } else if (value === 'zh') {
                    this.language = '简体中文';
                } else if (value === 'ja') {
                    this.language = '日本語';
                } else if (value === 'ko') {
                    this.language = '한국어';
                }else if(value==='ru') {
                    this.language = 'Русский';
                }
                this.$i18n.locale = value
                this.$store.dispatch('subLanguage', value)
                this.languageId = value;
                // localStorage.setItem('language', value)
                this.$setItem('language', value);
            },
            // 安全退出
            goBack() {
                localStorage.clear();
                this.changeStatus(false);
                this.$router.push({path: `/user/login`})
                this.userInfo = null
            },
            get_coinList() {
                this.$coinInfo({cancel: 'coin'}, res => {
                    if (res.code == 0) {
                        localStorage.setItem('coinList', JSON.stringify(res.data.coinInfos));
                    } else {
                        this.$Message.error(res.msg);
                    }
                });
            },
        },
    }
</script>

<style lang="less" scoped>
    #app {
        footer.background{
            background: #212121;
        }
        .headerExperience{
            position: relative;
            >em{
                position: absolute;
                top: -13px;
                right: -30px;
                font-size: 11px;
                color: red;
                // transform: scale(0.8,0.9);
                // width: 30px;
            }
        }
    }
</style>
