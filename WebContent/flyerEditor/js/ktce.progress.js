/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE progress
* 설명     : KTCE 에디터를 제외한 나머지 진행 화면 기능
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/

/*
 * KTCE.progress
 * @Class
 * @Description : KTCE 에디터를 제외한 나머지 진행 화면 기능
 **/
KTCE.progress = {};

// footer 기능
(function() {

	var footer = function(zoom) {

		var footWrap = $('.footer')
			, sizeSlider = footWrap.find('#sliderBar')
			, realSelect = $('#sizeOption')
			, uiSelect, uiSelectTrigger
			, smaller = footWrap.find('.progressBar .smaller')
			, larger = footWrap.find('.progressBar .larger')
			, paperLayout = $('.paperLayout')
			, paperFrame = $('.paperFrame')
			//, papers = $("svg")
			, papers = $(".paperFrame > svg")
			, originWidth = $(papers[0]).width()
			, originHeight = $(papers[0]).height()
			, step = 25
			, min = 50
			, max = 300

		KTCE.util.select({
			target : $('.footer .uiSelect')
			, duration : 0.2
			, scrollInit : true
			, addClass : 'sizeOption'
		});

		uiSelect = $('.uiDesignSelect-wrap.sizeOption ')
		uiSelectTrigger = uiSelect.find('.uiDesignSelect-optionList').find('a')
		

		sizeSlider.slider({
			min : 50
			, max : 300
			, step : 25
			, value: zoom
			, change : function(event, ui) {

				var cIdx = _returnIdx(ui.value);

				uiSelectTrigger.eq(cIdx).trigger('change');

				console.log("##### slider ui.value : " + ui.value);
				layoutChange(ui.value);
			}
		});

		smaller.off().on({
			click : function() {
				var cVal = sizeSlider.slider('option','value');
				if ( cVal > min ) {
					sizeSlider.slider('option', {
						value : cVal-step
					});
				}
			}
		});

		larger.off().on({
			click : function() {
				var cVal = sizeSlider.slider('option','value');
				if ( cVal < max ) {
					sizeSlider.slider('option', {
						value : cVal+step
					});
				}
			}
		});

		realSelect.change(function() {
			//var thisVal = parseInt($(this).val());	//chrome에서 비정상적으로 select값을 못 받아옴(특히, 100%)
			var thisVal = parseInt($("#" + $(realSelect).attr('id') + " > option[selected='selected']").val());			

			sizeSlider.slider('option', {
				value : thisVal
			});
		});

		function _returnIdx(num) {
			var idx = null;
			realSelect.find('option').each(function(i) {
				var thisVal = parseInt($(this).val());

				if ( thisVal == num ) {
					idx = i;
				}
			});
			return idx;
		}

		function layoutChange(ratio) {
			//페이지 용지 비율크기 값을 못 얻어오는 경우 기본 100%로 지정
			if((String(ratio)==='NaN')) ratio = 100;
			
			var cRatio = ratio / 100
				, mTime = 300;
			$("#sizeOption option" ).attr("selected",false);
			$("#sizeOption > option[value='"+ratio+"']" ).attr("selected","true");
			
			var maginTop=0;
			var maginLeft=0;
			if(ratio > 100){
				var doCount = (ratio - 100)/25;
				maginTop=150*doCount;
				maginLeft=100*doCount;
			}
			
			for(var i=0 ; i < papers.length ; i++){
				var roopPaper = $(papers[i]);
				roopPaper.css({"margin-top":maginTop,"margin-left":maginLeft});
				roopPaper.transition({
					scale : cRatio
				}, 0, function() {
					var currentWidth = roopPaper[0].getBoundingClientRect().width
						, currentHeight = roopPaper[0].getBoundingClientRect().height;

					roopPaper.transition({
						x : -(cRatio/100) + '%'
					}, 0);

					//rePos();
				});
			}

		}

		function rePos() {

			var s = Snap('#paper1')
				, objWrap = s.select('#objWrap')
				, allObj = objWrap.selectAll('rect')

			Snap.freeTransform(allObj, {
				draw: ['bbox']
				, keepRatio: ['bboxCorners']
				, rotate: ['axisY']
				, scale: ['bboxCorners', 'bboxSides']
				, distance: '1.5'
				, boundary : {
					x : 0
					, y : 0
					, width : 560
					, height : 580
				}
			});
		}

		layoutChange(zoom);
	} // end of footer

	KTCE.progress.footer = footer;

})();

// footer버튼 기능
(function() {

	var footerBtn = function() {


		var btn = $('.footer .btns a')

		// 버튼 온오프
		btn.each(function() {
			var on = $(this).find('img').attr('src').replace('_off.png', '_on.png')
				, off = $(this).find('img').attr('src').replace('_on.png', '_off.png')

			$(this).off().on({
				mouseenter : function() {
					$(this).find('img').attr('src', on);
				}
				, mouseleave : function() {
					$(this).find('img').attr('src', off);
				}
			});

		});

	} // end of footer

	KTCE.progress.footerBtn = footerBtn;

})();

// 세팅 이동 기능
(function() {

	var goSetting = function() {

		var trigger = $('.setting');

		// 버튼 온오프
		trigger.on({
			click : function() {
				console.log('click');
				window.opener.location.href='/Fwl/FlyerEditerMng.do';
				window.close();
			}
		});

	} // end of goSetting

	KTCE.progress.goSetting = goSetting;

})();

// 일반. 용지 및 템플레이트 선택 화면
(function() {
	var stage1Normal = function() {

		// 템플레이트 스크롤
		$('.paperSelector .tempSel .outer').mCustomScrollbar({
			theme : 'dark'
			, scrollInertia : 300
		});

		// 용지 선택 드랍다운
		var dropdownTrigger = $('.paperSelector .papers .selected')
			, dropdownList = $('.paperSelector .papers .list')
			, dropdownListTrigger = dropdownList.find('a')
			, cIdx = 0

		_viewTemp();

		dropdownTrigger.on({
			click : function() {
				if ( dropdownList.is(':hidden') ) {
					dropdownTrigger.addClass('open');
					dropdownList.stop(true, true).slideDown(150);
				} else {
					_hideDropdown();
				}
			}
		});

		dropdownListTrigger.each(function(i) {
			$(this).on({
				click : function() {
					if ( !$(this).hasClass('active') ) {
						dropdownListTrigger.removeClass('active');
						$(this).addClass('active');

						_returnValue($(this).text());

						cIdx = i;

						_loadTemplates();

					}

					_hideDropdown();

					return false;
				}
			});
		});

		function _hideDropdown() {
			dropdownTrigger.removeClass('open');
			dropdownList.stop(true, true).slideUp(150);
		}

		function _returnValue(val) {
			dropdownTrigger.text(val);
		}

		// 용지에 따른 템플레이트 로드
		function _loadTemplates() {
			console.log('load...');
			// 로딩 끝나고 첫번째 이미지에 active 클래스 삽입

			// 로딩이 끝나면 리바인딩
			_viewTemp();
		}

		// 템플레이트 리스트에서 선택하면 우측 뷰에 보이기
		function _viewTemp() {

			var trigger = $('.tempSel a')
				, view = $('.viewTemp img')

			trigger.first().addClass('active');

			trigger.off('click').on({
				click : function() {

					var src = $(this).find('img').attr('src')

					view.attr('src', src);

					trigger.removeClass('active');
					$(this).addClass('active');

					return false;
				}
			});
		}

	}

	KTCE.progress.stage1Normal = stage1Normal;
})();

// 일반. 용지 및 템플레이트 선택 화면
(function() {

	var stage4 = function() {

		KTCE.util.select({
			target : $('.uiSelect')
			, duration : 0.2
			, scrollInit : true
			, addClass : 'lognHeight'
		});


	}

	KTCE.progress.stage4 = stage4;
})();