;(function(window, $) {
  // 互动广告需求 http://jira.csdn.net/browse/CSDNINDEX-1040
  var indexSuperise = function(settings) {
    this.defaults = {
      smallMoveImg: '//ubmcmm.baidustatic.com/media/v1/0f000nTu6IrRwN7Xpq-Ca0.jpg', //长存小图url 300*44
      smallMove: 'shake', // 长存小图动效 shake/rubberBand/jello/tada/flash/notMove(无动效)
      smallMoveTime: 7000,
      bigMoveImg: '//ubmcmm.baidustatic.com/media/v1/0f000QuuSx9HvmkZP0qie0.jpg', // 详情大图 300*300
      bigMove: 'bounceInRight',// 详情大图动效 bounceInRight/zoomInRight/lightSpeedIn
      link: '', // 链接
      boxStyle: 80, // 距离滚动条的高度
      trackSuperId: '', // 内容位置对应ID
      trackSId: '', // 内容对应ID
    };
    var defaults = $.extend(this.defaults, settings);
    var trackHtml = defaults.trackSuperId ? 'data-track-click=\'{"mod":"kp_popu_' + defaults.trackSuperId + '-' + defaults.trackSId + '","con":",' + defaults.link + ',-"}\'' : '';
    
    // 是否关闭广告
    var isNeedAppend = localStorage.getItem('indexSuperise_' + defaults.trackSuperId) === 'false';

    var ispStyle = '<link href="//csdnimg.cn/public/common/indexSuperise/1.0.1/indexSuperise.css?20190103174846" rel="stylesheet">';
    $('body').append(ispStyle);
    var ispHtml = '<div class="indexSuperise">\n                    <div class="light-box">\n                        <a href="' + defaults.link + '" target="_blank"  ' + trackHtml + '>\n                            <img src="' + defaults.smallMoveImg + '" alt="">\n                        </a>\n                    </div>\n                    <div class="showBig animated ' + defaults.bigMove + '">\n                        <div class="pos-box">\n                            <a class="btn-close-adddd"><svg t="1540286119506" class="icon" style="width: 14px; height: 14px; fill: currentcolor; overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6698"><path d="M512 438.378667L806.506667 143.893333a52.032 52.032 0 1 1 73.6 73.621334L585.621333 512l294.485334 294.485333a52.074667 52.074667 0 0 1-73.6 73.642667L512 585.621333 217.514667 880.128a52.053333 52.053333 0 1 1-73.621334-73.642667L438.378667 512 143.893333 217.514667a52.053333 52.053333 0 1 1 73.621334-73.621334L512 438.378667z" fill="#ffffff" p-id="6699"></path></svg></a>\n                            <a href="' + defaults.link + '" target="_blank"  ' + trackHtml + '>\n                                <img src="' + defaults.bigMoveImg + '" alt="">\n                            </a>\n                        </div>  \n                    </div><button class="btn-close-ad">关闭</button>\n                </div>';    var goTopBox, adShakeTimer;
    var indexSuperiseDom = $(ispHtml);
    // 是否需要加载广告
    if(!isNeedAppend){
      var setTimer = setInterval(function() {
        goTopBox = $(".meau-gotop-box");
        if (goTopBox.length > 0) {
          clearInterval(setTimer);
          var t = goTopBox.height() + defaults.boxStyle;
          indexSuperiseDom.css({
            'bottom': t + 'px'
          });
          // 判断插入位置
          var fatherDom = defaults.trackSuperId ? $("#kp_box_" + defaults.trackSuperId) : $('body');
          fatherDom.append(indexSuperiseDom);
          smallMove();
          if(defaults.smallMove !== 'notMove'){
            adShakeTimerFun();
          }
          $(window).scroll(function() {
            var t = goTopBox.height() + defaults.boxStyle;
            indexSuperiseDom.css({
              'bottom': t + 'px'
            });
          });
        }
      }, 100);
      function smallMove() {
        indexSuperiseDom.find('.light-box img').removeClass().addClass(defaults.smallMove + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          $(this).removeClass();
        });
      }
      function adShakeTimerFun() {
        adShakeTimer = setInterval(smallMove, 7000);
      }
      // hover展示大图广告
      indexSuperiseDom.find('.light-box').hover(function() {
        indexSuperiseDom.find(".showBig").show();
        clearInterval(adShakeTimer);
      });
      // 关闭大图广告
      indexSuperiseDom.find("a.btn-close-adddd").click(function() {
        indexSuperiseDom.find(".showBig").removeAttr('style');
        if(defaults.smallMove !== 'notMove'){
          adShakeTimerFun();
        }
      });
      // 关闭广告
      indexSuperiseDom.find("button.btn-close-ad").click(function(){
        indexSuperiseDom.remove();
        localStorage.setItem('indexSuperise_' + defaults.trackSuperId, false);
      })
    }
  };
  window.csdn = window.csdn ? window.csdn : {};
  window.csdn.indexSuperise = indexSuperise;
})(window, window.jQuery);
