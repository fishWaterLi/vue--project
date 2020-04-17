<template>
    <div class="invite">
        <div class="top">
            <div class="title">{{$t('invite.title[0]')}}</div>
            <div class="con">
                <div>
                    <p>{{$t('invite.inviteCode')}}</p>
                    <div>
                        <span>{{inviteCode}}</span>
                        <span :data-clipboard-text="inviteCode" class="copyCode" @click="copyHint('邀请码')">{{$t('invite.copyCode')}}</span>
                    </div>
                </div>
                <div>
                    <p v-if="currentLanguage=='ru'" style="line-height: 16px">{{$t('invite.invitePoster')}}</p>
                    <p v-else>{{$t('invite.invitePoster')}}</p>
                    <div @click="showPoster">{{$t('invite.createPoster')}}</div>
                </div>
                <div>
                    <p>{{$t('invite.inviteLink')}}</p>
                    <div>
                        <span>{{inviteLink}}</span>
                        <span :data-clipboard-text="inviteLink" class="copyLink"
                              @click="copyHint('链接')">{{$t('invite.copyLink')}}</span>
                    </div>
                </div>
            </div>
        </div>
        <!--<div class="vip">
            <div class="header">{{$t('invite.title[1]')}}</div>
            <div class="con">
                <div class="item" :class="{'vip1': vipGrade>=1}">
                    <button v-if="vipGrade==0">待解锁</button>
                    <button v-else>2% {{$t('invite.rebateReward')}}</button>
                </div>
                <div class="item" :class="{'vip2': vipGrade>=2}">
                    <button v-if="vipGrade<2">待解锁</button>
                    <button v-else>3% {{$t('invite.rebateReward')}}</button>
                </div>
                <div class="item" :class="{'vip3': vipGrade>=3}">
                    <button v-if="vipGrade<3">待解锁</button>
                    <button v-else>4% {{$t('invite.rebateReward')}}</button>
                </div>
                <div class="item" :class="{'vip4': vipGrade>=4}">
                    <button v-if="vipGrade<4">待解锁</button>
                    <button v-else>5% {{$t('invite.rebateReward')}}</button>
                </div>
                <div class="item" :class="{'vip5': vipGrade==5}">
                    <button v-if="vipGrade<5">待解锁</button>
                    <button v-else>6% {{$t('invite.rebateReward')}}</button>
                </div>
            </div>
        </div>-->
        <div class="invitePic" v-if="invitePic">
            <img src="../../assets/images/ad.png" alt="" v-if="currentLanguage=='zh'">
            <img src="../../assets/images/ad_E (1).png" alt="" v-if="currentLanguage=='en'">
            <img src="../../assets/images/ad_E (2).png" alt="" v-if="currentLanguage=='ja'">
            <img src="../../assets/images/ad_E (3).png" alt="" v-if="currentLanguage=='ko'">
            <img src="../../assets/images/ad_E (4).png" alt="" v-if="currentLanguage=='ru'">
            <button @click="invitePic = false"></button>
        </div>
        <div class="middle">
            <div class="title">
                <span @click="changeTab(1)" :class="{active: tab == 1}">{{$t('invite.title[2]')}}</span>
                <span @click="changeTab(2)" :class="{active: tab == 2}">{{$t('invite.title[3]')}}</span>
            </div>
            <div v-show="tab==1">
                <div class="nav">
                    <span>{{$t('invite.account')}}</span>
                    <span>{{$t('invite.time')}}</span>
                    <span>{{$t('invite.state')}}</span>
                </div>
                <b v-if="inviteList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                    <span>{{$t('noData')}}</span></b>
                <div v-else class="item" v-for="(item,index) in inviteList" :key="index">
                    <span>{{item.name}}</span>
                    <span>{{item.registerTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span>{{item.status == true? $t('invite.bought'):$t('invite.registered')}}</span>
                </div>
                <div class="remark">{{$t('invite.inviteFriend')}}：{{count}}</div>
                <Page :total="count" :page-size="pageSizeSet" class='reset-page' :current="pageNum" show-elevator
                      @on-change="change_page"
                      v-if="count > 0"></Page>
            </div>
            <div v-show="tab==2">
                <div class="nav">
                    <span>{{$t('invite.account')}}</span>
                    <span>{{$t('invite.timeReward')}}</span>
                    <span>{{$t('invite.numReward')}}</span>
                </div>
                <b v-if="profitList.length==0" class="nodata"><img src="../../assets/images/nodata.png" alt="">
                    <span>{{$t('noData')}}</span></b>
                <div v-else class="item" v-for="(item,index) in profitList" :key="index">
                    <span>{{item.name}}</span>
                    <span>{{item.profitTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span>{{item.volume}} {{item.coin}}</span>
                </div>
                <div class="remark">{{$t('invite.cumulative')}}：{{totalProfit}} BTC</div>
                <Page :total="count" :page-size="pageSizeSet" class='reset-page' :current="pageNum" show-elevator
                      @on-change="change_page"
                      v-if="count > 0"></Page>
            </div>
        </div>
        <div class="bottom">
            <div class="title">{{$t('invite.title[4]')}}</div>
            <div class="con">
                <p>{{$t('invite.invitiTip[0]')}}</p>
                <p>{{$t('invite.invitiTip[1]')}}</p>
            </div>
        </div>
        <Modal v-model="invitePoster" :closable="true" class="invitePoster">
            <p slot="header">
                <span>{{$t('invite.downloadTitle')}}</span>
            </p>
            <div>
                <img v-if="loading" src="../../assets/images/loading.gif" style=" width: 100px;margin: 200px;"><!--posterBigBg-->
                <img v-else :src="picConcatUrl" alt="">
            </div>
            <!--合成之后画出的canvas-->
            <div v-show="false" class="myCanvas-box">
                <canvas id="myCanvas" width="360" height="534"></canvas>
            </div>
            <!--需要合成的组成部分-->
            <div v-show="false" id="box" class="poster-pic">
                <canvas class="ewm" id="canvas" ref="canva"></canvas>
                <img src="../../assets/images/C.png" v-if="currentLanguage=='zh'">
                <img src="../../assets/images/K.png" v-if="currentLanguage=='ko'">
                <img src="../../assets/images/J.png" v-if="currentLanguage=='ja'">
                <img src="../../assets/images/E.png" v-if="currentLanguage=='en' || currentLanguage=='ru'">
            </div>
            <div v-show="false">
                <canvas id="bigPoster" width="1080" height="1603"></canvas>
            </div>
            <div slot="footer">
                <span @click="saveImg">{{$t('invite.download')}}</span>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Clipboard from 'clipboard';
    import QRCode from 'qrcode';
    import $ from 'jquery';

    const copyLink = new Clipboard('.copyLink');
    const copyCode = new Clipboard('.copyCode');
    export default {
        name: 'invite',
        data() {
            return {
                invitePoster: false,//海报modal,
                vipGrade: 0,
                location: '',
                inviteCode: '',
                inviteList: [],
                profitList: [],
                totalProfit: 0,
                count: 0,
                pageSizeSet: 10,//每页条数
                pageNum: 1, //当前页
                tab: 1,
                inviteLink: '',//邀请链接
                posterBg: '',
                posterzh: require('../../assets/images/C.png'),
                posteren: require('../../assets/images/E.png'),
                posterko: require('../../assets/images/K.png'),
                posterja: require('../../assets/images/J.png'),
                loading: false,
                picConcatUrl: '',
                bigPosterUrl: '',
                currentLanguage: this.$store.state.language,
                invitePic: true,//右侧广告位
            }
        },
        created() {
            this.location = location.host;
            //获取邀请码
            if (JSON.parse(localStorage.getItem('userInfo')).inviteCode && JSON.parse(localStorage.getItem('userInfo')).inviteCode != '') {
                this.inviteCode = JSON.parse(localStorage.getItem('userInfo')).inviteCode;
                this.inviteLink = 'https://elechash.com/#/user/register?code=' + this.inviteCode
            } else {
                this.$inviteCode({cancel: 'inviteCode'}, res => {
                    if (res.code == 0) {
                        this.inviteCode = res.data.inviteCode;
                        this.inviteLink = 'https://elechash.com/#/user/register?code=' + this.inviteCode
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
            }
        },
        mounted() {
            this.get_inviteCodeList(1)
            this.useqrcode()
            this.turnImg()
            this.picOver()
            window.addEventListener('setLanguage', () => {
                this.currentLanguage = localStorage.getItem('language')
            })
            setTimeout(() => { // 设置定时器，防止合成图片未加载完成
                this.turnPic()
                this.turnBigPoster()
            }, 1000)
            this.picOverBig()
        },
        methods: {
            copyHint(text) {
                this.$Message.success(this.$t('invite.copyTip[0]'));
            },
            get_inviteCodeList(type) {
                let params = {
                    cancel: 'inviteList',
                    type: type,
                    pageNum: this.pageNum,
                    pageSize: this.pageSizeSet
                }
                this.$inviteList(params, res => {
                    if (res.code == 0) {
                        this.count = res.data.count
                        if (type == 1) {
                            this.inviteList = res.data.inviteList
                        } else {
                            this.profitList = res.data.profitList
                            this.totalProfit = res.data.totalProfit
                        }
                    } else {
                        this.$Message.error(res.msg)
                    }
                })
            },
            // 生成二维码
            useqrcode() {
                let canvas = document.getElementById('canvas')
                QRCode.toCanvas(canvas, this.inviteLink, function (error) {
                    if (error) console.error(error)
                    console.log('success!')
                })
            },
            // 合成海报图片
            picOver() {
                let _this = this
                let canvas = document.getElementById('myCanvas');
                let context = canvas.getContext('2d');
                context.globalCompositeOperation = "destination-over"; // 设置canvas层级
                context.font = "12px Microsoft YaHei";
                context.fillStyle = "#f2c36a"
                context.fillText(this.inviteCode, 128, 256)
                let img1 = new Image()
                let img2 = new Image()
                //处理跨域
                img1.crossOrigin = 'anonymous'
                img2.crossOrigin = 'anonymous'
                img1.src = this.imgUrl
                if (this.currentLanguage == 'zh') {
                    img2.src = this.posterzh
                } else if (this.currentLanguage == 'en' || this.currentLanguage == 'ru') {
                    img2.src = this.posteren
                } else if (this.currentLanguage == 'ko') {
                    img2.src = this.posterko
                } else if (this.currentLanguage == 'ja') {
                    img2.src = this.posterja
                }

                img2.onload = function () {
                    context.drawImage(img2, 0, 0, 360, 534)
                }
                img1.onload = function () {
                    context.clearRect(0, 0, 360, 534)
                    context.font = "12px Microsoft YaHei";
                    context.fillStyle = "#f2c36a"
                    context.fillText(_this.inviteCode, 158, 272)
                    context.drawImage(img1, 140, 284, 78, 78)
                }
            },
            // 合成下载海报图片
            picOverBig() {
                let _this = this
                let canvas = document.getElementById('bigPoster');
                let context = canvas.getContext('2d');
                canvas.style.letterSpacing = '4px'
                context.globalCompositeOperation="destination-over" // 设置canvas层级
                context.font = "600 30px Microsoft YaHei";
                context.fillStyle="#21fefe"
                context.strokeStyle = "#21fefe"
                context.fillText(this.inviteCode, 128, 256)
                let img1 = new Image()
                let img2 = new Image()
                //处理跨域
                img1.crossOrigin = 'anonymous'
                img2.crossOrigin = 'anonymous'
                img1.src = this.imgUrl
                if (this.currentLanguage == 'zh') {
                    img2.src = this.posterzh
                } else if (this.currentLanguage == 'en' || this.currentLanguage == 'ru') {
                    img2.src = this.posteren
                } else if (this.currentLanguage == 'ko') {
                    img2.src = this.posterko
                } else if (this.currentLanguage == 'ja') {
                    img2.src = this.posterja
                }

                img2.onload = function () {
                    context.drawImage(img2, 0, 0, 1080, 1603)
                }
                img1.onload = function () {
                    context.clearRect(0, 0, 1080, 1603)
                    context.font = "600 30px Microsoft YaHei";
                    context.fillStyle = "#f2c36a"
                    context.fillText(_this.inviteCode, 480, 820)
                    context.drawImage(img1, 430, 860, 220, 220)
                }
            },
            // 二维码canvas转IMG
            turnImg() {
                this.loading = true
                let mycans = $('canvas')[1]
                this.imgUrl = this.convertCanvasToImage(mycans).src
            },
            // 合成图转img
            turnPic() {
                this.loading = false
                let concatImg = $('canvas')[0]
                this.picConcatUrl = this.convertCanvasToImage(concatImg).src
            },
            // 大海报转图片
            turnBigPoster () {
                let mycans = document.getElementById('bigPoster')
                this.bigPosterUrl = this.convertCanvasToImage(mycans).src
            },
            // 下载图片
            saveImg() {
                let alink = document.createElement("a");
                alink.href = this.bigPosterUrl;
                alink.download = "elechash_invite_pic"; //图片名
                alink.click();
                this.invitePoster = false
            },
            // 转图片
            convertCanvasToImage(canvas) {
                let image = new Image();
                image.src = canvas.toDataURL("image/png");
                this.loading = false
                return image;
            },
            //展示海报
            showPoster() {
                this.invitePoster = true
                this.loading = true
                this.picOver()
                this.picOverBig()
                setTimeout(() => { // 设置定时器，防止合成图片未加载完成
                    this.turnPic()
                    this.turnBigPoster()
                }, 500)
            },
            changeTab(tab) {
                this.tab = tab
                this.pageNum = 1
                this.get_inviteCodeList(tab)
            },
            //切换页数
            change_page(current) {
                this.pageNum = current
                this.get_inviteCodeList(this.tab)
            },
        }
    }
</script>

<style lang="less" scoped>

    .invite {
        padding-bottom: 50px;
        position: relative;
        // min-width: 1840px;
        > div {
            background: #ffffff;
            width: 1200px;
            margin: auto;
            .title {
                height: 42px;
                line-height: 41px;
                padding-left: 14px;
                font-size: 16px;
                color: #808080;
                background: #ffffff;
                margin-bottom: 2px;
                font-family: SourceHanSansCN-Regular;
                border-bottom: 1px solid #ededed;
            }
        }

        .top {
            .con {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px 15px 58px 15px;

                > div {
                    &:nth-child(2) {
                        margin: 0 50px;
                    }

                    > p {
                        height: 36px;
                        line-height: 35px;
                        font-size: 15px;
                        color: #808080;
                    }

                    > div {
                        border: 1px solid #808080;
                        border-radius: 5px;
                        padding: 10px 18px;
                        font-size: 16px;
                        color: #FF6005;

                        &:nth-child(2) {
                            cursor: pointer;
                        }

                        span {
                            &:nth-child(1) {
                                display: inline-block;
                                height: 18px;
                                line-height: 18px;
                                border-right: 1px solid #808080;
                                color: #545454;
                                padding-right: 15px;
                                margin-right: 15px;
                            }

                            &:nth-child(2) {
                                cursor: pointer;
                                color: #FF6005;
                            }
                        }
                    }
                }
            }
        }

        .invitePic {
            // margin: 40px auto;
            background: #ededed;
            text-align: center;
            position: absolute;
            right: -320px;
            top: 170px;
            width: 320px;
            img{
                width: 320px;

            }
            button{
                width: 25px;
                height: 25px;
                position: absolute;
                right: 0;
                top: 0;
                cursor: pointer;
            }
        }

        .vip {
            background: #ededed;

            .header {
                height: 56px;
                line-height: 55px;
                color: #808080;
                font-size: 16px;
                padding-left: 14px;
            }

            .con {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 30px 0 60px 0;
            }

            .item {
                width: 254px;
                height: 329px;
                background: url('../../assets/images/no-vip.png') no-repeat center center;
                position: relative;

                button {
                    font-size: 16px;
                    color: #808080;
                    position: absolute;
                    bottom: 61px;
                    left: 76px;
                }
            }

            .item.vip1 {
                background: url('../../assets/images/vip1.png') no-repeat center center;

                button {
                    color: #fff;
                }
            }

            .item.vip2 {
                background: url('../../assets/images/vip2.png') no-repeat center center;

                button {
                    color: #fff;
                }
            }

            .item.vip3 {
                background: url('../../assets/images/vip3.png') no-repeat center center;

                button {
                    color: #fff;
                }
            }

            .item.vip4 {
                background: url('../../assets/images/vip4.png') no-repeat center center;

                button {
                    color: #fff;
                }
            }

            .item.vip5 {
                background: url('../../assets/images/vip5.png') no-repeat center center;

                button {
                    color: #fff;
                }
            }
        }

        .middle {
            margin: 40px auto;

            > div {
                &:nth-child(1) {
                    display: flex;
                    align-items: center;
                    justify-content: start;
                    padding: 0 15px;
                    border-bottom: 1px solid #ededed;
                    span {
                        padding: 0 5px;
                        cursor: pointer;
                        margin-right: 15px;
                    }

                    .active {
                        color: #ff6005;
                        border-bottom: 2px solid #ff6005;
                    }
                }

                > div {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 15px;
                    border-bottom: 1px solid #ededed;
                    span {
                        display: inline-block;
                        width: 180px;
                        height: 39px;
                        line-height: 38px;
                        text-align: left;
                    }
                }
            }

            .nav span {
                font-size: 14px;
                color: #b3b3b3;
            }

            .item span {
                font-size: 15px;
                color: #545454
            }

            .remark {
                display: block;
                border-bottom: none;
                height: 38px;
                color: #b3b3b3;
                font-size: 14px;
                line-height: 37px;
                text-align: right;
            }
        }

        .bottom {
            margin-bottom: 0;

            .con {
                padding: 30px 15px;
                line-height: 32px;
                font-size: 15px;
                color: #545454;
            }
        }
    }
</style>
