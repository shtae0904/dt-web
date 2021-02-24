/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE stage1-hand
* 설명     : 한글자 포스터 용지선택 기능 함수 정의 
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/

$(function() {
	KTCE.progress.stage1Normal();
	KTCE.progress.footerBtn();
	KTCE.progress.goSetting();

	paperSelect();

	print();

	pageBtnBinding();

});

function paperSelect() {

	var wrap = $('.handCharSelector')
		, directionTrigger = wrap.find('.direction button')
		, sizeTrigger = wrap.find('.size button')
		, lengthTrigger = wrap.find('.length button')
		, form = $('#nextStageForm')
		, inputDirection = form.find('input[name=canvasType]')
		, inputSize = form.find('input[name=canvasSize]')
		, inputLength = form.find('input[name=canvasLength]')

	directionTrigger.each(function(i) {
		$(this).on({
			click : function() {

				if ( i == 0 ) {
					inputDirection.val('HD');
				} else {
					inputDirection.val('WD');
				}

				directionTrigger.removeClass('active');
				$(this).addClass('active');

				print();
			}
		});
	});

	sizeTrigger.each(function(i) {
		$(this).on({
			click : function() {

				var val = '';
				var _canvasType = $(this).attr('data-type');
				val = _canvasType;
				
				inputSize.val(val);

				sizeTrigger.removeClass('active');
				$(this).addClass('active');

				print();

			}
		});
	});

	lengthTrigger.each(function(i) {
		$(this).on({
			click : function() {

				inputLength.val(i+1);

				lengthTrigger.removeClass('active');
				$(this).addClass('active');

				print();
			}
		});
	});

}

function pageBtnBinding() {
	var goNext = $('.stepController .btn.next')
		, goPrev = $('.stepController .btn.prev')
		, formPrev = $('#prevStageForm')
		, formNext = $('#nextStageForm')

	goNext.on({
		click : function() {
			formNext.submit();

			return false;
		}
	});

	goPrev.on({
		click : function() {
			formPrev.submit();

			return false;
		}
	})
}

function print() {

	var form = $('#nextStageForm')
		, inputDirection = form.find('input[name=canvasType]')
		, inputSize = form.find('input[name=canvasSize]')
		, inputLength = form.find('input[name=canvasLength]')

	console.log('canvasType : ' + inputDirection.val());
	console.log('canvasSize : ' + inputSize.val());
	console.log('canvasLength : ' + inputLength.val());
}

