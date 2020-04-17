<template>
    <div class="user-login">
        <div class="container" id="container" :class="{'right-panel-active': loginFlag}">
            <div class="form-container sign-up-container">
                <register></register>
            </div>
            <div class="form-container sign-in-container">
                <login></login>
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <img src="../../assets/images/register.png" alt="">
                    </div>
                    <div class="overlay-panel overlay-right">
                        <img src="../../assets/images/register.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import login from './login'
    import register from './register'
    export default {
        name: 'user',
        components: {
            login,
            register
        },
        data() {
            return {
            }
        },
        computed: {
            loginFlag() {
                if(this.$route.params.name=='login') {
                    return false
                }else{
                    return true
                }
            }
        },
        methods: {
        }
    }
</script>
<style lang="less" scoped>
    .user-login {
        height: 100vh !important;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url("../../assets/images/bg.png") no-repeat center center;
        background-size: cover;
        .container {
            border-radius: 10px;
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
            position: relative;
            overflow: hidden;
            width: 767px;
            min-height: 477px;
        }

        .form-container {
            position: absolute;
            top: 0;
            height: 100%;
            transition: all 0.6s ease-in-out;
            padding: 58px 42px 24px 42px;
            background-color: #fff;
        }

        .sign-in-container {
            left: 0;
            width: 50%;
            z-index: 2;
        }

        .right-panel-active .sign-in-container {
            transform: translateX(100%);
        }

        .sign-up-container {
            left: 0;
            width: 50%;
            opacity: 0;
            z-index: 1;
        }

        .right-panel-active .sign-up-container {
            transform: translateX(100%);
            opacity: 1;
            z-index: 5;
            animation: show 0.6s;
        }

        @keyframes show {
            0%, 49.99% {
                opacity: 0;
                z-index: 1;
            }

            50%, 100% {
                opacity: 1;
                z-index: 5;
            }
        }

        .overlay-container {
            position: absolute;
            top: 0;
            left: 50%;
            width: 50%;
            height: 100%;
            overflow: hidden;
            transition: transform 0.6s ease-in-out;
            z-index: 100;
        }

        .right-panel-active .overlay-container {
            transform: translateX(-100%);
        }

        .overlay {
            // background: #FF416C;
            // background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
            // background: linear-gradient(to right, #FF4B2B, #FF416C);
            background: -webkit-linear-gradient(to right, #000000, #000000);
            background: linear-gradient(to right, #000000, #000000);
            /*background:radial-gradient(circle,rgba(0,34,80,1),rgba(10,10,10,1),rgba(38,38,38,1));*/
            background: #000000;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: 0 0;
            color: #FFFFFF;
            position: relative;
            left: -100%;
            height: 100%;
            width: 200%;
            transform: translateX(0);
            transition: transform 0.6s ease-in-out;
        }

        .right-panel-active .overlay {
            transform: translateX(50%);
        }

        .overlay-panel {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            // padding: 0 40px;
            text-align: center;
            top: 0;
            height: 100%;
            width: 50%;
            transform: translateX(0);
            transition: transform 0.6s ease-in-out;

            > img {
                width: 100%;
                height: 100%;
            }

            > button {
                position: absolute;
            }

            .ewm-left, .ewm-right {
                position: absolute;
                width: 114px;
                height: 117px;
                top: 35%;
                left: 15%;
            }
        }

        .overlay-left {
            transform: translateX(-20%);
        }

        .right-panel-active .overlay-left {
            transform: translateX(0);
        }

        .overlay-right {
            right: 0;
            transform: translateX(0);
        }

        .right-panel-active .overlay-right {
            transform: translateX(20%);
        }
    }
</style>

