<template>
  <button class="sendSmsBtn" :class="[disables ? 'dissendSmsBtn' : '']" type="button" @click="run"
          :disabled="disables || time > 0">{{ btnText }}
  </button>
</template>
<script>
  import api from '@/config/apiConfig'

  export default {
    props: {
      second: {
        type: Number,
        default: 60
      },
      phone: {
        required: true,
        default: null
      },
      purpose: {
        type: String,
        required: true
      },
      validateCode: {
        required: true
      },
      onSuccess: {
        type: Function,
        default() {
          return {};
        }
      },
    },
    data() {
      return {
        time: 0,
        disables: false
      }
    },
    computed: {
      btnText: function () {
        return this.time > 0 ? this.time + 's 后重获取' : '获取验证码';
      }
    },
    methods: {
      run() {
        const _this = this;
        if (!_this.phone) {
          _this.$Message.warning('请输入手机号！');
          return
        }
        if (!_this.validateCode) {
          _this.$Message.warning('请输入图形验证码！');
          return
        }
        if (/^1\d{10}$/.test(_this.phone)) {
          api.getCode({
            phone: _this.phone,
            purpose: _this.purpose,
            validateCode: _this.validateCode,
          }).then(res => {
            if (res.status) {
              _this.onSuccess(res);
              _this.start();
              _this.setDisabled(true);
            } else {
              _this.$Message.error(res.msg);
            }
          }).catch(err => {
            console.error(err);
            _this.$Message.error('获取短信验证码发生异常！');
          })
        } else {
          _this.$Message.warning('手机号码格式错误！');
        }
      },
      start() {
        this.time = this.second;
        this.timer();
      },
      setDisabled(val) {
        this.disables = val;
      },
      timer() {
        if (this.time > 0) {
          this.time--;
          setTimeout(this.timer, 1000);
        } else {
          this.setDisabled(false);
        }
      }

    }
  }
</script>

<style scoped lang="scss">
  @import 'src/css/mixin';

  .sendSmsBtn {
    position: absolute;
    right: 0;
    height: 30px;
    line-height: 34px;
    border-radius: 3px;
    background: $mainColor;
    border: none;
    padding: 0 6px;
    color: #fff;
    display: inline-block;
    width: 90px;
    top: 13px;
    margin-right: 2px;
    cursor: pointer;
    outline: none;
    @include transition;
    &:hover {
      background-color: darken($mainColor, 10%);
    }
  }

  .dissendSmsBtn {
    background-color: #666;
  }
</style>


