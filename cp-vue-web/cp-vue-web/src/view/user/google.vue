<template>
    <div class="google">
        <div class="header">{{$t('google.title')}}</div>
        <div class="con">
            <div class="one">
                <div class="header">1，{{$t('google.download')}} Google Authenticator</div>
                <div>
                    <span><a href="https://apps.apple.com/jp/app/google-authenticator/id388497605" target="_blank">App Store</a></span>
                    <span v-if="currentLanguage=='zh'"><a href="https://shouji.baidu.com/software/22417419.html" target="_blank">百度手机助手</a> </span>
                    <span v-else><a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ja" target="_blank">google play</a></span>
                </div>
            </div>
            <div class="two">
                <div class="header">2，{{$t('google.qr')}}</div>
                <div>{{$t('google.tip')}}</div>
                <div>
                    <img :src="gaCodeUrl" alt="">
                    <p>{{$t('google.key')}}：{{secretCode}}</p>
                </div>
            </div>
            <Form :model="formValidate" :rules="ruleValidate">
                <p>{{$t('google.name')}}：{{userName}}</p>
                <FormItem prop="gaCode">
                    <Input v-model="formValidate.gaCode" :placeholder="$t('google.code')"
                           @keyup.enter.native="bindGoogleCode"/>
                </FormItem>
                <button @click.prevent="bindGoogleCode">{{$t('control.confirm')}}</button>
            </Form>
            <Modal v-model="showCode" width="500" class="code google" @on-cancel="showCode=false; code=''" :mask-closable='false'>
                <p slot="header" style="text-align:center">
                    <span>{{$t('google.bing')}}</span>
                    <Icon type="md-close" @click="showCode=false"/>
                    <img src="../../assets/images/line.png" alt="">
                </p>
                <div class="countdown">
                    <Input v-model='code' style="margin-top: 30px;width: 200px" :placeholder="$t('login.emailCode')"
                           ref='re' @keyup.enter.native="bindGoogleCodeVerify"/>
                    <button v-if="s>0">{{s}}</button>
                    <button @click="startDown" v-else>{{$t('login.getCode')}}</button>
                </div>

                <div>
                    <Button class="footer" size="large" long @click="bindGoogleCodeVerify" style="background:#212121;border-color:#212121;line-height:0;width:320px;margin-left:0">{{$t('google.bing')}}</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                secretCode: 'WEOIUAFNADFJAKOIKJ',
                gaCodeUrl: '',
                tempToken: '',
                showCode: false,
                code: '',
                userName: '',
                formValidate: {
                    gaCode: '',
                    email: ''
                },
                ruleValidate: {
                    gaCode: [
                        {required: true, message: this.$t('google.code'), trigger: "blur"}
                    ],
                },
                s: 120,
                isClick: true,
            }
        },
        computed:{
            currentLanguage(){
                return this.$store.state.language
            }
        },
        mounted() {
            this.getGoogleCode()
            this.userName = JSON.parse(localStorage.getItem('userInfo')).name
            this.formValidate.email = JSON.parse(localStorage.getItem('userInfo')).email
        },
        methods: {
            // 获取验证码 倒计时
            startDown() {
                this.grecaptcha().then((token)=>{
                    let data = {
                        email: this.formValidate.email,
                        recaptchaCode: token
                    }
                    this.$getEmailCode(data, res => {
                        if (res.code == 0) {
                            this.countDown();
                            this.s = 120;
                        } else {
                            this.$Message.error(res.msg);
                        }
                    });
                })
            },
            countDown () {
                if(this.isClick){
                    this.isClick = false
                    // 直接元素必须为button
                    let timer = setInterval(() => {
                        this.s--;
                        if (this.s < 1) {
                            this.isClick = true
                            clearInterval(timer);
                        }
                    }, 1000);
                }
            },
            getGoogleCode() {
                this.$getGaCode({}, (res) => {
                    this.secretCode = res.data.secretCode
                    this.gaCodeUrl = res.data.url
                })
            },
            bindGoogleCode() {
                this.grecaptcha().then((token)=>{
                    let param = {
                        gaCode: this.formValidate.gaCode,
                        recaptchaCode: token
                    }
                    this.$bindGaCode(param, (res) => {
                        if (res.code == 0) {
                            this.tempToken = res.data.tempToken;
                            this.showCode = true;
                            this.countDown();
                        } else {
                            this.$Message.error(res.msg);
                        }
                    })
                })
            },
            bindGoogleCodeVerify() {
                let param = {
                    code: this.code,
                    tempToken: this.tempToken
                }
                this.$bindGaCodeVerify(param, (res) => {
                    if (res.code == 0) {
                        this.showCode = false;
                        this.$store.commit('changeGoogle', true)
                        this.$router.push('/userInfo')
                    } else {
                        this.$Message.error(res.msg);
                    }
                })
            },
        }
    }
</script>
<style lang="less" scoped>
    .google {
        background: rgb(237,237,237,1);
        padding-top: 43px;

        > div {
            width: 1200px;
            margin: auto;
            background: #ffffff;
        }

        > .header {
            height: 40px;
            line-height: 39px;
            padding: 0 15px;
            margin-bottom: 2px;
            font-size: 16px;
            font-family: SourceHanSansCN-Regular;
            color: #FF6005 ;
        }

        .con {
            padding: 34px 0 51px 0;

            > div, > form {
                width: 499px;
                margin: auto;
            }

            > div {
                .header {
                    font-size: 14px;
                    font-family: SourceHanSansCN-Regular;
                    font-weight: 400;
                    color: rgba(84, 84, 84, 1);
                }
            }

            .one > div {
                &:nth-child(2) {
                    height: 100px;
                    line-height: 99px;

                    span {
                        display: inline-block;
                        width: 123px;
                        height: 36px;
                        line-height: 35px;
                        background: #bbbbbb;
                        color: #ffffff;
                        font-size: 14px;
                        border-radius: 3px;
                        text-align: center;
                        margin-right: 80px;
                        cursor: pointer;
                    }
                }
            }

            .two > div {
                padding-right: 100px;

                &:nth-child(2) {
                    margin-top: 15px;
                    font-size: 12px;
                    font-family: SourceHanSansCN-Light;
                    font-weight: 300;
                    color: rgba(179, 179, 179, 1);
                    line-height: 25px;
                }

                &:nth-child(3) {
                    img {
                        margin: 18px 0;
                        width: 100px;
                        height: 100px;
                    }

                    p {
                        font-size: 14px;
                        height: 16px;
                        line-height: 15px;
                        font-family: SourceHanSansCN-Regular;
                        font-weight: 400;
                        color: #FF6005;
                    }
                }
            }

            > form {
                margin-top: 60px;

                > p {
                    line-height: 40px;
                    font-size: 14px;
                    font-family: SourceHanSansCN-Regular;
                    font-weight: 400;
                    color: rgba(84, 84, 84, 1);
                }

                button {
                    margin-top: 31px;
                    width: 100%;
                    height: 35px;
                    line-height: 34px;
                    color: #ffffff;
                    text-align: center;
                    background: #212121;
                    border-radius: 3px;
                    font-size: 14px;
                    &:hover {
                        background: rgba(33, 33, 33, 0.856);
                    }
                }
            }
        }
    }

    .footer {
        margin-top: 20px;
        color: #fff;
        background-color: #025899;
        border-color: #025899;
    }

    .countdown {
        display: flex;
        align-items: center;
        justify-content: center;
        > button {
            margin: 30px 0 0 10px;
            width: 91px;
            height: 32px;
            line-height: 32px;
            background: #eeeeee;
            color: #808080;
            font-size: 14px;
            font-family: SourceHanSansCN-Normal;
            border-radius: 2px;
            cursor: pointer;
        }
    }
</style>


