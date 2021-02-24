/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE shape-editor
* 설명     : 편집기 관리 - 스타일 관리 - 표스타일 관리 기능 함수 정의
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
				, fillTable : $('#fillTable')
				, tableStroke : $('#tableStroke')
				, tableStrokeWidth : $('#tableStrokeWidth')

			}
			, layer = {
				all : $('.layer')
				, fillTable : $('.tableCellFillLayer')
				, tableStroke : $('.tableCellStrokeFillLayer')
				, tableStrokeWidth : $('.tableCellStrokeWidthLayer')
			}
			, trigger = {
				fillTable : layer.fillTable.find('button')
				, tableStroke : layer.tableStroke.find('button')
				, tableStrokeWidth : layer.tableStrokeWidth.find('button')
			}
			, colorIndicator = $('.colorPattern').find('.crColor')
			, fillColorIndicator = colorIndicator.filter(function(){
				if ( $(this).parents('.tableCellFillLayer').length ) return $(this);
			})
			, strokeColorIndicator = colorIndicator.filter(function(){
				if ( $(this).parents('.tableCellStrokeFillLayer').length ) return $(this);
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
			fnTableFillBinding();

			// shape stroke color 트리거 바인딩
			fnTableStrokeBinding();

			// shape stroke width 트리거 바인딩
			fnTableStrokeWidthBinding();
		}

		/*********************/
		/*       함수        */
		/*********************/

		// 도형 배경색 기능
		function fnTableFillBinding() {
			trigger.fillTable.each(function(){
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
		function fnTableStrokeBinding() {
			trigger.tableStroke.each(function(){
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
		function fnTableStrokeWidthBinding(){
			trigger.tableStrokeWidth.each(function() {
				var _this = $(this)
					, thisWidth = parseInt(_this.text(), 10);

				_this.on({
					click : function() {
						trigger.tableStrokeWidth.removeClass('active');
						_this.addClass('active');

						$(KTCE.rectObj.node).css({
							'stroke-width' : thisWidth
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
			return $(obj.node).css('fill');
		}

		// 객체의 스트로크 색상 반환
		function getSVGstrokeColor(obj) {
			return $(obj.node).css('stroke');
		}

		// 트리거의 색상을 배경색으로 설정
		function fillBGColor(trigger, obj) {
			var thisColor = getColorHex(trigger);

			$(obj.node).css({
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

			$(obj.node).css({
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
									window.opener.changeStyleType('03');
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
									, styleDstinCd : '03'
									, content : KTCE.saveStyle
								},
								success:function(data){
									console.log(data.result, data.msg);
									window.opener.changeStyleType('03');
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
						window.opener.changeStyleType('03');
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
									, styleDstinCd : '03'
									, styleId : styleId
								},
								success:function(data){
									console.log(data.result, data.msg);
									window.opener.changeStyleType('03');
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
						
			if(KTCE.fill != ''){
				shapeStyle = shapeStyle + '**' + KTCE.fill.outerHTML() + KTCE.filter + '**' + 'url(#' + KTCE.fill.attr('id') + ')';
			} else {
				shapeStyle = shapeStyle + '**' + KTCE.filter + '**';
			}
			
			if(KTCE.filter != ''){
				shapeStyle = shapeStyle + '**' + 'url(#' + KTCE.filter.attr('id') + ')';
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
				
				if(arrCode[1] != undefined){
					var defsHtml = $('#paper1').children('defs').html();
					defsHtml = defsHtml + arrCode[1];					
					$('#paper1').children('defs').html(defsHtml);
				}				
				if(arrCode[2] != undefined){
					$(rect.node).attr('fill', arrCode[2]);
				}
				if(arrCode[3] != undefined){
					$(rect.node).attr('filter', arrCode[3]);
				}
				
			} else {
				$(rect.node).css({
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

	KTCE.tableStyleEditor = editor;

})();