<template>
    <div class="forget">
        <div class="box">
            <div class="header">
                <div class="title">{{$t('forget.title')}}</div>
                <img src="../../assets/images/line.png" alt="">
            </div>
            <div class="content">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" v-if="next">
                    <FormItem prop="userPwd">
                        <input type="password" v-model="formValidate.userPwd" id="pwd"
                               :placeholder="$t('register.pleasePassword')">
                    </FormItem>
                    <FormItem prop="rePassword">
                        <input type="password" v-model="formValidate.rePassword" :placeholder="$t('register.regPassword')"
                               @keyup.enter="register">
                    </FormItem>
                    <Button type="primary" shape="circle" @click.prevent="register">{{$t('forget.submit')}}</Button>
                </Form>
                <Form ref="formAccount" :model="formAccount" :rules="ruleAccount" v-if="!next"
                      @keydown.native.enter.prevent="submit">
                    <FormItem prop="account">
                        <input v-model="formAccount.account" :placeholder="$t('login.pleaseAccount')">
                    </FormItem>
                    <Button type="primary" shape="circle" @click.prevent="submit">{{$t('forget.next')}}</Button>
                </Form>
                <p>{{$t('forget.hint')}}</p>
            </div>
        </div>
        <!-- <Modal v-model="showCode" width="500" class="vertical-center-modal" @on-cancel="showCode=false;code=''">
            <div v-if="!isBindGoogle">
                <p>请输入您的账户 {{formAccount.account}} 收到的验证码</p>
                <p>邮箱验证码可能被判定为垃圾邮件，请注意查收</p>
                <Input v-model='code' ref='re' :placeholder="$t('public.code')" @keyup.native.enter="forgetVerify"/>
            </div>

            <div v-if="isBindGoogle">
                <p>请输入谷歌验证码</p>
                <Input v-model='code' :placeholder="$t('public.code')" ref='re' @keyup.native.enter="forgetVerify"/>
            </div>
            <div>
                <Button size="large" class="footer" long @click="forgetVerify">确定</Button>
            </div>
        </Modal> -->

        <!-- 验证码 -->
        <Modal v-model="showCode" width="601" class="code" @on-cancel="showCode=false; code=''" :mask-closable='false'>
            <p slot="header" style="text-align:center">
                <span>{{$t('login.codeTitle')}}</span>
                <img src="../../assets/images/line.png" alt="">
                <Icon type="md-close" @click="showCode=false"/>
            </p>
             <div v-if="!isBindGoogle">
                <Input v-model='code' :placeholder="$t('login.emailCode')" ref='re' @keyup.enter.native="forgetVerify" style="width:245px;"/>
                <button v-if="s>0">{{s}}</button>
                <button @click="startDown" v-else>{{$t('login.getCode')}}</button>
            </div>
            <!-- <p>请输入谷歌验证码</p> -->
            <div v-if="isBindGoogle">
                <Input v-model='code' :placeholder="$t('login.GACode')" ref='re' @keyup.enter.native="forgetVerify" style="width:365px;"/>
            </div>
            <button @click="forgetVerify" :style="{'width':'365px'}">{{$t('control.confirm')}}</button>
        </Modal>
    </div>
</template>
<script>
    import { check_password } from "../../common";
    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('register.errorPassword[1]')));
                } else {
                    if (!check_password(value)) {
                        callback(new Error(this.$t('register.errorAccount[2]')));
                    }
                    if (this.formValidate.rePassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formValidate.validateField('rePassword');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('register.errorPassword[1]')));
                } else if (value !== this.formValidate.userPwd) {
                    callback(new Error(this.$t('register.errorPassword[0]')));
                } else {
                    callback();
                }
            };
            return {
                code: '', //邮箱验证码
                formValidate: {
                    userPwd: '',
                    rePassword: '',//重复密码
                },
                formAccount: {
                    account: '',
                },
                ruleValidate: {
                    userPwd: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    rePassword: [
                        {validator: validatePassCheck, trigger: 'blur'}
                    ],
                },
                ruleAccount: {
                    account: [
                        { required: true, message: this.$t('register.errorAccount[1]'), trigger: "blur" },
                        { type: "email", message: this.$t('register.errorAccount[0]'), trigger: "blur" }
                    ],
                },
                showCode: false,
                token: '',
                next: false,
                isBindGoogle: false,
                s: 120,
                isClick: true,
            }
        },
        methods: {
            //倒计时
            startDown(){
                this.grecaptcha().then((token)=>{
                    this.$getEmailCode({email:this.formAccount.account,recaptchaCode: token},res=>{
                        if(res.code == 0){
                            this.countDown();
                            this.s = 120;
                        }else{
                            this.$Message.error(res.msg);
                        }
                    });
                })
            },
            submit() {
                this.$refs.formAccount.validate((valid) => {
                    if (valid) {
                        this.next = true;
                        setTimeout(() => {
                            document.getElementById("pwd").focus();
                        }, 100)
                    }
                })
            },
            register() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.grecaptcha().then((token)=>{
                            let data = {
                                userName: this.formAccount.account,
                                newPassword: this.formValidate.rePassword,
                                recaptchaCode: token,
                            }
                            this.$resetPassword(data, res => {
                                if (res.code == 0) {
                                    this.token = res.data.tempToken;
                                    this.showCode = true;
                                    this.isBindGoogle = res.data.isBindGACode;
                                    if(!this.isBindGoogle) {
                                        this.countDown();
                                    }
                                    setTimeout(() => {
                                        if (this.showCode) {
                                            this.$refs['re'].focus();
                                        }
                                    }, 100);
                                } else {
                                    this.$Message.error(this.$t('errCode')[res.code]);
                                }
                            });
                        })
                    }
                })
            },
            //验证忘记密码
            forgetVerify() {
                this.grecaptcha().then((token)=>{
                    let data = {
                        recaptchaCode: token,
                        code: this.code,
                        tempToken: this.token
                    }
                    this.$resetPasswordVerify(data, res => {
                        if (res.code == 0) {
                            this.showCode = false;
                            this.$router.push({path: `/user/${'login'}`});
                        } else {
                            this.$Message.error(this.$t('errCode')[res.code]);
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
        }
    }
</script>
<style lang="less" scoped>
    .forget {
        background: radial-gradient(circle, rgba(0, 34, 80, 1), rgba(10, 10, 10, 1), rgba(38, 38, 38, 1));
        padding: 66px !important;

        .box {
            width: 767px;
            height: 477px;
            background: rgba(255, 255, 255, 1);
            box-shadow: -7px 6px 9px 1px rgba(8, 22, 63, 0.53);
            border-radius: 10px;
            margin: auto;
            .header {
                text-align: center;
                padding-top: 61px;

                .title {
                    height: 48px;
                    font-size: 30px;
                    text-align: center;
                    font-family: SourceHanSansCN-Medium;
                    color: rgba(255, 96, 5, 1);
                    line-height: 48px;
                    margin: auto;
                    font-weight: 500;
                    letter-spacing: 2px;
                }
            }

            .content {
                width: 445px;
                text-align: center;
                margin: auto;
                height: calc(100% - 107px);
                position: relative;
                padding-top: 41px;
                input {
                    width: 288px;
                    height: 35px;
                    background: #fff;
                    border: 1px solid #FF4B2B;
                    border-radius: 2px;
                    padding: 0 10px;
                }

                button {
                    width: 135px;
                    border-color: rgba(33, 33, 33, 1);
                    height: 43px;
                    background: rgba(33, 33, 33, 1);
                    border-radius: 20px;
                    color: #ffffff;
                    position: absolute;
                    bottom: 168px;
                    left: calc(50% - 68px);
                }
                p{
                    position: absolute;
                    bottom: 36px;
                    font-size: 12px;
                    font-family: SourceHanSansCN-Regular;
                    font-weight: 400;
                    width: 100%;
                }
            }
        }
    }
    .footer{
        margin-top: 20px;
    }
</style>