<template>
    <div class="home">
        <div class="header">
            <Carousel v-model="defSwiper" :autoplay="true" :loop="true" :autoplay-speed="setting.autoplaySpeed"
                      :dots="setting.dots" :radius-dot="setting.radiusDot" :trigger="setting.trigger"
                      :arrow="setting.arrow">
                <CarouselItem v-for="(item, index) in advertisement" :key="index">
                    <div class="demo-carousel" :style="{'background-image':'url('+item.imageUrl+')'}" @click="skipPage(item.linkUrl)"></div>
                </CarouselItem>
            </Carousel>
            <div class="notice">
                <div>
                    <ul :class="{active: animate}">
                        <li v-for="(item,index) in noticeList" :key="index">
                            <span>【{{$t('home.notice')}}】</span>
                            <span>
                                <a :href="item.url" target="_blank">
                                    <Icon type="md-volume-up" style="font-size: 16px;line-height: 17px;"/>{{item.title}}
                                </a>
                            </span>
                            <span v-if="currentLanguage=='zh'"><a href="https://elechash.zendesk.com/hc/zh-cn/categories/360002107713-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83" target="_blank">{{$t('home.evenMore')}}》</a></span>
                            <span v-if="currentLanguage=='en'"><a href="https://elechash.zendesk.com/hc/en-gb/categories/360002107713-Announcement" target="_blank">{{$t('home.evenMore')}}》</a></span>
                            <span v-if="currentLanguage=='ja'"><a href="https://elechash.zendesk.com/hc/ja/categories/360002107713-%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B" target="_blank">{{$t('home.evenMore')}}》</a></span>
                            <span v-if="currentLanguage=='ko'"><a href="https://elechash.zendesk.com/hc/ko/categories/360002107713-%EB%A7%A4%EC%A7%84" target="_blank">{{$t('home.evenMore')}}》</a></span>
                            <span v-if="currentLanguage=='ru'"><a href="https://elechash.zendesk.com/hc/ru/categories/360002107713-%D0%A0%D0%B0%D1%81%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%BD%D0%BE" target="_blank">{{$t('home.evenMore')}}》</a></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="coin">
            <div>
                <div class="item" @mouseenter="isSelect=true" @mouseleave="isSelect=false" :class="{'active': isSelect,'not-active': !isSelect,'down':currentLanguage=='zh'}" @click="$router.push('/price')">
                    <div class="unselected" :class="{'not-active': isSelect}">
                        <img src="../assets/images/home-btc.png" alt="">
                        <span>{{$t('home.btc')}}</span>
                        <p></p>
                    </div>
                    <div class="selected" :class="{'not-active': !isSelect}">
                        <!-- <span>比特币(BTC)</span> -->
                        <span>{{$t('home.currentPrice')}} {{usd}} USD</span>
                        <span>{{$t('home.theory_home')}} ${{formatNumberFloor(dataList.profit,4)}} / T / {{$t('home.days')}}</span>
                        <Icon type="ios-arrow-forward" />
                    </div>
                </div>
                <div class="item" @mouseenter="isSelect_1=true" @mouseleave="isSelect_1=false" :class="{'active': isSelect_1,'not-active': !isSelect_1}">
                    <div class="unselected" :class="{'not-active': isSelect_1}">
                        <img src="../assets/images/home-ltc.png" alt="">
                        <span>{{$t('home.ltc')}}</span>
                        <p></p>
                    </div>
                    <div class="selected" :class="{'not-active': !isSelect_1}">
                        <!-- <span>{{$t('home.currentPrice')}} 10200 USD</span>
                        <span>{{$t('home.theory')}} $0.2512 /T /天</span>
                        <Icon type="ios-arrow-forward" /> -->
                        <span>{{$t('home.expectation')}}</span>
                    </div>
                </div>
                <div class="item" @mouseenter="isSelect_2=true" @mouseleave="isSelect_2=false" :class="{'active': isSelect_2,'not-active': !isSelect_2}">
                    <div class="unselected" :class="{'not-active': isSelect_2}">
                        <img src="../assets/images/home-eth.png" alt="">
                        <span>{{$t('home.eth')}}</span>
                        <p></p>
                    </div>
                    <div class="selected" :class="{'not-active': !isSelect_2}">
                        <!-- <span>{{$t('home.currentPrice')}} 10200 USD</span>
                        <span>{{$t('home.theory')}} $0.2512 /T /天</span>
                        <Icon type="ios-arrow-forward" /> -->
                        <span>{{$t('home.expectation')}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="advantage">
                <div class="title">{{$t('home.advantage')}}</div>
                <div class="con">
                    <div>
                        <div :class="{'active':view}">
                            <p>{{$t('home.free')}}</p>
                            <div>
                                <p>{{$t('home.freeDetail[0]')}}</p>
                                <p>{{$t('home.freeDetail[1]')}}</p>
                            </div>
                        </div>
                        <div :class="{'active':view_1}">
                            <p>{{$t('home.mine')}}</p>
                            <div>
                                <p>{{$t('home.mineDetail[0]')}}</p>
                                <p>{{$t('home.mineDetail[1]')}}</p>
                            </div>
                        </div>
                        <div :class="{'active':view_2}">
                            <p>{{$t('home.manufacturer')}}</p>
                            <div>
                                <p>{{$t('home.manufacturerDetail[0]')}}</p>
                                <p>{{$t('home.manufacturerDetail[1]')}}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div :class="{'active':view_1}">
                            <p>{{$t('home.technical')}}</p>
                            <div>
                                <p>{{$t('home.technicalDetail[0]')}}</p>
                                <p>{{$t('home.technicalDetail[1]')}}</p>
                            </div>
                        </div>
                        <div :class="{'active':view}">
                            <p>{{$t('home.income')}}</p>
                            <div>
                                <p>{{$t('home.incomeDetail')}}</p>
                            </div>
                        </div>
                        <!-- 低成本高优势 -->
                        <div :class="{'active':view_2}">
                            <p>{{$t('home.high')}}</p>
                            <div>
                                <p>{{$t('home.highDetail')}}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="step">
            <div class="title" :class="{'active':step}">
                <img src="../assets/images/step-title.png" alt=""  v-show="currentLanguage=='zh'">
                <img src="../assets/images/step-title-en.png" alt=""  v-show="currentLanguage=='en'||currentLanguage=='ko'||currentLanguage=='ru'">
                <img src="../assets/images/step-title-ja.png" alt=""  v-show="currentLanguage=='ja'">
            </div>
            <div class="first" :class="{'active':step_1}">
                <img src="../assets/images/step-first.png" alt=""  v-show="currentLanguage=='zh'">
                <img src="../assets/images/step-first-en.png" alt=""  v-show="currentLanguage=='en'||currentLanguage=='ko'||currentLanguage=='ru'">
                <img src="../assets/images/step-first-ja.png" alt=""  v-show="currentLanguage=='ja'">
            </div>
            <div class="second" :class="{'active':step_2}">
                <img src="../assets/images/step-second.png" alt=""  v-show="currentLanguage=='zh'">
                <img src="../assets/images/step-second-en.png" alt=""  v-show="currentLanguage=='en'||currentLanguage=='ko'||currentLanguage=='ru'">
                <img src="../assets/images/step-second-ja.png" alt=""  v-show="currentLanguage=='ja'">
            </div>
        </div>
        <div class="show">
            <div>
                <img src="../assets/images/show-course.png" alt="">
                <div>
                    <div class="title">{{$t('home.project')}}</div>
                    <p>{{$t('home.projectDetail')}}</p>
                </div>
                <div>
                    <div class="title">{{$t('home.partner')}}</div>
                    <p>{{$t('home.partnerDetail')}}</p>
                </div>
                <div>
                    <div class="title">{{$t('home.construction')}}</div>
                    <p>{{$t('home.constructionDetail')}}</p>
                </div>
                <div>
                    <div class="title">{{$t('home.team')}}</div>
                    <p>{{$t('home.teamDetail')}}</p>
                </div>
                <div>
                    <div class="title">{{$t('home.expand')}}</div>
                    <p>{{$t('home.expandDetail')}}</p>
                </div>
                <div>
                    <div class="title">{{$t('home.cloud')}}</div>
                    <p>{{$t('home.cloudDetail')}}</p>
                </div>
            </div>
            <div>
                <div class="title">{{$t('home.display')}}</div>
                
                <div class="con" @mouseenter="showBth=true" @mouseleave="showBth=false" >
                    
                    <div class="swiper-container">
                        <div class="swiper-button-prev" :class="{'active': showBth}"><Icon type="ios-arrow-back" /></div><!--左箭头。如果放置在swiper-container外面，需要自定义样式。-->
                        <div class="swiper-button-next" :class="{'active': showBth}"><Icon type="ios-arrow-forward" /></div><!--右箭头。如果放置在swiper-container外面，需要自定义样式。-->
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="thumb">
                                    <img src="../assets/images/mill-1.png" alt="">
                                </div>
                                <div class="content">
                                    <div>{{$t('home.hardware')}}</div>
                                    <p>{{$t('home.hardwareDetail')}}</p>
                                </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="thumb">
                                        <img src="../assets/images/mill-2.png" alt="">
                                    </div>
                                    <div class="content">
                                        <div>{{$t('home.kinds')}}</div>
                                        <p>{{$t('home.kindsDetail')}}</p>
                                    </div>
                            </div>
                            <div class="swiper-slide">
                                <div class="thumb">
                                        <img src="../assets/images/mill-3.png" alt="">
                                    </div>
                                    <div class="content">
                                        <div>{{$t('home.grand')}}</div>
                                        <p>{{$t('home.grandDetail')}}</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { constants } from 'crypto';
import 'swiper/dist/css/swiper.css'
import { Swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    name: 'home',
    data() {
        return {
            defSwiper: 0,
            carouselValue: 0,
            setting: {
                autoplaySpeed: 3500,
                dots: 'inside',
                radiusDot: false,
                trigger: 'click',
                arrow: 'hover'
            },
            animate: false,//公告轮播动画
            noticeList: [],//公告列表
            loading: false,
            dataList:{},
            advertisement:[],
            isSelect: false,
            isSelect_1: false,
            isSelect_2: false,
            view: false,
            view_1: false,
            view_2: false,
            showBth: false,
            step: false,
            step_1: false,
            step_2: false,
            usd: 0,
        }
    },
    created() {
        this.get_dataList();
        this.get_price();//获取当前 币种的美元价格
        window.scrollTo(0,0);
    },
    mounted() {
        this.showNotice();
        this.getCarousel();
        window.addEventListener('scroll',this.handleScroll,true)
         var swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 30,
            delay: 4000,
            autoplay: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    },
    computed:{
        currentLanguage(){
            return this.$store.state.language
        }
    },
    watch:{
        currentLanguage(){
            this.advertisement = []
            this.getCarousel()
            this.showNotice();
        }
    },
    methods: {
         //换算美金价格
        get_price() {
            this.$usds({coin:'BTC',cancel:'account'},res=>{
                if(res.code==0) {
                   this.usd = Number(res.data['BTC']);
                }
            });
        },
         handleScroll(){
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop; 
                if(scrollTop>=300) {
                    this.view = true;
                    setTimeout(()=>{
                        this.view_1 = true;
                    },400)
                    setTimeout(()=>{
                        this.view_2 = true;
                    },800)
                }
                if(scrollTop>=800) {
                    this.step = true;
                     setTimeout(()=>{
                        this.step_1 = true;
                    },400)
                    setTimeout(()=>{
                        this.step_2 = true;
                    },800)
                }
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
        //邀请返佣
        invite() {
            if(localStorage.getItem('userInfo')==null||localStorage.getItem('userInfo')=='null') {
                this.$router.push(`/user/${'login'}`);
                return;
            }
            this.$router.push('/control/control');
        },
        //VIP权益
        VIP() {

        },
        //商务合作
        cooperation() {
            let url = '';
            if(this.currentLanguage=='zh'){
                url = 'https://elechash.zendesk.com/hc/zh-cn/categories/360002107833'
            }else if(this.currentLanguage=='ja'){
                url = 'https://elechash.zendesk.com/hc/ja/categories/360002107833'
            }else if(this.currentLanguage=='ko'){
                url = 'https://elechash.zendesk.com/hc/ko/categories/360002107833'
            }else if(this.currentLanguage=='en'){
                url = 'https://elechash.zendesk.com/hc/en-gb/categories/360002107833'
            }else{
                url = 'https://elechash.zendesk.com/hc/ru/categories/360002107833'
            }
            window.open(url,'_blank')
        },
        skipPage(url) {
            this.$newWinUrl(url);
        },
        //购买
        buy(item) {
            if(localStorage.getItem('userInfo')==null||localStorage.getItem('userInfo')=='null') {
                localStorage.setItem('oldPath',this.$route.path);
                this.$router.push(`/user/${'login'}`);
                return;
            }
            if(item.sold >= 1) {
                return;
            }
            item.hash = item.hashMax;
            item.isHashEqual = false
            localStorage.setItem('data',JSON.stringify(item));
            this.$router.push('/order')
        },
        get_dataList() {
            this.loading = true;
            this.$infoInfo({cancel:'infoList',type:'futures'},res=>{
                this.loading = false;
                if(res.code==0) {
                    this.dataList = res.data.info[0];
                }
            });
        },
        //公告轮播
        showNotice() {
            this.animate = true;
            this.$announcement({cancel: 'announcement'},res=>{
                if(res.code == 0){
                    
                    this.noticeList = res.data.Announcement
                }else{
                    this.$Message.error(res.msg)
                }
            })
            setTimeout(() => {
                this.noticeList.push(this.noticeList[0]);
                this.noticeList.shift();
                this.animate = false;
            }, 500)
        },
        //轮播banner
        getCarousel(){
            this.$advertisement({cancel: 'advertisement'},res=>{
                if(res.code == 0){
                    if(localStorage.getItem('banner')) {
                        var bannerList = JSON.parse(localStorage.getItem('banner'));
                        for (var i=0;i<res.data.Advertisement.length;i++) {
                            if(res.data.Advertisement[i].imageUrl!==bannerList[i].imageUrl) {
                                bannerList[i].imageUrl = res.data.Advertisement[i].imageUrl;
                            }
                        }
                        localStorage.setItem('banner',JSON.stringify(bannerList));
                        this.advertisement = bannerList;
                    }else{
                        this.advertisement = res.data.Advertisement
                    }
                }else{
                    this.$Message.error(res.msg)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .img-link{
        display: block;
        width: 100%;
        height: 420px;
    }
.home{
    background: #fff;
    position: relative;
    padding-bottom: 0 !important;
    * {
        box-sizing: border-box;
    }
    >div{
        width: 100%;
        >div{
            width: 1170px;
            margin: auto;
        }
    }
    .header {
        position: relative;
        z-index: 0;
    }
    .notice {
        width: 100%;
        height: 36px;
        position: absolute;
        bottom: 0;
        background: rgba(0, 0, 0, 0.15);
        > div {
            width: 1200px;
            margin: auto;
            line-height: 34px;
            position: relative;
            overflow: hidden;
            height: 34px;
            ul {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                li {
                    text-align: center;
                    /*cursor: pointer;*/
                    display: flex;
                    justify-content: space-between;
                    span{
                        color:#ffffff;
                        a:link, a:visited {
                        color:#ffffff;
                         }
                    }
                }
            }
            ul.active {
                transition: all 0.5s;
                margin-top: -34px;
                /*background: #ff6005;*/
            }
        }
    }
    .coin{
        padding-top: 78px;
        >div{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .item{
            width: 338px;
            height: 215px;
            box-shadow :0px 5px 30px 0px rgba(0, 0, 0, 0.55);
            padding: 16px 20px;
            position: relative;
            .unselected{
                text-align: center;
                transition: all 0.5s;
                margin-top: 29px;
                img{
                    width: 43px;
                }
                span{
                    display: block;
                    text-align: center;
                    color:#656565;
                    font-size: 20px;
                }
                p{
                    width: 54px;
                    height: 1px;
                    background-color: #808080;
                    margin: 16px 122px 0 122px;
                }
            }
            .unselected.not-active{
               margin-top: -30px;
               span{
                   color: #fff;
               }
               img,p{
                  opacity: 0;
               }
            }
            .selected{
                width: 301px;
                height: 183px;
                border: 1px solid #fff;
                padding: 0 10px;
                position: absolute;
                left: 19px;
                top: 16px;
                transition: all 0.5s;
                text-align: center;
                cursor: pointer;
                span{
                    color: #fff;
                    font-size: 16px;
                    display: block;
                    text-align: center;
                    &:nth-child(1){
                        margin-top: 55px;
                    }
                }
                i{
                    color: #fff;
                    font-size: 16px;
                    margin-top: 16px;
                }
            }
            .selected.not-active{
                transform: scale(0,0);
            }
        }
         .item:nth-child(2).active, .item:nth-child(3).active{
            padding-top: 55px;
            .selected{
                padding-top: 45px;
            }
                
        }
        .item.active{
            -webkit-transition-property: background-color;
            -webkit-transition-duration: 0.5s;
            -webkit-transition-timing-function: ease;
            background-color: #091B4E
        }
        .item.down{
            padding-top: 30px;
            .selected{
                padding-top: 25px;
            }
        }
        .item.not-active{
            -webkit-transition-property: background-color;
            -webkit-transition-duration: 0.5s;
            -webkit-transition-timing-function: ease;
            background-color: #fff
        }
    }
    .advantage{
        background: url('../assets/images/advantage.png') no-repeat center;
        background-size: cover;
        height: 744px;
        margin-top: -20px;
        position: relative;
        .title{
            background: url('../assets/images/home-title-2.png') no-repeat center;
            position: absolute;
            left: 50%;
            top: 30%;
            top: 15%;
            transform: translate(-50%,10%);
            text-align: center;
            font-size:22px;
            color: #455B76;
        }
        .con{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 744px;
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%,0);
            >div{
                margin-top: 70px;
                position: relative;
                height: 500px;
                width: 511px;
                >div{
                    position: absolute;
                    width: 511px;
                    height: 105px;
                    >p{
                        font-size: 18px;
                        color: #fff;
                        margin-top: 16px;
                        text-align: left;
                    }
                    >div{
                        height: 60px;
                        p{
                            text-align: left;
                            font-size: 12px;
                            color: #fff;
                        }
                    }
                }
                &:nth-child(1){
                    margin-right: 100px;
                    >div{
                        padding-right: 90px;
                        transition: all 1s;
                        opacity: 0;
                        p{
                            text-align: right;
                        }
                        &:nth-child(1){
                            right: 50px;
                            top: 90px;
                            background: url('../assets/images/advantage-1.png') no-repeat center;
                        }
                        &:nth-child(2){
                            right: 120px;
                            top: 230px;
                            >p{
                                margin-top: 14px;
                            }
                             background: url('../assets/images/advantage-2.png') no-repeat center;
                        }
                        &:nth-child(3){
                            right: 50px;
                            top: 360px;
                             background: url('../assets/images/advantage-3.png') no-repeat center;
                        }
                        &:nth-child(1).active,&:nth-child(3).active{
                            right: 0;
                            opacity: 1;
                        }
                        &:nth-child(2).active{
                            right: 70px;
                            opacity: 1;
                        }
                    }
                }
                &:nth-child(2){
                    margin-left: 120px;
                    >div{
                        padding-left: 100px;
                        transition: all 1s;
                        opacity: 0;
                        &:nth-child(2){
                            left: 50px;
                            top: 90px;
                             background: url('../assets/images/advantage-2-2.png') no-repeat center;
                        }
                        &:nth-child(1){
                            left: 150px;
                            top: 230px;
                             background: url('../assets/images/advantage-1-1.png') no-repeat center;
                        }
                        
                        &:nth-child(3){
                            left: 50px;
                            top: 360px;
                             background: url('../assets/images/advantage-3-3.png') no-repeat center;
                        }
                        &:nth-child(2).active{
                            left: 0;
                            opacity: 1;
                        }
                         &:nth-child(1).active{
                            left: 100px;
                            opacity: 1;
                        }
                        &:nth-child(3).active{
                            left: 0;
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }
    .step{
        width: 100%;
        height: 392px;
        background: url('../assets/images/step-bg.png');
        padding-top: 56px;
        
        >div{
            position: relative;
            overflow: hidden;
            >img{
                position: absolute;
               
                transition: all 1s ease-out;
            }
        }
        .title{
            width: 447px;
            height: 21px;
            margin-bottom: 56px;
            img{
                top: -21px;
            }
        }
        >div.active{
            img{
                top: 0;
            }
        }
        .first{
            width: 997px;
            height: 74px;
            margin-bottom: 18px;
            img{
                top: -74px;
            }
        }
        .second{
            width: 390px;
            height: 111px;
            margin-left: 32%;
            img{
                top: -111px;
            }
        }
    }
    .show{
        width: 100%;
        height: 1503px;
        background: url('../assets/images/show-bg.png') no-repeat center center;
        background-size: cover;
        position: relative;
        >div{
            &:nth-child(1){
                position: absolute;
                left: 53%;
                top: 65px;
                padding-left: 85px;
                padding-top: 10px;
                >img{
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                >div{
                    width: 350px;
                    margin-bottom: 87px;
                    .title{
                        font-size: 16px;
                        color: #46527e;
                    }
                    p{
                        color: #808080;
                        font-size: 14px;
                        height: 25px;
                        line-height: 25px;
                    }
                }
            }
            &:nth-child(2){
                width: 100%;
                height: 619px;
                position: absolute;
                top: 883px;
                left: 0;
                padding: 69px 0 98px 0;
                .title{
                    background: url('../assets/images/home-title-2.png') no-repeat center;
                    text-align: center;
                    font-size:22px;
                    color: #455B76;
                }
                .con{
                    width: 1104px;
                    margin: auto;
                    overflow: hidden;
                    position: relative;
                    margin-top: 83px;
                    img{
                        width: 346px;
                        height: 235px;
                        transition: all 0.5s;
                        &:hover{
                            transform: scale(1.2,1.2);
                        }
                    }
                    .swiper-slide{
                        width: 346px;
                        height: 353px;
                        background:rgba(244,247,252,1);
                        margin-right: 33px;
                        position: relative;
                        z-index: 89px;
                        &:last-child{
                            margin-right: 0;
                        }
                        .thumb{
                            width: 346px;
                            height: 235px;
                            overflow: hidden;
                        }
                        .content{
                            padding: 20px 26px;
                            div{
                                font-size:18px;
                                font-family:REEJI-HonghuangLi-MediumGB1.0;
                                color: #3a3a3a;
                            }
                            p{
                                font-size:14px;
                                color: #979797;
                            }
                        }
                    }
                }

            }
        }
    }
}
</style>


