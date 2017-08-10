/**
 * 本文件是发起工单的js文件
 *@author 鲍哲
 */
(function($, w, d) {
    'use strict';
    $(function(){

      function turnWrokOrder (){
        var  _this = $(this);
        var _href = _this.attr('data_href');
          console.log(_href)
          window.location.href = _href;
      }

    $(".taskOder").on('click',turnWrokOrder); //任务单
    $(".retrievalOder").on('click',turnWrokOrder); //出库工单
    $(".constructionOder").on('click',turnWrokOrder); // 施工工单
    $(".commonOder").on('click',turnWrokOrder); //维修工单
    $(".recoveryOder").on('click',turnWrokOrder); //回收工单

    });
}(jQuery, window, document));