<template>
  <div>
    <div v-if="isLogin" class="mt-20">
      <button-group shape="circle">
        <i-button :ref="faqSel.ref" v-for="(faqSel,index) in faqSelList" :type="faqSel.type" :key="index" @click="selQuestion(faqSel,index)">{{faqSel.text}}</i-button>
      </button-group>
    </div>
    <div v-show="selFaq === 'common'" class="faq-que-ans animated fadeIn " >
        <a ref="anchor" href="javascript:void(0)" ></a>
        <Collapse class="mt-20" v-model="selectedFaq">
          <Panel name="1" id="q1">
            <span >1、注册白拿拿收费么？</span>
            <p slot="content">
            注册白拿拿是免费的，拿手成功注册之后可以免费申请评测商品。商家注册成功后可以发布评测商品。
           </p>
          </Panel>
          <Panel name="2" id="q2">
            2、注册成功之后，角色可以修改吗？
            <p slot="content">
            不可以，一经注册的角色是不能修改的，拿手只能是拿手，商家只能是商家。
            </p>
          </Panel>
          <Panel name="3" id="q3">
            3、忘记密码怎么办，怎样找回忘记密码？
            <p slot="content">
            在登录页面，点击[找回密码]，然后按照页面的提示信息输入手机号进行密码重置。
            </p>
          </Panel>
          <Panel v-if="isLogin" name="4" id="q4">
            4、支持哪几个平台评测活动？
            <p slot="content">
            目前暂时支持淘宝网和手淘，后续会陆续增加其他平台，敬请关注。
          </p>
          </Panel>
          <Panel v-if="isLogin" name="5" id="q5">
            5、一个账户可以绑定几个旺旺号？ 旺旺号要求是什么？
            <div slot="content">
              <p>一个账户可以绑定淘宝一个旺旺号，旺旺号要求：</p>
              <p>1）注册时间大于三个月；</p>
              <p>2）必须经过实名认证的账号；</p>
              <p>3）信用等级2心以上；</p>
              <p>4）历史订单中差评比例低于1%（建议绑定平时购物最多的旺旺号）</p>
            </div>
          </Panel>
          <Panel v-if="isLogin" name="6" id="q6">
            6、旺旺号绑定成功了还可以修改或者更换吗？
            <div slot="content">
              <p>绑定成功后可以修改和解绑，但修改或重新绑定后都需要重新审核。</p>
            </div>
          </Panel>
          <Panel v-if="isLogin" name="7" id="q7">
            7、申请绑定的旺旺号没通过平台审核怎么办？
            <div slot="content">
              <p>请先核实您绑定的淘宝帐号是否符合要求，核实后，请重新绑定。</p>
            </div>
          </Panel>
          <Panel name="8" id="q8">
            {{isLogin ? 8 : 4}}、什么是实名认证？为什么要进行实名认证？
            <div slot="content">
              <p>实名认证是对用户资料真实性进行的一种验证审核。经过实名认证的用户可以申请账户提现，这是为了保障亲的账户资金安全。</p>
            </div>
          </Panel>
          <Panel name="9" id="q9">
            {{isLogin ? 9 : 5}}、如何进行实名认证？
            <div slot="content">
            <p>登录后进入个人中心，选择个人设置下的实名认证，按要求填写表单内容提交即可，后台会在24小时内完成审核。</p>
          </div>
          </Panel>
          <Panel name="10" id="q10">
            {{isLogin ? 10 : 6}}、充值多久后到账？
            <div slot="content">
              <p>充值成功后，如果账户显示的余额不变，请您不要惊慌，我们的系统是有缓冲时间的，您只需要耐心稍等即可。</p>
            </div>
          </Panel>
          <Panel name="11" id="q11" >
            <span>{{isLogin ? 11 : 7}}、提现需要手续费吗？</span>
            <div slot="content">
              <p>提现时，平台
                <span v-if="$store.state.userInfo.role == 1">收取0.1%手续费</span>
                <span v-else-if="$store.state.userInfo.role == 0">免手续费</span>
                <span v-else>商家收取0.1%手续费，拿手免手续费。</span>
              </p>
            </div>
          </Panel>
          <Panel name="12" id="q12">
            <span >{{isLogin ? 12 : 8}}、申请的提现什么时候处理？提现多久后到账？</span>
            <div slot="content">
              <p>
                所有当日提交的提现申请，统一次日中午进行返款。成功提现的订单即表示已经打款成功，具体到账时间以每个银行受理时间为准。如遇到周末或者节假日，则统一顺延。
              </p>
            </div>
          </Panel>
        </Collapse>
      </div>
    <div v-show="selFaq === 'special'" class="faq-special-explain animated fadeIn ml-5">
        <p>特色活动说明：</p>
        <ul class="faq-special-ctt">
          <li>
            <p class="fs-14 f-b cl000">一：PC搜索下单（taobao.com）</p>
            <ul class="faq-special-explain-txt">
              <li>
                1、PC搜索下单的拿手必须使用电脑登录taobao.com搜索下单，须严格按评测详情中的步骤流程进行操作，
                不允许利用其他方式下单购买，经核查属实，一经核实将取消该次活动的评测资格，所产生的损失由拿手自行承担。
              </li>
              <li>
                2、拿手下单时，应核对活动商家店铺的旺旺号、以及产品的标题、价格。
                未核实信息导致下单错误的，将取消本次活动的评测资格，所产生的损失由拿手自行承担；

              </li>
              <li>
                3、拿手搜索不到对应产品时，应停止操作，以免下单错误，及时向平台客服反应；

              </li>
              <li>
                4、拿手下单时发现活动产品与店铺产品不一致时（包括价格、标题、属性及活动页面主图），
                应停止操作，及时向平台客服反应；
              </li>
              <li>
                5、因商家修改产品价格、标题、属性以及活动页面主图而造成拿手下单错误的，及时向平台客服反应；
              </li>
            </ul>
          </li>
          <li>
            <p class="fs-14 f-b cl000">二：手淘搜索下单（APP）</p>
            <ul class="faq-special-explain-txt">
              <li>
                1、手淘下单活动拿手可使用电脑申请参与。



              </li>
              <li>
                2、获得评测资格后，拿手必须使用手机淘宝搜索下单，须严格按评测详情中的步骤流程进行操作，
                不允许利用其他方式下单购买，一经核实将取消该次活动的评测资格，所产生的损失由拿手自行承担。。



              </li>
              <li>
                3、拿手搜索不到对应产品时，应停止操作，以免下单错误，及时向平台客服反应；




              </li>
              <li>
                3、拿手购买评测品后可使用电脑提交单号。


              </li>
              <li>
                4、手淘下单活动可使用电脑提交报告。若手淘下单活动未进行淘宝客推广，
                拿手利用自己的淘宝客链接下单购买赚取佣金，一经核实将取消该次活动的评测资格，所产生的损失由拿手自行承担。


              </li>
            </ul>
          </li>
          <li>
            <p class="fs-14 f-b cl000"> 三：淘口令下单（APP）</p>
            <ul class="faq-special-explain-txt">
              <li>
                1、淘令下单活动拿手可使用电脑申请参与。


              </li>
              <li>
                2、获得评测资格后，拿手必须使用手机淘宝下单，若不按流程参与，一经核实将取消该次活动的评测资格，所产生的损失由拿手自行承担。


              </li>
              <li>
                3、拿手购买评测品后可使用电脑提交单号。


              </li>
              <li>
                4、淘口令下单活动可使用电脑提交报告。


              </li>
              <li>
                5、若淘口令下单活动未进行淘宝客推广，产生的淘宝客佣金均由拿手承担，
                若核实拿手利用自己的淘宝客链接下单购买赚取佣金，一经核实将取消该次活动的评测资格，所产生的损失由拿手自行承担。


              </li>
            </ul>
          </li>
          <li>
            <p class="fs-14 f-b cl000"> 四：宝贝链接下单（taobao.com）</p>
            <ul class="faq-special-explain-txt">
              <li>
                1、宝贝链接下单的拿手需使用须使用电脑操作

              </li>
              <li>
                2、获得评测资格后可在去下单中直接点击宝贝链接进入淘宝宝贝详情页进行下单

              </li>
              <li>
                3、拿手下单时发现活动产品与店铺产品不一致时（包括价格、标题、属性及活动页面主图），应停止操作，及时向平台客服反应；

              </li>
              <li>
                4、因商家修改产品价格、标题、属性以及活动页面主图而造成拿手下单错误的，及时向平台客服反应；

              </li>
            </ul>
          </li>
        </ul>


      </div>
    </div>
</template>

<script>
  import {Button, Icon, Collapse} from 'iview'
  export default {
    name: 'faq',
    components: {
      iButton: Button,
      ButtonGroup: Button.Group,
      Icon: Icon,
      Collapse: Collapse,
      Panel: Collapse.Panel,
    },
    data() {
      return {
        selectedFaq: '',
        faqSelList: [
          {
            text: '常见问题',
            type: 'primary',
            selFaq: 'common',
            ref: 'common'

          },
          {
            text: '特色说明问题',
            type: 'default',
            selFaq: 'special',
            ref: 'special'
          }
        ],
        selFaq: 'common',
        questionId: ''
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        let self = this;
        let page = self.$route.query.page;
        let qusNum = self.$route.query.qusNum;
        let child = self.$refs;
        if(page){
          child[page][0].$el.click()
        }
        if(qusNum){
          self.selectedFaq = qusNum;
          self.questionId = 'q' + qusNum;
          child.anchor.onclick = function () {
            document.getElementById(self.questionId).scrollIntoView();
          };
          setTimeout(function () {
            child.anchor.click();
          },300)
        }
      })
    },
    created() {},
    computed: {
      isLogin() {
        return this.$store.state.login
      },
    },
    methods: {
      selQuestion(faqSel,index){
        let self = this;
        if(faqSel.type !== 'primary'){
          for(let i = 0, j = self.faqSelList.length; i < j; i++){
            if(i !== index){
              self.faqSelList[i].type = 'default';
              break;
            }
          }
          self.faqSelList[index].type = 'primary';
          self.selFaq = faqSel.selFaq
        }
      },
      goAnchor(questionId) {
        document.getElementById(questionId).scrollIntoView();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/css/mixin';

  .faq-special-explain {
    > p {
      margin-top: 30px;
      margin-bottom: 30px;
      font-size: 14px;
      color: #000;
    }
    .faq-special-ctt {
      > li {
        padding-left: 20px;
        margin-top: 30px;
        p {
          padding: 10px 0;
        }
      }
    }
    .faq-special-explain-txt {
      li {
        line-height: 28px;
        padding-left: 20px;
        font-size: 14px;
      }
    }
  }
  .faq-que-ans p{
    line-height: 24px;
  }
</style>
