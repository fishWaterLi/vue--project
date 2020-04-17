<template>
    <div class="register1">
        <div>
            <div class="title">{{$t('register.title')}}</div>
            <!-- <div class="register-way">
              <span @click="isEmail=true">{{$t('public.emailWay')}}</span>
              <span @click="isEmail=false">{{$t('public.mobileWay')}}</span>
            </div> -->
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" v-if="!showCode">
                <FormItem prop="email" v-if="isEmail">
                    <input v-model="formValidate.email" :placeholder="$t('register.pleaseAccount')">
                </FormItem>
                <FormItem prop="phone" v-else>
                    <input v-model="formValidate.phone" :placeholder="$t('register.mobile')">
                </FormItem>
                <FormItem prop="userPwd">
                    <input type="password" v-model="formValidate.userPwd" :placeholder="$t('register.pleasePassword')">
                </FormItem>
                <FormItem prop="rePassword">
                    <input type="password" v-model="formValidate.rePassword" :placeholder="$t('register.regPassword')">
                </FormItem>
                <FormItem prop="inviteCode">
                    <input type="text" v-model="formValidate.inviteCode" :placeholder="$t('register.inviteCode')">
                </FormItem>
                <!-- <FormItem prop="inviteCode">
                    <input v-model="formValidate.inviteCode" :placeholder="$t('register.inviteCode')">
                </FormItem> -->
                <div class="agree">
                    <div>
                        <Checkbox v-model="agree">{{$t('register.agree')}}</Checkbox>
                        <span @click.prevent="toRead" class="link">{{ $t('register.waiter')}}</span>
                    </div>
                    <p v-if="showAgree">{{$t('register.errorAgree')}}</p>
                </div>
            </Form>
            <div v-if="showCode" class="showCode-r code">
                <p v-if="isEmail">{{$t('register.tip[0]')}} {{formValidate.email }}{{$t('register.tip[1]')}}</p>
                <p v-else>请输入您的手机 {{formValidate.phone }} 收到的验证码</p>
                <p>{{$t('register.tip[2]')}}</p>
                <div>
                    <Input v-model='code' :placeholder="$t('register.emailCode')" ref='re' @keyup.native.enter="registerVerify" style="width:200px; margin-top: 30px"/>
                    <button v-if="s>0">{{s}}</button>
                    <button @click="startDown" v-else>{{$t('login.getCode')}}</button>
                </div>
            </div>
            <div class="poin">
                <Button type="primary" shape="circle" @click.prevent="registerCommit">{{$t('register.title')}}</Button>
                <p v-if="!showCode" >
                    {{$t('register.hasAccount')}} <em @click="goLogin">{{$t('register.toLogin')}}</em>
                </p>
            </div>
        </div>
        <!--<div v-show="closeAuth" @click="closeAuth = false" class="gooleAuth">
                  <vue-recaptcha
                          class="recapth"
                          ref="recaptcha"
                          @verify="onVerify"
                          @expired="onExpired"
                          sitekey="6LfGW58UAAAAAKTjGzBoaGB2gjm71-3TeWQAO7jz">
                  </vue-recaptcha>
        </div>-->
    </div>
</template>
<script>
    // import VueRecaptcha from 'vue-recaptcha';
    import { check_email, check_phone, check_password } from "../../common";
    import { mapState,mapMutations } from 'vuex'
    export default {
        name: "register",
        components: {
            // VueRecaptcha,
        },
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.$t('register.errorPassword[1]')));
                } else {
                    if (!check_password(value)) {
                        callback(new Error(this.$t('register.errorAccount[2]')));
                    }
                    if (this.formValidate.rePassword !== "") {
                        // 对第二个密码框单独验证
                        this.$refs.formValidate.validateField("rePassword");
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error(this.$t('register.errorPassword[1]')));
                } else if (value !== this.formValidate.userPwd) {
                    callback(new Error(this.$t('register.errorPassword[0]')));
                } else {
                    callback();
                }
            };
            const inviteCodeCheck = (rule, value, callback) => {
                if (value === "" || value===undefined) {
                    callback(new Error(this.$t('register.errorInviteCode')));
                } else {
                    callback();
                }
            };
            return {
                closeAuth: false,
                isEmail: true,
                tempToken: "", //注册验证token
                showCode: false,
                code: "", //验证码
                showAgree: false,
                agree: false, //同意条款
                formValidate: {
                    email: "",
                    phone: "",
                    userPwd: "",
                    rePassword: "", //重复密码
                    invite: "", //邀请码
                    inviteCode: "", //邀请码
                },
                ruleValidate: {
                    email: [
                        { required: true, message: this.$t('register.errorAccount[1]'), trigger: "blur" },
                        { type: "email", message: this.$t('register.errorAccount[0]'), trigger: "blur" }
                    ],
                    phone: [
                        { required: true, message: "Phone cannot be empty", trigger: "blur" }
                    ],
                    userPwd: [{ validator: validatePass, trigger: "blur" }],
                    rePassword: [{ validator: validatePassCheck, trigger: "blur" }],
                    inviteCode: [{ validator: inviteCodeCheck, trigger: "blur" }],
                },
                s: 120,
                isClick: true,
                inviteSwitch: true,
            };
        },
        watch: {
            agree(newVal,oldVal) {
                if(!newVal){
                    this.showAgree = true;
                }else{
                     this.showAgree = false;
                }
            }
        },
        mounted() {
            this.getStatus();
        },
         computed:{
            currentLanguage(){
                return this.$store.state.language
            }
        },
        methods: {
            getStatus() {
                this.$inviteSwitch('',res=>{
                    if(res.code == 0){
                            this.inviteSwitch = res.data.status;
                            if(this.inviteSwitch) {
                                this.formValidate.inviteCode = this.$route.query.code;
                            }else{
                                this.formValidate.inviteCode = '';
                            }
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            toRead() {
                let url = '';
                if(this.currentLanguage=='zh'){
                    url = 'https://elechash.zendesk.com/hc/zh-cn/articles/360033172894'
                }else if(this.currentLanguage=='ja'){
                    url = 'https://elechash.zendesk.com/hc/ja/articles/360033172894'
                }else if(this.currentLanguage=='ko'){
                    url = 'https://elechash.zendesk.com/hc/ko/articles/360033172894'
                }else if(this.currentLanguage=='en'){
                    url = 'https://elechash.zendesk.com/hc/en-gb/articles/360033172894'
                }else{
                    url = 'https://elechash.zendesk.com/hc/ru/articles/360033172894'
                }
                window.open(url,'_blank')
            },
            //倒计时
            startDown(){
                this.grecaptcha().then((token)=>{
                    let data = {
                        email: this.isEmail ? this.formValidate.email : param.phone = this.formValidate.phone,
                        recaptchaCode: token
                    }
                    this.$getEmailCode(data,res=>{
                        if(res.code == 0){
                            this.countDown();
                            this.s = 120;
                        }else{
                            this.$Message.error(res.msg);
                        }
                    });
                })
            },
            goLogin() {
                this.formValidate = {}
                this.$router.push(`/user/${'login'}`)

            },
            registerCommit() {
                const _this = this;
                if(this.showCode){
                    this.registerVerify();
                }else{
                    this.agree==false?this.showAgree = true:this.showAgree = false;
                    _this.$refs.formValidate.validate(valid => {
                        if (valid&&_this.agree) {
                            this.grecaptcha().then((token)=>{
                                this.agree==false?this.showAgree = true:this.showAgree = false;
                                let param = {
                                    userPwd: _this.formValidate.userPwd,
                                    inviteCode: _this.formValidate.inviteCode,
                                    recaptchaCode: token
                                };
                                _this.isEmail ? (param.email = _this.formValidate.email) : (param.phone = _this.formValidate.phone);
                                if (_this.isEmail) {
                                    this.$emailRegister(param, res => {
                                        if (res.code == 0) {
                                            this.countDown();
                                            _this.tempToken = res.data.tempToken;
                                            _this.showCode = true;
                                        } else {
                                            this.$Message.error(res.msg);
                                        }
                                    });
                                } else {
                                    this.$phoneRegister(param, res => {
                                        if (res.code == 0) {
                                            _this.tempToken = res.data.tempToken;
                                            _this.showCode = true;
                                        } else {
                                            this.$Message.error(res.msg);
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
            },
            registerVerify() {
                const _this = this;
                let param = {
                    tempToken: _this.tempToken,
                    code: _this.code
                };
                if(_this.isEmail){
                    this.$emailRegisterVerify(param, res => {
                        if (res.code == 0) {
                            _this.showCode = false;
                            _this.$router.push(`/user/${'login'}`);
                        } else {
                            _this.$Message.error(res.msg);
                        }
                    });
                }else{
                    this.$phoneRegisterVerify(param, res => {
                        if (res.code == 0) {
                            _this.showCode = false;
                           _this.$router.push(`/user/${'login'}`);
                        } else {
                            _this.$Message.error(res.msg);
                        }
                    });
                }
            },
            cancel() {
                this.showCode = false;
                this.code =''
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
            ...mapMutations(['changeLoginFlag'])
        }
    };
</script>
<style lang="less">
    .register1{
        >div{
            background: #fff;
            >.title{
                font-size: 28px;
                height: 29px;
                line-height: 29px;
                color: #FF6005;
                margin-bottom: 19px;
                text-align: center;
            }
            >form{
                text-align: center;
                .ivu-form-item{
                    text-align: left;
                    margin-bottom: 23px;
                    &:nth-child(4){
                        margin-bottom: 0;
                    }
                    &:nth-child(5){
                        margin-bottom: 13px;
                    }
                    input{
                        width: 300px;
                        height: 35px;
                        border-radius: 2px;
                        border: 1px solid #FF6005;
                        padding: 0 15px;
                        font-size: 14px;
                    }
                    .ivu-checkbox-group{
                        height: 26px;
                    }
                }
                .agree{
                    position: relative;
                    margin-top: 20px;
                    >div{
                        // display: flex;
                        // align-items: center;
                        // justify-content: flex-start;
                        padding-top: 5px;
                        text-align: left;
                        margin-bottom: 10px;
                        label{
                            // width: 200px;
                            margin: 0;
                        }
                        span{
                            cursor: pointer;
                        }
                    }
                    
                    >p{
                        position: absolute;
                        bottom: -20px;
                        color: #ed4014;
                    }
                }
            }
            .poin{
                text-align: center;
                .ivu-btn,.ivu-btn-primary{
                    margin-top: 15px;
                    // margin-bottom: 20px;
                    background-color: #FF6005;
                    border-color: #FF6005;
                    width: 178px;
                    height: 43px;
                    font-size: 16px;
                }
                >p{
                    height: 16px;
                    line-height: 16px;
                    color: #808080;
                    text-align: center;
                    font-weight: 600;
                    margin-top: 3px;
                    a{
                        color: #FF4B2B;
                    }

                    em{
                        color: #FF6005;
                        cursor: pointer;
                    }
                }
            }
            .showCode-r{
                margin-top: 38px;
                margin-bottom: 86px;
                >p{
                    font-size:12px;
                    font-family:SourceHanSansCN-Medium;
                    text-align: center;
                    &:nth-child(1){
                        color: #545454;
                    }
                    &:nth-child(2){
                        color: #FF6005;
                    }
                }
                >div{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    >button{
                        margin: 30px 0 0 10px;
                        width: 91px;
                        height: 35px;
                        line-height: 35px;
                        border-radius: 3px;
                        background: #eeeeee;
                        color: #808080;
                        font-size:14px;
                        font-family:SourceHanSansCN-Normal;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
