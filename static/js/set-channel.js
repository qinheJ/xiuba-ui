/**
 * Created by Administrator on 2017/10/20 0020.
 */

  //这里处理用户渠道-搜索引擎
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 36500);
  var regexp = /(.*\.)*(\w*\.\w*)/;
  var domain = regexp.exec(window.location.host)[2];
  var cookieAttr = ";expires=" + expireDate.toUTCString() + ";path=/;domain=" + domain;
  var referer = document.referrer;
  if (referer && '' !== referer) {
    var searchEngineConfig = {
      'www.baidu.com': {'name': 'BAIDU', 'queryKey': 'wd'},
      'www.so.com': {'name': '360', 'queryKey': 'q'},
      'www.sogou.com': {'name': 'SOUGOU', 'queryKey': 'query'}
    };
    var searchKeyWord = null;
    for (var key in searchEngineConfig) {
      if (referer.indexOf(key) !== -1) {
        var qudaoData = searchEngineConfig[key];
        eval("var regexStr = /\&" + qudaoData.queryKey + "\=([^\&]*)/;");
        var searchKey = referer.match(regexStr);
        if (searchKey === null || searchKey.length < 2) {
          eval("var regexStr = /\\?" + qudaoData.queryKey + "\=([^\&]*)/;");
          searchKey = referer.match(regexStr);
        }
        if (searchKey && searchKey.length > 1 && null !== searchKey[1] && '' !== searchKey[1]) {
          searchKeyWord = searchKey[1];
        }
        if (null === searchKeyWord || '' === searchKeyWord) {
          searchKeyWord = encodeURI(referer);
          if (searchKeyWord.length > 512) {
            searchKeyWord = searchKeyWord.substring(0, 512);
          }
        }

        document.cookie = "from_qudao=" + qudaoData.name + cookieAttr;
        document.cookie = "from_qudao_key=" + searchKeyWord + cookieAttr;
        break;
      }
    }
  }
  //这里处理用户渠道-自定义渠道
//        var path = this.location.pathname;
//        var host = this.location.host;
//        // console.info(path);
//        //销售推广
//        if (path && path.indexOf("/s/") !== -1) {
//          var salerId = this.location.pathname.replace("/s/", "");
//          document.cookie = "from_qudao=saler_dev" + cookieAttr;
//          document.cookie = "reg_user_from_saler_id=" + salerId + cookieAttr;
//        }
//        //百度
//        if (path && path.indexOf("/bd") !== -1 && path.length <= 4) {
//          document.cookie = "from_qudao=baidu" + cookieAttr;
//        }
//        //百度知道
//        if (path && path.indexOf("/zd") !== -1 && path.length <= 4) {
//          document.cookie = "from_qudao=bdzd" + cookieAttr;
//        }
//        //百度网盟
//        if (path && path.indexOf("/bdwm") !== -1 && path.length <= 6) {
//          document.cookie = "from_qudao=bdwm" + cookieAttr;
//        }
//        //360
//        if (path && path.indexOf("/qh") !== -1 && path.length <= 4) {
//          document.cookie = "from_qudao=qh360" + cookieAttr;
//        }
//        //搜狗
//        if (path && path.indexOf("/sg") !== -1 && path.length <= 4) {
//          document.cookie = "from_qudao=sogou" + cookieAttr;
//        }
//        if (path && path.indexOf("uref") >= 0) {
//          var user_ref_code = path.match(/uref.*/)[0];
//          document.cookie = "user_refer_code=" + user_ref_code.substr(4, user_ref_code.length) + cookieAttr;
//          document.cookie = "from_qudao=user_recommend" + cookieAttr;
//        }