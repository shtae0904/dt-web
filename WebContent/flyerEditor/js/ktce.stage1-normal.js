/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE stage1-hand
* 설명     : 전단지만들기 템플릿선택 기능 함수 정의 
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/

$(function() {
	KTCE.progress.stage1Normal();
	KTCE.progress.footerBtn();
	KTCE.progress.goSetting();

	paperSelect();

});

function paperSelect() {

	var wrap = $('.paperSelector')
		, paperList = wrap.find('.papers')
		, selectedPaper = paperList.find('.selected')
		, paperUL = paperList.find('ul')
		, paperItem = paperUL.find('button')
		, itemList = wrap.find('.tempSel .inner')
		, svgView = $('.viewTemp')

	paperItem.each(function() {
		var _this = $(this)
			, thisType = _this.attr('data-type')

		$(this).on({
			click : function() {
				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					data: {
						pageFlag : 'AF_TMPT_LIST'
						, canvasSize : thisType
					},
					success:function(data){

						var listHTML = ''

						//console.log(data);

						$.each(data.tmptList, function(i, val) {

							listHTML += '<button type="button" data-tmptid="' + val.tmptId +'" data-tmptname="' + val.tmptName + '" data-canvassize="' + val.canvasSize +'" data-canvastype="' + val.canvasType + '">' + createCanvas(val.canvasSize, val.canvasType, val.content) + '</button>\n';
							if ( i == 0 ) {
								setNext({
									tmptId : val.tmptId
									, canvasSize : val.canvasSize
									, canvasType : val.canvasType
								});
							}
						});

						itemList.html(listHTML);

						var first = itemList.find('button').first()

						first.addClass('active');

						// 용지 크기, 가로세로 타입에 따라 캔버스 생성하여 반환
						svgView.html(createCanvas(first.attr('data-canvassize'), first.attr('data-canvastype'), first.html()));

						paperItem.removeClass('active');
						_this.addClass('active');

						selectedPaper.html(_this.html());

						setTimeout(function() {
							listBinding();
							setTimeout(function() {
								$('.dimmLoader').fadeOut(150);
							}, 500);
						}, 1);
					}, error : function(e) {
						alert('템플릿 조회중 에러가 발생하였습니다. 다시 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
					}
				});

				paperUL.slideUp(150);
			}
		});
	});

	$(paperItem[1]).trigger('click');
	//$(paperItem[2]).trigger('click');
	pageBtnBinding();

	function createCanvas(canvasSize, canvasType, content) {

		var svg = ''
			, viewBox = ''
			, num = 0

		switch(canvasSize) {
//START: 2017-01-09 ==================================================================================
		case 'PS' :		//POST 추가
			if ( canvasType == 'HD' ) {
				num = getPaperHeight(1, 800);
			} else if ( canvasType == 'WD' ) {
				num = getPaperWidth(1, 800);
			}
			break;
		case 'A3' :
			if ( canvasType == 'HD' ) {
				num = getPaperHeight(3, 800);
			} else if ( canvasType == 'WD' ) {
				num = getPaperWidth(3, 800);
			}
			break;

		case 'A4' :
			if ( canvasType == 'HD' ) {
				num = getPaperHeight(4, 800);
			} else if ( canvasType == 'WD' ) {
				num = getPaperWidth(4, 800);
			}
			break;

		case 'A5' :
			if ( canvasType == 'HD' ) {
				num = getPaperHeight(5, 800);
			} else if ( canvasType == 'WD' ) {
				num = getPaperWidth(5, 800);
			}
			break;
		
			//원본 2016년
		/*case 'A3' :
			if ( canvasType == 'HD' ) {
				num = getPaperHeight(3, 800);
			} else if ( canvasType == 'WD' ) {
				num = getPaperWidth(3, 800);
			}
			break;

		case 'A4' :
			if ( canvasType == 'HD' ) {
				num = getPaperHeight(3, 800);
			} else if ( canvasType == 'WD' ) {
				num = getPaperWidth(3, 800);
			}
			break;

		case 'A5' :
			if ( canvasType == 'HD' ) {
				num = getPaperHeight(3, 800);
			} else if ( canvasType == 'WD' ) {
				num = getPaperWidth(3, 800);
			}
			break;*/
//END: 2017-01-09 ==================================================================================
		}

		if ( canvasType == 'HD' ) {
			viewBox = '0 0 800 ' + num;
		} else if ( canvasType == 'WD' ) {
			viewBox = '0 0 ' + num + ' 800';
		}

		svg = '<svg width="100%" height="100%" viewbox="' + viewBox + '">' + content + '</svg>';

		return svg;
	}

	function listBinding() {

		var svgItem = itemList.find('button')

		svgItem.each(function() {
			var _this = $(this)
				, tmptId = _this.attr('data-tmptid')
				, canvasSize = _this.attr('data-canvassize')
				, canvasType = _this.attr('data-canvastype')
				, thisHTML = _this.html()

			_this.on({
				click : function() {
					svgItem.removeClass('active');
					_this.addClass('active');

					setNext({
						tmptId : tmptId
						, canvasSize : canvasSize
						, canvasType : canvasType
					});
					svgView.html(thisHTML);
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

	function setNext(info) {
		var form = $('#nextStageForm')
			, tmptId = form.find('input[name=tmptId]')
			, canvasType = form.find('input[name=canvasType]')
			, canvasSize = form.find('input[name=canvasSize]')

		tmptId.val(info.tmptId);
		canvasType.val(info.canvasType);
		canvasSize.val(info.canvasSize);
	}

}