/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE shape-editor
* 설명     : 편집기 관리 - 스타일 관리 - 도형스타일 관리 기능 함수 정의
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/
/*
 * KTCE Editor
 * @Package
 * @Description : KTCE Editor 기능
 **/
(function() {

	var editor = function() {

		/*********************/
		/*       변수        */
		/*********************/

		var layerTrigger = {
				all : $('.functions button').filter(function() {
					if ( $(this).hasAttr('data-target') ) {
						return $(this);
					}
				})
				, fillShape : $('#fillShape')
				, shapeStroke : $('#shapeStroke')
				, shapeStrokeWidth : $('#shapeStrokeWidth')

			}
			, layer = {
				all : $('.layer')
				, fillShape : $('.fillLayer')
				, shapeStroke : $('.strokeFillLayer')
				, shapeStrokeWidth : $('.strokeWidthLayer')
				, shadowEffect : $('.shadowEffectLayer')
				, gradientEffect : $('.gradientEffectLayer')
				, edgeEffect : $('.edgeEffectLayer')
			}
			, trigger = {
				addShape : $('#shapeLayer button')
				, fillShape : layer.fillShape.find('button')
				, shapeStroke : layer.shapeStroke.find('button')
				, shapeStrokeWidth : layer.shapeStrokeWidth.find('button')
				, shadowEffect : layer.shadowEffect.find('button')
				, gradientEffect : layer.gradientEffect.find('button')
				, edgeEffect : layer.edgeEffect.find('button')

			}
			, colorIndicator = $('.colorPattern').find('.crColor')
			, fillColorIndicator = colorIndicator.filter(function(){
				if ( $(this).parents('.fillLayer').length ) return $(this);
			})
			, strokeColorIndicator = colorIndicator.filter(function(){
				if ( $(this).parents('.strokeFillLayer').length ) return $(this);
			})
			, motionSpeed = {
				layer : 150
			};

		/*********************/
		/*       실행        */
		/*********************/

		function fnBinding() {

			// 레이어 닫기
			fnDocumentBind();

			// 레이어 트리거 바인딩
			fnTriggerBinding();

			// shape fill 트리거 바인딩
			fnShapeFillBinding();

			// shape stroke color 트리거 바인딩
			fnShapeStrokeBinding();

			// shape stroke width 트리거 바인딩
			fnStrokeWidthBinding();
			
			// shape shadow width 트리거 바인딩
			fnShadowEffectBinding();
			
			// shape gradient width 트리거 바인딩
			fnGradientEffectBinding();
			
			// shape blur width 트리거 바인딩
			fnEdgeEffectBinding();

		}

		/*********************/
		/*       함수        */
		/*********************/

		// 도형 배경색 기능
		function fnShapeFillBinding() {
			trigger.fillShape.each(function(){
				var _this = $(this);

				_this.on({
					click : function() {
						fillBGColor(_this, KTCE.rectObj);
						fnSetIndicator(KTCE.currentPaper);
					}
				});
			});
		}

		// 도형 스트로크 색상 기능
		function fnShapeStrokeBinding() {
			trigger.shapeStroke.each(function(){
				var _this = $(this);

				_this.on({
					click : function() {
						fillStrokeColor(_this, KTCE.rectObj);
						fnSetIndicator(KTCE.currentPaper);
					}
				});
			});
		}

		// 도형 스트로크 넓이 기능
		function fnStrokeWidthBinding(){
			trigger.shapeStrokeWidth.each(function() {
				var _this = $(this)
					, thisWidth = parseInt(_this.text(), 10);

				_this.on({
					click : function() {
						trigger.shapeStrokeWidth.removeClass('active');
						_this.addClass('active');

						$(KTCE.rectObj.node).css({
							'stroke-width' : thisWidth
						});

						$(KTCE.rectObj.node).attr({
							'stroke-width' : thisWidth
						});
						
					}
				});
				
				
			});
		}

		/**
		 * 도형 그림자 효과 
		 */
		function fnShadowEffectBinding() {
			trigger.shadowEffect.each(function() {
				var _this = $(this)
					, thisWidth = parseInt(_this.text(), 10) * 6;

				_this.on({
					click : function() {
						trigger.shadowEffect.removeClass('active');
						_this.addClass('active');
						

						$('#paper1 defs>filter').remove();

						var filter = getFilter(thisWidth);

						KTCE.filter = filter;
						
						KTCE.rectObj.attr({
							filter : filter,							
							'data-filter-id' : filter.attr('id')							
						});
					}
				});
			});
		}
		
		/**
		 * 도형 그라데이션 효과
		 */
		function fnGradientEffectBinding() {
			trigger.gradientEffect.each(function() {
				var _this = $(this);
			
				_this.on({
					click : function() {
						trigger.gradientEffect.removeClass('active');
						_this.addClass('active');

						var _currnetGradientId = KTCE.rectObj.attr('data-gradient-id');
						$("#" + _currnetGradientId).remove();						
				
						var _gradient = $('#' + _this.attr('ge')).clone();
						var bgColor = getSVGfillColor(KTCE.rectObj);
						
						if(bgColor.indexOf('url') > -1){
							bgColor = bgColor.substring(bgColor.indexOf('#'), bgColor.lastIndexOf(')')-1);
							bgColor = $(bgColor).children('stop').first().attr('stop-color');							
						}
						
				
						var dtNow = new Date();
						gradientId = _gradient.attr('id') + dtNow.getTime();				
						_gradient.attr('id', gradientId);
						_gradient.children('stop').first().attr('stop-color', bgColor);
					
						$('#paper1').find('defs').append(_gradient);
						KTCE.s = Snap('#paper1');
						KTCE.fill = _gradient;
						thisGradient = 'url(#'+ gradientId + ')';
						KTCE.rectObj.attr({
							fill : thisGradient,							
							'data-gradient-id' : gradientId								
						});
					}
				});
			});
		}
		
		/**
		 * 도형 가장자리 효과
		 */
		function fnEdgeEffectBinding(){
			trigger.edgeEffect.each(function() {
				var _this = $(this)
					, thisValue = parseInt(_this.attr('value'));

				_this.on({
					click : function() {
						trigger.edgeEffect.removeClass('active');
						_this.addClass('active');

						$('#paper1 defs>filter').remove();						
						
						var filter = KTCE.s.filter(Snap.filter.blur(thisValue));
						KTCE.filter = filter;
						KTCE.rectObj.attr({
							filter : filter,							
							'data-filter-id' : filter.attr('id')								
						});
						
					}
				});
			});
		}
		

		// filter값
		function getFilter(width) {
			return KTCE.s.filter(Snap.filter.shadow(0, 0,width, 'rgb(0,0,0)'), 1);
		}

		// 도형 색상 선택기 기능
		function fnSetIndicator() {
			fillColorIndicator.css('backgroundColor', getSVGfillColor(KTCE.rectObj));
			strokeColorIndicator.css('backgroundColor', getSVGstrokeColor(KTCE.rectObj));
		}

		// 폰트 색상 선택기 기능
		function fnSetIndicator2() {
			fillColorIndicator.css('backgroundColor', getSVGfillColor(KTCE.textObj));
			strokeColorIndicator.css('backgroundColor', getSVGstrokeColor(KTCE.textObj));
		}

		// 레이어 보이기 기능
		function fnTriggerBinding() {
			layerTrigger.all.each(function() {
				var _this = $(this)
					, thisLayer = $(_this.attr('data-target'));

				_this.on({
					click : function() {
						if ( thisLayer.is(':hidden') ) {
							layer.all.not(thisLayer).stop(true, true).slideUp(motionSpeed.layer);
							thisLayer.stop(true, true).slideDown(motionSpeed.layer, function() {
								if ( thisLayer.find('.scroller').length ) {
									thisLayer.find('.scroller').mCustomScrollbar({
										theme : 'dark'
										, scrollInertia : 300
									});
								}
							});
							layerTrigger.all.removeClass('active');
							_this.addClass('active');
						} else {
							thisLayer.stop(true, true).slideUp(motionSpeed.layer);
							_this.removeClass('active');
						}

						return false;
					}
				});
			});
		}

		// 문서의 이벤트 컨트롤
		function fnDocumentBind() {
			$(document).on({
				'click.layerControl' : function(e) {
					var e = e || window.event
						, target = $(e.target);

					layer.all.stop(true, true).slideUp(motionSpeed.layer);
					layerTrigger.all.removeClass('active');
				}
			});
		}
		
		// 객체의 배경색 반환
		function getSVGfillColor(obj) {
			//원본
			//return $(obj.node).css('fill');
			
			return obj.attr('fill');
		}

		// 객체의 스트로크 색상 반환
		function getSVGstrokeColor(obj) {
			//원본
			//return $(obj.node).css('stroke');
			
			return obj.attr('stroke');
		}

		// 트리거의 색상을 배경색으로 설정
		function fillBGColor(trigger, obj) {
			var thisColor = getColorHex(trigger);

			obj.attr({
				fill : thisColor
			});
		}

		// 트리거의 색상을 폰트색상으로 설정
		function fillFontColor(trigger, obj) {
			var thisColor = getColorHex(trigger);

			obj.css({
				color : thisColor
			});
		}
		
				
		// 트리거의 색상을 스트로크 색상으로 설정
		function fillStrokeColor(trigger, obj) {
			var thisColor = getColorHex(trigger);
		
			obj.attr({
				stroke : thisColor
			});
		}
		
		// jquery 오브젝트의 color hex 값을 반환
		function getColorHex(obj) {
			return obj.css('backgroundColor');
		}

		// 페이퍼를 만들기
		function fnCreatePaper(obj, type, width, height, content, styleId) {

			var paper = {}
				, s = Snap(obj);

			if ( content != '' ) {
				KTCE.textContent = content;
			} else {
				KTCE.textContent = null;
			}

			KTCE.s = s;
			KTCE.filter = '';
			KTCE.fill = '';

			// SVG 기본 세팅
			s.attr({
				width : width
				, height : height
				, viewbox : '0 0 ' + width + ' ' + height
			});

			KTCE.editorSVG = s;
			KTCE.saveStyle = "";

			fnReset(true);

			fnSaveStyle();

			$('#SAVE').on({
				click : function() {

					fnSaveStyle();

					setTimeout(function() {
						if ( KTCE.textContent != null ) {
							$.ajax({
								url:'/Fwl/FlyerEditerMng.do',
								type:'post',
								data: {
									pageFlag : 'PF_UPDATE'
									, tabCode : 'style'
									, styleId : styleId
									, content : KTCE.saveStyle
								},
								success:function(data){
									console.log(data.result, data.msg);
									window.opener.changeStyleType('02');
									alert('정상적으로 수정되었습니다.');
									window.close();
								}, error : function(e) {
									alert('수정 실패하였습니다.');
								}
							});

						} else {
							$.ajax({
								url:'/Fwl/FlyerEditerMng.do',
								type:'post',
								data: {
									pageFlag : 'PF_INSERT'
									, tabCode : 'style'
									, styleDstinCd : '02'
									, content : KTCE.saveStyle
								},
								success:function(data){
									console.log(data.result, data.msg);
									window.opener.changeStyleType('02');
									alert('정상적으로 저장되었습니다.');
									window.close();
								}, error : function(e) {
									alert('저장 실패하였습니다.');
								}
							});
						}

					}, 1);
				}
			});

			$('#RESET').on({
				click : function() {
					if ( confirm('초기화하시겠습니까? 저장되지 않은 데이터는 사라집니다.') ) {
						fnReset(false);
					}
				}
			});

			$('#CANCEL').on({
				click : function() {
					if ( confirm('창을 닫으시겠습니까? 저장되지 않은 데이터는 사라집니다.') ) {
						window.opener.changeStyleType('02');
						window.close();
					}
				}
			});

			// 삭제 기능
			if ( $('#DELETE').length ) {
				$('#DELETE').on({
					click : function() {
						
						if ( confirm('정말 삭제하시겠습니까?') ) {
							$.ajax({
								url:'/Fwl/FlyerEditerMng.do',
								type:'post',
								data: {
									pageFlag : 'PF_DELETE'
									, tabCode : 'style'
									, styleDstinCd : '02'
									, styleId : styleId
								},
								success:function(data){
									console.log(data.result, data.msg);
									window.opener.changeStyleType('02');
									alert('정상적으로 삭제되었습니다.');
									window.close();
								}, error : function(e) {
									alert('삭제 실패하였습니다.');
								}
							});
						}
					}
				});
			}

		}

		// 스타일 저장
		function fnSaveStyle() {
			var shapeStyle = KTCE.rectObj.attr('style');			
			var shapeStroke = KTCE.rectObj.attr('stroke');
			var shapeFill = KTCE.rectObj.attr('fill');
			var shapeStrokeWidth = KTCE.rectObj.attr('stroke-width');
			var shapeFilterId = null,
				shapeFilter = null,
				shapeGradientFillId = '',
				shapeGradientFill = '';
			try{
				shapeFilterId = KTCE.rectObj.attr('data-filter-id');
				shapeFilter = outerHTMLCheck($('#paper1 defs>filter')[0]); //KTCE.filter;//KTCE.rectObj.attr('filter');
			}catch(err){
				
			}
			try{
				shapeGradientFillId = KTCE.rectObj.attr('data-gradient-id');
				shapeGradientFill = outerHTMLCheck($('#paper1 defs #' + shapeGradientFillId)[0]);
				
			}catch(err){	
			}
			
			if(shapeFilterId != null) {
				console.log('not null')
				shapeFilterId = "url('#" + shapeFilterId + "')";
			}else{
				console.log('null')
				shapeFilterId = "";
				shapeFilter = "";
			}
			if(shapeGradientFillId != null) {
				shapeGradientFillId = "url('#" + shapeGradientFillId + "')";
			}else{
				shapeGradientFillId = shapeFill;
				shapeGradientFill = "";
			}
			
			
			if(KTCE.fill != ''){
				shapeStyle = shapeStyle + '**' + shapeStroke + '**' + shapeFill + '**' + shapeStrokeWidth + '**' + shapeGradientFill + '**' + shapeFilter + '**' + 'url(#' + KTCE.fill.attr('id') + ')' + '**' +  'url(#' + KTCE.rectObj.attr('data-filter-id') + ')';
			} else {
				shapeStyle = shapeStyle + '**' + shapeStroke + '**' + shapeFill + '**' + shapeStrokeWidth + '**' + shapeGradientFill + '**' + shapeFilter + '**' + shapeGradientFillId + '**' + shapeFilterId;
			}
			
			KTCE.saveStyle = "";
			KTCE.saveStyle = Base64.encode(shapeStyle);
		}
		

		
		// 초기화
		function fnReset(first) {

			if ( !first ) {
				KTCE.rectObj.remove();
				KTCE.rectObj = null;
			}

			var rect = KTCE.editorSVG.rect(30,30,340, 340);

			if ( KTCE.textContent != null ) {
				content = decodeURIComponent(KTCE.textContent);
				
				var arrCode = content.split('**');
				$(rect.node).attr('style', arrCode[0]);
								
				$(rect.node).attr('stroke', arrCode[1]);
				
				$(rect.node).attr('fill', arrCode[2]);
				$(rect.node).attr('stroke-width', arrCode[3]);
				
				var defsHtml = $('#paper1').children('defs').html();
	
				defsHtml = defsHtml + arrCode[4] + arrCode[5];

				$('#paper1').children('defs').html(defsHtml);
				
				var shadowValue = parseInt($(arrCode[5]).find('fegaussianblur').attr('stdDeviation'));
				var filterType = ($(arrCode[5]).find('feOffset').length > 0) ? 'shadow' : 'non-shadow';
					
				//그라데이션
				if(arrCode[4] == 'null') arrCode[4] = '';
				if(arrCode[4] != ''){
					var browserType = getBrowserType();
					if(browserType.indexOf('msie') > -1){	//IE

						//그라데이션 생성: ie(버그)는 미리 생성된 값이 정상작동되질 않고 화면도 이상하게 나타남.
						var _gradient = "";
						if(arrCode[6].indexOf('geCenter') > -1 ) {	//가운데
							_gradient = "geCenter";
						}else if(arrCode[6].indexOf('geDiagonal') > -1 ) {	//대각선
							_gradient = "geDiagonal";
						}else{ //수평선 geHorizon
							_gradient = "geHorizon";
						}
						_gradient = $("#" + _gradient).clone();
						var bgColor = $(arrCode[4]).children('stop').first().attr('stop-color');	
						
						var dtNow = new Date();
						gradientId = _gradient.attr('id') + dtNow.getTime();				
						_gradient.attr('id', gradientId);
						_gradient.children('stop').first().attr('stop-color', bgColor);
					
						$('#paper1').find('defs').append(_gradient);
						thisGradient = 'url(#'+ gradientId + ')';
						
						rect.attr({
							fill : thisGradient,						
							'data-gradient-id' : gradientId								
						});
			
					}else{
						$(rect.node).attr({'fill': arrCode[6],'data-gradient-id':$(arrCode[4]).attr('id')});
					}
					
				}
				
				
				//그림자효과
				if(arrCode[5] != ''){
					
					var browserType = getBrowserType();
					if(browserType.indexOf('msie') > -1){	//IE
						var paper = Snap('#paper1');
						$('#paper1 defs>filter').remove();
						var _filter = "";
						if(filterType === 'shadow') {
							_filter = getFilter(shadowValue);//paper.filter(Snap.filter.shadow(0,0, shadowValue));	////3:18, 2: 12, 1:6
						}else{
							_filter = KTCE.s.filter(Snap.filter.blur(shadowValue));
						}

						rect.attr({'filter': _filter, 'data-filter-id':_filter.attr('id')});
						
					}else{
						$(rect.node).attr({'filter': arrCode[7], 'data-filter-id':$(arrCode[5]).attr('id')});
					}

				}
				
			} else {

				$(rect.node).css({
					'storke-width' : 2
				});
				rect.attr({
					'storke-width' : 2
					, 'stroke' : '#f00'
					, 'fill' : '#fff'
				});			
			}
			KTCE.rectObj = rect;
		}

		// SVG 이미지화
		function getSVG() {
			var svg = KTCE.editorSVG.clone();

			svg.children().forEach(function(el,i) {
				if ( el.node.nodeName != 'rect' && el.node.nodeName != 'text' ) {
					el.remove();
				}
			});
			svg.attr({
				'style' : ''
				, width : 400
				, height : 400
				, id : ''
				, viewBox : '0 0 400 400'
			});
			svg.children()[0].attr({
				x : 0
				, y : 0
			});
			svg.children()[1].attr({
				x : 55
				, y : 95
			});
			var html = svg.outerSVG();
			svg.remove();
			return html;
		}

		// 불러온 스타일을 object에 적용
		function fnTemplate(paper) {


		}

		// 클래스 메서드
		return {
			init : fnBinding
			, create : fnCreatePaper
		};

	}; // end of KTCE.temp

	KTCE.shapeStyleEditor = editor;

})();