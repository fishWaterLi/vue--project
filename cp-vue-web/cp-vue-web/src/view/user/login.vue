<template>
    <div class="login1">
        <div>
            <div class="title">{{$t('login.title')}}</div>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" v-if="!showCode">
                <FormItem prop="email" v-if="isEmail">
                    <input v-model="formValidate.email" :placeholder="$t('login.pleaseAccount')">
                </FormItem>
                <FormItem prop="phone" v-else>
                    <input v-model="formValidate.phone" :placeholder="$t('login.pleaseAccount')">
                </FormItem>
                <FormItem prop="userPwd">
                    <input type="password" v-model="formValidate.userPwd" :placeholder="$t('login.pleasePassword')"
                           @keyup.enter="login">
                </FormItem>

            </Form>
            <div v-if="showCode" class="showCode code">
                <div v-if="!isBindGoogle">
                    <Input v-model='code' :placeholder="$t('login.emailCode')" ref='re' @keyup.native.enter="loginVerify"
                           style="width:200px;margin-top: 20px"/>
                    <button v-if="s>0">{{s}}</button>
                    <button @click="startDown" v-else>{{$t('login.getCode')}}</button>
                </div>
                <div v-if="isBindGoogle">
                    <!-- <p>请输入谷歌验证码</p> -->
                    <Input v-model='code' :placeholder="$t('login.GACode')" ref='re'
                           @keyup.native.enter="loginVerify"/>
                </div>
            </div>
            <div class="poin">
                <p class="forget" v-if="!showCode">
                    <router-link to="/forget">{{$t('login.forget')}}？</router-link>
                </p>
                <Button type="primary" shape="circle" @click.prevent="login">{{$t('login.title')}}</Button>
                <p>
                    <em>{{$t('login.noneAccount')}}</em><span @click="goRegister">{{$t('login.register')}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapMutations} from 'vuex'
    import { check_password } from "../../common";
    export default {
        name: 'login1',
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.$t('login.pleasePassword')));
                } else {
                    if (!check_password(value)) {
                        callback(new Error(this.$t('login.errorPassword[0]')));
                    }
                    callback();
                }
            };
            return {
                isEmail: true,
                code: '', //验证码
                isBindGoogle: false,
                formValidate: {
                    email: '',
                    phone: '',
                    userPwd: '',
                },
                ruleValidate: {
                    email: [
                        {required: true, message: this.$t('login.errorAccount[1]'), trigger: 'blur'},
                        {type: 'email', message: this.$t('login.errorAccount[0]'), trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: 'Phone cannot be empty', trigger: 'blur'}
                    ],
                    userPwd: [{ validator: validatePass, trigger: "blur" }],
                },
                showCode: false,
                token: '',
                s: 120,
                path: '/home',//需要跳转的路径
                isClick: true
            }
        },
        mounted() {
            if(localStorage.getItem('oldPath')){
                this.path = localStorage.getItem('oldPath');
            }
        },
        methods: {
            ...mapMutations(['changeLoginFlag','changeStatus']),
            // 获取验证码 倒计时
            startDown() {
                // 人机验证
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
            goRegister() {
                this.formValidate = {}
                this.$router.push(`/user/${'register'}`)
            },
            //提交登录
            login() {
                if (this.showCode) {
                    this.loginVerify();
                } else {
                    this.$refs.formValidate.validate((valid) => {
                        if (valid) {
                            let _this = this
                            this.grecaptcha().then((token)=>{
                                if (_this.isEmail) {
                                    let params = {
                                        email: _this.formValidate.email,
                                        userPwd: _this.formValidate.userPwd,
                                        recaptchaCode: token
                                    }
                                    _this.$emailLogin(params, res => {
                                        if (res.code == 0) {
                                            _this.countDown();
                                            _this.token = res.data.tempToken;
                                            _this.isBindGoogle = res.data.isBindGACode;
                                            _this.showCode = true;
                                            setTimeout(function () {
                                                if (_this.showCode) {
                                                    _this.$refs['re'].focus();
                                                }
                                            },100);
                                        } else {
                                            _this.$Message.error(res.msg);
                                        }
                                    })
                                } else {
                                    let params = {
                                        phone: _this.formValidate.phone,
                                        userPwd: _this.formValidate.userPwd,
                                        recaptchaCode: token
                                    }
                                    this.$phoneLogin(params, res => {
                                        if (res.code == 0) {
                                            _this.token = res.data.tempToken;
                                            _this.showCode = true;
                                            // 验证码输入框自动获取焦点
                                            setTimeout(function () {
                                                if (_this.showCode) {
                                                    _this.$refs['re'].focus();
                                                }
                                            }, 100);
                                        } else {
                                            _this.$Message.error(res.msg);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            },
            //验证登录
            loginVerify() {
                let params = {
                    tempToken: this.token,
                    code: this.code
                }
                if (this.isEmail) {
                    this.$emailLoginVerify(params, res => {
                        if (res.code == 0) {
                            this.changeStatus(true);
                            this.showCode = false;
                            this.setInfo(res.data.user, res.token);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    })
                } else {
                    this.$phoneLoginVerify(params, res => {
                        if (res.code == 0) {
                            this.changeStatus(true);
                            this.showCode = false;
                            this.setInfo(res.data.user, res.token);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    })
                }
            },
            setInfo(data, token) {
                // localStorage.setItem('userInfo', JSON.stringify(data));
                this.$setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('token', token);
                this.$router.push('/home');
            },
        },
    }
</script>
<style lang="less" scoped>
    .login1 {
        height: 100%;
        padding-top: 43px;
        > div {
            position: relative;
            height: 100%;

            > .title {
                font-size: 28px;
                height: 29px;
                line-height: 29px;
                color: #FF6005;
                margin-bottom: 19px;
                text-align: center;
            }

            > form {
                text-align: center;

                .ivu-form-item {
                    text-align: left;
                    margin-bottom: 30px;

                    &:nth-child(4) {
                        margin-bottom: 0;
                    }

                    &:nth-child(5) {
                        margin-bottom: 13px;
                    }

                    input {
                        width: 300px;
                        height: 35px;
                        border-radius: 4px;
                        border: 1px solid #FF6005;
                        padding: 0 15px;
                        font-size: 14px;
                    }

                    .ivu-checkbox-group {
                        height: 26px;
                    }
                }

            }

            .poin {
                text-align: center;

                .ivu-btn, .ivu-btn-primary {
                    margin-top: 20px;
                    margin-bottom: 10px;
                    background-color: #FF6005;
                    border-color: #FF6005;
                    width: 135px;
                    height: 43px;
                    font-size: 16px;
                    box-shadow: none;
                }

                > p {
                    height: 16px;
                    line-height: 16px;
                    color: #808080;
                    text-align: right;

                    a {
                        color: #FF4B2B;
                    }

                    em {
                        color: #FF6005;
                        cursor: pointer;
                    }

                    &:last-child {
                        width: 100%;
                        text-align: center;
                        position: absolute;
                        bottom: 13px;

                        em {
                            color: #808080;
                            font-weight: 600;
                        }

                        span {
                            color: #FF6005;
                            cursor: pointer;
                            font-weight: 600;
                        }
                    }
                }
            }

            .showCode {
                margin-top: 38px;
                margin-bottom: 86px;

                > div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    > button {
                        margin: 20px 0 0 10px;
                        width: 91px;
                        height: 32px;
                        line-height: 32px;
                        background: #fff;
                        border: 1px solid #FF4B2B;
                        border-radius: 4px;
                        color: #808080;
                        font-size: 14px;
                        font-family: SourceHanSansCN-Normal;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>

