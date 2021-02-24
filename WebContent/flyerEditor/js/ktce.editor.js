
/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE Editor 기능
* 설명     : KTCE Editor 기능 함수 정의
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/


/*
 * KTCE Editor
 * @Package
 * @Description : KTCE Editor 기능
 * @Class
 *		Section: 실행
 *		Section: 공통 문서 기능
 *		Section: DO, UNDO
 *		Section: 오브젝트 기능
 *		Section: 도형
 *	 	Section: freeTransform 기능
 *		Section: 찜 기능
 *		Section: 배경 및 이미지
 *		Section: 텍스트 기능
 *		Section: 테이블 기능
 *		Section: SVG 페이퍼
 *		Section: 저장 및 로드
 *		Section: Class Method
 *
 **/
(function() {
	var selectedImageArray = [];
	var clicking = false;
	var canvasDrag = false;
	var canvasOn= false;
	var virtualAreaStartPos ={
		top : 0,
		left : 0
	};
	var textEditMode = false;
	var textCellEditMode = false;
	var tcInterval = undefined;	
	var verticalAlignFlag = true;		
	var baseFontSize = (KTCE.paperInfo.hwYn == "Y") ? 600 : 20;
	var _baseFont = 'KTfontBold';
	
	var browserType = getBrowserType();
	var editor = function() {

		/******************************************************************************/
		// Section: 변수
		/******************************************************************************/

		var layerTrigger = {
				all : $('.functions button').filter(function() {
					if ( $(this).hasAttr('data-target') ) {
						return $(this);
					}
				})
				, addShape : $('#addShape')
				, fillShape : $('#fillShape')
				, shapeStroke : $('#shapeStroke')
				, shapeStrokeWidth : $('#shapeStrokeWidth')
				, customStyle : $('#customStyle')			
				, createTable : $('#addTable')				
				, fillTable : $('#fillTable')	
				, tableCellStroke : $('#tableStroke')
				, tableCellStrokeWidth : $('#tableStrokeWidth')
				, tableCellStrokeDisplay : $('#tableStrokeDisplay')
				, tableCellMerge : $('#tableCellMerge')
				, tableCellSeparate : $('#tableCellSeparate')
				, addTextBox : $('#addTextBox')
			}
			, layer = {
				all : $('.layer')
				, addShape : $('.shapeLayer')
				, fillShape : $('.fillLayer')
				, shapeStroke : $('.strokeFillLayer')
				, shapeStrokeWidth : $('.strokeWidthLayer')
				, customStyle : $('.customStyleLayer')				
				, createTableLayer : $('.createTableLayer')						
				, tableCellFill : $('.tableCellFillLayer')	
				, tableCellStroke : $('.tableCellStrokeFillLayer')
				, tableCellStrokeWidth : $('.tableCellStrokeWidthLayer')
				, tableCellStrokeDisplay : $('.tableCellStrokeDiaplayLayer')
				, tableCellMerge : $('.merge')
				, tableCellSeparate : $('.separate')

				, letterSpacingLayer : $('.letterSpacingLayer')
				, fontColorLayer : $('.fontColorLayer')
				, lineHeightLayer : $('.lineHeightLayer')
				, objectAlign : $('.objectAlignLAyer')
				, contextMenu : $('.contextMenu')
				, tempSave : $('#temporarySave')
				, textStyle : $('#textStyleLayer')
				, shapeStyle : $('#shapeStyleLayer')
				, tableStyle : $('#tableStyleLayer')
				, bulletPointsLayer : $(".bltLayer")

			}
			, trigger = {
				addShape : $('#shapeLayer button')
				, fillShape : layer.fillShape.find('button')
				, shapeStroke : layer.shapeStroke.find('button')
				, shapeStrokeWidth : layer.shapeStrokeWidth.find('button')
				, customStyle : layer.customStyle.find('button')			
				, tableCellFill : layer.tableCellFill.find('button')
				, tableCellStroke : layer.tableCellStroke.find('button')
				, tableCellStrokeWidth : layer.tableCellStrokeWidth.find('button')
				, tableCellStrokeDisplay : layer.tableCellStrokeDisplay.find('button')				
				, addTextBox : $('#addTextBox')
				, fontWeight : $('#fontWeight')
				, fontItalic : $('#fontItalic')
				, fontSize : $('#fontSize')
				, fontSizeUp : $('#fontSizeUp')
				, fontSizeDown : $('#fontSizeDown')
				, fontFamily : $('#fontFamily')
				, fontShadow : $('#fontShadow')
				, letterSpacing : layer.letterSpacingLayer.find('button')
				, fontColor : layer.fontColorLayer.find('button')
				, textUnderline : $('#textUnderline')
				, textBulletPoints : layer.bulletPointsLayer.find('button')
				, tabPrev : $('.tabPrev')
				, tabNext : $('.tabNext')
				, textAlignLeft : $('#textAlignLeft')
				, textAlignRight : $('#textAlignRight')
				, textAlignCenter : $('#textAlignCenter')
				, textAlignTop : $('#textAlignTop')
				, textAlignMiddle : $('#textAlignMiddle')
				, textAlignBottom : $('#textAlignBottom')				
				, lineHeight : layer.lineHeightLayer.find('button')
				, objectCut : $('.objectCut')
				, objectDelete : $('.objectDelete')
				, objectCopy : $('.objectCopy')
				, objectPaste : $('.objectPaste')
				, objectZindex : $('.zIndex button')
				, objectAlign : layer.objectAlign.find('.align button')
				, addImage : $('#addImage')
				, imageCut : $('#imageCut')				
				, addImageToCanvas : $('#addImageToCanvas')
				, tempSave : $('#tempSaveTrigger')
				, unDo : $('#unDo')
				, reDo : $('#reDo')
				, goNext : $('#nextStage')
				, goPrev : $('#prevStage')
				, textStyle : null
				, shapeStyle : $('.shapeStyle')
				, tableStyle : null
				, guideRuler : $('.display.guideRuler')
				, guideLine : $('.display.guideLine')
				, setting : $('.setting')
				, objectGrouping : $(".objectGrouping")		//그룹지정
				, objectReGrouping : $(".objectReGrouping")	//재그룹
				, objectUnGrouping : $(".objectUnGrouping")	//그룹해제
				, objectOpacity : $(".objectOpacity")		//투명도
				, objectRotate : $(".objectRotate")			//회전
				, objectLock : $(".objectLock")				//잠금
			}
			, colorIndicator = $('.colorPattern').find('.crColor')
			, fillColorIndicator = colorIndicator.filter(function(){
				if ( $(this).parents('.fillLayer').length ) return $(this);		
				if ( $(this).parents('.tableCellFillLayer').length ) return $(this);
			})
			, strokeColorIndicator = colorIndicator.filter(function(){
				if ( $(this).parents('.strokeFillLayer').length ) return $(this);
				if ( $(this).parents('.tableCellStrokeFillLayer').length ) return $(this);
			})
			, motionSpeed = {
				layer : 150
			}
			, objectCache = null

		/******************************************************************************/
		// Section: 실행
		/******************************************************************************/
		// initialization
		function initPage() {
			// 기능 바인딩
			fnBinding();
		}

		function fnBinding() {

			// 문서의 이벤트 컨트롤
			fnDocumentBind();

			// 레이어 트리거 바인딩
			fnTriggerBinding();

			// 도형 추가 트리거 바인딩
			fnAddShapeBinding();

			// shape fill 트리거 바인딩
			fnShapeFillBinding();

			// shape stroke color 트리거 바인딩
			fnShapeStrokeBinding();

			// shape stroke width 트리거 바인딩
			fnStrokeWidthBinding();

			// 이미지 브라우저 바인딩
			fnImageBrowser();

			// 배경 브라우저 바인딩
			fnBgBrowser();

			// 임시저장 기능
			fnTempSave();

			// 텍스트 상자 추가
			fnTextBox();

			// 텍스트 기능 바인딩
			fnTextFunctions();

			// 찜목록
			fnFavoriteObject();

			// 테이블 기능
			fnCreateTable();
	
			// Table fill 트리거 바인딩
			//fnTableFillBinding();
			fnFillBinding(trigger.tableCellFill);

			// Table stroke color 트리거 바인딩
			//fnTableStrokeBinding();
			fnStrokeBinding(trigger.tableCellStroke);

			// Table stroke width 트리거 바인딩
			//fnTableWidthBinding();
			fnLineStrokeWidthBinding(trigger.tableCellStrokeWidth);
			// Table 테두리
			fnLineStrokeDisplayBinding(trigger.tableCellStrokeDisplay);
			
			//셀 병합
			fnTableCellMergeBinding(layer.tableCellMerge);
			
			//셀분할
			fnTableCellSeparateBinding(layer.tableCellSeparate);

			// 폰트 셀렉트 바인딩
			fnCreateUISelect();

			// 오브젝트 cut, delete, copy, paste 기능
			fnEditObject();

			// 오브젝트 zIndex
			fnObjectZindex();
			fnObjectAlign();
			

			// 페이지 이동 버튼 바인딩
			fnGoStage();

			// 커스텀 스타일 세팅
			fnCustomStyleSet();

			// 눈금자, 눈금선 
			fnGuideSet();

			// do, unDo
			fnDoUndo();
			
			// 오브젝트 그룹, 재그룹, 그룹해제 기능 바인딩
			fnObjectGroupingBinding();
			
			// 상태저장 함수 전역 함수로 바인딩
			KTCE.saveState = fnSaveState;

			// 정보 업데이트 함수 전역 함수로 바인딩
			KTCE.updateData = fnUpdateDataObject;

			// update text postion in table, for golbal
			KTCE.updateTextPositionInTable = fnUpdateTextPositionInTable; 

			KTCE.checkTextToCell = fnCheckTextToCell;

		}

		/******************************************************************************/
		// Section: 공통 문서 기능
		/******************************************************************************/
		var selectMultiObjectFlag = false;
		

		// Text multi 선택 서식적용 활성화 여부
		function textMultiSelectCheck() {
			var selectedTextFlag=true;
			$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el) {
				if(!el.hasClass('textBoxWrap')) {
					selectedTextFlag=false;
				}
			})
			if(selectedTextFlag){
				$(".col3disabled").hide();
				$(".col4disabled").hide();
				selectMultiObjectFlag = true;
			}else{
				selectMultiObjectFlag = false;
			}
		}
	
		function selectMultiObject(mArea){
			hideAllHandler();
			if(mArea.height != "0" && mArea.width != "0"){
				var shapeArray = KTCE.currentPaper.objWrap.children();
				for(var i=0; i<shapeArray.length; i++){
					if(shapeArray[i].freeTransform != undefined && shapeArray[i].freeTransform.bbox != null){
						var cs = {
							top : calTop(shapeArray[i]),
							left : calLeft(shapeArray[i]),
							width : shapeArray[i].freeTransform.bbox.node.getBBox().width,
							height : shapeArray[i].freeTransform.bbox.node.getBBox().height,
						}
						if(parseFloat(mArea.y) <= cs.top && parseFloat(mArea.x) <= cs.left){
							if(parseFloat(mArea.y) + parseFloat(mArea.height) >= cs.top + cs.height){
								if(parseFloat(mArea.x) + parseFloat(mArea.width) >= cs.left + cs.width){
									KTCE.currentPaper.selectedShapeArray.push(shapeArray[i]);
									shapeArray[i].data('hasHandle', true);
									shapeArray[i].freeTransform.visibleHandles();
								}
							}
						}
					}
				}
				$(".col13Disabled").hide();
				if(KTCE.currentPaper.selectedShapeArray.length == 1){
					KTCE.currentPaper.currentShape = KTCE.currentPaper.selectedShapeArray[0];

					//그룹핑된 객체 drag 선택시값 지정 
					if($(KTCE.currentPaper.selectedShapeArray[0].node).attr('data-name') =='objectGroup') {
						KTCE.currentPaper.selectedShapeArray[0] = KTCE.currentPaper.selectedShapeArray[0];
					}else{
						KTCE.currentPaper.selectedShapeArray = [];
					}

				}else if(KTCE.currentPaper.selectedShapeArray.length > 1){
					//텍스트 drag multi선택시 서식 활성화 여부판단
					textMultiSelectCheck();
				} else if(KTCE.currentPaper.selectedShapeArray.length < 1){
					iconBarDisabled();
				}
			}
		}

		var virtualGroup = undefined;
		var virtual = undefined;
		var lockObjClicking = false;
		var lockDragFlag = false;
		function multiSelectdragEvent(obj){
			$(obj).mousedown(function(e){
				//CI/BI영역 편집 BlOCKING 처리
				if(KTCE.editorBlockFlag)return;
				
				if(KTCE.textCreating )return; 
				/*
				try{
					if(KTCE.currentPaper.currentShape != null) {
						if(KTCE.currentPaper.currentShape.freeTransform.isLock(KTCE.currentPaper.currentShape)) {
							lockObjClicking = true;
						}
					}
				}catch(e){}
				*/
				if(KTCE.currentPaper.currentShape == null || canvasOn || lockObjClicking){
					var _x, _y;
					if(lockObjClicking && browserType.indexOf('msie') > -1) {	//IE
						var ratio = parseFloat($(".screenSizer .uiDesignSelect1 .uiDesignSelect-text").html().split("%")[0])/100;
						//주의: KTCE.currentPaper.s.node에 대한 postion값 사용 금지
						var svgPosition = $("#" + KTCE.currentPaper.s.node.id + " #svgBgWhite").position();
						_x = (e.pageX - svgPosition.left) / ratio;
						_y = (e.pageY - svgPosition.top) / ratio;
					}else{
						_x = e.offsetX;
						_y = e.offsetY;
					}
					clicking = true;
					if(virtualGroup != undefined) virtualGroup.remove();
					virtualAreaStartPos = {
						top : e.pageY,
						left : e.pageX,
						x : _x,
						y : _y
					}
					
					virtualGroup = KTCE.currentPaper.s.g().attr('id', 'virtualRect');
					virtual = virtualGroup.rect(virtualAreaStartPos.x,virtualAreaStartPos.y,0,0);
					virtual.attr("style", "fill-opacity: 0; stroke: gray; stroke-width: 1px; stroke-dasharray: 5,5;");
				}
			}).mousemove(function(e){
				
				if(KTCE.textCreating )return; 
					
				if(clicking && virtual != undefined){
					var ratio = parseFloat($(".screenSizer .uiDesignSelect1 .uiDesignSelect-text").html().split("%")[0])/100;;
					if(e.pageX < virtualAreaStartPos.left && e.pageY < virtualAreaStartPos.top){
						virtual.attr({
							x : virtualAreaStartPos.x - (virtualAreaStartPos.left - e.pageX)/ratio,
							y : virtualAreaStartPos.y - (virtualAreaStartPos.top - e.pageY)/ratio,
							width : (virtualAreaStartPos.left - e.pageX) / ratio,
							height : (virtualAreaStartPos.top - e.pageY) / ratio
						});
					} else if(e.pageX > virtualAreaStartPos.left && e.pageY > virtualAreaStartPos.top){
						virtual.attr({
							width : (e.pageX - virtualAreaStartPos.left)/ratio,
							height : (e.pageY - virtualAreaStartPos.top)/ratio,
						});
					} else if(e.pageX > virtualAreaStartPos.left && e.pageY < virtualAreaStartPos.top){
						virtual.attr({
							x : virtualAreaStartPos.x,
							y : virtualAreaStartPos.y - (virtualAreaStartPos.top - e.pageY)/ratio,
							width : (e.pageX - virtualAreaStartPos.left) / ratio,
							height : (virtualAreaStartPos.top - e.pageY) / ratio
						});
					} else if(e.pageX < virtualAreaStartPos.left && e.pageY > virtualAreaStartPos.top){
						virtual.attr({
							x : virtualAreaStartPos.x - (virtualAreaStartPos.left - e.pageX)/ratio,
							y : virtualAreaStartPos.y,
							width : (virtualAreaStartPos.left - e.pageX) / ratio,
							height :  (e.pageY - virtualAreaStartPos.top) / ratio
						});
					}
					canvasDrag = true;
					var _w = parseInt(virtual.attr('width'));
					var _h = parseInt(virtual.attr('height'));
					lockDragFlag = (_w > 10 || _h > 10) ? true : false;
				}
			}).mouseup(function(e){
				
				if(KTCE.textCreating )return; 
				
				if(virtual != undefined){
					var virPos = virtual.attr();
					virtualGroup.remove();
					virtualGroup = undefined;
					virtual = undefined;
					if(!lockObjClicking || lockDragFlag) {
						selectMultiObject(virPos);
					}
				}
				
				lockDragFlag = false;
				lockObjClicking = false;
				clicking = false;
				canvasOn= false;
			});
		}
		
		// 문서 이벤트
		function fnDocumentBind() {
			// 창 닫으려 할 때 경고
			window.onbeforeunload = function() {
				return '아직 저장되지 않은 정보가 있을 수 있습니다.';
			}

			$(document).on({

				'click.layerControl' : function(e) {
					var e = e || window.event
						, target = $(e.target)
					if ( !target.parents('.functionList').length ) {
						layer.all.stop(true, true).slideUp(motionSpeed.layer);
						layerTrigger.all.removeClass('active');
					}
				}
			
				// handler 감추는 기능
				, 'click.handlerControl' : function(e) {

					if(e.target.id == 'svgBgWhite' || e.target.id == 'svgBg') {
						handlerFlag = true;
						selectMultiObjectFlag = false;
					}else{
						handlerFlag = false;
					}
				
					var e = e || window.event
						, target = $(e.target)
						
					if ( target.hasClass('paperFrame')){ // || e.target.tagName == 'svg' ) {		
						if ( !KTCE.textCreating && !KTCE.tableCellDragFlag ) {
							// freeTransform handler 감춤
							hideAllHandler(KTCE.currentPaper);
							fnTableCellFillReset();
						}
						
						// 테이블 셀 드래그 제거
						KTCE.tableCellDragFlag = false;
						
						// 레이어 트리거 active class 제거
						layerTrigger.all.removeClass('active');
					}
				}
				, 'click.contentMenuControl' : function(e) {
					
					var e = e || window.event
						, target = $(e.target)

					if ( target.hasClass('paperFrame') || e.target.tagName == 'svg' ) {
						layer.contextMenu.hide();
					}
				}
				, 'mousedown.contextMenuControl' : function(e) {
					var e = e || window.event
						, target = $(e.target)

					if ( !(target.parents('.screenLayer').length || target.hasClass('paperWrapper') || target.hasClass('screenLayer') || target.parents('.header').length || target.hasClass('dimmLayer') ) ) {
						if ( e.which == 3 ) {
							var pX = e.pageX + 10
								, pY = e.pageY + 10
							
							if(pY + layer.contextMenu.height() > $(document).height()){
								pY = e.pageY - layer.contextMenu.height();
							}
							
							//표 객체 회전모드 사용금지적용
							try {
								if(KTCE.currentPaper.currentShape != null) {
									if($(KTCE.currentPaper.currentShape.node).attr('data-name') == 'xTable') {
										layer.contextMenu.find('button.objectRotate').attr('disabled', true).css('opacity', 0.3);
									}else{
										layer.contextMenu.find('button.objectRotate').removeAttr('disabled style')
									}
									
									var obj = KTCE.currentPaper.currentShape;
									var contextMenuLockElement = layer.contextMenu.find("button.objectLock>img");
									var contextMenuLockElementSrc = contextMenuLockElement.attr('src');
									if(obj.freeTransform.isLock(obj)){
										var tempArr = contextMenuLockElementSrc.split("_on");
										var newSrc = tempArr.join("_off");
										
										//contextMenu:잘라내기/삭제/복사/붙이기 사용잠금
										layer.contextMenu.find('button.objectCut').attr('disabled', true).css('opacity', 0.3);
										layer.contextMenu.find('button.objectDelete').attr('disabled', true).css('opacity', 0.3);
										layer.contextMenu.find('button.objectCopy').attr('disabled', true).css('opacity', 0.3);
										layer.contextMenu.find('button.objectPaste').attr('disabled', true).css('opacity', 0.3);
										//도구모음:잘라내기/삭제/복사/붙이기 잠금해제
										$('div.functions button.objectCut').attr('disabled', true).css('opacity', 0.3);
										$('div.functions button.objectDelete').attr('disabled', true).css('opacity', 0.3);
										$('div.functions button.objectCopy').attr('disabled', true).css('opacity', 0.3);
										$('div.functions button.objectPaste').attr('disabled', true).css('opacity', 0.3);
										
										//투명도/회전 사용잠금
										layer.contextMenu.find('button.objectOpacity').attr('disabled', true).css('opacity', 0.3);
										layer.contextMenu.find('button.objectRotate').attr('disabled', true).css('opacity', 0.3);
									}else{
										var tempArr = contextMenuLockElementSrc.split("_off");
										var newSrc = tempArr.join("_on");
										
										//contextMenu:잘라내기/삭제/복사/붙이기 잠금해제
										layer.contextMenu.find('button.objectCut').removeAttr('disabled style');
										layer.contextMenu.find('button.objectDelete').removeAttr('disabled style');
										layer.contextMenu.find('button.objectCopy').removeAttr('disabled style');
										layer.contextMenu.find('button.objectPaste').removeAttr('disabled style');
										//도구모음:잘라내기/삭제/복사/붙이기 잠금해제
										$('div.functions button.objectCut').removeAttr('disabled style');
										$('div.functions button.objectDelete').removeAttr('disabled style');
										$('div.functions button.objectCopy').removeAttr('disabled style');
										$('div.functions button.objectPaste').removeAttr('disabled style');
										
										//투명도/회전 잠금해제
										layer.contextMenu.find('button.objectOpacity').removeAttr('disabled style');
									}
									if(newSrc.length > 0) {
										contextMenuLockElement.attr('src', newSrc);
									}
								}
							}catch(e) {}
							
							layer.contextMenu.css({
								left : pX
								, top : pY
							}).show();
						} else {
							layer.contextMenu.hide();
						}
					} else {
						layer.contextMenu.hide();
					}

				}
				, 'mousedown.tableCell' : function(e) {
			
					var e = e || window.event
						, target = $(e.target)

					if ( target.hasClass('xCell') ) {
						//console.log(target[0]);
					}

				},

				'keydown.freeTransform': function(e) {
					if (e.keyCode == 46){ //press delete key
						if(!textEditMode && !textCellEditMode) fnObjDelete();
					}
					else if (e.ctrlKey && e.keyCode == 88){ // press ctrl + x
						fnObjCut();
					}
					else if (e.ctrlKey && e.keyCode == 67){ // press ctrl + c
						fnObjCopy();
					}
					else if (e.ctrlKey && e.keyCode == 86){ // press ctrl + v
						fnObjPaste();
					}
					else if(e.keyCode >= 37 && e.keyCode <=40){ //subJect Move
						if(!textEditMode && !textCellEditMode){
							e.preventDefault(); 
							if ( KTCE.currentPaper.selectedShapeArray.length > 1){
								for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
									fnObjMove(KTCE.currentPaper.selectedShapeArray[i], e.keyCode, 5);
								}
							} else if(KTCE.currentPaper.currentShape!=null){
								fnObjMove(KTCE.currentPaper.currentShape, e.keyCode, 5);
							} 
						}
					}
				},
				
				'keydown' : function(e) {
					if ( e.ctrlKey && e.keyCode == 90 ) {// press ctrl + z	unDo
						if(!textEditMode && !textCellEditMode){
							if(!$('#unDo').hasClass('unbind'))$('#unDo').trigger('click');
						}
					}
					if ( e.ctrlKey && e.keyCode == 89 ) {// press ctrl + z reDo
						if(!textEditMode && !textCellEditMode){
							if(!$('#reDo').hasClass('unbind'))$('#reDo').trigger('click');
						}
					}
					if (e.keyCode == 27 ) {// esc 모드 해제(텍스트 추가모드)
						if(KTCE.textCreating){
							$('body').removeClass('textCreating');
							KTCE.textCreating = false;
							return false;
						}
					}
				}			
			});
		}

		// 레이어 보이기 기능
		function fnTriggerBinding() {
			layerTrigger.all.each(function() {
				var _this = $(this)
					, thisLayer = $(_this.attr('data-target'))

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

		// 눈금자, 눈금선
		function fnGuideSet() {
			// 눈금자
			trigger.guideRuler.on({
				click : function() {
					if ( $('.rulerBg').is(':hidden') ) {
						$('.rulerBg').show();
						$('.rulerHBg').show();
						$('.col7 .guideRuler').addClass('on');
					} else {
						$('.rulerBg').hide();
						$('.rulerHBg').hide();
						$('.col7 .guideRuler').removeClass('on');
					}
				}
			});

			// 눈금선
			trigger.guideLine.on({
				click : function() {
					if ( !$('.guideLine').hasClass('on') ) {
						$(".paperFrame svg #svgBgWhite").css('opacity', 0);	//그룹핑
						$(".paperFrame svg #svgBg").hide();
						$(".paperFrame svg").css({"background":""});
						$(".paperFrame svg").css({"background-image":"url('/flyerEditor/images/common/bg_grid.png')"});
						$('.col7 .guideLine').addClass('on');
					} else {
						$(".paperFrame svg").css({"background":""});
						$(".paperFrame svg #svgBg").attr("xlink:href");
						$(".paperFrame svg #svgBgWhite").css('opacity', 1);
						
						// 눈금자 해제시 원복처리
						/*
						//2020-04
						$(".paperFrame svg #svgBg").each(function(idx, el){
							if($(el).attr("xlink:href") !=""){
								$(el).show();
							}else{
								$(el).hide();
							}
						});
						*/
						// 2020-05: 눈금자 해제시 배경 이미지 원복처리 및 유효성 검증
						setPaperSVGBackGroundDisplay();
						
						
						$('.col7 .guideLine').removeClass('on');
					}
				}
			});

		}

		// 모든 페이퍼에 마우스 오버 이벤트 바인딩
		function fnPaperMouseEventBind() {
			KTCE.paperArray.forEach(function(el, i) {
				el.s.unmousemove(fnPaperMoveEvent);
				el.s.mousemove(fnPaperMoveEvent);
			});
		}

		// 마우스오버 이벤트
		function fnPaperMoveEvent(event) {
			KTCE.position = {
				x : event.offsetX
				, y : event.offsetY
			}
		}

		/******************************************************************************/
		// Section: DO, UNDO
		/******************************************************************************/

		// do, undo
		function fnDoUndo() {
			// 상태저장할 behavior
			// 도형 추가, 도형 이동, 앞뒷면 추가, 이미지 자르기, 각종 스타일 적용(텍스트 behavior, table behavior), cut, paste, copy, delete

			// 상태저장
			// fnSaveState()

			// 현재 상태 stack 확인
			$('#checkState').on({
				click : function() {

					for ( var i in KTCE.stateStack ) {
						(function() {
							var data = KTCE.stateStack[i].svg[0]
						})();
					}

				}
			});

			trigger.unDo.on({
				click : function() {
					if ( !KTCE.restoreFlag ) {
						if ( KTCE.stateStack.length > 1 ) {
							fnUnDo();
						} else {
							console.log('no more undo');
						}
					}
				}
			});

			trigger.reDo.on({
				click : function() {
					if ( !KTCE.restoreFlag ) {
						if ( KTCE.reDoStack.length > 0 ) {
							fnReDo();
						} else {
							console.log('no more redo');
						}
					}
				}
			});

			fnSetDoUndoButton();
		}

		// do, undo 목록에 따라 버튼 바인딩 해제
		function fnSetDoUndoButton() {

			if ( KTCE.stateStack.length > 1 ) {
				trigger.unDo.removeClass('unbind');
			} else {
				trigger.unDo.addClass('unbind');
			}

			if ( KTCE.reDoStack.length > 0 ) {
				trigger.reDo.removeClass('unbind');
			} else {
				trigger.reDo.addClass('unbind');
			}

		}

		// 현재 페이퍼 상태 저장
		function fnSaveState(action) {
			KTCE.reDoStack = [];
			
			var tempArray = []
				, cPageIdx = fnGetIdxOfPaper(KTCE.currentPaper);
			if(action == "load") {
				cPageIdx = 0;
				setTimeout(function() {
					delayDtateStack();
				}, 1000);
			}else{
				delayDtateStack();
			}
			
			function delayDtateStack() {
				for ( var i in KTCE.paperArray ) {
					tempArray.push(KTCE.paperArray[i].s.outerSVG());
				}

				KTCE.stateStack.push({
					svg : tempArray
					, cPageIdx : cPageIdx
				});

				if ( KTCE.stateStack.length >= 7 ) KTCE.stateStack.shift();

				fnSetDoUndoButton();
			}
		}

		// 이전 상태로 돌린다
		function fnUnDo() {
			KTCE.restoreFlag = true;
			var p = KTCE.stateStack.pop();
			if ( KTCE.stateStack.length > 0 ) {
				KTCE.reDoStack.push(p);
			}
			fnRestoreState(KTCE.stateStack[KTCE.stateStack.length-1]);
			//원본
			//KTCE.progress.footer(Number($("#sizeOption").val()));		//chrome에서 비정상적으로 select값을 못 받아옴(특히, 100%)
			var sizeValue = $('#sizeOption > option[selected="selected"]').val();
			KTCE.progress.footer(Number(sizeValue));			
			fnSetDoUndoButton();
		}

		// 원래 상태로 한 단계 돌아온다.
		function fnReDo() {
			KTCE.restoreFlag = true;
			var p = KTCE.reDoStack.pop();
			KTCE.stateStack.push(p);
			fnRestoreState(KTCE.stateStack[KTCE.stateStack.length-1]);
			//원본
			//KTCE.progress.footer(Number($("#sizeOption").val()));		//chrome에서 비정상적으로 select값을 못 받아옴(특히, 100%)
			var sizeValue = $('#sizeOption > option[selected="selected"]').val();
			KTCE.progress.footer(Number(sizeValue));			
			fnSetDoUndoButton();
		}

		// 입력된 paper가 몇번째인지 반환
		function fnGetIdxOfPaper(obj) {
			var idx = null;

			for ( var i in KTCE.paperArray	) {
				if ( obj.s.id == KTCE.paperArray[i].s.id ) {
					idx = i;
				}
			}

			return idx;

		}

		// pure SVG를 parsing하여 복원
		function fnRestoreState(state) {		
			var pSVG = [];
			if ( state.svg.length ) {
				
				// 현재 페이퍼 모두 제거
				$('.paperFrame').remove();
				KTCE.paperArray = [];
				KTCE.currentPaper = null;
				for ( var i in state.svg ) {
					var s = $(state.svg[i])
	  				 , id = s.attr('id')
					fnRestorePaperCreate(id, KTCE.paperInfo.canvasType, KTCE.paperInfo.canvasSize, state.svg[i], i);
				}
				
				setPaperViewForRestore(state.cPageIdx);
			}
		}

		function setPaperViewForRestore(idx){
			KTCE.currentPaper = KTCE.paperArray[idx];
			for(var i=0; i<$(".paperControl button").length; i++){
				$($(".paperControl button")[i]).removeClass('active');
				if(i == idx) $($(".paperControl button")[i]).addClass('active');
			}
			if(KTCE.paperArray.length == 1){
				$(".paperControl .changer").hide();
				$(".paperControl .controls button").hide();
				$($(".paperControl .controls button")[0]).show();
			}else{
				$(".paperControl .changer").show();
				$(".paperControl .controls button").hide();
				$($(".paperControl .controls button")[1]).show();
			}
			
			for(var i=0; i<$(".paperFrame").length; i++){
				$($(".paperFrame")[i]).hide();
				if(i == idx) $($(".paperFrame")[i]).show();
			}
			if(KTCE.paperInfo.hwYn == 'Y'){
					fnHandPaperChange();
			}
		}

		// SVG 전체 내용을 받아 핸들러를 제거하고 object, cover, data로 반환	
		function fnReturnOriginSVG(obj) {
			var tempObj = Snap.parse(obj)
				, objectSVG = null
				, coverSVG = null
				, dataSVG = null

			objectSVG = tempObj.select('.objectGroup').innerSVG();

			if ( tempObj.select('.dataGroup') ) {
				dataSVG = tempObj.select('.dataGroup').innerSVG();
			}

			coverSVG = tempObj.select('.cover').outerSVG();

			return {
				objectSVG : objectSVG
				, coverSVG : coverSVG
				, dataSVG : dataSVG
			}
		}

		// 복원시킬 페이퍼 생성
		function fnRestorePaperCreate(id, type, size, svgHTML, idx) {
			
			loadParseObjectState ='N';
		
			var paper = {}
				, svgText = '<div class="paperFrame"><svg id="'
					+ id
					+ '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
			
			if(KTCE.paperInfo.hwYn == 'N'){
				svgText +='<rect id="svgBgWhite" width="100%" height="100%" style="fill:rgb(255, 255, 255)"/>'
					+ '<image id="svgBg" class="bgImg" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" style="display:none" ></image>'
			}

			if(KTCE.paperInfo.hwYn == 'Y' && $(svgHTML).find('g').filter('.cover') == undefined){
				svgText +='<rect id="svgBgWhite" width="100%" height="100%" style="fill:rgb(255, 255, 255)"/>'
					+ '<image id="svgBg" class="bgImg" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" style="display:none" ></image>'
			}
			
			svgText +='</svg></div>';
			
			var objSvgText = $(svgText);
			objSvgText.find("#svgBgWhite, #svgBg").on("mousedown",function(e){
				canvasOn= true;
			});
			objSvgText.find("#svgBgWhite, #svgBg").on("click", function(e){
				canvasOn= false;
				if(!clicking && !canvasDrag)
				hideAllHandler();	
			});

			multiSelectdragEvent(objSvgText);

			var svgObj = $(objSvgText).appendTo($('.paperWrapper'));
			svgObj = svgObj.find('svg');
			
			var s = Snap(svgObj[0])
				, objOuter = s.g().attr({ class : 'objOuter' })
				, objWrap = objOuter.g().attr({ class : 'objectGroup' })
				, dataWrap = s.g().attr({ class : 'dataGroup' })
				, lockObjWrap = s.g().attr({ class : 'lockObjGroup' })
				, scaleFlag = false
				, shapeArray = []
				, width = getPaperSize(800, type, size).width
				, height = getPaperSize(800, type, size).height

			// SVG 기본 세팅
			s.attr({
				width : width
				, height : height
				, viewbox : '0 0 ' + width + ' ' + height
			});

			// 프로퍼티 설정
			paper.s = s;
			paper.objOuter = objOuter;
			paper.objWrap = objWrap;
			paper.dataWrap = dataWrap;
			paper.lockObjWrap = lockObjWrap;
			paper.scaleFlag = scaleFlag;
			paper.shapeArray = shapeArray;
			paper.currentShape = null;
			paper.selectedShapeArray = [];
			paper.thisSVG = $(s.node);
			paper.Parent = $(s.node).parent();
			paper.width = width;
			paper.height = height;
			paper.textBox = null;
			paper.imageArray = [];
			paper.tableArray = [];
			paper.currentStateIdx = 0;
			paper.stateArray = '';
			paper.size = size;
			paper.type = type;
			paper.tmptId = KTCE.paperInfo.tmptId;

			// paperArray에 추가
			KTCE.paperArray.push(paper);
			KTCE.currentPaper = paper;

			var frontObj = $(svgHTML).find('g').filter('.objectGroup').children();

			frontObj.each(function() {
				var _thisHTML = $('<div></div>').append($(this).clone()).html()
					, _obj = Snap.parse(_thisHTML)
					, svgObj = paper.objWrap.append(_obj);
			});
			
			//cursor hidden 처리
			var cursor = svgObj.find("g.text-cursor");
			if(cursor.length>0)
				$(cursor).attr("style", "display:none");
			
			// 앞면 data parse
			var frontData = $(svgHTML).find('g').filter('.dataGroup').children();

			frontData.each(function() {
				var _thisHTML = $('<div></div>').append($(this).clone()).html()
					, _obj = Snap.parse(_thisHTML)
					, svgObj = paper.dataWrap.append(_obj);
			});
			
			// lock data parse
			var frontLockObjGroup = $(svgHTML).find('g').filter('.lockObjGroup').children();
			frontLockObjGroup.each(function() {
				var _thisHTML = $('<div></div>').append($(this).clone()).html()
					, _obj = Snap.parse(_thisHTML)
					, svgObj = paper.lockObjWrap.append(_obj);
			});
			
			//빈 커버데이터 발생대응
			if(KTCE.paperInfo.hwYn == 'N'){
				var getCover = "";
				var coverObj = $(svgHTML).find('g').filter('.cover').children();
				var coverWrap = paper.s.g().attr({class: 'cover'});
				 $(coverWrap.node).append(coverObj);
			}

			//filter효과 parsing			
			fnParseEffect($(".paperWrapper .paperFrame:eq(" + idx + ")").find('svg'), idx, svgHTML);
			
			paper.objWrap.children().forEach(function(el, i) {
				switch(el.attr('class')) {
					case 'hasDataGroup hasData' :	//그룹핑
						fnSetFreeTransform(el);
						el.selectAll('.xTable').forEach(function(_el, idx){
							fnInitializeTableStrokeWidth(_el);
						});
						break;
					case 'xTable hasData' :
						if(el.attr('tablex')) {
							var _tableX = el.attr('tablex');
							var _tableY = el.attr('tabley');
						}
						//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
						fnInitializeTableStrokeWidth(el);
						break;
					default: 
						if(!(el.attr('class').indexOf("tableTextWrapper") > -1))
						fnSetFreeTransform(el);
				}
			});

			var bgImage = $(svgHTML).find("#svgBg").attr('xlink:href');
			if(bgImage != '') {
				addBgImageListener(bgImage,KTCE.paperArray.length)
			}	
			
			// IE11 도형등 크기를 늘렸을 때 스크롤 생기는 거 방지 .BY HS. 
			if(browserType.indexOf('msie') != -1) {
				$('svg:not(:root)').css("overflow", "hidden");
			}

			setTimeout(function() {
				KTCE.restoreFlag = false;
				fnBasicWorkCompleteCallback();
			}, 5);

		}

		// 복원된 페이퍼에 오브젝트 파싱
		function fnRestorePaperObjectParse(paper, objectSVG) {

			if ( $('svg#fakeSVG'+paper.s.node.id).length ) $('svg#fakeSVG'+paper.s.node.id).remove();

			$('<svg id="fakeSVG'+paper.s.node.id+'"></svg>').appendTo('body').hide();

			var fakeSVG = Snap('#fakeSVG'+paper.s.node.id)
				, o = Snap.parse(objectSVG)
				, g = fakeSVG.g().append(o)
				, obj = g.children()

			if ( obj.length ) {

				obj.forEach(function(el, i) {
					el.appendTo(paper.objWrap);
				});

				setTimeout(function() {
					paper.objWrap.children().forEach(function(el, i) {
						switch(el.attr('class')) {
							case 'textBox' :
								fnSetFreeTransformTextbox(el);
								break;
							case 'xTable' :
								fnSetFreeTransformTable(el);
								break;
							default:
								fnSetFreeTransform(el, 'resotre', undefined, paper);
						}

					});

					$('svg#fakeSVG'+paper.s.node.id).remove();
				}, 1);
			}
		}

		// 복원된 페이퍼에 데이터 파싱
		function fnRestoreDataParse(paper, dataSVG) {

			if ( $('svg#fakeSVG'+paper.s.node.id).length ) $('svg#fakeSVG'+paper.s.node.id).remove();

			$('<svg id="fakeSVG'+paper.s.node.id+'"></svg>').appendTo('body').hide();

			var fakeSVG = Snap('#fakeSVG'+paper.s.node.id)
				, o = Snap.parse(dataSVG)
				, g = fakeSVG.g().append(o)
				, obj = g.children()

			if ( obj.length ) {
				obj.forEach(function(el, i) {
					el.appendTo(paper.dataWrap);
				});
			}
		}

		/******************************************************************************/
		/* Section: 오브젝트 기능
		/******************************************************************************/

		
		// 오브젝트 move 기능
		function fnObjMove(obj, code, opt){
			// 그룹객체/잠금객체 키보드 이동금지
			if(obj.attr('data-name') === 'objectGroup' || obj.freeTransform.isLock(obj)) return;

			if($("#cropHandler_0").length > 0 ) {
				alert('그림 자르기 Mode에서는 이동 할 수 없습니다!!');
				return;
			}
			
			var tx = obj.freeTransform.attrs.translate.x;
			var ty = obj.freeTransform.attrs.translate.y;

			switch(code){
			case 37:
				tx = tx - opt;
				break;
			case 38:
				ty = ty - opt;
				break;
			case 39:
				tx = tx + opt;
				break;
			case 40:
				ty = ty + opt;

				break;
			}

			obj.transform([
				'R' + obj.freeTransform.attrs.rotate
				, obj.freeTransform.attrs.center.x
				, obj.freeTransform.attrs.center.y
				, 'S' + obj.freeTransform.attrs.scale.x
				, obj.freeTransform.attrs.scale.y
				, obj.freeTransform.attrs.center.x
				, obj.freeTransform.attrs.center.y
				, 'T' + tx
				, ty
			].join(','));


			obj.freeTransform.attrs.translate.x	= tx;	
			obj.freeTransform.attrs.translate.y	= ty;
			obj.freeTransform.updateHandles();

			KTCE.updateData(obj, obj.freeTransform.attrs);
			
			//키보드 방향키로 이동시 표와 표안 텍스트 위치이동
			if(obj.attr('data-name') == 'xTable' && !textCellEditMode) {
				var textAll = $("g.xTableTexts_" + obj.node.id).find('text');
				var underlineAll = $("g.xTableTexts_" + obj.node.id).find('g.textUnderLine>line');
				if(textAll.length>0){
					switch(code){
					case 37:
						textAll.each(function(idx, el){
							var $this = $(el);
							var textX = parseFloat($this.attr('x')) - opt;
							var initX = parseFloat($this.attr('data-initx')) - opt;
							$this.attr({'x': textX, 'data-initx': initX});
						});
						
						underlineAll.each(function(idx, el){
							var $this = $(el);
							var ulineX1 = parseFloat($this.attr('x1')) - opt;
							var ulineX2 = parseFloat($this.attr('x2')) - opt;
							$this.attr({'x1': ulineX1, 'x2': ulineX2});
							
						})
						break;
					case 38:
						textAll.each(function(idx, el){
							var $this = $(el);
							var textY = parseFloat($this.attr('y')) - opt;
							var initY = parseFloat($this.attr('data-inity')) - opt;
							$this.attr({'y': textY, 'data-inity': initY});
						});
						
						underlineAll.each(function(idx, el){
							var $this = $(el);
							var ulineY1 = parseFloat($this.attr('y1')) - opt;
							var ulineY2 = parseFloat($this.attr('y2')) - opt;
							$this.attr({'y1': ulineY1, 'Y2': ulineY2});
							
						})
						break;
					case 39:
						textAll.each(function(idx, el){
							var $this = $(el);
							var textX = parseFloat($this.attr('x')) + opt;
							var initX = parseFloat($this.attr('data-initx')) + opt;
							$this.attr({'x': textX, 'data-initx': initX});
						});
						
						underlineAll.each(function(idx, el){
							var $this = $(el);
							var ulineX1 = parseFloat($this.attr('x1')) + opt;
							var ulineX2 = parseFloat($this.attr('x2')) + opt;
							$this.attr({'x1': ulineX1, 'x2': ulineX2});
							
						})
						break;
					case 40:
						textAll.each(function(idx, el){
							var $this = $(el);
							var textY = parseFloat($this.attr('y')) + opt;
							var initY = parseFloat($this.attr('data-inity')) + opt;
							$this.attr({'y': textY, 'data-inity': initY});
							
						});
						
						underlineAll.each(function(idx, el){
							var $this = $(el);
							var ulineY1 = parseFloat($this.attr('y1')) + opt;
							var ulineY2 = parseFloat($this.attr('y2')) + opt;
							$this.attr({'y1': ulineY1, 'Y2': ulineY2});
							
						})

						break;
					}
					
				}
			}
		}
		
		// 오브젝트 delete 기능
		function fnObjDelete(){
			//font size 사용자 input 입력중이면..
			if(KTCE.inputFontSizeFocus) return;
			var _currentShape = [];
			try {
				var lockShapeArray = [];
				var obj = KTCE.currentPaper.currentShape;
				if(obj==null && KTCE.currentPaper.selectedShapeArray.length > 1) {
					for( var h in KTCE.currentPaper.selectedShapeArray ) {
						var obj = KTCE.currentPaper.selectedShapeArray[h];
						if(obj.freeTransform.isLock(obj)) {
							lockShapeArray.push(obj);
							alert('잠금객체는 삭제하기가 지원하질 않습니다!');
							continue;
						}else{
							_currentShape[h] = obj;
						}
					}
				}else{
					if(obj.freeTransform.isLock(obj)) {
						lockShapeArray[0] = obj;
						alert('잠금객체는 삭제하기가 지원하질 않습니다!');
					}else{
						_currentShape[0] = obj;
					}
				}
				
				if(_currentShape.length >=1) {
					for( var k in _currentShape ) {
						obj = _currentShape[k];
						if ( obj != null ) {
							for ( var i in KTCE.currentPaper.shapeArray ) {
								if ( $(obj.node).attr("id") == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id") ) {
									
									KTCE.currentPaper.shapeArray[i].unplug();
									KTCE.currentPaper.shapeArray.splice(i, 1);
									iconBarDisabled(obj);
									
									if(KTCE.currentPaper.dataWrap.select("."+$(obj.node).attr("id")) != null)
										KTCE.currentPaper.dataWrap.select("."+$(obj.node).attr("id")).remove();
									
									if(KTCE.currentPaper.objWrap.select("#"+$(obj.node).attr("id")) != null){
										var _tempCurrentShape = KTCE.currentPaper.objWrap.select("#"+$(obj.node).attr("id"));
										_tempCurrentShape.data('hasHandle', false);
										if(_tempCurrentShape.freeTransform != undefined){
											_tempCurrentShape.freeTransform.hideHandles();
											_tempCurrentShape.freeTransform.updateHandles();
										}
										
										KTCE.currentPaper.selectedShapeArray.splice(0, KTCE.currentPaper.selectedShapeArray.length);
										KTCE.currentPaper.objWrap.select("#"+$(obj.node).attr("id")).remove();
										
										if($("#cropRect").length > 0) {
											$("#cropRect").remove();
											tempCropRect.freeTransform.hideHandles();
											tempCropRect.freeTransform.visibleNoneHandles();
											tempCropRect.freeTransform.updateHandles();
											tempCropRect = null;
										}
										
										var _currentShapeNode = $(obj.node);
										if(_currentShapeNode.attr("data-name") == 'xTable'){
											if(KTCE.currentPaper.objWrap.select(".xTableTexts_" + _currentShapeNode.attr("id")) != null){
												KTCE.currentPaper.objWrap.select(".xTableTexts_" + _currentShapeNode.attr("id")).remove();
												
												//table index(data-id)값 재 설정	
												//삭제시 그룹핑내 테이블 두께 원본비율 유지 안되게 처리(즉, 배율로 유지)
												var xTableArray = KTCE.currentPaper.objOuter.selectAll('g.objectGroup>g.xTable');
												var xTableArrayLength = xTableArray.length;
												if(xTableArrayLength > 0) {
													KTCE.currentPaper.tableArray = new Array();
													xTableArray.forEach(function(el, idx){
														//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
														fnInitializeTableStrokeWidth(el);
													});
												}else{
													KTCE.currentPaper.tableArray = new Array();
												}
											}
										}
										
										if(_currentShapeNode.attr("data-name") == "xImage"){
											var _maskObj = _currentShapeNode.attr("mask");
											if(_maskObj != undefined && _maskObj != null){
												try{
													if(_maskObj === 'none' || _maskObj === '') return;
													var _maskId = ((_maskObj.split("("))[1].split(")")[0]).split("#")[1];
													if(((_maskObj.split("("))[1].split(")")[0]).split("#")[1].indexOf("'") > -1){
														_maskId = (((_maskObj.split("("))[1].split(")")[0]).split("#")[1].split("'")[0])
													} else if(((_maskObj.split("("))[1].split(")")[0]).split("#")[1].indexOf("\"") > -1){
														_maskId = (((_maskObj.split("("))[1].split(")")[0]).split("#")[1].split("\"")[0])
													}
													if($("#"+ _maskId) != undefined) $("#"+ _maskId).remove();
												} catch(err){
													console.log(err);
												}
											}
										}
									}
									
									$(obj.node).remove();
									break;
								}
							}
							obj = null;
						}
					}
					
					setTimeout(function() {
						fnSaveState();
					}, 1);
					
					KTCE.object.cache = null;
					KTCE.currentPaper.selectedShapeArray = lockShapeArray;
				}
			}catch(e) {}
			layer.contextMenu.hide();
		}
		
		// 오브젝트 cut 기능
		function fnObjCut(){
			var _currentShape = [];
			try {
				var obj = KTCE.currentPaper.currentShape;
				if(obj==null && KTCE.currentPaper.selectedShapeArray.length > 1) {
					for( var h in KTCE.currentPaper.selectedShapeArray ) {
						var obj = KTCE.currentPaper.selectedShapeArray[h];
						if( obj.freeTransform.isGroup(obj) || obj.freeTransform.isLock(obj)) {
							alert('그룹객체/잠금객체는 잘라내기가 지원하질 않습니다!');
							continue;
						}else{
							_currentShape[h] = obj;
						}
					}
				}else{
					if( obj.freeTransform.isGroup(obj) || obj.freeTransform.isLock(obj)) {
						alert('그룹객체/잠금객체는 잘라내기가 지원하질 않습니다!');
					}else{
						_currentShape[0] = obj;
					}
				}
				
				if(_currentShape.length >=1) {
					KTCE.object.cache = [];
					
					for( var k in _currentShape ) {
						obj = _currentShape[k];
						if ( obj != null ) {
							for ( var i in KTCE.currentPaper.shapeArray ) {
								if ( $(obj.node).attr("id") == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id") ) {
									KTCE.currentPaper.shapeArray[i].unplug();
									KTCE.currentPaper.shapeArray.splice(i, 1);
									
									KTCE.object.cache.push(obj.outerSVG());
									if($(obj.node).attr("data-name") === "xTable" && KTCE.currentPaper.s.select(".xTableTexts_" + $(obj.node).attr("id")) != null) {
										KTCE.object.cache.push(KTCE.currentPaper.s.select(".xTableTexts_" + $(obj.node).attr("id")).outerSVG());
										KTCE.currentPaper.objWrap.select(".xTableTexts_" + $(obj.node).attr("id")).remove();
									}
									
									KTCE.currentPaper.selectedShapeArray.splice(0, KTCE.currentPaper.selectedShapeArray.length);
									
									obj.remove();
									
									if($("#cropRect").length > 0) {
										$("#cropRect").remove();
										tempCropRect.freeTransform.hideHandles();
										tempCropRect.freeTransform.visibleNoneHandles();
										tempCropRect.freeTransform.updateHandles();
										tempCropRect = null;
									}
									
									setTimeout(function(){
										//table data-id(index) 값 재설정
										//잘라내기시 그룹핑내 테이블 두께 원본비율 유지 안되게 처리(즉, 확인배율로 유지)
										var xTableArray = KTCE.currentPaper.objOuter.selectAll('g.objectGroup>g.xTable');
										var xTableArrayLength = xTableArray.length;
										if(xTableArrayLength > 0) {
											KTCE.currentPaper.tableArray = new Array();
											xTableArray.forEach(function(el, idx){
												//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
												fnInitializeTableStrokeWidth(el);
											});
										}else{
											KTCE.currentPaper.tableArray = new Array();
										}
									}, 10);
									break;
								}
							}
							obj = null;
						}
					}
					
					setTimeout(function() {
						fnSaveState();
					}, 1);
				}
			}catch(e) {}
			layer.contextMenu.hide();
		}
		
		// 오브젝트 copy 기능
		function fnObjCopy(){
			var _currentShape = [];
			try {
				var obj = KTCE.currentPaper.currentShape;
				if(obj==null && KTCE.currentPaper.selectedShapeArray.length > 1) {
					for( var h in KTCE.currentPaper.selectedShapeArray ) {
						var obj = KTCE.currentPaper.selectedShapeArray[h];
						if( obj.freeTransform.isGroup(obj) || obj.freeTransform.isLock(obj)) {
							alert('그룹객체/잠금객체는 복사하기가 지원하질 않습니다!');
							continue;
						}else{
							_currentShape[h] = obj;
						}
					}
				}else{
					if( obj.freeTransform.isGroup(obj) || obj.freeTransform.isLock(obj)) {
						alert('그룹객체/잠금객체는 복사하기가 지원하질 않습니다!');
					}else{
						_currentShape[0] = obj;
					}
				}
				
				if(_currentShape.length >= 1) {
					KTCE.object.cache = [];
					//KTCE.object.cache.type = 'objectCopy';
					
					for( var k in _currentShape ) {
						obj = _currentShape[k];
						if ( obj != null ) {
							for ( var i in KTCE.currentPaper.shapeArray ) {
								if ( $(obj.node).attr("id") == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id") ) {
									
									if(browserType.indexOf('msie') != -1){
										KTCE.object.cache.push($(obj.node).clone().wrapAll("<svg/>").parent().html());
									}else {
										KTCE.object.cache.push(obj.node.outerHTML);
									}
									//KTCE.object.cache.push(obj.outerSVG());	//201812 원본
									
									if($(obj.node).attr("data-name") === "xTable" && KTCE.currentPaper.s.select(".xTableTexts_" + $(obj.node).attr("id")) != null) {
										KTCE.object.cache.push(KTCE.currentPaper.s.select(".xTableTexts_" + $(obj.node).attr("id")).outerSVG());
									}
									
									if($("#cropRect").length > 0) {
										$("#cropRect").remove();
										tempCropRect.freeTransform.hideHandles();
										tempCropRect.freeTransform.visibleNoneHandles();
										tempCropRect.freeTransform.updateHandles();
										tempCropRect = null;
						            }
									break;
								}
							}
							obj = null;
						}
					}
					
					setTimeout(function() {
						fnSaveState();
					}, 1);
				}
			}catch(e) {}
			
			layer.contextMenu.hide();
		}
		
		// 오브젝트 paste 기능
		function fnObjPaste(){
			
			if ( KTCE.object.cache != null && KTCE.object.cache.length > 0 ) {
				hideAllHandler();
				var pasteArray = [];
				var cache_length = KTCE.object.cache.length;
				for(var i=0; i<cache_length; i++) {
					
					// 그룹핑 객체 복사/붙이기 금지
					var objGroupChk = false;
					
					if($(KTCE.object.cache[i]).attr('data-name') == 'objectGroup') {
						alert('그룹객체 복사/붙이기는 향후에 지원예정입니다!');
						objGroupChk = true;
					}
					
					if(KTCE.object.cache[i]!='xTable' && !objGroupChk) {
						var targetStr = KTCE.object.cache[i];
						var tempId = $(targetStr)[0].id;
						var tagName = $(targetStr)[0].tagName;
						var dtNow = new Date();
						var randId = "c" + dtNow.getTime();
						
						targetStr = targetStr.replaceAll(tempId, randId);
						
						var targetObj = $(targetStr);
						if(tagName.toUpperCase() == "IMG" || tagName.toUpperCase() == "IMAGE"){
							if(targetObj.attr("xlink:href") == undefined && targetObj.attr("href")){
								var tempHref = targetObj.attr("href");
								targetObj.removeAttr("href");
								targetObj.attr("xlink:href", tempHref);
								targetObj.attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
								targetStr = targetObj[0].outerHTML;
								targetStr = targetStr.replace("<img", "<image");
							}
						}
						
						if($(targetStr).attr('data-name') == 'xImage') {
							targetStr = targetStr.replace('url(\\"#', 'url(#');
							targetStr = targetStr.replace('\\")"', ')"');
						}
						
						var tempCache = Snap.parse(targetStr)
							, tempG = KTCE.currentPaper.objWrap.g().append(tempCache);
						
						var tempObj = tempG.children()[0];
						tempObj.id = randId;
						transform = tempObj.attr('transform');
						tempObj.insertBefore(tempG);
						var strTrans = tempObj.transform().string;
						tempG.remove();
						if(KTCE.paperArray.length > 1){
							var dataObj = undefined;
							for(var j=0; j<KTCE.paperArray.length; j++){
								dataObj = KTCE.paperArray[j].dataWrap.select('.' + tempId);
								if(dataObj != null) break;
							}
						} else {
							var dataObj = KTCE.currentPaper.dataWrap.select('.'+tempId);
						}
						
						try{
							var transInfo = {
								translate : {
										x : parseFloat(dataObj.select('.translateX').attr('text'))
										, y : parseFloat(dataObj.select('.translateY').attr('text'))
									}
									, scale : {
										x : parseFloat(dataObj.select('.scaleX').attr('text'))
										, y : parseFloat(dataObj.select('.scaleY').attr('text'))
									}
									, rotate : parseFloat(dataObj.select('.rotate').attr('text'))
								}
						}catch(err){}

						switch(tempObj.attr('class')) {
							case 'xTable hasData' :
								tempObj.attr("data-id", "xTable" +KTCE.currentPaper.tableArray.length)
								tempObj.attr("id", randId);
								if(KTCE.object.cache[i+1] != undefined && $(KTCE.object.cache[i+1]).hasClass('tableTextWrapper')){
									var tempCache = Snap.parse(KTCE.object.cache[i+1])
									, tableText = KTCE.currentPaper.objWrap.append(tempCache);
									var _length = tableText.children().length - 1;
									var _currentTableTextWrapper = tableText.children()[_length];
									_currentTableTextWrapper.attr('class', 'tableTextWrapper xTableTexts_' + randId);
								}
								
								//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
								fnInitializeTableStrokeWidth(tempObj, 'paste', transInfo);
								
								break;
							case 'hasData xImage' :
								fnSetFreeTransform(tempObj, 'paste', transInfo);
								setTimeout(function(){
									if(KTCE.object.cache.length > 1) {
										$("div.col10disabled").show();
									}else{
										cropHandler = null;
										if(imageHandler != null) {
											imageHandler.visibleNoneHandles();
											imageHandler.updateHandles();
											imageHandler = null;
										}
										KTCE.currentPaper.currentShape = tempObj;
										KTCE.currentPaper.selectedShapeArray[0] = tempObj;
										imgObj = tempObj;
										$("div.col10disabled").hide();
									}
									
								}, 500);
								break;
							default:
								fnSetFreeTransform(tempObj, 'paste', transInfo);
						}
						
						if($(KTCE.object.cache[i]).hasClass('xTable') && $(KTCE.object.cache[i+1]).hasClass('tableTextWrapper')) {
							i++;
						}
						
						//붙이기 객체 filter효과 적용
						var _currentPaperId = $(KTCE.currentPaper.s.node).attr('id');
						var _currentPaperNum = parseInt(_currentPaperId.substring(5,7)) - 1;
						var filterId = $(tempObj.node).attr('data-filter-id');
						var fillId = $(tempObj.node).attr('data-fill-id');
						var thisNode = $(tempObj.node);
						var targetObj = Snap(thisNode[0]);
						var targetSVG = $(".paperWrapper .paperFrame:eq(" + _currentPaperNum + ")").find('svg');
						
						if(tempObj.hasClass('textBoxWrap')){
							if($(KTCE.currentPaper.s.node).find('#'+filterId ).length == 0 && filterId != undefined ) {
								fnTextShadow(targetSVG, targetObj, true);	
							}
						}else{
							if($(tempObj.node).attr('filter') != undefined) {
								if($("#" + filterId).find('feGaussianBlur').length < 1) return;
								
								var shadowWidth = parseFloat(document.getElementById(filterId).childNodes[0].getAttribute('stdDeviation'));
								if(document.getElementById(filterId).childNodes.length > 1) {
									console.log('fnShapeShadow');
									fnShapeShadow(targetSVG, targetObj, shadowWidth);	
								}else{
									console.log('fnShapeBlur');
									fnShapeBlur(targetSVG, targetObj, shadowWidth);
								}
								
							}
							
							if($(tempObj.node).attr('data-fill-id') != undefined) {
								var fillId = $(tempObj.node).attr('data-fill-id');
								var fillDefs = $("div.paperFrame svg> defs #" + fillId).clone();
								if($(KTCE.currentPaper.s.node).find("#" + fillId).length == 0 && fillDefs.length > 0) {
								//if(KTCE.currentPaper.s.select("#" + fillId) == null ) {
									$(KTCE.currentPaper.s.node).find("defs").append(fillDefs);
								}
							}
							
						}
						
						tempObj.data('hasHandle', true);
						tempObj.freeTransform.visibleHandles();
						tempObj.freeTransform.updateHandles();
						pasteArray.push(tempObj)
					}
				}
				setTimeout(function() {
					KTCE.currentPaper.selectedShapeArray = pasteArray;
					fnSaveState();
				}, 1);
			}
			layer.contextMenu.hide();
		}
		
		// 오브젝트 투명도 기능
		function fnObjOpacity(){
			if( KTCE.currentPaper.currentShape == null) {
				alert('먼저 투명도를 조절 할 오브젝트를 선택해 주세요!');
				return false;
			}else{
				var contextMenuEditInfo = {};
				var valueInfo = {baseNumber:100, min:10, max:100, init:100};						// slider기본 셋팅 값
				var slider = {};
					slider.sliderBarId = "contextMenuEditSliderRange",					//	slider id
					slider.valueId = "contextMenuEditSliderValue",						//	slider value
					slider.value = valueInfo;
					contextMenuEditInfo.type = "opacity",								//	contextMenu 도구상자 type
					contextMenuEditInfo.contextMenuWrap = $("div.contextMenu"),			//	contextMenu
					contextMenuEditInfo.editBoxWrap = $("div.contextMenuEditBoxWrap.opacity"),	//	contextMenu > Editor Box
					contextMenuEditInfo.slider = slider;
				var editBoxText = {};
					editBoxText.title = "투명도 설정",
					editBoxText.slider = "투명도: ",
					editBoxText.unit = "%";
					contextMenuEditInfo.editBoxText = editBoxText;
					
				fnContextMenuEditBox(contextMenuEditInfo);
				
			}
		}
		// 오브젝트 회전 기능
		function fnObjRotate(){
			if( KTCE.currentPaper.currentShape == null) {
				alert('먼저 회전 오브젝트를 선택해 주세요!');
				return false;
			}else{
				if($(KTCE.currentPaper.currentShape.node).attr('data-name') == 'xTable') {
					alert('표는 회전할 수 없습니다!');
					return;
				}
				var contextMenuEditInfo = {};
				var valueInfo = {baseNumber:1, min:0, max:360, init:0};							// slider기본 셋팅 값
				var slider = {};
					slider.sliderBarId = "slider",										//	slider id
					slider.valueId = "angle",											//	slider value
					slider.value = valueInfo;
					contextMenuEditInfo.type = "rotate",								//	contextMenu 도구상자 type
					contextMenuEditInfo.contextMenuWrap = $("div.contextMenu"),			//	contextMenu
					contextMenuEditInfo.editBoxWrap = $("div.contextMenuEditBoxWrap.rotate"),	//	contextMenu > Editor Box  legend
					contextMenuEditInfo.slider = slider;
				var editBoxText = {};
					editBoxText.title = "회전 설정",
					//editBoxText.slider = "회전각도: ",
					//editBoxText.unit = "도";
					contextMenuEditInfo.editBoxText = editBoxText;
				
				fnContextMenuEditBox(contextMenuEditInfo);
				
			}
		}
		
		function fnContextMenuEditBox(contextMenuEditInfo) {
			//잠금상태 사용금지
			var obj = KTCE.currentPaper.currentShape;
			if(obj.freeTransform.isLock(obj)) return;
			
			var _contextMenuWrap = contextMenuEditInfo.contextMenuWrap;
			var baseNumber = contextMenuEditInfo.slider.value.baseNumber;
			var _slider = document.getElementById(contextMenuEditInfo.slider.sliderBarId);
			var _sliderValue = document.getElementById(contextMenuEditInfo.slider.valueId);
			
			var _top, _left;
			if(parseFloat($(document).height()) <= parseFloat(layer.contextMenu.height()) + parseFloat($(KTCE.currentPaper.currentShape.node).offset().top)) {
				_top = parseInt(parseFloat($(KTCE.currentPaper.currentShape.node).position().top) - parseFloat($("#" + contextMenuEditInfo.slider.sliderBarId).height()) - 20);
			}else{
				_top = parseInt(_contextMenuWrap.css("top"));
				if(_top < parseInt($(KTCE.currentPaper.currentShape.node).offset().top - parseFloat($("#" + contextMenuEditInfo.slider.sliderBarId).height())) ) {
					_top = parseInt(parseFloat($(KTCE.currentPaper.currentShape.node).position().top) - parseFloat($("#" + contextMenuEditInfo.slider.sliderBarId).height()) - 20);
				}
			}
			switch(contextMenuEditInfo.type) {
			case "opacity" :
				_left = parseInt(_contextMenuWrap.css("left"));
				break;
			case "rotate" :
				_left = parseInt(_contextMenuWrap.css("left")) + 20
				break;
			}
			
			contextMenuEditInfo.editBoxWrap.css({
				'display': 'inline-block'
				,'left': _left
				,'top': _top
				,'z-index':parseInt(_contextMenuWrap.css('z-index'))
			}).hide().fadeIn(500);
			
			switch(contextMenuEditInfo.type) {
			case "opacity" :
				contextMenuEditInfo.editBoxWrap.draggable();
				
				$(_slider).attr({'min': contextMenuEditInfo.slider.value.min, 'max': contextMenuEditInfo.slider.value.max});
				$(_sliderValue).attr({'min': contextMenuEditInfo.slider.value.min, 'max': contextMenuEditInfo.slider.value.max});
				contextMenuEditInfo.editBoxWrap.find("legend").text(contextMenuEditInfo.editBoxText.title);
				contextMenuEditInfo.editBoxWrap.find("label:first").text(contextMenuEditInfo.editBoxText.slider);
				contextMenuEditInfo.editBoxWrap.find("span").text(contextMenuEditInfo.editBoxText.unit);
				
				var _value = $(KTCE.currentPaper.currentShape.node).attr('opacity');
				_value = _value == undefined ? 1 : _value;
				_sliderValue.value = parseInt(_value * baseNumber);
				_slider.value = parseInt(_value * baseNumber);
				
				$(_slider).on( {
					mousedown : function(e) {}
					, mouseup : function(e) {
						setTimeout(function() {
							fnSaveState();
						}, 1);
					}
					, mousemove : function(e) {}
					, mouseout : function(e) {}
				});
				
				break;
			case "rotate" :
				contextMenuEditInfo.editBoxWrap.draggable({'cancel': '.nodrag'});
				contextMenuEditInfo.editBoxWrap.on( {
					mouseup : function(e) {
						circleInfo.offset =  circleInfo.object.offset();
						circleInfo.position = { x: circleInfo.offset.left, y: circleInfo.offset.top};
					}
				});
				
				$(_slider).attr({'min': contextMenuEditInfo.slider.value.min, 'max': contextMenuEditInfo.slider.value.max});
				$(_sliderValue).attr({'min': contextMenuEditInfo.slider.value.min, 'max': contextMenuEditInfo.slider.value.max});
				contextMenuEditInfo.editBoxWrap.find("legend").text(contextMenuEditInfo.editBoxText.title);
				
				var sliderInfo = {};
					sliderInfo.object = $('div.contextMenuEditBoxWrap.rotate #slider');
					sliderInfo.size = {width:sliderInfo.object.width(), height:sliderInfo.object.height()};
					sliderInfo.deg = 0;
					sliderInfo.position = {dx: 0, dy: 0}
					sliderInfo.event = {mousedown: false, mouseup: false, mousemove:false}
				
				var circleInfo = {};
					circleInfo.object = $('div.contextMenuEditBoxWrap.rotate #circle');
					circleInfo.offset =  circleInfo.object.offset();
					circleInfo.position = { x: circleInfo.offset.left, y: circleInfo.offset.top};
					circleInfo.radius = 50 - 2;
				
				var _value = parseFloat(KTCE.currentPaper.currentShape.freeTransform.attrs.rotate);
					_value = (_value == undefined) ? 0 : _value;
					_value = (_value < 0) ? 360 + _value : _value;
					_value = (_value < 0) ? 360 + _value : _value;
					
				var deg = parseInt(_value);
				if(deg == 360) {
					deg = 0;
				}
				_sliderValue.value = deg;
				var radius = circleInfo.radius;
				sliderInfo.position.dx = Math.round(radius * Math.sin(deg*Math.PI/180));
				sliderInfo.position.dy = Math.round(radius * -Math.cos(deg*Math.PI/180));
				sliderInfo.object.css({left: sliderInfo.position.dx + radius, top: sliderInfo.position.dy + radius});
				sliderInfo.object.css({ WebkitTransform: 'rotate(' + deg + 'deg)'});
				sliderInfo.object.css({ '-moz-transform': 'rotate(' + deg + 'deg)'});
				
				circleInfo.object.on( {
					mousedown : function(e) {
						sliderInfo.event.mousedown = true;
						_sliderValue.onfucosout = true;
						$(_sliderValue).removeAttr('disabled');
					}
					, mouseup : function(e) {
						sliderInfo.event.mousedown = false;
						$(_sliderValue).onfucosout = true;
						$(_sliderValue).removeAttr('disabled');
						setTimeout(function() {
							fnSaveState();
						}, 1);
					}
					, mousemove : function(e) {
						if(sliderInfo.event.mousedown) {
							var radius = circleInfo.radius;
							deg = sliderInfo.deg;
							var newPos = {x: e.clientX-circleInfo.position.x, y: e.clientY-circleInfo.position.y};
							var atan = Math.atan2(newPos.x - radius, newPos.y - radius);
							deg = parseInt(-atan/(Math.PI/180) + 180);
							
							$('input[name="angle"]').val(Math.ceil(deg));
							setObjRotate(KTCE.currentPaper.currentShape, radius, Math.ceil(deg));	//object rotate
						}
					}, mouseout : function(e) {
						$(_sliderValue).removeAttr('disabled');
					}
				});
				
				$(_sliderValue).on( {
					mousemove : function(e) {
						if(sliderInfo.event.mousedown) {
							$(_sliderValue).attr('disabled', true);
						}else{
							$(_sliderValue).removeAttr('disabled');
						}
					}
				});
				
				$(document).on({
					mouseup: function(e) {
						if(sliderInfo.event.mousedown) sliderInfo.event.mousedown = false;
					}
				});
				break;
				
			default :
				alert('contextMenu 편집도구를 사용할 수 없습니다!');
				return;
				break;
			}
			
			$(_slider).on('input change', function(e){
				_sliderValue.value = this.value;
				switch(contextMenuEditInfo.type) {
				case "opacity" :
					setObjOpacity($(KTCE.currentPaper.currentShape.node), (this.value/baseNumber));
					break;
				case "rotate" :
					
					break;
				}
			});
			$(_sliderValue).on('keydown', function(e){
				if(e.type == 'keydown') {
					KTCE.inputFontSizeFocus = true;
				}else if(e.type == 'keyup') {
					KTCE.inputFontSizeFocus = false;
				}
				if(e.keyCode == 13) {
					if(this.value < contextMenuEditInfo.slider.value.min) {
						this.value = contextMenuEditInfo.slider.value.min;
						alert('최소 ' + contextMenuEditInfo.slider.value.min + ' 이상 숫자를 입력해 주세요!!!');
						$(_slider).hide();
						$(_slider).show();
					}else if(this.value > contextMenuEditInfo.slider.value.max) {
						this.value = contextMenuEditInfo.slider.value.max;
						alert('최대 숫자 입력 값은 ' + contextMenuEditInfo.slider.value.max + '을 넘을 수 없습니다.');
						$(_slider).hide();
						$(_slider).show();
					}else if(this.value.length === 0) {
						this.value = contextMenuEditInfo.slider.value.init;
						alert('설정값을 입력해 주세요!!');
						$(_slider).hide();
						$(_slider).show();
					}
					
					switch(contextMenuEditInfo.type) {
					case "opacity" :
						setObjOpacity($(KTCE.currentPaper.currentShape.node), (this.value/baseNumber));
						break;
					case "rotate" :
						var radius = circleInfo.radius;
						deg = parseInt(this.value);
						
						setObjRotate(KTCE.currentPaper.currentShape, radius, deg);	//object rotate
						break;
					}
					
					setTimeout(function() {
						fnSaveState();
					}, 1);
				}else{
					if(event.keyCode == 16) {	//shift
						
					}else if( !(e.keyCode >= 37 && e.keyCode <= 40) && e.keyCode != 8 && e.keyCode < 45 || e.keyCode > 57 && e.keyCode < 96 || e.keyCode > 105) {
						var inputString = this.value;
						var string = inputString.substring(0, inputString.length);
						if(e.type == 'keydown') {
							alert('숫자만 입력해 주세요!!!');
						}
						setTimeout(function() {
							this.value = string;
							this.onfocusin = "true";
						}, 10)
						return false;
					}
			    }
			});
			function setObjOpacity(obj, value) {
				obj.attr({'opacity': value});
				
				//css opacity 적용된 객체에도 반영처리(예: 크롬에서 원 도형 삽입시 자동생성됨)
				var cssOpacity = obj.attr('style');
				var regExp = /opacity/; 
				if(cssOpacity != undefined) {
					if(cssOpacity.match(regExp)) {
						obj.attr('style', value);
					}
				}
				
				//표내 텍스트 객체도 투명도 반영
				if(obj.attr('data-name') == 'xTable') {
					var tableTextWrapId = "xTableTexts_" + obj.attr("id");
					$("g.tableTextWrapper." + tableTextWrapId).attr({'opacity': value});
					
					cssOpacity = $("g.tableTextWrapper." + tableTextWrapId).attr('style');
					if(cssOpacity != undefined) {
						if(cssOpacity.match(regExp)) {
							$("g.tableTextWrapper." + tableTextWrapId).attr('style', value);
						}
					}
				}
			}
			function setObjRotate(obj, radius, deg) {
				sliderInfo.position.dx = Math.round(radius * Math.sin(deg*Math.PI/180));
				sliderInfo.position.dy = Math.round(radius * -Math.cos(deg*Math.PI/180));
				sliderInfo.object.css({left: sliderInfo.position.dx + radius, top: sliderInfo.position.dy + radius});
				sliderInfo.object.css({ WebkitTransform: 'rotate(' + deg + 'deg)'});
				sliderInfo.object.css({ '-moz-transform': 'rotate(' + deg + 'deg)'});
				
				//snap.svg handler freeTransform 값 포맷에 맞게 셋팅
				var _rotate = deg - 360;	
					_rotate = (_rotate == -450) ? -90 : _rotate;
				
				obj.freeTransform.attrs.rotate = _rotate;
				obj.transform([
		                'R' + obj.freeTransform.attrs.rotate
		                , obj.freeTransform.attrs.center.x
		                , obj.freeTransform.attrs.center.y
		                , 'S' + obj.freeTransform.attrs.scale.x
		                , obj.freeTransform.attrs.scale.y
		                , obj.freeTransform.attrs.center.x
		                , obj.freeTransform.attrs.center.y
		                , 'T' + obj.freeTransform.attrs.translate.x
		                , obj.freeTransform.attrs.translate.y
		            ].join(','));
					
				obj.freeTransform.updateHandles();
				KTCE.updateData(obj, obj.freeTransform.attrs);
				
			}
			
			/* 비활성화 */
			//$(".objectCut, #customStyle, #customStyle, #imageCut").on('click', function(e){
			$("button, a, .ui-slider-handle").on('click', function(e){
				$("div.contextMenuEditBoxWrap").hide();
			});
			$(".ui-slider-handle,  svg>circle").on('mousedown', function(e){
				$("div.contextMenuEditBoxWrap").hide();
			});
			
		}
		
		//object lock
		function fnObjLock() {
			if( KTCE.currentPaper.currentShape == null) {
				alert('먼저 잠금대상 오브젝트를 선택해 주세요!');
				return false;
			}else{
				var obj = KTCE.currentPaper.currentShape;
				
				clearTextMode(obj);//입력중인 텍스트는 해제
				
				obj.data('objLock', true);
				$(obj.node).attr('data-lock', 'lock');
				
				obj.freeTransform.opts.attrs.stroke = 'red';
				obj.freeTransform.opts.attrs.cursor = 'no-drop';
				obj.freeTransform.opts.bboxAttrs.stroke = 'red';
				obj.freeTransform.opts.bboxAttrs.cursor = 'no-drop';
				obj.freeTransform.opts.bboxAttrs.strokeDasharray = '3, 3';
				//obj.freeTransform.opts.bboxAttrs.opacity = 0.8;
				obj.freeTransform.opts.attrs.cursor = 'no-drop';
				
				obj.freeTransform.showHandles();
				obj.freeTransform.visibleHandles();
				obj.freeTransform.updateHandles();
				
				$(obj.node).css('cursor','no-drop');
				
				if(obj.attr('data-name') === 'objectGroup') {
					//obj.data('hasHandle', true);
					//그룹핑객체 선택후 Path활성화(visible)에 따른 그룹핑객체 선택불가로 인한 이벤트 처리불가에 따른 Path 이벤트 처리
					var _el = Snap($(obj.freeTransform.bbox.node)[0]);
					_el.attr({'data-name': 'objectGroupPath', 'data-id': obj.attr('id')})
					_el.unmousedown(addMouseDownEvent);
					_el.mousedown(addMouseDownEvent);
					_el.unmouseup(addMouseUpEvent);
					_el.mouseup(addMouseUpEvent);
				}
				
				//잠금객체 data 그룹생성
				if(KTCE.currentPaper.lockObjWrap == undefined) {
					var s = Snap($("#" + KTCE.currentPaper.s.node.id)[0])
					var lockObjWrap = s.g().attr({ class : 'lockObjGroup' });
					KTCE.currentPaper.lockObjWrap = lockObjWrap;
					KTCE.currentPaper.dataWrap.after(lockObjWrap);
				}
				var x, y;
				var _w = 25;
				var _h = 28;
				iconURL = '../../flyerEditor/images/functions/object_lock.png';	//ico_lock_on.png';
				var rotate = obj.freeTransform.attrs.rotate; 
				var _value = parseFloat(rotate);
				_value = (_value == undefined) ? 0 : _value;
				_value = (_value < 0) ? 360 + _value : _value;
				_value = (_value < 0) ? 360 + _value : _value;
				var deg = parseInt(_value);
				if(deg == 360) deg = 0;
				
				if(deg > 0 && deg < 90) {	//우측회전 0~90도 내
					x = parseFloat(obj.freeTransform.handles.bbox[3].element.attr('x'));
					y = parseFloat(obj.freeTransform.handles.bbox[0].element.attr('y'));
				}else if(deg >= 90 && deg < 180) {	//우측회전 90~180도 내
					x = parseFloat(obj.freeTransform.handles.bbox[2].element.attr('x'));
					y = parseFloat(obj.freeTransform.handles.bbox[3].element.attr('y'));
				}else if(deg >= 180 && deg < 270) {	//우측회전 180~270도 내
					x = parseFloat(obj.freeTransform.handles.bbox[1].element.attr('x'));
					y = parseFloat(obj.freeTransform.handles.bbox[2].element.attr('y'));
				}else if(deg >= 270 && deg < 360) {	//우측회전 270~(360)0도 내
					x = parseFloat(obj.freeTransform.handles.bbox[0].element.attr('x'));
					y = parseFloat(obj.freeTransform.handles.bbox[1].element.attr('y'));
				}else{
					x = parseFloat(obj.freeTransform.handles.bbox[0].element.attr('x'));
					y = parseFloat(obj.freeTransform.handles.bbox[0].element.attr('y'));
				}
				
				//x = (x < 10) ? 10 : x + 10;
				x = (x < 10) ? 10 : ((x >= 800) ? 780 : x);
				y = (y < 10) ? 10 : y + 10;
				
				var imageInfo = {
					id : obj.node.id,
					x : x,
					y : y,
					width : _w,
					height : _h,
					icon : iconURL
				};
				
				//잠금객체제어object생성: 자물쇠이미지
				var lockObject = KTCE.currentPaper.lockObjWrap.image().attr({ class : imageInfo.id, 'xlink:href':imageInfo.icon, x: imageInfo.x, y:imageInfo.y, width:imageInfo.width, height:imageInfo.height});
				$(lockObject.node).on({
					mousedown: function(e){
						hideAllHandler();
						obj.data('hasHandle', true);
						obj.freeTransform.visibleHandles();
						//obj.freeTransform.updateHandles();
						
						KTCE.currentPaper.currentShape = obj;
						KTCE.currentPaper.selectedShapeArray[0] = obj
						
					},
					mouseup: function(e) {
						obj.data('hasHandle', true);
						obj.freeTransform.visibleHandles();
						obj.freeTransform.updateHandles();
						KTCE.currentPaper.currentShape = obj;
						KTCE.currentPaper.selectedShapeArray[0] = obj;
					}
				});
				
				var img = new Image();
				img.crossOrigin = 'Anonymous';
				img.onload = function(){
					var _width = parseInt(this.width);
					var _height = parseInt(this.height);
					_w = (_width != _w) ?_width : _w;
					_h = (_height !=_h) ? _height : _h;
					$(lockObject.node).attr({'width': _w, 'height': _h});
				}
				img.src = iconURL;
				
				setTimeout(function() {
					fnSaveState();
				}, 1000);
			}
		}
		//object unlock
		function fnObjunLock() {
			if( KTCE.currentPaper.currentShape == null) {
				alert('먼저 잠금대상 오브젝트를 선택해 주세요!');
				return false;
			}else{
				var obj = KTCE.currentPaper.currentShape;
				obj.data('objLock', false);
				$(obj.node).attr('data-lock', 'unlock');
				
				obj.freeTransform.opts.attrs.stroke = '#666';
				obj.freeTransform.opts.attrs.cursor = 'move';
				if(obj.hasClass('hasDataGroup')) {
					obj.freeTransform.opts.bboxAttrs.cursor = 'move';
				}else{
					obj.freeTransform.opts.bboxAttrs.stroke = '#666';
					obj.freeTransform.opts.bboxAttrs.cursor = 'move';
					obj.freeTransform.opts.bboxAttrs.strokeDasharray = ['none'];
				}
				$(obj.node).css('cursor','move');
				
				obj.freeTransform.showHandles();
				obj.freeTransform.visibleHandles();
				obj.freeTransform.updateHandles();
				
				//그룹객체 대상중 잠금적용된 객체 잠금삭제처리
				try{
					if(KTCE.currentPaper.lockObjWrap != undefined) {
						obj.data('objLock', false);
						$(obj.node).removeAttr('data-lock');
						KTCE.currentPaper.lockObjWrap.select("." + obj.node.id).remove();
					}
				}catch(e){}
				
				setTimeout(function() {
					fnSaveState();
				}, 1);
			}
		}
		
		// 오브젝트 cut, delte, copy, paste 기능
		function fnEditObject() {
			
			KTCE.object.cache = null;
			
			// delete
			trigger.objectDelete.each(function() {
				$(this).on({
					mousedown : function() {
						fnObjDelete();
					}
				});
			});
			
			// cut
			trigger.objectCut.each(function() {
				$(this).on({
					mousedown : function() {
						fnObjCut()
					}
				});
			});
			
			// copy
			trigger.objectCopy.each(function() {
				$(this).on({
					mousedown : function() {
						fnObjCopy();
					}
				});
			});
			
			// paste
			trigger.objectPaste.each(function() {
				$(this).on({
					mousedown : function() {
						fnObjPaste()
					}
				});
			});
			
			// opcity
			trigger.objectOpacity.each(function() {
				$(this).on({
					mousedown : function() {
						fnObjOpacity()
					}
				});
			});
			
			// rotate
			trigger.objectRotate.each(function() {
				$(this).on({
					mousedown : function() {
						fnObjRotate()
					}
				});
			});
			
			// Lock
			trigger.objectLock.each(function() {
				$(this).on({
					mousedown : function() {
						if( KTCE.currentPaper.currentShape == null) {
							alert('먼저 잠금대상 오브젝트를 선택해 주세요!');
						}else{
							var obj = KTCE.currentPaper.currentShape;
							if(obj.freeTransform.isLock(obj)) {
								fnObjunLock();
							}else{
								fnObjLock();
							}
							
						}
					}
				})
			});
		}

		// 오브젝트 정렬
		function fnObjectAlign() {
			trigger.objectAlign.each(function(i) {
				var thisType = '';

				if ( $(this).filter('.hLeft').length ) {
					thisType = 'hLeft';
					$(this).off().on({
						mousedown : function() {
							alignLeft();
						}
					});
				} else if ( $(this).filter('.hRight').length ) {
					thisType = 'hRight';
					$(this).off().on({
						mousedown : function() {
							alignRight();
						}
					});
				} else if ( $(this).filter('.hCenter').length ) {
					thisType = 'hCenter';
					$(this).off().on({
						mousedown : function() {
							alignCenter();
						}
					});
				} else if ( $(this).filter('.vTop').length ) {
					thisType = 'vTop'
					$(this).off().on({
						mousedown : function() {
							alignTop();
						}
					});
				} else if ( $(this).filter('.vMiddle').length ) {
					thisType = 'vMiddle'
					$(this).off().on({
						mousedown : function() {
							alignMiddle();
						}
					});
				} else if ( $(this).filter('.vBottom').length ) {
					thisType = 'vBottom'
					$(this).off().on({
						mousedown : function() {
							alignBottom();
						}
					});
				} else if ( $(this).filter('.allHcenter').length ) {
					thisType = 'allHcenter'
					$(this).off().on({
						mousedown : function() {
							alignAllHcenter();
						}
					});
				} else if ( $(this).filter('.allVmiddle').length ) {
					thisType = 'allVmiddle'
					$(this).off().on({
						mousedown : function() {
							alignAllVmiddle();
						}
					});
				} 
				
			});
			
		}

		function alignLeft(){
			if ( KTCE.currentPaper.selectedShapeArray.length > 1){
				var minLeft = 99999;
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var leftValue = calLeft(KTCE.currentPaper.selectedShapeArray[i]);
					KTCE.currentPaper.selectedShapeArray[i].LeftValue = leftValue;
					if(minLeft > leftValue){
						minLeft = leftValue;
					}
				}

				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var tx = toTransLeft(KTCE.currentPaper.selectedShapeArray[i], minLeft);
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + tx
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y
					].join(','));
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x	= tx;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
				}
			}
		}

		function alignRight(){
			if ( KTCE.currentPaper.selectedShapeArray.length > 1){
				var maxRight = -1000;
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var rightValue = calRight(KTCE.currentPaper.selectedShapeArray[i]);
					if(maxRight < rightValue){
						maxRight = rightValue;
					}
				}
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var tx = toTransRight(KTCE.currentPaper.selectedShapeArray[i], maxRight);
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + tx
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y
					].join(','));
					
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x	= tx;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
				}
			}
		}

		function alignCenter(){
			if ( KTCE.currentPaper.selectedShapeArray.length > 1){
				var baseX = calBaseX(KTCE.currentPaper.selectedShapeArray[0].freeTransform);
				var baseObj = KTCE.currentPaper.selectedShapeArray[0];
				for(var i=1; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var tx = toTransBase(KTCE.currentPaper.selectedShapeArray[i].freeTransform, baseX);
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + tx
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y
					].join(','));
					
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x	= tx;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);		
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
				}
			}
		}

		function alignTop(){
			if ( KTCE.currentPaper.selectedShapeArray.length > 1){
				var minTop = 999999;
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var topValue = calTop(KTCE.currentPaper.selectedShapeArray[i]);
					if(minTop > topValue){
						minTop = topValue;
					}
				}
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var ty = toTransTop(KTCE.currentPaper.selectedShapeArray[i], minTop);
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x
						, ty
					].join(','));
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y	= ty;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
				}
			}
		}

		function alignBottom(){
			if ( KTCE.currentPaper.selectedShapeArray.length > 1){
				var maxBottom = -1;
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var BottomValue = calBottom(KTCE.currentPaper.selectedShapeArray[i]);
					if(maxBottom < BottomValue){
						maxBottom = BottomValue;
					}
				}
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var ty = toTransBottom(KTCE.currentPaper.selectedShapeArray[i], maxBottom);
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x
						, ty
					].join(','));
					
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y	= ty;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
				}
			}
		}

		function alignMiddle(){
			if ( KTCE.currentPaper.selectedShapeArray.length > 1){
				var baseY = calBaseY(KTCE.currentPaper.selectedShapeArray[0].freeTransform);
				var baseObj = KTCE.currentPaper.selectedShapeArray[0];
				for(var i=1; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var ty = toTransBaseY(KTCE.currentPaper.selectedShapeArray[i].freeTransform, baseY);
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x
						, ty
					].join(','));
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y	= ty;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
					
				}
			}
		}

		function alignAllHcenter(){
			var sArray = KTCE.currentPaper.selectedShapeArray;
			if ( sArray.length > 1){
				for(var i=0; i<sArray.length; i++){
					sArray[i].tempLeft = calLeft(sArray[i]);
					sArray[i].tempRight = calRight(sArray[i]);
				}
			
				//sorting base left value
				sArray.sort(function(a, b){
					return parseFloat(a.tempLeft) - parseFloat(b.tempLeft);
				});
				var minLeft = sArray[0].tempLeft;
				var maxRight = sArray[sArray.length-1].tempRight;
				var distance = maxRight - minLeft;
				var spaceWidth = distance;
				for(var i=0; i<sArray.length; i++){
					spaceWidth -= getObjAlignSize(sArray[i], 'W');
				}
				var sItem = spaceWidth / (sArray.length - 1);

				var marginLeft = sArray[0].tempLeft;
				for(var i=0; i<sArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var tx = toTransLeft(sArray[i], marginLeft);
					var prevSize = getObjAlignSize(sArray[i], 'W');
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + tx
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y
					].join(','));
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x	= tx;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);
					marginLeft += prevSize + sItem;
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
				}
				
			}
		}

		function alignAllVmiddle(){
			var sArray = KTCE.currentPaper.selectedShapeArray;
				
			if ( sArray.length > 1){
				for(var i=0; i<sArray.length; i++){
					sArray[i].tempTop = calTop(sArray[i]);
					sArray[i].tempBottom = calBottom(sArray[i]);
				}
				//sorting base left value
				sArray.sort(function(a, b){
					return parseFloat(a.tempTop) - parseFloat(b.tempTop);
				});
				var minTop = sArray[0].tempTop;
				var maxBottom = sArray[sArray.length-1].tempBottom;
				var distance = maxBottom - minTop;
				var spaceHeight = distance;
				for(var i=0; i<sArray.length; i++){
					spaceHeight -= getObjAlignSize(sArray[i], 'H');
				}
				var sItem = spaceHeight / (sArray.length - 1);

				var marginTop = sArray[0].tempTop;
				for(var i=0; i<sArray.length; i++){
					
					var obj = KTCE.currentPaper.selectedShapeArray[i];
					if(obj.freeTransform.isLock(obj)) {
						console.log('잠금객체는 정렬하기가 지원하질 않습니다!');
						continue;
					}
					
					var ty = toTransTop(sArray[i], marginTop);
					var prevSize = getObjAlignSize(sArray[i], 'H');
				
					KTCE.currentPaper.selectedShapeArray[i].transform([
						'R' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.rotate
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'S' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.scale.y
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.x
						, KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.center.y
						, 'T' + KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.x
						, ty
					].join(','));
					
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs.translate.y	= ty;
					KTCE.currentPaper.selectedShapeArray[i].freeTransform.updateHandles();
					
					// item.el : snap 객체
					// ft.attrs : transform 정보
					
					KTCE.updateData(KTCE.currentPaper.selectedShapeArray[i], KTCE.currentPaper.selectedShapeArray[i].freeTransform.attrs);
					marginTop += prevSize + sItem;
					if($(KTCE.currentPaper.selectedShapeArray[i].node).attr("data-name") == 'xTable'){
						KTCE.updateTextPositionInTable(KTCE.currentPaper.selectedShapeArray[i].freeTransform);
					}	
				}
				
			}
		}


		function getObjAlignSize(obj, opt){
			if(opt == "W") var s = obj.freeTransform.bbox.node.getBBox().width;
			else if(opt == "H") var s = obj.freeTransform.bbox.node.getBBox().height;
			return s;
		}
		
		function calLeft(obj){
			if(obj.freeTransform == undefined) return;
			if(obj.freeTransform.bbox != null) {			
				var x = obj.freeTransform.attrs.center.x
							+ obj.freeTransform.attrs.translate.x
					        - obj.freeTransform.bbox.node.getBBox().width/2
				return x;
			}
		
		}

		function calRight(obj){
			if(obj.freeTransform == undefined) return;
			var x = obj.freeTransform.attrs.center.x
						+ obj.freeTransform.attrs.translate.x
						+ obj.freeTransform.bbox.node.getBBox().width/2	
			return x;
		}

		function calBaseX(obj){
			var x = obj.attrs.center.x
					+ obj.attrs.translate.x
			return x;
		}

		function calBaseY(obj){
			var y = obj.attrs.center.y
					+ obj.attrs.translate.y
			return y;
		}

		function calTop(obj){
			if(obj.freeTransform == undefined) return;
			if(obj.freeTransform.bbox != null) {
				var y = obj.freeTransform.attrs.center.y
						+ obj.freeTransform.attrs.translate.y
					    - obj.freeTransform.bbox.node.getBBox().height/2;
				
				return y;
			}
		
		}

		function calBottom(obj){
			if(obj.freeTransform == undefined) return;
			var y = obj.freeTransform.attrs.center.y
					+ obj.freeTransform.attrs.translate.y
				    + obj.freeTransform.bbox.node.getBBox().height/2;
			return y;
		}

		function toTransLeft(obj, x){
			var tx = x + obj.freeTransform.bbox.node.getBBox().width/2 - obj.freeTransform.attrs.center.x;
			return tx;
		}

		function toTransRight(obj, x){
			var tx = x - obj.freeTransform.bbox.node.getBBox().width/2 - obj.freeTransform.attrs.center.x;
			return tx;
		}

		function toTransBase(obj, x){
			var tx = x - obj.attrs.center.x;
			return tx;
		}

		function toTransTop(obj, y){
			var ty = y + obj.freeTransform.bbox.node.getBBox().height/2 - obj.freeTransform.attrs.center.y;
			return ty;
		}

		function toTransBottom(obj, y){
			var ty = y - obj.freeTransform.bbox.node.getBBox().height/2 - obj.freeTransform.attrs.center.y;
			return ty;
		}

		function toTransBaseY(obj, y){
			var ty = y - obj.attrs.center.y;
			return ty;
		}

		// 오브젝트 zIndex 변경
		function fnObjectZindex() {
			trigger.objectZindex.each(function(i) {
				var thisType = '';

				if ( $(this).filter('.toFirst').length ) {
					thisType = 'toFirst';
				} else if ( $(this).filter('.toLast').length ) {
					thisType = 'toLast';
				} else if ( $(this).filter('.toFront').length ) {
					thisType = 'toFront';
				} else if ( $(this).filter('.toBack').length ) {
					thisType = 'toBack'
				}

				$(this).off().on({
					mousedown : function() {

						if ( KTCE.currentPaper.currentShape != null ) {
							var thisNode = parseInt(KTCE.currentPaper.currentShape.attr('data-order'));
							var thisNodeType = KTCE.currentPaper.currentShape.attr('data-name');
							switch(thisType) {
								case 'toFirst' :
									KTCE.currentPaper.currentShape.appendTo(KTCE.currentPaper.objWrap);
									break;
								case 'toLast' :
									KTCE.currentPaper.currentShape.prependTo(KTCE.currentPaper.objWrap);
									break;
								case 'toFront' :
									var _currentNode = KTCE.currentPaper.currentShape;
									//이동 대상이 표일경우
									if(thisNodeType === 'xTable') {
										if(_currentNode.next() === null) return;
										//1. 표내 텍스트가 있을 경우
										if(_currentNode.next() !=null && _currentNode.next().attr('class').indexOf('tableTextWrapper') > -1) {	
											//이동위치의 객체가 표일 경우
											if(_currentNode.next().next() !=null && _currentNode.next().next().attr('data-name') == 'xTable') {
												//이동위치의 객체가 표일때 표내 텍스트가 있을 경우
												if(_currentNode.next().next().next().attr('class').indexOf('tableTextWrapper') > -1) {
													KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next().next().next());
													//이동위치의 객체가 표일때 표내 텍스트가 없을 경우	
												}else{
													KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next().next());
												}
											//이동위치의 객체가 표가 아닐 경우
											}else{
												KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next().next());
											}
										//2. 표내 텍스트가 없을 경우
										}else if(_currentNode.next() !=null && _currentNode.next().attr('class').indexOf('tableTextWrapper') == -1) {	
											//이동위치의 객체가 표일 경우
											if(_currentNode.next().attr('data-name') == 'xTable') {
												//이동위치의 객체가 표일때 표내 텍스트가 있을 경우
												if(_currentNode.next().next().attr('class').indexOf('tableTextWrapper') > -1) {
													KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next().next());
													//이동위치의 객체가 표일때 표내 텍스트가 없을 경우	
												}else{
													KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next());
												}
											//이동위치의 객체가 표가 아닐 경우
											}else{
												KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next());
											}
										}
									//이동 대상이 표가 아닐경우	
									}else{
										if(_currentNode.next() === null) return;
										//이동위치가 표일 경우
										if(_currentNode.next() !=null && _currentNode.next().attr('data-name') == 'xTable') {
											//이동위치의 객체가 표일때 표내 텍스트가 있을 경우
											if(_currentNode.next().next().attr('class').indexOf('tableTextWrapper') > -1) {
												KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next().next());
												//이동위치의 객체가 표일때 표내 텍스트가 없을 경우	
											}else{
												KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next());
											}
										//이동위치가 표가 아닐경우
										}else{
											KTCE.currentPaper.currentShape.insertAfter(KTCE.currentPaper.currentShape.next());
										}
									}
									break;
								case 'toBack' :
									if ( KTCE.currentPaper.currentShape.prev() != null) {
										if(KTCE.currentPaper.currentShape.prev().prev()!=null && KTCE.currentPaper.currentShape.prev().prev().attr('data-name') ==  'xTable') {
											KTCE.currentPaper.currentShape.insertBefore(KTCE.currentPaper.currentShape.prev().prev());
										}else{
											KTCE.currentPaper.currentShape.insertBefore(KTCE.currentPaper.currentShape.prev());
										}
									}
									break;
							}
							if(thisNodeType === 'xTable') {
								var _tableTextWrapper = $("g.xTableTexts_"+ KTCE.currentPaper.currentShape.node.id);
								$(KTCE.currentPaper.currentShape.node).after(_tableTextWrapper);
							}
							setTimeout(function() {
								fnSaveState();
							}, 1);
						}
					}
				});
			});
		}

		/******************************************************************************/
		/* Section: 도형
		/******************************************************************************/

		// 도형 추가
		function fnAddShapeBinding() {
			trigger.addShape.each(function(i) {

				var _this = $(this)

				_this.off().on({
					click : function() {
						hideAllHandler();
						
						var thisType = KTCE.shapeCode['shape'+(i+1)].type
							, thisCode = KTCE.shapeCode['shape'+(i+1)].code

						fnCreateShape(thisType, thisCode, (i+1));
						
						// 상태저장
						fnSaveState();
					}
				});
			});
		}

		// 도형 모양에 따른 분기
		function fnCreateShape(type, code, no, tempInfo, prevObj, nextObj, action, handler) {
			var tempShape = null
				, tempShapeG = null
				, tempCode = code;
			
			switch(type) {
				case 'line' :
					tempCode = code.split(',')
					tempShape = KTCE.currentPaper.objWrap.line(tempCode[0],tempCode[1]-= $(".paperFrame").position().top,tempCode[2],tempCode[3]-= $(".paperFrame").position().top);
					break;
				case 'rect' :
					tempCode = code.split(',')
					if(no == 4){	//round rect
						tempShape = KTCE.currentPaper.objWrap.rect(tempCode[0],tempCode[1],tempCode[2],tempCode[3], tempCode[4], tempCode[5]);
					}else{	//rect
						tempShape = KTCE.currentPaper.objWrap.rect(tempCode[0],tempCode[1],tempCode[2],tempCode[3]);
					}
					break;
				case 'ellipse' :
					tempCode = code.split(',')
					tempShape = KTCE.currentPaper.objWrap.ellipse(tempCode[0],tempCode[1],tempCode[2], tempCode[3], tempCode[4]);
					break;
				case 'path' :
					tempShape = KTCE.currentPaper.objWrap.path(code);
					break;
				default :
					var codeArray = code.split(",");
					tempShape = KTCE.currentPaper.objWrap.polygon(codeArray);
			}

			var fillValue = '#fff';
			var fillId = null;
			var filterValue = null;
			var filterId = null
			var strokeValue ='#666';
			var strokeWidth = 1;
			var matrixValue = 'matrix(1,0,0,1,0,0)';
			var opacityValue = 1;
			if(tempInfo != undefined) {
				
				//도형객체 사이즈 변경후 index위치 원래위치로 잡기
				var currentShapePrev = prevObj;
				fnShpaeRePostion(tempShape, currentShapePrev);
				
				strokeValue = (tempInfo.stroke !=undefined) ? tempInfo.stroke : '#666';
				strokeWidth = (tempInfo.strokeWidth !=undefined) ? tempInfo.strokeWidth : 1;
				fillValue = (tempInfo.fill != undefined) ? tempInfo.fill : '#fff';
				fillId = (tempInfo.fillId != undefined) ? tempInfo.fillId : null;
				filterValue = (tempInfo.filter != undefined) ? tempInfo.filter : null;
				filterId = (tempInfo.filterId != undefined) ? tempInfo.filterId : null;
				opacityValue = (tempInfo.opacity != undefined) ? tempInfo.opacity : null;
			}
			
			tempShape.attr({
				stroke : strokeValue
				, strokeWidth : strokeWidth
				, fill : fillValue
				, 'filter' : filterValue
				, opacity : opacityValue
			//	, width: "*=1" // prefixed values				
				, 'vector-effect' : 'non-scaling-stroke'
				, 'shape-redering' : 'crispEdges'
			});
			
			$(tempShape.node).attr({
				'stroke-width' : strokeWidth
				, 'data-shape-inddex' : no
				, 'transform' : matrixValue 
				, 'filter' : filterValue
				, 'data-fill-id' : fillId
				, 'data-filter-id' : filterId
				, 'opacity' : opacityValue
			});
			
			if(tempInfo == undefined) {
				fnSetFreeTransform(tempShape);
			}else{	
				if(action=='ungroup') {
					fnSetFreeTransform(tempShape, 'ungroup');
					$("g.dataGroup>g." + handler.subject.id).remove();
					
					setTimeout(function(){
						KTCE.currentPaper.selectedShapeArray.push(tempShape);
					}, 100)
					
				}else{
					fnSetFreeTransform(tempShape, 'ungroup');
					$("g.dataGroup>g." + KTCE.currentPaper.currentShape.id).remove();
					KTCE.currentPaper.currentShape = tempShape;
				}
				
				if(KTCE.currentPaper.currentShape) {
					tempShape.addTransform('r'+ KTCE.currentPaper.currentShape.freeTransform.attrs.rotate);
					var ft = tempShape.freeTransform;
					ft.attrs.rotate = KTCE.currentPaper.currentShape.freeTransform.attrs.rotate;
				}else{
					tempShape.addTransform('r'+ handler.attrs.rotate);
					var ft = tempShape.freeTransform;
					ft.attrs.rotate = handler.attrs.rotate;
					ft.visibleHandles();
					
					handler.hideHandles();
					handler.updateHandles();
				}
				
				ft.updateHandles();
			}
			
			setShapeEffect(0);
		}
	
		//도형객체 사이즈 조절시 위치 마지막에서 원래위치로 복구
		function fnShpaeRePostion(currentShape, currentShapePrev) {
			
			if(currentShapePrev != null) {
				currentShape.insertAfter(currentShapePrev);
			}else{
				currentShape.prependTo(KTCE.currentPaper.objWrap);
			}
		}
		
		function setShapeEffect(idx){
			var strokeWidthList =$('#strokeWidthLayer .numberList').find('li')
			strokeWidthList.find('button').removeClass('active');
			$(strokeWidthList.find('button')[idx]).addClass('active');
		}

		// 도형 배경색 기능
		function fnShapeFillBinding() {
			trigger.fillShape.each(function(){
				var _this = $(this)

				_this.on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							fillBGColor(_this, KTCE.currentPaper.currentShape);
							fnSetIndicator(KTCE.currentPaper);

							setTimeout(function() {
								fnSaveState();
							}, 1);
						}
					}
				});
			});
		}

		// 도형 스트로크 색상 기능
		function fnShapeStrokeBinding() {
			trigger.shapeStroke.each(function(){
				var _this = $(this)

				_this.on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							fillStrokeColor(_this, KTCE.currentPaper.currentShape);
							fnSetIndicator(KTCE.currentPaper);

							setTimeout(function() {
								fnSaveState();
							}, 1);
						}
					}
				});
			});
		}

		// 도형 스트로크 넓이 기능
		function fnStrokeWidthBinding(){
			trigger.shapeStrokeWidth.each(function() {
				var _this = $(this)
					, thisWidth = parseInt(_this.text(), 10)

				_this.on({
					click : function() {

						if ( KTCE.currentPaper.currentShape != null ) {

							trigger.shapeStrokeWidth.removeClass('active');
							_this.addClass('active');

							KTCE.currentPaper.currentShape.attr({
								strokeWidth : thisWidth
							});	
							$(KTCE.currentPaper.currentShape.node).attr({							
								'stroke-width' : thisWidth
							});								

							setTimeout(function() {
								fnSaveState();
							}, 1);
						}
					}
				});
			});
		}
		

		/*
		 * 표 서식
		 */
		// 표 배경색으로 설정
		function setCellBGColor(trigger, obj) {
			var thisColor = (getColorHex(trigger) =='transparent') ? 'none' : getColorHex(trigger);
			obj.attr({
				fill : thisColor
			});
		}
		
		//표 셀 선택활성화 배경색
		function setCellHoverFillColor(trigger, obj, opacity) {
			var thisColor = (trigger != null) ? ((getColorHex(trigger)=='transparent') ? 'none' : getColorHex(trigger)) : '#a2a2da';
			obj.attr({
				fill : thisColor,
				"style": "opacity:" + opacity
			});
			
		}		

		function setCellStrokeColor(trigger, obj) {
			var thisColor;
			if(trigger.hasClass('active')) {
				thisColor = $("#tableCellStrokeFillLayer .crColor").css('background-color')
			}else{
				thisColor = getColorHex(trigger);
			}
			thisColor = (thisColor=='transparent') ? 'none' : thisColor;
			obj.attr({
				stroke : thisColor
			});
		}
		
		function getStrokeColor(obj) {			
			var _strokeColor = (obj.attr("stroke")=='transparent') ? 'none' : obj.attr("stroke");
			return _strokeColor;
			//return obj.attr("stroke");
		}
		
		function setStrokeWidth(trigger, obj, selectedObj, lastIndex) {		
			var thisWidth = parseInt(trigger.text(), 10);
			var thisX = obj.attr('x1') - thisWidth/2;
			if(obj.type === 'line') {
				obj.attr({
					strokeWidth : thisWidth,
					'data-stroke-width': thisWidth
				});
			}
			
			obj.parent().attr({'data-stroke-width': thisWidth});
			
			//표내 텍스트 Line두께값 반영 유지
			if(lastIndex != undefined){
				var selectedArray = fnFindTextGroup( KTCE.currentPaper.currentShape );
				if(selectedArray != undefined){
					var textAlign = [];
					if(selectedObj === 'all') {
						var cellArray = KTCE.currentPaper.currentShape.selectAll('.xCellHover');
						for(var i=0; i<cellArray.length; i++){
							var cell = cellArray[i];
							textAlign[i] = ($(cell.node).attr("data-text-align") == undefined) ? "left" : $(cell.node).attr("data-text-align");
						}
						fnCellTextArrayAlign(KTCE.currentPaper.currentShape, textAlign);
					}else{
						var cellArray = selectedArray.cellArray;
						if(lastIndex == cellArray.length) {
							if(cellArray.length > 0){
								for(var i=0; i<cellArray.length; i++){
									var cell = cellArray[i];
									textAlign[i] = ($(cell).attr("data-text-align") == undefined) ? "left" : $(cell).attr("data-text-align");
								}
								fnCellTextArrayAlign(KTCE.currentPaper.currentShape, textAlign);
							}
						}
					}
				}
			}
			if(browserType.indexOf('msie') > -1){   
				setIEStrokeWidth(KTCE.currentPaper.currentShape);
			}	
		}

		//표 라인테두리 두께 유지 함수
		function setIEStrokeWidth(obj) {              
			var obj = (obj==null) ? KTCE.currentPaper.currentShape : obj;	
			//cell기본 테두리는 라인두께에 따른 테두를 일부만 보이게할때 cell배경 영역이 라인두께의 절반만큼만 채워지는 형태로 보임
            if(browserType.indexOf('msie') > -1){   //chrome
                var matrix = obj.attr('transform').globalMatrix;
                var _xLine = obj.selectAll('.xLine');
                var _yLine = obj.selectAll('.yLine');
                
                _yLine.forEach(function(el, idx){
                	var _currentYstrokeWidth = parseFloat(el.attr('data-stroke-width'));
                	var _newXstrokeWidth = _currentYstrokeWidth/matrix.a;
                    el.attr({strokeWidth: _newXstrokeWidth});
                });
                
                var _tableNumber = parseInt(obj.node.getAttribute('data-id').substring(6,8));
                if(KTCE.currentPaper.tableArray[_tableNumber] == undefined) return;
                var _tableX = KTCE.currentPaper.tableArray[_tableNumber].tableX;
                
                var xLineReDraw = function() {

                	_xLine.forEach(function(el, idx){
                    	var _currentXstrokeWidth = parseFloat(el.attr('data-stroke-width'));
                    	var _newYstrokeWidth = _currentXstrokeWidth/matrix.d;
                        el.attr({strokeWidth: _newYstrokeWidth});
                                             
                        //가로라인 모서리가 scale 비율만큼 커지는 현상 제어
                        var _strokeBaseWidth = _currentXstrokeWidth/2;
                        var _currentBaseX1 = parseFloat(_yLine[idx%_tableX].attr('x1'));
                        var _currentBaseX2 = parseFloat(_yLine[idx%_tableX + 1].attr('x1'));
                        var _currentBaseY1 = parseFloat(_yLine[idx%_tableX].attr('y1'));
                        var _currentBaseY2 = parseFloat(_yLine[idx%_tableX + 1].attr('y2'));
                        
                        var _x1 = _currentBaseX1 + (_strokeBaseWidth - (_strokeBaseWidth / matrix.a));
                        var _x2 = _currentBaseX2 - (_strokeBaseWidth - (_strokeBaseWidth / matrix.a));
                        var _y = (_strokeBaseWidth - (_strokeBaseWidth / matrix.d));
                        var _y1 = _currentBaseY1+ (_strokeBaseWidth - (_strokeBaseWidth / matrix.d));
                        var _y2 = _currentBaseY2 - (_strokeBaseWidth - (_strokeBaseWidth / matrix.d));
                        
                        //원본
                        el.attr({
                            'x1': _x1 - _y,
                        	'x2': _x2 + _y,
                            //'y1': _y1,
                            //'y2': _y2
                        });
                        
                    });
                }
                
                xLineReDraw();

            }

		}

		function setCellEffectInfo(cell){
			var idx = 0;
			if(cell != undefined){
				var targetTable = undefined;
				for(var i=0; i< KTCE.currentPaper.tableArray.length; i++){
					if(KTCE.currentPaper.tableArray[i].id == cell.parent().attr("id")){
						targetTable = KTCE.currentPaper.tableArray[i];
						break;
					}
				}
				if(targetTable != undefined){
					if(cell.attr('data-merge') != null){
						var mergedNum = cell.attr('data-merge').split(",");
						idx = parseInt(targetTable.cellArray[parseInt(mergedNum[0])].attr("strokeWidth").split("px")[0]) - 1;
					} else {
						var targetCell = targetTable.cellArray[targetTable.length.x * parseInt(cell.attr("data-index-y")) + parseInt(cell.attr("data-index-x"))]
						if(targetCell != undefined){
							var cellStrokeW = parseInt(targetCell.attr("strokeWidth").split("px")[0]);
							idx = cellStrokeW-1;
						} 
					}
				}
			}
			var tableCellStrokeWidthList =$('#tableCellStrokeWidthLayer .numberList').find('li')
			tableCellStrokeWidthList.find('button').removeClass('active');
			if(tableCellStrokeWidthList.find('button')[idx] != undefined){
				$(tableCellStrokeWidthList.find('button')[idx]).addClass('active');
			} else {
				$(tableCellStrokeWidthList.find('button')[0]).addClass('active');
			}

		}

		function setStrokeDispaly(obj, _opacity, _fill, _stroke, _strokeWidth) {
			if(_stroke=='none') {
				obj.attr({
					display: 'none'
				});
			}else if(_stroke=='block') {
				obj.attr({
					display: 'block'
					, opacity: _opacity
					, fill: _fill
				});
			}else{
				obj.attr({
					 opacity: _opacity
					, fill: _fill
				});
			}			
			obj[0].style.opacity = _opacity;			

		}
		
		function setColor(_target, _color) {
			_target.attr({
				fill : _color,				
				stroke: _color
			});
		}
		//색값 얻기
		function getColor(_target) {
			return _target.attr("fill");
		}
		var activeCellArray = [];
		

		function setIndicator(_type, _color) {
			if ( KTCE.currentPaper.currentShape != null ) {
				switch(_type){
				case "fill":
					fillColorIndicator.css('backgroundColor', _color);
					break;
				case "stroke":
					strokeColorIndicator.css('backgroundColor', _color);
					break;
				}
			} else {				
				//indicator.css('backgroundColor', 'transparent');
				indicator.css('backgroundColor', 'none');				
			}
		}

		function setTable(_target, _eventType, _actionType) {
			
			if ( KTCE.currentPaper.currentShape != null ) {
				var _this = _target;
				var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));
				var _tableObj = KTCE.currentPaper.tableArray[_tableNumber];
	
				var tableX = KTCE.currentPaper.tableArray[_tableNumber].tableX;
				var tableY = KTCE.currentPaper.tableArray[_tableNumber].tableY;
				
				var selectedArray = fnFindTextGroup( KTCE.currentPaper.currentShape );
				if(selectedArray === undefined) return;
				
				var cellArray = selectedArray.cellArray;
				var cellArrayLength = cellArray.length;
				var textArray = selectedArray.textArray;
				var textArrayLength = textArray.length;
				
				//표 객체 개별 셀 영역 선택이 아닌 전체선택시
				if(cellArrayLength===0){
					cellArray = selectedArray.cellArray = $('#' + KTCE.currentPaper.currentShape.node.id+'>rect.xCellHover');
					cellArrayLength = cellArray.length;
					textArray = selectedArray.textArray = $('.xTableTexts_' + KTCE.currentPaper.currentShape.node.id+'>text');
					var tableObjCellTextArray = [];
					for(var i=0; i<_tableObj.cellTextArray.length; i++){
						var cellText = _tableObj.cellTextArray[i];
						var cellTextLength = cellText.length;
						if(cellTextLength > 0){
							for(var j=0; j<cellTextLength; j++) {
								if(cellText[j] != undefined) tableObjCellTextArray.push(cellText[j]);
							}
						}
					}
					textArray = selectedArray.textArray = tableObjCellTextArray;
					textArrayLength = textArray.length;
				}
				
				var textG = selectedArray.textArray[0];
				
				//셀선택시
				if(cellArrayLength > 0) {
									
					switch(_actionType) {
						case "bgColor":	//배경색 변경
							
							switch(_eventType){
								case 'click':
									for(var i=0; i<cellArrayLength; i++){
										var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
										var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
										var xCell = $("#" + KTCE.currentPaper.currentShape.node.id+">rect.xCell.x"+ _xIndexX + "_y" + _xIndexY);
										setCellBGColor(_this, xCell);
										setIndicator("fill", getColor(xCell));
									}
									clickFlag = true;
									break;
								case 'mouseover':
									var tableCellFillLayer = $('#tableCellFillLayer').css('display');
									if(tableCellFillLayer==='block'){
										//var thisColor = (getColorHex(_this)=='transparent') ? 'none' : getColorHex(_this);
										var xCellHover = $('#' + KTCE.currentPaper.currentShape.node.id+'>rect.xCellHover[data-active="active"]');
										if(xCellHover.length === 0){
											xCellHover = $('#' + KTCE.currentPaper.currentShape.node.id+'>rect.xCellHover');
										}
										setCellHoverFillColor(_this, xCellHover, 1);
									}
									break;
								case 'mouseleave':
									var tableCellFillLayer = $('#tableCellFillLayer').css('display');
									if(tableCellFillLayer==='block'){
										var xCellHover = $('#' + KTCE.currentPaper.currentShape.node.id+'>rect.xCellHover[data-active="active"]');
										if(xCellHover.length === 0){
											xCellHover = $('#' + KTCE.currentPaper.currentShape.node.id+'>rect.xCellHover');
											setCellHoverFillColor(null, xCellHover, 0);
										}else{
											setCellHoverFillColor(null, xCellHover, 0.4);
										}
									}
									break;
							}
							break;
						case "strokeColor":
							for(var i=0; i<cellArrayLength; i++){
								var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
								var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
								var xCell = $("#" + KTCE.currentPaper.currentShape.node.id+">rect.xCell.x"+ _xIndexX + "_y" + _xIndexY);
								
								//setIndicator("fill", getColor(xCell));
								//setCellStrokeColor(_this, xCell);
							}
							for(var i=0; i<cellArrayLength; i++){
								var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
								var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
								//var thisWidth = parseInt(_this.text(), 10);;
								
								var xTId = "#xLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
								var xTNode = $(KTCE.currentPaper.currentShape.node).find(xTId);
								//xTNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								setIndicator("fill", getColor(xTNode));
								setCellStrokeColor(_this, xTNode);
								
								var xBId = "#xLine" + _tableNumber + "_" + (_xIndexY + 1) + "_" + _xIndexX + "_" + _tableObj.id;
								var xBNode = $(KTCE.currentPaper.currentShape.node).find(xBId);
								//xBNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								setIndicator("fill", getColor(xBNode));
								setCellStrokeColor(_this, xBNode);
								
								var yLId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
								var yLNode = $(KTCE.currentPaper.currentShape.node).find(yLId);
								//yLNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								setIndicator("fill", getColor(yLNode));
								setCellStrokeColor(_this, yLNode);
								
								var yRId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + (_xIndexX + 1) + "_" + _tableObj.id;
								var yRNode = $(KTCE.currentPaper.currentShape.node).find(yRId);
								//yRNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								setIndicator("fill", getColor(yRNode));
								setCellStrokeColor(_this, yRNode);
								
								
							}
							break;
						case "tablelineStrokeWidth": 	//라인두께
				
							for(var i=0; i<cellArrayLength; i++){
								var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
								var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
								var thisWidth = parseInt(_this.text(), 10);;
								
								var topId = "#xLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
								var topNode = $(KTCE.currentPaper.currentShape.node).find(topId);
								//setStrokeWidth(_this, topNode) 
								topNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								
								var bottomId = "#xLine" + _tableNumber + "_" + (_xIndexY + 1) + "_" + _xIndexX + "_" + _tableObj.id;
								var bottomNode = $(KTCE.currentPaper.currentShape.node).find(bottomId);
								bottomNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								
								var leftId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
								var leftNode = $(KTCE.currentPaper.currentShape.node).find(leftId);
								leftNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								
								var rightId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + (_xIndexX + 1) + "_" + _tableObj.id;
								var rightNode = $(KTCE.currentPaper.currentShape.node).find(rightId);
								rightNode.attr({'data-stroke-width': thisWidth}).css({'stroke-width' : thisWidth});
								//setStrokeDispaly(yNode, 0, 'none', null, null);
							}
							
							if(browserType.indexOf('msie') > -1){   
								setIEStrokeWidth(KTCE.currentPaper.currentShape);
							}
							
							var ft = KTCE.currentPaper.currentShape.freeTransform;
							KTCE.updateData(KTCE.currentPaper.currentShape, ft.attrs);
							fnUpdateTextPositionInTable( ft, false);

							break;
							
						case "tablelineStrokeDisplay":	//테두리
							
							var tableLineDisplay = function() {
								this.displayValue = null;
								//테두리 없음
								this.None = function(_displayValue) {
									for(var i=0; i<cellArrayLength; i++){
										var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
										var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));

										var topId = "#xLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
										var topNode = $(KTCE.currentPaper.currentShape.node).find(topId); 
										setStrokeDispaly(topNode, 0, 'none', null, null);
										
										var bottomId = "#xLine" + _tableNumber + "_" + (_xIndexY + 1) + "_" + _xIndexX + "_" + _tableObj.id;
										var bottomNode = $(KTCE.currentPaper.currentShape.node).find(bottomId);
										setStrokeDispaly(bottomNode, 0, 'none', null, null);
										
										var leftId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
										var leftNode = $(KTCE.currentPaper.currentShape.node).find(leftId);
										setStrokeDispaly(leftNode, 0, 'none', null, null);
										
										var rightId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + (_xIndexX + 1) + "_" + _tableObj.id;
										var rightNode = $(KTCE.currentPaper.currentShape.node).find(rightId);
										setStrokeDispaly(rightNode, 0, 'none', null, null);
										
									}
								};
								//모든 테두리
								this.All = function(_displayValue) {
									for(var i=0; i<cellArrayLength; i++){
										var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
										var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
										
										var topId = "#xLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
										var topNode = $(KTCE.currentPaper.currentShape.node).find(topId); 
										setStrokeDispaly(topNode, 1, 'none', null, null);
										
										var bottomId = "#xLine" + _tableNumber + "_" + (_xIndexY + 1) + "_" + _xIndexX + "_" + _tableObj.id;
										var bottomNode = $(KTCE.currentPaper.currentShape.node).find(bottomId);
										setStrokeDispaly(bottomNode, 1, 'none', null, null);
										
										var leftId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
										var leftNode = $(KTCE.currentPaper.currentShape.node).find(leftId);
										setStrokeDispaly(leftNode, 1, 'none', null, null);
										
										var rightId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + (_xIndexX + 1) + "_" + _tableObj.id;
										var rightNode = $(KTCE.currentPaper.currentShape.node).find(rightId);
										setStrokeDispaly(rightNode, 1, 'none', null, null);
										
									}
								};
								//바깥쪽 테두리 보기
								this.OutLine = function(_displayValue) {
									var tableLine = new tableLineDisplay();
									tableLine.None(0);
									tableLine.TopLine(1);
									tableLine.BottomLine(1);
									tableLine.LeftLine(1);
									tableLine.RightLine(1);
								};
								//안쪽 테두리 보기
								this.InLine = function(_displayValue) {
									var tableLine = new tableLineDisplay();
									tableLine.None(0);
									tableLine.HorizontalLine(1);
									tableLine.VerticalLine(1);
								};
								//위쪽 테두리만 보기
								this.TopLine = function(_displayValue) {
									var firstX = parseInt($(cellArray[0]).attr('data-index-x'));
									var lastX = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-x'));									
									var _lineColLength = (lastX - firstX) + 1;

									for(var cIdx=0; cIdx < _lineColLength; cIdx++){
										//top
										var _topIndexX = parseInt($(cellArray[cIdx]).attr('data-index-x'));
										var _topIndexY = parseInt($(cellArray[cIdx]).attr('data-index-y'));
										var topId = "#xLine" + _tableNumber + "_" + _topIndexY + "_" + _topIndexX + "_" + _tableObj.id;
										var topNode = $(KTCE.currentPaper.currentShape.node).find(topId);
										setStrokeDispaly(topNode, 1, 'none', null, null);
									}
								};
								//아래쪽 테두리 보기
								this.BottomLine = function(_displayValue) {
									var firstX = parseInt($(cellArray[0]).attr('data-index-x'));
									var lastX = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-x'));
									var _lineColLength = (lastX - firstX) + 1;
									for(var cIdx=0; cIdx < _lineColLength; cIdx++){
										var _bbottomIdx = (cellArrayLength - cIdx) - 1;
										var _bottomIndexX = parseInt($(cellArray[_bbottomIdx]).attr('data-index-x'));
										var _bottomIndexY = parseInt($(cellArray[_bbottomIdx]).attr('data-index-y')) + 1;
										var bottomId = "#xLine" + _tableNumber + "_" + _bottomIndexY + "_" + _bottomIndexX + "_" + _tableObj.id;
										var bottomNode = $(KTCE.currentPaper.currentShape.node).find(bottomId);
										setStrokeDispaly(bottomNode, 1, 'none', null, null);
									}
								};
								//왼쪽 테두리 보기
								this.LeftLine = function(_displayValue) {
									var firstY = parseInt($(cellArray[0]).attr('data-index-y'));
									var lastY = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-y'));
									var _lineRowLength = (lastY - firstY) + 1;
									for(var rIdx=0; rIdx < _lineRowLength; rIdx++){
										var _leftIdx = (cellArrayLength/_lineRowLength) * rIdx
										var _leftIndexX = parseInt($(cellArray[0]).attr('data-index-x'));
										var _leftIndexY = parseInt($(cellArray[_leftIdx]).attr('data-index-y'));
										var leftId = "#yLine" + _tableNumber + "_" + _leftIndexY + "_" + _leftIndexX + "_" + _tableObj.id;
										var leftNode = $(KTCE.currentPaper.currentShape.node).find(leftId);
										setStrokeDispaly(leftNode, 1, 'none', null, null);
									}
									
								};
								
								//오른쪽 테두리 보기
								this.RightLine = function(_displayValue) {
									var firstY = parseInt($(cellArray[0]).attr('data-index-y'));
									var lastY = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-y'));
									var _lineRowLength = (lastY - firstY) + 1;
									for(var rIdx=0; rIdx < _lineRowLength; rIdx++){
										var _rightIdx = (cellArrayLength/_lineRowLength) * rIdx
										var _rightIndexX = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-x')) + 1;
										var _rightIndexY = parseInt($(cellArray[_rightIdx]).attr('data-index-y'));
										var rightId = "#yLine" + _tableNumber + "_" + _rightIndexY + "_" + _rightIndexX + "_" + _tableObj.id;
										var rightNode = $(KTCE.currentPaper.currentShape.node).find(rightId);
										setStrokeDispaly(rightNode, 1, 'none', null, null);
									}
								};
								//안쪽 가로 테두리(--) 보기
								this.HorizontalLine = function(_displayValue) {
									var firstX = parseInt($(cellArray[0]).attr('data-index-x'));
									var firstY = parseInt($(cellArray[0]).attr('data-index-y'));
									var lastX = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-x'));
									var lastY = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-y'));
									var _lineColLength = (lastX - firstX) + 1;
									var _lineRowLength = (lastY - firstY) + 1;
									for(var i=_lineColLength; i<cellArrayLength; i++){
										var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
										var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
										var topId = "#xLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
										var topNode = $(KTCE.currentPaper.currentShape.node).find(topId); 
										
										if(i<_lineColLength){
											setStrokeDispaly(topNode, 0, 'none', null, null);
										}else{
											setStrokeDispaly(topNode, 1, 'none', null, null);
										}
										
									}
									
								};
								//안쪽 세로 테두리(|) 보기
								this.VerticalLine = function(_displayValue) {
									var firstX = parseInt($(cellArray[0]).attr('data-index-x'));
									var firstY = parseInt($(cellArray[0]).attr('data-index-y'));
									var lastX = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-x'));
									var lastY = parseInt($(cellArray[cellArrayLength-1]).attr('data-index-y'));
									var _lineColLength = (lastX - firstX) + 1;
									var _lineRowLength = (lastY - firstY) + 1;
									for(var i=0; i<cellArrayLength; i++){
										var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
										var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
										var leftId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
										var leftNode = $(KTCE.currentPaper.currentShape.node).find(leftId);
										
										if(i%_lineColLength != 0){
											setStrokeDispaly(leftNode, 1, 'none', null, null);
										}
									}
								};
									
							}
							
							var _eventId = _this.index;
							switch(_eventId){
								case 0:
									console.log("테두리 없음!");
									var tableLine = new tableLineDisplay();
									tableLine.None(0);
									break;
								case 1:
									console.log("모든 테두리 ");
									var tableLine = new tableLineDisplay();
									tableLine.All(1);
									
									break;
								case 2:
									console.log("바깥쪽 테두리 ");
									var tableLine = new tableLineDisplay();
									tableLine.OutLine(1);
									
									break;
								case 3:
									console.log("안쪽 테두리 ");
									var tableLine = new tableLineDisplay();
									tableLine.InLine(1);
									
									break;
								case 4:
									console.log("위쪽 테두리!");
									var tableLine = new tableLineDisplay();
									tableLine.TopLine(1);
									
									//tableLineTopDisplay();
	
									break;
								case 5:
									console.log("아래쪽 테두리! ");
									var tableLine = new tableLineDisplay();
									tableLine.BottomLine(1);
									
									break;
								case 6:
									console.log("왼쪽 테두리 ");
									
									var tableLine = new tableLineDisplay();
									tableLine.LeftLine(1);
									
									break;
								case 7:
									console.log("오른쪽 테두리 ");
									
									var tableLine = new tableLineDisplay();
									tableLine.RightLine(1);
									
									break;
								case 8:
									console.log("안쪽 가로 테두리(--) ");
									
									var tableLine = new tableLineDisplay();
									tableLine.HorizontalLine(1);
									
									break;
								case 9:
									console.log("안쪽 세로 테두리(|) ");
									
									var tableLine = new tableLineDisplay();
									tableLine.VerticalLine(1);
							
									break;
									
							}
							
							break;
							
						case "tableCellMerge":	//셀병합
							console.log('셀병합');
							
							//좌측 셀에 text가 없을 경우 처리: 셀병합 > 셀병활시 빈 text error버그 수정
							if(cellArrayLength != textArrayLength) {
								var idx_x = parseInt($(cellArray[0]).attr('data-index-x'));
								var idx_y = parseInt($(cellArray[0]).attr('data-index-y'));
								var firstText = $("#text"  + _tableNumber + "_" + idx_x + "_" + idx_y + "_" + _tableObj.id);
								if(firstText.length == 0) {
									//첫번째 셀에 글자를 입력하라!!!
									fnCreateTextinTable($(cellArray[0]), KTCE.currentPaper.currentShape, _tableObj, '');
									selectedArray = fnFindTextGroup( KTCE.currentPaper.currentShape );
									if(selectedArray === undefined) return;
									cellArray = selectedArray.cellArray;
									cellArrayLength = cellArray.length;
									textArray = selectedArray.textArray;
									textArrayLength = textArray.length;
									textG = selectedArray.textArray[0];
								}
							}
							
							var mergeDataArray = [];
							for(var i=0; i<cellArrayLength; i++){
								var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
								var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
								var xId = "#xLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
								var xNode = $(KTCE.currentPaper.currentShape.node).find(xId);
								xNode.css('display', 'none');

								var yId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
								var yNode = $(KTCE.currentPaper.currentShape.node).find(yId);
								yNode.css('display', 'none');
								
								//병합셀 배경통일
								var xCellId = 'rect.xCell.x' + _xIndexX + '_y' + _xIndexY;
								var $xCell = $("#" + _tableObj.id).find(xCellId);
								if(i==0){
									var _fill = $xCell.attr('fill')
								}else{
									$xCell.attr({'fill': _fill, 'stroke': _fill});
								}
								
								var mergeData = null;
								if(_xIndexY==0){
									mergeData = _xIndexX.toString();
								}else{
									mergeData = (_xIndexY * tableX) + _xIndexX;
								}
								mergeDataArray.push(mergeData);
							}
	
							for(var i=0; i<cellArrayLength; i++){
								$(cellArray[i]).attr('data-merge', mergeDataArray);
							}
							var mergeDataArrayLength = mergeDataArray.length;
							var _lineColLength = (mergeDataArray[mergeDataArrayLength-1] % tableX - mergeDataArray[0] % tableX) + 1;
							var _lineRowLength = (parseInt(mergeDataArray[mergeDataArrayLength-1] / tableY) - parseInt(mergeDataArray[0] / tableY))+ 1;
							
							for(var cIdx=0; cIdx < _lineColLength; cIdx++){
								//top
								var _topIndexX = parseInt($(cellArray[cIdx]).attr('data-index-x'));
								var _topIndexY = parseInt($(cellArray[cIdx]).attr('data-index-y'));
								var topId = "#xLine" + _tableNumber + "_" + _topIndexY + "_" + _topIndexX + "_" + _tableObj.id;
								var topNode = $(KTCE.currentPaper.currentShape.node).find(topId);
								//topNode.attr('display', 'block');
								topNode.css('display', 'block');
								//setStrokeDispaly(topNode, 1, 'none', 'block', null);
								
								//bottom
								var _bbottomIdx = (cellArrayLength - _lineColLength) + cIdx;
								var _bottomIndexX = parseInt($(cellArray[_bbottomIdx]).attr('data-index-x'));
								var _bottomIndexY = parseInt($(cellArray[_bbottomIdx]).attr('data-index-y')) + 1;
								var bottomId = "#xLine" + _tableNumber + "_" + _bottomIndexY + "_" + _bottomIndexX + "_" + _tableObj.id;
								var bottomNode = $(KTCE.currentPaper.currentShape.node).find(bottomId);
								bottomNode.css('display', 'block');
								//setStrokeDispaly(bottomNode, 1, 'none', 'block', null);
							}
												
							for(var rIdx=0; rIdx < _lineRowLength; rIdx++){
								//left
								var _leftIdy = rIdx * _lineColLength;
								var _leftIndexX = parseInt($(cellArray[0]).attr('data-index-x'));
								var _leftIndexY = parseInt($(cellArray[_leftIdy]).attr('data-index-y'));
								var leftId = "#yLine" + _tableNumber + "_" + _leftIndexY + "_" + _leftIndexX + "_" + _tableObj.id;
								var leftNode = $(KTCE.currentPaper.currentShape.node).find(leftId);
								leftNode.css('display', 'block');
								//setStrokeDispaly(leftNode, 1, 'none', 'block', null);
	
								//right
								var _rightIndexX = parseInt($(cellArray[_lineColLength-1]).attr('data-index-x')) + 1;
								var _rightIndexY = parseInt($(cellArray[_leftIdy]).attr('data-index-y'));
								var rightId = "#yLine" + _tableNumber + "_" + _rightIndexY + "_" + _rightIndexX + "_" + _tableObj.id;
								var rightNode = $(KTCE.currentPaper.currentShape.node).find(rightId);
								rightNode.css('display', 'block');
								//setStrokeDispaly(rightNode, 1, 'none', 'block', null);
							}
							
							//STEP #2: TEXT합치기
							if(textG != undefined) {
								var lineHeight = parseFloat((textG.attr("data-lineheight") != null) ? textG.attr("data-lineheight") : textG.attr("data-lineHeight"));
								lineHeight = lineHeight == null ? 0 : lineHeight;
								var textBoxPos = {
										x: textG.attr("data-posx"),
										y: textG.attr("data-posy")
									}
								var initX = parseFloat(textBoxPos.x);//textG.attr("data-posy");
								var initHeight = textG.select('text').getBBox().height;
								var textGroupNode = $(textG.node);
								var textNode = textG.selectAll('text')
								var textNodeLength = textNode.length;
								var fristTextNode = textNode[textNodeLength-1];//$(textArray[0].node);
								var fristTextNodeX = parseFloat(fristTextNode.attr('x'));
								var firstTextNodeY = parseFloat(fristTextNode.attr('y'));
								
								//셀병합 > 셀병활시 빈 text error버그 수정
								var fristNodeDelFlag;
								if(fristTextNode.node.textContent == ' ') {
									fristTextNode.remove();
									fristNodeDelFlag = true;
								}else{
									fristNodeDelFlag = false;
								}
								
								//테이블내 텍스트 위치 설정
								for(var i=1; i<textArrayLength; i++){
									var moveNode = $(textArray[i].node).find('text');
									var moveNodeLength = moveNode.length;
									for(var j=0; j<moveNodeLength; j++) {
										firstTextNodeY += initHeight + lineHeight;
										var initY = firstTextNodeY - initHeight;
										$(moveNode[j]).attr({'x': fristTextNodeX, 'y': firstTextNodeY, 'data-initx': fristTextNodeX, 'data-inity': initY});	
										textGroupNode.append(moveNode[j])
									}
									//밑줄삭제
									textGroupNode.find('g.textUnderLine').remove();
									//병합되는 셀 텍스트 그룹 삭제
									$(textArray[i].node).remove();
								}
								
								//셀병합 > 셀병활시 빈 text error버그 수정
								if(fristNodeDelFlag) {
									var newTextArray = textGroupNode.find('text');
									for(var n=0; n<newTextArray.length; n++){
										var firstTextNodeY = parseFloat($(newTextArray[n]).attr('y')) - initHeight;
										var initY = parseFloat($(newTextArray[n]).attr('data-inity')) - initHeight;
										$(newTextArray[n]).attr({'y': firstTextNodeY, 'data-inity': initY});
									}
								}
								
								fnSetTableCellMargin(KTCE.currentPaper);
								
								//STEP#3: TEXT높이가 cell 높이보다 클경우 반영
								var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
								var cellIdx = mergeDataArray[0];
								var targetCell = _tableObj.cellHoverArray[cellIdx];
								var cellBound = getCellBound(targetCell, _tableObj);
								//table cell 크기 조절시 최소 변경에 대한 text값 지정
								var _getTableTextBoxBound = getTableTextBoxBound(textG);
								var _width = _getTableTextBoxBound.width;
								var _height = _getTableTextBoxBound.height + (lineHeight * textG.selectAll('text').length) - lineHeight;
								var _strokeLeftWidth = parseInt($(_tableObj.yLineArray[cellIdx].node).css('stroke-width'));
								textG.attr({
									'data-width': _width,
									'data-height': _height
								});
								var yHeight = _height + tableTextDisPos.textMarginTop + _strokeLeftWidth + 5;
								var xWidth = _getTableTextBoxBound.width + tableTextDisPos.textMarginLeft + _strokeLeftWidth;
								var cellBoundHeight = cellBound.height;
								var cellBoundWidth = cellBound.width;
								var currentShape = KTCE.currentPaper.currentShape;
								var cellNum = cellIdx;
								
								if(yHeight > cellBoundHeight){
									var _Ycell =  _tableObj.cellHoverArray[cellNum]
									var _Ych = cellBound.height;
									var newtextArrayLength = textG.selectAll('text').length;
									var _Yth = _height / newtextArrayLength;
									var row = _lineRowLength;
									var fnTableCellYResize = new fnTableCellResize();
									fnTableCellYResize.setYResize(_tableObj, cellNum, _Ycell, _width, _height, _Ych, _Yth, true, currentShape, 1, 1, true, row);
									fnTableCellYResize.updateYResize();
									//표 테두리 안정화
									setIEStrokeWidth(KTCE.currentPaper.currentShape);
								}
								
								var textAlign = textG.attr('text-align');
								if(textAlign === 'center' || textAlign === 'right'){
									fnCellTextAlign(KTCE.currentPaper.currentShape, textAlign, textG, false);
								}
								
								fnCellTextVerticalAlign('newLine');
								
							}
							
							/*					
							//위 STEP#3을 사용하질 않고 기존로직를 타게 할 경우
							setTimeout(function(){
								//텍스트 병합
								fnTextMergeInTable();
							}, 10)
							 */
							
							break;
						case "tableCellSeparate":	//셀분활
							console.log('셀분할');
							//fnTextSeparateInTable();
							var mergeData = $(cellArray[0]).attr('data-merge');
							if(mergeData != undefined) {
								mergeData = mergeData.split(',');
								//STEP #2: TEXT합치기
								for(var i=0; i<cellArrayLength; i++){
									var _xIndexX = parseInt($(cellArray[i]).attr('data-index-x'));
									var _xIndexY = parseInt($(cellArray[i]).attr('data-index-y'));
									var xId = "#xLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
									var xNode = $(KTCE.currentPaper.currentShape.node).find(xId);
									//xNode.attr('stroke', 'none');
									//xNode.attr('display', 'block');
									$(cellArray[i]).removeAttr('data-merge');
									xNode.css('display', 'block');
									//setStrokeDispaly(xNode, 0, 'none', null, null);
									
									var yId = "#yLine" + _tableNumber + "_" + _xIndexY + "_" + _xIndexX + "_" + _tableObj.id;
									var yNode = $(KTCE.currentPaper.currentShape.node).find(yId);
									//yNode.attr('stroke', 'none');
									//yNode.attr('display', 'block');
									yNode.css('display', 'block');
									//setStrokeDispaly(yNode, 0, 'none', null, null);
								}
								
								if(textG != undefined) {
				
									fnSetTableCellMargin(KTCE.currentPaper);

									//STEP#3: TEXT높이가 cell 높이보다 클경우 반영
									var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
									var cellIdx = mergeData[0];
									var targetCell = _tableObj.cellHoverArray[cellIdx];
									var cellBound = getCellBound(targetCell, _tableObj);
									//table cell 크기 조절시 최소 변경에 대한 text값 지정
									var _getTableTextBoxBound = getTableTextBoxBound(textG);
									var _width = _getTableTextBoxBound.width;
									var lineHeight = parseFloat((textG.attr("data-lineheight") != null) ? textG.attr("data-lineheight") : textG.attr("data-lineHeight"));
									lineHeight = lineHeight == null ? 0 : lineHeight;
									var _height = _getTableTextBoxBound.height + (lineHeight * textG.selectAll('text').length);
									var _strokeLeftWidth = parseInt($(_tableObj.yLineArray[cellIdx].node).css('stroke-width'));
									
									textG.attr({
										'data-width': _width,
										'data-height': _height
									});
									
									var yHeight = _height + tableTextDisPos.textMarginTop + _strokeLeftWidth + 5;
									var xWidth = _getTableTextBoxBound.width + tableTextDisPos.textMarginLeft + _strokeLeftWidth;
									var cellBoundHeight = cellBound.height;
									var cellBoundWidth = cellBound.width;
									var currentShape = KTCE.currentPaper.currentShape;
									var cellNum = cellIdx;
									
									//셀 분활시 가로폭 셀 크기 반영
									if(xWidth > cellBoundWidth){
										//아래 함수/싱글톤을 prototype 으로 변경
										var _Xcell =  _tableObj.cellHoverArray[cellNum]
										var _Xch = cellBound.width;
										var newtextArrayLength = textG.selectAll('text').length;
										var _Xth = _width / newtextArrayLength;
										var fnTableCellXResize = new fnTableCellResize();
										fnTableCellXResize.setXResize(_tableObj, cellNum, _Xcell, _width, _height, _Xch, _Xth, true, currentShape, 1, 1, 'merge');
										fnTableCellXResize.updateXResize();
										//setIEStrokeWidth(KTCE.currentPaper.currentShape);
										var ft = KTCE.currentPaper.currentShape.freeTransform;
										fnUpdateTextPositionInTable( ft, false);
									}
									
									if(yHeight > cellBoundHeight){
										//아래 함수/싱글톤을 prototype 으로 변경
										var _Ycell =  _tableObj.cellHoverArray[cellNum]
										var _Ych = cellBound.height;
										var newtextArrayLength = textG.selectAll('text').length;
										var _Yth = _height / newtextArrayLength;
										var fnTableCellYResize = new fnTableCellResize();
										fnTableCellYResize.setYResize(_tableObj, cellNum, _Ycell, _width, _height, _Ych, _Yth, true, currentShape, 1, 1, true);
										fnTableCellYResize.updateYResize();
										
										//표 테두리 안정화
										setIEStrokeWidth(KTCE.currentPaper.currentShape);
										
										var ft = KTCE.currentPaper.currentShape.freeTransform;
										fnUpdateTextPositionInTable( ft, false);
										
									}else{
										fnCellTextVerticalAlign('newLine');
										if($(_tableObj).attr('id') != undefined) {
											//표 위치이동시 셀병합 셀 정렬유지
											fnCellArrayUpdate(_tableObj);
										}
									}
									
								}
							}
							
							break;
					}
				}
				if(_eventType === "click"){ fnSaveState();}	
			}
		}
		
		
		/****************************************************************
		* 공통함수: 채우기색, 선색, 선두깨
		****************************************************************/
		// 도형 배경색 기능
		function fnFillBinding(_target) {
			_target.each(function(){
				var _this = $(this)
				_this.on({
					click : function() {	
						setTable(_this, "click", "bgColor");
					},
					mouseover : function() {
						setTable(_this, "mouseover", "bgColor");
						//setColor(_this, "mouseover");
					},
					mouseenter : function() {
						//console.log("mouseenter")
						//setColor(_this, "mouseenter");
					},
					mouseleave : function() {
						//setColor(_this, "mouseleave", "bgColor");
						setTable(_this, "mouseleave", "bgColor");
						//console.log("mouseleave", "bgColor");
					}
				});
				
			})

		}

		// 도형 스트로크 색상 기능
		function fnStrokeBinding(_target) {
			_target.each(function(){
				var _this = $(this)

				_this.on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							setTable(_this, "click", 'strokeColor');
						}
						
					}
				});
			});
		}

		// 도형 스트로크 넓이 기능
		function fnLineStrokeWidthBinding(_target){
			//var _storkWidth = trigger.tableCellStrokeWidth;
			_target.each(function() {
				var _this = $(this)
					, thisWidth = parseInt(_this.text(), 10)

				_this.on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {

							_target.removeClass('active');
							_this.addClass('active');
							setTable(_this, "click", 'tablelineStrokeWidth');
						}
					}
				});
			});
		}
		
		// 도형 테두리 보기/숨기기
		function fnLineStrokeDisplayBinding(_target){
			
			//var _storkWidth = trigger.tableCellStrokeWidth;
			_target.each(function(_idx) {
				var _this = $(this)
					//, thisWidth = parseInt(_this.text(), 10)
				_this.index = _idx;
				
				_this.on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							//_target.removeClass('active');
							//_this.addClass('active');
							tableLineStrokeFirstDisplayFlag = true;
							setTable(_this, "click", 'tablelineStrokeDisplay');
						}
					}
				});
			});
		}
		
		// 셀병합
		var mFlag = false;
		function fnTableCellMergeBinding(_target){
			var _this = $(this)
			_target.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						mergeColorFlag = true;
						var mergedTargetCelled = $(KTCE.currentPaper.currentShape.node).find('rect.xCellHover[data-active="active"]')
						if(mergedTargetCelled.length > 1){
							if(chkAbleMerge(mergedTargetCelled)){
								setTable(_this, "click", 'tableCellMerge');
							}		
						//테이블 전체 선택
						}else if(mergedTargetCelled.length <=0 ){
							setTable(_this, "click", 'tableCellMerge');								
						}
					}
				}
			});
		}


		function chkAbleMerge(mArray){
			var mergedTemp = [];
			var maxX = -9999;
			var minX = 10000;
			var maxY = -9999;
			var minY = 10000;
			for(var i=0; i<mArray.length; i++){
				var idxX = parseInt($(mArray[i]).attr("data-index-x"));
				var idxY = parseInt($(mArray[i]).attr("data-index-y"));
				if(maxX < idxX) maxX = idxX;
				if(maxY < idxY) maxY = idxY;
				if(minX > idxX) minX = idxX;
				if(minY > idxY) minY = idxY;
			}

			if(mArray.length == (maxX - minX + 1) * (maxY - minY + 1)){
				return true;
			} else {
				return false;
			}
		}
		// 셀분할
		function fnTableCellSeparateBinding(_target){
			var _this = $(this)
			_target.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						console.log('셀분할')
						//tableLineStrokeFirstDisplayFlag = true;
						setTable(_this, "click", 'tableCellSeparate');
					}
				}
			});
		}
		
		// 색상 선택기 기능
		function fnSetIndicator() {
			if ( KTCE.currentPaper.currentShape != null ) {
				fillColorIndicator.css('backgroundColor', getSVGfillColor(KTCE.currentPaper.currentShape));
				strokeColorIndicator.css('backgroundColor', getSVGstrokeColor(KTCE.currentPaper.currentShape));
			} else {				
				//indicator.css('backgroundColor', 'transparent');
				indicator.css('backgroundColor', 'none');				
			}
		}

		// 객체의 배경색 반환
		function getSVGfillColor(obj) {			
			var _fill = (obj.attr('fill')=='transparent') ? 'none' : obj.attr('fill');
			return _fill;			
			//원본
			//return obj.attr('fill');
		}

		// 객체의 스트로크 색상 반환
		function getSVGstrokeColor(obj) {			
			var _stroke = (obj.attr('stroke')=='transparent') ? 'none' : obj.attr('stroke');
			return _stroke;			
			//return obj.attr('stroke')
		}

		// 트리거의 색상을 배경색으로 설정
		function fillBGColor(trigger, obj) {			
			var thisColor = (getColorHex(trigger) =='transparent') ? 'none' : getColorHex(trigger);			
			obj.attr({
				fill : thisColor
			});
		}

		// 트리거의 색상을 폰트색상으로 설정
		function fillFontColor(trigger, obj) {
			//var thisColor = getColorHex(trigger);			
			var thisColor = (getColorHex(trigger) =='transparent') ? 'none' : getColorHex(trigger);
			obj.css({
				color : thisColor
			});
		}

		// 트리거의 색상을 스트로크 색상으로 설정
		function fillStrokeColor(trigger, obj) {				
			var thisColor = (getColorHex(trigger) =='transparent') ? 'none' : getColorHex(trigger);
			obj.attr({
				stroke : thisColor
			});
		}


		/**
		 * 도형 그림자 효과 
		 */
		function fnShapeShadow2(obj, shadowWidth) {

			var thisWidth = shadowWidth;//parseFloat(document.getElementById(_currentFilterId).childNodes[0].getAttribute('stdDeviation'));	 
		
			var paper = Snap(KTCE.currentPaper.s.node);
			var filter = paper.filter(Snap.filter.shadow(0, 0, thisWidth, 'rgb(51,51,51)'), 1);

			$(".paperFrame defs>#" + obj.attr('data-filter-id')).remove();
		
			obj.attr({
				filter : filter,						
				//'data-filter-id' : filter.attr('id')						
				'data-filter-id' : filter.node.id
			});	
			
		}
		
		/**
		 * 도형 가장자리 효과
		 */
		function fnShapeBlur2(obj, shadowWidth){
		
			var paper = Snap(KTCE.currentPaper.s.node);
			var filter = paper.filter(Snap.filter.blur(shadowWidth));
			
			$(".paperFrame defs>#" + obj.attr('data-filter-id')).remove();
			
			obj.attr({
				filter : filter,							
				'data-filter-id' : filter.attr('id')								
			});
		
		}		
		
		/**
		 * 도형 그라데이션 효과
		 */

 		function fnShapeGradient(obj) {
		}

		// path의 코드를 문자열로 반환
		function getBoxPathCode(obj) {
			return obj.getBBox().path.toString();
		}

		// jquery 오브젝트의 color hex 값을 반환
		function getColorHex(obj) {
			return obj.css('backgroundColor');
		}

		// 커스텀 스타일 세팅
		function fnCustomStyleSet() {

			trigger.shapeStyle.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {

						var className = KTCE.currentPaper.currentShape.attr('class')
						
						// 텍스트인지 판단
						if ( className.indexOf('textBoxWrap') > -1 ) {
							if ( layer.textStyle.is(':hidden') ) {
								layer.textStyle.stop(true, true).slideDown(250);
							} else {
								layer.textStyle.stop(true, true).slideUp(250);
							}

						// 테이블
						} else if ( className.indexOf('xTable') > -1 ) {
							if ( layer.tableStyle.is(':hidden') ) {
								layer.tableStyle.stop(true, true).slideDown(250);
							} else {
								layer.tableStyle.stop(true, true).slideUp(250);
							}

						// 이미지
						} else if ( KTCE.currentPaper.currentShape.node.nodeName == 'image' ) {


						} else {							
							if ( layer.shapeStyle.is(':hidden') ) {
								layer.shapeStyle.stop(true, true).slideDown(250);
								if ( layer.shapeStyle.find('.scroller').length ) {
									layer.shapeStyle.find('.scroller').mCustomScrollbar({
										theme : 'dark'
										, scrollInertia : 300
									});
								}
							} else {
								layer.shapeStyle.stop(true, true).slideUp(250);
							}
						}
					}
				}
			});

			// 텍스트 스타일 call
			$.ajax({
				url:'/Fwl/FlyerApi.do',
				type:'post',
				data: {
					pageFlag : 'AF_STYLE_LIST'
					, styleDstinCd : '01'
				},
				success:function(data){
					if(data.result === "success") {
						var html = '';
						var count = 0;
						$.each(data.styleList, function(i, val) {
							var code = createTextSVG(val.content);
							$('<button type="button">' + code + '</button>').appendTo(layer.textStyle.find('.innerWrap'));
	
							var textFilterCode = decodeURIComponent(val.content);
							var textFilterArrCode = textFilterCode.split('**');
	
							if(browserType.indexOf('msie') > -1){	//IE
								if(textFilterArrCode[2] != 'undefined'){
									var _svgId = $(code).attr('id');
									var _text = $(code).find('text');
	
									var paper = Snap("#" + _svgId);
	
									//var _filter = paper.filter(Snap.filter.shadow(2,2,2));
									var _filter = paper.filter(Snap.filter.shadow(2, 2, 2, 'rgb(51,51,51)'), 1);
									var _textId = document.getElementById($(code).find('text').attr('id'));
	
									Snap(_textId).attr('filter', _filter);
	
									$("#" + _svgId).find('defs').append(textFilterArrCode[2])
	
								}
	
							}
	
							count++;
						});
	
						if(count ==0){
							layer.textStyle.find('.innerWrap').html('<p>등록된 스타일 정보가 없습니다.</p>');
						}
						_textStyleBtnBind();
					}	
				},
				error:function(){
					layer.textStyle.find('.innerWrap').html('<p>텍스트 스타일 정보 조회중<br/>서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.</p>');
				}
			});

			// 도형 스타일 call
			$.ajax({
				url:'/Fwl/FlyerApi.do',
				type:'post',
				data: {
					pageFlag : 'AF_STYLE_LIST'
					, styleDstinCd : '02'
				},
				success:function(data){
					if(data.result === "success") {
						var html = '';
						var count = 0;
						
						$.each(data.styleList, function(i, val) {
							var code = createShapeSVG(val.content);
							$('<button type="button">' + code + '</button>').appendTo(layer.shapeStyle.find('.innerWrap'));
							count++;
						});

						if(count ==0){
							layer.shapeStyle.find('.innerWrap').html('<p>등록된 스타일 정보가 없습니다.</p>');
						}
						_shapeStyleBtnBind();
					}
				},
				error:function(){
					layer.textStyle.find('.innerWrap').html('<p>도형 스타일 정보 조회중 <br/>서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.</p>');
				}
			});

			// 테이블 스타일 call
			$.ajax({
				url:'/Fwl/FlyerApi.do',
				type:'post',
				data: {
					pageFlag : 'AF_STYLE_LIST'
					, styleDstinCd : '03'
				},
				success:function(data){
					if(data.result === "success") {
						var html = '';
						var count = 0;
	
						$.each(data.styleList, function(i, val) {
							var code = createTextSVG(val.content)
	
							$('<button type="button">' + code + '</button>').appendTo(layer.tableStyle.find('.innerWrap'));
							count++;
						});
	
						if(count == 0){
							layer.tableStyle.find('.innerWrap').html('<p>등록된 스타일 정보가 없습니다.</p>')
						}
						_tableStyleBtnBind();
					}
				},
				error:function(){
					layer.textStyle.find('.innerWrap').html('<p>테이블 스타일 정보 조회중 <br/>서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.</p>');
				}
			});

			function _textStyleBtnBind() {
				layer.textStyle.find('button').each(function() {
					var thisStyle = $(this).find('text').attr('style');
					var _textShadowStyle = $(this).find('text').css('text-shadow');
					var _textUnderlineStyle = $(this).find('text').css('text-decoration');
					var _textBoldStyle = $(this).find('text').css('font-weight');
					var _textItalic = $(this).find('text').css('font-style');
					var _textFill = $(this).find('text').css('fill');
					
					$(this).on({
						click : function() {
							if(_textBoldStyle != 'none') {
								$(KTCE.currentPaper.currentShape.node).css('font-weight', _textBoldStyle);
							}
							
							if(_textItalic != 'none') {
								$(KTCE.currentPaper.currentShape.node).css('font-style', _textItalic);
							}
							
							if(_textFill != 'none') {
								$(KTCE.currentPaper.currentShape.node).css('fill', _textFill);
							}

							if(browserType.indexOf('msie') > -1){	//IE
								if(_textShadowStyle != 'none') {
									fnTextShadow($(KTCE.currentPaper.s.node), KTCE.currentPaper.currentShape, true);
								}else{
									try{
										$(KTCE.currentPaper.currentShape.node).removeAttr('filter');
										$(KTCE.currentPaper.currentShape.node).removeAttr('data-filter-id');
									}catch(err){console.log(err)}
								}
								if(_textUnderlineStyle != 'none') {
									fnTextUnderline(KTCE.currentPaper.currentShape, true);
								}else{									
									fnTextUnderline(KTCE.currentPaper.currentShape, false);
									try{
										$(KTCE.currentPaper.currentShape.node.id).find('.textUnderLine').remove();
										$("#" + KTCE.currentPaper.currentShape.node.id +">g:eq(3)").remove();
										$(KTCE.currentPaper.currentShape.node).removeAttr('data-text-underline');
									}catch(err){console.log(err)}
								}
							}else{
								if($(KTCE.currentPaper.currentShape.node).css('text-decoration') != 'none') {
									fnTextUnderline(KTCE.currentPaper.currentShape, true);
								}else{
									fnTextUnderline(KTCE.currentPaper.currentShape, false);
									try{
										$("#" + KTCE.currentPaper.currentShape.node.id +">g:eq(3)").remove();
									}catch(err){console.log(err)}
									
								}
							}
						}
					});

				});
			}			

			function _shapeStyleBtnBind() {

				layer.shapeStyle.find('button').each(function() {
					var thisStyle = $(this).find('rect').attr('style');
					var thisStroke = $(this).find('rect').attr('stroke');
					var thisFill = $(this).find('rect').attr('fill');
					var thisStrokeWidth = $(this).find('rect').attr('stroke-width');
					var thisFilter = $(this).find('rect').attr('filter');
					var thisDefs = $(this).find('defs');

					$(this).on({
						click : function() {
							//style 생성
							$(KTCE.currentPaper.currentShape.node).attr('style', thisStyle);
							$(KTCE.currentPaper.currentShape.node).attr('stroke', thisStroke);
							$(KTCE.currentPaper.currentShape.node).attr('fill', thisFill);
							$(KTCE.currentPaper.currentShape.node).attr('stroke-width', thisStrokeWidth);
							
							//attribute 생성	
							KTCE.currentPaper.currentShape.attr('stroke', thisStroke);
							KTCE.currentPaper.currentShape.attr('fill', thisFill);
							KTCE.currentPaper.currentShape.attr('stroke-width', thisStrokeWidth);

							if(thisFilter != undefined) {
								var _filterId = $(this).find('filter').attr('id');

								//템플릿 관리자기능 관련 filter 예외
								if($("#" + _filterId).find('feGaussianBlur').length < 1) return;

								var shadowWidth = parseFloat(document.getElementById(_filterId).childNodes[0].getAttribute('stdDeviation'));
								if(document.getElementById(_filterId).childNodes.length > 1) {
									//box-shadow
									fnShapeShadow($(KTCE.currentPaper.s.node), Snap(KTCE.currentPaper.currentShape.node), shadowWidth);
								}else{
									//box-blur
									fnShapeBlur($(KTCE.currentPaper.s.node), Snap(KTCE.currentPaper.currentShape.node), shadowWidth);	
								}	
							}else{
								$(KTCE.currentPaper.currentShape.node).removeAttr("filter");	
								$(KTCE.currentPaper.currentShape.node).removeAttr("data-filter-id");
							}

							if(thisFill != undefined && thisFill.indexOf("url") > -1){
								thisFill = thisFill.replaceAll('"', '');
								var fillId = thisFill.substring(thisFill.indexOf('#'), thisFill.lastIndexOf(')'));
								var _newFillGradient = $(thisDefs).find(fillId).clone();
								var _len2 = $(KTCE.currentPaper.s.node).find("defs>*").length;
								var _newFillId = _newFillGradient.attr("id") + _len2;
									_newFillGradient.attr("id", _newFillId);

									//그라데이션fill 효과 복사/붙이기 후 다른 스타일 효과 적용시 기존 효과 삭제방지
									var _cFillId = $(KTCE.currentPaper.currentShape.node).attr("data-fill-id");
									if(_cFillId != undefined) {
										var _chkCount = 0;
										$("#" + KTCE.currentPaper.s.node.id + " .objectGroup>*").each(function(idx, el){
											if($(el).attr('data-fill-id') === _cFillId) {
												_chkCount++;
											}
											if(_chkCount > 1) {return false;}
										})
										if(_chkCount<=1){
											$("defs>#" + $(KTCE.currentPaper.currentShape.node).attr("data-fill-id")).remove();
										}
									}

								$(KTCE.currentPaper.s.node).find("defs").append(_newFillGradient);								
								$(KTCE.currentPaper.currentShape.node).attr('fill', thisFill);
								$(KTCE.currentPaper.currentShape.node).attr("fill", "url(#" + _newFillId + ")");
								$(KTCE.currentPaper.currentShape.node).attr("data-fill-id", _newFillId);
								
							} else if(thisFill == undefined) {	//배경 미지정시 
								$(KTCE.currentPaper.currentShape.node).removeAttr("fill");
								$(KTCE.currentPaper.currentShape.node).removeAttr("data-fill-id");
								$("defs>#" + $(KTCE.currentPaper.currentShape.node).attr("data-fill-id")).remove();
							}else if(thisFill.indexOf('url') == -1) {	//단색배경시 그라데이션 삭제
								$(KTCE.currentPaper.currentShape.node).removeAttr("data-fill-id");
								$("defs>#" + $(KTCE.currentPaper.currentShape.node).attr("data-fill-id")).remove();
							}else{
								
							}
							fnSaveState();
						}
					});
				});
			}
			

			function _tableStyleBtnBind() {
			}

			/**
			 * 텍스트 스타일 생성
			 */
			var textSVGIDX = 0;
			function createTextSVG(code) {
				code = decodeURIComponent(code);
				var arrCode = code.split('**');
				var _textId = "thumText" + textSVGIDX;
				var _svgId = 'thumTextSVG' + textSVGIDX;
				var svg = '<svg id="' + _svgId + '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="400" viewbox="0 0 400 400" viewBox="0 0 400 400"><rect x="30" y="30" width="340" height="340" style="' + arrCode[0] + '"/><desc></desc><defs></defs><text id="' + _textId + '" x="105" y="210" style="' + arrCode[1] + '">가나다</text></svg>';
	
				textSVGIDX++;

				return svg;
			}

			/**
			 * 도형 스타일 생성
			 */
			function createShapeSVG(code) {
				var arrCode = code.split('**');
				var attr = "style='" + arrCode[0] + "' ";
				if(arrCode[2] != undefined){
					attr = attr + "fill='" + arrCode[2]  + "'";
				}
				
				if(arrCode[1] != undefined){
					attr = attr + "stroke='" + arrCode[1]  + "'";
				}
				if(arrCode[3] != undefined){
					attr = attr + "stroke-width='" + arrCode[3]  + "'";
				}

				if(arrCode[7] != ''){
					
					if(arrCode[7].indexOf('null') > -1){
						
					}else{
						attr = attr + 'filter="' + arrCode[7] + '"';
					}
				}

				var svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewbox="0 0 400 400" viewBox="0 0 400 400">'
							+ '<defs>'
							+ arrCode[4]	//radialGradient
							+ arrCode[5]	//filter
							+ '</defs>'
							+ '<rect x="30" y="30" width="340" height="340" ' + attr + ' />';
							+ '</svg>';
				var snapSvg = Snap.parse(svg);
				
				var _outerHTML = outerHTMLCheck(snapSvg.node);
				
				return _outerHTML;
			
			}

		}

		/******************************************************************************/
		/* Section: freeTransform 기능
		/******************************************************************************/

		// 해당 오브젝트의 정보를 담을 data object를 생성	
		function fnCreateDataObject(obj, fHandler, trans, tableId) {
		
			var _id = obj.id;
			if(tableId === null || tableId === undefined || tableId === '') {
				_id = obj.id;
			}else{
				_id = obj.node.id;
			}

			obj.attr('id', _id);
			obj.addClass('hasData');

			var g = KTCE.currentPaper.dataWrap.g().attr({ class : _id });

			if(trans == undefined){
				g.text(-100000,-100000,'0').attr({ class : 'translateX' });
				g.text(-100000,-100000,'0').attr({ class : 'translateY' });
				g.text(-100000,-100000,'1').attr({ class : 'scaleX' });
				g.text(-100000,-100000,'1').attr({ class : 'scaleY' });
				g.text(-100000,-100000,'0').attr({ class : 'rotate' });
			} else {
				g.text(-100000,-100000,trans.translate.x.toString()).attr({ class : 'translateX' });
				g.text(-100000,-100000,trans.translate.y.toString()).attr({ class : 'translateY' });
				g.text(-100000,-100000,trans.scale.x.toString()).attr({ class : 'scaleX' });
				g.text(-100000,-100000,trans.scale.y.toString()).attr({ class : 'scaleY' });
				g.text(-100000,-100000,trans.rotate.toString()).attr({ class : 'rotate' });

				var info = fnGetDataObject(obj);
					fHandler.attrs.translate.x = info.translate.x;
					fHandler.attrs.translate.y = info.translate.y;
					fHandler.attrs.scale.x = info.scale.x;
					fHandler.attrs.scale.y = info.scale.y;
					fHandler.attrs.rotate = info.rotate;
					fHandler.updateHandles();

			}
			g.children().forEach(function(el, i) {
				el.attr({
					display : 'none'
				});
			});

		}

		// dataObject를 업데이트
		function fnUpdateDataObject(obj, info) {

			var dataObj = KTCE.currentPaper.dataWrap.select('.'+obj.attr('id'))
			if(dataObj == null){
				for(var i=0; i<KTCE.paperArray.length; i++){
					dataObj = KTCE.paperArray[i].dataWrap.select('.'+obj.attr('id'));
					if(dataObj != null) break;
				}
			}
			if(dataObj != null){
				dataObj.select('.translateX').attr('text', info.translate.x);
				dataObj.select('.translateY').attr('text', info.translate.y);
				dataObj.select('.scaleX').attr('text', info.scale.x);
				dataObj.select('.scaleY').attr('text', info.scale.y);
				dataObj.select('.rotate').attr('text', info.rotate);
			}

		}

		// 오브젝트의 data를 반환한다
		function fnGetDataObject(obj, paper) {
			
			var dataObj = undefined;
			if(paper == undefined){
				for(var i=0; i < KTCE.paperArray.length; i++){
					dataObj = KTCE.paperArray[i].dataWrap.select('.'+obj.attr('id'));
					
					if(dataObj != null) break;
				}
				
			} else {
				dataObj = paper.dataWrap.select('.'+obj.attr('id'))
			}
			
			if(dataObj!=null) {
				return {
					translate : {
						x : parseFloat(dataObj.select('.translateX').attr('text'))
						, y : parseFloat(dataObj.select('.translateY').attr('text'))
					}
					, scale : {
						x : parseFloat(dataObj.select('.scaleX').attr('text'))
						, y : parseFloat(dataObj.select('.scaleY').attr('text'))
					}
					, rotate : parseFloat(dataObj.select('.rotate').attr('text'))
				}
			}else{
				return false;
			}

		}

		function fnSetLoadFreeTransform(paper, obj){
			if(obj.hasClass('hasDataGroup')){	// 그룹객체
				var fHandler = Snap.freeTransform(obj, {
					draw: ['bbox','bboxCorners','bboxSides']
					, keepRatio: ['bbox', 'bboxCorners', 'bboxSides']
					, scale: ['bboxCorners', 'bboxSides']
					, rotate: ['axisY']
					, drag : ['self']
					, distance: '1.4'
					, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height : KTCE.currentPaper.height
					}
					, objectId : obj.id
				});
				
				fHandler.opts.attrs = {
					fill: '#ccc',
					stroke: '#e71828',
					'cursor':'move',
					opacity: 0.8
				}
				fHandler.opts.bboxAttrs = {
					fill: '#008983',
					stroke: '#e71828',
					cursor: 'move',
					//'cursor':'no-drop',
					'stroke-width': '3',
					'stroke-dasharray': '3, 3',
					opacity: 0.2
				}
				
				fHandler.showHandles();
				fHandler.visibleHandles();
				fHandler.updateHandles();
				
				//그룹핑객체 선택후 Path활성화(visible)에 따른 그룹핑객체 선택불가로 인한 이벤트 처리불가에 따른 Path 이벤트 처리
				var _el = Snap($(obj.freeTransform.bbox.node)[0]);
				_el.attr({'data-name': 'objectGroupPath', 'data-id': obj.attr('id')})
				_el.unmousedown(addMouseDownEvent);
				_el.mousedown(addMouseDownEvent);
				_el.unmouseup(addMouseUpEvent);
				_el.mouseup(addMouseUpEvent);
				
				$(obj.freeTransform.bbox.node).off().on({
					mousedown:function(e){
						e.stopPropagation();
		                e.preventDefault();
					}
				});
				
			}else if(obj.hasClass('textBoxWrap')){
				var fHandler = Snap.freeTransform(obj, {
					draw: ['bbox']
					, rotate: ['axisY']
					, drag : ['self']
					, scale: ['bboxCorners', 'bboxSides']
					, distance: '1.3'
					, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height : KTCE.currentPaper.height
					}
					, objectId : obj.id
					, textBoxFlag : true
				});
			} else {
				var fHandler = Snap.freeTransform(obj, {
					draw: ['bbox','bboxCorners','bboxSides']
					, rotate: ['axisY']
					, drag : ['self']
					, scale: ['bboxCorners', 'bboxSides']
					, distance: '1.4'
					, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height : KTCE.currentPaper.height
					}
					, objectId : obj.id
				});
			}
			
			// 기존 이미지 오브젝트 정보가 있는지 판단
			if($(obj.node).attr('data-name') == 'xImage'){
				$(obj).attr('data-name', 'xImage').each(function(idx, el) {
					addImageFunc.createButton(obj);
				});
			}
			
			var info = fnGetDataObject(obj, paper);
				fHandler.attrs.translate.x = info.translate.x;
				fHandler.attrs.translate.y = info.translate.y;
				fHandler.attrs.scale.x = info.scale.x;
				fHandler.attrs.scale.y = info.scale.y;
				fHandler.attrs.rotate = info.rotate;
				fHandler.updateHandles();
			
				try{
					if($(obj.node).attr('data-lock') === 'lock') {
						fHandler.opts.attrs.stroke = 'red';
						fHandler.opts.attrs.cursor = 'no-drop';
						fHandler.opts.bboxAttrs.stroke = 'red';
						fHandler.opts.bboxAttrs.cursor = 'no-drop';
						fHandler.opts.bboxAttrs.strokeDasharray = '3, 3';
						//obj.freeTransform.opts.bboxAttrs.opacity = 0.8;
						fHandler.showHandles();
						fHandler.visibleHandles();
						fHandler.updateHandles();
						$(obj.node).css('cursor','no-drop');
						fHandler.opts.attrs.cursor = 'no-drop'; 
						
						if(obj.attr('data-name') === 'objectGroup') {
							//obj.data('hasHandle', true);
							//그룹핑객체 선택후 Path활성화(visible)에 따른 그룹핑객체 선택불가로 인한 이벤트 처리불가에 따른 Path 이벤트 처리
							var _el = Snap($(obj.freeTransform.bbox.node)[0]);
							_el.attr({'data-name': 'objectGroupPath', 'data-id': obj.attr('id')})
							_el.unmousedown(addMouseDownEvent);
							_el.mousedown(addMouseDownEvent);
							_el.unmouseup(addMouseUpEvent);
							_el.mouseup(addMouseUpEvent);
						}
						
						if(KTCE.currentPaper.lockObjWrap != undefined) {
							var lockObject = KTCE.currentPaper.lockObjWrap.select('.' + obj.node.id);
							$(lockObject.node).on({
								mousedown: function(e){
									hideAllHandler();
									obj.data('hasHandle', true);
									obj.freeTransform.visibleHandles();
									//obj.freeTransform.updateHandles();
									KTCE.currentPaper.currentShape = obj;
									KTCE.currentPaper.selectedShapeArray[0] = obj;
								},
								mouseup: function(e) {
									obj.data('hasHandle', true);
									obj.freeTransform.visibleHandles();
									obj.freeTransform.updateHandles();
									KTCE.currentPaper.currentShape = obj;
									KTCE.currentPaper.selectedShapeArray[0] = obj;
								}
							});
							
						}
					}
				}catch(e){}

			paper.shapeArray.push(fHandler);

			fHandler.visibleNoneHandles();

			// 핸들러 바인딩
			handlerBinding(paper);

			// 기존 객체에 freeTransfrom 정보 추가
			obj.freeTransform = fHandler;

			if(obj.hasClass('textBoxWrap')){
				obj.select(".text-cursor").children()[0].attr("visibility", "hidden");
				obj.click(function(e) {
					textBoxClick(obj);
				});
				obj.dblclick(function(e){
					textBoxDblClick(e)
				});
			}
		}

		// 오브젝트를 받아 freeTransform을 적용시킴
		function fnSetFreeTransform(obj, action, trans, paper) {
			if(obj.hasClass('hasDataGroup')){	// 그룹객체
				var fHandler = Snap.freeTransform(obj, {
					draw: ['bbox','bboxCorners','bboxSides']
					, keepRatio: ['bbox', 'bboxCorners', 'bboxSides']
					, scale: ['bboxCorners', 'bboxSides']
					, rotate: ['axisY']
					, drag : ['self']
					, distance: '1.4'
					, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height : KTCE.currentPaper.height
					}
					, objectId : obj.id
				});
				
				fHandler.opts.attrs = {
					fill: '#ccc',
					stroke: '#e71828',
					'cursor':'move',
					opacity: 0.8
				}
				fHandler.opts.bboxAttrs = {
					fill: '#008983',
					stroke: '#e71828',
					cursor: 'move',
					//'cursor':'no-drop',
					'stroke-width': '3',
					'stroke-dasharray': '3, 3',
					opacity: 0.2
				}
				
				fHandler.showHandles();
				fHandler.visibleHandles();
				fHandler.updateHandles();
				
				//그룹핑객체 선택후 Path활성화(visible)에 따른 그룹핑객체 선택불가로 인한 이벤트 처리불가에 따른 Path 이벤트 처리
				var _el = Snap($(obj.freeTransform.bbox.node)[0]);
				_el.attr({'data-name': 'objectGroupPath', 'data-id': obj.attr('id')})
				_el.unmousedown(addMouseDownEvent);
				_el.mousedown(addMouseDownEvent);
				_el.unmouseup(addMouseUpEvent);
				_el.mouseup(addMouseUpEvent);
				
				$(obj.freeTransform.bbox.node).off().on({
					mousedown:function(e){
						e.stopPropagation();
		                e.preventDefault();
					}
				});
				
			}else if(obj.hasClass('textBoxWrap')){
				var fHandler = Snap.freeTransform(obj, {
					draw: ['bbox']
					, rotate: ['axisY']
					, drag : ['self']
					, scale: ['bboxCorners', 'bboxSides']
					, distance: '1.3'
					, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height : KTCE.currentPaper.height
					}
					, objectId : obj.id
					, textBoxFlag : true
				});
			} else {	
				var dragValue;
				if(obj.hasClass('xTable hasData')){	
					dragValue = 'center';
					var thisTable = {}
					, _firstX = 200
					, _firstY = 300
					, _tableG = obj
					, cellWidth = 70
					, cellHeight = 50
					//, cellArray = []
					//, xLineArray = []
					//, yLineArray = []
					, strokeWidth = 2
					
					var _x = parseInt($(obj.node).find('.xCell:last').attr('class').substring(7,8));
					var _y =  parseInt($(obj.node).find('.xCell:last').attr('class').substring(10,11));
					
					thisTable.length = {
						x : _x
						, y : _y
					}
					
					thisTable.cellArray = [];
					thisTable.xLineArray = [];
					thisTable.yLineArray = [];
					thisTable.cellHoverArray = [];
					thisTable.cellTextArray = [];
					thisTable.cellWidth = cellWidth;
					thisTable.cellHeight = cellHeight;
					thisTable.strokeWidth = strokeWidth;
					
					// 배경용 셀 생성
					for ( var i=0; i<_y; i++ ) {
						for( var j=0; j<_x; j++ ) {
							var cell = _tableG.rect((j*cellWidth)+_firstX, (i*cellHeight)+_firstY, cellWidth, cellHeight).attr({
								stroke : 'none'
								, strokeWidth : 0
								, fill : 'none'
								, 'vector-effect' : 'non-scaling-stroke'
								, class : 'xCell x'+j + '_y'+i
							});
							cell.data('x',j);
							cell.data('y',i);
							thisTable.cellArray.push(cell);
						}
					}
					
					// 선택용 셀 생성
					for ( var i=0; i<_y; i++ ) {
						thisTable.cellTextArray[ i ] = [];

						for( var j=0; j<_x; j++ ) {
							var cell = _tableG.rect((j*cellWidth)+_firstX+strokeWidth, (i*cellHeight)+_firstY+strokeWidth, cellWidth-(strokeWidth*2), cellHeight-(strokeWidth*2)).attr({
								stroke : 'none'
								, strokeWidth : 0
								, fill : '#fff'
								, opacity : 0
								, 'vector-effect' : 'non-scaling-stroke'
								, class : 'xCellHover x'+j + '_y'+i
							});
							cell.data('x',j);
							cell.data('y',i);
							$( cell.node ).data( 'indexX', j );
							$( cell.node ).data( 'indexY', i );
							cell.data( 'self', cell );
							thisTable.cellHoverArray.push(cell);
							
							cell.dblclick( function( $event ) {
								var cell = $( $event.target );
								if($(cell).attr("data-merge")!= undefined){
									var triggerTarget = $(cell).attr("data-merge").split(",")[0];
									cell = $ (thisTable.cellHoverArray[triggerTarget].node);
								}
								
								var indexX = cell.data( 'indexX' );
								var indexY = cell.data( 'indexY' );
								var positionX = cell.attr( 'x' );
								var positionY = cell.attr( 'y' );
								
								if( thisTable.cellTextArray[ indexY ][ indexX ] === undefined ) {
									fnCreateTextinTable(cell, _tableG, thisTable);
								}
								else {
									fnCellTextInputMode(_tableG, indexX, indexY)
								}
							} );
						}
					}
					
					// 가로 선 생성
					for ( var ii=0; ii<_y+1; ii++) {
						for( var jj=0; jj<_x; jj++ ) {
							var xLine = _tableG.line((jj*cellWidth)+_firstX, (ii*cellHeight)+_firstY, (jj*cellWidth)+_firstX+cellWidth, (ii*cellHeight)+_firstY).attr({
								stroke : '#666'
								, strokeWidth : strokeWidth
								, fill : 'none'
								, 'vector-effect' : 'non-scaling-stroke'
								, class : 'xLine x'+jj + '_y'+ii
							});
							xLine.data('x',jj);
							xLine.data('y',ii);
							thisTable.xLineArray.push(xLine);
						}
					}
					
					// 세로 선 생성
					for ( var kk=0; kk<_y; kk++) {
						for( var mm=0; mm<_x+1; mm++ ) {
							var yLine = _tableG.line((mm*cellWidth)+_firstX, (kk*cellHeight)+_firstY, (mm*cellWidth)+_firstX, (kk*cellHeight)+_firstY+cellHeight).attr({
								stroke : '#666'
								, strokeWidth : strokeWidth
								, fill : 'none'
								, 'vector-effect' : 'non-scaling-stroke'
								, class : 'yLine x'+mm + '_y'+kk
							});
							yLine.data('x',mm);
							yLine.data('y',kk);
							thisTable.yLineArray.push(yLine);
						}
					}
					
					var _tableG = KTCE.currentPaper.objOuter;
					var t = KTCE.currentPaper.tableArray[0];
					fnSetFreeTransformTable(obj);
					
				}else{
					dragValue = 'self';
				}
				
				if(obj.type == "line"){
					var fHandler = Snap.freeTransform(obj, {
						draw: ['bbox','bboxSides']
						, rotate: ['axisX']
						, drag : ['self', 'center']
						, scale: ['bboxSides']
						, distance: '1.4'
						, boundary : {
							x : 0
							, y : 0
							, width : KTCE.currentPaper.width
							, height : KTCE.currentPaper.height
						}
						, objectId : obj.id
					});
				} else {
					var _tempTimer = null;
					KTCE.currentPaper.shapeDragState = null;
					var fHandler = Snap.freeTransform(obj, {
						draw: ['bbox','bboxCorners','bboxSides']
						, rotate: ['axisY']				
						, drag : [dragValue]				
						, scale: ['bboxCorners', 'bboxSides']
						, distance: '1.4'
						, boundary : {
							x : 0
							, y : 0
							, width : KTCE.currentPaper.width
							, height : KTCE.currentPaper.height
						}
						, objectId : obj.id
					}, function(e){
						
						if(browserType.indexOf('msie') == -1){	//chrome
							//console.log('chrome: ', browserType);
						}else{	//ie msie11
						
							if (document.documentElement.style.vectorEffect === undefined || document.documentElement.style.vectorEffect != undefined) {
								
								$(obj.node).removeAttr('style');
								var strokeWidth = $(obj.node).attr('stroke-width');
								if(KTCE.currentPaper.shapeDragState == 'mousescaleup') {
									var matrix = obj.attr('transform').globalMatrix;
									//if(matrix.a != 1 || matrix.d !=1 || matrix.e > 0 || matrix.f > 0) {
									if(matrix.a != 1 || matrix.d !=1 ) {	//scale값 변경시만
										fnReCreateShape(obj, obj.freeTransform);
									}else{	//원본 크기일 경우
										//fnReCreateShape();
									}
								}
							} else {
								//console.log("vectorEffect Supported");
							}
						}
					});
					
				}
			
			}
			
			// 기존 이미지 오브젝트 정보가 있는지 판단
			if($(obj.node).attr('data-name') == 'xImage'){
				$(obj).attr('data-name', 'xImage').each(function(idx, el) {
					addImageFunc.createButton(obj);
					
				});
			}
			
			if ( obj.hasClass('hasData') ) {
				//none data object
				var dataObj = KTCE.currentPaper.dataWrap.select('.'+obj.attr('id'));
				if(dataObj == null){
					var g = KTCE.currentPaper.dataWrap.g().attr({ class : obj.id });
					if(trans != undefined){
						g.text(-100000,-100000,trans.translate.x.toString()).attr({ class : 'translateX' });
						g.text(-100000,-100000,trans.translate.y.toString()).attr({ class : 'translateY' });
						g.text(-100000,-100000,trans.scale.x.toString()).attr({ class : 'scaleX' });
						g.text(-100000,-100000,trans.scale.y.toString()).attr({ class : 'scaleY' });
						g.text(-100000,-100000,trans.rotate.toString()).attr({ class : 'rotate' });
					} else {
						g.text(-100000,-100000,'0').attr({ class : 'translateX' });
						g.text(-100000,-100000,'0').attr({ class : 'translateY' });
						g.text(-100000,-100000,'1').attr({ class : 'scaleX' });
						g.text(-100000,-100000,'1').attr({ class : 'scaleY' });
						g.text(-100000,-100000,'0').attr({ class : 'rotate' });
					}
					
					g.children().forEach(function(el, i) {
						el.attr({
							display : 'none'
						});
					});
				} 
				
				if(obj.hasClass('textBoxWrap')){
					var newBBox = obj.getBBox( true );
					
					fHandler.attrs.x = newBBox.x;
					fHandler.attrs.y = newBBox.y;
					fHandler.attrs.center.x = newBBox.cx;
					fHandler.attrs.center.y = newBBox.cy;
					fHandler.attrs.size = {
						x: newBBox.w,
						y: newBBox.h
					};
				}
				
				var info = fnGetDataObject(obj, paper);
				
				if(info!==false) {
					fHandler.attrs.translate.x = info.translate.x;
					fHandler.attrs.translate.y = info.translate.y;
					fHandler.attrs.scale.x = info.scale.x;
					fHandler.attrs.scale.y = info.scale.y;
					fHandler.attrs.rotate = info.rotate;
				}
				
				if(obj.hasClass('textBoxWrap')){
					fHandler.apply();
				} else {
					fHandler.updateHandles();
				}
				
			} else {
				// 정보 오브젝트 생성
				fnCreateDataObject(obj, fHandler, trans);
			}
			
			try{
				if($(obj.node).attr('data-lock') === 'lock') {
					fHandler.opts.attrs.stroke = 'red';
					fHandler.opts.attrs.cursor = 'no-drop';
					fHandler.opts.bboxAttrs.stroke = 'red';
					fHandler.opts.bboxAttrs.cursor = 'no-drop';
					fHandler.opts.bboxAttrs.strokeDasharray = '3, 3';
					//obj.freeTransform.opts.bboxAttrs.opacity = 0.8;
					fHandler.showHandles();
					fHandler.visibleHandles();
					fHandler.updateHandles();
					$(obj.node).css('cursor','no-drop');
					fHandler.opts.attrs.cursor = 'no-drop'; 
					
					if(KTCE.currentPaper.lockObjWrap != undefined) {
						var lockObject = KTCE.currentPaper.lockObjWrap.select('.' + obj.node.id);
						$(lockObject.node).on({
							mousedown: function(e){
								hideAllHandler();
								obj.data('hasHandle', true);
								obj.freeTransform.visibleHandles();
								//obj.freeTransform.updateHandles();
								KTCE.currentPaper.currentShape = obj;
								KTCE.currentPaper.selectedShapeArray[0] = obj;
							},
							mouseup: function(e) {
								obj.data('hasHandle', true);
								obj.freeTransform.visibleHandles();
								obj.freeTransform.updateHandles();
								KTCE.currentPaper.currentShape = obj;
								KTCE.currentPaper.selectedShapeArray[0] = obj;
							}
						});
						
					}
				}
			}catch(e){}
			
			KTCE.currentPaper.shapeArray.push(fHandler);
			
			fHandler.visibleNoneHandles();
			
			// 핸들러 바인딩
			handlerBinding();
	
			// 기존 객체에 freeTransfrom 정보 추가
			obj.freeTransform = fHandler;

			if(obj.hasClass('textBoxWrap')){
				obj.select(".text-cursor").children()[0].attr("visibility", "hidden");
				obj.click(function(e) {
					textBoxClick(obj);
				});
				obj.dblclick(function(e){
					textBoxDblClick(e)
				});
			}
			
			if(action == 'paste'){
				var x10 = parseFloat(obj.freeTransform.attrs.translate.x)+10; 
				var y10 = parseFloat(obj.freeTransform.attrs.translate.y)+10;
				obj.transform([
					'R' + obj.freeTransform.attrs.rotate
					, obj.freeTransform.attrs.center.x
					, obj.freeTransform.attrs.center.y
					, 'S' + obj.freeTransform.attrs.scale.x
					, obj.freeTransform.attrs.scale.y
					, obj.freeTransform.attrs.center.x
					, obj.freeTransform.attrs.center.y
					, 'T' + x10
					, y10
				].join(','));
				
				obj.freeTransform.attrs.translate.x	= x10;
				obj.freeTransform.attrs.translate.y	= y10;
				obj.freeTransform.updateHandles();
				
				// item.el : snap 객체
				// ft.attrs : transform 정보
				
				KTCE.updateData(obj, obj.freeTransform.attrs);
				
			}else if(action == 'reDraw'){
				if(KTCE.currentPaper.currentShape != null && KTCE.currentPaper.selectedShapeArray.length == 0) {
					KTCE.currentPaper.currentShape = obj;
					KTCE.currentPaper.selectedShapeArray[0] = obj;
				}
				obj.data('hasHandle', true);
				fHandler.visibleHandles();
				fHandler.updateHandles();
			}else if(action == 'ungroup'){
				obj.data('hasHandle', true);
				fHandler.visibleHandles();
				fHandler.updateHandles();
			}
		}
		
		//도형 라인 두께 유지 함수
		function fnReCreateShape(obj, fHandler, action) {
			try{
				var matrix = obj.attr('transform').globalMatrix;
				var g = document.getElementById(obj.node.id);
				var consolidate = g.transform.baseVal.consolidate();
				var rotateMatrix = consolidate.matrix;
				
				if( fHandler.bbox != null){
					var bbox = fHandler.bbox.node.getBBox();
					var handlerAttr = fHandler.attrs;
				}
				var tempInfo = {};
				
				//회전모드 임시 사용허용
				if(matrix.b !=0 ) return;
				
				var tempNode = document.getElementById(obj.node.id);
				if(tempNode==null) return;
				tempInfo.style = tempNode.getAttribute('style');
				tempInfo.stroke = tempNode.getAttribute('stroke');
				tempInfo.strokeWidth = parseFloat(tempNode.getAttribute('stroke-width'));
				tempInfo.fill = tempNode.getAttribute('fill');
				tempInfo.filter = tempNode.getAttribute('filter');
				tempInfo.filterId = tempNode.getAttribute('data-filter-id');
				tempInfo.fillId = tempNode.getAttribute('data-fill-id');
				tempInfo.opacity = tempNode.getAttribute('opacity');	//투명도 값
				
				//data-shape-inddex 이름 오타에 따른 ==> data-shape-index로 변경 로직
				if($(tempNode).attr('data-shape-inddex') != undefined) {
					$(tempNode).attr('data-shape-index', $(tempNode).attr('data-shape-inddex'));
					$(tempNode).removeAttr('data-shape-inddex');
				}
				tempInfo.shapeIndex =  parseFloat(tempNode.getAttribute('data-shape-index'));
				tempInfo.handler = fHandler;
				
				var tempType = obj.type;
				var tempCode;
				var tempNo = tempInfo.shapeIndex;
				var tempMiddle=null,
					tempY1=tempY2 =tempY3=tempY4=tempY5=tempY6=tempY7=tempY8 = null,
					tempX1=tempX2=tempX3=tempX4=tempX5=tempX6 = null;
				switch(obj.type) {
					case 'line' :
						break;
					case 'rect' :
						if(browserType.indexOf('msie') > -1){
							tempInfo.x = parseFloat(tempNode.getAttribute('x'));
							tempInfo.y = parseFloat(tempNode.getAttribute('y'));
							tempInfo.width = parseFloat(tempNode.getAttribute('width'));
							tempInfo.height = parseFloat(tempNode.getAttribute('height'));
							tempInfo.rotateX = matrix.b;
							tempInfo.rotateY = matrix.c;
							
							var _w = handlerAttr.size.x * handlerAttr.scale.x;
							var _h = handlerAttr.size.y * handlerAttr.scale.y;
							var _x = handlerAttr.x - (_w/2-handlerAttr.size.x/2);
							var _y = handlerAttr.y - (_h/2-handlerAttr.size.y/2);
							
							switch(tempNo) {
								case 3 :
									tempCode = bbox.x  + "," + bbox.y + "," + bbox.width + "," + bbox.height;
									break;
								case 4 :
									tempInfo.rx = parseFloat(tempNode.getAttribute('rx'));
									tempInfo.ry = parseFloat(tempNode.getAttribute('ry'));
									var r1 = Math.abs(tempInfo.rx * parseFloat(matrix.a));
									var r2 = Math.abs(tempInfo.ry * parseFloat(matrix.d));
									r1 = ( r1 > 30 ) ? 30 : r1;
									r2 = r1;
									tempCode = bbox.x  + "," + bbox.y + "," + bbox.width + "," + bbox.height + "," +  r1 + "," + r2;
									break;
								default :
							}
						}else{
							return;
						}
						break;
					case 'ellipse' :
						if(browserType.indexOf('msie') > -1){
							tempInfo.cx = parseFloat(tempNode.getAttribute('cx'));
							tempInfo.cy = parseFloat(tempNode.getAttribute('cy'));
							tempInfo.rx = parseFloat(tempNode.getAttribute('rx'));
							tempInfo.ry = parseFloat(tempNode.getAttribute('ry'));
							var rx = tempInfo.rx * parseFloat(matrix.a);
							var ry = tempInfo.ry * parseFloat(matrix.d);
							tempCode = (bbox.x  + bbox.width/2)  + "," + (bbox.y  + bbox.height/2) + "," + bbox.width/2 + "," + bbox.height/2;
						}else{
							return;
						}
						break;
					case 'path' :
						var tempD = $(obj.node).attr('d').split(",");
						switch(tempNo) {
							case 2 :
								if(browserType.indexOf('msie') > -1){
									var M_X = bbox.x;
									var M_Y = bbox.y + bbox.height;
									var L_X1 = bbox.x +  (bbox.width/2);
									var L_Y1 = bbox.y;
									var L_X2 = bbox.x +  bbox.width;
									var L_Y2 = bbox.y + bbox.height;
									tempCode = 'M'+M_X+ ',' + M_Y + ', L' + L_X1 + ',' + L_Y1 + ', L' + L_X2 + ',' + L_Y2 + ' Z';
								}else{
									return;
								}
								break;
							case 14 :
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ");
									var x1 = parseFloat(tempD[4]) * matrix.a;
									var y1 = parseFloat(tempD[5]) * matrix.d;
									var x2 = parseFloat(tempD[7]) * matrix.a;
									var y2 = parseFloat(tempD[8]) * matrix.d;
									var x3 = parseFloat(tempD[10]) * matrix.a;
									var y3 = parseFloat(tempD[11]) * matrix.d;
									var x4 = parseFloat(tempD[13]) * matrix.a;
									var y4 =parseFloat(tempD[14]) * matrix.d;
									var x5 = parseFloat(tempD[16]) * matrix.a;
									var y5 = parseFloat(tempD[17]) * matrix.d;
									var x6 = parseFloat(tempD[19]) * matrix.a;
									var y6 = parseFloat(tempD[20]) * matrix.d;
									var x7 = parseFloat(tempD[22]) * matrix.a;
									var y7 = parseFloat(tempD[23]) * matrix.d;
									var _w = handlerAttr.size.x * handlerAttr.scale.x;
									var _h = handlerAttr.size.y * handlerAttr.scale.y;
									var dimX = dimY = null;
									for(var i=4; i<=22; i=i+3){
										dimX += parseFloat(tempD[i]);
									}
									for(var j=5; j<=23; j=j+3){
										dimY += parseFloat(tempD[j]);
									}
									var _x = (bbox.x + _w) - (dimX * matrix.a);
									var _y = bbox.y -  (parseFloat(tempD[5])  * matrix.d);// + bbox.height/2;
								}else{
									return;
								}
								tempCode = 'M' +  _x + ',' + _y + ' l ' + x1 + ',' +  y1+ ' l ' + x2 + ',' +  y2+ ' l ' + x3 + ',' +  y3+ ' l ' + x4 + ',' +  y4+ ' l ' + x5 + ',' +  y5+ ' l ' + x6 + ',' +  y6+ ' l ' + x7 + ',' +  y7 + ' L' + _x + ',' + _y + ' Z';
								break;
							case 26 :
								var M_X = bbox.x;
								var M_Y = bbox.y + bbox.height;
								var L_X1 = bbox.x +  (bbox.width/2);
								var L_Y1 = bbox.y;
								var L_X2 = bbox.x +  bbox.width;
								var L_Y2 = bbox.y + bbox.height;
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ")
									var tempH1 = parseFloat(tempD[4]) * parseFloat(matrix.a);
									var tempV1 = parseFloat(tempD[6]) * parseFloat(matrix.d);
									var tempY2 = (parseFloat(tempD[17]) - parseFloat(tempD[2])) * parseFloat(matrix.d);
								}else{
									return;
									var tempHarray1 = tempD[1].split("h");
									var tempSize = tempHarray1[1].split("v");
									var tempH1 = parseFloat(tempSize[0]) * parseFloat(matrix.a);
									var tempV1 = parseFloat(tempSize[1]) * parseFloat(matrix.d);
									var tempHarray2 = tempD[3].split("h");
									var tempY2 = (parseFloat(tempHarray2[0]) - parseFloat(tempHarray1[0])) * parseFloat(matrix.d);
								}
								tempCode = 'M'+bbox.x + ',' + bbox.y + 'h' + tempH1 + 'v' + tempV1 + 'h' + (tempH1*-1) + 'V' + bbox.y + ' L' + bbox.x+ ',' + bbox.y + 'z' + ' M'+bbox.x + ',' + (bbox.y + tempY2) + 'h' + tempH1 + 'v' + tempV1 + 'h' + (tempH1*-1) + 'V' + (bbox.y + tempY2) + ' L' + bbox.x + ',' + (bbox.y + tempY2) + 'z';
								break;
							case 32 :
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ");
									var v1 = parseFloat(tempD[4]) * matrix.d;
									var v2 = parseFloat(tempD[15]) * matrix.d;
									var c1_1 = parseFloat(tempD[6]);
									var c1_2 = parseFloat(tempD[7]) * matrix.d;
									var c1_3 = parseFloat(tempD[8]) * matrix.a;
									var c1_4 = parseFloat(tempD[9]) * matrix.d;
									var c1_5 = parseFloat(tempD[10]) * matrix.a;
									var c1_6 = parseFloat(tempD[11]) * matrix.d;
									var c2_1 = parseFloat(tempD[27]) * matrix.d;
									var c2_2 = parseFloat(tempD[28]) ;
									var c2_3 = parseFloat(tempD[29]) * matrix.a;
									var c2_4 = parseFloat(tempD[30]) * matrix.d;
									var c2_5 = parseFloat(tempD[31]) * matrix.a;
									var c2_6 = parseFloat(tempD[32]) * matrix.d;
									var h1 = parseFloat(tempD[13]) * matrix.a;
									var lx1 = parseFloat(tempD[17]) * matrix.a;
									var lx2 = parseFloat(tempD[20]) * matrix.a;
									var ly1 = parseFloat(tempD[18]) * matrix.d;
									var ly2 = parseFloat(tempD[21]) * matrix.d;
									tempCode = 'M' + bbox.x + ',' + (bbox.y+ bbox.height)+ 'v' + v1 + 'c' + c1_1 + ',' + c1_2  + ',' + c1_3 + ',' +c1_4 + ',' + c1_5 + ',' + c1_6 ;
									tempCode +=  'h' + h1 + 'v' + v2 + 'l' + lx1 + ',' + ly1 + 'l' + lx2 + ',' + ly2 + 'v' + v2 + 'h' + (h1*-1)
									tempCode += 'c' + c2_1 + ',' +  c2_2 + ',' + c2_3 + ',' + c2_4 + ',' + c2_5 + ',' + c2_6 + 'v' + (v1*-1) + 'H' + bbox.x+ ' Z';
								}else{
									return;
								}
								break;
							case 33 :
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ");
									var c1_1 = parseFloat(tempD[4]);
									var c1_2 = parseFloat(tempD[5]) * matrix.d;
									var c1_3 = parseFloat(tempD[6]) * matrix.a;
									var c1_4 = parseFloat(tempD[7]) * matrix.d;
									var c1_5 = parseFloat(tempD[8]) * matrix.a;
									var c1_6 = parseFloat(tempD[9]) * matrix.d;
									var c2_1 = parseFloat(tempD[11]) * matrix.a;
									var c2_2 = parseFloat(tempD[12]) ;
									var c2_3 = parseFloat(tempD[13]) * matrix.a;
									var c2_4 = parseFloat(tempD[14]);
									var c2_5 = parseFloat(tempD[15]) * matrix.a;
									var c2_6 = parseFloat(tempD[16]);
									var c3_1 = parseFloat(tempD[18]);
									var c3_2 = parseFloat(tempD[19]) * matrix.d;
									var c3_3 = parseFloat(tempD[20]);
									var c3_4 = parseFloat(tempD[21])* matrix.d;
									var c3_5 = parseFloat(tempD[22]);
									var c3_6 = parseFloat(tempD[23])* matrix.d;
									var c4_1 = parseFloat(tempD[25]);
									var c4_2 = parseFloat(tempD[26]) * matrix.d;
									var c4_3 = parseFloat(tempD[27]) * matrix.a;
									var c4_4 = parseFloat(tempD[28]) * matrix.d;
									var c4_5 = parseFloat(tempD[29]) * matrix.a;
									var c4_6 = parseFloat(tempD[30]) * matrix.d;
									var c5_1 = parseFloat(tempD[32]) * matrix.a;
									var c5_2 = parseFloat(tempD[33]) * matrix.d;
									var c5_3 = parseFloat(tempD[34]) * matrix.a;
									var c5_4 = parseFloat(tempD[35]) * matrix.d;
									var c5_5 = parseFloat(tempD[36]) * matrix.a;
									var c5_6 = parseFloat(tempD[37]) * matrix.d;
									tempCode = 'M' + bbox.x + ',' + (bbox.y-c1_6)+ 'c' + c1_1 + ',' + c1_2  + ',' + c1_3 + ',' +c1_4 + ',' + c1_5 + ',' + c1_6 ;
									tempCode += 'c' + c2_1 + ',' + c2_2  + ',' + c2_3 + ',' +c2_4 + ',' + c2_5 + ',' + c2_6 ;
									tempCode += 'c' + c3_1 + ',' + c3_2  + ',' + c3_3 + ',' +c3_4 + ',' + c3_5 + ',' + c3_6 ;
									tempCode += 'c' + c4_1 + ',' + c4_2  + ',' + c4_3 + ',' +c4_4 + ',' + c4_5 + ',' + c4_6 ;
									tempCode += 'C' + (bbox.x + c1_3) + ',' + ((bbox.y-c1_6) + (c1_6 * -1))  + ',' + bbox.x + ',' +  ((bbox.y-c1_6) + (c4_2))  + ',' + bbox.x + ',' + (bbox.y-c1_6) ;
								}else{
									return;
								}
								break;
							case 34 :
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ");
									var c1_1 = parseFloat(tempD[4]) * matrix.a;
									var c1_2 = parseFloat(tempD[5]) * matrix.d;
									var c1_3 = parseFloat(tempD[6]) * matrix.a;
									var c1_4 = parseFloat(tempD[7]) * matrix.d;
									var c1_5 = parseFloat(tempD[8]) * matrix.a;
									var c1_6 = parseFloat(tempD[9]) * matrix.d;
									var c2_1 = parseFloat(tempD[11]);
									var c2_2 = parseFloat(tempD[12]) * matrix.d;
									var c2_3 = parseFloat(tempD[13]) * matrix.a;
									var c2_4 = parseFloat(tempD[14]) * matrix.d;
									var c2_5 = parseFloat(tempD[15]) * matrix.a;
									var c2_6 = parseFloat(tempD[16]) * matrix.d;
									var c3_1 = parseFloat(tempD[18]) * matrix.a;
									var c3_2 = parseFloat(tempD[19]);
									var c3_3 = parseFloat(tempD[20]) * matrix.a;
									var c3_4 = parseFloat(tempD[21]) * matrix.d;
									var c3_5 = parseFloat(tempD[22]) * matrix.a;
									var c3_6 = parseFloat(tempD[23]) * matrix.d;
									var c4_1 = parseFloat(tempD[25]);
									var c4_2 = parseFloat(tempD[26]) * matrix.d;
									var c4_3 = parseFloat(tempD[27]) * matrix.a;
									var c4_4 = parseFloat(tempD[28]) * matrix.d;
									var c4_5 = parseFloat(tempD[29]) * matrix.a;
									var c4_6 = parseFloat(tempD[30]) * matrix.d;
									tempCode = 'M' + (bbox.x + (bbox.width-c1_3)) + ',' + (bbox.y + bbox.height) + 'c' + c1_1 + ',' + c1_2 + ',' + c1_3 + ',' + c1_4 + ',' + c1_5 + ',' + c1_6 + ',';
									tempCode += 'c' + c2_1 + ',' + c2_2 + ',' + c2_3 + ',' + c2_4 + ',' + c2_5 + ',' + c2_6 + ',';
									tempCode += 'c' + c3_1 + ',' + c3_2 + ',' + c3_3 + ',' + c3_4 + ',' + c3_5 + ',' + c3_6 + ',';
									tempCode += 'c' + c4_1 + ',' + c4_2 + ',' + c4_3 + ',' + c4_4 + ',' + c4_5 + ',' + c4_6 + ',';
									tempCode += 'H' + (bbox.x + (bbox.width-c1_3)) + 'Z';
								}else{
									return;
								}
								break;
							case 35 :
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ");
									var h1 = parseFloat(tempD[4]) * matrix.a;
									var h2 = parseFloat(tempD[15]) * matrix.a;
									var c1_1 = parseFloat(tempD[6]) * matrix.a;
									var c1_2 = parseFloat(tempD[7]);
									var c1_3 = parseFloat(tempD[8]) * matrix.a;
									var c1_4 = parseFloat(tempD[9]) * matrix.d;
									var c1_5 = parseFloat(tempD[10]) * matrix.a;
									var c1_6 = parseFloat(tempD[11]) * matrix.d;
									var c2_1 = parseFloat(tempD[19]) * matrix.a;
									var c2_2 = parseFloat(tempD[20]) * matrix.d;
									var c2_3 = parseFloat(tempD[21]) * matrix.a;
									var c2_4 = parseFloat(tempD[22]) * matrix.d;
									var c2_5 = parseFloat(tempD[23]) * matrix.a;
									var c2_6 = parseFloat(tempD[24]) * matrix.d;
									var v1 = parseFloat(tempD[13]) * matrix.d;
									var v2 = parseFloat(tempD[17]) * matrix.d;
									tempCode = 'M' + (bbox.x + c1_3) + ',' + bbox.y + 'h' + h1 + 'c' + c1_1 + ',' + c1_2  + ',' + c1_3 + ',' +c1_4 + ',' + c1_5 + ',' + c1_6 ;
									tempCode +=  'v' + v1 + 'h' + h2 + 'v' + v2;
									tempCode += 'C' + ((bbox.x + c1_3) - c1_3) + ',' +  (bbox.y + c1_4) + ',' + ((bbox.x + c1_3) - c1_1)  + ',' +  bbox.y + ',' +   (bbox.x + c1_3) + ',' + bbox.y + 'L' +  (bbox.x + c1_3) + ',' + bbox.y + ' Z';
								}else{
									return;
								}
								break;
							case 37 :
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ");
									var lx = parseFloat(tempD[4]) * matrix.a;
									var ly = parseFloat(tempD[5]) * matrix.d;
									var c1_1 = parseFloat(tempD[7]) * matrix.a;
									var c1_2 = parseFloat(tempD[8]) * matrix.d;
									var c1_3 = parseFloat(tempD[9]) * matrix.a;
									var c1_4 = parseFloat(tempD[10]) * matrix.d;
									var c1_5 = parseFloat(tempD[11]) * matrix.a;
									var c1_6 = parseFloat(tempD[12]) * matrix.d;
									var c2_1 = parseFloat(tempD[19]) * matrix.a;
									var c2_2 = parseFloat(tempD[20]) * matrix.d;
									var c2_3 = parseFloat(tempD[21]) * matrix.a;
									var c2_4 = parseFloat(tempD[22]) * matrix.d;
									var c2_5 = parseFloat(tempD[23]) * matrix.a;
									var c2_6 = parseFloat(tempD[24]) * matrix.d;
									var c3_1 = parseFloat(tempD[26]) * matrix.a;
									var c3_2 = parseFloat(tempD[27]) * matrix.d;
									var c3_3 = parseFloat(tempD[28]) * matrix.a;
									var c3_4 = parseFloat(tempD[29]) * matrix.d;
									var c3_5 = parseFloat(tempD[30]) * matrix.a;
									var c3_6 = parseFloat(tempD[31]) * matrix.d;
									var s1 = parseFloat(tempD[14]) * matrix.a;
									var s2 = parseFloat(tempD[15]) * matrix.d;
									var s3 = parseFloat(tempD[16]) * matrix.a;
									var s4 = parseFloat(tempD[17]) * matrix.d;
									tempCode = 'M' + (bbox.x - (c1_3 - lx))  + ',' + (bbox.y + bbox.height) + 'l' + lx + ',' + ly + 'c' + c1_1 + ',' + c1_2  + ',' + c1_3 + ',' + c1_4 + ',' + c1_5 + ',' + c1_6 ;
									tempCode += 's' + s1 + ',' + s2 + ',' + s3 + ',' + s4;
									tempCode += 'c' + c2_1 + ',' + c2_2  + ',' + c2_3 + ',' + c2_4 + ',' + c2_5 + ',' + c2_6 ;
									tempCode += 'c' + c3_1 + ',' + c3_2  + ',' + c3_3 + ',' + c3_4 + ',' + c3_5 + ',' + c3_6 ;
									tempCode += 'L' + (bbox.x - (c1_3 - lx)) + ',' + (bbox.y + bbox.height) + 'Z';
								}else{
									return;
								}
								break;
							case 38 :
								if(browserType.indexOf('msie') > -1){
									tempD = $(obj.node).attr('d').split(" ");
									var c1_1 = parseFloat(tempD[4]);
									var c1_2 = parseFloat(tempD[5]) * matrix.d;
									var c1_3 = parseFloat(tempD[6]) * matrix.a;
									var c1_4 = parseFloat(tempD[7]) * matrix.d;
									var c1_5 = parseFloat(tempD[8]) * matrix.a;
									var c1_6 = parseFloat(tempD[9]) * matrix.d;
									var c2_1 = parseFloat(tempD[20]) * matrix.a;
									var c2_2 = parseFloat(tempD[21]) ;
									var c2_3 = parseFloat(tempD[22]) * matrix.a;
									var c2_4 = parseFloat(tempD[23]) * matrix.d;
									var c2_5 = parseFloat(tempD[24]) * matrix.a;
									var c2_6 = parseFloat(tempD[25]) * matrix.d;
									var c3_1 = parseFloat(tempD[37]) ;
									var c3_2 = parseFloat(tempD[38]) * matrix.d;
									var c3_3 = parseFloat(tempD[39]) * matrix.a;
									var c3_4 = parseFloat(tempD[40]) * matrix.d;
									var c3_5 = parseFloat(tempD[41]) * matrix.a;
									var c3_6 = parseFloat(tempD[42]) * matrix.d;
									var c4_1 = parseFloat(tempD[54]) * matrix.a;
									var c4_2 = parseFloat(tempD[55]);
									var c4_3 = parseFloat(tempD[56]) * matrix.a;
									var c4_4 = parseFloat(tempD[57]) * matrix.d;
									var c4_5 = parseFloat(tempD[58]) * matrix.a;
									var c4_6 = parseFloat(tempD[59]) * matrix.d;
									var h1 = parseFloat(tempD[11]) * matrix.a;
									var h2 = parseFloat(tempD[16]) * matrix.a;
									var h3 = parseFloat(tempD[18]) * matrix.a;
									var h4 = parseFloat(tempD[44]) * matrix.a;
									var h5 = parseFloat(tempD[52]) * matrix.a;
									var lx1 = parseFloat(tempD[13]) * matrix.a;
									var ly1 = parseFloat(tempD[14]) * matrix.d;
									var lx2 = parseFloat(tempD[29]) * matrix.a;
									var ly2 = parseFloat(tempD[30]) * matrix.d;
									var lx3 = parseFloat(tempD[34]) * matrix.a;
									var ly3 = parseFloat(tempD[35]) * matrix.d;
									var lx4 = parseFloat(tempD[46]) * matrix.a;
									var ly4 = parseFloat(tempD[47]) * matrix.d;
									var lx5 = parseFloat(tempD[49]) * matrix.a;
									var ly5 = parseFloat(tempD[50]) * matrix.d;
									var lx6 = parseFloat(tempD[61]) * matrix.a;
									var ly6 = parseFloat(tempD[62]) * matrix.d;
									var lx7 = parseFloat(tempD[66]) * matrix.a;
									var ly7 = parseFloat(tempD[67]) * matrix.d;
									var v1 = parseFloat(tempD[27]) * matrix.d;
									var v2 = parseFloat(tempD[32]) * matrix.d;
									var v3 = parseFloat(tempD[64]) * matrix.d;
									tempCode = 'M' + bbox.x  + ',' + (bbox.y - c1_4) + 'c' + c1_1 + ',' + c1_2  + ',' + c1_3 + ',' + c1_4 + ',' + c1_5 + ',' + c1_6 ;
									tempCode += 'h' + h1 + 'l' + lx1 + ',' + ly2 + 'h' + h2 + 'h' + h3;
									tempCode += 'c' + c2_1 + ',' + c2_2  + ',' + c2_3 + ',' + c2_4 + ',' + c2_5 + ',' + c2_6 ;
									tempCode += 'v' + v1 + 'l' + lx2 + ',' + ly2 + 'v' +v2 + 'l' + lx3 + ',' + ly3;
									tempCode += 'c' + c3_1 + ',' + c3_2  + ',' + c3_3 + ',' + c3_4 + ',' + c3_5 + ',' + c3_6 ;
									tempCode += 'h' + h4 + 'l' + lx4 + ',' + ly4 + 'l' + lx5 + ',' + ly5 + 'h' + h5;
									tempCode += 'c' + c4_1 + ',' + c4_2  + ',' + c4_3 + ',' + c4_4 + ',' + c4_5 + ',' + c4_6 ;
									tempCode += 'l' + lx6 + ',' + ly6 + 'v' + v3 + 'l' + lx7 + ',' + ly7;
									tempCode += 'V' + (bbox.y - c1_4) + 'Z';
								}else{
									return;
								}
								break;
							default :
								
						}
						
						break;
					case 'polygon' :
						var tempPoints = $(obj.node).attr('points').split(",");
						switch(tempNo) {
							case 6 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = parseFloat(tempPoints[0]) - parseFloat(tempPoints[1].split(" ")[1]);
								}else{
									return;
									tempX1 = parseFloat(tempPoints[0]) - parseFloat(tempPoints[2]);
								}
								tempCode = (bbox.x + (tempX1 * parseFloat(matrix.a))) + ',' +  (bbox.y + (bbox.height/2)) + ',' +  bbox.x + ',' +  bbox.y + ',' + (bbox.x + bbox.width) + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + bbox.height)  + ',' + bbox.x + ',' + (bbox.y + bbox.height);
								break;
							case 7 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
								}else{
									return;
									tempX1 = (parseFloat(tempPoints[4]) - parseFloat(tempPoints[2])) * parseFloat(matrix.a);
								}
								tempCode = bbox.x + ',' +  bbox.y + ',' + ((bbox.x + bbox.width)-tempX1) + ',' +  bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + bbox.height/2) + ',' + ((bbox.x + bbox.width)-tempX1)  + ',' + (bbox.y + bbox.height) + ',' + bbox.x + ',' + (bbox.y + bbox.height);
								break;
							case 8 :
								if(browserType.indexOf('msie') > -1){
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
									tempY1 = (parseFloat(tempPoints[5]) - parseFloat(tempPoints[3])) * parseFloat(matrix.d);
								}
								tempX1 = bbox.x + bbox.width/2;
								tempCode = (bbox.x + bbox.width) + ',' +  ((bbox.y + bbox.height)-tempY1) + ',' + tempX1 + ',' +  ((bbox.y + bbox.height)-tempY1) + ',' + tempX1 + ',' +  (bbox.y + bbox.height) + ',' + bbox.x + ','+ (bbox.y + (bbox.height/2)) + ',' + tempX1 + ',' +  bbox.y + ',' + tempX1 + ',' +  (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' +  (bbox.y + tempY1);
								break;
							case 9 :
								if(browserType.indexOf('msie') > -1){
									tempY1 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[3].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
									tempY1 = (parseFloat(tempPoints[3]) - parseFloat(tempPoints[5])) * parseFloat(matrix.d);
								}
								tempX1 = bbox.x + bbox.width/2;
								tempCode = bbox.x + ',' +  (bbox.y + tempY1) + ',' + tempX1 + ',' +  (bbox.y + tempY1) + ',' + tempX1 + ',' +  bbox.y + ','  + (bbox.x + bbox.width) + ',' +  (bbox.y + bbox.height/2)  + ',' + tempX1 + ',' +  (bbox.y + bbox.height)  + ',' + tempX1 + ',' + ((bbox.y + bbox.height)-tempY1) + ',' +  bbox.x + ',' + ((bbox.y + bbox.height)-tempY1);
								break;
							case 10 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[2].split(" ")[1])) * parseFloat(matrix.a);
								}else{
									return;
									tempX1 = (parseFloat(tempPoints[2]) - parseFloat(tempPoints[4])) * parseFloat(matrix.a);
								}
								tempY1 = bbox.y + bbox.height/2;
								tempCode = (bbox.x + tempX1) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX1) + ',' + tempY1 + ',' +  bbox.x + ',' + tempY1 + ',' + (bbox.x + bbox.width/2) + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + tempY1 + ',' + ((bbox.x + bbox.width)-tempX1) + ',' + tempY1 + ',' + ((bbox.x + bbox.width)-tempX1) + ',' + (bbox.y + bbox.height);
								break;
							case 11 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
								}else{
									return;
									tempX1 = (parseFloat(tempPoints[4]) - parseFloat(tempPoints[2])) * parseFloat(matrix.a);
								}
								tempY1 = bbox.y + bbox.height/2;
								tempCode = ((bbox.x + bbox.width) - tempX1) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + tempY1 + ',' + (bbox.x + bbox.width) + ',' + tempY1 + ',' + (bbox.x + bbox.width/2) + ',' + (bbox.y + bbox.height) + ',' + bbox.x + ',' + tempY1 + ',' + (bbox.x + tempX1) + ',' + tempY1 + ',' + (bbox.x + tempX1) + ',' + bbox.y;
								break;
							case 12 :
								if(browserType.indexOf('msie') > -1){
									tempY1 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[5].split(" ")[0]) - parseFloat(tempPoints[4].split(" ")[0])) * parseFloat(matrix.d);
									tempY4 = (parseFloat(tempPoints[5].split(" ")[0]) - parseFloat(tempPoints[6].split(" ")[0])) * parseFloat(matrix.d);
									tempMiddle =  parseFloat(tempPoints[2].split(" ")[1] - tempPoints[0].split(" ")[0]) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[3].split(" ")[1])) * parseFloat(matrix.a);
									tempX4 = (parseFloat(tempPoints[4].split(" ")[1]) - parseFloat(tempPoints[3].split(" ")[1])) * parseFloat(matrix.a);
								}else{
									return;
									tempY1 = (parseFloat(tempPoints[3]) - parseFloat(tempPoints[1])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[5]) - parseFloat(tempPoints[3])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[9]) - parseFloat(tempPoints[7])) * parseFloat(matrix.d);
									tempY4 = (parseFloat(tempPoints[9]) - parseFloat(tempPoints[11])) * parseFloat(matrix.d);
									tempMiddle =  parseFloat(tempPoints[4] - tempPoints[0]) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[4]) - parseFloat(tempPoints[2])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[4]) - parseFloat(tempPoints[6])) * parseFloat(matrix.a);
									tempX4 = (parseFloat(tempPoints[8]) - parseFloat(tempPoints[6])) * parseFloat(matrix.a);
								}
								tempCode = (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX2) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY1 + tempY2)  + ',' + ((bbox.x + bbox.width) - tempX3) + ',' + ((bbox.y + bbox.height) - tempY3) + ',' + ((bbox.x + bbox.width) - (tempX3 - tempX4))	 + ',' + ( bbox.y + bbox.height) + ',' + (bbox.x + tempMiddle) + ',' + ((bbox.y + bbox.height) - tempY4) + ',' + (bbox.x + (tempX3 - tempX4)) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX3) + ',' + ((bbox.y + bbox.height) - tempY3) + ',' +  bbox.x + ',' +  (bbox.y + tempY1 + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY1);
								break;
							case 13 :
								if(browserType.indexOf('msie') > -1){
									tempY1 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempMiddle =  parseFloat(tempPoints[2].split(" ")[1] - tempPoints[0].split(" ")[0]) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[3].split(" ")[1])) * parseFloat(matrix.a);
								}else{
									return;
								}
								tempCode = (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX2) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY2)  + ',' + ((bbox.x + bbox.width) - tempX3) + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + bbox.width)	 + ',' + (( bbox.y + bbox.height) - tempY2) + ',' + ((bbox.x + bbox.width) - tempX2) + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + (bbox.x + tempMiddle) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX2) + ',' + ((bbox.y + bbox.height) - tempY1) + ',' +  bbox.x + ',' +  (( bbox.y + bbox.height) - tempY2) + ',' + (bbox.x + tempX3) + ',' + (bbox.y + bbox.height/2) + ',' + bbox.x + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY1);
								break;
							case 15 :
								if(browserType.indexOf('msie') > -1){
									tempMiddle =  parseFloat(tempPoints[0] - tempPoints[10].split(" ")[1]) * parseFloat(matrix.a);
									tempX1 = (parseFloat(tempPoints[12].split(" ")[1]) - parseFloat(tempPoints[10].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[11].split(" ")[1]) - parseFloat(tempPoints[10].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[8].split(" ")[1]) - parseFloat(tempPoints[10].split(" ")[1])) * parseFloat(matrix.a);
									tempX4 = (parseFloat(tempPoints[9].split(" ")[1]) - parseFloat(tempPoints[10].split(" ")[1])) * parseFloat(matrix.a);
									tempX5 = (parseFloat(tempPoints[13].split(" ")[1]) - parseFloat(tempPoints[10].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY4 = (parseFloat(tempPoints[5].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY5 = (parseFloat(tempPoints[6].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY6 = (parseFloat(tempPoints[8].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX5) + ',' + (bbox.y + tempY2) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + (bbox.y + tempY3) + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + tempY4) + ',' + ((bbox.x + bbox.width) - tempX4)  + ',' + (bbox.y + tempY5) + ',' + ((bbox.x + bbox.width) - tempX3)  + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempMiddle)  + ',' + (bbox.y + tempY6) + ',' + (bbox.x + tempX3)  + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX4)  + ',' + (bbox.y + tempY5) + ',' + bbox.x + ',' + (bbox.y + tempY4) + ',' + (bbox.x + tempX2)  + ',' + (bbox.y + tempY3) + ',' + (bbox.x + tempX1)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX5)  + ',' + (bbox.y + tempY2);
								break;
							case 16 :
								if(browserType.indexOf('msie') > -1){
									tempMiddle =  parseFloat(tempPoints[0] - tempPoints[12].split(" ")[1]) * parseFloat(matrix.a);
									tempX1 = (parseFloat(tempPoints[14].split(" ")[1]) - parseFloat(tempPoints[12].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[13].split(" ")[1]) - parseFloat(tempPoints[12].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[15].split(" ")[1]) - parseFloat(tempPoints[12].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX3) + ',' + (bbox.y + tempY2) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + (bbox.y + tempY3) + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + bbox.height/2) + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + ((bbox.y + bbox.height) - tempY3) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + ((bbox.y + bbox.height)-tempY1) + ',' + ((bbox.x + bbox.width) -tempX3)  + ',' + ((bbox.y + bbox.height) - tempY2) + ',' + (bbox.x + tempMiddle)  + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX3)  + ',' + ((bbox.y + bbox.height) - tempY2) + ',' + (bbox.x + tempX1) + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + (bbox.x + tempX2)  + ',' + ((bbox.y + bbox.height) - tempY3) + ',' + bbox.x  + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + tempX2)  + ',' + (bbox.y + tempY3) + ',' + (bbox.x + tempX1)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX3)  + ',' + (bbox.y + tempY2);
								break;
							case 17 :
								if(browserType.indexOf('msie') > -1){
									tempMiddle =  parseFloat(tempPoints[0] - tempPoints[14].split(" ")[1]) * parseFloat(matrix.a);
									tempX1 = (parseFloat(tempPoints[12].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[16].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[13].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX4 = (parseFloat(tempPoints[15].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX5 = (parseFloat(tempPoints[10].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX6 = (parseFloat(tempPoints[11].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX7 = (parseFloat(tempPoints[17].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY4 = (parseFloat(tempPoints[5].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY5 = (parseFloat(tempPoints[6].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY6 = (parseFloat(tempPoints[8].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY7 = (parseFloat(tempPoints[7].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY8 = (parseFloat(tempPoints[10].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX7) + ',' + (bbox.y + tempY2) + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX4)  + ',' + (bbox.y + tempY3) + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + tempY4) + ',' + ((bbox.x + bbox.width) - tempX3)  + ',' + (bbox.y + tempY5) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + tempY7) + ',' + ((bbox.x + bbox.width) - tempX6)  + ',' + (bbox.y + tempY6) + ',' + ((bbox.x + bbox.width) - tempX5)  + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempMiddle)  + ',' + (bbox.y + tempY8) + ',' + (bbox.x + tempX5) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX6)  + ',' + (bbox.y + tempY6) + ',' + (bbox.x + tempX1)  + ',' + (bbox.y + tempY7) + ',' + (bbox.x + tempX3)  + ',' + (bbox.y + tempY5) + ',' + bbox.x  + ',' + (bbox.y + tempY4) + ',' + (bbox.x + tempX4)  + ',' + (bbox.y + tempY3) + ',' + (bbox.x + tempX2)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX7)  + ',' + (bbox.y + tempY2);
								break;
							case 18 :
								if(browserType.indexOf('msie') > -1){
									tempMiddle =  parseFloat(tempPoints[0] - tempPoints[14].split(" ")[1]) * parseFloat(matrix.a);
									tempX1 = (parseFloat(tempPoints[12].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[15].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[13].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempX4 = (parseFloat(tempPoints[11].split(" ")[1]) - parseFloat(tempPoints[14].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[5].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY4 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX4) + ',' + (bbox.y + tempY2) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX3)  + ',' + (bbox.y + tempY4) + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + tempY3) + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + bbox.width)  + ',' + ((bbox.y + bbox.height) - tempY3) + ',' + ((bbox.x + bbox.width) - tempX3)  + ',' + ((bbox.y + bbox.height) - tempY4) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + ((bbox.x + bbox.width) - tempX4) + ',' + ((bbox.y + bbox.height) - tempY2) + ',' + (bbox.x + tempMiddle)  + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX4) + ',' + ((bbox.y + bbox.height) - tempY2) + ',' + (bbox.x + tempX1)  + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + (bbox.x + tempX3)  + ',' + ((bbox.y + bbox.height) - tempY4) + ',' + bbox.x  + ',' + ((bbox.y + bbox.height) - tempY3) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + bbox.height/2) + ',' + bbox.x  + ',' + (bbox.y + tempY3) + ',' + (bbox.x + tempX3)  + ',' + (bbox.y + tempY4) + ',' + (bbox.x + tempX1)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX4)  + ',' + (bbox.y + tempY2);
								break;
							case 19 :
								if(browserType.indexOf('msie') > -1){
									tempMiddle =  parseFloat(tempPoints[2].split(" ")[1] - tempPoints[1].split(" ")[1]) * parseFloat(matrix.a);
									tempX1 = (parseFloat(tempPoints[0]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[3].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempX1)  + ',' + (bbox.y + bbox.height) + ',' + bbox.x  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempMiddle) + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + bbox.height);
								break;
							case 20 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[0]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
								}else{
									return;
									tempX1 = parseFloat(tempPoints[0] -  tempPoints[2]) * parseFloat(matrix.a);
								}
								tempCode = (bbox.x + tempX1)  + ',' + (bbox.y + bbox.height) + ',' + bbox.x  + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + tempX1) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + bbox.y + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + bbox.height/2) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + bbox.height);
								break;
							case 21 :
								if(browserType.indexOf('msie') > -1){
									tempMiddle =  parseFloat(tempPoints[3].split(" ")[1] - tempPoints[1].split(" ")[1]) * parseFloat(matrix.a);
									tempX1 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[0]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[4].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[4].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempX2)  + ',' + (bbox.y + bbox.height) + ',' + bbox.x  + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + tempY2) + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + (bbox.y + bbox.height);
								break;
							case 22 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[0]) - parseFloat(tempPoints[1].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[1].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
									tempX1 = parseFloat(tempPoints[0] -  tempPoints[2]) * parseFloat(matrix.a);
									tempY1 = parseFloat(tempPoints[1] -  tempPoints[3]) * parseFloat(matrix.d);
								}
								tempCode = (bbox.x + tempX1)  + ',' + (bbox.y + bbox.height) + ',' + bbox.x  + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + bbox.x + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX1) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + bbox.height);
								break;
							case 23 :
								if(browserType.indexOf('msie') > -1){
									tempMiddle =  parseFloat(tempPoints[4].split(" ")[1] - tempPoints[2].split(" ")[1]) * parseFloat(matrix.a);
									tempX1 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[2].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[3].split(" ")[1]) - parseFloat(tempPoints[2].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[0]) - parseFloat(tempPoints[2].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[5].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[5].split(" ")[0])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[5].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempX3)  + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX1)  + ',' + (bbox.y + tempY3) + ',' + bbox.x  + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempMiddle) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + tempY2) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + tempY3) + ',' + ((bbox.x + bbox.width) - tempX3)  + ',' + (bbox.y + bbox.height);
								break;
							case 24 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[2].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[0]) - parseFloat(tempPoints[2].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[1].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + tempX2)  + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX1)  + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + bbox.x  + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX2) + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + bbox.height/2) + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + ((bbox.x + bbox.width) - tempX2)  + ',' + (bbox.y + bbox.height);
								break;
							case 25 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[4].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[1].split(" ")[0]) - parseFloat(tempPoints[3].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[7].split(" ")[0]) - parseFloat(tempPoints[3].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = bbox.x + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX1) + ',' + bbox.y + ',' + (bbox.x + tempX2) + ',' + bbox.y + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY2) + ',' + bbox.x + ',' + (bbox.y + tempY2);
								break;
							case 27 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[5].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
								}else{
									return;
								}
								tempCode = bbox.x + ',' + bbox.y + ',' + (bbox.x + tempX2) + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + bbox.height) + ',' + bbox.x + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + bbox.height/2);
								break;
							case 28 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
									tempX1 = parseFloat(tempPoints[2] - tempPoints[0]) * parseFloat(matrix.a);
									tempY1 = parseFloat(tempPoints[5] - tempPoints[1]) * parseFloat(matrix.d);
								}
								tempCode = bbox.x + ',' + bbox.y + ',' + (bbox.x + tempX1) + ',' + bbox.y + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + bbox.height) + ',' + bbox.x + ',' + (bbox.y + bbox.height);
								break;
							case 29 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
									tempX1 = parseFloat(tempPoints[2] - tempPoints[0]) * parseFloat(matrix.a);
									tempY1 = parseFloat(tempPoints[5] - tempPoints[3]) * parseFloat(matrix.d);
								}
								tempCode = bbox.x + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + tempX1) + ',' + bbox.y + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + (bbox.y + tempY1) + ',' +  ((bbox.x + bbox.width) - tempX1) + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + bbox.height/2) + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + (bbox.y + bbox.height) + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + (bbox.x + tempX1) + ',' + ((bbox.y + bbox.height) - tempY1) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + bbox.height);
								break;
							case 30 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[3].split(" ")[1]) - parseFloat(tempPoints[4].split(" ")[1])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[4].split(" ")[1])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[5].split(" ")[1]) - parseFloat(tempPoints[4].split(" ")[1])) * parseFloat(matrix.a);
									tempX4 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[4].split(" ")[1])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[1].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
									tempY3 = (parseFloat(tempPoints[5].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
									tempY4 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[2].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = (bbox.x + bbox.width) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX4) + ',' + bbox.y + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY4) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY2) + ',' +  bbox.x + ',' + (bbox.y + tempY3) + ',' + (bbox.x + tempX3) + ',' + (bbox.y + bbox.height);
								break;
							case 31 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[3].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[2].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[4].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX4 = (parseFloat(tempPoints[6].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[5].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[2].split(" ")[0]) - parseFloat(tempPoints[5].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = bbox.x + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY1) + ',' +  (bbox.x + tempX3) + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX4) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX4) + ',' + (bbox.y + bbox.height) + ',' + bbox.x + ',' + (bbox.y + bbox.height);
								break;
							case 36 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[1].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
								}else{
									return;
									tempX1 = parseFloat(tempPoints[2] -  tempPoints[0]) * parseFloat(matrix.a);
								}
								tempCode = bbox.x  + ',' + (bbox.y + bbox.height/2) + ',' + (bbox.x + tempX1)  + ',' + bbox.y + ',' + ((bbox.x + bbox.width) - tempX1)  + ',' + bbox.y + ',' + (bbox.x + bbox.width) + ',' + (bbox.y + bbox.height/2) + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX1)  + ',' + (bbox.y + bbox.height);
								break;
							case 39 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[4].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[5].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX3 = (parseFloat(tempPoints[3].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[4].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = bbox.x  + ',' + bbox.y + ',' + (bbox.x + bbox.width)  + ',' + bbox.y + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX3) + ',' + (bbox.y + tempY1) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + bbox.height) + ',' + (bbox.x + tempX2)  + ',' + (bbox.y + tempY1) + ',' + bbox.x + ',' +  (bbox.y + tempY1);
								break;
							case 40 :
								if(browserType.indexOf('msie') > -1){
									tempX1 = (parseFloat(tempPoints[7].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempX2 = (parseFloat(tempPoints[8].split(" ")[1]) - parseFloat(tempPoints[0])) * parseFloat(matrix.a);
									tempY1 = (parseFloat(tempPoints[3].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
									tempY2 = (parseFloat(tempPoints[5].split(" ")[0]) - parseFloat(tempPoints[1].split(" ")[0])) * parseFloat(matrix.d);
								}else{
									return;
								}
								tempCode = bbox.x  + ',' + bbox.y + ',' + (bbox.x + bbox.width)  + ',' + bbox.y + ',' + (bbox.x + bbox.width)  + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX2) + ',' + (bbox.y + tempY1) + ',' + ((bbox.x + bbox.width) - tempX2) + ',' + (bbox.y + tempY2) + ',' + ((bbox.x + bbox.width) - tempX1) + ',' + (bbox.y + tempY2) + ',' + (bbox.x + bbox.width/2) + ',' +  (bbox.y + bbox.height) + ',' + (bbox.x + tempX1) + ',' + (bbox.y + tempY2) + ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY2) +  ',' + (bbox.x + tempX2) + ',' + (bbox.y + tempY1) +  ',' + bbox.x + ',' + (bbox.y + tempY1);
								break;
							default :
								
						}
						
						break;
						
					default :
						
				}
				
				var thisCode = KTCE.shapeCode['shape'+(tempNo)].code
				
				var prevObj = obj.prev();
				var nextObj = obj.next();
				
				if(action == 'upgroup') {
					fnCreateShape(tempType, tempCode, tempNo, tempInfo, prevObj, nextObj, 'ungroup', fHandler);
					obj.remove();
					$("g.dataGroup>g." + obj.id).remove();
					fHandler.hideHandles();
					//fHandler.updateHandles();
					
				}else{
					//그룹핑: 도형리사이징 시 원래 index position 위치로
					fnCreateShape(tempType, tempCode, tempNo, tempInfo, prevObj, nextObj);
					obj.remove();
					fHandler.hideHandles();
				}
				fHandler.updateHandles();
				
			}catch(e){
				console.log('object resizing error', e);
			}
			
		}

		// 오브젝트를 받아 freeTransform을 적용시킴(textBox)
		function fnSetFreeTransformTextbox(obj) {

			var fHandler = Snap.freeTransform(obj, {
					draw: ['bbox']
					, rotate: ['axisY']
					, drag : ['self']
					, scale: ['bboxCorners', 'bboxSides']
					, distance: '1.3'
					, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height : KTCE.currentPaper.height
					}
					, objectId : obj.id
					, textBoxFlag : true
				});

			// 기존 오브젝트 정보가 있는지 판단
			if ( obj.hasClass('hasData') ) {

				var info = fnGetDataObject(obj);

				fHandler.attrs.translate.x = info.translate.x;
				fHandler.attrs.translate.y = info.translate.y;
				fHandler.attrs.scale.x = info.scale.x;
				fHandler.attrs.scale.y = info.scale.y;
				fHandler.attrs.rotate = info.rotate;

				fHandler.apply();

			} else {
				// 정보 오브젝트 생성
				fnCreateDataObject(obj, fHandler);
			}

			obj.data('hasHandle', true );
			obj.freeTransform = fHandler;

			KTCE.currentPaper.shapeArray.push(fHandler);
			KTCE.currentPaper.currentShape = obj; 
			fHandler.visibleHandles();
			
			handlerBinding();
			setTimeout(function() {
				KTCE.textCreating = false;
			}, 1);

		}

		// 오브젝트를 받아 Table을 Initialize
		function fnInitializeTable(obj){
			var tableX = parseFloat((obj.attr("tablex")===null) ? obj.attr("tableX") : obj.attr("tablex"));
			var tableY = parseFloat((obj.attr("tabley")===null) ? obj.attr("tableY") : obj.attr("tabley"));
			var firstX = parseFloat((obj.attr("firstx")===null) ? obj.attr("firstX") : obj.attr("firstx"));
			var firstY = parseFloat((obj.attr("firsty")===null) ? obj.attr("firstY") : obj.attr("firsty"));
			var cellHeight = parseFloat((obj.attr("cellheight")===null) ? obj.attr("cellHeight") : obj.attr("cellheight"));
			var cellWidth = parseFloat((obj.attr("cellwidth")===null) ? obj.attr("cellWidth") : obj.attr("cellwidth"));
			
			var thisTable = {
				id : obj.attr("id"),
				length : {
					x : tableX,
					y : tableY
				},
				tableX : tableX,
				tableY : tableY,				
				position : {
					x : firstX,
					y : firstY
				},
				cellWidth : cellHeight,
				cellHeight : cellWidth,				
				strokeWidth : parseFloat(obj.attr("data-stroke-width")),
				cellArray : [], 
				cellHoverArray : [],
				cellTextArray : [],
				xLineArray : [], 
				yLineArray : [], 
				mergeCellArray : [],
				tableCellStateArray : [],
				mergeActiveCellArray : []
			}
			
			//table data-id(index) 값 재설정
			var tableObj = KTCE.currentPaper.objOuter.selectAll('g.objectGroup>g.xTable');
			var tableArraylength = tableObj.length;

			for(var t=0; t<tableArraylength; t++) {
				tableObj[t].attr('data-id', 'xTable'+ t);
			}
			
			for(var i=0; i < obj.selectAll('rect.xCell').length; i++){
				var cell = obj.selectAll('rect.xCell')[i];
				cell.data('x',parseFloat(cell.attr("data-index-x")));
				cell.data('y',parseFloat(cell.attr("data-index-y")));
				thisTable.cellArray.push(cell);
			}
			for(var i=0; i < obj.selectAll('rect.xCellHover').length; i++){
				var cell = obj.selectAll('rect.xCellHover')[i];
				cell.data('x',parseFloat(cell.attr("data-index-x")));
				cell.data('y',parseFloat(cell.attr("data-index-y")));

				$( cell.node ).data( 'indexX', parseFloat(cell.attr("data-index-x")) );
				$( cell.node ).data( 'indexY', parseFloat(cell.attr("data-index-y")) );
				$( cell.node ).data( 'pX', parseFloat(cell.attr("data-init-pos-x")) );
				$( cell.node ).data( 'pY', parseFloat(cell.attr("data-init-pos-y")) );

				cell.data( 'self', cell );
				
				// dblclick event 중복방지
				cell.undblclick().dblclick( function( $event ) {
					var cell = $( $event.target );
					if($(cell).attr("data-merge")!= undefined){
						var triggerTarget = $(cell).attr("data-merge").split(",")[0];
						cell = $ (thisTable.cellHoverArray[triggerTarget].node);
					}
					var indexX = cell.data( 'indexX' );
					var indexY = cell.data( 'indexY' );
					var positionX = cell.attr( 'x' );
					var positionY = cell.attr( 'y' );
					var pX = cell.data( 'pX' );
					var pY = cell.data( 'pY' );

					if( thisTable.cellTextArray[ indexY ][ indexX ] === undefined ) {
						fnCreateTextinTable(cell, obj, thisTable);
					}
					else {
						fnCellTextInputMode(obj, indexX, indexY);
					}
				} );
				thisTable.cellHoverArray.push(cell);
			}	
			
			for(var i=0; i < thisTable.tableY; i++){
				thisTable.cellTextArray.push([]);
			}
			var tableIndex = obj.attr('data-id').substring(6,8);
			if( KTCE.currentPaper.s.select("g.xTableTexts_" + thisTable.id) != null){
				var _cellTextWrapper = KTCE.currentPaper.s.select("g.xTableTexts_" + thisTable.id).selectAll('g.cellTextWrapper');
				for(var i=0; i < _cellTextWrapper.length; i++){		
					var wordWrapper  = _cellTextWrapper[i];
					//table cell id(index) 값 재설정
					var cellId = wordWrapper.attr('id');
					var _cellIdSplitArray = cellId.split('_');
					var _temp = cellId.substring(0,5);
					if(_temp == "text_") {
						cellId = "text" + tableIndex + "_" + _cellIdSplitArray[1] + "_" + _cellIdSplitArray[2] + "_" + thisTable.id;
					} else if(_temp != "text" + tableIndex){
						cellId = "text" + tableIndex + "_" + _cellIdSplitArray[1] + "_" + _cellIdSplitArray[2] + "_" + thisTable.id;
					}else{
						cellId = "text" + tableIndex + "_" + _cellIdSplitArray[1] + "_" + _cellIdSplitArray[2] + "_" + thisTable.id;
					}
					var textHeight = (wordWrapper.attr('data-lineheight') != null) ? wordWrapper.attr('data-lineheight') : ((wordWrapper.attr('data-lineHeight') != null) ? wordWrapper.attr('data-lineHeight') : 0);
					textHeight = (textHeight != 'undefined') ? textHeight : 0;
					wordWrapper.attr({'id': cellId, 'data-lineheight': textHeight});
					wordWrapper.data({
						pId : obj.attr("id"),
						indexX: parseInt(wordWrapper.attr("data-cellx")),
						indexY: parseInt(wordWrapper.attr("data-celly")),
						pX:	parseInt(wordWrapper.attr("data-posx")),
						pY: parseInt(wordWrapper.attr("data-posy"))
					});

					wordWrapper.undblclick().dblclick( function( e ) {
						//그룹객체
						if(KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform == undefined || KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform == null) return;

						var cellIdx = thisTable.length.x * parseInt(this.attr("data-celly")) + parseInt(this.attr("data-cellx"));
						var targetCell = thisTable.cellHoverArray[cellIdx];

						targetCell.node.removeEventListener('click', false);
						targetCell.node.addEventListener('click', false);
						
						fnCellTextInputMode(KTCE.currentPaper.s.select("#" + thisTable.id), parseInt(this.attr("data-cellx")), parseInt(this.attr("data-celly")), e);
					}).unclick().click(function(e){
						if(KTCE.currentPaper.currentShape == null || KTCE.currentPaper.currentShape.id != KTCE.currentPaper.s.select("#" + thisTable.id).attr("id")){
							if(e.shiftKey){	//기존 선택객체 + 현재선택객체 모두 선택
							}else{	//shiftKey를 누를지 않을 경우 해당 표만 선택
								//201804 그룹객체
								if(KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform == undefined || KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform == null) return;
								hideAllHandler();
							}
							var selLen = KTCE.currentPaper.selectedShapeArray.length;
							for(var i=0; i < selLen; i++) {
								var shape = KTCE.currentPaper.selectedShapeArray[i];
								if(shape.node.id === thisTable.id) return;
							}
							KTCE.currentPaper.s.select("#" + thisTable.id).data('hasHandle', true);
							KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform.visibleHandles();
							KTCE.currentPaper.currentShape = KTCE.currentPaper.s.select("#" + thisTable.id);
							KTCE.currentPaper.selectedShapeArray.push(KTCE.currentPaper.s.select("#" + thisTable.id));
						}
						var cellIdx = thisTable.length.x * parseInt(this.attr("data-celly")) + parseInt(this.attr("data-cellx"));
						var targetCell = thisTable.cellHoverArray[cellIdx];

						$(targetCell).trigger('click');

                		var tableId = thisTable.id;
                        $("#" + tableId + " rect.xCellHover").removeAttr('data-active');
                        $("#" + tableId + " rect.xCellHover").attr('fill', '#ffffff');
                        $("#" + tableId + " rect.xCellHover").css('opacity', 0);
                        
                        var rectId = " rect.xCellHover.x" + this.attr("data-cellx") + "_y" + this.attr("data-celly");
                        var dataMerge = $("#" + tableId + rectId).attr('data-merge');
                        if(dataMerge == undefined) {
                            //비merge cell 선택모드 활성화
                            $("#" + tableId + rectId).attr({
                                'fill': '#a2a2da',
                                'data-active': 'active'
                            });
                            $("#" + tableId + rectId).css({
                                'opacity': 0.4
                            });
                        }else{
                            //merge cell이면 해당 cell 선택모드 활성화
                            $("#" + tableId + " rect.xCellHover[data-merge='" + dataMerge + "']").attr({
                                'fill': '#a2a2da',
                                'data-active': 'active'
                            });
                            $("#" + tableId + " rect.xCellHover[data-merge='" + dataMerge + "']").css({
                                'opacity': 0.4
                            });
                        } 
					}).mousedown(function(e){
						KTCE.tableCellDragFlag = true;
						if(KTCE.currentPaper.currentShape == null || KTCE.currentPaper.currentShape.id != KTCE.currentPaper.s.select("#" + thisTable.id).attr("id")){
							if(e.shiftKey){	//기존 선택객체 + 현재선택객체 모두 선택
							}else{	//shiftKey를 누를지 않을 경우 해당 표만 선택
								// 그룹객체
								if(KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform == undefined || KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform == null) return;
								hideAllHandler();
							}
							var selLen = KTCE.currentPaper.selectedShapeArray.length;
							for(var i=0; i < selLen; i++) {
								var shape = KTCE.currentPaper.selectedShapeArray[i];
								if(shape.node.id === thisTable.id) return;
							}
							KTCE.currentPaper.s.select("#" + thisTable.id).data('hasHandle', true);
							KTCE.currentPaper.s.select("#" + thisTable.id).freeTransform.visibleHandles();
							KTCE.currentPaper.currentShape = KTCE.currentPaper.s.select("#" + thisTable.id);
							KTCE.currentPaper.selectedShapeArray.push(KTCE.currentPaper.s.select("#" + thisTable.id));
						}
						var cellIdx = thisTable.length.x * parseInt(this.attr("data-celly")) + parseInt(this.attr("data-cellx"));
						var targetCell = thisTable.cellHoverArray[cellIdx];
						//targetCell.node.dispatchEvent(new Event("mousedown"))                
						$(targetCell).trigger('mousedown');        					
					}).mouseup(function(e){
						 //표 셀 mousemove 선택mode 해제
		                if(KTCE.tableCellDragFlag) KTCE.tableCellDragFlag = false;		                
						var cellIdx = thisTable.length.x * parseInt(this.attr("data-celly")) + parseInt(this.attr("data-cellx"));
						var targetCell = thisTable.cellHoverArray[cellIdx];
					}).mousemove(function(e){
						var cellIdx = thisTable.length.x * parseInt(this.attr("data-celly")) + parseInt(this.attr("data-cellx"));
						var targetCell = thisTable.cellHoverArray[cellIdx];
						    
		                if(KTCE.tableCellDragFlag) {
		                    $(targetCell).trigger('mousemove');
		                }  
					});
					
					thisTable.cellTextArray[parseFloat(wordWrapper.attr("data-celly"))][parseFloat(wordWrapper.attr("data-cellx"))] = wordWrapper;	//원본
				}
			}
	
			for(var i=0; i< obj.selectAll('.xLine').length; i++){
				var xLine = obj.selectAll('.xLine')[i];
				var indexX = xLine.attr('data-x');
				var indexY = xLine.attr('data-y');
				var xLineId = 'xLine' + tableIndex + "_" +  indexY + "_" + indexX + "_" + thisTable.id;
				xLine.attr('id', xLineId);
				xLine.data('x', parseInt(xLine.attr("data-x")));
				xLine.data('y', parseInt(xLine.attr("data-y")));
				thisTable.xLineArray.push(xLine);
			}

			for(var i=0; i< obj.selectAll('.yLine').length; i++){
				var yLine = obj.selectAll('.yLine')[i];
				var indexX = yLine.attr('data-x');
				var indexY = yLine.attr('data-y');
				var yLineId = 'yLine' + tableIndex + "_" +  indexY + "_" + indexX + "_" + thisTable.id;
				yLine.attr('id', yLineId);					
				yLine.data('x',parseInt(yLine.attr("data-x")));
				yLine.data('y',parseInt(yLine.attr("data-y")));
				thisTable.yLineArray.push(yLine);
			}
			
			fnTableLineBinding(thisTable);
			fnTableCellBinding(thisTable);
			KTCE.currentPaper.tableArray.push(thisTable);
			
		}
		
		//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절 함수
		function fnInitializeTableStrokeWidth(obj, reAction, tInfo){
			var tableNode = $(obj.node);
			var lineAll = tableNode.find('line');
			var copyLineAll = lineAll.clone();
			lineAll.attr('data-stroke-width', 1).css('stroke-width', 1);
			
			if(reAction !=undefined) {
				if(reAction == 'ungroup') {
					fnSetFreeTransformTable(obj, reAction, tInfo);
					lineAll.remove();
					tableNode.append(copyLineAll);
					
					fnInitializeTable(obj);
				}else{
					fnInitializeTable(obj);
					fnSetFreeTransformTable(obj, reAction, tInfo);
					
					lineAll.remove();
					tableNode.append(copyLineAll);
					
					fnInitializeTable(obj);
				}
			}else{
				fnSetFreeTransformTable(obj);
				
				lineAll.remove();
				tableNode.append(copyLineAll);
				
				fnInitializeTable(obj);
			}
			
		}

		// 오브젝트를 받아 freeTransform을 적용시킴(table)
		function fnSetFreeTransformTable(obj, action, trans) {
			var fHandlerTableEvent = function(e) {
				
				//실시간 표내 텍스트 위치 반영
				if(e != null) fnUpdateTextPositionInFreeTransformTable(e);
				
				if(browserType.indexOf('msie') > -1 && e.attrs.ratio != 1){
					//IE 테두리 두께 유지
					setIEStrokeWidth(obj);
				}	
				
				//var ft = obj.freeTransform;
				//if(ft != null)	fnUpdateTextPositionInFreeTransformTable(ft);
				
			}
			var fHandler = Snap.freeTransform(obj, {
					draw: ['bbox','bboxCorners','bboxSides']
					, rotate: []
					, drag : ['center']
					, scale: ['bboxCorners', 'bboxSides']
					, distance: '1.4'
					, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height : KTCE.currentPaper.height
					}
					, objectId : obj.attr("id")
				}, fHandlerTableEvent);
			
			try{
				if($(obj.node).attr('data-lock') === 'lock') {
					fHandler.opts.attrs.stroke = 'red';
					fHandler.opts.attrs.cursor = 'no-drop';
					fHandler.opts.bboxAttrs.stroke = 'red';
					fHandler.opts.bboxAttrs.cursor = 'no-drop';
					fHandler.opts.bboxAttrs.strokeDasharray = '3, 3';
					//obj.freeTransform.opts.bboxAttrs.opacity = 0.8;
					fHandler.showHandles();
					fHandler.visibleHandles();
					fHandler.updateHandles();
					$(obj.node).css('cursor','no-drop');
					fHandler.opts.attrs.cursor = 'no-drop'; 
					
					if(KTCE.currentPaper.lockObjWrap != undefined) {
						var lockObject = KTCE.currentPaper.lockObjWrap.select('.' + obj.node.id);
						$(lockObject.node).on({
							mousedown: function(e){
								hideAllHandler();
								obj.data('hasHandle', true);
								obj.freeTransform.visibleHandles();
								//obj.freeTransform.updateHandles();
								KTCE.currentPaper.currentShape = obj;
								KTCE.currentPaper.selectedShapeArray[0] = obj;
							},
							mouseup: function(e) {
								obj.data('hasHandle', true);
								obj.freeTransform.visibleHandles();
								obj.freeTransform.updateHandles();
								KTCE.currentPaper.currentShape = obj;
								KTCE.currentPaper.selectedShapeArray[0] = obj;
							}
						});
						
					}
				}
			}catch(e){}
			
			KTCE.currentPaper.shapeArray.push(fHandler);

			fHandler.visibleNoneHandles();

			handlerBinding();


			if ( obj.hasClass('hasData') ) {
				//none data object
				var dataObj = KTCE.currentPaper.dataWrap.select('.'+obj.attr('id'));

				if(dataObj == null){
					var g = KTCE.currentPaper.dataWrap.g().attr({ class : obj.id });
					if(trans != undefined){
						g.text(-100000,-100000,trans.translate.x.toString()).attr({ class : 'translateX' });
						g.text(-100000,-100000,trans.translate.y.toString()).attr({ class : 'translateY' });
						g.text(-100000,-100000,trans.scale.x.toString()).attr({ class : 'scaleX' });
						g.text(-100000,-100000,trans.scale.y.toString()).attr({ class : 'scaleY' });
						g.text(-100000,-100000,trans.rotate.toString()).attr({ class : 'rotate' });
					} else {
						g.text(-100000,-100000,'0').attr({ class : 'translateX' });
						g.text(-100000,-100000,'0').attr({ class : 'translateY' });
						g.text(-100000,-100000,'1').attr({ class : 'scaleX' });
						g.text(-100000,-100000,'1').attr({ class : 'scaleY' });
						g.text(-100000,-100000,'0').attr({ class : 'rotate' });
					}
	

					g.children().forEach(function(el, i) {
						el.attr({
							display : 'none'
						});
					});
				} 
				
				
				if(obj.hasClass('textBoxWrap')){
					var newBBox = obj.getBBox( true );
					fHandler.attrs.x = newBBox.x;
					fHandler.attrs.y = newBBox.y;
					fHandler.attrs.center.x = newBBox.cx;
					fHandler.attrs.center.y = newBBox.cy;
					fHandler.attrs.size = {
						x: newBBox.w,
						y: newBBox.h
					};
				}

				var info = fnGetDataObject(obj, KTCE.currentPaper);
				
				fHandler.attrs.translate.x = info.translate.x;
				fHandler.attrs.translate.y = info.translate.y;
				fHandler.attrs.scale.x = info.scale.x;
				fHandler.attrs.scale.y = info.scale.y;
				fHandler.attrs.rotate = info.rotate;

				if(obj.hasClass('textBoxWrap')){
					fHandler.apply();
				} else {
					fHandler.updateHandles();
				}
				
			} else {
				// 정보 오브젝트 생성
				fnCreateDataObject(obj, fHandler, undefined, "table");
			}


			obj.freeTransform = fHandler;


			if(action == 'paste'){
				var x10 = parseFloat(obj.freeTransform.attrs.translate.x)+10; 
				var y10 = parseFloat(obj.freeTransform.attrs.translate.y)+10;
				obj.transform([
					'R' + obj.freeTransform.attrs.rotate
					, obj.freeTransform.attrs.center.x
					, obj.freeTransform.attrs.center.y
					, 'S' + obj.freeTransform.attrs.scale.x
					, obj.freeTransform.attrs.scale.y
					, obj.freeTransform.attrs.center.x
					, obj.freeTransform.attrs.center.y
					, 'T' + x10
					, y10
				].join(','));


				obj.freeTransform.attrs.translate.x	= x10;
				obj.freeTransform.attrs.translate.y	= y10;
				obj.freeTransform.updateHandles();

				// item.el : snap 객체
				// ft.attrs : transform 정보

				KTCE.updateData(obj, obj.freeTransform.attrs);
				fnUpdateTextPositionInTable(obj.freeTransform);
			}


		}

		// freeTransform handler 바인딩
		function handlerBinding(paper) {

			var objWrapChlidArray = undefined;
			if(paper == undefined){
				objWrapChlidArray = KTCE.currentPaper.objWrap.children()
			} else {
				objWrapChlidArray = paper.objWrap.children()
			}
			objWrapChlidArray.forEach(function(el, i){
				el.unmousedown(addMouseDownEvent);
				el.mousedown(addMouseDownEvent);
											
				el.unmouseup(addMouseUpEvent);
				el.mouseup(addMouseUpEvent);
				
			});
		}
					
		function addMouseUpEvent(e) {
			if(e.shiftKey){
				if($("#cropHandler_0").length > 0 ) {
					alert('이미지 자르기 Mode에서는 Multi 선택을 할 수 없습니다!!');
					return;
				}
				
				//표 멀티 선택시 표안 글자클릭시 table선택으로 handler활성화 유도
				obj = (this.hasClass('tableTextWrapper')) ? this.prev() : this;
				
				//그룹객체
				if(KTCE.currentPaper.selectedShapeArray != null && KTCE.currentPaper.selectedShapeArray != undefined && obj.attr('data-name') == 'objectGroupPath') {
					for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
						if(obj.attr('data-id') == KTCE.currentPaper.selectedShapeArray[i].node.id) { 
							obj = KTCE.currentPaper.selectedShapeArray[i];
							KTCE.currentPaper.currentShape = null;
							break;
						}else if(!KTCE.currentPaper.selectedShapeArray[i].hasClass('hasDataGroup')) {
							KTCE.currentPaper.currentShape = obj;
							if(obj.id == KTCE.currentPaper.selectedShapeArray[i].id) break;
						}
					}
				}
				
				//그룹객체
				if(obj.freeTransform === null || obj.freeTransform === undefined) return;
				
				if(obj.attr('data-name') =='xImage'){	//이미지는 같은 이미지에 대한 클릭에 핸들러 선택/해제 상태변화 적용안함.
					for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
						if(obj.id == KTCE.currentPaper.selectedShapeArray[i].id) break;
					}
					if(i == KTCE.currentPaper.selectedShapeArray.length){
						KTCE.currentPaper.selectedShapeArray.push(obj);
						obj.data('hasHandle', true);
						obj.freeTransform.visibleHandles();
					} else {
						KTCE.currentPaper.selectedShapeArray.splice(i, 1);
						obj.data('hasHandle', false);
						setTimeout(function(e){
							obj.freeTransform.visibleNoneHandles("multiple");
						}, 3);
					}
				}
				
				setTimeout(function(e){
					//그룹객체
					if(KTCE.currentPaper.selectedShapeArray.length == 1 && obj.attr('data-name') =='xImage'){
						$(".col10disabled").hide();
					}
					
					if(KTCE.currentPaper.selectedShapeArray.length > 1){
						iconBarDisabled();
						$(".col13Disabled").hide();
						$(".col15Disabled").hide();	//그룹서식
						//멀티선택에 따른 현재선택객체 비활성화
						KTCE.currentPaper.currentShape = null;
					}
					
					//TEXT 서식 활성화 여부, 텍스트 shift multi선택시 서식 활성화 여부판단
					textMultiSelectCheck();
					
				}, 5);
				
			}
		}
		
		function addMouseDownEvent(e){
			if(e.shiftKey){
				
				$("div.contextMenu").hide();
				
				if($("#cropHandler_0").length > 0 ) {
					//alert('이미지 자르기 Mode에서는 Multi 선택을 할 수 없습니다!!')
					return;
				}
				
				//표 멀티 선택시 표안 글자클릭시 table선택으로 handler활성화 유도
				obj = (this.hasClass('tableTextWrapper')) ? this.prev() : this;
				
				//그룹객체 선택시 obj or curretShape 객체를 objectGroupPath 영역이 아닌 objectGroup 실제 데이터로 지정
				if(KTCE.currentPaper.selectedShapeArray != null && KTCE.currentPaper.selectedShapeArray != undefined && obj.attr('data-name') == 'objectGroupPath') {
					for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
						if(obj.attr('data-id') == KTCE.currentPaper.selectedShapeArray[i].node.id) { 
							obj = KTCE.currentPaper.selectedShapeArray[i];
							KTCE.currentPaper.currentShape = null;
							break;
						}else if(!KTCE.currentPaper.selectedShapeArray[i].hasClass('hasDataGroup')) {
							KTCE.currentPaper.currentShape = obj;
							if(obj.id == KTCE.currentPaper.selectedShapeArray[i].id) break;
						}
					}
				}else if(KTCE.currentPaper.selectedShapeArray.length == 0 && KTCE.currentPaper.currentShape == null && obj.attr('data-name') == 'objectGroup') {
					setTimeout(function(){
						KTCE.currentPaper.currentShape = obj;
					}, 100)
				}
				
				//빈 textBox삭제 및 text-cursor 비활성화 처리
				if(KTCE.currentPaper.currentShape!=null && KTCE.currentPaper.selectedShapeArray.length == 1) {
					if(KTCE.currentPaper.currentShape.hasClass('textBoxWrap') && textEditMode){
						//text-cursor
						var textStr = KTCE.currentPaper.currentShape.node.textContent;
						textStr = textStr.replaceAll(" ", "");
						if(textStr.length==0){
							var _removeId = KTCE.currentPaper.currentShape.attr("id");
							KTCE.currentPaper.currentShape.freeTransform.hideHandles();
							KTCE.currentPaper.currentShape.remove();
							if(KTCE.currentPaper.dataWrap.select("." + _removeId) != null)
								KTCE.currentPaper.dataWrap.select("." + _removeId).remove();
							for ( var i in KTCE.currentPaper.shapeArray ) {
								if ( _removeId == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id")) {
									KTCE.currentPaper.shapeArray[i].unplug();
									KTCE.currentPaper.shapeArray.splice(i, 1);
								}
							}
							KTCE.currentPaper.selectedShapeArray = [];
							KTCE.currentPaper.currentShape = obj;
							textEditMode = false;
						}else if(KTCE.currentPaper.currentShape.hasClass('textBoxWrap')){
							clearTextMode(KTCE.currentPaper.currentShape);
							KTCE.currentPaper.currentShape = null;
						}
					}
				}
				
				//표 멀티 선택시 표안 글자클릭시 table선택으로 handler활성화 유도
				for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
					if(obj.id == KTCE.currentPaper.selectedShapeArray[i].id) break;
				}
				
				KTCE.currentPaper.currentShape = obj;
				
				if(obj.freeTransform === null || obj.freeTransform === undefined) return;
				
				if(obj.attr('data-name') !='xImage'){	//이미지는 같은 이미지에 대한 클릭에 핸들러 선택/해제 상태변화 적용안함.
					if(i == KTCE.currentPaper.selectedShapeArray.length){
						KTCE.currentPaper.currentShape = obj;
						KTCE.currentPaper.selectedShapeArray.push(obj);
						obj.data('hasHandle', true);
						obj.freeTransform.visibleHandles();
						e.stopPropagation();
			            e.preventDefault();
					} else {
						KTCE.currentPaper.selectedShapeArray.splice(i, 1);
						obj.data('hasHandle', false);
						obj.freeTransform.visibleNoneHandles("multiple");
					}
				}
				
				//multi 선택후 2개 선택된 상태에서 shift+객체 클릭시 현재선택 객체 지정
				if(KTCE.currentPaper.selectedShapeArray.length == 1){
					KTCE.currentPaper.currentShape = KTCE.currentPaper.selectedShapeArray[0];
				}else if(KTCE.currentPaper.selectedShapeArray.length == 0){
					KTCE.currentPaper.currentShape = null;
				}
				
				setTimeout(function(){
					if(KTCE.currentPaper.selectedShapeArray.length == 1 && KTCE.currentPaper.currentShape == null && obj.attr('data-name') == 'objectGroup') {
						KTCE.currentPaper.currentShape = obj;
					}
				}, 500)
				
				if(KTCE.currentPaper.selectedShapeArray.length > 1){
					iconBarDisabled();
					$(".col13Disabled").hide();
					$(".col15Disabled").hide();	//그룹서식
				}
				//TEXT 서식 활성화 여부, 텍스트 shift multi선택시 서식 활성화 여부판단
				textMultiSelectCheck();
			} else {
				try {
					var tempObj = (this.attr('data-name') == 'objectGroupPath') ? Snap($("#" + this.attr('data-id'))[0]) : this;
					if(tempObj.freeTransform.isLock(tempObj)){
						lockObjClicking = true;
					}else{
						lockObjClicking = false;
					}
					tempObj = null;
				}catch(e){lockObjClicking = false;}
				
				var obj = this.hasClass('textBoxWrap') ? this.select('.textBox') : this;
				obj = this;
				
				if(KTCE.currentPaper.selectedShapeArray != null && KTCE.currentPaper.selectedShapeArray != undefined && obj.attr('data-name') == 'objectGroupPath') {
					for(var i=0; i<KTCE.currentPaper.selectedShapeArray.length; i++){
						if(obj.attr('data-id') == KTCE.currentPaper.selectedShapeArray[i].node.id) { 
							obj = KTCE.currentPaper.selectedShapeArray[i];
							if(KTCE.currentPaper.selectedShapeArray.length > 1) {
								KTCE.currentPaper.currentShape = null;
							}
							break;
						}else if(!KTCE.currentPaper.selectedShapeArray[i].hasClass('hasDataGroup')) {
							KTCE.currentPaper.currentShape = obj;
							if(obj.id == KTCE.currentPaper.selectedShapeArray[i].id) break;
						}
					}
				}
				
				if ( obj.data('hasHandle') != true || KTCE.currentPaper.selectedShapeArray.length > 1) {
					if(obj.type == 'polygon' || obj.type == 'line' || obj.type == 'circle' || obj.type == 'path'){
						var strokeWidth = parseInt(obj.attr("strokeWidth").split("px")[0]);
						setShapeEffect(strokeWidth-1);
					}
					if(obj.freeTransform != undefined){
						for(var i=0; i < KTCE.paperArray.length; i++){
							KTCE.paperArray[i].objWrap.children().forEach(function(a, k) {
								 hideAllHandler();
							});
						}
						
						obj.data('hasHandle', true);
						if(obj.attr('data-name') == 'objectGroup') {
							if(KTCE.currentPaper.selectedShapeArray.length > 1) {
								obj.freeTransform.showHandles();
							}
							obj.freeTransform.visibleHandles();
							obj.freeTransform.updateHandles();
						}else{
							obj.freeTransform.visibleHandles();
						}
						KTCE.currentPaper.currentShape = obj;
						KTCE.currentPaper.selectedShapeArray.push(obj);
					}
				}
				
				//오른쪽 마우스 클릭
				if ( e.button == 2 ) {
					var pX = e.pageX + 10
						, pY = e.pageY + 10
					
					//contextMenu: 표시영역
					if(pY + layer.contextMenu.height() > $(document).height()){
						pY = e.pageY - layer.contextMenu.height();
					}
					$("div.opacitySliderRangeWrap").hide();
					
					//표 객체 회전모드 사용금지적용
					try {
						if(KTCE.currentPaper.currentShape != null) {
							if($(KTCE.currentPaper.currentShape.node).attr('data-name') == 'xTable') {
								layer.contextMenu.find('button.objectRotate').attr('disabled', true).css('opacity', 0.3);
							}else{
								layer.contextMenu.find('button.objectRotate').removeAttr('disabled style');
								//layer.contextMenu.find('button.objectRotate').removeAttr('style');
							}
							
							//contextMenu 잠금아이콘 적용
							var obj = KTCE.currentPaper.currentShape;
							var contextMenuLockElement = layer.contextMenu.find("button.objectLock>img");
							var contextMenuLockElementSrc = contextMenuLockElement.attr('src');
							if(obj.freeTransform.isLock(obj)){
								var tempArr = contextMenuLockElementSrc.split("_on");
								var newSrc = tempArr.join("_off");
								
								//contextMenu:잘라내기/삭제/복사/붙이기 사용잠금
								layer.contextMenu.find('button.objectCut').attr('disabled', true).css('opacity', 0.3);
								layer.contextMenu.find('button.objectDelete').attr('disabled', true).css('opacity', 0.3);
								layer.contextMenu.find('button.objectCopy').attr('disabled', true).css('opacity', 0.3);
								layer.contextMenu.find('button.objectPaste').attr('disabled', true).css('opacity', 0.3);
								//도구모음:잘라내기/삭제/복사/붙이기 사용잠금
								$('div.functions button.objectCut').attr('disabled', true).css('opacity', 0.3);
								$('div.functions button.objectDelete').attr('disabled', true).css('opacity', 0.3);
								$('div.functions button.objectCopy').attr('disabled', true).css('opacity', 0.3);
								$('div.functions button.objectPaste').attr('disabled', true).css('opacity', 0.3);
								
								//투명도/회전 사용잠금
								layer.contextMenu.find('button.objectOpacity').attr('disabled', true).css('opacity', 0.3);
								layer.contextMenu.find('button.objectRotate').attr('disabled', true).css('opacity', 0.3);
							}else{
								var tempArr = contextMenuLockElementSrc.split("_off");
								var newSrc = tempArr.join("_on");
								
								//contextMenu:잘라내기/삭제/복사/붙이기 잠금해제
								layer.contextMenu.find('button.objectCut').removeAttr('disabled style');
								layer.contextMenu.find('button.objectDelete').removeAttr('disabled style');
								layer.contextMenu.find('button.objectCopy').removeAttr('disabled style');
								layer.contextMenu.find('button.objectPaste').removeAttr('disabled style');
								//도구모음:잘라내기/삭제/복사/붙이기 잠금해제
								$('div.functions button.objectCut').removeAttr('disabled style');
								$('div.functions button.objectDelete').removeAttr('disabled style');
								$('div.functions button.objectCopy').removeAttr('disabled style');
								$('div.functions button.objectPaste').removeAttr('disabled style');
								
								//투명도/회전 사용잠금해제
								layer.contextMenu.find('button.objectOpacity').removeAttr('disabled style');
								layer.contextMenu.find('button.objectRotate').removeAttr('disabled style');
							}
							if(newSrc.length > 0) {
								contextMenuLockElement.attr('src', newSrc);
							}
						}
					}catch(e) {console.log(e)}
					
					layer.contextMenu.css({
						left : pX
						, top : pY
					}).show();
					
					if(KTCE.currentPaper.selectedShapeArray.length == 1) {
						KTCE.currentPaper.currentShape = KTCE.currentPaper.selectedShapeArray[0];
					}
					
				}else{
					layer.contextMenu.hide();
					layer.contextMenu.find('button.objectRotate').removeAttr('disabled style');
				}
			}
		}
		
		// freeTransform handler 감추기
		function hideAllHandler() {
			
			try{
				//if(KTCE.currentPaper.currentShape != null) {
					//if(KTCE.currentPaper.currentShape.freeTransform.isLock(KTCE.currentPaper.currentShape)) {
						//잘라내기/삭제/복사/붙이기 잠금해제
						$('button.objectCut').removeAttr('disabled style');
						$('button.objectDelete').removeAttr('disabled style');
						$('button.objectCopy').removeAttr('disabled style');
						$('button.objectPaste').removeAttr('disabled style');
						
						//투명도/회전 잠금해제
						$('button.objectOpacity').removeAttr('disabled style');
						$('button.objectRotate').removeAttr('disabled style');
						var contextMenuLockElement = $("div.contextMenu button.objectLock>img");
						var contextMenuLockElementSrc = contextMenuLockElement.attr('src');
						var tempArr = contextMenuLockElementSrc.split("_off");
						var newSrc = tempArr.join("_on");
						contextMenuLockElement.attr('src', newSrc);
					//}
				//}
			}catch(e){}
			
			//투명도/회전 셋팅창 숨김
			if($("div.contextMenuEditBoxWrap").css("display") != 'none' || $("div.contextMenuEditBoxWrap.rotate").css("display") == 'block') {
				$("div.contextMenuEditBoxWrap").hide();
			}
			$("div.contextMenuEditBoxWrap").hide();
			
			//입력mode 상태 false(delete 안되는 버그 수정)
			if(KTCE.inputFontSizeFocus) KTCE.inputFontSizeFocus = false;
			
			if(cropHandler != null) {
				cropHandler.hideHandles();
				cropHandler.updateHandles();
				cropHandler = null;
			}
		
			if(KTCE.currentPaper.selectedShapeArray !=undefined) {
				if(KTCE.currentPaper.selectedShapeArray.length>1 && selectMultiObjectFlag){
				}else{
					//cursor 숨기기
					$('g.text-cursor line').css('visibility', 'hidden');
					if(KTCE.currentPaper.currentShape != null){
						var cropHandler = addImageFunc.getCropHandler();
						if(cropHandler!=null){
							$("#" + KTCE.currentPaper.currentShape.node.id).trigger('click');
							cropHandler = null;
						}
					}
				}
			}
			
			for(var i=0; i<KTCE.paperArray.length; i++){
				KTCE.paperArray[i].objWrap.children().forEach(function(el, i) {
					if ( el.data('hasHandle') ) {										
						if(el.freeTransform === null ) return;				
						el.data('hasHandle', false);
						el.freeTransform.visibleNoneHandles();
						if(textEditMode){
							if(el.hasClass('textBoxWrap')) {
								clearTextMode(el);
								//textBox 생성 후 글자입력 여부에 따른 textBox는 보존/삭제처리
								var textBoxWrap = el.selectAll("g.textLine>text.textBox"); 
								var tempTextStr = "";
								$(textBoxWrap).each(function(idx, el) {
									tempTextStr += el.node.textContent;
								});
								tempTextStr = tempTextStr.replaceAll(" ", "");
								if(tempTextStr != ' ' && tempTextStr.length > 0) {
									fnSaveState();
								}else if(tempTextStr.length == 0){	//생성후 글자입력하질 않을 경우 삭제처리
									el.freeTransform.hideHandles();
									el.remove();
									if(KTCE.currentPaper.dataWrap.select("."+el.attr("id")) != null)
										KTCE.currentPaper.dataWrap.select("."+el.attr("id")).remove();
									for ( var i in KTCE.currentPaper.shapeArray ) {
										if ( el.attr("id") == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id")) {
											KTCE.currentPaper.shapeArray[i].unplug();
											KTCE.currentPaper.shapeArray.splice(i, 1);
										}
									}
									KTCE.currentPaper.currentShape = null;
								}
							}
						} else if(el.attr('data-name') == 'xTable'){
							//표내 텍스트입력값 save
							if(textCellEditMode) {
								fnSaveState();
							}
							clearTableInputMode(el);
						}
					}
				});
			}
			KTCE.currentPaper.currentShape = null;
		
			fnTableCellFillReset();
		
		}

		
		/******************************************************************************/
		/* Section: 찜 기능
		/******************************************************************************/

		// 찜목록
		function fnFavoriteObject() {
			var totalPage = 0;
			var currentPage = 1;
			var wrap = $('.favoriteLayer')
				, trigger = wrap.children('.trigger')
				, page = wrap.find('.page')
				, currentFav = {}
				, favArray = []
				, favSelTrigger = wrap.find('.favSelTrigger')
				, favList = wrap.find('.favList')
				, allFavList = wrap.find('.allFavList')
				, myFavList = wrap.find('.myFavList')


			wrap.transition({
							x : 0
						}, 300);
			
			//초기 화면생성시 찜목록 OPEN 상태로..
			trigger.addClass('active');

			pageScrollInit();
			
			selectAllFavList();
			FavListScrollInit();

			// 레이어 열고 닫기
			trigger.on({
				click : function() {
					if ( $(this).hasClass('active') ) {
						wrap.transition({
							x : 300
						}, 300);
						$(this).removeClass('active');
					} else {
						wrap.transition({
							x : 0
						}, 300);
						$(this).addClass('active');
					}
				}
			});
			//초기 화면생성시 찜목록 CLOSE 상태로..
			trigger.trigger("click");

			// 목록 선택(MY 전단지)
			favSelTrigger.each(function(i) {
				$(this).on({
					click : function() {
						if ( i == 0 ) {
							myFavList.hide();
							allFavList.show();
							
							favArray = [];
							totalPage = 0;
							currentPage = 1;
							selectAllFavList();
							FavListScrollInit();
							
						} else {
							myFavList.show();
							allFavList.hide();
							
							favArray = [];
							totalPage = 0;
							currentPage = 1;
							selectMyFlyerList();				
							
							$('.favoriteLayer .myFavList .scroller').mCustomScrollbar({
								theme : 'dark'
								, scrollInertia : 300
								, callbacks:{
									onTotalScroll:function(){
										if(totalPage > currentPage){
											currentPage++;
											selectMyFlyerList();
										}
									}
								}
							});
						}

						favSelTrigger.removeClass('active');
						$(this).addClass('active');
					}
				});
			});

			// 찜목록 조회
			function selectAllFavList(){
				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					data: {
						pageFlag : 'AF_INTRST_LIST'
						, page : currentPage
					},
					success:function(data){
						if ( data.result == 'success' ) {
							var listHTML = '';
							if ( data.intrstList.length ) {
								$.each(data.intrstList, function(i, val) {
									var back = val.backThumb ? '<div class="bArea"><img src="' + val.backThumb + '" alt=""></div>' : '';
									listHTML += '<a href="#" class="item '
												+ (val.canvasType == '' ? 'HD' : val.canvasType)
												+ '" data-flyerid="' 
												+ val.flyerId 
												+ '" data-flyername="' 
												+ val.flyerName 
												+ '" data-canvassize="' 
												+ val.canvasSize 
												+ '" data-canvastype="' 
												+ val.canvasType + '">'
												+ '<div class="tArea"><img src="' + val.frontThumb + '" alt=""></div>'
												+ back
												+'</a>\n';

									favArray.push(val);
								});
								
								if(totalPage == 0){
									allFavList.find('.inner').html(listHTML);
								} else {
									allFavList.find('.inner').append(listHTML);
								}

								allFavList.find('.item').each(function(i) {
									var _this = $(this);
									_this.on({
										click : function() {
											currentFav = favArray[i];
											if(currentFav != undefined){
												page2Fn();
											} else {
												alert('이미지 로딩중입니다.\n\n잠시 기다려주세요');
											}
										}
									});
								});
								
								totalPage = Number(data.totalPage);
							} else {
								allFavList.find('.scroller').hide();
								allFavList.find('.noData').show();

								allFavList.find('.noData button').on({
									click : function() {
										if ( confirm('페이지를 벗어나면 현재 저장된 정보를 잃게 됩니다. \n\n진행하시겠습니까?') ) {
											window.opener.location.href='/Fwl/Flyer.do';
											window.close();
										}
									}
								});
							}
						} else {
							alert('데이터를 불러오지 못했습니다. 관리자에게 문의해 주세요.');
						}
					}
					, error : function(e) {
						alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
					}
				});
			}

			// 마이전단지 조회
			function selectMyFlyerList(){
				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					data: {
						pageFlag : 'AF_MY_LIST'
						, page : currentPage
					},
					success:function(data){

						if ( data.result == 'success' ) {

							var listHTML = '';

							if ( data.myFlyerList.length ) {
							
								$.each(data.myFlyerList, function(i, val) {

									var back = val.backThumb ? '<div class="bArea"><img src="' + val.backThumb + '" alt=""></div>' : '';

									listHTML += '<a href="#" class="item '
												+ (val.canvasType == '' ? 'HD' : val.canvasType)
												+ '" data-flyerid="' 
												+ val.flyerId 
												+ '" data-flyername="' 
												+ val.flyerName 
												+ '" data-canvassize="' 
												+ val.canvasSize 
												+ '" data-canvastype="' 
												+ val.canvasType + '">'
												+ '<div class="tArea"><img src="' + val.frontThumb + '" alt=""></div>'
												+ back
												+'</a>\n';

									favArray.push(val);
								});

								if(totalPage == 0){
									myFavList.find('.inner').html(listHTML);
								} else{
									myFavList.find('.inner').append(listHTML);	
								}
																
								myFavList.find('.item').each(function(i) {
									var _this = $(this);

									_this.on({
										click : function() {
											currentFav = favArray[i];
											if(currentFav != undefined){
												page2Fn();
											} else {
												alert('이미지 로딩중입니다.\n\n잠시 기다려주세요');
											}
										}
									});
								});
								
								totalPage = Number(data.totalPage);
											
							} else {
								if(favArray.length == 0){
									myFavList.find('.scroller').hide();
									myFavList.find('.noData').show();	
								}
							}
						} else {
							alert('데이터를 불러오지 못했습니다. 관리자에게 문의해 주세요.');
						}
					}
					, error : function(e) {
						alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
					}
				});
			}

			// 리스트 스크롤 활성화
			function FavListScrollInit() {
				$('.favoriteLayer .allFavList .scroller').mCustomScrollbar({
					theme : 'dark'
					, scrollInertia : 300
					, callbacks:{
						onTotalScroll:function(){
							if(totalPage > currentPage){
								currentPage++;
								selectAllFavList();
							}
						}
					}
				});
			}
			
			function pageScrollInit() {
				$('.favoriteLayer .page2 .scroller').mCustomScrollbar({
					theme : 'dark'
					, scrollInertia : 300
				});
				$('.favoriteLayer .page3 .scroller').mCustomScrollbar({
					theme : 'dark'
					, scrollInertia : 300
				});
			}

			// 리스트에서 전단지 선택
			function selectFlyerFromList() {
				favList.find('.item a').each(function(i) {
					$(this).on({
						click : function() {
							currentFav = favArray[i];
							page2Fn();
						}
					});
				});

			}

			// page2
			function page2Fn() {

				page.eq(0).hide();
				page.eq(1).show();

				page.eq(1).find('.tit').html(currentFav.flyerName);

				page.eq(1).find('.front').html('<img src="' + currentFav.frontThumb + '" alt="">');

				if ( currentFav.backThumb ) {
					page.eq(1).find('.back').html('<img src="' + currentFav.backThumb + '" alt="">');
					page.eq(1).find('.back').show();
				} else {
					page.eq(1).find('.back').html('');
					page.eq(1).find('.back').hide();
				}

				page.eq(1).find('.inner').find('a').each(function(i) {
					$(this).on({
						click : function() {
							currentFav.pageNum = '' + (i+1);
							page3Fn();
						}
					});
				});
			}
			
			//201804 그룹객체 적용
			// page3
			function page3Fn() {

				page.eq(1).hide();
				page.eq(2).show();

				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					data: {
						pageFlag : 'AF_DETAIL'
						, flyerId : currentFav.flyerId
						, contentPage : currentFav.pageNum
					},
					success:function(data){
						var cont = $('<div></div>').html(data.flyerContents[0].content)
							, objGroup = null
							, objData = null
							, childData = undefined
						cont.find('g').each(function() {
							if ( $(this).attr('class') == 'objectGroup' ) {
								objGroup = $(this)
							}
							if ( $(this).attr('class') == 'dataGroup' ) {
								objData = $(this);
							}
						});

						var child = objGroup.children();
						if(objData != undefined || objData != null){
							var childData = objData.children();
						}

						var defs = cont.find('defs');//.clone(true);

						page.eq(2).find('.inner').html('');
						
						var tempChild = [];
						for(var i = 0; i<child.length; i++){
							var _this = $(child[i]);
							if(_this.attr("data-name")==='objectGroup'){
								var objArray = _this.find('.hasData:not(.hasDataGroup)');
								objArray.each(function(idx, el){
									if($(el).attr('data-name') === 'xTable') {
										tempChild.push(el);
										var tableId = $(el).attr('id');
										//var _tableTextWrapper = _this.find("#" + tableId).next();
										var _tableTextWrapper = _this.find("g.xTableTexts_" + tableId);
										tempChild.push(_tableTextWrapper[0]);
									}else{
										tempChild.push(el);
									}
								})
							}else{
								tempChild.push(child[i]);
							}
						}
						child = tempChild;
						for(var i = 0; i<child.length; i++){
							var _this = $(child[i]);
							
							if(_this.attr("class").indexOf("tableTextWrapper") < 0){
								var icons = "image";
								icons = _this[0].tagName;
								if(icons == 'g'){
									if(_this.attr('class').indexOf('xTable') > -1) icons = 'table'
									else if(_this.attr('class').indexOf('textBoxWrap') > -1) icons = 'text'
									else if(_this.attr('data-name') == 'xImage') icons = 'image'
								} else if(icons == 'image'){
									icons = _this[0].tagName;
								} else {
									icons = 'shape';
								}
								var item = $('<a href="#" class="item '+icons+' '+data.flyerInfo.canvasType+'"><div class="hover"></div></a>')
									, width = getPaperSize(800, data.flyerInfo.canvasType, data.flyerInfo.canvasSize).width
									, height = getPaperSize(800, data.flyerInfo.canvasType, data.flyerInfo.canvasSize).height
									, width2 = getPaperSize(253, data.flyerInfo.canvasType, data.flyerInfo.canvasSize).width
									, height2 = getPaperSize(253, data.flyerInfo.canvasType, data.flyerInfo.canvasSize).height;

								var svgId = "myFlyerList" + i;
								var	svgObj = $('<svg id=' + svgId + ' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+width+'" height="' + height + '" viewBox="0 0 ' + width + ' ' + height +'"><desc></desc><defs></defs><g class="objOuter"><g class="objectGroup"></g></g></svg>').appendTo(item);

								if(data.flyerInfo.canvasType == "HD"){
									svgObj.css("transform" , "scale(0.316, 0.316) translate(-108%, -108%)")
								} else if(data.flyerInfo.canvasType == "WD"){
									svgObj.css("transform" , "scale(0.223, 0.223) translate(-174%, -175%)")
								}

								//defs.appendTo(svgObj);
								try{
									var _fillValue = _this.attr('fill');
									var _filterValue = _this.attr('filter');
									var _fillId = _filterId = null;
									var _fill = _filter = null;
									var _dataFillId = _this.attr('data-fill-id');
									var _dataFilterId = _this.attr('data-filter-id');

									if(_dataFillId != undefined) {
										_fillId = _this.attr('data-fill-id');
										_fill = defs.find("#" + _fillId);
									}else if(_fillValue != undefined && _fillValue.indexOf('url') == 0) {
										_fillId = _fillValue.split("#")[1].split(")")[0];
										_fill = defs.find("#" + _fillId);
									}

									if(_dataFilterId != undefined) {
										_filterId = _this.attr('data-filter-id');
										_filter = defs.find("#" + _filterId);
									}else if(_filterValue != undefined && _filterValue.indexOf('url') == 0) {
										_filterId = _filterValue.split("#")[1].split(")")[0];
										_filter = defs.find("#" + _filterId);
									}


									if(_fillId !=null || _filterId !=null ){
									//	svgObj.append("<defs></defs>");
									}
									if(_fill !=null ) {
										svgObj.find('defs').append(_fill)
									}
									if(_filter !=null ) {
										svgObj.find('defs').append(_filter);
									}

								}catch(err){console.log('err', err)}

								$(item).find('.objectGroup').append(_this);
								
								
								//찜목록 ie대응
								//if(objData != null && objData.find("." + _this[0].id)){		//chrome만 대응됨
								if(objData != null && _this.attr('data-name') == 'objectGroup') {
									var temp = $("<transData></transData>");
									$(item).find('.objectGroup>.hasDataGroup .hasData:not(.hasDataGroup)').each(function(_idx, _el){
										temp.append(childData.filter("." + $(_el).attr('id')));
									});
									svgObj.append(temp);
								}else if(objData != null && childData.filter("." + _this[0].id).length > 0){
									var temp = $("<transData></transData>");
									//temp.append(objData.find("." + _this[0].id));	//chrome만 대응됨
									temp.append(childData.filter("." + _this[0].id));
									svgObj.append(temp);
								}
								
								svgObj.prependTo(item);
								item.appendTo(page.eq(2).find('.inner'));
								
								fnParseEffect($('#mCSB_2_container .inner .item > svg#myFlyerList' + i), i, outerHTMLCheck(svgObj[0]));

							} else {	//표안 텍스트
								
								for(var j=0; j<page.eq(2).find('.inner').find("a").length; j++){
									var targetPage = page.eq(2).find('.inner').find("a")[j];
									if( _this.attr("class").indexOf("xTableTexts_" + $(targetPage).find("svg").find("g")[0].id) > -1 ){
										//_this.appendTo($(targetPage).find("svg"));
										_this.appendTo($(targetPage).find("svg .objectGroup"));
									}
								}
								
								var cellTextWrapper = _this.children();
								$(cellTextWrapper).each(function(idx, el) {
									try{
										var _fillValue = $(el).attr('fill');
										var _filterValue = $(el).attr('filter');
										var _fillId = _filterId = null;
										var _fill = _filter = null;
										var _dataFillId = $(el).attr('data-fill-id');
										var _dataFilterId = $(el).attr('data-filter-id');
										if(_dataFillId != undefined) {
											_fillId = $(el).attr('data-fill-id');
											_fill = defs.find("#" + _fillId);
										}else if(_fillValue != undefined && _fillValue.indexOf('url') == 0) {
											_fillId = _fillValue.split("#")[1].split(")")[0];
											_fill = defs.find("#" + _fillId);
										}

										if(_dataFilterId != undefined) {
											_filterId = $(el).attr('data-filter-id');
											_filter = defs.find("#" + _filterId);
										}else if(_filterValue != undefined && _filterValue.indexOf('url') == 0) {
											_filterId = _filterValue.split("#")[1].split(")")[0];
											_filter = defs.find("#" + _filterId);
										}

										if(_fillId !=null || _filterId !=null ){
										//	svgObj.append("<defs></defs>");
										}
										if(_fill !=null ) {
											$(targetPage).find('defs').append(_fill)
										}
										if(_filter !=null ) {
											$(targetPage).find('defs').append(_filter);
										}

									}catch(err){console.log('err', err)}

									//$(targetPage).find('.objectGroup').append(_this);
								});
								
								fnParseEffect($('#mCSB_2_container .inner .item > svg#myFlyerList' + (i-1)), i, outerHTMLCheck($(targetPage).find("svg")[0]));
							}
						}
						
						cont.remove();
						page3Binding();
						
					},
					beforeSend:function() {
						console.log('beforeSend!!')
						var _loading = '<div style="width:100%;height:inherit;text-align: center;line-height:30;"><img src="/flyerEditor/images/common/loading.gif" alt="" width="70"></div>';
						page.eq(2).find('.inner').html(_loading);

					},
					complete : function() {
						console.log('complete')
					},
					error:function(){
						alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
					}
				});

				page.eq(2).find('.scroller').mCustomScrollbar({
					theme : 'dark'
					, scrollInertia : 300
				});
			}
			
			function page3Binding() {
				page.eq(2).find('.item').each(function(idx, itemNode) {
					$(this).on({
						click : function() {	//My전단지 canvas적용
							var _elem = $(this).clone()
								_elem.find('.hover').remove();
								_elemHTML = _elem.html();
							var _this = this;
							var _elemHTMLID = $(_elemHTML).attr('id');
							var randId = undefined;
							var targetStr = null;
							if ($(_elemHTML)[0].innerHTML) {
								targetStr = $("#" + _elemHTMLID + " .objectGroup")[0].innerHTML;
							} else if (XMLSerializer) {
								targetStr = new XMLSerializer().serializeToString($("#" + _elemHTMLID + " .objectGroup")[0].childNodes[0]);
							}
							
							if($(targetStr).attr('data-name') =='objectGroup') {
								var targetObj = $("#" + _elemHTMLID + " .objectGroup>*").clone();
								var targetTrans = $("#" + _elemHTMLID + " transdata>*").clone();
								
								$(KTCE.currentPaper.objWrap.node).append(targetObj);
								var tempGroupObjId = $(targetObj).attr('id');
								if(tempGroupObjId != "" && tempGroupObjId != undefined && tempGroupObjId != null){
									var dtNow = new Date();
									randGroupId = "reuse" + dtNow.getTime()
									$(targetObj).attr('id',randGroupId);
								} 
								
								$(KTCE.currentPaper.dataWrap.node).append(targetTrans);
								
								var targetObjArr = $("#" + randGroupId + " .hasData:not(.hasDataGroup)");
								targetObjArr.each(function(idx, _el){
									var tempObj = Snap($(_el)[0]);
									if ($(_el)[0].innerHTML) {
										targetStr = $(_el)[0].innerHTML;
									} else if (XMLSerializer) {
										targetStr = new XMLSerializer().serializeToString(this);
									}
									var tempId = $(_el).attr('id');
									if(tempId != "" && tempId != undefined && tempId != null){
										var dtNow = new Date();
										randId = "reuse" + dtNow.getTime();
									} else {
										var dtNow = new Date();
										randId = "reuse" + dtNow.getTime();
									}
									$(_el).attr('id', randId);
									KTCE.currentPaper.dataWrap.select("." + tempId).attr('class', randId);
									loadEffect(_this, targetObj, tempObj);
									var transInfo = undefined;
									if(targetTrans != undefined){
										var _transText = targetTrans.filter("." + randId);
										transInfo = {
											translate : {
												x : parseFloat( _transText.find("text.translateX").text())
												, y : parseFloat( _transText.find("text.translateY").text())
											}
											, scale : {
												x : parseFloat( _transText.find("text.scaleX").text())
												, y : parseFloat( _transText.find("text.scaleY").text())
											}
											, rotate : parseFloat(_transText.find("text.rotate").text())
										}
									}
									
									switch($(_el).attr('class')) {
										case 'xTable hasData' :
											tempObj.attr("data-id", "xTable" + KTCE.currentPaper.tableArray.length)
											var tableTextWrapper= $("#" + randGroupId + " .xTableTexts_" + tempId).attr('class', 'tableTextWrapper xTableTexts_' + randId);
											if(tableTextWrapper.attr('class').indexOf("tableTextWrapper") > -1) {
												tableTextWrapper.find('g.cellTextWrapper').each(function(idx, el){
													var cellTextWrapper = $("g.xTableTexts_" + randId + " g.cellTextWrapper:eq(" + idx + ")");
													loadEffect(_this, cellTextWrapper, Snap($(el)[0]));
												})
											}
											//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
											fnInitializeTableStrokeWidth(tempObj, 'reuse', transInfo);
											
											break;
										default:
											fnSetFreeTransform(tempObj, 'reuse', transInfo);
									}

								});
								
							}else{
								//기존
								var targetObj = $("#" + _elemHTMLID + " .objectGroup>*");
								var targetTrans = $("#" + _elemHTMLID + " transdata");
								var tempId = $("#" + _elemHTMLID + " .objectGroup>*")[0].id;
								if(tempId != "" && tempId != undefined && tempId != null){
									var dtNow = new Date();
									randId = "reuse" + dtNow.getTime()
									targetStr = targetStr.replace(tempId, randId);
								} else {
									var dtNow = new Date();
									randId = "reuse" + dtNow.getTime()
									var targetName = $(targetStr)[0].tagName.toUpperCase();
									targetStr = targetStr.replace("<"+targetName.toLowerCase(), "<"+targetName.toLowerCase() + " id=\"" + randId + "\"");
								}
								var reuseObjStr = targetStr.split("<translate>")[0];
								var tempCache = Snap.parse(reuseObjStr)
									, tempG = KTCE.currentPaper.objWrap.g().append(tempCache)
								var tempObj = tempG.children()[0];
								if(tempObj.id != undefined) {
									tempObj.id = randId;
								}
								tempObj.insertBefore(tempG);
								tempG.remove();
								
								$(tempObj.node).removeAttr('data-lock');
								
								loadEffect(_this, targetObj, tempObj);
								
								var transInfo = undefined;
								if(targetTrans != undefined){
									transInfo = {
										translate : {
											x : parseFloat($(targetTrans).find(".translateX").text())
											, y : parseFloat($(targetTrans).find(".translateY").text())
										}
										, scale : {
											x : parseFloat($(targetTrans).find(".scaleX").text())
											, y : parseFloat($(targetTrans).find(".scaleY").text())
										}
										, rotate : parseFloat($(targetTrans).find(".rotate").text())
									}
								}

								switch(tempObj.attr('class')) {
									case 'xTable hasData' :
										tempObj.attr("data-id", "xTable" +KTCE.currentPaper.tableArray.length)
										var tableTextStr = new XMLSerializer().serializeToString($("#" + _elemHTMLID + " .objectGroup")[0].childNodes[1]);
										if($(tableTextStr)[0] != undefined){
											var tempCache = Snap.parse($(tableTextStr)[0].innerHTML)
											, tableTextWrapper = KTCE.currentPaper.objWrap.g().append(tempCache)
											tableTextWrapper.attr('class', 'tableTextWrapper xTableTexts_' + randId);
											if(tableTextWrapper.attr('class').indexOf("tableTextWrapper") > -1) {
												tableTextWrapper.selectAll('g.cellTextWrapper').forEach(function(el, idx){
													var cellTextWrapper = $("g.xTableTexts_" + randId + " g.cellTextWrapper:eq(" + idx + ")");
													loadEffect(_this, cellTextWrapper, $(el)[0]);
												})
											}
										}
										
										//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
										fnInitializeTableStrokeWidth(tempObj, 'reuse', transInfo);
										
										break;
									default:
										fnSetFreeTransform(tempObj, 'reuse', transInfo);
								}
							}
							
							setTimeout(function() {
								fnSaveState();
							}, 1);
							
							function loadEffect(_this, targetObj, tempObj) {
								var thisFilter = $(targetObj).attr('filter');
								if(thisFilter != undefined && tempObj.hasClass('textBoxWrap') || thisFilter != undefined && $(tempObj.node).attr('class').indexOf("cellTextWrapper") > -1) {
									fnTextShadow($(KTCE.currentPaper.s.node), tempObj, true);
								}else if(thisFilter != undefined && !tempObj.hasClass('textBoxWrap')) {
									var _filterId = $(_this).find('filter').attr('id');
									if($("#" + _filterId).find('feGaussianBlur').length < 1) return;
									
									var shadowWidth = parseFloat($(_this).find('defs').find('feGaussianBlur')[0].getAttribute('stdDeviation'));
									if(document.getElementById(_filterId).childNodes.length > 1) {
										fnShapeShadow($(KTCE.currentPaper.s.node), Snap(tempObj.node), shadowWidth);
									}else{
										fnShapeBlur($(KTCE.currentPaper.s.node), Snap(tempObj.node), shadowWidth);
									}
								}else{
								}
								
								var thisFill = $(tempObj.node).attr('fill');
								if(thisFill != undefined && thisFill.indexOf("url") > -1){
									thisFill = thisFill.replaceAll('"', '');
									var fillId = thisFill.substring(thisFill.indexOf('#'), thisFill.lastIndexOf(')'));
									var _newFillGradient = _elem.find(fillId).clone();
									var _len2 = $(KTCE.currentPaper.s.node).find(">defs:eq(0)>*").length;
									var _newFillId = _newFillGradient.attr("id") + _len2;
										_newFillGradient.attr("id", _newFillId);
										
									$(KTCE.currentPaper.s.node).find("#" + $(tempObj.node).attr("data-fill-id")).remove();
									$(KTCE.currentPaper.s.node).find(">defs:eq(0)").append(_newFillGradient);
									$(tempObj.node).attr('fill', thisFill);
									$(tempObj.node).attr("fill", "url(#" + _newFillId + ")");
									$(tempObj.node).attr("data-fill-id", _newFillId);
								} else if(thisFill == undefined) {	//배경 미지정시
									$(tempObj.node).removeAttr("fill");
									$(tempObj.node).removeAttr("data-fill-id");
									$("defs:eq(0)>#" + $(tempObj.node).attr("data-fill-id")).remove();
								}else if(thisFill.indexOf('url') == -1) {	//단색배경시 그라데이션 삭제
									$(tempObj.node).removeAttr("data-fill-id");
									$("defs>#" + $(tempObj.node).attr("data-fill-id")).remove();
								}else{

								}
							}
						}
					});
				});
			}
			
			page.eq(1).find('.prev').on({
				click : function() {
					page.eq(1).hide();
					page.eq(0).show();
				}
			});

			page.eq(2).find('.prev').on({
				click : function() {
					page.eq(2).hide();
					page.eq(1).show();
					page.eq(2).find('.inner').html('');
					page2Fn();
				}
			});
		}

		/******************************************************************************/
		/* Section: 배경 및 이미지 / 수정: 배경 썸네일 이미지 
		/******************************************************************************/

		// 배경 브라우저 기능
		function fnBgBrowser() {
			var currentSrc = '';
			var useBtn = $("#addBgtoCanvas");
			var currentPage = 1;
			var totalPage = 1;
			var callImageListState = true;
			var viewImg = null;
			
			$('#addBg').on({
				click : function() {
					
					hideAllHandler();
					
					$('.dimmLayer').fadeIn(150);
					$('.bgBrowser').fadeIn(200, function() {
						$('div.bgBrowser div.imageList').mCustomScrollbar({
							theme : 'dark'
							, scrollInertia : 200
//							, mouseWheel : {scrollAmount : 200}
							, callbacks:{
								onTotalScroll:function(){
									if(totalPage > currentPage){
										currentPage++;
										//이미지 리스트조회
										if(callImageListState) {
											callImageListState = false;
											callImageList(false, function(count) {setting(count);}, currentPage);
										}
									}
								}
							}
						});
					});
					
					if(viewImg == null) {
						callImageList(true, function(count) {setting(count)},currentPage);
					}
					
					itemBind();
					
					return false
				}
			});

			$('.bgBrowser .closer').on({
				click : function() {
					$('.dimmLayer').fadeOut(200);
					$('.bgBrowser').fadeOut(150);
				}
			});
			
			// 배경 이미지 ajax call
			function callImageList(viewFlag, callback, page) {
				
				currentPage = page
				var count = 0;
				var totalPageNo = 1;

				// 배경 이미지 목록 ajax call
				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					//aysnc:false,
					cache:true,
					data: {
						pageFlag : 'AF_BG_LIST'
						, canvasSize : KTCE.paperInfo.canvasSize
						, canvasType : KTCE.paperInfo.canvasType
						, page : currentPage
					},
					success:function(data){
						/*그림 썸네일 이미지*/
						//var thumbImg = $('div.bgBrowser div.imageList div.outer').find('a.item').first().find('img');
						if(page == 1)$('div.imageBrowser div.imageList div.outer').mCustomScrollbar('scrollTo','top');
						if(data.paramMap != undefined && data.bgList != undefined){
							var listHTML = '';
							//var count = 0;
							totalPage = Number(data.paramMap.totalPage);
							totalPageNo = Math.ceil(totalPage/45);
							
							$.each(data.bgList, function(i, val) {
								if(val.thumbImgUrl == ''){
									listHTML += '<a href="#" class="item"><img src="' + val.imgUrl + '" data-bgid="' + val.bgId + '" data-canvassize="' + val.canvasSize 
									+ '" data-canvastype="' + val.canvasType + '" alt="' + val.bgName + '" data-regDate="' + val.regDate + '"></a>';
								}else{
									listHTML += '<a href="#" class="item"><img src="' + val.thumbImgUrl + '" data-bgid="' + val.bgId + '" data-canvassize="' + val.canvasSize 
									+ '" data-canvastype="' + val.canvasType + '" alt="' + val.bgName + '" data-regDate="' + val.regDate + '" data-src="' + val.imgUrl +'" data-id="thumbBG"></a>';
								}
								count++;
							});
							
							if(page > 1){
								$('div.bgBrowser div.imageList div.outer').append(listHTML);
							}else{
								$('div.bgBrowser div.imageList div.outer').html(listHTML);
							}
							
							
							if(viewFlag && currentPage == 1) {
								var thumbImg = $('div.bgBrowser div.imageList div.outer').find('a.item').first().find('img');
								
								var bgIdType = thumbImg.attr('data-id')
								,alt = thumbImg.attr('alt');
								
								$('div.bgBrowser div.topWrap p.tit').text(KTCE.paperInfo.canvasSize+" 사이즈 배경");
								$('div.bgBrowser div.imageList div.outer').find('.item').first().addClass('active');
								$('div.bgBrowser div.imageView p.descTit').html(alt);
								$('div.bgBrowser div.imageView p.date').html(thumbImg.attr('data-regDate'));
								
								var _img = $('div.bgBrowser .imageList .outer').find('.item').first().find('img');
								currentSrc = (bgIdType == 'thumbBG') ? thumbImg.attr('data-src') : thumbImg.attr('src');
								viewImg = $('div.bgBrowser div.imageView div.viewCont img');
								imageOnload(currentSrc, viewImg, alt, useBtn);
							}
							//
							
							if ( callback != undefined && typeof callback == 'function' ) callback(count);
						} else {
							$('div.bgBrowser div.imageList div.outer').html('');
						}
						
					},
					beforeSend:function() {
						
						if(currentPage > 1) {
						//if(currentPage > 1 && !searchFlag) {
						}else{
							$('div.bgBrowser div.imageView div.viewCont img').attr({'src': '', 'alt': 'loading...'});
						}
					},
					complete : function() {
						console.log('complete');
						callImageListState = true;

						//if(count>currentPage && !searchFlag) {
						if(totalPageNo>currentPage && totalPageNo > 1) {
						}
					},
					error:function(){
						alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
						callImageListState = true;
					}
				});
			}
			
			function setting(count){
				if ( count > 0 ) {
					itemBind();
				} else {
					$('.imageBrowser .imageList .inner').html('<p class="noData">검색결과가 없습니다.</p>');
				}
			}

			function itemBind() {
				$('.bgBrowser .imageList .item').each(function() {
					$(this).on({
						click : function() {
							var thumbImg = $(this).find('img');
							var alt = thumbImg.attr('alt')
							, bgIdType = thumbImg.attr('data-id')
							, date = thumbImg.attr('data-regDate')
							, src;
							
							$('div.bgBrowser div.imageList a.item').removeClass('active');
							$(this).addClass('active');
							
							viewImg = $('div.bgBrowser div.imageView div.viewCont img');
							currentSrc = (bgIdType == 'thumbBG') ? thumbImg.attr('data-src') : thumbImg.attr('src');
							
							imageOnload(currentSrc, viewImg, alt, useBtn);
							
							$('.bgBrowser .imageView .descTit').html(alt);
							$('.bgBrowser .imageView .date').html(date);
							
							return false;
						}
					});
				});
			}
			
			function imageOnload (src, viewImg, alt, useBtn) {
				if(useBtn != undefined) {
					useBtn.hide();
				}
				viewImg.attr({"src": "/flyerEditor/images/common/loading.gif", "alt":"loading", "width":"50px", "height":"50px"});
				
				var img = new Image();
				img.crossOrigin = 'Anonymous';
				img.onload = function(){
					viewImg.hide();
					viewImg.attr({"src": ""});
					var _width = this.width;
					var _height = this.height;
					viewImg.attr({"src": this.src, "alt": alt});
					//if(KTCE.paperInfo.canvasType=='HD') {
					if(_width >= _height) {
						viewImg.attr({width:"auto", height:"100%"});
					}else{
						viewImg.attr({"width":"100%", "height":"auto"});
					}
					viewImg.show();
					//viewImg.fadeIn();
					if(useBtn != undefined) {
						useBtn.show();
					}
				}
				img.src = src;
			}

			$('#addBgtoCanvas').on({
				click : function() {
					addBgImageListener(currentSrc, KTCE.currentPaper.s.node.id.split("paper")[1])
					setTimeout(function() {
						fnSaveState();
					}, 1);

				}
			});
		}

		var bgImageArray = [];
		//batik lib에서 배경이미지 xlink:href 지정오류에(undefined 등)에 따른 저장에러 발생방지를 위해
		function addBgImageListener(src, pageNo){
			if(src === undefined || src === null || src === '') return;
			bgImageArray[pageNo-1] = src;
			var SVG_NS = 'http://www.w3.org/2000/svg';
			var XLink_NS = 'http://www.w3.org/1999/xlink';
			var bgImgNodeArray = $(".paperFrame").find('#svgBg');
			
			for(var i=0; i<bgImgNodeArray.length; i++) {
				var $bgImg = $(".paperFrame:eq(" + i + ") #svgBg");
				if( (pageNo-1) === i) {
					bgImageArray[i] = src;
					$(bgImgNodeArray[i]).removeAttr('href').removeAttr('xlink:href').attr({ x:0, y:0, width:'100%', height:'100%'});
					var bgNode = bgImgNodeArray[i];
					setTimeout(function() {
						bgNode.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src);
					}, 100);
					continue;
				}else{
					if(bgImageArray[i] === undefined) {
						bgImageArray[i] = src;
						$(bgImgNodeArray[i]).removeAttr('href').removeAttr('xlink:href').attr({x:0, y:0, width:'100%', height:'100%'});
						bgImgNodeArray[i].setAttributeNS(XLink_NS, 'xlink:href', bgImageArray[i]);
					}
				}
			}
			
			$(KTCE.currentPaper.s.node).css({
				background : 'url(' + src + ') no-repeat 50% 50%'
				, 'background-size' : 'cover'	//'contain' or 'cover'
			});
			
			$('.dimmLayer').fadeOut(200);
			$('.bgBrowser').fadeOut(150);

			$(".paperFrame svg #svgBgWhite").show();
			$(".paperFrame svg #svgBg").show();
			$('.col7 .guideLine').removeClass('on');
		}
		
		var maskRect = [];
		var imageGArray = {}
		var transformImageArray = [];
		var imgFreeTransform = []
		var cropHandler = [];
		var _handlerData = {}
		var cropHandleIdx;
		var imageCropHandler = null;

		var activeImageG = null;	
		var activeHandler = null;
		
		 /* =================== image object ==================*/
        var xImageGroup = null;
        //var imgObj = Snap(xImageGroup[0]);
        var imgObj = null;
        var clipPathRect = null;
        var tempCropRect = null;
        
        //var cropRect = Snap(document.getElementById("xImage1").getElementsByTagName('rect').item(0));
        /* =================== handler ==================*/
        var imageHandler = null;
        var cropHandler = null;
        
        /* =================== obj info ==================*/
        var _clipPathRectInfo = {};
        var handlerInfo = {}
        var _handlerId, _handlerIdNum = null;
        var _handlerWidth = 8;
        
        function deleteHandles(handler, cropRectId) {
        	
        	var cropRect= "#" + cropRectId; 
        	
        	var _selectShapeArray = KTCE.currentPaper.selectedShapeArray;
			var _length = _selectShapeArray.length;
			for(var i=0; i<_length; i++){
				var ft = _selectShapeArray[i].freeTransform;
				if(ft) {
					if(ft.subject.node.id == cropRectId){
						ft.hideHandles();
					}else{
						ft.visibleNoneHandles();
					}
					ft.updateHandles();
				}
			}
			
            $(cropRect).remove();
            
			if(cropHandler != null) {
				cropHandler = null;
			}
        }
        
        function imageCutDrag() {
        	var startPos = {};
            var startInitPos = {};
            var _limitWidth, _limitHeight;
            var newX, newY, newWidth, newHeight = null;
            
            var _dragFlag = false;
            
            this.dragMove = function(dx, dy) {
              var imgObjTransform =  imgObj.freeTransform;
              var objPosArray=[];
              var _obj = handlerInfo.handler;
              var _pos = {}
              for(var i = 0; i<_obj.length; i++) {
                var pos = {};
                pos.x = _obj[i].attr('x');
                pos.y = _obj[i].attr('y');
                objPosArray[i] = pos;
              }
              
              var handlerPosXWidth = objPosArray[1].x - objPosArray[0].x;
              var handlerPosXHeight = objPosArray[1].y - objPosArray[0].y;
              var handlerPosYWidth =objPosArray[1].x - objPosArray[2].x;
              var handlerPosYHeight = objPosArray[2].y - objPosArray[1].y;
              
              handlerInfo.width = Math.sqrt((handlerPosXWidth * handlerPosXWidth) + (handlerPosXHeight * handlerPosXHeight)) /  imgObjTransform.attrs.scale.x;
              handlerInfo.height = Math.sqrt((handlerPosYWidth* handlerPosYWidth) + (handlerPosYHeight * handlerPosYHeight)) / imgObjTransform.attrs.scale.y;
              
              //이동거리: width
              var dw = (startPos.width - handlerInfo.width);
              var dh = (startPos.height - handlerInfo.height);
              
              if(_handlerIdNum == 0 || _handlerIdNum ==3 || _handlerIdNum == 7) {
                newX = startPos.x + dw;
                //newWidth = startPos.width - (startPos.width - handlerInfo.width);
                if(_handlerIdNum ==  7) {
                  newY = startPos.y;
                  //newHeight = startPos.height;
                }else{
                  if(_handlerIdNum ==  0) {
                    newY = startPos.y + dh;
                  }else{
                    newY = startPos.y;
                  }
                 // newHeight = startPos.height - dh;
                }
                
              }else if(_handlerIdNum == 1 || _handlerIdNum == 2 || _handlerIdNum == 5) {
                newX = startPos.x;
                //newWidth = startPos.width - (startPos.width - handlerInfo.width);
                 if(_handlerIdNum ==  5) {
                  newY = startPos.y;
                  //newHeight = startPos.height;
                }else{
                  if(_handlerIdNum ==  1) {
                    newY = startPos.y + dh;
                  }else{
                    newY = startPos.y;
                  }
                  //newHeight = startPos.height - dh;
                }
                 
                 //width 최대그기 제한
                 _limitWidth = startPos.x - parseFloat(xImageGroup.find('image').attr('x'));
                 
                if( handlerInfo.width >= (parseFloat(xImageGroup.find('image').attr('width')) -_limitWidth) ) {
               //      handlerInfo.width = parseFloat(xImageGroup.find('image').attr('width')) - _limitWidth;
                }
                
              }else{
                 newX = startPos.x;
                 //newWidth = startPos.width;
                 //newHeight = startPos.height - dh;
                 if(_handlerIdNum == 4) {
                    newY = startPos.y + dh;
                 }else if(_handlerIdNum == 6) {
                    newY = startPos.y;
                 }
              }
              
              var _leftLimitPos = parseFloat(xImageGroup.find('image').attr('x'));
                  //var _rightLimitPos = ( startInitPos.x - parseFloat(xImageGroup.find('image').attr('x')) ) + startInitPos.width;
              if(newX <=_leftLimitPos) {
    //             newX = _leftLimitPos;
              }
              
              clipPathRect.attr( {
			      x : newX
			      , y : newY
			      //, width: newWidth
			  //, height: newHeight
			      , width: handlerInfo.width
			      , height: handlerInfo.height
			  });
               
            };
            
            this.dragStart = function(dx, dy, e) {
                _dragFlag = true;
                //_handlerId = e.toElement.id;
                _handlerId = e.target.id;
                _handlerIdNum = _handlerId.split('_')[1];
                startPos.x = parseFloat(clipPathRect.attr('x') );
                startPos.y = parseFloat(clipPathRect.attr('y') );
                startPos.width = parseFloat(clipPathRect.attr('width') );
                startPos.height = parseFloat(clipPathRect.attr('height') );
                _handlerId = this.node.id;
                startInitPos.x = parseFloat(tempCropRect.attr('x'));
                startInitPos.width = parseFloat(tempCropRect.attr('width'));
                
                newX = startPos.x;
                newY = startPos.y;
                newWidth = startPos.width;
                newHeight = startPos.height;
                
                var _recCropMatrix = tempCropRect.attr('transform').localMatrix;
                //startInitPos.width - _recCropMatrix.e
               // parseFloat(xImageGroup.find('image').attr('width')) - (parseFloat(xImageGroup.find('image').attr('width')) * _recCropMatrix.a)
                _limitWidth = (parseFloat(xImageGroup.find('image').attr('x')) + parseFloat(xImageGroup.find('image').attr('width'))) - (startPos.x + startPos.width);
                _limitHeight = (parseFloat(xImageGroup.find('image').attr('y')) + parseFloat(xImageGroup.find('image').attr('height'))) - (startPos.y + startPos.height);
            };
            
            this.dragEnd = function() {
              _dragFlag = false;
            };
          }
        
        
        var addImageFunc = new function() {
			this.iPaper = KTCE.currentPaper.objWrap;
			this.imageGroup = null;
			this.imgSrc = null;
			this.imageObjInfo = {};
			this.clipPathInfo = {};
			this.handler = null;
			this.cropHandler = null;
			this.clippathInfo = {};
			this.initCreate = function(src, x, y, width, height, imgId) {
				addImageFunc.setImg(src);
//				this.imgSrc = src;
				var src = src;
				var _x = x;
				var _y = y;
				var iPaper = this.iPaper
				var initObjInfo = {};
					initObjInfo.x = x;
					initObjInfo.y = y;
					initObjInfo.width = width;
					initObjInfo.height = height;
					//이미지 자른후 index depth값 원래 위치로 조정
					initObjInfo.redraw = false;
				this.createImageObject(KTCE.currentPaper.objWrap, initObjInfo, src, imgId, initObjInfo);
			};
			var copyNode = null;
			var selectImage = null;

			//이미지 group 생성
			this.createImageObject = function(iPaper, objInfo, imgSrc, imgId, clippath, _transform) {
				this.imageGroup = KTCE.currentPaper.objWrap.g().attr({ class : 'hasData xImage', 'data-name' : 'xImage'});
				this.imageGroup.attr("id", this.imageGroup.id);
			//	this.imageGroup.attr({"id": this.imageGroup.id, "clip-path": "url(\"#clippath_" + KTCE.currentPaper.s.node.id + "\")"});

				if(_transform != null) {
					//this.imageGroup.attr("transform", _transform);
				}

				var tempClipPathId = "clippath" + this.imageGroup.id;
				var tempSVGNode = '<clipPath xmlns="http://www.w3.org/2000/svg" id="' + tempClipPathId + '">';
					tempSVGNode += '<rect x="' + clippath.x +'" y="' + clippath.y +'" width="' + clippath.width +'" height="' + clippath.height +'" />';
					tempSVGNode += '</clipPath>';
					//tempSVGNode += '<image style="cursor: move;" xmlns="http://www.w3.org/2000/svg" clip-path="url(#' + tempClipPathId + ')"';
					tempSVGNode += '<image xmlns="http://www.w3.org/2000/svg" clip-path="url(#' + tempClipPathId + ')"';
					tempSVGNode += 'x="' + objInfo.x +'" y="' + objInfo.y +'" width="' + objInfo.width +'" height="' + objInfo.height +'" xlink:href="' + imgSrc +'" xmlns:xlink="http://www.w3.org/1999/xlink" />';

				var obj = Snap.parse(tempSVGNode);

				//이미지 오브젝트 생성붙이기
				this.imageGroup.append(obj);
				if(KTCE.currentPaper.currentShape != null && objInfo.redraw) {
					var currentShapePrev = KTCE.currentPaper.currentShape.prev();
					fnShpaeRePostion(this.imageGroup, currentShapePrev);
				}

				//handler 생성
				this.createHandler(this.imageGroup);

				//이미지 오브젝트 click event생성
				this.createButton(this.imageGroup);

			};
			
			this.createHandler = function(obj) {
				deleteHandles([imageHandler, cropHandler], "cropRect");
				//deleteHandles([handler, cropHandler], "cropRect");

				var _image = document.getElementById(obj.node.id).getElementsByTagName('image').item(0);
				var _imageX = parseFloat(_image.getAttribute('x'));
				var _imageY = parseFloat(_image.getAttribute('y'));
				var _imageW = parseFloat(_image.getAttribute('width'));
				var _imageH = parseFloat(_image.getAttribute('height'));
				
	            var _transform = $(obj.node).attr('transform');	//$(this).attr('transform');
	            xImageGroup = $(obj.node);	//$(this);
	            
	            imgObj = obj;//Snap(this);
	            
	            clipPathRect = imgObj.select('rect');
	            var imageInfo = {};
	            imageInfo.x = xImageGroup.find('image').attr('x');
	            imageInfo.y = xImageGroup.find('image').attr('y');
	            imageInfo.width = xImageGroup.find('image').attr('width');
	            imageInfo.height = xImageGroup.find('image').attr('height');
	            
	            var tempWidth = parseFloat(imageInfo.x) - parseFloat(clipPathRect.attr('x'));
	            var tempHeight = parseFloat(imageInfo.y) - parseFloat(clipPathRect.attr('y'));
	            
	            if( parseFloat(clipPathRect.attr('x')) < parseFloat(imageInfo.x)) {
	                var nW = parseFloat(clipPathRect.attr('width')) - (parseFloat(imageInfo.x) - parseFloat(clipPathRect.attr('x')));
	                if(nW > parseFloat(imageInfo.width) ) {
	                    nW = parseFloat(imageInfo.width);
	                 }
	                clipPathRect.attr({'x': imageInfo.x, 'width': nW});
	            }
	            
	            if( parseFloat(clipPathRect.attr('y')) < parseFloat(imageInfo.y)) {
	                var nH = parseFloat(clipPathRect.attr('height')) - (parseFloat(imageInfo.y) - parseFloat(clipPathRect.attr('y')));
	                if( nH> parseFloat(imageInfo.height) ) {
	                    nH = parseFloat(imageInfo.height);
	                 }
	                clipPathRect.attr({'y': imageInfo.y, 'height': nH});
	            }
	            
	            if( (parseFloat(clipPathRect.attr('width')) - tempWidth) > parseFloat(imageInfo.width) ) {
	                clipPathRect.attr('width', imageInfo.width);
	            }else if( parseFloat(clipPathRect.attr('width')) > parseFloat(imageInfo.width) ) {
	              clipPathRect.attr('width', (parseFloat(clipPathRect.attr('width')) - tempWidth));
	            }
	            
	            if( (parseFloat(clipPathRect.attr('y')) + parseFloat(clipPathRect.attr('height')) ) > ( parseFloat(imageInfo.y)  + parseFloat(imageInfo.height)) ) {
	                var nH2 = parseFloat(imageInfo.height) - (parseFloat(clipPathRect.attr('y')) - parseFloat(imageInfo.y));
	                clipPathRect.attr('height', nH2);
	            }
	            
	            //this.handler = Snap.freeTransform(imgObj, {
	            imageHandler = Snap.freeTransform(imgObj, {
	                draw: ['bbox']
	                , keepRatio: ['bboxSides']    //bboxSides
	                , rotate: ['axisY'] //axisY
	                , drag : ['self']
	                , scale: ['bbox', 'bboxCorners', 'bboxSides']
	                , distance: '1.5'
                	, boundary : {
						x : 0
						, y : 0
						, width : KTCE.currentPaper.width
						, height :KTCE.currentPaper.height
					}
	            	, objectId : obj.id
	            },  function(e){
	            	//이미지 사이즈, 이동 바인딩범위 실시간 반영
					var matrix = obj.attr('transform').globalMatrix;
					var _tempImageW = (_imageW * matrix.a);
					var _tempImageH = (_imageH * matrix.d);
					if (this.opts.boundary) {
						var b = this.opts.boundary;
						b.x = (_tempImageW > KTCE.currentPaper.width) ? -(_tempImageW/2) + 100 : 0;
						b.y = (_tempImageH > KTCE.currentPaper.height) ? -(_tempImageH/2) + 100 : 0;
						b.width = (_tempImageW > KTCE.currentPaper.width) ? (KTCE.currentPaper.width + _tempImageW - 200) : KTCE.currentPaper.width;
						b.height = (_tempImageH > KTCE.currentPaper.height) ? (KTCE.currentPaper.height + _tempImageH - 200) : KTCE.currentPaper.height;
						//b.width = (_tempImageW > KTCE.currentPaper.width) ? (_tempImageW/2 + KTCE.currentPaper.width) - 100 : KTCE.currentPaper.width;
						//b.height = (_tempImageH > KTCE.currentPaper.height) ? (_tempImageH/2 + KTCE.currentPaper.height) - 100 : KTCE.currentPaper.height;
					}
	            });
	            
	            var tx = imgObj.freeTransform.attrs.translate.x;
	            var ty = imgObj.freeTransform.attrs.translate.y;
	            //_tempCropRect.addTransform('r'+ this.handler.attrs.rotate);
	            imgObj.transform([
	                'R' + imgObj.freeTransform.attrs.rotate
	                , imgObj.freeTransform.attrs.center.x
	                , imgObj.freeTransform.attrs.center.y
	                , 'S' + imgObj.freeTransform.attrs.scale.x
	                , imgObj.freeTransform.attrs.scale.y
	                , imgObj.freeTransform.attrs.center.x
	                , imgObj.freeTransform.attrs.center.y
	                , 'T' + tx
	                , ty
	            ].join(','));
	            
	            
	            imageHandler.attrs.translate.x = tx;
	            imageHandler.attrs.translate.y = ty;
	            imageHandler.attrs.rotate = imgObj.freeTransform.attrs.rotate;
	            
	            fnCreateDataObject(imgObj, imageHandler, undefined);
	            
	            imageHandler.visibleNoneHandles();
	            imageHandler.updateHandles();
	            
	            handlerBinding();
				KTCE.currentPaper.shapeArray.push(imgObj.freeTransform);
			};
			
			
			this.createButton = function(obj){
				
				var button = obj.node;
				var handler = obj.freeTransform;
				//var img = $("#" + obj.id + " image").attr('xlink:href');
				
				$(button).on("mousedown", function(){
					var cropHandler = addImageFunc.getCropHandler();
					if(cropHandler != null && cropHandler.bbox != null){
						$(button).trigger("click");
					}
				});
				
				$(button).on("click", function(){
					if(cropHandler != null ) {
						cropHandler.hideHandles();
						cropHandler.updateHandles();
						cropHandler = null;
					}
					
		            var _transform = $(obj.node).attr('transform');
		            xImageGroup = $(obj.node);
		            imgObj = obj;
		            
		            clipPathRect = imgObj.select('rect');
		            var imageInfo = {};
		            imageInfo.x = xImageGroup.find('image').attr('x');
		            imageInfo.y = xImageGroup.find('image').attr('y');
		            imageInfo.width = xImageGroup.find('image').attr('width');
		            imageInfo.height = xImageGroup.find('image').attr('height');
		            
		            var tempWidth = parseFloat(imageInfo.x) - parseFloat(clipPathRect.attr('x'));
		            var tempHeight = parseFloat(imageInfo.y) - parseFloat(clipPathRect.attr('y'));
		            
		            if( parseFloat(clipPathRect.attr('x')) < parseFloat(imageInfo.x)) {
		                var nW = parseFloat(clipPathRect.attr('width')) - (parseFloat(imageInfo.x) - parseFloat(clipPathRect.attr('x')));
		                if(nW > parseFloat(imageInfo.width) ) {
		                    nW = parseFloat(imageInfo.width);
		                 }
		                clipPathRect.attr({'x': imageInfo.x, 'width': nW});
		            }
		            
		            if( parseFloat(clipPathRect.attr('y')) < parseFloat(imageInfo.y)) {
		                var nH = parseFloat(clipPathRect.attr('height')) - (parseFloat(imageInfo.y) - parseFloat(clipPathRect.attr('y')));
		                if( nH> parseFloat(imageInfo.height) ) {
		                    nH = parseFloat(imageInfo.height);
		                 }
		                clipPathRect.attr({'y': imageInfo.y, 'height': nH});
		            }
		            
		            if( (parseFloat(clipPathRect.attr('width')) - tempWidth) > parseFloat(imageInfo.width) ) {
		                clipPathRect.attr('width', imageInfo.width);
		            }else if( parseFloat(clipPathRect.attr('width')) > parseFloat(imageInfo.width) ) {
		              clipPathRect.attr('width', (parseFloat(clipPathRect.attr('width')) - tempWidth));
		            }
		            
		            if( (parseFloat(clipPathRect.attr('y')) + parseFloat(clipPathRect.attr('height')) ) > ( parseFloat(imageInfo.y)  + parseFloat(imageInfo.height)) ) {
		                var nH2 = parseFloat(imageInfo.height) - (parseFloat(clipPathRect.attr('y')) - parseFloat(imageInfo.y));
		                clipPathRect.attr('height', nH2);
		            }
		            
		            imageHandler = Snap.freeTransform(imgObj, {
		                draw: ['bbox']
		                , keepRatio: ['bboxSides']    //bboxSides
		                , rotate: ['axisY'] //axisY
		                , drag : ['self']
		                , scale: ['bbox', 'bboxCorners', 'bboxSides']
		                , distance: '1.5'
	                	, boundary : {
							x : 0
							, y : 0
							, width : KTCE.currentPaper.width
							, height :KTCE.currentPaper.height
						}
		            	, objectId : obj.id
		            },  function(e){
		            	//이미지 사이즈,이동 바인딩범위 실시간 반영
						var matrix = obj.attr('transform').globalMatrix;
						var _tempImageW = (_imageW * matrix.a);
						var _tempImageH = (_imageH * matrix.d);
						if (this.opts.boundary) {
							var b = this.opts.boundary;
							b.x = (_tempImageW > KTCE.currentPaper.width) ? -(_tempImageW/2) + 100 : 0;
							b.y = (_tempImageH > KTCE.currentPaper.height) ? -(_tempImageH/2) + 100 : 0;
							b.width = (_tempImageW > KTCE.currentPaper.width) ? (KTCE.currentPaper.width + _tempImageW - 200) : KTCE.currentPaper.width;
							b.height = (_tempImageH > KTCE.currentPaper.height) ? (KTCE.currentPaper.height + _tempImageH - 200) : KTCE.currentPaper.height;
						}
		            });
		            
		            var tx = imgObj.freeTransform.attrs.translate.x;
		            var ty = imgObj.freeTransform.attrs.translate.y;
		            //_tempCropRect.addTransform('r'+ this.handler.attrs.rotate);
		            imgObj.transform([
		                'R' + imgObj.freeTransform.attrs.rotate
		                , imgObj.freeTransform.attrs.center.x
		                , imgObj.freeTransform.attrs.center.y
		                , 'S' + imgObj.freeTransform.attrs.scale.x
		                , imgObj.freeTransform.attrs.scale.y
		                , imgObj.freeTransform.attrs.center.x
		                , imgObj.freeTransform.attrs.center.y
		                , 'T' + tx
		                , ty
		            ].join(','));
		            
		            imageHandler.attrs.translate.x = tx;
		            imageHandler.attrs.translate.y = ty;
		            imageHandler.attrs.rotate = imgObj.freeTransform.attrs.rotate;
		            
		            imageHandler.showHandles();
		            imageHandler.visibleHandles();
		            imageHandler.updateHandles();
				});
				//$(button).trigger("click");
			};
			
			

			this.setImg = function(img) {
				this.imgSrc = img;
			};
			this.getImg = function() {
				return this.imgSrc;
			};
			this.setHandler = function(handler) {
				this.handler = handler
			};
			this.getHandler = function() {
				return this.handler;
			};

			this.setCropHandler = function() {
				
				if(imgObj == null) {
					alert('먼저 편집할 이미지만 선택하세요'); return;
					return;
				}
				
				try{
					if(imageHandler != null) {
						imageHandler.visibleNoneHandles();
						imageHandler.updateHandles();
						imageHandler = null;
					}
				}catch(e){}
				
	            var imgBBox = imgObj.getBBox();
	            clipPathRect = imgObj.select('rect');

	            var cropRect = {};
	                 cropRect.x = parseFloat(clipPathRect.attr('x')),
	                 cropRect.y = parseFloat(clipPathRect.attr('y')),
	                 cropRect.width = parseFloat(clipPathRect.attr('width')),
	                 cropRect.height = parseFloat(clipPathRect.attr('height'));
	                 
	            deleteHandles([imageHandler, cropHandler], "cropRect");
				
	            if($("#cropRect").length > 0) {
	                $("#cropRect").remove();
	            }

	            var paper = Snap(KTCE.currentPaper.s.node);
	            
	            tempCropRect = KTCE.currentPaper.s.rect( cropRect.x,  cropRect.y,  cropRect.width,  cropRect.height).attr({'id': 'cropRect', 'display': 'none', 'opacity':0, 'transform': imgObj.attr('transform')});
	            cropHandler = Snap.freeTransform(tempCropRect, {
	                draw: ['bbox']
	                //, keepRatio: ['bboxSides']    //bboxSides
	                , rotate: ['none'] //axisY
	                , drag : ['self']
	                , scale: ['bbox', 'bboxCorners', 'bboxSides']
	                //, scale: ['bbox']
	                , distance: 'none'
	            }, function(e){ });

	            
	            this.cropHandler = cropHandler;
				if(addImageFunc.clippathInfo.x != null) {
					$("clippath").html('');
				}
				
				cropHandler.opts.attrs = {
					fill: '#ccc',
					stroke: '#333',
					'cursor':'crosshair',
					opacity: 0.8
				}
				cropHandler.opts.bboxAttrs = {
					fill: 'none',
					stroke: 'blue',
					//cursor: 'move',
					'cursor':'crosshair',
					'stroke-dasharray': '3, 3',
					opacity: 0.8
				}				

				cropHandler.showHandles();
				cropHandler.visibleHandles();
				cropHandler.updateHandles();
				
	            var positionArray = [];
	            var handlerObj = [];
	            tempCropRect.freeTransform.handles.bbox.forEach(function(el, idx){
	                var handlerRect = tempCropRect.freeTransform.handles.bbox[idx].element;
	               handlerRect.attr('id', 'cropHandler_' + idx);
	                //위 id값을 좌/우/상/하 handler 조절 이름을 파악하여 clippath>rect의 x, y, width, height 값을 반영하라!!!!!
	                //handlerRect.drag(imgCutDragMove, imgCutDragStart, imgCutDragEnd);

	                var _imgCut = new imageCutDrag();
	                handlerRect.drag(_imgCut.dragMove, _imgCut.dragStart, _imgCut.dragEnd);

	                var pos = {};
	                pos.x = parseFloat(handlerRect.attr('x')) ;
	                pos.y = parseFloat(handlerRect.attr('y')) ;
	                pos.width = parseFloat(handlerRect.attr('width'));
	                pos.height = parseFloat(handlerRect.attr('height'));
	                positionArray[idx] = pos;
	                handlerObj[idx] = handlerRect;
	            });
	            handlerInfo.position = positionArray;
	            handlerInfo.handler = handlerObj;

	            //cropRect 영역 처리
	           // tempCropRect.transform( tempCropRect.transform().localMatrix.toTransformString() + 'r' + imgObj.freeTransform.attrs.rotate);

	            //핸들러 rect 처리
	           tempCropRect.freeTransform.attrs.rotate = imgObj.freeTransform.attrs.rotate;

	           tempCropRect.freeTransform.attrs.scale.x = imgObj.freeTransform.attrs.scale.x;
	           tempCropRect.freeTransform.attrs.scale.y = imgObj.freeTransform.attrs.scale.y;

	           var cropBBox = tempCropRect.getBBox();

	           tempCropRect.freeTransform.attrs.center.x =  cropBBox.cx;
	           tempCropRect.freeTransform.attrs.center.y =  cropBBox.cy;
	           tempCropRect.freeTransform.attrs.translate.x = 0;
	           tempCropRect.freeTransform.attrs.translate.y = 0;
	           tempCropRect.freeTransform.updateHandles();
			};

			this.getCropHandler = function() {
				cropHandler = (this.cropHandler == null) ? cropHandler : this.cropHandler;
				//return this.cropHandler;
				return cropHandler;
			};

			this.getImageGroup = function() {
				return this.imageGroup;
			};

		};
		
		// 이미지 브라우저 기능 / 수정 : 그림 썸네일 이미지
		function fnImageBrowser() {
			var currentCtgryId = ''
			var currentPage = 1;
			var totalPage = 1;
			var callImageListState = true;
			var viewImg = null;
			var checkMyImg = false;
			trigger.addImage.on({
				click : function() {
					hideAllHandler();
					
					//initImageLayer()
					$('.dimmLayer').fadeIn(150);
					$('.imageBrowser').fadeIn(200, function() {
						
					
						$('.imageBrowser .imageList .outer').mCustomScrollbar({
							theme : 'dark'
							, scrollInertia : 200
//							, mouseWheel : {scrollAmount : 200}
							, callbacks:{
								onTotalScroll:function(){
									if(totalPage > currentPage){
										currentPage++;
										//이미지 리스트조회
										if(callImageListState) {
											callImageListState = false;
											callImageList(currentCtgryId, false, function(count) {setting(count);}, currentPage);
										}
									}
								}
							}
						});
						
					});
					
					// 한번 이상 클릭시 불필요한 ajax통신 자제
					var thumbLength = $('.imageBrowser .imageList .outer a').length;
					if(viewImg != null  || currentPage > 1 || thumbLength >= 45) return;
					
					// 이미지 목록 ajax call
					$.ajax({
						url:'/Fwl/FlyerApi.do',
						type:'post',
						data: {
							pageFlag : 'AF_IMG_CTGRY_LIST'
						},
						success:function(data){
							var listHTML = '<li class="top"><a href="#" data-ctgryId=""><span>이미지전체</span></a></li>'
								, childHTML = ''
								, beforLevel ='';
							$.each(data.ctgryList, function(i, val) {
								if ( val.level == 1 ) {
									if(beforLevel == "1"){
										listHTML += '</li>';
									}else if(beforLevel == "2"){
										listHTML += '</ul></li>';
									}
									listHTML += '<li><a href="#" data-ctgryId="' + val.ctgryId + '">' + val.ctgryName + '</a>';
								} else if ( val.level == 2 ) {
									if(beforLevel == "1"){
										listHTML += '<ul>'
									}
									listHTML += '<li><a href="#" data-prntsCtgryId="' + val.prntsCtgryId + '" data-ctgryId="' + val.ctgryId + '">' + val.ctgryName + '</a></li>';
								}

								beforLevel = val.level;

							});


							$('div.imageBrowser div.optionsWrap ul.list').html(listHTML);

							$('div.imageBrowser div.optionsWrap ul.list').children('li').first().addClass('active');
							
							categoryItemBind();

							// 전체이미지 조회
							callImageList('', false, function(count) {setting(count)},currentPage);


							$('.imageBrowser .optionsWrap .listWrap').mCustomScrollbar({
								theme : 'dark'
								, scrollInertia : 300
							});

							itemBind();
						},
						error:function(){
							alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
						}
					});

					return false;

				}
			});
						
			trigger.imageCut.on({
				click : function() {
					addImageFunc.setCropHandler();
				}

			});
			
			$('.imageBrowser .closer').on({
				click : function() {
					$('.dimmLayer').fadeOut(200);
					$('.imageBrowser').fadeOut(150);
					//initImageLayer();
				}
			});

			// 이미지 ajax call
			function callImageList(ctgryId, searchFlag, callback, page) {

				currentPage = page

				var inputWord = $('.imageBrowser .inputWrap input[type=text]').val()
					, searchWord = ''

				if ( searchFlag ) searchWord = inputWord;
				var count = 0;
				var totalPageNo = 1;
				
				// 이미지 목록 ajax call
				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					data: {
						pageFlag : 'AF_IMG_LIST'
						, ctgryId : ctgryId
						, searchWord : searchWord
						, hwYN : KTCE.paperInfo.hwYn
						, page : currentPage
					},
					success:function(data){
						/*그림 썸네일 이미지*/
						if(page == 1)$('.imageBrowser .imageList .outer').mCustomScrollbar('scrollTo','top');
						if(data.paramMap != undefined && data.imgList != undefined){
							var listHTML = '';
							totalPage = Number(data.paramMap.totalPage);
							totalPageNo = Math.ceil(totalPage/45);	//ajax 한번에 갖고 오는 이미지수: 45개
							$.each(data.imgList, function(i, val) {
								if(val.thumbImgUrl == ''){
									listHTML += '<a href="#"><input style="position:absolute;" type="checkbox">'
												+'<img src="' + val.imgUrl + '" alt="' + val.imgName +'" data-regdate="' + val.regDate + '">'
												+'</a>';
									count++;
								}else {
									listHTML += '<a href="#"><input style="position:absolute;" type="checkbox"/>'
												+'<img src="' + val.thumbImgUrl + '" alt="' + val.imgName +'" data-regdate="' + val.regDate + '" data-src="' + val.imgUrl + '" data-id="thumbImg">'
												+'</a>';	
									count++;
								}
							});
							if(page > 1){
								$('div.imageBrowser div.imageList div.inner').append(listHTML);
							}else{
								$('div.imageBrowser div.imageList div.inner').html(listHTML);
							}
							
							if ( callback != undefined && typeof callback == 'function' ) callback(count);
						} else {
							$('div.imageBrowser div.imageList div.inner').html('');
						}
						
					},
					beforeSend:function() {
					},
					complete : function() {
						callImageListState = true;
					},
					error:function(){
						alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
						callImageListState = true;
					}
				});
			}
			function setting(count){
					if ( count > 0 ) {
						itemBind();
					} else {
						$('.imageBrowser .imageList .inner').html('<p class="noData">검색결과가 없습니다.</p>');
					}
			}

			// 내컴퓨터에서 이미지 업로드
			$('#uploadFile').on({
				change : function() {
					try{
						var max = 5;
						var maxSize = max*1024*1024;
						var fileSize = $('#uploadFile')[0].files[0].size;
						selectedImageArray = new Array();
						if(maxSize< fileSize){
							alert("파일 용량이 "+max+"MB 이하만 등록가능합니다.");
						}else{
							console.log("파일 업로드 중....");
							//$(".viewCont").aphtml("파일 읽는 중....");
							//$("#previewImage").before("<p>파일 읽는 중....</p>");
							$("#previewImage").hide();
							$("#previewImage").before($(".dimmLoader").clone().css({position: 'relative', opacity:0.3}).show());
							
							fileUpload('fileFrm'
							, function(data) {
								initImageLayer();
								$('#previewImage').attr({
									'src' : data.imgUrl
									, 'data-imgId' : data.imgId
								});
								selectedImageArray[0] = $('#previewImage').parents('.viewCont');
								checkMyImg = true;
								console.log("파일 완료....");
								$(".viewCont>.dimmLoader").remove();
								$("#previewImage").show();
								if($('#uploadFile').length >= 1){
									$('#uploadFile')[0].value = null;
								}
								//console.log('이미지 : ' + data.imgUrl, data.imgId);
		
							}, function() {
							});
						}
					}catch(err){
					}
					
				}
			});

			// 검색어로 검색
			$('.imageBrowser .inputWrap button').on({
				click : searchFn
			});

			$('.imageBrowser .inputWrap input[type=text]').on({
				'keydown' : function(e) {
					if ( e.keyCode == 13 ) searchFn();
				}
			});

			function searchFn() {
				$('.imageBrowser .imageList .outer').mCustomScrollbar('scrollTo','top');
				callImageList('', true,function(count){setting(count)},1);
				$('.imageBrowser .optionsWrap .list li').removeClass('active');
			}

			function categoryItemBind() {

				$('.imageBrowser .optionsWrap .list a').each(function() {

					var ctgryId = $(this).attr('data-ctgryId');

					$(this).on({
						click : function() {
							$('.imageBrowser .imageList .outer').mCustomScrollbar('scrollTo','top');
							callImageList(ctgryId, false,function(count){setting(count)},1);

							$(this).parent().parent().children('li').removeClass('active');
							$(this).parent().addClass('active');

							currentCtgryId = ctgryId;
							selectedImageArray = new Array();

						}
					});

				});
				//$('.imageBrowser .optionsWrap .list a:eq(0)').trigger('click');

			}
			/*그림 썸네일 이미지*/
			function itemBind() {
				// 체크박스로 인한 기능
				$('.imageBrowser .imageList a').find('input').each(function() {
					var imgTag
					, imgIdType
					, alt
					, src;
					$(this).off('click').on({
						click : function() {
							imgTag = $(this).siblings('img');
							imgIdType = imgTag.attr('data-id');
							// 내컴퓨터 체크
							if(checkMyImg){
								selectedImageArray = new Array();
								checkMyImg = false;
							}
							if(!$(this).is(":checked")){//체크해제
								$('.imageBrowser .imageList a').find('input:checkbox:not(:checked)').parents('a').removeClass('active');
								$(this).parents('a').removeClass('active');
								$(this).prop("checked",false);
								
								for(var i=0; i<selectedImageArray.length; i++){
									var selImgAryi = $(selectedImageArray[i]).find('img');
									if(imgIdType == 'thumbImg'){
										if(imgTag.attr('data-src') == selImgAryi.attr('data-src')) break;
									}else{
										if(imgTag.attr('src') == selImgAryi.attr('src')) break;
									}
								}
								selectedImageArray.splice(i, 1);
								if(selectedImageArray.length > 0){
									var selImgAry = $(selectedImageArray[selectedImageArray.length-1]).find('img');
									alt = selImgAry.attr('alt');
									src = (imgIdType == 'thumbImg') ? selImgAry.attr('data-src') : selImgAry.attr('src');
								} else{
									src = '';
									alt = '';
								}
								$('#previewImage').attr({src : src, alt : alt});
								$('.imageBrowser .imageView .descTit').html(alt);
							}else{// 체크
								$('.imageBrowser .imageList a').find('input:checkbox:not(:checked)').parents('a').removeClass('active');
								$(this).parents('a').addClass('active');
								$(this).prop("checked",true);
								
								if(imgIdType == 'thumbImg'){
									src = imgTag.attr('data-src');
									imgTag.attr('src', src);
								}
								selectedImageArray.push(imgTag.parents('a'));
								
								alt = imgTag.attr('alt')
								src = (imgIdType == 'thumbImg') ? imgTag.attr('data-src') : imgTag.attr('src');
								$('#previewImage').attr({src : src, alt : alt});
								$('.imageBrowser .imageView .descTit').html(alt);
							}
						}
					});
				});
				// 이미지 클릭으로 인한 기능
				$('.imageBrowser .imageList a').find('img').each(function() {
					var imgIdType
					, alt
					, src;
					$(this).off('click').on({
						click : function(e) {
							e.preventDefault();
							imgIdType = $(this).attr('data-id');
							alt = $(this).attr('alt');
							src = (imgIdType == 'thumbImg') ? $(this).attr('data-src') : $(this).attr('src');
							
							// 체크된 항목이 있다면 체크된거 제외하고 체크안된 항목만 적용
							if($('.imageBrowser .imageList a').find('input:checkbox:checked').length>0){
								if(!$(this).parents('a').hasClass('active')){
									$('.imageBrowser .imageList a').find('input:checkbox:not(:checked)').parents('a').removeClass('active');
									$(this).parents('a').addClass('active');
									$('#previewImage').attr({src : src, alt : alt});
									$('.imageBrowser .imageView .descTit').html(alt);
								} else {
									if($(this).prev('input:checkbox').is(':checked')){
										$('.imageBrowser .imageList a').find('input:checkbox:not(:checked)').parents('a').removeClass('active');
										$('#previewImage').attr({src : src, alt : alt});
										$('.imageBrowser .imageView .descTit').html(alt);
									}else{
										$(this).parents('a').removeClass('active');
										src = '';
										alt = '';
										$('#previewImage').attr({src : src, alt : alt});
										$('.imageBrowser .imageView .descTit').html(alt);
									}
								}
							}else{
								if(!$(this).parents('a').hasClass('active')){
									$('.imageBrowser .imageList a').removeClass('active');
									$(this).parents('a').addClass('active');
									$('#previewImage').attr({src : src, alt : alt});
									$('.imageBrowser .imageView .descTit').html(alt);
								} else {
									$(this).parents('a').removeClass('active');
									src = '';
									alt = '';
									$('#previewImage').attr({src : src, alt : alt});
									$('.imageBrowser .imageView .descTit').html(alt);
								}
							}
						}
					});
				});
			}
			
			
			//이미지 자르기 생성
			function fnAddImageToCanvas(src, width, height, imgId) {
				
				var src = src;	//원본
				
				var _width = (width>=300) ? 300:width;
				var _height = (_width*height)/width; 
				var imgId = imgId;
				var _x = 200;
				var _y = 200;
				//var _handlerData = {}
					 _handlerData.imageHandle = [];
					 _handlerData.cropHandle = [];

				if ( imgId != null ) {
					/*tempImage.attr({
						'class' : 'ID_' + imgId + ' hasImageId'
					});*/
					imgId = 'ID_' + imgId + ' hasImageId';
				}

				addImageFunc.initCreate(src, _x, _y, width, height, imgId);
				
			}

			trigger.addImageToCanvas.on({
				click : function() {

					var ratio = 0
					
					//단윈환산: 1mm --> 3.779527559px
					if(KTCE.currentPaper.size == "PS"){
						//ratio = 4.375;	//3500px: 5250px(실용지 사이즈의 154.3402777800286%); <-- local 서버에서 처리 못함(메모리 부족)
						ratio = 3;	//2400px:3600px;
					}else if(KTCE.currentPaper.size == "A3"){
						ratio = 4.385;	//기존비율(2016년)
						//ratio = 2.1925; //인쇄용 1754px:2480px(실용지사이즈의 156.2556116745571%)
					}else if(KTCE.currentPaper.size == "A4"){
						ratio = 3.1;	//기존비율(2016년) //3.124603174648742 
						//ratio = 1.55;	//1240px:1754(실용지사이즈의 156.2301587324371%)
					}else{
						ratio = 2.185;	//기존비율(2016년)	
						//ratio = 1.5	//1200px:1703px(실용지사이즈의 214.5270270301555%)
						//ratio = 1.0625;  //850px:1206px(실용지사이즈의 151.9566441463602%)
					}
					
					if(selectedImageArray.length > 0){
						for(var i=0; i<selectedImageArray.length; i++){
							var imgIdType = $(selectedImageArray[i]).find('img').attr('data-id');
							var src, width, height;
							src = $(selectedImageArray[i]).find('img').attr('src');
							width = $(selectedImageArray[i]).find('img')[0].naturalWidth/ratio
							height = $(selectedImageArray[i]).find('img')[0].naturalHeight/ratio
							var imgId;
							if($(selectedImageArray[i]).find('img').hasAttr('data-imgid')){
								imgId = $(selectedImageArray[i]).find('img').attr('data-imgid');
							}else if($(selectedImageArray[i]).find('img').hasAttr('id') ){
								imgId = $(selectedImageArray[i]).find('img').attr('id') ;
							}else{
								imgId = null;
							}
							if ( imgId != null ) {
								imgId = 'ID_' + imgId + ' hasImageId';
							}
							fnAddImageToCanvas(src, width, height, imgId);
						}
						

						setTimeout(function() {
							$('.dimmLayer').fadeOut(200);
							$('.imageBrowser').fadeOut(150);	
							fnSaveState();
							initImageLayer();
						}, 100);
					} else {
						alert("사용하고자 하는 그림에 체크해주세요.");
					}
				}
			});
		}

		function initImageLayer(){
			selectedImageArray = new Array();
			$('#previewImage').attr({
				src : ''
				, alt :''
			})
			$('.imageBrowser .imageView .descTit').html('');
			$('.imageBrowser .imageList a').removeClass('active')
			$('.imageBrowser .imageList a').find('input:checkbox').prop("checked",false);
		}

		/******************************************************************************/
		/* Section: 텍스트 기능
		/******************************************************************************/
		

		// 텍스트 상자 만들기
		function fnTextBox() {

			var mousePos = {}

			trigger.addTextBox.on({
				click : function(e) {
					hideAllHandler();
					
					$('body').addClass('textCreating');

					KTCE.textCreating = true;

					_bind();
				}
			});

			function _bind() {
				KTCE.currentPaper.s.click(clickEvent);
				
				if(cropHandler != null) {
					cropHandler.hideHandles();
					cropHandler.updateHandles();
					cropHandler = null;
				}
			}

			function _unBind() {
				KTCE.currentPaper.s.unclick(clickEvent);
			}

			function clickEvent(e) {
				if ( KTCE.textCreating ) {
					//var inputValue = window.prompt( '다음 텍스트를 입력합니다.', '전단지제작툴' );
					
					//기존 선택 객체 있으면 해제
					try{
						if(KTCE.currentPaper.selectedShapeArray.length>1) {
							KTCE.currentPaper.selectedShapeArray.forEach(function(el, idx) {
								if(el.freeTransform != undefined)
									el.freeTransform.visibleNoneHandles();
							});
						}else{
							if(KTCE.currentPaper.currentShape.freeTransform != null) {
								KTCE.currentPaper.currentShape.freeTransform.visibleNoneHandles();
							}
						}
						
					}catch(err){
						console.log('err', err)
					}

					var inputValue = ' ';
					baseFontSize = (KTCE.paperInfo.hwYn == "Y") ? 600 : 20;
					
					//textBox 생성시 배경객체위에 마우스가 아닌 객체위에서 생성시 textBox의 x, y 좌표가 이상하게 나타나는 현상
					// e.offsetX(Y) ==> e.layerX(Y)로 사용
					var ratio = parseFloat($(".screenSizer .uiDesignSelect1 .uiDesignSelect-text").html().split("%")[0])/100;
					var baseTextPos = {
						x : (e.layerX/ratio)+10,
						y : (e.layerY/ratio)+15
						//x : e.layerX+10,
						//y : e.layerY+15
					};
					
					if(KTCE.paperInfo.hwYn == "Y"){
						baseTextPos.y += 400;
					}
					
					_baseFont = 'KTfontBold';
					var textBox = KTCE.currentPaper.objWrap.g().attr('class', 'textBoxWrap').attr("style", "font-family:" + _baseFont)
								 .attr("data-lineposx", baseTextPos.x)
								 .attr('data-lineposy', baseTextPos.y)
						, cover = textBox.g().attr('class', 'textcover')
						, line = textBox.g().attr('class', 'textLine')
						, word = line.text(baseTextPos.x,baseTextPos.y, inputValue)
							     .attr('class','textBox basic')
							     .attr("style", "font-size:"+baseFontSize+"pt")
						, cursorWrapper = textBox.g().attr('class', 'text-cursor')
						, cursor = cursorWrapper.line(word.getBBox().x + word.getBBox().width
													, word.getBBox().y
													, word.getBBox().x + word.getBBox().width
													, word.getBBox().y + word.getBBox().height)
									.attr('stroke', 'black').attr('stroke-width', '1.5')
									.attr('visibility', 'visible');

						//ie11 배경검정색 처리
						var rect = cover.rect(word.getBBox().x-5, word.getBBox().y-5, word.getBBox().width + 10, word.getBBox().height + 10)
						.attr('fill', 'none');

					reSetFontEffect(baseFontSize);
					
					$('body').removeClass('textCreating');
					KTCE.textCreating = false;
					_unBind();

					//text 생성후 선택시
					textBox.click(function(e) {
						textBoxClick(textBox)
					});
		
					//test 생성후 편집시(글자수정시)
					textBox.dblclick(function(e) {
						// 그룹객체
						if(!e.shiftKey) textBoxDblClick(e);
					});

					//ie11 focus 유지를 위해 아래 프로세스 처리
					$("#temp_textarea").hide();
					$("#temp_textarea").show();
					$("#temp_textarea").css('z-index', '-1')
					setTimeout(function(e){
						$("#temp_textarea").focus();
					},10);
					
					//cursor 생성 및 입력대기상태 처리..
					setTextMode(textBox);
					
					fnSetFreeTransformTextbox(textBox);
					
					//textBox 생성 객체 지정
					KTCE.currentPaper.selectedShapeArray[0] = textBox;
					
				}

			}
		}

		function reSetFontEffect(baseFontSize){
			var fontUiSelect = $('.uiDesignSelect-wrap.uiDesignSelect1.fontControl')
				,fontUiSelectTrigger = fontUiSelect.find('.uiDesignSelect-optionList').find('a')
				,sizeUiSelect = $('.uiDesignSelect-wrap.uiDesignSelect2.fontControl')
				,sizeUiSelectTrigger = sizeUiSelect.find('.uiDesignSelect-optionList').find('a')

		
			fontUiSelectTrigger.eq(2).trigger('change');	//산돌고딕L
			//fontUiSelectTrigger.eq(5).trigger('change');	//올레체 네오B
			sizeUiSelectTrigger.eq(findIdx(baseFontSize,'fontSize')).trigger('change'); 
			var spacingList =$('#letterSpacingLayer .numberList').find('li')
			spacingList.find('button').removeClass('active');
			$(spacingList.find('button')[0]).addClass('active');
			var lineHeightLayer =$('#lineHeightLayer .numberList').find('li')
			lineHeightLayer.find('button').removeClass('active');
			$(lineHeightLayer.find('button')[0]).addClass('active');
		}

		function findIdx(val,selectBox) {
			var idx = null;
			$("#"+selectBox).find('option').each(function(i) {
				var thisVal = $(this).val();
				if ( thisVal == val ) {
					idx = i;
				}
			});
			return idx;
		}


		function textBoxClick(textBox){
			var fontUiSelect = $('.uiDesignSelect-wrap.uiDesignSelect1.fontControl')
				,fontUiSelectTrigger = fontUiSelect.find('.uiDesignSelect-optionList').find('a')
				,sizeUiSelect = $('.uiDesignSelect-wrap.uiDesignSelect2.fontControl')
				,sizeUiSelectTrigger = sizeUiSelect.find('.uiDesignSelect-optionList').find('a')

			var font = $(textBox.node).css('font-family').replace(/\'/g,'');
			var spacing = $(textBox.node).css('letter-spacing').replace('px','');
			var size = $(textBox.node).find('text')[0].style.fontSize.replace('pt','');
			var lineHeight = parseFloat((textBox.attr("data-lineheight") != null) ? textBox.attr("data-lineheight") : textBox.attr("data-lineHeight"));
			lineHeight = lineHeight == null ? 0 : lineHeight;
			fontUiSelectTrigger.eq(findIdx(font,'fontFamily')).trigger('change');
			if(findIdx(size,'fontSize') == null){
				$(".uiDesignSelect2 .uiDesignSelect-text").html(size);
				$(".uiDesignSelect2 .uiSelect-active").removeClass("uiSelect-active");
				
				//input box font size 직접입력값 조절
				$("input.numberSize").val(size);

			} else {
				sizeUiSelectTrigger.eq(findIdx(size,'fontSize')).trigger('change');
				
				//input box font size 직접입력값 조절
				$("input.numberSize").val(size);
			}
			var spacingList =$('#letterSpacingLayer .numberList').find('li')
			$('#letterSpacingLayer .numberList li').find('button').removeClass('active');
			
			$(spacingList).each(function(){
				var num = $(this).find('button').text();
				if(num == spacing)$(this).find('button').addClass('active');
			});

			var lineHeightLayer =$('#lineHeightLayer .numberList').find('li')
			$('#lineHeightLayer .numberList li').find('button').removeClass('active');
			
			$(lineHeightLayer).each(function(){
				var num = $(this).find('button').text();
				if(num == lineHeight)$(this).find('button').addClass('active');
			});
		}

		function textBoxDblClick(e){
			var subString = getTextData(KTCE.currentPaper.currentShape);
			var selectedPos = getSelectedPos(e, KTCE.currentPaper.currentShape);
			setTextMode(KTCE.currentPaper.currentShape, subString, selectedPos)
		}

		function getTextData(obj){
			if(obj.attr('class') == "cellTextWrapper"){
				var subStringArray = $("."+ obj.parent().attr('class').split(' ')[1] +" #"+obj.node.id).find('text');
			} else {
				var subStringArray = $("#"+obj.node.id).find('text');
			}		
			var subString = '';
			for(var i=0; i<subStringArray.length; i++){
				var tempSubString = '';

				if($(subStringArray[i]).find("tspan").length > 0){
					tempSubString = $($(subStringArray[i]).find("tspan")[1]).text();
				} else {
					tempSubString = $(subStringArray[i]).text();
					if(obj.attr("bullet-num") == null || obj.attr("bullet-num") == "0"){
						
					}else{
						
						var currentBulletText = tempSubString.substring(0,2);
						for(var b=0; b<bulletArray.length; b++){
							var bulletText = bulletArray[b];
							if(currentBulletText == bulletText) {
								tempSubString = tempSubString.split(currentBulletText)[1];
								break;
							}
						}
					}
				}
				
				subString += tempSubString;
				if(i != subStringArray.length - 1) subString += "\n"
			}
			return subString;
		}

		function getCellTextData(obj){
			var subStringArray = $("#"+obj.node.id).find('text');
			var subString = '';
			for(var i=0; i<subStringArray.length; i++){
				var tempSubString = '';

				if($(subStringArray[i]).find("tspan").length > 0){
					tempSubString = $($(subStringArray[i]).find("tspan")[1]).text();
				} else {
					tempSubString = $(subStringArray[i]).text();
				}
				
				subString += tempSubString;
				if(i != subStringArray.length - 1) subString += "\n"
			}
			return subString;
		}


		function getSelectedPos(e, obj){
			var point = KTCE.currentPaper.s.node.createSVGPoint();
			var left = calLeft(obj) + 5;
			var top = calTop(obj) + (obj.getBBox().height / obj.selectAll('text').length - 10);
			var initPos = {
				x : obj.attr("data-lineposx"),
				y : obj.attr("data-lineposy")
			};
			
			var disX = left - initPos.x;
			var disY = top - initPos.y;

			//canvas 확대/축소에 따른 마우스클릭 위치 및 비율확인
			var svgScale = $(KTCE.currentPaper.s.node).css("scale");
			point.x = (e.layerX - disX) / svgScale;
			point.y = (e.layerY - disY) / svgScale;
			
			for(var i=0; i<obj.selectAll('text').length; i++){
				var pos = obj.selectAll('text')[i].node.getCharNumAtPosition(point)
				if(pos != -1){
					break;
				}						
			}
			if(pos != -1){
				if(obj.attr("bullet-num") == null || obj.attr("bullet-num") == "0"){
					var selectedPos = {
						row : i,
						tcol : pos,
						col : pos
					}
				} else {
					var selectedPos = {
						row : i,
						tcol : (pos - bulletArray[obj.attr("bullet-num")].length < 0) ? 0 : pos - bulletArray[obj.attr("bullet-num")].length,
						col : pos
					}
				}
				
			}
			return selectedPos;
		}

		function textAreaEventHandler(obj, e){	
			if(e.keyCode == 13){
				var bNum = KTCE.currentPaper.currentShape.select(".textLine").attr("bullet-num");
				if(bNum != null && bNum != 0){
					var subStr = $(e.target).val();
					var curPos = e.target.selectionStart;					
					$(e.target).val(subStr.replaceAt(curPos-1, "\n" + bulletArray[parseFloat(bNum)]));
					e.target.setSelectionRange(curPos+bulletArray[parseFloat(bNum)].length,curPos+bulletArray[parseFloat(bNum)].length);
				}
				var textArray = $(e.target).val().split("\n");
				makeTextSvgObj(KTCE.currentPaper.currentShape, textArray, false)
			} else{
				var textArray = $(e.target).val().split("\n");
				makeTextSvgObj(KTCE.currentPaper.currentShape, textArray, false)
			}
		}
		
		//input box focus event 발생 함수
		function setCaretPosition(_id, _pos) {
			var el = document.getElementById(_id);
			setTimeout(function(){
				if(el != null) {
					if(el.createTextRange){
						var range = el.createTextRange();
						//text 수정시 cursor 위치 및 편집위치
						//원본
						//range.move('character', _pos);
						range.select();
					}else{
						if(el.selectionStart) {
							el.focus();
							el.setSelectionRange(_pos, _pos);
						}else{
							el.focus();
						}
					}
				}
			}, 10);
		}
	
		var id_textarea_inputEvent = undefined;
		function setTextMode(obj, txt, initCursorPos){
			try{
				//잠금 텍스트 편집금지
				if(obj.freeTransform.isLock(obj)) {
					alert('잠금상태에서는 텍스트 편집기능이 지원하질 않습니다!\n잠금해제후 텍스트를 편집하세요.')
					return;
				}
			}catch(e){}
			
			//그룹객체 텍스트 편집금지
			if($(obj.node).attr('data-name') == 'objectGroup') {
				alert('그룹지정 상태에서는 텍스트 편집기능이 지원하질 않습니다!\n그룹해제후 텍스트를 편집하세요.')
				return;
			}

			var tempTxt = (txt == undefined ? '' : txt);
			$("#temp_textarea").val(tempTxt).focus();
	
			//ie 초기 input foucs 유지
			if(browserType.indexOf('msie') > -1){	//IE
				var focusInColIdx = (initCursorPos == undefined ? 0 : initCursorPos.tcol)
				setCaretPosition('temp_textarea', focusInColIdx);
			}
			
			$("#temp_textarea")[0].removeEventListener('input', id_textarea_inputEvent, false);
			$("#temp_textarea")[0].addEventListener('input', id_textarea_inputEvent = function(e){
				textAreaEventHandler(obj, e);
			}, false);
			

			//ie 초기 input foucs 유지
			if(browserType.indexOf('msie') > -1){	//IE
				$("#temp_textarea").hide();
				$("#temp_textarea").show();
			}
			$("#temp_textarea").css({'z-index': '-1', 'position': 'absolute', 'left': '-1000px'});
			setTimeout(function(e){
				$("#temp_textarea").focus();
			},10);
			
			$("#temp_textarea").unbind("keyup").bind("keyup", function(e){
				if(e.keyCode >= 37 && e.keyCode <=40){
					updateCursorPos(obj);
				}
				//Home(36), End(35)
				if(e.keyCode == 35 | e.keyCode == 36){
					updateCursorPos(obj);
				}
			});

			if(initCursorPos != undefined){
				var textArray = $("#temp_textarea").val().split("\n");
				var prevLen = 0;
				for(var j=0; j<initCursorPos.row; j++){
					prevLen += textArray[j].length + 1;
				}
				var focusePos = prevLen + initCursorPos.tcol;
				$("#temp_textarea")[0].setSelectionRange(focusePos,focusePos);	
			}
			textEditMode = true;

			var cursor = obj.select('.text-cursor').children()[0];		
			if(obj.select('.text-cursor').attr("display") == "none") obj.select('.text-cursor').attr('display', 'block');			
			cursor.attr("visibility", 'visible');
			if(tcInterval != null || tcInterval != undefined){
				clearInterval(tcInterval);
				tcInterval = null;
			}
			tcInterval = setInterval(function(){
				if(cursor.attr('visibility') == 'visible'){
					cursor.attr('visibility', 'hidden');
				} else {
					cursor.attr('visibility', 'visible');
				}
			}, 500);
			updateCursorPos(obj, initCursorPos);
		}

		function clearTextMode(obj){
			clearInterval(tcInterval);
			tcInterval = null;
			try{
				obj.select('.text-cursor').children()[0].attr("visibility", 'hidden');
				textEditMode = false;		
				$("#temp_textarea").val('').unbind("keyup");
			} catch(err){
				console.log('err:', err);	
			}
		}

		function clearTableInputMode(obj){
			clearInterval(tcInterval);
			tcInterval = null;
			if(obj.select('.text-cursor') != null)
			obj.select('.text-cursor').children()[0].attr("visibility", 'hidden');
			$("#temp_textarea").val('').unbind("keyup");
			textCellEditMode = false;
		}

		function makeTextSvgObj(target, LineArray, flagSave){
			if(target != null){
				var textBoxPos = {
					x : target.attr("data-lineposx"),
					y : target.attr("data-lineposy")
				};
				var tempTextBox = target.select('text');
				//var textStyle = target.select('text').attr("style");
				try{
					var textStyle = target.select('text').attr("style");
				}catch(err){
					
				}
				while(1){
					var textArray = target.select('text');
					if(textArray != null) textArray.remove();
					else break;
				}
				y = parseFloat(textBoxPos.y);
				var bulletNum = target.attr("bullet-num");
				for(var i=0; i<LineArray.length; i++){
					var inputSentence = LineArray[i];
					if(inputSentence.length == 0){
						inputSentence = ' ';
					} 
					
					//TEXT수정에 따른 shadow(filter)효과 사라지는 현상 해소
					if(target.select('.textLine') != undefined) {
						if(bulletNum == null || bulletNum == '0'){
							var inputedTextLine = target.select('.textLine').text(textBoxPos.x, y,inputSentence).attr('class','textBox basic').attr("style", textStyle);
						} else {
							var inputedTextLine = target.select('.textLine').text(textBoxPos.x, y,[bulletArray[bulletNum],inputSentence]).attr('class','textBox basic').attr("style", textStyle);
						}
						y = y + inputedTextLine.getBBox().height;
					}
					
				}
									
				if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
					$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
						if ( el.hasClass( 'textBoxWrap' ) ) {
							fnUpdateTextPosY( el);
							fnTextBBoxUpdate( el, flagSave);
						}
					});
				}else{
					fnUpdateTextPosY( KTCE.currentPaper.currentShape);
					fnTextBBoxUpdate( KTCE.currentPaper.currentShape, flagSave);
				}

			}
		}

		function updateCursorPos(obj, pos) {

			// 그룹객체 텍스트 편집 금지
			if($(obj.node).attr('data-name') === "objectGroup") return;

			//표안 텍스트모드 미사용
			if($(obj.node).attr('data-name') === "xTable") return;			
			if(pos == undefined){
				var cursorPos = $('textarea').get(0).selectionStart
				var prevLine = $('textarea').get(0).value.substr(0, $('textarea').get(0).selectionStart).split("\n");
				var cursorRow = prevLine.length
				var prevLength = 0;
				for(var i=0; i<cursorRow-1; i++){
					prevLength += prevLine[i].length
				}

				if(obj.attr("bullet-num") == null || obj.attr("bullet-num") == "0"){
					var pos = {
						row : cursorRow-1,
						col : cursorPos - prevLength - (cursorRow - 1),
						tcol : cursorPos - prevLength - (cursorRow - 1)
					}
				} else {
					var pos = {
						row : cursorRow-1,
						col : cursorPos - prevLength - (cursorRow - 1) + bulletArray[obj.attr("bullet-num")].length,
						tcol : cursorPos - prevLength - (cursorRow - 1)
					}
				}

				
			}
			var textLine = obj.select('.textLine');
			var tempBoxPos = {
				x : obj.attr("data-lineposx"),
				y : obj.attr("data-lineposy")
			}

			var targetTextObj = textLine.children()[pos.row];
			// 그룹객체
			if(targetTextObj == undefined) return;

			var targetText = targetTextObj.node.textContent;
			var tempText = targetText.substr(0, pos.col);
			var fontSize = textLine.children()[pos.row].attr("style");
			var tempTextObj = textLine.text(targetTextObj.getBBox().x, tempBoxPos.y, tempText).attr('class', 'textBox').attr("style", fontSize);
			var cursor = obj.select(".text-cursor").children();
			cursor[0].attr('x1', targetTextObj.getBBox().x + tempTextObj.getBBox().width)
					 .attr('y1', targetTextObj.getBBox().y)
					 .attr('x2', targetTextObj.getBBox().x + tempTextObj.getBBox().width)
				     .attr('y2', targetTextObj.getBBox().y + targetTextObj.getBBox().height)
			tempTextObj.remove();
			if(textEditMode){
				$('textarea').focus();
			}
			

		}

		// 텍스트 일부 선택 구간 생성
		function fnCreateTspan(obj) {

		}

		// 선택된 셀 찾기
		function fnGetSelectedCell( $table ) {
			var cellArray = $table.find('rect.xCellHover[data-active="active"]');
			return cellArray;
		}

		// 테이블 좌표를 기준으로 텍스트 찾기
		function fnGetSelectedText( $table, $x, $y ) {
			var text;

			$table.find( 'text' ).each( function( $textIndex, $textElement ) {
				$textElement = $( $textElement );
				if( $textElement.data( 'indexX' ) == $x && $textElement.data( 'indexY' ) == $y ) {
					text = $textElement.get( 0 );
				}
			} );

			return text;
		}

		// 선택된 셀 찾아서 텍스트까지 한번에 찾고 반환
		function fnFindText( $table ) {
			var cell = fnGetSelectedCell( $table );
			cell = $( cell );
			var indexX = cell.data( 'indexX' );
			var indexY = cell.data( 'indexY' );
			var text = fnGetSelectedText( $table, indexX, indexY );

			return text;
		}


		// 테이블 좌표를 기준으로 텍스트 Group(wrapper) 찾기
		function fnGetSelectedTextGroup( tableObj, cell ) {
			var textWrapperForTable =  KTCE.currentPaper.s.select("g.xTableTexts_" + tableObj.attr("id"))
			var textG = undefined;
			if(textWrapperForTable != null){
				var textWrapperArray = textWrapperForTable.selectAll("g.cellTextWrapper");
				var targetCell = $(cell);
				var mergeData = targetCell.attr("data-merge");
				if(mergeData != undefined){
					var mergeArray = mergeData.split(",");
					var targetTable = undefined;
					var tableArrayLength = KTCE.currentPaper.tableArray.length;
					for(var k=0; k<tableArrayLength; k++){
						var tableArrayId = KTCE.currentPaper.tableArray[k].id;
						var tableObjId = tableObj.attr("id");
						if(tableArrayId == tableObjId){
							targetTable = KTCE.currentPaper.tableArray[k];
							break;
						}
					}
					targetCell = $(targetTable.cellHoverArray[mergeArray[0]].node);
				}
				var textWrapperArrayLength = textWrapperArray.length;
				for(var j=0; j<textWrapperArrayLength; j++){
					var dataCellx = textWrapperArray[j].attr('data-cellx');
					var dataCelly = textWrapperArray[j].attr('data-celly');
					var indexX = targetCell.data( 'indexX' );
					var indexY = targetCell.data( 'indexY' );
					if( dataCellx == indexX && dataCelly == indexY ) {
						textG = textWrapperArray[j];
						break;
					}
				}
			}
			return textG;
		}

		// 선택된 셀 찾아서 텍스트까지 한번에 찾고 반환
		function fnFindTextGroup( tableObj ) {
			var cellArray = $(tableObj.node).find('rect.xCellHover[data-active="active"]');
			var cellArrayLength = cellArray.length;
			var textArray = new Array();
			for(var i=0; i<cellArrayLength; i++){
				var text = fnGetSelectedTextGroup( tableObj, cellArray[i]);
				if(text != undefined && text != null){
					var textArrayLength = textArray.length;
					for(var j=0; j < textArrayLength; j++){
						if(textArray[j].node.id == text.node.id) break;
					}
					if(j == textArrayLength) textArray.push(text);
				}
			}
			return {
				cellArray : cellArray,
				textArray : textArray
			};
		}


		function applyStyleDataInMerge(strMerge, tId, attrName, attrValue){
			var mergeArray = strMerge.split(",");
			var targetTable = undefined;
			for(var k=0; k<KTCE.currentPaper.tableArray.length; k++){
				if(KTCE.currentPaper.tableArray[k].id == tId){
					targetTable = KTCE.currentPaper.tableArray[k];
					break;
				}
			}
			for(var k=0; k<mergeArray.length; k++){
				if(targetTable == undefined ) break;				
				$(targetTable.cellHoverArray[mergeArray[k]].node).attr(attrName, attrValue)
			}
		}

		
		// 셀 내 텍스트 굵기
		function fnCellFontWeight( tableObj ) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						var cell = cellArray[i];
						if ( $(cell).attr("data-font-weight") == undefined || $(cell).attr("data-font-weight") == 'normal' ) {
							$(cell).attr("data-font-weight", "bold")
						} else {
							$(cell).attr("data-font-weight", "normal")
						}
						if($(cell).attr("data-merge") != undefined){
							applyStyleDataInMerge($(cell).attr("data-merge"), tableObj.id, "data-font-weight", $(cell).attr("data-font-weight"));						
						}
					}
				}
									
				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];						
						if($(textG.node).css("font-weight") == 'bold' || $(textG.node).css("font-weight") == 700){							
							$(textG.node).css({
								'font-weight' : 'normal'
							})
						} else {
							$(textG.node).css({
								'font-weight' : 'bold'
							});
						}
						//fnCellTextUpdate(getTextData(textG), textG);
					}
					
					KTCE.updateData(KTCE.currentPaper.currentShape, KTCE.currentPaper.currentShape.freeTransform.attrs);
					fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);
					
					//글꼴사이즈 변경시 vertical align 유지, 주의) 위 fnCellTextUpdate()함수에 포함하질 말것(반복실행에 다른 느려짐)
					fnCellTextVerticalAlign('newLine');
					
					fnSaveState();
				}
				
			}
		}
		
		function fnCellFontItalic( tableObj ) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						var cell = cellArray[i];
						if ( $(cell).attr("data-font-style") == undefined || $(cell).attr("data-font-style") == 'normal' ) {
							$(cell).attr("data-font-style", "italic")
						} else {
							$(cell).attr("data-font-style", "normal")
						}
					}
				}

				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
												
						if ( $(textG.node).css("font-style") == 'italic' ) {
							textG.attr({
								'font-style' : 'normal'
							});
						} else {
							$(textG.node).css({
								'font-style' : 'italic'
							});
						}
					}
					
					KTCE.updateData(KTCE.currentPaper.currentShape, KTCE.currentPaper.currentShape.freeTransform.attrs);
					fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);
					
					fnSaveState();
				}
					
			}
		}	

		// 셀 내 텍스트 언더라인
		function fnCellTextUnderline(tableObj) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						var cell = cellArray[i];
						if ( $(cell).attr("data-text-decoration") == undefined || $(cell).attr("data-text-decoration") == 'none' ) {
							$(cell).attr("data-text-decoration", "underline")
						} else {
							$(cell).attr("data-text-decoration", "none")
						}
					}
				}
				
				if(textArray.length > 0){
					fnSetCellUnderline(textArray, true);
					fnSaveState();
				}
							
			}
		}


		// 셀 내 텍스트 쉐도우
		function fnCellTextShadow(tableObj) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						var cell = cellArray[i];
						if ( $(cell).attr("data-text-shadow") == undefined || $(cell).attr("data-text-shadow") == 'none' ) {
							$(cell).attr("data-text-shadow", "2px 2px 2px #333")
						} else {
							$(cell).attr("data-text-shadow", "none")
						}
					}
				}

				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						if ( $(textG.node).css("text-shadow") == 'none' ) {
							$(textG.node).css({
								'text-shadow' : '2px 2px 2px #333'
							});
						} else {
							$(textG.node).css({
								'text-shadow' : 'none'
							});
						}
						fnCellTextUpdate(getTextData(textG), textG);
						
						//글꼴사이즈 변경시 vertical align 유지, 주의) 위 fnCellTextUpdate()함수에 포함하질 말것(반복실행에 다른 느려짐)
						fnCellTextVerticalAlign('newLine');
						
					}
					fnSaveState();
				}
			}
		}

		function fnCellFontSize(tableObj, px) {
			
			try {
				if( tableObj.freeTransform.isLock(tableObj) ) {
					alert('잠금객체는 글꼴 사이즈 변경하기가 지원하질 않습니다!');
					return;
				}
			}catch(e){}
			
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				var cellArrayLength = cellArray.length;
				if(cellArrayLength > 0){
					for(var i=0; i<cellArrayLength; i++){
						$(cellArray[i]).attr("data-font-size", px);
					}
				}
				
				var textArrayLength = textArray.length;
				if(textArrayLength > 0){
					for(var i=0; i<textArrayLength; i++){
						var textG = textArray[i];
						var itemArray = $(textG.node).find('text');
						var itemArrayLength = itemArray.length;
						for(var j=0; j<itemArrayLength; j++){
							$(itemArray[j]).css("font-size", px + 'pt');
						}
					}

					//2016-10-20 add
					//fnCellTextArrayUpdate(textArray);
					fnCellTextArrayUpdate(textArray, 'update');
					
					KTCE.updateData(KTCE.currentPaper.currentShape, KTCE.currentPaper.currentShape.freeTransform.attrs);
					fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);

					fnSaveState();
				}
			}
		}
		

		function fnCellfontSizeChnge(tableObj, flag){
			
			try {
				if( tableObj.freeTransform.isLock(tableObj) ) {
					alert('잠금객체는 글꼴 사이즈 변경하기가 지원하질 않습니다!');
					return;
				}
			}catch(e){}
			
			var addSize = 0;
			switch(flag){
			case "up":
				addSize = 1;
				break;
			case "down":
				addSize = -1;
				break;
			}
			var selectedArray = fnFindTextGroup( tableObj );
			var modifySize = undefined;
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						var selfSize = 	parseFloat($(cellArray[i]).attr("data-font-size") == null ? 20 : $(cellArray[i]).attr("data-font-size"));
						modifySize = selfSize + addSize;
						$(cellArray[i]).attr("data-font-size", selfSize + addSize);
					}
				}
				
				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						var itemArray = textG.selectAll('text');
						for(var j=0; j<itemArray.length; j++){
							var selfSize = 	parseFloat(itemArray[j].attr("style").split(":")[1].split("p")[0]);
							itemArray[j].attr("style", "font-size:" + (selfSize + addSize) + "pt");
						}						
					}
					
					//2016-10-20 add
					//fnCellTextArrayUpdate(textArray);
					fnCellTextArrayUpdate(textArray, 'update');
					
					KTCE.updateData(KTCE.currentPaper.currentShape, KTCE.currentPaper.currentShape.freeTransform.attrs);
					fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);
										
					fnSaveState();
				}
				
				if(cellArray.length == 1){
					$(".uiDesignSelect2 .uiDesignSelect-text").html(modifySize);
					$(".uiDesignSelect2 .uiSelect-active").removeClass("uiSelect-active");
					
					//input box font size 직접입력값 조절
					$("input.numberSize").val(modifySize);
				}
			}
		}

		function fnCellFontFamily(tableObj, family) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						$(cellArray[i]).attr("data-font-family", family);
					}
				}
				
				if(textArray.length > 0){
					var textG;
					textArray.forEach(function(el, idx){
						textG = el;
						$(textG.node).css({
							'font-family' : family
						});
					});
					
					setTimeout(function(e){
						fnCellTextVerticalAlign('newLine');
						fnCellTextArrayUpdate(textArray, 'update');	
						KTCE.updateData(KTCE.currentPaper.currentShape, KTCE.currentPaper.currentShape.freeTransform.attrs);
						fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);
						fnSaveState();
					}, 100)
				}
			}
		}

		function fnCellFontColor(tableObj, color) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						$(cellArray[i]).attr("data-font-color", color);
					}
				}
				
				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						$(textG.node).css({
							fill : color
						});						
						textG.selectAll('line').attr({"stroke" : color});
					}
					fnSaveState();
				}
			}	
		}


		function fnCellLetterSpacing(tableObj, px) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						$(cellArray[i]).attr("data-letter-spacing", px);
					}
				}
				
				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						$(textG.node).css({
							'letter-spacing' : px + 'px'
						});
					}
					
					//2016-10-20 add
					//fnCellTextArrayUpdate(textArray);
					fnCellTextArrayUpdate(textArray, 'update-letter-spacing');
					
					fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);
					
					//fnCellTextVerticalAlign('newLine');
					setTimeout(function(){
						fnSaveState();
					}, 10);
					
					//fnSaveState();
				}
			}
		}

		// 셀 내 행간
		function fnCellLineHeight(tableObj, px) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){	
						$(cellArray[i]).attr("data-lineheight", px);
					}
				}

				var textArrayLength = textArray.length;
				if(textArrayLength > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						textG.attr("data-lineheight", px);
						var text = textG.selectAll('text');
						var line = textG.selectAll('line');
						var textLength = text.length;
						if(textLength>1){
							var _y = parseFloat(text[0].attr('y'));
							text.forEach(function(el, idx){
								var textY = parseFloat(el.attr('y'));
								var newTextY = _y + (el.getBBox().height*idx) + (px*idx);
								el.attr('y', newTextY);
								
								var currentLine = line[idx];
								if(currentLine != undefined) {
									var lineY = parseFloat(currentLine.attr('y1'));
									var lineNewY = newTextY + (lineY - textY);
									currentLine.attr({'y1': lineNewY, 'y2': lineNewY});
								}
							});
						}
					}
					
					fnCellTextArrayUpdate(textArray, 'update');
					
					fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);		
					
					setTimeout(function(){
						fnSaveState();
					}, 10);
					
				}
			}
		}

		//textArray: 표내 해당셀만 텍스트 정렬
		function fnCellTextAlign(tableObj, align, textG, saveFlag, _selectedArray) {
			fnSetTableCellMargin(KTCE.currentPaper);
			
			var selectedArray = null;
			if(tableObj != undefined) {
				if(_selectedArray != undefined) {
					selectedArray = _selectedArray;
				}else{
					selectedArray = fnFindTextGroup( tableObj );
				}
				
			}
					
			if(selectedArray != undefined){				
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				
				if(cellArray.length <=0){	//표 전체선택시
					KTCE.currentPaper.currentShape.selectAll('rect.xCellHover').forEach(function(el, idx){
						cellArray.push(el.node)
					});
					
					var tableTextWrapper =  KTCE.currentPaper.s.select("g.xTableTexts_" + KTCE.currentPaper.currentShape.node.id);
					if(tableTextWrapper !=null) {
						textArray = tableTextWrapper.selectAll("g.cellTextWrapper");
					}					
				}
				
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						
						if(align[0].length > 1){
							$(cellArray[i]).attr("data-text-align", align[i]);
						}else{
							$(cellArray[i]).attr("data-text-align", align);
						}
					}
				}
				if(textArray.length > 0){
					var textG = textG;//textArray[i];
					var wordIdx = {
						indexX : textG.data().indexX,
						indexY : textG.data().indexY
					};
					var objTable = undefined;
					for(var k=0; k<KTCE.currentPaper.tableArray.length; k++){
						if(textG.data().pId == KTCE.currentPaper.tableArray[k].id){
							objTable = KTCE.currentPaper.tableArray[k];
							break;
						}
					}
					var cellIdx = objTable.length.x * wordIdx.indexY + wordIdx.indexX;
					var targetCell = objTable.cellHoverArray[cellIdx];
					var cellBound = getCellBound(targetCell, objTable);
					
					textG.attr("text-align", align);
					var itemArray = textG.selectAll('text');
					var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
					var targetCellLeft = parseFloat($(targetCell.node).position().left);
					var svgScale = $(KTCE.currentPaper.s.node).css("scale");

					//표내 텍스트 여백값 구하기						
					var _yLineLeft = tableObj.select("line.yLine.x" + wordIdx.indexX + "_y" + wordIdx.indexY);
					var _strokeLeftWidth = parseFloat($(_yLineLeft.node).attr('data-stroke-width'))/2;
					var _yLineRight = tableObj.select("line.yLine.x" + (wordIdx.indexX + 1) + "_y" + wordIdx.indexY);
					var _strokeRightWidth = parseFloat($(_yLineRight.node).attr('data-stroke-width'))/2;
					
					//switch(newAlign) {
					switch(align) {		
						case 'left' :
							for(var j=0; j< itemArray.length; j++){
								var text = itemArray[j];
								var tapMove = text.attr("data-tap") * 10;
								// table내 텍스트  위치 조정
								if(browserType.indexOf('msie') != -1){
									//var _x = (targetCellLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft - _strokeLeftWidth) - tableTextDisPos.svgMargin.left) / svgScale + tapMove;
									var _x = ((targetCellLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + tapMove) + _strokeLeftWidth;
									text.attr("x", _x);
								}else {
									//var _x = (targetCellLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft - _strokeLeftWidth) - tableTextDisPos.svgMargin.left) / svgScale + tapMove;
									var _x = ((targetCellLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + tapMove) + _strokeLeftWidth;
									text.attr("x", _x);
								}
							}
							break;
						case 'right' :								
							for(var j=0; j< itemArray.length; j++){
								var text = itemArray[j];
								var tapMove = text.attr("data-tap") * 10;
								var selfW = parseFloat(text.getBBox().width);
								var relativePos = cellBound.width-selfW;
								if(relativePos < 0) relativePos = 0;
								//text.attr("x", targetCellLeft/ svgScale + relativePos + tapMove);
								
								var _fontSize = parseInt($(text.node).css('font-size'));
								var rightMargin = fnIECellTextItalicMargin(textG.node, _fontSize, 1);
								// table내 텍스트  위치 조정
								if(browserType.indexOf('msie') != -1){
									var _x = (((targetCellLeft - (tableTextDisPos.ie.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove) + rightMargin) - _strokeLeftWidth;
									text.attr("x", _x);
								}else {
									//var _x = (targetCellLeft - (tableTextDisPos.chrome.x + tableTextDisPos.textMarginLeft + _strokeLeftWidth) - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove;
									var _x = ((targetCellLeft - (tableTextDisPos.chrome.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove) - _strokeLeftWidth;
									text.attr("x", _x);
								}
							}
							break;
						case 'center' :
							for(var j=0; j< itemArray.length; j++){
								var text = itemArray[j];
								var tapMove = text.attr("data-tap") * 10;
								var selfW = parseFloat(text.getBBox().width);
								var relativePos = (cellBound.width-selfW)/2;
								if(relativePos < 0) relativePos = 0;
								
								var _fontSize = parseInt($(text.node).css('font-size'));
								var rightMargin = fnIECellTextItalicMargin(textG.node, _fontSize, 2);
	
								// table내 텍스트  위치 조정
								if(browserType.indexOf('msie') != -1){
									var _x = ((targetCellLeft - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove) + rightMargin;
									text.attr("x", _x);
									
								}else {
									var _x = (targetCellLeft - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove;
									text.attr("x", _x);
								}
	
							}
					}
					if(textCellEditMode) updateCellCursorPos(textG);
					
				}
				
				if (textG.attr("data-text-underline") === "underline" && textArray.length > 0) {
					//fnSetCellUnderline(textArray);
					fnSetCellUnderline(new Array(textG));
				}
			
				if(align[0].length > 1 || !saveFlag){
					
				}else{
					fnSaveState();
				}
			}
		}
		

		//textArray: 표내 다중 텍스트 정렬
		function fnCellTextArrayAlign(tableObj, align, saveFlag, _selectedArray) {
			
			fnSetTableCellMargin(KTCE.currentPaper);

			if(tableObj != undefined) {
				if(_selectedArray != undefined) {
					selectedArray = _selectedArray;
				}else{
					selectedArray = fnFindTextGroup( tableObj );
				}
				
			}
					
			if(selectedArray != undefined){				
				var cellArray = selectedArray.cellArray;
				var textArray = selectedArray.textArray;
				
				if(cellArray.length <=0){	//표 전체선택시
					KTCE.currentPaper.currentShape.selectAll('rect.xCellHover').forEach(function(el, idx){
						cellArray.push(el.node)
					});
					
					var tableTextWrapper =  KTCE.currentPaper.s.select("g.xTableTexts_" + KTCE.currentPaper.currentShape.node.id);
					if(tableTextWrapper !=null) {
						textArray = tableTextWrapper.selectAll("g.cellTextWrapper");
					}					
				}
				
				if(cellArray.length > 0){
					for(var i=0; i<cellArray.length; i++){
						
						if(align[0].length > 1){
							$(cellArray[i]).attr("data-text-align", align[i]);
						}else{
							$(cellArray[i]).attr("data-text-align", align);
						}						
					}
				}
				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						
						if(textG === undefined) return;
						
						var wordIdx = {
							indexX : textG.data().indexX,
							indexY : textG.data().indexY
						};
						var objTable = undefined;
						for(var k=0; k<KTCE.currentPaper.tableArray.length; k++){
							if(textG.data().pId == KTCE.currentPaper.tableArray[k].id){
								objTable = KTCE.currentPaper.tableArray[k];
								break;
							}
						}
						var cellIdx = objTable.length.x * wordIdx.indexY + wordIdx.indexX;
						var targetCell = objTable.cellHoverArray[cellIdx];
						var cellBound = getCellBound(targetCell, objTable);
						
						var newAlign = null;
						if(align[0].length > 1){
							newAlign = align[i];
						}else{
							newAlign = align;
						}
						textG.attr("text-align", newAlign);
						
						var itemArray = textG.selectAll('text');
						var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
						var targetCellLeft = parseFloat($(targetCell.node).position().left);
						var svgScale = $(KTCE.currentPaper.s.node).css("scale");
			
						//표내 텍스트 여백값 구하기						
						var _yLineLeft = tableObj.select("line.yLine.x" + wordIdx.indexX + "_y" + wordIdx.indexY);
						var _strokeLeftWidth = parseFloat($(_yLineLeft.node).attr('data-stroke-width'))/2;
						var _yLineRight = tableObj.select("line.yLine.x" + (wordIdx.indexX + 1) + "_y" + wordIdx.indexY);
						var _strokeRightWidth = parseFloat($(_yLineRight.node).attr('data-stroke-width'))/2;
						
						switch(newAlign) {
							case 'left' :
								for(var j=0; j< itemArray.length; j++){
									var tapMove = itemArray[j].attr("data-tap") * 10;
									// table내 텍스트  위치 조정
									if(browserType.indexOf('msie') != -1){
										var _x = ((targetCellLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + tapMove) + _strokeLeftWidth;
										itemArray[j].attr("x", _x);
									}else {
										var _x = ((targetCellLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + tapMove) + _strokeLeftWidth;
										itemArray[j].attr("x", _x);
									}
								}
								break;
							case 'right' :								
								for(var j=0; j< itemArray.length; j++){
									var tapMove = itemArray[j].attr("data-tap") * 10;
									var selfW = parseFloat(itemArray[j].getBBox().width);
									var relativePos = cellBound.width-selfW;
									if(relativePos < 0) relativePos = 0;

									var _fontSize = parseInt($(itemArray[j].node).css('font-size'));
									var rightMargin = fnIECellTextItalicMargin(textG.node, _fontSize, 1);
									// table내 텍스트  위치 조정
									if(browserType.indexOf('msie') != -1){
										var _x = (((targetCellLeft - (tableTextDisPos.ie.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove) + rightMargin) - _strokeLeftWidth; 
										itemArray[j].attr("x", _x);
									}else {
										var _x = ((targetCellLeft - (tableTextDisPos.chrome.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove) - _strokeLeftWidth;
										itemArray[j].attr("x", _x);
									}
								}
								break;
							case 'center' :
								for(var j=0; j< itemArray.length; j++){
									var tapMove = itemArray[j].attr("data-tap") * 10;
									var selfW = parseFloat(itemArray[j].getBBox().width);
									var relativePos = (cellBound.width-selfW)/2;
									if(relativePos < 0) relativePos = 0;

									var _fontSize = parseInt($(itemArray[j].node).css('font-size'));
									var rightMargin = fnIECellTextItalicMargin(textG.node, _fontSize, 2);

									// table내 텍스트  위치 조정
									if(browserType.indexOf('msie') != -1){
										var _x = ((targetCellLeft - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove) + rightMargin;
										itemArray[j].attr("x", _x);
									}else {
										itemArray[j].attr("x", (targetCellLeft - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos + tapMove);
									}
								}
						}
						if(textCellEditMode) updateCellCursorPos(textG);
						
					}
					
					if (textG.attr("data-text-underline") === "underline" && textArray.length > 0) {
                        fnSetCellUnderline(textArray);
                        //fnSetCellUnderline(new Array(textG));
                    }
					
					if(align[0].length > 1 || !saveFlag){
						
					}else{
						fnSaveState();
					}
				}
			}
		}


		//tab prev, next in table
		function fnCellTabMove(tableObj, opt) {
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var textArray = selectedArray.textArray;
				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						var itemArray = textG.selectAll('text');
						for(var j=0; j<itemArray.length; j++){
							
							if(itemArray[i] == undefined) return;
							
							if(itemArray[i].attr("data-tap") == null){
								itemArray[i].attr("data-tap", 0)
							}
							switch(opt) {
								case 'prev' :
									var tabMove = parseFloat(itemArray[i].attr("data-tap")) - 1
									if(tabMove < 0 ) tabMove = 0;
									break;
								case 'next' :
									var tabMove = parseFloat(itemArray[i].attr("data-tap")) + 1
									break;
							}
							itemArray[i].attr("data-tap", tabMove)
						}
						fnCellTextUpdate(getTextData(textG), textG);
					}
					fnSaveState();
				}
			}
		}

		function fnCelladdBulletPointList(tableObj, bullet){
			var bulletNum = bullet;
			var selectedArray = fnFindTextGroup( tableObj );
			if(selectedArray != undefined){
				var textArray = selectedArray.textArray;				
				if(textArray.length > 0){
					for(var i=0; i<textArray.length; i++){
						var textG = textArray[i];
						textG.attr("bullet-num", bulletNum);
						var newTextArray = textG.selectAll('text');
						newTextArray.forEach(function(el, idx){
							var _textContent = $(el.node).text();
							var currentBulletText = _textContent.substring(0,2);
							for(var b=0; b<bulletArray.length; b++){
								var bulletText = bulletArray[b];
								if(currentBulletText == bulletText) {
									var _textContent = _textContent.split(currentBulletText)[1];
									break;
								}
							}
							
							if(bulletNum == null || bulletNum == '0'){
								var _newContext = _textContent;
			                }else{
			                	var _newContext = bulletArray[bullet]+ _textContent;
			                }
							
							$(el.node).text(_newContext);
						});
					}
					
					//2016-10-20 add
					//fnCellTextArrayUpdate(textArray);
					fnCellTextArrayUpdate(textArray, 'update');
					
					fnUpdateTextPositionInTable( KTCE.currentPaper.currentShape.freeTransform, false);		
					
					//fnCellTextVerticalAlign('newLine');
					setTimeout(function(){
						fnSaveState();
					}, 10);				
				}				
			}		
		}


		// 텍스트 기능 바인딩
		function fnTextFunctions() {
			// font-weight
			trigger.fontWeight.on({
				click : function() {

					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {

							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnFontWeight(el)
									}
								});
							}else{
								fnFontWeight(KTCE.currentPaper.currentShape);
							}

						}
						else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							//fnCellFontWeight( KTCE.currentPaper.currentShape );
							
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'xTable' ) ) {
										fnCellFontWeight(el)
									}
								});
							}else{
								fnCellFontWeight( KTCE.currentPaper.currentShape );
							}

						}

					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnFontWeight(el)
							}
						});

					}
				}
			});

			// font-italic
			trigger.fontItalic.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {

							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnFontItalic(el)
									}
								});
							}else{
								fnFontItalic(KTCE.currentPaper.currentShape);
							}
						}
						else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							setTimeout(function(){
								fnCellFontItalic( KTCE.currentPaper.currentShape );
							}, 0);
						}
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnFontItalic(el)
							}
						});
					}

				}
			});

			// underline
			trigger.textUnderline.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnTextUnderline(el)
									}
								});
							}else{
								fnTextUnderline(KTCE.currentPaper.currentShape);
							}
						}
						else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							setTimeout(function(){
								fnCellTextUnderline(KTCE.currentPaper.currentShape);
							}, 0);
						}
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnTextUnderline(el)
							}
						});
					}
				}
			});

			// fontSize
			trigger.fontSize.change(function(e) {

				if ( KTCE.currentPaper.currentShape != null ) {
					var px = $(this).val() + 'pt';
					if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {
						//fnFontSize(KTCE.currentPaper.currentShape, px);
								
						if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
							$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
								if ( el.hasClass( 'textBoxWrap' ) ) {
									fnFontSize(el, px)
								}
							});
						}else{
							fnFontSize(KTCE.currentPaper.currentShape, px);
						}
							
					}
					else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {						
						//fnCellFontSize( KTCE.currentPaper.currentShape, $(this).val() );
						//비동기 처리
						var _size = $(this).val();
						setTimeout(function(e){
							fnCellFontSize( KTCE.currentPaper.currentShape, _size );
						}, 0)						
					}
					
				}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
					//selectedTextFlag
					var px = $(this).val() + 'pt';
					
					$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
						if ( el.hasClass( 'textBoxWrap' ) ) {
							fnFontSize(el, px)
						}
					});
					
				}
			});

			// fontFamily
			trigger.fontFamily.change(function(e) {
				var _this = this;
				setTimeout(function() {
					
					if ( KTCE.currentPaper.currentShape != null ) {
						var family = $(_this).val();
						var fontName = $(".uiDesignSelect-wrap.uiDesignSelect1.fontControl .uiDesignSelect-text").text();
						family = fngetFontFamily(fontName);
						$(_this).select('option:selected').val(family);

						if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnFontFamily(el, family)
									}
								});
							}else{
								fnFontFamily(KTCE.currentPaper.currentShape, family);
							}
						}
						else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							//fnCellFontFamily( KTCE.currentPaper.currentShape, family );
							setTimeout(function(e){
								fnCellFontFamily( KTCE.currentPaper.currentShape, family );
							}, 0);							
						}
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						//selectedTextFlag
						var family = $(_this).val();
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnFontFamily(el, family)
							}
						});
					}
				}, 300)
			});

			// text-shaodw
			trigger.fontShadow.on({
				click : function() {

					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnTextShadow($(KTCE.currentPaper.s.node), el);
									}
								});
							}else{
								fnTextShadow($(KTCE.currentPaper.s.node), KTCE.currentPaper.currentShape);
							}
						}else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {	//표 텍스트 그림자효과
							var activeCell = KTCE.currentPaper.currentShape.selectAll(".xCellHover[data-active='active']");
							var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));							
							activeCell.forEach(function(el, idx){
								var indexX = $(el.node).attr('data-index-x');
								var indexY = $(el.node).attr('data-index-y');
								//var cellTextWrapperId = "#text_" + indexX + "_" + indexY;
								var cellTextWrapperId = "#text" + _tableNumber + "_" + indexX + "_" + indexY + "_" + KTCE.currentPaper.currentShape.node.id;
								var tableTextWrapper = Snap($("g.xTableTexts_" + KTCE.currentPaper.currentShape.node.id)[0]);
								var cellTextWrapper = tableTextWrapper.select(cellTextWrapperId);
								fnTextShadow($(KTCE.currentPaper.s.node), cellTextWrapper);
							});							
						}

					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnTextShadow($(KTCE.currentPaper.s.node), el);
							}
						});
					}
					fnSaveState();
				}
			});

			// letter-spacing
			trigger.letterSpacing.each(function() {
				$(this).on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							var thisPx = $(this).html()

							if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {
								trigger.letterSpacing.removeClass('active');

								//멀티선택 text속성 적용
								if( KTCE.currentPaper.selectedShapeArray.length > 1 ){

									$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
										if ( el.hasClass( 'textBoxWrap' ) ) {
											el.addClass('active');
											fnLetterSpacing(el, thisPx)
										}
									});
								}else{
									$(this).addClass('active');
									fnLetterSpacing(KTCE.currentPaper.currentShape, thisPx);
								}
							}
							else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
								trigger.letterSpacing.removeClass('active');
								$(this).addClass('active');
								setTimeout(function(){
									fnCellLetterSpacing(KTCE.currentPaper.currentShape, thisPx)
								}, 0);
							}
						//멀티선택 text속성 적용
						}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
							var thisPx = $(this).html();
							trigger.letterSpacing.removeClass('active');
							$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
								if ( el.hasClass( 'textBoxWrap' ) ) {
									el.addClass('active');
									fnLetterSpacing(el, thisPx)
								}
							});

						}
					}
				});
			});

			// line-height
			trigger.lineHeight.each(function() {
				$(this).on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {
								var thisPx = $(this).html()
								trigger.lineHeight.removeClass('active');

								//멀티선택 text속성 적용 
								if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
									$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
										if ( el.hasClass( 'textBoxWrap' ) ) {
											el.addClass('active');
											el.attr("data-lineheight", thisPx);
											fnLineHeight(el, thisPx);
										}
									});
								}else{
									$(this).addClass('active');
									KTCE.currentPaper.currentShape.attr("data-lineheight", thisPx);
									fnLineHeight(KTCE.currentPaper.currentShape, thisPx);
								}
							}
							else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
								var thisPx = $(this).html()
								trigger.lineHeight.removeClass('active');
								$(this).addClass('active');
								fnCellLineHeight(KTCE.currentPaper.currentShape, thisPx)
							}
						//멀티선택 text속성 적용
						}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
							var thisPx = $(this).html();
							trigger.lineHeight.removeClass('active');
							$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
								if ( el.hasClass( 'textBoxWrap' ) ) {
									el.addClass('active');
									el.attr("data-lineheight", thisPx);
									fnLineHeight(el, thisPx)
								}
							});
						}
					}
				});
			});

			// font-color
			trigger.fontColor.each(function(){
				var _this = $(this);
				var thisColor = (getColorHex(_this)=='transparent') ? 'none' : getColorHex(_this);

				_this.on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {

								//멀티선택 text속성 적용 
								if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
									$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
										if ( el.hasClass( 'textBoxWrap' ) ) {
											fnFontColor(el, thisColor);
										}
									});
								}else{
									fnFontColor(KTCE.currentPaper.currentShape, thisColor);
								}

							}
							else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
								fnCellFontColor(KTCE.currentPaper.currentShape, thisColor);
							}
						// 멀티선택 text속성 적용
						}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
							$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
								if ( el.hasClass( 'textBoxWrap' ) ) {
									fnFontColor(el, thisColor)
								}
							});
						}
					}
				});
			});

			//tabPrev
			trigger.tabPrev.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
							if ( KTCE.currentPaper.currentShape.attr('class').indexOf('textBoxWrap') > -1 ) {

								// 멀티선택 text속성 적용
								if( KTCE.currentPaper.selectedShapeArray.length > 1 ){

									$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
										if ( el.hasClass( 'textBoxWrap' ) ) {
											fnTabMove(el, 'prev');
										}
									});
								}else{
									fnTabMove(KTCE.currentPaper.currentShape, 'prev');
								}

							}else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
								fnCellTabMove(KTCE.currentPaper.currentShape, 'prev');
							}
					// 멀티선택 text속성 적용
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnTabMove(el, 'prev')
							}
						});
					}
				}
			}) 
				
			trigger.tabNext.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
							if ( KTCE.currentPaper.currentShape.attr('class').indexOf('textBoxWrap') > -1 ) {

								// 멀티선택 text속성 적용
								if( KTCE.currentPaper.selectedShapeArray.length > 1 ){

									$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
										if ( el.hasClass( 'textBoxWrap' ) ) {
											fnTabMove(el, 'next');
										}
									});
								}else{
									fnTabMove(KTCE.currentPaper.currentShape, 'next');
								}

							}else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
								fnCellTabMove(KTCE.currentPaper.currentShape, 'next');
							}
					// 멀티선택 text속성 적용
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnTabMove(el, 'next')
							}
						});
					}
				}
			})
			// alignLeft
			trigger.textAlignLeft.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.attr('class').indexOf('textBoxWrap') > -1 ) {

							// 멀티선택 text속성 적용
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){

								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnTextAlign(el, 'left');
									}
								});
							}else{
								fnTextAlign(KTCE.currentPaper.currentShape, 'left');
							}

						}
						else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							//fnCellTextAlign(KTCE.currentPaper.currentShape, 'left', true);
							fnCellTextArrayAlign(KTCE.currentPaper.currentShape, 'left', true);
						}
					// 멀티선택 text속성 적용
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnTextAlign(el, 'left')
							}
						});
					}
				}
			});

			trigger.textAlignRight.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.attr('class').indexOf('textBoxWrap') > -1 ) {

							// 멀티선택 text속성 적용
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){

								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnTextAlign(el, 'right');
									}
								});
							}else{
								fnTextAlign(KTCE.currentPaper.currentShape, 'right');
							}
						}
						else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							fnCellTextArrayAlign(KTCE.currentPaper.currentShape, 'right', true);
						}
					// 멀티선택 text속성 적용
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnTextAlign(el, 'right')
							}
						});
					}
				}
			});

			trigger.textAlignCenter.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.attr('class').indexOf('textBoxWrap') > -1) {

							// 멀티선택 text속성 적용
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fnTextAlign(el, 'center');
									}
								});
							}else{
								fnTextAlign(KTCE.currentPaper.currentShape, 'center');
							}
						}
						else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							fnCellTextArrayAlign(KTCE.currentPaper.currentShape, 'center', true);
						}
					// 멀티선택 text속성 적용
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fnTextAlign(el, 'center')
							}
						});
					}
				}
			});
			
			trigger.textAlignTop.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						fnCellTextVerticalAlign('top');
						setTimeout(function(){
							fnSaveState()
						}, 30);
					}
				}
			});
			trigger.textAlignMiddle.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						fnCellTextVerticalAlign('middle');
						setTimeout(function(){
							fnSaveState()
						}, 30);
					}
				}
			});
			trigger.textAlignBottom.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						fnCellTextVerticalAlign('bottom');
						setTimeout(function(){
							fnSaveState()
						}, 30);
					}
				}
			});			

			trigger.fontSizeUp.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.attr('class').indexOf('textBoxWrap') > -1) {

							// 멀티선택 text속성 적용
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fontSizeChnge(el, 'up');
									}
								});
							}else{
								fontSizeChnge(KTCE.currentPaper.currentShape, 'up');
							}

						} else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							//fnCellfontSizeChnge(KTCE.currentPaper.currentShape, 'up');
							//비동기 처리
							setTimeout(function(e){
								fnCellfontSizeChnge(KTCE.currentPaper.currentShape, 'up');
							}, 0)
						}
					// 멀티선택 text속성 적용
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fontSizeChnge(el, 'up')
							}
						});

					}
				}
			});

			trigger.fontSizeDown.on({
				click : function() {
					if ( KTCE.currentPaper.currentShape != null ) {
						if ( KTCE.currentPaper.currentShape.attr('class').indexOf('textBoxWrap') > -1) {
							// 멀티선택 text속성 적용
							if( KTCE.currentPaper.selectedShapeArray.length > 1 ){

								$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
									if ( el.hasClass( 'textBoxWrap' ) ) {
										fontSizeChnge(el, 'down');
									}
								});
							}else{
								fontSizeChnge(KTCE.currentPaper.currentShape, 'down');
							}

						} else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
							//fnCellfontSizeChnge(KTCE.currentPaper.currentShape, 'down');
							//비동기 처리
							setTimeout(function(e){
								fnCellfontSizeChnge(KTCE.currentPaper.currentShape, 'down');
							}, 0)
						}
					// 멀티선택 text속성 적용
					}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
						$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
							if ( el.hasClass( 'textBoxWrap' ) ) {
								fontSizeChnge(el, 'down')
							}
						});
					}
				}
			});

			// textBulletPoints
			trigger.textBulletPoints.each(function(){
				var _this = $(this)
				, bulletPoint = parseFloat($(this).find('img').attr('data-bullet'));

				_this.on({
					click : function() {
						if ( KTCE.currentPaper.currentShape != null ) {
							if ( KTCE.currentPaper.currentShape.hasClass( 'textBoxWrap' ) ) {
								//addBulletPointList(KTCE.currentPaper.currentShape, bulletPoint);
								// 멀티선택 text속성 적용
								if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
									$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
										if ( el.hasClass( 'textBoxWrap' ) ) {
											addBulletPointList(el, bulletPoint);
										}
									});
								}else{
									addBulletPointList(KTCE.currentPaper.currentShape, bulletPoint);
								}
	
							}else if( KTCE.currentPaper.currentShape.hasClass( 'xTable' ) ) {
								//fnCelladdBulletPointList(KTCE.currentPaper.currentShape, bulletPoint);
								setTimeout(function(){
									fnCelladdBulletPointList(KTCE.currentPaper.currentShape, bulletPoint);
								}, 0);
							}
						// 멀티선택 text속성 적용
						}else if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
							$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
								if ( el.hasClass( 'textBoxWrap' ) ) {
									addBulletPointList(el, bulletPoint);
								}
							});
						}
					}
				});
			});
		}

		// 텍스트 상태 변경 후 바운드 박스 업데이트
		function fnTextBBoxUpdate( obj, flagSave ) {
			var fHandler = obj.freeTransform;
			
			if(fHandler === undefined) return;
			
			var newBBox = obj.getBBox( true );
			
			fHandler.attrs.x = newBBox.x;
			fHandler.attrs.y = newBBox.y;
			fHandler.attrs.center.x = newBBox.cx;
			fHandler.attrs.center.y = newBBox.cy;
			fHandler.attrs.size = {
				x: newBBox.w,
				y: newBBox.h
			};

			// 기존 오브젝트 정보가 있는지 판단
			if ( obj.hasClass('hasData') ) {

				var info = fnGetDataObject(obj);

				fHandler.attrs.translate.x = info.translate.x;
				fHandler.attrs.translate.y = info.translate.y;
				fHandler.attrs.scale.x = info.scale.x;
				fHandler.attrs.scale.y = info.scale.y;
				fHandler.attrs.rotate = info.rotate;

				fHandler.apply();

			} else {
				// 정보 오브젝트 생성
				fnCreateDataObject(obj, fHandler);
			}

			obj.data('hasHandle', true );
			obj.freeTransform = fHandler;

			handlerBinding();
			updateCursorPos(obj);	
			if(flagSave){fnSaveState();}
		}

		// 폰트 종류 셀렉트 uiSelect
		function fnCreateUISelect() {
			KTCE.util.select({
				target : $('.functions .uiSelect')
				, duration : 0
				, scrollInit : true
				, addClass : 'fontControl'
				, upScroll : false
			});
			
			//font size 직접입력추가
			setTimeout(function(){
			//	fnCreateInputCheck();
				KTCE.fontSize = fnFontSize;
				KTCE.cellfontSize = fnCellFontSize;
				KTCE.clearTextMode = clearTextMode;
				KTCE.clearTableInputMode = clearTableInputMode;
				KTCE.tcInterval = tcInterval;
				KTCE.textCellEditMode = textCellEditMode;
			}, 300);
			
		}

		// 텍스트 상자에서 커서 위치 알아내기
		function getCursorPosition(obj) {

		}

		// 텍스트 커서 만들기
		function showTextCursor(obj) {
			var point = obj.node.getStartPositionOfChar(3)
			var cursor = KTCE.currentPaper.objWrap.line(
					point.x
					, point.y - (textBox.getBBox().height - 5 )
					, point.x
					, point.y + 5
				).attr({
					fill : 'none'
					, stroke : 'red'
					, strokeWidth : 2
				});

			var cursorVisible = true;

			var cursorInterval = setInterval(function() {
				if ( cursorVisible ) {
					cursorVisible = false;
					cursor.hide();
				} else {
					cursorVisible = true;
					cursor.show();
				}
			}, 300);
		}

		// 텍스트 폰트 굵기
		function fnFontWeight(obj) {
			
			if ( obj.data('bold') == 'true' ) {
				obj.removeData('bold')
				$(obj.node).css({
					'font-weight' : 'normal'
				});
			} else {
				obj.data('bold','true');
				$(obj.node).css({
					'font-weight' : 'bold'
				});
			}
			

			fnUpdateTextPosY(obj)
			fnTextBBoxUpdate( obj , true);
		}

		// 텍스트 italic
		function fnFontItalic(obj) {
			if($(obj.node).css("font-style") == 'italic'){
				$(obj.node).css({
					'font-style' : 'normal'
				})
			} else {
				$(obj.node).css({
					'font-style' : 'italic'
				});
			}

/*			
 			//servlet 저장라이브러리에서 이탤릭체 저장 미적용에 따른 별도font 처리
			var fontFmaily = $(obj.node).css('font-family') + "Italic";
			fnFontFamily(obj, fontFmaily)
*/			

			fnSaveState();
		}

		// 텍스트 언더라인
		function fnTextUnderline(obj, styleAction) {
			if ( $(obj.node).attr("data-text-underline") == null || $(obj.node).attr("data-text-underline") == 'none' || styleAction) {
				$(obj.node).attr("data-text-underline", "underline");
			} else {
				$(obj.node).attr("data-text-underline", "none");
			}
			
			if ( $(obj.node).css("text-decoration") == null || $(obj.node).css("text-decoration") == 'none' || styleAction) {
				$(obj.node).css("text-decoration", "underline");
			} else {
				$(obj.node).css("text-decoration", "none");
			}
			//group node
			$(obj.node).css("text-decoration", "none");
			
			if ( $(obj.node).find('text').css("text-decoration") == null || $(obj.node).find('text').css("text-decoration") == 'none' || styleAction) {
				$(obj.node).find('text').css("text-decoration", "underline");
			} else {
				$(obj.node).find('text').css("text-decoration", "none");
			}
			//text node
			$(obj.node).find('text').css("text-decoration", "none");

			fnUpdateTextPosY(obj)
			fnTextBBoxUpdate( obj, true);
				
		}
		
	
		// 텍스트 쉐도우
		function fnTextShadow2(obj, styleAction) {
		
			//원본: 2016-05-03이전
			if($(obj.node).css("text-shadow") == 'none' || styleAction){
				$(obj.node).css({
					'text-shadow' : '2px 2px 2px #333'
				})

			} else {	
				$(obj.node).css({
					'text-shadow' : 'none'
				});
			}

	
			if(browserType.indexOf('msie') > -1){	//IE
				if($(obj.node).attr('filter') == undefined || styleAction){
					var _current = KTCE.currentPaper.s.node.id;//KTCE.currentPaper.s.node;
					//var paper = Snap("#" + _current);
					var paper = Snap(KTCE.currentPaper.s.node);
					var _filter = paper.filter(Snap.filter.shadow(2,2,2));
					obj.attr({'data-filter-id': _filter.node.id});
					obj.attr({filter: _filter});
				}else{
					console.log('ie remove shadow filter');
					$(obj.node).removeAttr('filter');
					$("#" + obj.attr('data-filter-id')).remove();
				}
			}else{	// NOT IE

			}
		
			fnSaveState();
		}
		
		// 폰트 사이즈
		function fnFontSize(obj, px) {
			
			try {
				if( obj.freeTransform.isLock(obj) ) {
					alert('잠금객체는 글꼴 사이즈 변경하기가 지원하질 않습니다!');
					return;
				}
			}catch(e){}
			
			var textArray = obj.select(".textLine").children();
			for(var i=0; i< textArray.length; i++){
				textArray[i].attr("style", "font-size:" + px);
			}
			fnUpdateTextPosY(obj)
			fnTextBBoxUpdate( obj, true);
		}

		function fontSizeChnge(obj, flag){
			
			try {
				if( obj.freeTransform.isLock(obj) ) {
					alert('잠금객체는 글꼴 사이즈 변경하기가 지원하질 않습니다!');
					return;
				}
			}catch(e){}
			
			var addSize = 0;
			switch(flag){
			case "up":
				addSize = 1;
				break;
			case "down":
				addSize = -1;
				break;
			}
			var textArray = obj.select(".textLine").children();
			for(var i=0; i< textArray.length; i++){
				var selfSize = 	parseFloat(textArray[i].attr("style").split(":")[1].split("p")[0]);
				textArray[i].attr("style", "font-size:" + (selfSize + addSize) + "pt");
			}

			$(".uiDesignSelect2 .uiDesignSelect-text").html(selfSize + addSize);
			$(".uiDesignSelect2 .uiSelect-active").removeClass("uiSelect-active");
			
			//input box font size 직접입력값 조절
			$("input.numberSize").val(selfSize + addSize);
			
			fnUpdateTextPosY(obj);
			fnTextBBoxUpdate(obj, true);
		}

		// 폰트 패밀리
		function fnFontFamily(obj, family) {
			$(obj.node).css({
				'font-family' : family
			});
			fnUpdateTextPosY(obj)
			fnTextBBoxUpdate( obj , true);
		}

		// 자간
		function fnLetterSpacing(obj, px) {
			var px = px + 'px';
			$(obj.node).css({
				'letter-spacing' : px
			});
			

			
			fnUpdateTextPosY(obj)	
			fnTextBBoxUpdate( obj , true );
		}

		// 행간
		function fnLineHeight(obj, px) {
			fnUpdateTextPosY(obj);
			fnTextBBoxUpdate( obj , true );
		}

		// 폰트 색상
		function fnFontColor(obj, color) {
			$(obj.node).css({
				fill : color
			});
			fnUpdateTextPosY(obj);
			fnTextBBoxUpdate( obj , true );
		}

		//tab prev, nex
		function fnTabMove(obj, opt) {
			var textBoxPos = {
				x : parseFloat(obj.attr("data-lineposx")),
				y : parseFloat(obj.attr("data-lineposy"))
			}
			var textArray = obj.select(".textLine").children();
			var textCursor = obj.select(".text-cursor").children()[0];
			var textCursorY = parseFloat(textCursor.attr("y2"));
			for(var i=0; i<textArray.length; i++){
				var tY1 = parseFloat(textArray[i].attr("y"));
				var tY2 = tY1 + parseFloat(textArray[i].getBBox().height);
				if(textCursorY >= tY1 && textCursorY <= tY2){
					break;
				} 
			}

			var tabMove = 0;
			switch(opt) {
				case 'prev' :
					tabMove = parseFloat(textArray[i].attr("x")) - 10
					break;
				case 'next' :
					tabMove = parseFloat(textArray[i].attr("x")) + 10
					break;
			}

			if(tabMove >= textBoxPos.x){
				textArray[i].attr("x", tabMove);
				fnUpdateTextPosY(obj);
				fnTextBBoxUpdate( obj , true);
			}

		}

		
		// align
		function fnTextAlign(obj, align, flagSave) {
			obj.attr("text-align", align);	
			fnUpdateTextPosY(obj);
			fnTextBBoxUpdate( obj , true );
		}

		function fnApplyTextAlign(obj, align){
			var textBoxPos = {
				x : parseFloat(obj.attr("data-lineposx")),
				y : parseFloat(obj.attr("data-lineposy"))
			}
			var textArray = obj.select(".textLine").children();
			var maxWidth = -1;
			for(var i=0; i<textArray.length; i++){
				if(maxWidth < parseFloat(textArray[i].getBBox().width)){
					maxWidth = parseFloat(textArray[i].getBBox().width);
				}
			}
			switch(align) {
				case 'left' :
					for(var i=0; i< textArray.length; i++){
						textArray[i].attr("x", textBoxPos.x);
					}
					break;
				case 'right' :
					for(var i=0; i< textArray.length; i++){
						var selfW = parseFloat(textArray[i].getBBox().width);
						textArray[i].attr("x", textBoxPos.x + (maxWidth-selfW));
					}
					break;
				case 'center' :
					for(var i=0; i< textArray.length; i++){
						var selfW = parseFloat(textArray[i].getBBox().width);
						textArray[i].attr("x", textBoxPos.x + (maxWidth-selfW)/2);
					}
			}
		}

		var bulletArray = ['', '※ ', '● ', '▶ ', '◆ ', '■ ']
		function addBulletPointList(obj, bullet){
			obj.attr("bullet-num", bullet);	

			if( KTCE.currentPaper.selectedShapeArray.length > 1 ){
				$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el){
					if ( el.hasClass( 'textBoxWrap' ) ) {
						makeTextSvgObj(el, getTextData(el).split("\n"), true);
					}
				});
			}else{
				makeTextSvgObj(KTCE.currentPaper.currentShape, getTextData(KTCE.currentPaper.currentShape).split("\n"), true);
			}			
		}

		function fnUpdateTextPosY(obj){
			//표 텍스트 사용X
			if($(obj.node).attr('data-name') === "xTable") return;			
			var textBoxPos = {
				x : parseFloat(obj.attr("data-lineposx")),
				y : parseFloat(obj.attr("data-lineposy"))
			}
														
			var lineHeight = (obj.attr("data-lineheight") != null) ? obj.attr("data-lineheight") : obj.attr("data-lineHeight");
			lineHeight = lineHeight == null ? 0 : lineHeight;
						
			if(lineHeight == null){
				textBoxPos.lh = 0;
			} else {
				textBoxPos.lh = parseFloat(lineHeight);
			}
			
			var textArray = obj.select(".textLine").children();
			var prevHeight = 0;
			for(var i=0; i< textArray.length; i++){
				var ch = textBoxPos.y + prevHeight + textBoxPos.lh*i;
				textArray[i].attr("y", ch);
				prevHeight += parseFloat(textArray[i].getBBox().height);
			}

			var rectCover = obj.select(".textcover").children();
			var maxTextW = -1;
			var minTextX = 99999;
			var rectHeight = 0;

			for(var i=0; i<textArray.length; i++){
				if(maxTextW < textArray[i].getBBox().width){
					maxTextW = textArray[i].getBBox().width
				}
				if(minTextX > textArray[i].getBBox().x){
					minTextX = textArray[i].getBBox().x;
				}
				rectHeight += textArray[i].getBBox().height;
			}
			rectCover[0].attr('x', minTextX-5)
				        .attr('y', textArray[0].getBBox().y-5)
				        .attr('width', maxTextW + 10)
				        .attr('height', rectHeight + 10)

			

			updateCursorPos(obj);

			if(obj.attr("text-align")!=undefined){
				fnApplyTextAlign(obj, obj.attr("text-align"), "noSave")
			}
				
			if(obj.select("g.textUnderLine") != null)
					obj.select("g.textUnderLine").remove();

			if (!(obj.attr("data-text-underline") == null || obj.attr("data-text-underline") == 'none')) {
				if(obj.select("g.textUnderLine") != null)
					obj.select("g.textUnderLine").remove();
				var underLine = obj.g().attr("class", "textUnderLine");
				if(obj.attr("bullet-num") == null || obj.attr("bullet-num") == 0){
					for(var i in textArray){
						if($(textArray[i].node).text().length > 1 || $(textArray[i].node).text() != ' '){
						underLine.line(textArray[i].getBBox().x, textArray[i].getBBox().y+textArray[i].getBBox().height, textArray[i].getBBox().x + textArray[i].getBBox().width,textArray[i].getBBox().y+textArray[i].getBBox().height)
								 .attr({
									"fill" : "#ffffff",
									"stroke" : $(obj.node).css("fill"),
									"style" : "stroke-width : 1px"
								  })
						}
					}
				} else{
					for(var i in textArray){
						var tempTextStyle = obj.select(".textLine").select("text").attr("style");
						var tempBulletText = obj.select(".textLine").text(textArray[i].getBBox().x, textArray[i].getBBox().y, bulletArray[obj.attr("bullet-num")])
											 .attr("style", tempTextStyle)
											 .attr("class", "textBox");
						var tempWidth = tempBulletText.getBBox().width;
						tempBulletText.remove();
						
						if($(textArray[i].node).text().length > 1 || $(textArray[i].node).text() != ' '){

						underLine.line(textArray[i].getBBox().x + tempWidth, textArray[i].getBBox().y+textArray[i].getBBox().height, textArray[i].getBBox().x + textArray[i].getBBox().width,textArray[i].getBBox().y+textArray[i].getBBox().height)
								 .attr({
									"fill" : "#ffffff",
									"stroke" : $(obj.node).css("fill"),
									"style" : "stroke-width : 1px"
								  })
						}
					}
				}
			}



		}
		

		/******************************************************************************/
		/* Section: 테이블 기능
		/******************************************************************************/

		// 테이블 기능
		function fnCreateTable() {
			
			var _this = layer.createTableLayer
				, table = _this.find('table')
				, x = _this.find('.x')
				, y = _this.find('.y')
				, tr = _this.find('tr')
				, allTd = _this.find('td')
				, cX = 0
				, cY = 0

			tr.each(function(i) {

				var td = $(this).find('td')

				td.each(function(j) {
					$(this).on({
						mouseenter : function() {

							allTd.removeClass('active');

							for ( var k=0; k<i+1; k++ ) {
								for ( var l=0; l<j+1; l++ ) {
									tr.eq(k).find('td').eq(l).addClass('active');
								}
							}

							x.html(j+1);
							y.html(i+1);
							cX = j+1;
							cY = i+1;

						}
					});
				});
			});

			table.on({
				mouseleave : function() {
					allTd.removeClass('active');
					x.html('0');
					y.html('0');
				}
				, click : function() {
					KTCE.currentPaper.tableX = cX;
					KTCE.currentPaper.tableY = cY;
					fnCreateTableLine();
					setCellEffectInfo();
					
					hideAllHandler();
				}
			});

		}
		
		
		
		// 테이블 생성
		function fnReCreateTable(obj, x, y) {
			KTCE.currentPaper.tableX = x;
			KTCE.currentPaper.tableY = y;

			var xTableIdx = KTCE.currentPaper.tableArray.length;
			var xTableId;
			xTableId = 'xTable' + xTableIdx;
			
			var showBasedY = $(".paperFrame").position().top == 0 ? 100 : 20;
			var thisTable = {}
			var _x = parseInt(KTCE.currentPaper.tableX)
			var _y = parseInt(KTCE.currentPaper.tableY)
				, _firstX = 40
				, _firstY = showBasedY-$(".paperFrame").position().top				
				, _tableG
				
			if(obj != undefined || obj != null ) {
				var _tableInfo = fnTableInfo(obj);
				
				if(_tableInfo[0] != null || _tableInfo[0] != undefined ) {
					_tableG = KTCE.currentPaper.objWrap.g().attr({ 
								 class : 'xTable'
								, id : xTableId
								, 'data-id' : _tableInfo[0]
								, 'data-name' : 'xTable'
								, 'data-table-rows' : _y
								, 'data-table-cols' : _x
								, 'transform' :obj.attr('transform')
					});
				}
			}	
		}
		
		// 01. 테이블 라인 만들기(생성)
		function fnCreateTableLine(obj) {
			var xTableIdx = KTCE.currentPaper.tableArray.length;
			var xTableId;

			xTableId = 'xTable' + xTableIdx;

			var showBasedY = $(".paperFrame").position().top == 0 ? 100 : 20;
			var thisTable = {}
			var _x = parseInt(KTCE.currentPaper.tableX)
			var _y = parseInt(KTCE.currentPaper.tableY)
				, _firstX = 40
				, _firstY = showBasedY-$(".paperFrame").position().top
				, _tableG
				
			if(obj != undefined || obj != null ) {
				var _tableInfo = fnTableInfo(obj);
				
				if(_tableInfo[0] != null || _tableInfo[0] != undefined ) {
					_tableG = KTCE.currentPaper.objWrap.g().attr({ 
								 class : 'xTable'
								, id : xTableId
								, 'data-id' : _tableInfo[0]
								, 'data-name' : 'xTable'
								, 'data-table-rows' : _y
								, 'data-table-cols' : _x
								, 'transform' :obj.attr('transform')
					});
				}
			}else{
				_tableG = KTCE.currentPaper.objWrap.g().attr({ class : 'xTable', id : xTableId, 'data-id' : xTableId, 'data-name' : 'xTable', 'data-table-rows' : _y, 'data-table-cols' : _x})
			}
			
			var	 cellWidth = 70
				, cellHeight = 50
				, cellArray = []
				, xLineArray = []
				, yLineArray = []
				, strokeWidth = 1
				, xArray = []
				, yArray = []
				, mergeCellArray = []
			//add table id
			_tableG.attr({"id": _tableG.id});
			_tableG.attr({"tableX": _x});
			_tableG.attr({"tableY": _y});
			_tableG.attr({"firstX": _firstX});
			_tableG.attr({"firstY": _firstY});
			_tableG.attr({"cellWidth": cellWidth});
			_tableG.attr({"cellHeight": cellHeight});
			_tableG.attr({"data-stroke-width": strokeWidth});

			thisTable.id = _tableG.id;

			thisTable.length = {
				x : _x
				, y : _y
			}
			thisTable.position = {
				x : _firstX
				, y : _firstY
			}
			thisTable.cellArray = [];
			thisTable.xLineArray = [];
			thisTable.yLineArray = [];
			thisTable.cellHoverArray = [];
			thisTable.cellTextArray = [];
			thisTable.cellWidth = cellWidth;
			thisTable.cellHeight = cellHeight;
			thisTable.strokeWidth = strokeWidth;				
			thisTable.tableX = _x;
			thisTable.tableY = _y;
			thisTable.tableCellStateArray = [];
			thisTable.mergeActiveCellArray = mergeCellArray;

			// 배경용 셀 생성
			for ( var i=0; i<_y; i++ ) {
				for( var j=0; j<_x; j++ ) {
					var cell = _tableG.rect((j*cellWidth)+_firstX, (i*cellHeight)+_firstY, cellWidth, cellHeight)
					if(obj!=undefined) {
						
						var _color = obj.attr('fill');
						cell.attr({
							stroke: 'none'
							, fill : "'" + obj.attr('fill') + "'"
							, 'vector-effect' : 'non-scaling-stroke'
							, class : 'xCell x'+j + '_y'+i
						})
					}else{
						cell.attr({
							stroke : 'none'
							, fill : 'none'
							, 'vector-effect' : 'non-scaling-stroke'
							, class : 'xCell x'+j + '_y'+i
						});
					}
					
					cell.data('x',j);
					cell.data('y',i);
					cell.attr("data-index-x", j);
					cell.attr("data-index-y", i);
					cell.attr("data-init-pos-x", cell.attr("x"));
					cell.attr("data-init-pos-y", cell.attr("y"));
					cell.attr("data-init-width", cellWidth);
					cell.attr("data-init-height", cellHeight);

					thisTable.cellArray.push(cell);

					yArray[j] = strokeWidth;					
				}					
				xArray[i] = yArray;
			}					
			thisTable.tableCellStateArray = xArray;
			// 선택용 셀 생성
			for ( var i=0; i<_y; i++ ) {
				thisTable.cellTextArray[ i ] = [];

				for( var j=0; j<_x; j++ ) {
					var cell = _tableG.rect((j*cellWidth)+_firstX, (i*cellHeight)+_firstY, cellWidth, cellHeight).attr({
						stroke : 'none'
						, fill : '#fff'
						, opacity : 0
						, 'vector-effect' : 'non-scaling-stroke'
						, class : 'xCellHover x'+j + '_y'+i
					});
					cell.data('x',j);
					cell.data('y',i);
					$( cell.node ).data( 'indexX', j );
					$( cell.node ).data( 'indexY', i );
					cell.attr("data-index-x", j);
					cell.attr("data-index-y", i);
					cell.attr("data-init-pos-x", cell.attr("x"));
					cell.attr("data-init-pos-y", cell.attr("y"));
					cell.attr("data-init-width", cellWidth);
					cell.attr("data-init-height", cellHeight);
					cell.data( 'self', cell );
					thisTable.cellHoverArray.push(cell);
					
					cell.dblclick( function( $event ) {
						var cell = $( $event.target );
						if($(cell).attr("data-merge")!= undefined){
							var triggerTarget = $(cell).attr("data-merge").split(",")[0];
							cell = $ (thisTable.cellHoverArray[triggerTarget].node);
						}
						
						var indexX = cell.data( 'indexX' );
						var indexY = cell.data( 'indexY' );
						var positionX = cell.attr( 'x' );
						var positionY = cell.attr( 'y' );
						
						if( thisTable.cellTextArray[ indexY ][ indexX ] === undefined ) {
								fnCreateTextinTable(cell, _tableG, thisTable);
						}else{
							//셀병합 > 셀분활 후 빈 cell 텍스트 입력시 error버그 수정 
							if($("#" + thisTable.cellTextArray[ indexY ][ indexX ].node.id).length > 0) {
								fnCellTextInputMode(_tableG, indexX, indexY);
							}else{
								fnCreateTextinTable(cell, _tableG, thisTable);
							}
						}
					
					} );
				}
			}
			
			// 세로 선 생성
			for ( var kk=0; kk<_y; kk++) {
				for( var mm=0; mm<_x+1; mm++ ) {	
					var yLineId = 'yLine' + xTableIdx + "_" +  kk + "_" + mm + "_" + _tableG.id;	
					//세로선과 선사이 공간발생방지
					var yLine = _tableG.line((mm*cellWidth)+_firstX, (kk*cellHeight)+_firstY, (mm*cellWidth)+_firstX, (kk*cellHeight)+_firstY+cellHeight+0.5).attr({
						stroke : '#777'
						, strokeWidth : strokeWidth
						, fill : 'none'
						, 'vector-effect' : 'non-scaling-stroke'
						, class : 'yLine x'+mm + '_y'+kk
						, 'data-stroke-width' : strokeWidth		
						, 'stroke-linecap' : 'butt'	//butt, round, square
						, id: yLineId
					});
					yLine.data('x',mm);
					yLine.data('y',kk);
				    yLine.attr("data-x", mm);
					yLine.attr("data-y", kk);
					yLine.attr("data-init-pos-x1", yLine.attr("x1"));
					yLine.attr("data-init-pos-x2", yLine.attr("x2"));
					yLine.attr("data-init-pos-y1", yLine.attr("y1"));
					yLine.attr("data-init-pos-y2", yLine.attr("y2"));
					thisTable.yLineArray.push(yLine);
				}
			}
			
			// 가로 선 생성
			//for ( var ii=0; ii<_y+1; ii++) {
			for ( var ii=0; ii<_y+1; ii++) {
				for( var jj=0; jj<_x; jj++ ) {

					var xLineStartPos = strokeWidth/2;
					var xLineId = 'xLine' + xTableIdx + "_" + ii + "_" + jj + "_" + _tableG.id;
					
					var xLine = _tableG.line((jj*cellWidth)+_firstX, (ii*cellHeight)+_firstY, (jj*cellWidth)+_firstX+cellWidth, (ii*cellHeight)+_firstY).attr({
						stroke : '#777'
						, strokeWidth : strokeWidth
						, fill : 'none'
						, 'vector-effect' : 'non-scaling-stroke'
						, class : 'xLine x'+jj + '_y'+ii
						, 'data-stroke-width' : strokeWidth
						, 'stroke-linecap' : 'square'
						//, 'stroke-linecap' : 'butt'
						, id: xLineId
					});
					xLine.data('x',jj);
					xLine.data('y',ii);
				    xLine.attr("data-x", jj);
					xLine.attr("data-y", ii);
					xLine.attr("data-init-pos-x1", xLine.attr("x1"));
					xLine.attr("data-init-pos-x2", xLine.attr("x2"));
					xLine.attr("data-init-pos-y1", xLine.attr("y1"));
					xLine.attr("data-init-pos-y2", xLine.attr("y2"));
					thisTable.xLineArray.push(xLine);
				}
			}

			KTCE.currentPaper.tableArray.push(thisTable);
			//fnCellUpdate(thisTable);
			
			//fnCellArrayUpdate(thisTable);
			fnTableLineBinding(thisTable);
			fnTableCellBinding(thisTable);
			fnSetFreeTransformTable(_tableG);
			//테이블 값 저장
			fnSaveState();

		}

		function initCellFontStyle(cell, textWrapper){
			var styleStr = '';
			var fontSize = cell.attr("data-font-size") == null ? 20 : cell.attr("data-font-size");			
			var fontFamily = cell.attr("data-font-family") == null ? _baseFont : cell.attr("data-font-family");
			var fontWeight = cell.attr("data-font-weight");  //default : normal
			var fontStyle = cell.attr("data-font-style");   //default : normal
			var fontColor = cell.attr("data-font-color");   //default : normal
			var textDecoration = cell.attr("data-text-decoration"); 
			var textShadow = cell.attr("data-text-shadow");			
			var letterSpacing = (cell.attr("data-letter-spacing") === null) ? 0 : cell.attr("data-letter-spacing");
			var lineHeight = (cell.attr("data-lineheight") != null) ? cell.attr("data-lineheight") : cell.attr("data-lineHeight");
			lineHeight = lineHeight == null ? 0 : lineHeight;
			var textAlign = (cell.attr("data-text-align") === null) ? 'left' : cell.attr("data-text-align");
			var verticalAlign = (cell.attr('data-text-vertical-align') === null) ? 'top' : cell.attr('data-text-vertical-align');
			var fontUiSelect = $('.uiDesignSelect-wrap.uiDesignSelect1.fontControl')
				,fontUiSelectTrigger = fontUiSelect.find('.uiDesignSelect-optionList').find('a')
				,sizeUiSelect = $('.uiDesignSelect-wrap.uiDesignSelect2.fontControl')
				,sizeUiSelectTrigger = sizeUiSelect.find('.uiDesignSelect-optionList').find('a')
	
			fontUiSelectTrigger.eq(findIdx(fontFamily,'fontFamily')).trigger('change');

			if(findIdx(fontSize,'fontSize') == null){
				$(".uiDesignSelect2 .uiDesignSelect-text").html(fontSize);
				$(".uiDesignSelect2 .uiSelect-active").removeClass("uiSelect-active");
				
				//input box font size 직접입력값 조절
				$("input.numberSize").val(fontSize);
			} else {
				sizeUiSelectTrigger.eq(findIdx(fontSize,'fontSize')).trigger('change');
				
				//input box font size 직접입력값 조절
				$("input.numberSize").val(fontSize);
			}

			var spacingList =$('#letterSpacingLayer .numberList').find('li')
			$('#letterSpacingLayer .numberList li').find('button').removeClass('active');	
			$(spacingList).each(function(){
				var num = $(this).find('button').text();
				if(num == letterSpacing)$(this).find('button').addClass('active');
			});

			var lineHeightLayer =$('#lineHeightLayer .numberList').find('li')
			$('#lineHeightLayer .numberList li').find('button').removeClass('active');
			$(lineHeightLayer).each(function(){
				var num = $(this).find('button').text();
				if(num == lineHeight)$(this).find('button').addClass('active');
			});

			setCellEffectInfo(cell);		

			if(textWrapper != undefined){
				styleStr += "font-family : " + fontFamily  + ";";
				if(fontWeight != null){
					 styleStr += "font-weight : " + fontWeight + ";";
					 if(fontWeight == 'bold'){
						textWrapper.data('bold','true');
					 }
				}
				if(fontStyle != null) {
					styleStr += "font-style : " + fontStyle + ";";
					if(fontStyle == 'italic'){
						textWrapper.data('italic','true');
					 }
				}
				if(textDecoration != null){
					styleStr += "text-decoration : " + textDecoration + ";";
					if(textDecoration == 'underline'){
						textWrapper.data('underline','true');
					 }
				}
				if(textShadow != null){
					styleStr += "text-shadow : " + textShadow + ";";	
					if(textShadow != 'none'){
						textWrapper.data('shadow','true');
					}
				}
				if(letterSpacing != null) styleStr += "letter-spacing : " + letterSpacing + ";";
				if(fontColor != null) styleStr += "fill : " + fontColor + ";";

				return {
					fontSize : fontSize,
					lineHeight : lineHeight,
					textAlign : textAlign,
					fontCss : styleStr,
					verticalAlign: verticalAlign
				}

			}
		}

		// create a text object for table
		function fnCreateTextinTable(cell, tG, tableObj, initString){
			//201804 그룹객체 사용금지
			if(KTCE.currentPaper.currentShape != null) {
				if($(KTCE.currentPaper.currentShape.node).attr('data-name') =='objectGroup') return;
			}
			if(tG.freeTransform == undefined || tG.freeTransform == null ) return;

			if(KTCE.currentPaper.selectedShapeArray[0] == undefined){
				hideAllHandler();
				tG.data('hasHandle', true);
				tG.freeTransform.visibleHandles();
				KTCE.currentPaper.currentShape = tG;
				KTCE.currentPaper.selectedShapeArray.push(tG);
			}	
				
			//테이블내 텍스트 여백조절
			fnSetTableCellMargin(KTCE.currentPaper);
			var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;			
			var indexX = parseInt(cell.attr("data-index-x"));
			var indexY = parseInt(cell.attr("data-index-y"));
			var cellPos = $(KTCE.currentPaper.currentShape.select("rect.x"+indexX+"_y"+indexY).node).position()
			
			var svgMarginLeft = tableTextDisPos.svgMargin.left;	//parseInt($(KTCE.currentPaper.s.node).css('margin-left'));
			var svgMarginTop = tableTextDisPos.svgMargin.top;	//parseInt($(KTCE.currentPaper.s.node).css('margin-top'));
			var svgScale = $(KTCE.currentPaper.s.node).css("scale");
			var _strokeLeftWidth = parseFloat($(KTCE.currentPaper.currentShape.select("line.yLine.x"+indexX+"_y"+indexY).node).attr('data-stroke-width'))/2;

			//테이블내 텍스트 입력시 좌표값 맞게 설정하기
			if(browserType.indexOf('msie') != -1){
				var positionX = ((cellPos.left - tableTextDisPos.ie.x - svgMarginLeft) / svgScale) + _strokeLeftWidth;
				var positionY = (cellPos.top - tableTextDisPos.ie.y - svgMarginTop) / $(KTCE.currentPaper.s.node).css("scale");
			}else {
				var positionX = ((cellPos.left - tableTextDisPos.chrome.x - svgMarginLeft + _strokeLeftWidth) / svgScale) + _strokeLeftWidth;
				var positionY = (cellPos.top - tableTextDisPos.chrome.y - svgMarginTop) / $(KTCE.currentPaper.s.node).css("scale");
			}			

			if(KTCE.currentPaper.objWrap.select('g.xTableTexts_'+tG.node.id) == null){
				var xTableTextWrapper = KTCE.currentPaper.objWrap.g().attr({
									"class" : "tableTextWrapper " + "xTableTexts_" +  tG.node.id
									});
				//해당 표 다음에 index layer 위치에 텍스트그룹 생성
				xTableTextWrapper.insertAfter(KTCE.currentPaper.currentShape);
			} else {
				var xTableTextWrapper = KTCE.currentPaper.objWrap.select('g.xTableTexts_' + tG.node.id);
			}
			
			var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));
			var wordWrapper = xTableTextWrapper.g().attr({
									//"id" : "text_" + indexX + "_" + indexY
									"id" : "text" + _tableNumber + "_" + indexX + "_" + indexY + "_" + tG.node.id			
								  , "class" : "cellTextWrapper"
								  , "data-cellx" : indexX
								  , "data-celly" : indexY
								  , "data-posx" : positionX
								  , "data-posy" : positionY});

			wordWrapper.data({
				pId :  tG.attr("id"),
				indexX: indexX,
				indexY: indexY,
				pX: positionX,
				pY: positionY
			});
			
			//var fontStyleObj = initCellFontStyle(cell, wordWrapper);
			var fontStyleObj = initCellFontStyle(Snap(cell[0]), wordWrapper);
			wordWrapper.attr("style", fontStyleObj.fontCss);
			//wordWrapper.attr("data-lineHeight", fontStyleObj.lineHeight);
			wordWrapper.attr("data-lineheight", fontStyleObj.lineHeight);
			wordWrapper.attr("text-align", fontStyleObj.textAlign);
			wordWrapper.attr("vertical-align", fontStyleObj.verticalAlign);
			var word = wordWrapper.text(positionX, positionY, ' ')
					 .attr({"style" : "font-size:" + fontStyleObj.fontSize + "pt", "class" : "textBox"})
					 .attr({"data-initx" : positionX, "data-inity" : positionY})
			var textX = positionX;	
			var textY = parseFloat(positionY) + word.getBBox().height;
				
			word.attr( 'y', textY ).data( {
				indexX: indexX,
				indexY: indexY,
				pX: positionX,
				pY: positionY
			} );

			if(xTableTextWrapper.select(".text-cursor") == null){
				var cursorWrapper = xTableTextWrapper.g().attr('class', 'text-cursor')
				var _lineX1 = word.getBBox().x + word.getBBox().width;
				var _lineX2 = word.getBBox().x + word.getBBox().width;
				var _lineY1 = word.getBBox().y;
				var _lineY2 = word.getBBox().y + word.getBBox().height;
				var cursor = cursorWrapper.line(_lineX1, _lineY1, _lineX2, _lineY2).attr({'stroke': 'black', 'stroke-width': '1.5', 'visibility': 'visible'})
			} else {
				var cursor = xTableTextWrapper.select(".text-cursor").children()[0];
				var _x1 = _x2 = word.getBBox().x + word.getBBox().width;
				var _y1 = word.getBBox().y;
				var _y2 = word.getBBox().y + word.getBBox().height;
				cursor.attr({"x1": _x1, "x2": _x1, "y1": _y1, "y2": _y2});
			}

			//초기ie 입력 foucs를 위해 추가
			if(initString === undefined) {
				fnCellTextInputMode(tG, indexX, indexY);
				fnCellTextVerticalAlign(fontStyleObj.verticalAlign);
				
				//글꼴 사이즈에 따른 cursor 크기와 셀크기 변경
				fnCellTextUpdate('', wordWrapper, false);
			}
			
			wordWrapper.dblclick( function( e ) {
				//201804 그룹객체 사용금지
				if(KTCE.currentPaper.currentShape != null) {
					if($(KTCE.currentPaper.currentShape.node).attr('data-name') =='objectGroup') return;
				}
				if(tG.freeTransform == undefined || tG.freeTransform == null ) return;

				var cellIdx = tableObj.length.x * indexY + indexX;
				var targetCell = tableObj.cellHoverArray[cellIdx];
				
				//targetCell.node.dispatchEvent(new Event("click"))
				targetCell.node.removeEventListener('click', false);
				targetCell.node.addEventListener('click', false);
								
				textCellEditMode = true;	
				
				fnCellTextInputMode(tG, indexX, indexY, e);
				
				//표 셀 mousemove 선택mode 해제
				if(KTCE.tableCellDragFlag) KTCE.tableCellDragFlag = false;		

			}).click(function(e){
				//201804 그룹객체 사용금지
				if(KTCE.currentPaper.currentShape != null) {
					if($(KTCE.currentPaper.currentShape.node).attr('data-name') =='objectGroup') return;
				}
				if(tG.freeTransform == undefined || tG.freeTransform == null ) return;

				if(KTCE.currentPaper.currentShape == null || KTCE.currentPaper.currentShape.id != tG.attr("id")){
					hideAllHandler();
					tG.data('hasHandle', true);
					tG.freeTransform.visibleHandles();
					KTCE.currentPaper.currentShape = tG;
					KTCE.currentPaper.selectedShapeArray.push(tG);
				}
				var cellIdx = tableObj.length.x * indexY + indexX;
				var targetCell = tableObj.cellHoverArray[cellIdx];
				$(targetCell).trigger('click');
				
				//targetCell.node.dispatchEvent(new Event("click"))
				var tableId = tG.node.id;
				$("#" + tableId + " rect.xCellHover").removeAttr('data-active');
				$("#" + tableId + " rect.xCellHover").attr('fill', '#ffffff');
				$("#" + tableId + " rect.xCellHover").css('opacity', 0);
				
				var rectId = " rect.xCellHover.x" + indexX + "_y" + indexY;
				var dataMerge = $("#" + tG.node.id + rectId).attr('data-merge');//.splite(',');
				if(dataMerge == undefined) {
					//비merge cell 선택모드 활성화
					$("#" + tG.node.id + rectId).attr({
						'fill': '#a2a2da',
						'data-active': 'active'
					});
					$("#" + tG.node.id + rectId).css({
						'opacity': 0.4
					});
				}else{
					//merge cell이면 해당 cell 선택모드 활성화
					$("#" + tG.node.id + " rect.xCellHover[data-merge='" + dataMerge + "']").attr({
						'fill': '#a2a2da',
						'data-active': 'active'
					});
					$("#" + tG.node.id + " rect.xCellHover[data-merge='" + dataMerge + "']").css({
						'opacity': 0.4
					});
				}
				
				//input box font size 직접입력값 조절
				var _selfSize = parseFloat($("#text" + _tableNumber + "_" + indexX + "_" + indexY + "_" + tG.node.id + " text.textBox").attr("style").split(":")[1].split("p")[0]);
				$("input.numberSize").val(_selfSize);
				$(".uiDesignSelect2 .uiDesignSelect-text").html(_selfSize);
				
			}).mousedown(function(e){
				//그룹객체 사용금지
				if(KTCE.currentPaper.currentShape != null) {
					if($(KTCE.currentPaper.currentShape.node).attr('data-name') =='objectGroup') return;
				}
				if(tG.freeTransform == undefined || tG.freeTransform == null ) return;

				KTCE.tableCellDragFlag = true;
				if(KTCE.currentPaper.currentShape == null || KTCE.currentPaper.currentShape.id != tG.attr("id")){
					hideAllHandler();
					tG.data('hasHandle', true);
					tG.freeTransform.visibleHandles();
					KTCE.currentPaper.currentShape = tG;
					KTCE.currentPaper.selectedShapeArray.push(tG);
				}
				var cellIdx = tableObj.length.x * indexY + indexX;
				var targetCell = tableObj.cellHoverArray[cellIdx];
				$(targetCell).trigger('mousedown');
			}).mouseup(function(e){	
				//표 셀 mousemove 선택mode 해제
				if(KTCE.tableCellDragFlag) KTCE.tableCellDragFlag = false;
				var cellIdx = tableObj.length.x * indexY + indexX;
				var targetCell = tableObj.cellHoverArray[cellIdx];
				//targetCell.node.dispatchEvent(new Event("mouseup"))	
			}).mousemove(function(e){
				var cellIdx = tableObj.length.x * indexY + indexX;
				var targetCell = tableObj.cellHoverArray[cellIdx];
				
				if(KTCE.tableCellDragFlag) {
					$(targetCell).trigger('mousemove');
				}
			});
			
			tableObj.cellTextArray[ indexY ][ indexX ] = wordWrapper;
			
			//아래 textCellEidtMode 위치가 틀린 것 같아 조정, 만약 문제가 되면 주석해제
			///셀병합/ 분할 시 실행
			if(initString != undefined) fnCellTextUpdate(initString, wordWrapper, true);	//3번째인자 merge일 경우 true	
			
		}

		function fnCellTextInputMode(tableG, indexX, indexY, e){	
			try{
				//잠금 텍스트 편집금지
				if(tableG.freeTransform.isLock(tableG)) {
					alert('잠금상태에서는 텍스트 입력이 제한됩니다!\n잠금해제후 텍스트를 편집하세요.')
					return;
				}
			}catch(e){}
			
			//표내 텍스트 기본 마진 설정
			fnSetTableCellMargin(KTCE.currentPaper);

			//기존 선택 cell 해제
			fnTableCellFillReset();

			//텍스트입력 cell에 active활성화
			var rectId = " rect.xCellHover.x" + indexX + "_y" + indexY;
			var dataMerge = $("#" + tableG.node.id + rectId).attr('data-merge');
			if(dataMerge == undefined) {
				//비merge cell 선택모드 활성화
				$("#" + tableG.node.id + rectId).attr({
					'fill': '#a2a2da',
					'data-active': 'active'
				});
				$("#" + tableG.node.id + rectId).css({
					'opacity': 0.4
				});
			}else{
				//merge cell이면 해당 cell 선택모드 활성화
				$("#" + tableG.node.id + " rect.xCellHover[data-merge='" + dataMerge + "']").attr({
					'fill': '#a2a2da',
					'data-active': 'active'
				});
				$("#" + tableG.node.id + " rect.xCellHover[data-merge='" + dataMerge + "']").css({
					'opacity': 0.4
				});
			}			

			var textWrapperForTable =  KTCE.currentPaper.objOuter.select("g.xTableTexts_" + tableG.node.id);		
			var cursorG = textWrapperForTable.select(".text-cursor");
			$(cursorG.node).css('display','block');
			var cursor = cursorG.children()[0];
			
			if(tcInterval != null || tcInterval != undefined){
				cursor.attr('visibility', 'hidden');
				clearInterval(tcInterval);
				tcInterval = null;
			}
			tcInterval = setInterval(function(){
				if(cursor.attr('visibility') == 'visible'){
					cursor.attr('visibility', 'hidden');
				} else {
					cursor.attr('visibility', 'visible');
				}
			}, 500);
			
			var _tableNumber = parseInt($(tableG.node).attr('data-id').substring(6,8));
			var wordWrapper = textWrapperForTable.select("#text" + _tableNumber + "_" + indexX + "_" + indexY + "_" + tableG.node.id);		
			var substring = getTextData(wordWrapper);

			//ie 초기 input foucs 유지
			if(browserType.indexOf('msie') > -1){	//IE
				$("#temp_textarea").hide();
				$("#temp_textarea").show();
			}

			$("#temp_textarea").css({'z-index': '-1', 'position': 'absolute', 'left': '-1000px'});
			setTimeout(function(e){
				$("#temp_textarea").focus();
			},10);

			$("#temp_textarea").val(substring).focus().unbind("keyup").bind("keyup", function(evt){
				
				var _keyCode = (evt.keyCode ? evt.keyCode: evt.which);

				fnCellTextUpdate($(evt.target).val(), wordWrapper, false, e, _keyCode);
				
				if(_keyCode == 13){					
					fnCellTextVerticalAlign('newLine');
				}
				
			});
			
			//move textarea cursor
			if(substring.length != 0 && substring != ' '){
				var pos = getSelectedCellPos(e, wordWrapper);
				if(pos != undefined){
					var textArray = $("#temp_textarea").val().split("\n");
					var prevLen = 0;
					for(var j=0; j<pos.row; j++){
						prevLen += textArray[j].length + 1;
					}
					var focusePos = prevLen + pos.tcol;
				} else {
					var focusePos = $("#temp_textarea").val().length;
				}
			} else {
				$("#temp_textarea").val('');
				var focusePos = 0;
				var pos = {
					row : 0,
					col : 1,
					tcol : 1,
				}
			}

			updateCellCursorPos(wordWrapper, pos);
			$("#temp_textarea")[0].setSelectionRange(focusePos,focusePos);
			textCellEditMode = true;
		
		}
		
		function getSelectedCellPos(e, obj){
			var point = KTCE.currentPaper.s.node.createSVGPoint();			
			var _matrix = obj.attr('transform').globalMatrix;
			var left = obj.getBBox().x;
			var top = obj.getBBox().y + (obj.getBBox().height / obj.selectAll('text').length);
			
			var initPos = {
				x : obj.attr("data-posx"),
				y : obj.attr("data-posy")
			};
			
			var disX = left - initPos.x;
			var disY = top - initPos.y;
	
			if(e != undefined){
				//canvas 확대/축소에 따른 마우스클릭 위치 및 비율확인
				var _svgScale = $(KTCE.currentPaper.s.node).css("scale");
				point.x = e.layerX / _svgScale;				
				point.y = e.layerY / _svgScale - _matrix.f;

				for(var i=0; i<obj.selectAll('text').length; i++){
					var pos = obj.selectAll('text')[i].node.getCharNumAtPosition(point);
					if(pos != -1){
						break;
					}
				}
				if(pos != -1){
					if(obj.attr("bullet-num") == null || obj.attr("bullet-num") == "0"){
						var selectedPos = {
							row : i,
							tcol : pos,
							col : pos
						}
					} else {
						var selectedPos = {
							row : i,
							tcol : (pos - bulletArray[obj.attr("bullet-num")].length < 0) ? 0 : pos - bulletArray[obj.attr("bullet-num")].length,
							col : pos
						}
					}
				}
			}
			return selectedPos;
		}
		
		function getUpdateCellCursorPos(obj, pos){
			if(pos == undefined){
				var cursorPos = $('textarea').get(0).selectionStart
				var prevLine = $('textarea').get(0).value.substr(0, $('textarea').get(0).selectionStart).split("\n");
				var cursorRow = prevLine.length
				var prevLength = 0;
				for(var i=0; i<cursorRow-1; i++){
					prevLength += prevLine[i].length
				}
				var textArray = $('textarea').get(0).value.split("\n");

				if(obj.attr("bullet-num") == null || obj.attr("bullet-num") == "0"){
					var pos = {
						row : cursorRow-1,
						col : cursorPos - prevLength - (cursorRow - 1),
						tcol : cursorPos - prevLength - (cursorRow - 1),
						textArray : textArray
					}
				} else {
					var pos = {
						row : cursorRow-1,
						col : cursorPos - prevLength - (cursorRow - 1) + bulletArray[obj.attr("bullet-num")].length,
						tcol : cursorPos - prevLength - (cursorRow - 1),
						textArray : textArray
					}
				}
			}
			return pos;
		}
		
		function updateCellCursorPos(obj, pos) {
			if(pos == undefined){
				var cursorPos = $('textarea').get(0).selectionStart
				var prevLine = $('textarea').get(0).value.substr(0, $('textarea').get(0).selectionStart).split("\n");
				var cursorRow = prevLine.length
				var prevLength = 0;
				for(var i=0; i<cursorRow-1; i++){
					prevLength += prevLine[i].length
				}

				if(obj.attr("bullet-num") == null || obj.attr("bullet-num") == "0"){
					var pos = {
						row : cursorRow-1,
						col : cursorPos - prevLength - (cursorRow - 1),
						tcol : cursorPos - prevLength - (cursorRow - 1)
					}
				} else {
					var pos = {
						row : cursorRow-1,	
						col : cursorPos - prevLength - (cursorRow - 1) + bulletArray[obj.attr("bullet-num")].length,
						tcol : cursorPos - prevLength - (cursorRow - 1)
					}
				}
			}
			
			var tempBoxPos = {
				x : obj.attr("data-posx"),
				y : obj.attr("data-posy")
			}
			
			
			var targetTextObj = obj.children()[pos.row];
			//두줄, 서식효과적용에 따른 targetTextObj 값에 따른 에러방지
			if(targetTextObj === undefined) return;			
				
			var _svgScale = $(KTCE.currentPaper.s.node).css("scale");
			var _matrix = obj.attr('transform').globalMatrix;
			var targetText = targetTextObj.node.textContent;
			var tempText = targetText.substr(0, pos.col);
			var fontSize = obj.children()[pos.row].attr("style");
			var tempTextObj = obj.text(targetTextObj.getBBox().x, tempBoxPos.y, tempText).attr('class', 'textBox').attr("style", fontSize);
			var cursor = obj.parent().select(".text-cursor").children();

			//이탤릭체에 따른 cursor위치 조정
			var rightMargin;
			var textAlign = $(obj.node).attr('text-align');
			var _fontSize = parseInt($(tempTextObj.node).css('font-size'));
			if(browserType.indexOf('msie') > -1 && $(obj.node).css('font-style') == 'italic'){	//IE italic
				//var textAlign = $(obj.node).attr('text-align');
				if(textAlign === 'left' && pos.col === 0 ) {
					rightMargin = -(fnIECellTextItalicMargin(obj.node, _fontSize, 2)*1.8);
				}else{
					rightMargin = fnIECellTextItalicMargin(obj.node, _fontSize, 2);
				}
			}else{
				if(textAlign === 'left' && pos.col === 0 ) {
					rightMargin = -(_fontSize*0.05);
				}else{
					rightMargin = 0;
				}
			}

			var x1 = targetTextObj.getBBox().x + tempTextObj.getBBox().width - rightMargin;
			var x2 = targetTextObj.getBBox().x + tempTextObj.getBBox().width - rightMargin;
			var y1 = (targetTextObj.getBBox().y + _matrix.f);
			var y2 = (targetTextObj.getBBox().y + targetTextObj.getBBox().height + _matrix.f );

		    cursor[0].attr({'x1': x1, 'x2': x2, 'y1': y1, 'y2': y2});
				     
			tempTextObj.remove();
			if(textCellEditMode){
				$('textarea').focus();
			}
		}
		
		function getCellBound(tCell, objTable){
			var rectBound = {
					width : 0,
					height : 0,
				};
			if($(tCell.node).attr("data-merge") != null){
				
				fnSetTableCellMargin(KTCE.currentPaper);	//2016/12/23 add
				
				var temp_cellArray = $(tCell.node).attr("data-merge").split(",");
				var sCellIdx = parseInt(temp_cellArray[0]);
				var eCellIdx = parseInt(temp_cellArray[temp_cellArray.length-1]);
				var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
				if (browserType.indexOf('msie') != -1){
					var endY = ($(objTable.xLineArray[eCellIdx+objTable.length.x].node).position().top - tableTextDisPos.ie.y) / $(KTCE.currentPaper.s.node).css("scale");
					var startY = ($(objTable.xLineArray[sCellIdx].node).position().top - tableTextDisPos.ie.y) / $(KTCE.currentPaper.s.node).css("scale");
				}else{
					var endY = ($(objTable.xLineArray[eCellIdx+objTable.length.x].node).position().top - tableTextDisPos.chrome.y) / $(KTCE.currentPaper.s.node).css("scale");
					var startY = ($(objTable.xLineArray[sCellIdx].node).position().top - tableTextDisPos.chrome.y) / $(KTCE.currentPaper.s.node).css("scale");
				}
		
				var startX = sCellIdx + parseInt(sCellIdx/objTable.length.x);
				//var startPosX = $(objTable.yLineArray[startX].node).position().left/ $(KTCE.currentPaper.s.node).css("scale");
				var endX = eCellIdx + parseInt(eCellIdx/objTable.length.x) + 1;
				//var endPosX = $(objTable.yLineArray[endX].node).position().left/ $(KTCE.currentPaper.s.node).css("scale");
		
				if (browserType.indexOf('msie') != -1){
					var startPosX = ($(objTable.yLineArray[startX].node).position().left - tableTextDisPos.ie.x) / $(KTCE.currentPaper.s.node).css("scale");
					var endPosX = ($(objTable.yLineArray[endX].node).position().left  - tableTextDisPos.ie.x) / $(KTCE.currentPaper.s.node).css("scale");
				}else{
					var startPosX = ($(objTable.yLineArray[startX].node).position().left - tableTextDisPos.chrome.x) / $(KTCE.currentPaper.s.node).css("scale");
					var endPosX = ($(objTable.yLineArray[endX].node).position().left - tableTextDisPos.chrome.x) / $(KTCE.currentPaper.s.node).css("scale");
				}
				rectBound.width = endPosX - startPosX;
				rectBound.height = endY - startY;
			} else {
				rectBound.width = tCell.node.getBoundingClientRect().width / $(KTCE.currentPaper.s.node).css("scale");
				rectBound.height = tCell.node.getBoundingClientRect().height / $(KTCE.currentPaper.s.node).css("scale");
			}
			return rectBound;
		}
		
		function fnCheckTextToCell(tCell, objTable, direction){
			var rectBound = getCellBound(tCell, objTable);
			var textBox = objTable.cellTextArray[tCell.attr("data-index-y")][tCell.attr("data-index-x")];
			var tbWidth = -9999;
			var tbHeight = 0;
			var rtValue = true;
			if(textBox != undefined){
				for(var j=0; j<textBox.selectAll('text').length; j++){
					if(tbWidth < textBox.selectAll('text')[j].getBBox().width)
						tbWidth = textBox.selectAll('text')[j].getBBox().width;
					tbHeight += textBox.selectAll('text')[j].getBBox().height;
				}
		
		
				if(!direction.x && !direction.y){
					if(rectBound.width > tbWidth + 10 && rectBound.height > tbHeight + 10){
						rtValue = true;
					} else {
						rtValue = false;
					}
				} else if(direction.x && !direction.y){
					if(rectBound.height > tbHeight + 10){
						rtValue = true;
					} else {
						rtValue = false;
					}
		
				} else if(!direction.x && direction.y){
					if(rectBound.width > tbWidth + 10){
						rtValue = true;
					} else {
						rtValue = false;
					}
				}
			}
			return rtValue;
		
		}
		
		//표내 텍스트 입력 및 효과(정렬/밑줄 등) update
		function fnCellTextUpdate(inputSting, textG, merge, e, _keyCode, breakLine){

			var wordIdx = {
					indexX : textG.data().indexX,
					indexY : textG.data().indexY
				};
			
			var tableObj = undefined;
			var tableArrayLength = KTCE.currentPaper.tableArray.length;
			for(var i=0; i<tableArrayLength; i++){
				var tableArrayId = KTCE.currentPaper.tableArray[i].id
				if(textG.data().pId == tableArrayId){
					tableObj = KTCE.currentPaper.tableArray[i];
					break;
				}
			}
		
			var cellIdx = tableObj.length.x * wordIdx.indexY + wordIdx.indexX;
			var targetCell = tableObj.cellHoverArray[cellIdx];
			var cellBound = getCellBound(targetCell, tableObj);
		
			//테이블내 텍스트 여백조절
			//fnSetTableCellMargin(KTCE.currentPaper);
			
			//테이블내 텍스트 입력시 좌표값 맞게 설정하기
			var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
			
			var svgMarginLeft = tableTextDisPos.svgMargin.left;	
			var svgMarginTop = tableTextDisPos.svgMargin.top;
			
			var textBoxPos = {
				x : textG.attr("data-posx"),
				y : textG.attr("data-posy")
			};
						
			var cellPos = $(targetCell.node).position();
			//테이블내 텍스트 입력시 좌표값 맞게 설정하기
			var positionX = (cellPos.left - tableTextDisPos.ie.x - svgMarginLeft) / $(KTCE.currentPaper.s.node).css("scale");
			var positionY = (cellPos.top - tableTextDisPos.ie.y - svgMarginTop) / $(KTCE.currentPaper.s.node).css("scale");
			if(textBoxPos.y != positionY) textG.attr({"data-posy": positionY});

			var lineHeight = (textG.attr('data-lineheight') != null) ? textG.attr('data-lineheight') : ((textG.attr('data-lineHeight') != null) ? textG.attr('data-lineHeight') : 0);
			lineHeight = (lineHeight != 'undefined') ? lineHeight : 0;

			if(lineHeight == null){
				textBoxPos.lh = 0;
			} else {
				textBoxPos.lh = parseFloat(lineHeight);
			}
					
			var prevWidth = textG.getBBox().width;
			var prevHeight = textG.getBBox().height;
		
			var textStyle = textG.select('text').attr("style");
			var textTap = textG.select('text').attr("data-tap") == null ? 0 : parseInt(textG.select('text').attr("data-tap"));
			//y = parseFloat(textBoxPos.y);
			y = positionY;
			
			var containerHeight = parseInt( targetCell.attr( 'height' ) );
			var LineArray = inputSting.split("\n");
			var LineArrayLength = LineArray.length;
			var newTextArray = [];
			var prevY = 0;
			var bulletNum = textG.attr("bullet-num");
			var pos = getSelectedCellPos(e, textG);
			var newPos = getUpdateCellCursorPos(textG);
			var _currentTextIdx = 0;
			if(pos != undefined) {
				_currentTextIdx = pos.row;
				_currentTextIdx = newPos.row;
			}else{
				if( LineArrayLength-1 != newPos.row && _keyCode != undefined) {
					_currentTextIdx = newPos.row;
				}else{
					if(pos == undefined && _keyCode == 38) {
						_currentTextIdx = newPos.row;
					}else if(LineArrayLength > 1) {
						_currentTextIdx = LineArrayLength-1;
						if(merge) _currentTextIdx = 0;
					
					}else{
						_currentTextIdx = 0;
					}
				}
			}
				
			var _tableTextWrapper = textG.parent();
			var _currentTextNode = "g#" + textG.node.id +">text:eq(" + _currentTextIdx + ")";
			var _textNode = $(_tableTextWrapper.node).find(_currentTextNode);
			var _underLineG = textG.select('g.textUnderLine');
			var _currentLineNode = "g#" + textG.node.id +">g.textUnderLine>line:eq(" + _currentTextIdx + ")";
			var _lineNode = $(_tableTextWrapper.node).find(_currentLineNode);
			var inputSentence = LineArray[_currentTextIdx];
			var inputSentenceLength = inputSentence.length;
			if(inputSentenceLength == 0){
				inputSentence = ' ';
			}

			var currentBullet = inputSentence.substring(0,2);
			for(var b=0; b<bulletArray.length; b++){
				var bullet = bulletArray[b];
				if(currentBullet == bullet) {
					if(bulletNum == null || bulletNum == '0'){
						inputSentence = inputSentence.split(currentBullet)[1];
					}else{
						inputSentence = bulletArray[bulletNum] + inputSentence.split(currentBullet)[1];
					}
					break;
				}
			}		

			var textArray = textG.selectAll('text');
			var underLineArray = textG.selectAll('line');
			var textArrayLength = textArray.length;
			var _baseHeight = textArray[0].getBBox().height;
			if(_keyCode == 13) {
				//TYPE#2: Enter Key 입력시 해당 cell안 TEXT 신규추가 생성후 모든 TEXT 속성값 갱신
				var _style = $(textG.select('text').node).attr('style');
				var newTextNode =  $(textArray[0].node).clone(true)[0];
				for(var i=0; i<LineArrayLength; i++) {					
					if(i>0){
						y += _baseHeight + textBoxPos.lh;
					}else{
						y += _baseHeight;
					}					
					var _textContent = LineArray[i];
					if(_textContent !=undefined) {
						if(_textContent.length == 0){
							_textContent = ' ';
						}
						//한글모드 Enter 2줄 입력처리 버그 대응
						if(i>=textArrayLength) {
							$(textG.node).append(newTextNode);
							textArray = textG.selectAll('text');
						}

						if(bulletNum == null || bulletNum == '0'){
						//	_textContent = _textContent.split(currentBullet)[1];
						}else{
							var currentBulletText = _textContent.substring(0,2);
							var bulletText = bulletArray[bulletNum];
							if(currentBulletText != bulletText) {
								_textContent = bulletArray[bulletNum] + _textContent;
							}
						}						
						var initY = y - _baseHeight;
						
						$(textArray[i].node).text(_textContent).attr({'y': y, 'data-initx': textBoxPos.x, 'data-inity': initY});
						
					}
				}
		
				//밑줄
				if (textG.attr("data-text-underline") === "underline") {
					
					$(textG.node).append(textG.select('g.textUnderLine').node);
					
					//밑줄추가
					var newLineNode =  $(underLineArray[0].node).clone(true)[0];
					//$(_underLineG.node).append(newLineNode);
										
					for(var i=0; i<LineArrayLength; i++) {
						
						//Enter 2줄 입력처리 버그 대응
						if(i>=LineArrayLength) {
							$(_underLineG.node).append(newLineNode);
						}
						
						var textBBox = textArray[i].getBBox();
						var _fontSize = parseInt($(textArray[i].node).css('font-size'));
						var _fontStyle = $(textG.node).css('font-style');
						if(browserType.indexOf('msie') > -1 && _fontStyle == 'italic'){	//IE italic
							var underlineMargin = _fontSize * 0.42;
							var _x1 = textBBox.x + underlineMargin;
							var _x2 = textBBox.x + textBBox.width - underlineMargin;
						}else if(browserType.indexOf('msie') > -1 && _fontStyle != 'italic'){	//IE NOT italic
							var underlineMargin = _fontSize * 0.03;
							var _x1 = textBBox.x + underlineMargin;
							var _x2 = textBBox.x + textBBox.width - underlineMargin;
						}else{
							var _x1 = textBBox.x;
							var _x2 = textBBox.x + textBBox.width;
						}
							
						var _y = textBBox.y + textBBox.height;
						if(browserType.indexOf('msie') > -1) {
							if($(textG.node).css('font-family').indexOf('olleh') > -1) { 
								_y = _y - ((_fontSize/0.75) * 0.145);
							}
						}
		
						var underLineArray = textG.selectAll('line');
						if(underLineArray[i] != undefined) {
							underLineArray[i].attr({'x1': _x1, 'x2': _x2, 'y1': _y, 'y2': _y});
							if(LineArray[i].length == 0 || LineArray[i] == ' ' && LineArray[i].length == 1) {
								$(underLineArray[i].node).css('visibility', 'hidden');
							}else{
								$(underLineArray[i].node).css('visibility', 'visible');
							}
						}
					}
					
				}

			}else if(_keyCode == 8 || _keyCode == 46) {	//backspace(8), delete(46)
				var _currentTextGRow = textArray.length;
				var inputBoxRow = newPos.textArray.length;
				
				if(inputBoxRow < _currentTextGRow) {
					textArray[textArrayLength-1].remove();
					if (textG.attr("data-text-underline") === "underline") {
						$(textG.select('g.textUnderLine>line:last-child').node).remove();
					}
					textArray = textG.selectAll('text');
					textArray.forEach(function(el, idx){
						var _textContent = LineArray[idx];
						
						if(idx === _currentTextIdx && _textContent.length == 0){
							//_textContent = '';
						}else if(idx != _currentTextIdx && _textContent.length == 0){
							_textContent = ' ';
						}
					
						if(bulletNum == null || bulletNum == '0'){
						}else{
							var currentBulletText = _textContent.substring(0,2);
							var bulletText = bulletArray[bulletNum];
							if(currentBulletText != bulletText) {
								_textContent = bulletArray[bulletNum] + _textContent;
							}
						}
						$(el.node).text(_textContent);
					})
				}else{
					if(bulletNum == null || bulletNum == '0'){
					}else{
						var currentBulletText = inputSentence.substring(0,2);
						var bulletText = bulletArray[bulletNum];
						if(currentBulletText != bulletText) {
							inputSentence = bulletArray[bulletNum] + inputSentence;
						}
					}
					_textNode.text(inputSentence);
				}

				//밑줄
				if (textG.attr("data-text-underline") === "underline") {
					for(var i=0; i<LineArrayLength; i++) {
						var textBBox = textArray[i].getBBox();
						var _fontSize = parseInt($(textArray[i].node).css('font-size'));
						var _fontStyle = $(textG.node).css('font-style');
						if(browserType.indexOf('msie') > -1 && _fontStyle == 'italic'){	//IE italic
							var underlineMargin = _fontSize * 0.42;
							var _x1 = textBBox.x + underlineMargin;
							var _x2 = textBBox.x + textBBox.width - underlineMargin;
						}else if(browserType.indexOf('msie') > -1 && _fontStyle != 'italic'){	//IE NOT italic
							var underlineMargin = _fontSize * 0.03;
							var _x1 = textBBox.x + underlineMargin;
							var _x2 = textBBox.x + textBBox.width - underlineMargin;
						}else{
							var _x1 = textBBox.x;
							var _x2 = textBBox.x + textBBox.width;
						}
							
						var _y = textBBox.y + textBBox.height;
						if(browserType.indexOf('msie') > -1) {
							if($(textG.node).css('font-family').indexOf('olleh') > -1) { 
								_y = _y - ((_fontSize/0.75) * 0.145);
							}
						}
		
						var underLineArray = textG.selectAll('line');
						if(underLineArray[i] != undefined) {
							underLineArray[i].attr({'x1': _x1, 'x2': _x2, 'y1': _y, 'y2': _y});
							if(LineArray[i].length == 0) {
								$(underLineArray[i].node).css('visibility', 'hidden');
							}else{
								$(underLineArray[i].node).css('visibility', 'visible');
							}
						}
					}
					
				}
			}else{		
							
				if(bulletNum == null || bulletNum == '0'){
				}else{
					inputSentence = bulletArray[bulletNum] + inputSentence;
				}
				
				if(_currentTextIdx==0){
					y +=  _baseHeight;
				}else{
					y +=  _baseHeight*(_currentTextIdx+1) + (textBoxPos.lh * _currentTextIdx);
				}
				var initY = y - _baseHeight;
				
				if(_currentTextIdx==0){
					_textNode.text(inputSentence).attr({'y': y, 'data-inity': initY});
				}else{
					_textNode.text(inputSentence);
				}

				if (textG.attr("data-text-underline") === "underline" && textArray.length > 0) {
					var textBBox = textArray[_currentTextIdx].getBBox();
					var underLine = _lineNode[0];
					var _fontSize = parseInt($(textArray[_currentTextIdx].node).css('font-size'));
					var _fontStyle = $(textG.node).css('font-style');
					if(browserType.indexOf('msie') > -1 && _fontStyle == 'italic'){	//IE italic
						var underlineMargin = _fontSize * 0.42;
						var _x1 = textBBox.x + underlineMargin;
						var _x2 = textBBox.x + textBBox.width - underlineMargin;
					}else if(browserType.indexOf('msie') > -1 && _fontStyle != 'italic'){	//IE NOT italic
						var underlineMargin = _fontSize * 0.03;
						var _x1 = textBBox.x + underlineMargin;
						var _x2 = textBBox.x + textBBox.width - underlineMargin;
					}else{
						var _x1 = textBBox.x;
						var _x2 = textBBox.x + textBBox.width;
					}
						
					var _y = textBBox.y + textBBox.height;
					if(browserType.indexOf('msie') > -1) {
						if($(textG.node).css('font-family').indexOf('olleh') > -1) { 
							_y = _y - ((_fontSize/0.75) * 0.145);
						}
					}
					
					if(underLineArray[_currentTextIdx] != undefined) {
						var _textValue = _textNode.text();
						if(_textValue.length ==0 || _textValue == ' ') {
							$(underLine).css('visibility', 'hidden');
							$(underLineArray[_currentTextIdx].node).css('visibility', 'hidden');
						}else{
							$(underLine).css('visibility', 'visible');
						}
						$(underLine).attr({'x1': _x1, 'x2': _x2});
					}
				}
				
			}
			
			//table cell 크기 조절시 최소 변경에 대한 text값 지정
			var _getTableTextBoxBound = getTableTextBoxBound(textG);
			var _width = _getTableTextBoxBound.width;			
			var _height = _getTableTextBoxBound.height + (textBoxPos.lh * _currentTextIdx);
			var _strokeLeftWidth = parseInt($(tableObj.yLineArray[cellIdx].node).css('stroke-width'));
			//_height = _height + tableTextDisPos.textMarginTop + _strokeLeftWidth + 5;
			textG.attr({
				'data-width': _width,
				'data-height': _height
			});
			var yHeight = _height + tableTextDisPos.textMarginTop + _strokeLeftWidth + 5;
			var xWidth = _width + tableTextDisPos.textMarginLeft + _strokeLeftWidth;
			var cellBoundHeight = cellBound.height;
			var cellBoundWidth = cellBound.width;
			var currentShape = KTCE.currentPaper.currentShape;
			var dataMerge = targetCell.attr("data-merge");
			var cellNum = null;
			if(dataMerge != null && yHeight > cellBoundHeight || dataMerge != null && xWidth > cellBoundWidth){
				var mergedCellArray = dataMerge.split(",");
				var mergedCellArrayLength = mergedCellArray.length;
				cellNum = parseInt(mergedCellArray[mergedCellArrayLength-1]);
			} else {
				cellNum = cellIdx;
			}
			
			if(_keyCode == 13) {
				//Y axe Resize
				if(yHeight > cellBoundHeight){
					//아래 함수/싱글톤을 prototype 으로 변경
					var _Ycell =  tableObj.cellHoverArray[cellNum]
					var _Ych = cellBound.height;
					var _Yth = _height / ($("#temp_textarea").val().split("\n").length);
					var fnTableCellYResize = new fnTableCellResize();				
					fnTableCellYResize.setYResize(tableObj, cellNum, _Ycell, _width, _height, _Ych, _Yth, true, currentShape, 1, 1, 'input');				
					fnTableCellYResize.updateYResize();
				}
			}else{
				
				if((xWidth > cellBoundWidth) && !merge){	//기본마진 + 셀라인두께 포함						
					var _Xcell = tableObj.cellHoverArray[cellNum];
					var _Xwidth = _width  + tableTextDisPos.textMarginLeft + _strokeLeftWidth;
					var _Xcw = cellBound.width;
					var _Xch = cellBound.heigh;
					var fnTableCellXResize = new fnTableCellResize();					
					fnTableCellXResize.setXResize(tableObj, cellNum, _Xcell, _Xwidth, _height, _Xcw, _Xch, _width, true, currentShape, 1, 1, 'input');
					fnTableCellXResize.updateXResize();
				}
			}
			
			var textAlign = textG.attr('text-align');
			//아래 fnCellTextAlign 함수 실행히 입력속도 저하됨에 따라 left정렬시 미실행으로 속도 튜닝효과
			if(textAlign === 'center' || textAlign === 'right'){
				fnCellTextAlign(KTCE.currentPaper.currentShape, textAlign, textG, false);
			}
			
			tableObj.cellTextArray[ wordIdx.indexY ][ wordIdx.indexX ] = textG;
		
			updateCellCursorPos(textG);
		
		}
		
		function fnCellTextArrayUpdate(textItemArray, mode, e){
			
			var tableObj=undefined, tableObjId=null;
			
			fnSetTableCellMargin(KTCE.currentPaper);

			//테이블내 텍스트 입력시 좌표값 맞게 설정하기
			var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
			var textItemArrayLength = textItemArray.length;

			if(textItemArrayLength > 0){
				var currentShape = KTCE.currentPaper.currentShape;
				
				textItemArray.forEach(function(el, idx){
					var textG = el;
					var inputSting = getTextData(textG);
					var wordIdx = {
							indexX : textG.data().indexX,
							indexY : textG.data().indexY
						};
					var tableArray = KTCE.currentPaper.tableArray;
					var tableArrayLength = tableArray.length;
					for(var i=0; i<tableArrayLength; i++){
						if(textG.data().pId == tableArray[i].id){
							tableObj = tableArray[i];
							break;
						}
					}
					
					var tableObjLength = tableObj.length;
					var tableObjLengthX = tableObjLength.x;
					var tableObjLengthY = tableObjLength.y;
					var tableObjLengthY1 = tableObjLength.y+1;
					var cellIdx = tableObj.length.x * wordIdx.indexY + wordIdx.indexX;
					var targetCell = tableObj.cellHoverArray[cellIdx];
					var cellBound = getCellBound(targetCell, tableObj);
					var svgMarginLeft = tableTextDisPos.svgMargin.left;	
					var svgMarginTop = tableTextDisPos.svgMargin.top;
					var lineHeight = ($(textG.node).attr('data-lineheight') != null) ? $(textG.node).attr('data-lineheight') : (($(textG.node).attr('data-lineHeight') != null) ? $(textG.node).attr('data-lineHeight') : 0);
					lineHeight = (lineHeight != 'undefined') ? lineHeight : 0;
					
					if(lineHeight == null){
						lineHeight = 0;
					} else {
						lineHeight = parseFloat(lineHeight);
					}
					
					var textBoxPos = {
							x : parseFloat(textG.attr("data-posx")),
							y : parseFloat(textG.attr("data-posy")),
							lh : lineHeight
					};
					
				
					var prevWidth = textG.getBBox().width;
					var prevHeight = textG.getBBox().height;
					var textStyle = textG.select('text').attr("style");
					var textTap = textG.select('text').attr("data-tap") == null ? 0 : parseInt(textG.select('text').attr("data-tap"));
					var y = parseFloat(textBoxPos.y);// + 25;
					var containerHeight = parseInt( targetCell.attr( 'height' ) );
					var LineArray = inputSting.split("\n");
					var LineArrayLength = LineArray.length;
					var newTextArray = [];
					var prevY = 0;				
					var bulletNum = textG.attr("bullet-num");				
					var pos = getSelectedCellPos(e, textG);
		            var _currentTextIdx = 0;
		            if(pos != undefined) {
		                _currentTextIdx = pos.row;
		            }else if(LineArrayLength > 1) {
		                _currentTextIdx = LineArrayLength-1;
		            }else{
		                _currentTextIdx = 0;
		            }
		            var _tableTextWrapper = textG.parent();
		            var _text = $(_tableTextWrapper.node).find("g#" + textG.node.id +">text:eq(" + _currentTextIdx + ")");
		            var inputSentence = LineArray[_currentTextIdx];
		            if(inputSentence.length == 0){
		                inputSentence = ' ';
		            }
		            var inputedTextLine = _text;
		            if(_text.length != 0) {
		            	_text.text(inputSentence);
						var currentBullet = inputSentence.substring(0,2);
						for(var b=0; b<bulletArray.length; b++){
							var bullet = bulletArray[b];
							if(currentBullet == bullet) {
								inputSentence = inputSentence.split(currentBullet)[1];
								break;
							}
						}
		                if(bulletNum == null || bulletNum == '0'){
		                	_text.text(inputSentence);
		                }else{
		                	_text.text(bulletArray[bulletNum] + inputSentence);
		                }
		            }else{
		                if(bulletNum == null || bulletNum == '0'){
		                    inputedTextLine = textG.text(textBoxPos.x, y, inputSentence).attr('class','textBox').attr("style", textStyle).attr("data-tap", textTap);
		                }else{
		                    inputedTextLine = textG.text(textBoxPos.x, y, [bulletArray[bulletNum],inputSentence]).attr('class','textBox').attr("style", textStyle).attr("data-tap", textTap);
		                }
		                
		                inputedTextLine.attr('data-initx', inputedTextLine.attr('x'));
		                inputedTextLine.attr('data-inity', inputedTextLine.attr('y'));
		                newTextArray.push(inputedTextLine);             
		                //prevY = prevY + parseFloat(inputedTextLine.getBBox().height);
		                y = y + inputedTextLine.getBBox().height;
		            }
		            
		            var textArray = textG.selectAll('text');
					var underLineArray = textG.selectAll('line');
					var textArrayLength = textArray.length;
					var _baseHeight = textArray[0].getBBox().height;
					var _baseWidth = textG.getBBox().width;
					var matrix = KTCE.currentPaper.currentShape.attr('transform').globalMatrix;
					
					//y += _baseHeight;
					if(textArrayLength>1){
						var dataPosY = parseFloat(textG.attr("data-posy"));
						textArray.forEach(function(el, idx){
							if(idx>0){
								y += _baseHeight + lineHeight;
							}else{
								y += _baseHeight;
							}
							var initY = y - _baseHeight;
							el.attr({'y': y, 'data-inity':initY} );
						});
						
					}
				});
				
				var textAlign = [];
	            var selectedArray = fnFindTextGroup( currentShape );
				var cellArray = selectedArray.cellArray;
				
				var textX = [], textY = [];
				var tableObjLength = tableObj.length;
				var tableObjLengthX = tableObjLength.x;
				var tableObjLengthY = tableObjLength.y;
				var tableObjId = tableObj.id;
				var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));							
				for(var x=0; x<tableObjLengthX; x++) {
					var tempX = [];
					for(var y=0; y<tableObjLengthY; y++) {						
						var cellDataMergeValue = $("#" + tableObjId).find("rect.xCellHover.x" + x +"_y" + y).attr('data-merge');
						var tempTextX = $("g.xTableTexts_" + tableObjId).find("g#text" + _tableNumber + "_"+ x +"_" + y + "_" + tableObjId);	
						var _xCellIdx = tableObjLengthX * y + x;
						var xTargetCell = tableObj.cellHoverArray[_xCellIdx];
						if(cellDataMergeValue != undefined) {
							var mergeDataArray = cellDataMergeValue.split(',');
							var mergeHoverCellMinIdxX = mergeDataArray[0];
							var mergeHoverCellMaxIdxX = mergeDataArray[mergeDataArray.length-1];

							var minCol = parseInt(mergeHoverCellMinIdxX % tableObjLengthX);
							var maxCol = parseInt(mergeHoverCellMaxIdxX % tableObjLengthX);
							var minRow = parseInt(mergeHoverCellMinIdxX / tableObjLengthX);
							var maxRow = parseInt(mergeHoverCellMaxIdxX / tableObjLengthX);
							var limitCol = maxCol - minCol;
							
							tempTextX = $("g.xTableTexts_" + tableObjId).find("g#text" + _tableNumber + "_"+ minCol +"_" + minRow + "_" + tableObjId);
							
							var _getTableTextBoxBound = getTableTextBoxBound(Snap(tempTextX[0]));
							var _xWidth = _getTableTextBoxBound.width/ (limitCol + 1);
							var _xCellBound = getCellBound(xTargetCell, tableObj);
							var _xCellBoundWidth = _xCellBound.width / (limitCol + 1);
						}else{
							var _getTableTextBoxBound = getTableTextBoxBound(Snap(tempTextX[0]));
							var _xWidth = _getTableTextBoxBound.width;
							var _xCellBound = getCellBound(xTargetCell, tableObj);
							var _xCellBoundWidth = _xCellBound.width;
						}							
						var tempTextXLength = tempTextX.length;

						if(tempTextXLength > 0 ) {
							var xCellNum = _xCellIdx;
							var xDataMerge = xTargetCell.attr("data-merge");
							var _Xcw = _xCellBoundWidth;
							var _Xch = _xCellBound.height;
							var _strokeLeftWidth = parseInt($(tableObj.yLineArray[0].node).css('stroke-width'));
							var _xHeight = _getTableTextBoxBound.height;
							
							tempTextX.attr({
								'data-width': _xWidth,
							});	
							
							var tempWidth = _xWidth + tableTextDisPos.textMarginLeft + _strokeLeftWidth;
							
							tempX.push({'cellNum': xCellNum, 'textWidth': tempWidth, 'width': _xWidth, 'height': _xHeight, 'cw': _Xcw, 'ch': _Xch, 'cellBoundWidth': _xCellBoundWidth, 'cellMerge': xDataMerge});							
						}else{

						}
					}
					var tempXLength = tempX.length;
					if(tempXLength > 0) {
						//배열 크기값기준으로 정렬
						tempX.sort(function(a,b){
							return b.textWidth-a.textWidth;// > a.textWidth ? -1 : b.textWidth < a.textWidth ? 1:0;
						});
						textX.push(tempX[0]);
					}
				}

				for(var y=0; y<tableObjLengthY; y++) {
					var tempY = [];
					for(var x=0; x<tableObjLengthX; x++){
						var tempTextY = $("g.xTableTexts_" + tableObjId).find("g#text" + _tableNumber  + "_"+ x +"_" + y + "_" + tableObjId);								
						var tempTextYLength = tempTextY.length;
						var textArray = tempTextY.find('text');
						var textArrayLength = textArray.length;
						var tempTextLineHeight = (tempTextY.attr('data-lineheight') != null) ? tempTextY.attr('data-lineheight') : ((tempTextY.attr('data-lineHeight') != null) ? tempTextY.attr('data-lineHeight') : 0);
						tempTextLineHeight = (tempTextLineHeight != 'undefined') ? tempTextLineHeight : 0;
						
						if(tempTextLineHeight == null || textArrayLength == 1){
							var lineHeight = 0;
						} else {
							var lineHeight = parseFloat(tempTextLineHeight);
						}

						if(tempTextYLength > 0 ) {
							var _getTableTextBoxBound = getTableTextBoxBound(Snap(tempTextY[0]));
							var _indexX = parseInt($(tempTextY).attr('data-cellx'));
							var _indexY = parseInt($(tempTextY).attr('data-celly'));
							var _yCellIdx = tableObjLengthX * _indexY + _indexX;
							var yCellNum = _yCellIdx;
							var yTargetCell = tableObj.cellHoverArray[_yCellIdx];
							var yDataMerge = yTargetCell.attr("data-merge");
							var _yTargetCell = tableObj.cellHoverArray[_yCellIdx];
							var _yCellBound = getCellBound(_yTargetCell, tableObj);
							var _yCellBoundHeight = _yCellBound.height;
							var _Ycw = _yCellBound.width;
							var _Ych = _yCellBound.height;
							var _strokeLeftWidth = parseInt($(tableObj.yLineArray[y].node).css('stroke-width'));
							var _yWidth = _getTableTextBoxBound.width;
							var _yHeight = _getTableTextBoxBound.height + (lineHeight * (textArrayLength-1));
							tempTextY.attr({
								'data-height': _yHeight
							});
							var tempHeight = _yHeight + tableTextDisPos.textMarginTop + _strokeLeftWidth + 5;
							tempY.push({'cellNum': yCellNum, 'textHeight': tempHeight, 'width': _yWidth, 'height': _yHeight, 'cw': _Ycw, 'ch': _Ych, 'cellBoundHeight': _yCellBoundHeight, 'textG': tempTextY});							
						}
					}
					if(tempY.length>0) {
						//배열 크기값기준으로 정렬
						tempY.sort(function(a,b){
							return b.textHeight-a.textHeight;
						});
					
						textY.push(tempY[0]);
					}
				}
				textY.sort(function(a,b){
					return a.cellNum-b.cellNum;
				});
		
				var textYLength = textY.length;
				if(textYLength > 0){
					for(var yy=0; yy<textYLength; yy++){
						var currentCellTextWrapper = textY[yy].textG;
						var lineHeight = parseFloat((currentCellTextWrapper.attr("data-lineheight") != null) ? currentCellTextWrapper.attr("data-lineheight") : currentCellTextWrapper.attr("data-lineHeight"));
						lineHeight = lineHeight == null ? 0 : lineHeight;
						var _baseHeight = Snap(currentCellTextWrapper.find('text')[0]).getBBox();//textArray[0].getBBox().height;
						var textHeight = textY[yy].textHeight;
						var _yCellBoundHeight = textY[yy].cellBoundHeight;

						if(textHeight > _yCellBoundHeight){	//기본마진 + 셀라인두께 포함
							var cellNum = textY[yy].cellNum;
							var _Ycell =  tableObj.cellHoverArray[cellNum]
							var _width = textY[yy].width;
							//var _height = textHeight
							var _height = textY[yy].height
							var _Ych = textY[yy].ch;
							var newtextArrayLength = currentCellTextWrapper.find('text').length;
							var _Yth = _height / newtextArrayLength;	
							var _nowYIdx = yy + 1;
							var fnTableCellYResize = new fnTableCellResize();							
							//fnTableCellYResize.setYResize(tableObj, cellNum, _Ycell, _width, _height, _Ych, _Yth, true, currentShape, textYLength, _nowYIdx, true);	//셀병합 구간 행간반영
							//fnTableCellYResize.setYResize(tableObj, cellNum, _Ycell, _width, _height, _Ych, _Yth, true, currentShape, textYLength, _nowYIdx, 'update');	//셀병합 구간 행간반영, 2017-01-19
							fnTableCellYResize.setYResize(tableObj, cellNum, _Ycell, _width, _height, _Ych, _Yth, true, currentShape, textYLength, _nowYIdx, mode);	//셀병합 구간 행간반영원본							
							fnTableCellYResize.updateYResize();	
						}						
					}
				}

				var textXLength = textX.length;
				if(textXLength > 0){
					for(var xx=0; xx<textXLength; xx++){
						var textWidth = textX[xx].textWidth;
						var _xCellBoundWidth = textX[xx].cellBoundWidth
						if(textWidth > _xCellBoundWidth){	//기본마진 + 셀라인두께 포함	
							var cellNum = textX[xx].cellNum;
							var _Xcell = tableObj.cellHoverArray[cellNum];
							var _width = textX[xx].width;
							var _height = textX[xx].height;
							var _Xwidth = textWidth;
							var _Xcw = textX[xx].cw;
							var _Xch = textX[xx].ch;
							var _nowXIdx = xx + 1;
							var fnTableCellXResize = new fnTableCellResize();			
							//fnTableCellXResize.setXResize(tableObj, cellNum, _Xcell, _Xwidth, _height, _Xcw, _Xch, _width, true, currentShape, textXLength, _nowXIdx, false);
							//fnTableCellXResize.setXResize(tableObj, cellNum, _Xcell, _Xwidth, _height, _Xcw, _Xch, _width, true, currentShape, textXLength, _nowXIdx, 'update');
							fnTableCellXResize.setXResize(tableObj, cellNum, _Xcell, _Xwidth, _height, _Xcw, _Xch, _width, true, currentShape, textXLength, _nowXIdx, mode);								
							fnTableCellXResize.updateXResize();	
						}
					}
					
					//가로선 맞춤
					if(browserType.indexOf('msie') > -1) {	
						setIEStrokeWidth(KTCE.currentPaper.currentShape);
					}
					
				}

			}else{
				
			}
		}
		
		function fnTableAutoNewLine(inputText, inputedTextLineObj, bulletNum, textG){
			for(j=0; j<inputText.length; j++){
				var temp= textG.text(inputedTextLineObj.attr('x'), inputedTextLineObj.attr('y'), inputText.substring(0, j+1)).attr('class','textBox').attr("style", inputedTextLineObj.attr("style"));
				if(temp.getBBox().width > cellBound.width){							
					temp.remove();
					break;
				} else {
					temp.remove();
				}
			}
			var tempString = [inputSentence.substring(0, j),  inputSentence.substring(j, inputSentence.length)]
			if(bulletNum == null || bulletNum == '0'){
				var spaned0= textG.text(inputedTextLineObj.attr('x'), inputedTextLineObj.attr('y'), tempString[0]).attr('class','textBox').attr("style",  inputedTextLineObj.attr("style"));
			} else {
				var spaned0= textG.text(inputedTextLineObj.attr('x'), inputedTextLineObj.attr('y'), [bulletArray[bulletNum],tempString[0]]).attr('class','textBox').attr("style",  inputedTextLineObj.attr("style"));
			}
			spaned0.attr('data-initx', spaned0.attr('x'));
			spaned0.attr('data-inity', spaned0.attr('y'));
			newTextArray.push(spaned0);

			
			if(bulletNum == null || bulletNum == '0'){
				var spaned1= textG.text(spaned0.attr('x'), spaned0.attr('y'), tempString[1]).attr('class','textBox').attr("style", textStyle);
			} else {
				var spaned1= textG.text(spaned0.attr('x'), spaned0.attr('y'), [bulletArray[bulletNum],tempString[1]]).attr('class','textBox').attr("style", textStyle);
			}				
			spaned1.attr('y', parseFloat(spaned0.attr('y')) + parseFloat(spaned1.getBBox().height) + textBoxPos.lh*i);
			spaned1.attr('data-initx', spaned1.attr('x'));
			spaned1.attr('data-inity', spaned1.attr('y'));
			newTextArray.push(spaned1);
			inputedTextLine.remove();
		}

		function getTableTextBoxBound(textGroup){
			var width = -99999;
			var height = 0;
			for(var i = 0; i < textGroup.selectAll('text').length; i++){
				var textItem = textGroup.selectAll('text')[i];
				if(width < textItem.getBBox().width) width = textItem.getBBox().width;
				height += textItem.getBBox().height;
			}

			return {
				width : width,
				height : height
			}
		}

		// 표(hanlder) 선택 위치이동 크기 조절시 표 텍스트 위치설정
		function fnUpdateTextPositionInFreeTransformTable(ft) {
			
			var textWrapperForTable =  KTCE.currentPaper.objOuter.select("g.xTableTexts_" +  ft.subject.attr("id"));
			if(textWrapperForTable === null) return;
			
			var textWrapperArray = textWrapperForTable.selectAll("g.cellTextWrapper");
			var textWrapperArrayLength = textWrapperArray.length;
			
			if(textWrapperForTable != null){
				
				fnSetTableCellMargin(KTCE.currentPaper);
				
				var _mouseEvent = KTCE.currentPaper.shapeDragState;
				var _mouseDown = {};
					_mouseDown.x, _mouseDown.y, _mouseDown.dx, _mouseDown.dy = null;
				switch(_mouseEvent) {
					case 'mousestart':
						if(textCellEditMode){
							$("#temp_textarea").hide();
							textWrapperForTable.select('.text-cursor').children()[0].attr("visibility", "hidden");
							clearInterval(tcInterval);
							tcInterval = null;
							textCellEditMode = false;
						}
						break;
					case 'mouseup':
						$("#temp_textarea").show();
						break;
					case 'mousescalestart':
						//textWrapperForTable.select('.text-cursor').children()[0].attr("visibility", "hidden");
						if(textCellEditMode){
							$("#temp_textarea").hide();
							textWrapperForTable.select('.text-cursor').children()[0].attr("visibility", "hidden");
							clearInterval(tcInterval);
							tcInterval = null;
							textCellEditMode = false;
						}
						var matrix = KTCE.currentPaper.currentShape.attr('transform').globalMatrix;
						_mouseDown.x = matrix.e;
						_mouseDown.y = matrix.f;
						break;
					case 'mousescalemove':
						var matrix = KTCE.currentPaper.currentShape.attr('transform').globalMatrix;
						_mouseDown.dx = matrix.e;
						_mouseDown.dy = matrix.f;
						if(_mouseDown.x != _mouseDown.dx || _mouseDown.y != _mouseDown.dy) {
							$(textWrapperForTable.node).css('opacity', 0.01);
						}
						break;
					case 'mousescaleup':
						$("#temp_textarea").show();
						if($("#" + ft.subject.attr("id")).attr('data-name') != 'xTable') return;
						var _tableNumber = parseInt($("#" + ft.subject.attr("id")).attr('data-id').substring(6,8));
						var tableObj = KTCE.currentPaper.tableArray[_tableNumber];
						var _opacity =  $(textWrapperForTable.node).css('opacity');
						if(textWrapperForTable != null && _opacity != 1) $(textWrapperForTable.node).css('opacity', 1);
						
						for(var i=0; i<textWrapperArrayLength; i++){
							var textWrapper = textWrapperArray[i];
							var textArray = textWrapper.selectAll("text");
							var indexX = textWrapper.attr("data-cellX");
							if(indexX == undefined) indexX = $(textWrapper.node).attr("data-cellX");
							var indexY = textWrapper.attr("data-cellY");
							if(indexY == undefined) indexY = $(textWrapper.node).attr("data-cellY");
							var cellBound = getCellBound(ft.subject.select(".x"+indexX+"_y"+indexY), tableObj)
							var prevH = 0;
							var txtAlign = textWrapper.attr('text-align');
							var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
							var cellLeft = parseFloat($(ft.subject.select(".x"+indexX+"_y"+indexY).node).position().left);
							var cellTop = parseFloat($(ft.subject.select(".x"+indexX+"_y"+indexY).node).position().top);
							var svgScale = $(KTCE.currentPaper.s.node).css("scale");
							var lineHeight = parseFloat((textWrapper.attr("data-lineheight") != null) ? textWrapper.attr("data-lineheight") : textWrapper.attr("data-lineHeight"));
							lineHeight = lineHeight == null ? 0 : lineHeight;
						
							//표내 텍스트 여백값 구하기
							var _strokeLeftWidth = parseFloat($(ft.subject.select("line.yLine.x"+indexX+"_y"+indexY).node).attr('data-stroke-width'))/2;
							
							var positionX = ((cellLeft - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
							var positionY = (cellTop - tableTextDisPos.ie.y - tableTextDisPos.svgMargin.top) / svgScale;
							textWrapper.attr({'data-posx': positionX, 'data-posy': positionY})
							
							var _x, _y = null;							
							textArray.forEach(function(el, j){
								if(browserType.indexOf('msie') != -1){
									switch(txtAlign){
									case "left":
										_x = ((cellLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
										el.attr({"x": _x, 'data-initx': _x});
										break;
									case "center":
										var selfW = parseFloat(textArray[j].getBBox().width);
										var relativePos = (cellBound.width-selfW)/2;
										if(relativePos < 0) relativePos = 0;
										var _fontSize = parseInt($(textArray[j].node).css('font-size'));
										var rightMargin = fnIECellTextItalicMargin(textWrapper.node, _fontSize, 2);
										_x = ((cellLeft - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos) + rightMargin;
										el.attr({"x": _x, 'data-initx': _x});
										break
									case "right":
										var selfW = parseFloat(el.getBBox().width);
										var relativePos = cellBound.width-selfW;
										if(relativePos < 0) relativePos = 0;
										var _fontSize = parseInt($(textArray[j].node).css('font-size'));
										var rightMargin = fnIECellTextItalicMargin(textWrapper.node, _fontSize, 1);
										_x = ((((cellLeft - tableTextDisPos.svgMargin.left) - (tableTextDisPos.ie.x + tableTextDisPos.textMarginLeft)) / svgScale + relativePos) + rightMargin) - _strokeLeftWidth;
										el.attr({"x": _x, 'data-initx': _x});
										break;
									default :
										_x = ((cellLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
										el.attr({"x": _x, 'data-initx': _x});
									}

									var textHeight = el.getBBox().height;
									prevH += textHeight;
									_y = ((cellTop - tableTextDisPos.ie.y - tableTextDisPos.svgMargin.top) / svgScale + prevH) + lineHeight*j;
									var initY = _y - textHeight;
									el.attr({"y": _y, 'data-inity': initY});

								}else {
									switch(txtAlign){
									case "left":
										_x = ((cellLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
										el.attr({"x": _x, 'data-initx': _x});
										break;
									case "center":
										var selfW = parseFloat(textArray[j].getBBox().width);
										var relativePos = (cellBound.width-selfW)/2;
										if(relativePos < 0) relativePos = 0;
										_x = (cellLeft - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left)/ svgScale + relativePos;
										el.attr({"x": _x, 'data-initx': _x});
										break
									case "right":
										var selfW = parseFloat(el.getBBox().width);
										var relativePos = cellBound.width-selfW;
										if(relativePos < 0) relativePos = 0;
										_x = (((cellLeft - tableTextDisPos.svgMargin.left) - (tableTextDisPos.chrome.x + tableTextDisPos.textMarginLeft)) / svgScale + relativePos) - _strokeLeftWidth;
										el.attr({"x": _x, 'data-initx': _x});
										break;
									default :
										_x = ((cellLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
										el.attr({"x": _x, 'data-initx': _x});
									}
									
									var textHeight = el.getBBox().height;
									prevH += textHeight;
									_y = ((cellTop - tableTextDisPos.chrome.y - tableTextDisPos.svgMargin.top) / svgScale + prevH) + lineHeight*j;							
									var initY = _y - textHeight;
									el.attr({"y": _y, 'data-inity': initY});
								}
								
								//표내 빈 텍스트구간 실행금지(textWrapperArray[i].select(".textUnderLine")!=null)
								if (textWrapperArray[i].attr("data-text-underline") == "underline" && textWrapperArray[i].select("g.textUnderLine") != null) {	
									var _fontSize = parseInt($(textArray[j].node).css('font-size'));
									if(browserType.indexOf('msie') > -1 && $(textWrapperArray[i].node).css('font-style') == 'italic'){	//IE italic
										var underlineMargin = _fontSize * 0.42;
										var _x1 = textArray[j].getBBox().x + underlineMargin;
										var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width - underlineMargin;
									}else if(browserType.indexOf('msie') > -1 && $(textWrapperArray[i].node).css('font-style') != 'italic'){	//IE NOT italic
										var underlineMargin = _fontSize * 0.03;
										var _x1 = textArray[j].getBBox().x + underlineMargin;
										var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width - underlineMargin;
									}else{
										var _x1 = textArray[j].getBBox().x;
										var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width;
									}
									
									var _y = el.getBBox().y + el.getBBox().height;
									if(browserType.indexOf('msie') > -1) {
										if($(textWrapper.node).css('font-family').indexOf('olleh') > -1) { //올레체 경우 밑줄간격 -15 조절
											_y = _y - ((_fontSize/0.75) * 0.145);
										}
									}
									
									var underLine = textWrapperArray[i].select("g.textUnderLine").selectAll("line")[j];							
									if(underLine != undefined){
										underLine.attr({"x1": _x1, "x2": _x2, "y1": _y, "y2": _y});
									}
								}
								
								if(tableObj.id != undefined) {
									var cell = $("#" + tableObj.id + " .xCellHover.x" + indexX + "_y" + indexY + "[data-merge]");
									if(cell.length>0){	
										if(txtAlign === 'center' || txtAlign === 'right'){
											fnCellTextAlign(KTCE.currentPaper.currentShape, txtAlign, textWrapper, false);
										}
										return;
									}
								}									
							});	
						}
						
						fnCellTextVerticalAlign();
							
						setTimeout(function(){
							// 상태 저장
							fnSaveState();
						}, 500)
							
						break;
				}	
			}
		}

		function fnUpdateTextPositionInTable(ft, isAutoNewLine){

			fnSetTableCellMargin(KTCE.currentPaper);
			
			var textWrapperForTable =  KTCE.currentPaper.objOuter.select("g.xTableTexts_" +  ft.subject.attr("id"));
			if(textWrapperForTable != null){
				var textWrapperArray = textWrapperForTable.selectAll("g.cellTextWrapper");
				var tableArrayLength = KTCE.currentPaper.tableArray.length;
				for(var k=0; k<tableArrayLength; k++){
					if(KTCE.currentPaper.tableArray[k].id == ft.subject.attr("id")){
						var tableObj = KTCE.currentPaper.tableArray[k];
						break;
					}
				}
				
				textWrapperArray.forEach(function(textWrapper, i){
					var textArray = textWrapper.selectAll("text");
					var indexX = textWrapper.attr("data-cellX");
					if(indexX == undefined) indexX = $(textWrapper.node).attr("data-cellX");
					var indexY = textWrapper.attr("data-cellY");
					if(indexY == undefined) indexY = $(textWrapper.node).attr("data-cellY");
					var cellBound = getCellBound(ft.subject.select(".x"+indexX+"_y"+indexY), tableObj)
					var prevH = 0;
					var lineHeight = parseFloat((textWrapper.attr("data-lineheight") != null) ? textWrapper.attr("data-lineheight") : textWrapper.attr("data-lineHeight"));
					lineHeight = lineHeight == null ? 0 : lineHeight;
					var txtAlign = textWrapper.attr('text-align');
					var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
					var cellLeft = parseFloat($(ft.subject.select("rect.xCell.x"+indexX+"_y"+indexY).node).position().left);
					var cellTop = parseFloat($(ft.subject.select("rect.xCell.x"+indexX+"_y"+indexY).node).position().top);
					var svgScale = $(KTCE.currentPaper.s.node).css("scale");
					var textArrayLength = textArray.length;
					textArray.forEach(function(el, j){						
						var _strokeLeftWidth = parseFloat($(ft.subject.select("line.yLine.x"+indexX+"_y"+indexY).node).attr('data-stroke-width'))/2;
						if(browserType.indexOf('msie') != -1){
							switch(txtAlign){
							case "left":
								var _x = ((cellLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
								el.attr({"x": _x, 'data-initx': _x});
								break;
							case "center":
								var selfW = parseFloat(textArray[j].getBBox().width);
								var relativePos = (cellBound.width-selfW)/2;
								if(relativePos < 0) relativePos = 0;
																
								var _fontSize = parseInt($(textArray[j].node).css('font-size'));
								var rightMargin = fnIECellTextItalicMargin(textWrapper.node, _fontSize, 2);
								var _x = ((cellLeft - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos) + rightMargin;
								el.attr({"x": _x, 'data-initx': _x});
								
								break
							case "right":
								var selfW = parseFloat(el.getBBox().width);
								var relativePos = cellBound.width-selfW;
								if(relativePos < 0) relativePos = 0;
								
								var _fontSize = parseInt($(textArray[j].node).css('font-size'));
								var rightMargin = fnIECellTextItalicMargin(textWrapper.node, _fontSize, 1);
								var _x = ((((cellLeft - tableTextDisPos.svgMargin.left) - (tableTextDisPos.ie.x + tableTextDisPos.textMarginLeft)) / svgScale + relativePos) + rightMargin) - _strokeLeftWidth;
								el.attr({"x": _x, 'data-initx': _x});
								
								break;
							default :
								var _x = ((cellLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth; 
								el.attr({"x": _x, 'data-initx': _x});
							}
						}else {
							switch(txtAlign){
							case "left":
								var _x = ((cellLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
								el.attr({"x": _x, 'data-initx': _x});
								
								break;
							case "center":
								var selfW = parseFloat(textArray[j].getBBox().width);
								var relativePos = (cellBound.width-selfW)/2;
								if(relativePos < 0) relativePos = 0;
								
								var _x = (cellLeft - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left)/ svgScale + relativePos;
								el.attr({"x": _x, 'data-initx': _x});
								
								break
							case "right":
								var selfW = parseFloat(el.getBBox().width);
								var relativePos = cellBound.width-selfW;
								if(relativePos < 0) relativePos = 0;
								var _x = (((cellLeft - tableTextDisPos.svgMargin.left) - (tableTextDisPos.chrome.x + tableTextDisPos.textMarginLeft)) / svgScale + relativePos) - _strokeLeftWidth;
								el.attr({"x": _x, 'data-initx': _x});
								
								break;
							default :
								var _x = ((cellLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
								el.attr({"x": _x, 'data-initx': _x});
							}
						}
						
						var textHeight = el.getBBox().height;
				
						if(textHeight==0) {
							for(var h=0; h<textArrayLength; h++){
								var _newTextHeight = textArray[h].getBBox().height;
								if(textArray[h].getBBox().height > 0 ) {
									textHeight = _newTextHeight;
									break;
								}
							}
						}

						prevH += textHeight;
						
						if(browserType.indexOf('msie') != -1){
							var _y = (cellTop - tableTextDisPos.ie.y - tableTextDisPos.svgMargin.top) / svgScale + prevH;
							
							if(j>0){
								_y = _y + (lineHeight*j);
							}
							
							var initY = _y - textHeight;
							el.attr({"y": _y, 'data-inity': initY});
						}else {
							var _y = (cellTop - tableTextDisPos.chrome.y - tableTextDisPos.svgMargin.top) / svgScale + prevH
							
							if(j>0){
								_y = _y + (lineHeight*j);
							}
							
							var initY = _y - textHeight;
							el.attr({"y": _y, 'data-inity': initY});
						}
						
						if(tableObj.id != undefined) {
							var cell = $("#" + tableObj.id + " .xCellHover.x" + indexX + "_y" + indexY + "[data-merge]");
							if(cell.length>0){
								//표 위치이동시 셀병합 셀 정렬유지	
								fnCellTextAlign(KTCE.currentPaper.currentShape, txtAlign, textWrapper, false);
								//return;
							}
						}				
						
						//표내 빈 텍스트구간 실행금지(textWrapperArray[i].select(".textUnderLine")!=null)
						if (textWrapperArray[i].attr("data-text-underline") == "underline" && textWrapperArray[i].select("g.textUnderLine") != null) {
							var _fontSize = parseInt($(textArray[j].node).css('font-size'));
							if(browserType.indexOf('msie') > -1 && $(textWrapperArray[i].node).css('font-style') == 'italic'){	//IE italic
								var underlineMargin = _fontSize * 0.42;
								var _x1 = textArray[j].getBBox().x + underlineMargin;
								var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width - underlineMargin;
							}else if(browserType.indexOf('msie') > -1 && $(textWrapperArray[i].node).css('font-style') != 'italic'){	//IE NOT italic
								var underlineMargin = _fontSize * 0.03;
								var _x1 = textArray[j].getBBox().x + underlineMargin;
								var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width - underlineMargin;
							}else{
								var _x1 = textArray[j].getBBox().x;
								var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width;
							}
							
							var _y = el.getBBox().y + el.getBBox().height;
							if(browserType.indexOf('msie') > -1) {
								if($(textWrapper.node).css('font-family').indexOf('olleh') > -1) { //올레체 경우 밑줄간격 -15 조절
									_y = _y - ((_fontSize/0.75) * 0.145);
								}
							}
														
							var underLine = textWrapperArray[i].select("g.textUnderLine").selectAll("line")[j];
							if(underLine != undefined){
								underLine.attr({"x1": _x1, "x2": _x2, "y1": _y, "y2": _y});
							}
						}
					});
				});
			}
			
			if(textCellEditMode && isAutoNewLine == undefined){
				//textWrapperForTable.select('.text-cursor').children()[0].attr("visibility", "hidden");
				if(textWrapperForTable != null) {
					textWrapperForTable.select('.text-cursor').children()[0].attr("visibility", "hidden");
				}
				clearInterval(tcInterval);
				tcInterval = null;
				textCellEditMode = false;
			}
			
			fnCellTextVerticalAlign('newLine');
			
		}
		
		
		// 테이블 정보값 구하기
		function fnTableInfo(obj) {

			if(obj==undefined) return;
			
			var dataId = obj.attr('data-id');
			var	idx = dataId.substring(6,8);
			
			var tableX = obj.attr('data-table-cols');
			var tableY = obj.attr('data-table-rows');
			var tableY = obj.attr('data-table-rows');
			
			var xLineArray = "";
			var yLineArray = "";
			var cellHeight = "";
			var cellWidth = "";
			var cellArray = "";
			var cellHoverArray = "";
			var cellTextArray = "";
	
			var tableInfoArray = [dataId, idx, tableX, tableY, xLineArray, yLineArray, cellHeight, cellWidth, cellArray, cellHoverArray, cellTextArray];

			return tableInfoArray;
		}
		
		//표 셀 크기 업데이트
		function fnTableCellResize() {
			this.tableObj = null;
			this.cellIdx = null;
			this.cellNum = null;
			this.cell = null;
			this.w = null;
			this.h = null;
			this.cw = null;
			this.ch = null;
			this.th = null;
			this.tw = null;
			this.isNewLine = false;
			this.currentShape = KTCE.currentPaper.currentShape;
			this.maxXIdx = null;
			this.nowXIdx = null;
			this.maxYIdx = null;
			this.nowYIdx = null;
			//this.merge = false;
			this.mode = null;
			this.row = null;
			//this.setYResize = function(tableObj, cellIdx, cell, w, h, ch, th, isNewLine, currentShape, maxYIdx, nowYIdx, merge, row) {
			this.setYResize = function(tableObj, cellIdx, cell, w, h, ch, th, isNewLine, currentShape, maxYIdx, nowYIdx, mode, row) {
				//this.merge = merge;
				this.mode = mode;
				this.tableObj = tableObj;
				this.cellIdx = cellIdx;
				this.cell =  cell;
				this.w = w;
				this.h = h;
				this.ch = ch;
				this.th = th;
				this.isNewLine = isNewLine;
				this.currentShape = currentShape;
				this.maxYIdx = maxYIdx;
				this.nowYIdx = nowYIdx;
				this.row = row;
			};			
			//this.setXResize = function(tableObj, cellNum, cell, w, h, cw, ch, tw, isNewLine, currentShape, maxXIdx, nowXIdx) {
			//this.setXResize = function(tableObj, cellNum, cell, w, h, cw, ch, tw, isNewLine, currentShape, maxXIdx, nowXIdx, merge) {
			this.setXResize = function(tableObj, cellNum, cell, w, h, cw, ch, tw, isNewLine, currentShape, maxXIdx, nowXIdx, mode) {
					//this.merge = merge;
					this.mode = mode;
					this.tableObj = tableObj;
					this.cellNum = cellNum;
					this.cell =  cell;
					this.w = w;
					this.h = h;
					this.cw = cw;
					this.ch = ch;
					this.tw = tw;
					this.isNewLine = isNewLine;
					this.currentShape = currentShape;
					this.maxXIdx = maxXIdx;
					this.nowXIdx = nowXIdx;
			};
			this.updateYResize = function() {
				var currentShape = this.currentShape;
				var tableObj = this.tableObj;
				var tableObjLength = tableObj.length;
				var tableObjLengthX = tableObjLength.x;
				var tableObjLengthX1 = tableObjLength.x+1;
				var tableObjLengthY = tableObjLength.y;
				var tableObjLengthY1 = tableObjLength.y+1;
				var _scaleY = currentShape.freeTransform.attrs.scale.y;
				var resize =  (this.h - this.ch + 10) / _scaleY;
				var idxY = parseInt(this.cell.attr("data-index-y"));
				var idxX = parseInt(this.cell.attr("data-index-x"));
				var rectIdx = idxY * tableObjLengthX;//tableObj.length.x;
				var yLineIdx = idxY * (tableObjLengthX + 1) //(tableObj.length.x + 1); 
				var _tableNumber = parseInt($("#" + tableObj.id).attr('data-id').substring(6,8));	
				var $mode = this.mode;
									
				// for문 적용을 아래 구문으로 간소화
				var _idx = parseInt(rectIdx/tableObjLengthX);
				//선택셀 row구간 rect 적용
				var $cell = $("#" + tableObj.id).find("rect[data-index-y='"+ _idx + "']");
				var _cellHeight = parseFloat($cell.attr("data-init-height")) + resize;
				$cell.attr({"height": _cellHeight,"data-init-height": _cellHeight});
				
				var $hoverCell = $("#" + tableObj.id).find('rect.xCellHover[data-active="active"]');
				var hoverCellIndexY = [];
				$hoverCell.each(function(idx, el){
					var _cellIndexY = parseInt($(this).attr('data-index-y'));
					hoverCellIndexY.push(_cellIndexY)
				})
				hoverCellIndexY.sort();
				var hoverCellMinIdxY = hoverCellIndexY[0] + 1;
				var hoverCellMaxIdxY = hoverCellIndexY[hoverCellIndexY.length-1] + 1;
				var currentYLimit = hoverCellMaxIdxY - hoverCellMinIdxY;
				
				for(var i=(hoverCellMinIdxY-1); i < tableObjLengthY; i++) {
					
					if(i > 0) {
						var $prevCell = $("#" + tableObj.id).find("rect[data-index-y='" + (i-1) + "']");
						var $targetCell = $("#" + tableObj.id).find("rect[data-index-y='" + i + "']");
						var _cellY = parseFloat($prevCell.attr("y")) + parseFloat($prevCell.attr("height"));
						$targetCell.attr({"y": _cellY, "data-init-pos-y": _cellY});
						
						var $targetXLine = $("#" + tableObj.id).find("line.xLine[data-y='" + (i + 1) + "']");
						var _xCellY1 = parseFloat($targetCell.attr("data-init-pos-y"));
						var _xCellY2 = _xCellY1 + parseFloat($targetCell.attr("data-init-height"));
						$targetXLine.attr({"y1": _xCellY2, "data-init-pos-y1": _xCellY2, "y2": _xCellY2, "data-init-pos-y2": _xCellY2});
						
						var $targetYLine = $("#" + tableObj.id).find("line.yLine[data-y='" + i + "']");
						var _yCellY1 = parseFloat($targetCell.attr("data-init-pos-y"));
						var _yCellY2 = _yCellY1 + parseFloat($targetCell.attr("data-init-height"));	//2017-02-24 이전 원본
						//2018-07 ======================
						$targetYLine.attr({"y1": _yCellY1, "data-init-pos-y1": _yCellY1, "y2": _yCellY2, "data-init-pos-y2": _yCellY2});	//2017-02-24 이전 원본
						//Y축(세로)선과 선사이 공간 방지를 위해 0.5값 임의 지정
						//$targetYLine.attr({"y1": _yCellY1 - 0.5, "data-init-pos-y1": _yCellY1, "y2": _yCellY2 + 0.5, "data-init-pos-y2": _yCellY2});
						//end ===========================
					}else{	//제일 첫번째 셀
						var $targetCell = $("#" + tableObj.id).find("rect[data-index-y='" + i + "']");
						var $targetXLine = $("#" + tableObj.id).find("line.xLine[data-y='" + (i + 1) + "']");
						var _xCellY1 = parseFloat($targetCell.attr("data-init-pos-y"));
						var _xCellY2 = _xCellY1 + parseFloat($targetCell.attr("data-init-height"));
						$targetXLine.attr({"y1": _xCellY2, "data-init-pos-y1": _xCellY2, "y2": _xCellY2, "data-init-pos-y2": _xCellY2});
						
						var $targetYLine = $("#" + tableObj.id).find("line.yLine[data-y='" + i + "']");
						var _yCellY1 = parseFloat($targetCell.attr("data-init-pos-y"));
						var _yCellY2 = _yCellY1 + parseFloat($targetCell.attr("data-init-height"));
						//2018-07 ======================
						$targetYLine.attr({"y1": _yCellY1, "data-init-pos-y1": _yCellY1, "y2": _yCellY2, "data-init-pos-y2": _yCellY2});	//2017-02-24 이전 원본
						//Y축(세로)선과 선사이 공간 방지를 위해 0.5값 임의 지정
						//$targetYLine.attr({"y1": _yCellY1, "data-init-pos-y1": _yCellY1, "y2": _yCellY2 + 0.5, "data-init-pos-y2": _yCellY2});
						//end ===========================
					}
					
					var $cellTextWrapper = $("g.xTableTexts_" + tableObj.id + ">g[data-celly='"+ (i + 1) + "']");
					var $cellText = $cellTextWrapper.find('text');
					var $cellTextUnderline = $cellTextWrapper.find('g.textUnderLine>line');

					if(hoverCellMinIdxY != hoverCellMaxIdxY && i<(hoverCellMaxIdxY-1) && $mode === 'input'){
						
					}else{
						$cellText.each(function(idx, el){
							var $text = $(this);
							var _textY = parseFloat($text.attr('y')) + resize * _scaleY;
							$text.attr({"y": _textY, "data-inity": _textY});
						});
						
						$cellTextUnderline.each(function(idx, el){
							var _lineY1 = parseFloat($(this).attr('y1')) + resize * _scaleY;
							var _lineY2 = parseFloat($(this).attr('y2')) + resize * _scaleY;
							$(this).attr({'y1': _lineY1, 'y2': _lineY2});
						});
					}
				}
				
				var ft = KTCE.currentPaper.currentShape.freeTransform;
				
				ft.attrs.center.y = ft.attrs.center.y + resize / 2 ;
				if(ft.attrs.scale.y != 1)
					ft.attrs.translate.y = ft.attrs.translate.y + resize / 2;
				ft.attrs.size.y = ft.attrs.size.y + resize;
				
				ft.updateHandles();
				KTCE.updateData(KTCE.currentPaper.currentShape, ft.attrs);
				//fnUpdateTextPositionInTable( ft, this.isNewLine);
				
				//if(this.maxYIdx === this.nowYIdx && !this.merge) {
				if(this.maxYIdx === this.nowYIdx) {
					var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
					if(browserType.indexOf('msie') != -1){
						var prev = $(KTCE.currentPaper.currentShape.node).position().top - tableTextDisPos.ie.y - tableTextDisPos.svgMargin.top;
					}else{
						var prev = $(KTCE.currentPaper.currentShape.node).position().top - tableTextDisPos.chrome.y - tableTextDisPos.svgMargin.top;
					}
					fnObjMove(currentShape, 40, 0)
					if(browserType.indexOf('msie') != -1){
						var after = $(KTCE.currentPaper.currentShape.node).position().top - tableTextDisPos.ie.y - tableTextDisPos.svgMargin.top;
					}else{
						var after = $(KTCE.currentPaper.currentShape.node).position().top - tableTextDisPos.chrome.y - tableTextDisPos.svgMargin.top;
					}
					if(prev != after){
						fnObjMove(currentShape, 40, prev-after)
					}
				}
				
				var handlerRectY2 = (KTCE.currentPaper.currentShape.getBBox().y + KTCE.currentPaper.currentShape.getBBox().height) - parseFloat($(ft.handles.bbox[0].element.node).attr('height'))/2;
				$(ft.handles.bbox[2].element.node).attr('y', handlerRectY2);
				$(ft.handles.bbox[3].element.node).attr('y', handlerRectY2);
				$(ft.handles.bbox[6].element.node).attr('y', handlerRectY2);
				
			};
			this.updateXResize = function() {
				var currentShape = this.currentShape;
				var _scaleX = KTCE.currentPaper.currentShape.freeTransform.attrs.scale.x;
				var _tableObj = this.tableObj;
				var resize =  (this.w - this.cw + 10) / _scaleX;
				var idxY = parseInt(this.cell.attr("data-index-y"));
				var idxX = parseInt(this.cell.attr("data-index-x"));
				var rectIdx = idxX;
				var xLineIdx = idxX;
				var tableObj = this.tableObj;
				var tableObjLength = tableObj.length;
				var tableObjLengthX = tableObjLength.x;
				var tableObjLengthY = tableObjLength.y;
				var tableObjLengthY1 = tableObjLength.y+1;
				var matrix = KTCE.currentPaper.currentShape.attr('transform').globalMatrix;
				var _idx = parseInt(rectIdx/tableObjLengthX);
				var $hoverCell = $("#" + tableObj.id).find('rect.xCellHover[data-active="active"]');
				
				var hoverCellIndexX = [];
				$hoverCell.each(function(idx, el){
					var _cellIndexX = parseInt($(this).attr('data-index-x'));
					hoverCellIndexX.push(_cellIndexX)
				})
				hoverCellIndexX.sort();
				var hoverCellMinIdxX = hoverCellIndexX[0] + 1;
				var hoverCellMaxIdxX = hoverCellIndexX[hoverCellIndexX.length-1] + 1;
				
				var currentXLimit = hoverCellMaxIdxX - hoverCellMinIdxX;
				var $cell = $("#" + tableObj.id).find("rect[data-index-x='"+ idxX + "']");
				var $xLine = $("#" + tableObj.id).find("line.xLine[data-x='"+ idxX + "']");
				var $yLine = $("#" + tableObj.id).find("line.yLine[data-x='"+ (idxX + 1) + "']");
				var $mode = this.mode;
				
				//선택셀 col구간 rect width 적용
				var _cellWidth = parseFloat($cell.attr("data-init-width")) + resize;
				$cell.attr({"width": _cellWidth, "data-init-width": _cellWidth});
				
				var $targetXLine = $("#" + tableObj.id).find("line.xLine[data-x='" + idxX + "']");
				var _cellX1 = parseFloat($cell.attr("data-init-pos-x"));
				var _cellX2 = _cellX1 + parseFloat($cell.attr("data-init-width"));
				$targetXLine.attr({"x2": _cellX2, "data-init-pos-x2": _cellX2});
				
				var $targetYLine = $("#" + tableObj.id).find("line.yLine[data-x='" + (idxX + 1) + "']");
				var _cellX2 = parseFloat($targetXLine.attr('data-init-pos-x2'));
				$targetYLine.attr({"x1": _cellX2, "data-init-pos-x1": _cellX2, "x2": _cellX2, "data-init-pos-x2": _cellX2});

				//var $cellTextWrapper = $("g.xTableTexts_" + tableObj.id + ">g[data-cellx='"+ idxX + "']");
				var mCellFirstNum = [];
				var cellLeft = parseInt($cell.attr('data-init-pos-x'));
				var cellRight = cellLeft + _cellWidth;
				var cellCenter = parseInt($cell.attr('data-init-pos-x')) + (_cellWidth/2);
				for(var t=0; t<$cell.length; t++){
					var _tableNumber = parseInt($("#" + tableObj.id).attr('data-id').substring(6,8));	
					var textWrapperId = "g#text" + _tableNumber + "_" + idxX + "_" + t + "_" + tableObj.id;
					var hTextG = $("g.xTableTexts_" + tableObj.id + ">" + textWrapperId)[0];
					var cell = $cell[t];
					var cellX = $(cell).attr('data-index-x');
					var cellY = $(cell).attr('data-index-y');
					var mergeCell = $("#" + tableObj.id + ">rect.xCellHover.x" + cellX + "_y" + cellY + "[data-merge]");
					var mergeCellLength = mergeCell.length;
					if(mergeCellLength > 0 && hTextG === undefined) {
						var fristMergeCell = mergeCell.attr('data-merge').split(',')[0];
						var cX = parseInt(fristMergeCell % tableObj.tableX);
						var cY = parseInt(fristMergeCell / tableObj.tableY);
						if(cX < cellX) {
							var prevMergeCell = tableObj.cellTextArray[cY][cX];
							mCellFirstNum.push(fristMergeCell);
						}
					}else{
						
					}
					
					var hText = $(hTextG).find('text');
					var hUnderline = $(hTextG).find('g.textUnderLine>line');
					
					if(hTextG != undefined) {	
						var hTextAlign = $(hTextG).attr('text-align');
						hText.each(function(idx, el){
							var cText = $(el);
							var cUnderline = $(hUnderline[idx]);
							var tX = parseFloat(cText.attr('x'));
							var uX1 = parseFloat(cUnderline.attr('x1'));
							var uX2 = parseFloat(cUnderline.attr('x2'));
						//	var hTextAlign = cText.parent().attr('text-align');
						
							switch(hTextAlign) {
								case 'left':
									break;
								case 'center':
									var hTextX = tX + resize/2;
									cText.attr({"x": hTextX, "data-initx": hTextX});
									
									var cUnderlineX1 = uX1 + resize/2;
									var cUnderlineX2 = uX2 + resize/2;
									cUnderline.attr({'x1': cUnderlineX1, 'x2': cUnderlineX2});
									break;
								case 'right':
									var hTextX = tX + resize;
									cText.attr({"x": hTextX, "data-initx": hTextX});
									
									var cUnderlineX1 = uX1 + resize;
									var cUnderlineX2 = uX2 + resize;
									cUnderline.attr({'x1': cUnderlineX1, 'x2': cUnderlineX2})
									break;
								default :
									break;
							}
						});
					}
				}
				
				var uniquemCellFirstNum = [];
				$.each(mCellFirstNum, function(i, num){
					if($.inArray(num, uniquemCellFirstNum) === -1) {
						uniquemCellFirstNum.push(num);
						
						var cX = parseInt(num % tableObj.tableX);
						var cY = parseInt(num / tableObj.tableY);
						var prevMergeCell = tableObj.cellTextArray[cY][cX];
						var textWrapperId = "g#text" + _tableNumber + "_" + cX + "_" + cY + "_" + tableObj.id;
						var prevhTextG = $("g.xTableTexts_" + tableObj.id + ">" + textWrapperId)[0];
						var prevhText = $(prevhTextG).find('text');
						var prevhUnderline = $(prevhTextG).find('g.textUnderLine>line');
						if(prevhText != undefined) {		
							var prevTextAlign = $(prevhTextG).attr('text-align');
							prevhText.each(function(idx, el){
								var prevText = $(el);
								var prevUnderline = $(prevhUnderline[idx]);
								var prevtX = parseFloat(prevText.attr('x'));
								var prevuX1 = parseFloat(prevUnderline.attr('x1'));
								var prevuX2 = parseFloat(prevUnderline.attr('x2'));
								
								switch(prevTextAlign) {
									case 'left':
										break;
									case 'center':
										var _prevTextX = prevtX + resize/2;
										prevText.attr({"x": _prevTextX, "data-initx": _prevTextX});
										
										var prevhUnderlineX1 = prevuX1 + resize/2;
										var prevhUnderlineX2 = prevuX2 + resize/2;
										prevUnderline.attr({'x1': prevhUnderlineX1, 'x2': prevhUnderlineX2})
										break;
									case 'right':
										var _prevTextX = prevtX + resize;
										prevText.attr({"x": _prevTextX, "data-initx": _prevTextX});
										
										var prevhUnderlineX1 = prevuX1 + resize;
										var prevhUnderlineX2 = prevuX2 + resize;
										prevUnderline.attr({'x1': prevhUnderlineX1, 'x2': prevhUnderlineX2})
										break;
									default :
										break;
								}

							});
						}
						
					}
				})
				
				//for(var i=(wordIdx.indexX + 1); i < tableObj.tableX; i++) {
				for(var i=hoverCellMinIdxX; i < tableObjLengthX; i++) {
					var $prevCell = $("#" + tableObj.id).find("rect[data-index-x='" + (i-1) + "']");					
					var $targetCell = $("#" + tableObj.id).find("rect[data-index-x='" + i + "']");
					var _cellX = parseFloat($prevCell.attr("x")) + parseFloat($prevCell.attr("width"));
					$targetCell.attr({"x": _cellX,"data-init-pos-x": _cellX});
											
					var $targetXLine = $("#" + tableObj.id).find("line.xLine[data-x='" + i + "']");
					
					//var _xLineStrokeWidthHalf = parseFloat($targetXLine.css('stroke-width')) / 2;
					var _xLineStrokeWidth = parseFloat($targetXLine.css('stroke-width'));
					var _xLineStrokeWidthHalf = _xLineStrokeWidth / 2;
					
					var _cellX1 = parseFloat($targetCell.attr("data-init-pos-x"));
					var _cellX2 = _cellX1 + parseFloat($targetCell.attr("data-init-width"));
					//var _cellX1 = parseFloat($targetCell.attr("x"));// + _xLineStrokeWidthHalf/2;
					//var _cellX2 = _cellX1 + parseFloat($targetCell.attr("data-init-width")) - _xLineStrokeWidth;// + _xLineStrokeWidthHalf/2;
					$targetXLine.attr({"x1": _cellX1, "data-init-pos-x1": _cellX1, "x2": _cellX2, "data-init-pos-x2": _cellX2});
					
					
					//원본-20170216 이전버전
					var $targetYLine = $("#" + tableObj.id).find("line.yLine[data-x='" + (i + 1) + "']");
					var _cellX2 = parseFloat($targetXLine.attr('data-init-pos-x2'));
					$targetYLine.attr({"x1": _cellX2, "data-init-pos-x1": _cellX2, "x2": _cellX2, "data-init-pos-x2": _cellX2});
					
					
					var nextCellTextWrapper = $("g.xTableTexts_" + tableObj.id + ">g[data-cellx='"+ i + "']");
					var nextCellText = nextCellTextWrapper.find('text');
					var nextCellTextUnderline = nextCellTextWrapper.find('g.textUnderLine>line');
					
					if(hoverCellMinIdxX != hoverCellMaxIdxX && i<hoverCellMaxIdxX && $mode === 'input'){
						var nextTextAlign = nextCellText.attr('text-align');
						switch(nextTextAlign) {
							case 'left':
								break;
							case 'center':
								var nexttX = parseFloat($text.attr('x'));
								var nextuX1 = parseFloat($(nextCellTextUnderline[idx]).attr('x1'))
								var nextuX2 = parseFloat($(nextCellTextUnderline[idx]).attr('x2'))							
								var _textX = nexttX + resize/2;
								
								var _lineX1 = nextuX1 + resize/2;
								var _lineX2 = nextuX2 + resize/2;

								break;
							case 'right':
								var nexttX = parseFloat($text.attr('x'));
								var nextuX1 = parseFloat($(nextCellTextUnderline[idx]).attr('x1'))
								var nextuX2 = parseFloat($(nextCellTextUnderline[idx]).attr('x2'))							
								var _textX = nexttX + resize;
								
								var _lineX1 = nextuX1 + resize;
								var _lineX2 = nextuX2 + resize;
								break;
							default :
								break;
						}
						nextCellText.attr({"x": _textX, "data-initx": _textX});
						$(nextCellTextUnderline).attr({'x1': _lineX1, 'x2': _lineX2});
					}else{
						
						nextCellText.each(function(idx, el) {
							var $text = $(this);
							var _textX = parseFloat($text.attr('x')) + resize * _scaleX;
							$text.attr({"x": _textX, "data-initx": _textX});
							var _lineX1 = parseFloat($(nextCellTextUnderline[idx]).attr('x1')) + resize * _scaleX;
							var _lineX2 = parseFloat($(nextCellTextUnderline[idx]).attr('x2')) + resize * _scaleX;
							$(nextCellTextUnderline[idx]).attr({'x1': _lineX1, 'x2': _lineX2});
						});		
					}
				}
								
				var ft = KTCE.currentPaper.currentShape.freeTransform;
				
				
				
				if(ft.attrs.scale.x != 1) {
					//////////////////////////////////////////////////////////////////
//TEST: 2018-07: TEST =========================================================================================================================
					ft.attrs.size.x += resize;
					ft.attrs.center.x += resize/2;
					ft.attrs.translate.x += resize/2;
//END: 2018-07: TEST =========================================================================================================================
					//////////////////////////////////////////////////////////////////
					
//START: TEST관련 임시 주석처리  =========================================================================================================================
					/*
					ft.attrs.size.x += resize;
					ft.attrs.center.x += ((this.w - this.cw + 10)/ft.attrs.scale.x) / 2;
					ft.attrs.translate.x += 10;
					*/
//END: TEST관련 임시 주석처리  =========================================================================================================================
					
				}else{
					ft.attrs.size.x += resize;
					ft.attrs.center.x += resize / 2;
				}
				
				
/*
 				//2017-02-16 이전버전
				ft.attrs.center.x = ft.attrs.center.x + resize / 2;				
				//ft.attrs.size.x = ft.attrs.size.x + resize;	
				if(this.mode === 'update-letter-spacing') {				
					if(ft.attrs.ratio != 1)
					ft.attrs.translate.x = ft.attrs.translate.x + resize;
					ft.attrs.size.x = ft.attrs.size.x + resize;
				}else{
					ft.attrs.size.x = ft.attrs.size.x + resize;
				}
*/
				
				ft.updateHandles();
				
				KTCE.updateData(KTCE.currentPaper.currentShape, ft.attrs);
				//fnUpdateTextPositionInTable( ft, this.isNewLine);
				
				//if(this.maxXIdx === this.nowXIdx) {	//원본 2017-01-20이전 
				if(this.maxXIdx === this.nowXIdx && this.mode != 'update-letter-spacing') {
					var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
					if(browserType.indexOf('msie') != -1){
						var prev = $(KTCE.currentPaper.currentShape.node).position().left - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left;
					}else{
						var prev = $(KTCE.currentPaper.currentShape.node).position().left - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left;
					}

					fnObjMove(KTCE.currentPaper.currentShape, 39, 0)
					if(browserType.indexOf('msie') != -1){
						var after = $(KTCE.currentPaper.currentShape.node).position().left - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left;
					}else{
						var after = $(KTCE.currentPaper.currentShape.node).position().left - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left;
					}

					if(prev != after){
						fnObjMove(KTCE.currentPaper.currentShape, 39, prev-after)
					}
				}
				
				var handlerRectY2 = (KTCE.currentPaper.currentShape.getBBox().y + KTCE.currentPaper.currentShape.getBBox().height) - parseFloat($(ft.handles.bbox[0].element.node).attr('height'))/2;
				$(ft.handles.bbox[2].element.node).attr('y', handlerRectY2);
				$(ft.handles.bbox[3].element.node).attr('y', handlerRectY2);
				$(ft.handles.bbox[6].element.node).attr('y', handlerRectY2);
				
			};	
		}
		
		// 테이블 셀 업데이트
		// 전체 Cell Text 업데이트
		function fnCellArrayUpdate(obj) {
			
			//테이블내 텍스트 여백조절
			fnSetTableCellMargin(KTCE.currentPaper);			
			
			var _table = obj
				, xLine = obj.xLineArray
				, yLine = obj.yLineArray
				, cell = obj.cellArray
				, cellHover = obj.cellHoverArray
				, texts = obj.cellTextArray
				, strokeWidth = obj.strokeWidth
			if($("#" + obj.id).attr('data-name') != 'xTable') return;
			var _tableNumber = parseInt($("#" + obj.id).attr('data-id').substring(6,8));			
			cell.forEach(function(el, i) {
				var _x = i % obj.length.x;
				var _y = Math.floor( i / obj.length.x );
				_y *= obj.length.x + 1;
				var indexX = i % obj.length.x;
				var indexY = Math.floor( i / obj.length.x );
				var el2 = cellHover[i]
					, _thisXline = xLine[ i ]
					, _thisYline = yLine[ _y + _x ]
					, startX = parseInt(_thisYline.attr('x1'))
					, startY = parseFloat(_thisXline.attr('y1'))
					, width = parseFloat(yLine[ _y + _x +1 ].attr('x1')) - parseInt(_thisYline.attr('x1'))
					, height = parseFloat(_thisYline.attr('y2')) - parseInt(_thisYline.attr('y1'))
	
				el.attr({
					x : startX
					, y : startY
					, width : width
					, height : height					
				//	, 'data-index-width': startX
				//	, 'data-index-width': width					
				});

				el2.attr({
					x : startX
					, y : startY
					, width : width
					, height : height					
					//, 'data-index-width': startX
					//, 'data-index-width': width					
				});
				
				if(KTCE.currentPaper.s.select("g.xTableTexts_" + _table.id) != null){
					KTCE.currentPaper.s.select("g.xTableTexts_" + _table.id).select('.text-cursor').select("line").attr("visibility", "hidden");
					var ix = el2.attr("data-index-x");
					var iy = el2.attr("data-index-y");					
					var targetTextGroup = KTCE.currentPaper.s.select("g.xTableTexts_" + _table.id).select("#text" + _tableNumber  + "_"+ix+"_"+iy + "_" + _table.id);						
					var cellBound = getCellBound(el2, _table);

					if(targetTextGroup != null){
						var lineHeight = parseFloat((targetTextGroup.attr("data-lineheight") != null) ? targetTextGroup.attr("data-lineheight") : targetTextGroup.attr("data-lineHeight"));
						lineHeight = lineHeight == null ? 0 : lineHeight;
						var prevHeight = 0;						
						var textArray = targetTextGroup.selectAll("text");
						var textArrayLength = textArray.length;
						
						for(var j=0; j<textArrayLength; j++){
							var text = textArray[j];
							var textHeight = text.getBBox().height;
							var txtAlign = targetTextGroup.attr("text-align");
							var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
							var _cellHoverLeft = parseFloat($(el2.node).position().left);
							var _cellHoverTop = parseFloat($(el2.node).position().top);
							var svgScale = $(KTCE.currentPaper.s.node).css("scale");
							
							//표내 텍스트 여백값 구하기
							var tableObj = KTCE.currentPaper.s.select("#" + _table.id);
							var _yLineLeft = tableObj.select("line.yLine.x" + indexX + "_y" + indexY);
							var _strokeLeftWidth = parseFloat($(_yLineLeft.node).attr('data-stroke-width'))/2;
							
							if(txtAlign == null || txtAlign == "left"){
								if(browserType.indexOf('msie') != -1){
									var _x = ((_cellHoverLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
									text.attr({"x": _x, 'data-initx': _x});
								}else{
									var _x= ((_cellHoverLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
									text.attr({"x": _x, 'data-initx': _x});
								}
								
							} else if(txtAlign == 'center'){
								var selfW = parseFloat(textArray[j].getBBox().width);
								var relativePos = (cellBound.width-selfW)/2;
								if(relativePos < 0) relativePos = 0;

								if(browserType.indexOf('msie') != -1){
									var _fontSize = parseInt($(textArray[j].node).css('font-size'));
									var rightMargin = fnIECellTextItalicMargin(targetTextGroup.node, _fontSize, 2);
									var _x = ((_cellHoverLeft - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos) + rightMargin; 
									text.attr({"x": _x, 'data-initx': _x});
								}else{
									var _x = (_cellHoverLeft - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos;
									text.attr({"x": _x, 'data-initx': _x});
								}
							} else if(txtAlign == 'right'){
								var selfW = parseFloat(textArray[j].getBBox().width);
								var relativePos = cellBound.width-selfW;
								if(relativePos < 0) relativePos = 0;

								if(browserType.indexOf('msie') != -1){
									var _fontSize = parseInt($(textArray[j].node).css('font-size'));
									var rightMargin = fnIECellTextItalicMargin(targetTextGroup.node, _fontSize, 1);
									var _x = (((_cellHoverLeft - (tableTextDisPos.ie.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos) + rightMargin) - _strokeLeftWidth; 
									text.attr({"x": _x, 'data-initx': _x});
								}else{
									var _x = ((_cellHoverLeft - (tableTextDisPos.chrome.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos) - _strokeLeftWidth; 
									text.attr({"x": _x, 'data-initx': _x});
								}
							}

							if(browserType.indexOf('msie') != -1){
								var _y = (_cellHoverTop - tableTextDisPos.ie.y - tableTextDisPos.svgMargin.top) / svgScale + textArray[j].getBBox().height + prevHeight;

								if(j>0){
									_y = _y + (lineHeight*j);
								}
								
								var initY = _y - textHeight;
								text.attr({"y": _y, 'data-inity': initY});
							}else{
								var _y = (_cellHoverTop - tableTextDisPos.chrome.y - tableTextDisPos.svgMargin.top) /svgScale + textArray[j].getBBox().height + prevHeight;
								
								if(j>0){
									_y = _y + (lineHeight*j);
								}
								
								var initY = _y - textHeight;
								text.attr({"y": _y, 'data-inity': initY});
							}
														
							var tempHeight = textHeight;//textArray[j].getBBox().height;
							if(textHeight==0) {
								for(var h=0; h<textArrayLength; h++){
									var _newTextHeight = textArray[h].getBBox().height;
									if(textArray[h].getBBox().height > 0 ) {
										textHeight = _newTextHeight;
										break;
									}
								}
							}

							prevHeight += textHeight;
							
							var textUnderlineData = targetTextGroup.attr("data-text-underline");
							var textUnderlineNode = targetTextGroup.select("g.textUnderLine");
							//표내 빈 텍스트구간 실행금지(textWrapperArray[i].select(".textUnderLine")!=null)
							if (textUnderlineData == "underline" && textUnderlineNode != null) {								
								if(targetTextGroup != undefined) {
									var fontStyle = $(targetTextGroup.node).css('font-style');
									var fontSize = parseInt($(textArray[j].node).css('font-size'));
									if(browserType.indexOf('msie') > -1 && fontStyle == 'italic'){	//IE italic
										var underlineMargin = fontSize * 0.42;
										var _x1 = textArray[j].getBBox().x + underlineMargin;
										var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width - underlineMargin;
									}else if(browserType.indexOf('msie') > -1 && fontStyle != 'italic'){	//IE NOT italic
										var underlineMargin = fontSize * 0.03;
										var _x1 = textArray[j].getBBox().x + underlineMargin;
										var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width - underlineMargin;
									}else{
										var _x1 = textArray[j].getBBox().x;
										var _x2 = textArray[j].getBBox().x + textArray[j].getBBox().width;
									}
									var _y = textArray[j].getBBox().y + textArray[j].getBBox().height;
									var underLine = targetTextGroup.select("g.textUnderLine").selectAll("line")[j];
									
									if(underLine != undefined){
										underLine.attr({"x1": _x1, "y1": _y, "x2": _x2, "y2": _y});
									}
									
								}
							}
						}
						
						var positionX = textArray[0].attr('data-initx');
						var positionY = textArray[0].attr('data-inity');
						targetTextGroup.attr({'data-posx': positionX, 'data-posy': positionY});
					}
				}				
			});
		}

		//표 라인조절시 실시간 크기반영(TEXT 비반영)
		function fnCellLineUpdate(obj) {	
			//테이블내 텍스트 여백조절
			fnSetTableCellMargin(KTCE.currentPaper);			
			
			var _table = obj
				, xLine = obj.xLineArray
				, yLine = obj.yLineArray
				, cell = obj.cellArray
				, cellHover = obj.cellHoverArray
				, texts = obj.cellTextArray
				, strokeWidth = obj.strokeWidth
			if($("#" + obj.id).attr('data-name') != 'xTable') return;
			var _tableNumber = parseInt($("#" + obj.id).attr('data-id').substring(6,8));
						
			cell.forEach(function(el, i) {
				var _x = i % obj.length.x;
				var _y = Math.floor( i / obj.length.x );
				_y *= obj.length.x + 1;
				var indexX = i % obj.length.x;
				var indexY = Math.floor( i / obj.length.x );
				var el2 = cellHover[i]
					, _thisXline = xLine[ i ]
					, _thisYline = yLine[ _y + _x ]
					, startX = parseInt(_thisYline.attr('x1'))
					, startY = parseFloat(_thisXline.attr('y1'))
					, width = parseFloat(yLine[ _y + _x +1 ].attr('x1')) - parseInt(_thisYline.attr('x1'))
					, height = parseFloat(_thisYline.attr('y2')) - parseInt(_thisYline.attr('y1'))
					
				el.attr({
					x : startX
					, y : startY
					, width : width
					, height : height		
					, 'data-init-width' : width
					, 'data-init-height' : height
					, 'data-init-pos-x' : startX
					, 'data-init-pos-y' : startY
				});

				el2.attr({
					x : startX
					, y : startY
					, width : width
					, height : height			
					, 'data-init-width' : width
					, 'data-init-height' : height
					, 'data-init-pos-x' : startX
					, 'data-init-pos-y' : startY
				});
			});
		}	
		
		// 선택된 Cell Text만 Update
		function fnCellUpdate(obj) {	
			
			//테이블내 텍스트 여백조절
			fnSetTableCellMargin(KTCE.currentPaper);			
			
			var _table = obj
				, xLine = obj.xLineArray
				, yLine = obj.yLineArray
				, cell = obj.cellArray
				, cellHover = obj.cellHoverArray
				, texts = obj.cellTextArray
				, strokeWidth = obj.strokeWidth
			if($("#" + obj.id).attr('data-name') != 'xTable') return;
			var _tableNumber = parseInt($("#" + obj.id).attr('data-id').substring(6,8));
						
			cell.forEach(function(el, i) {
				
				var _x = i % obj.length.x;
				var _y = Math.floor( i / obj.length.x );
				_y *= obj.length.x + 1;
				var indexX = i % obj.length.x;
				var indexY = Math.floor( i / obj.length.x );

				var el2 = cellHover[i]
					, _thisXline = xLine[ i ]
					, _thisYline = yLine[ _y + _x ]
					, startX = parseInt(_thisYline.attr('x1'))
					, startY = parseFloat(_thisXline.attr('y1'))
					, width = parseFloat(yLine[ _y + _x +1 ].attr('x1')) - parseInt(_thisYline.attr('x1'))
					, height = parseFloat(_thisYline.attr('y2')) - parseInt(_thisYline.attr('y1'))
					
				el.attr({
					x : startX
					, y : startY
					, width : width
					, height : height		
					, 'data-init-width' : width
					, 'data-init-height' : height
					, 'data-init-pos-x' : startX
					, 'data-init-pos-y' : startY
				});

				el2.attr({
					x : startX
					, y : startY
					, width : width
					, height : height
					, 'data-init-width' : width
					, 'data-init-height' : height
					, 'data-init-pos-x' : startX
					, 'data-init-pos-y' : startY
				});
				
				//if cell has text, this text move
				if(KTCE.currentPaper.s.select("g.xTableTexts_" + _table.id) != null){
					KTCE.currentPaper.s.select("g.xTableTexts_" + _table.id).select('.text-cursor').select("line").attr("visibility", "hidden");	
					var ix = el2.attr("data-index-x");
					var iy = el2.attr("data-index-y");
					var targetTextGroup = KTCE.currentPaper.s.select("g.xTableTexts_" + _table.id).select("#text" + _tableNumber + "_"+ix+"_"+iy + "_" + _table.id);										
					var cellBound = getCellBound(el2, _table);
					
					if(targetTextGroup != null){
						var lineHeight = parseFloat((targetTextGroup.attr("data-lineheight") != null) ? targetTextGroup.attr("data-lineheight") : targetTextGroup.attr("data-lineHeight"));
						lineHeight = lineHeight == null ? 0 : lineHeight;
						var prevHeight = 0;
						var targetTextLength = targetTextGroup.selectAll("text").length ;
						for(var j=0; j<targetTextLength; j++){
							var text = targetTextGroup.selectAll("text")[j];
							var textHeight = text.getBBox().height;
							var txtAlign = targetTextGroup.attr("text-align");
							var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
							var _cellHoverLeft = parseFloat($(el2.node).position().left);
							var _cellHoverTop = parseFloat($(el2.node).position().top);
							var svgScale = $(KTCE.currentPaper.s.node).css("scale");

							//표내 텍스트 여백값 구하기
							var tableObj = KTCE.currentPaper.s.select("#" + _table.id);
							var _yLineLeft = tableObj.select("line.yLine.x" + indexX + "_y" + indexY);
	                        var _strokeLeftWidth = parseFloat($(_yLineLeft.node).attr('data-stroke-width'))/2;
	                        
	                        if(txtAlign == null || txtAlign == "left"){
								if(browserType.indexOf('msie') != -1){
									var _x = ((_cellHoverLeft - (tableTextDisPos.ie.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
									text.attr({"x": _x, 'data-initx': _x});
								}else{
									var _x = ((_cellHoverLeft - (tableTextDisPos.chrome.x - tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale) + _strokeLeftWidth;
									text.attr({"x": _x, 'data-initx': _x});
								}
							} else if(txtAlign == 'center'){
								var selfW = parseFloat(text.getBBox().width);
								var relativePos = (cellBound.width-selfW)/2;
								if(relativePos < 0) relativePos = 0;
								if(browserType.indexOf('msie') != -1){
									var _fontSize = parseInt($(text.node).css('font-size'));
									var rightMargin = fnIECellTextItalicMargin(targetTextGroup.node, _fontSize, 2);
									var _x = ((_cellHoverLeft - tableTextDisPos.ie.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos) + rightMargin; 
									text.attr({"x": _x, 'data-initx': _x});
								}else{
									var _x = (_cellHoverLeft - tableTextDisPos.chrome.x - tableTextDisPos.svgMargin.left) / svgScale + relativePos;
									text.attr({"x": _x, 'data-initx': _x});
								}
							} else if(txtAlign == 'right'){
								var selfW = parseFloat(text.getBBox().width);
								var relativePos = cellBound.width-selfW;
								if(relativePos < 0) relativePos = 0;
								if(browserType.indexOf('msie') != -1){
									var _fontSize = parseInt($(text.node).css('font-size'));
									var rightMargin = fnIECellTextItalicMargin(targetTextGroup.node, _fontSize, 1);
									var _x = (((_cellHoverLeft - (tableTextDisPos.ie.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos) + rightMargin) - _strokeLeftWidth; 										
									text.attr({"x": _x, 'data-initx': _x});
								}else{
									var _x = ((_cellHoverLeft - (tableTextDisPos.chrome.x + tableTextDisPos.textMarginLeft) - tableTextDisPos.svgMargin.left) / svgScale + relativePos) - _strokeLeftWidth;
									text.attr({"x": _x, 'data-initx': _x});
								}
							}
							
							if(browserType.indexOf('msie') != -1){
								var _y = (_cellHoverTop - tableTextDisPos.ie.y - tableTextDisPos.svgMargin.top) / svgScale + text.getBBox().height + prevHeight;
								
								if(j>0){
									_y = _y + (lineHeight*j);
								}
								var initY = _y - textHeight;

								text.attr({"y": _y, 'data-inity': initY});
							}else{
								var _y = (_cellHoverTop - tableTextDisPos.chrome.y - tableTextDisPos.svgMargin.top) /svgScale + text.getBBox().height + prevHeight;
								
								if(j>0){
									_y = _y + (lineHeight*j);
								}
								
								var initY = _y - textHeight;

								text.attr({"y": _y, 'data-inity': initY});
							}
							
							//prevHeight += text.getBBox().height;
							prevHeight += textHeight;
							
							var textUnderlineData = targetTextGroup.attr("data-text-underline");
							var textUnderlineNode = targetTextGroup.select("g.textUnderLine");
							//표내 빈 텍스트구간 실행금지(textWrapperArray[i].select(".textUnderLine")!=null)
							if (textUnderlineData == "underline" && textUnderlineNode != null) {								
								if(targetTextGroup != undefined) {
									var fontStyle = $(targetTextGroup.node).css('font-style');
									var fontSize = parseInt($(text.node).css('font-size'));
									
									if(browserType.indexOf('msie') > -1 && fontStyle == 'italic'){	//IE italic
										var underlineMargin = fontSize * 0.42;
										var _x1 = text.getBBox().x + underlineMargin;
										var _x2 = text.getBBox().x + text.getBBox().width - underlineMargin;
									}else if(browserType.indexOf('msie') > -1 && fontStyle != 'italic'){	//IE NOT italic
										var underlineMargin = fontSize * 0.03;
										var _x1 = text.getBBox().x + underlineMargin;
										var _x2 = text.getBBox().x + text.getBBox().width - underlineMargin;
									}else{
										var _x1 = text.getBBox().x;
										var _x2 = text.getBBox().x + text.getBBox().width;
									}
									var _y = text.getBBox().y + text.getBBox().height;
									var underLine = targetTextGroup.select("g.textUnderLine").selectAll("line")[j];
									if(underLine != undefined){
										underLine.attr({"x1": _x1, "y1": _y, "x2": _x2, "y2": _y});
									}
								}
									
							}
						}
						
						var positionX = targetTextGroup.selectAll("text")[0].attr('x');
						var positionY = targetTextGroup.selectAll("text")[0].attr('y') - textHeight;
						targetTextGroup.attr({'data-posx': positionX, 'data-posy': positionY});
					}
				}
			});
	
		}
		
		// 테이블 셀 선택기능
		//var textCellSaveTimer = null;
		function fnTableCellBinding(obj) {
			var cell = obj.cellHoverArray
				, startX = null
				, startY = null
				, cX = null
				, cY = null
				, dragFlag = false
				, thisCellArray = []
				, xLine = obj.xLineArray
				, yLine = obj.YLineArray

				cell.cellMouseDownNumber = null;
				cell.cellMouseMoveNumber = null;
				cell.cellMouseUpNumber = null;
				

			cell.forEach(function(el, i) {
				//el.mouseDownNumber = null;
				el.mousedown(function(e) {
					KTCE.tableCellDragFlag = true;
					startX = parseInt(el.data('x'));
					startY = parseInt(el.data('y'));
					//cell.mouseDownCellNumber[0] = startX;
					//cell.mouseDownCellNumber[1] = startY;
					//el.mouseDownNumber = i;
					cell.cellMouseDownNumber = i;

					//표 셀선택 drag후 글자위에서 mouseup시 cell.mouseup이 먹지않아 드래그 선택모드가 계속되는 것을 강제 중지
					$("g.xTableTexts_" + obj.id + ">*").mouseup(function(e){
						KTCE.tableCellDragFlag = false;
					})
	
					//표내 텍스트입력시 save
					if(textCellEditMode) {
						fnSaveState();
					}
					
				});

				el.mouseup(function(e) {
					KTCE.tableCellDragFlag = false;
					cell.cellMouseUpNumber = i;
				});

				el.mousemove(function(e) {
					cX = parseInt(el.data('x'));
					cY = parseInt(el.data('y'));
					cell.cellMouseMoveNumber = i;
					var _xs = startX
						, _xe = cX
						, _ys = startY
						, _ye = cY

					if ( KTCE.tableCellDragFlag ) {
						if ( startX != null && startY != null && cX != null && cY != null ) {
							//if ( startX != cX || startY != cY ) {
								if ( startX > cX ) {
									_xs = cX;
									_xe = startX;
								}
								if ( startY > cY ) {
									_ys = cY;
									_ye = startY;
								}	
								_cellFill(_xs,_xe,_ys,_ye, '#a2a2da');
							//}
						}
						
						
						if(tcInterval != null || tcInterval != undefined){
							if(el.parent().select('.text-cursor') != null){
								el.parent().select('.text-cursor').children()[0].attr("visibility", "hidden");
								clearInterval(tcInterval);
								tcInterval = null;
							}
							if(textCellEditMode){
								textCellEditMode = false;
							}
						}
	
						
					}
				});

				//테이블 drag선택모드시 해제
				$("#" + KTCE.currentPaper.s.node.id).mouseup(function(e) {
					if(KTCE.tableCellDragFlag) KTCE.tableCellDragFlag = false;
				});	
				
				el.click(function(e) {
					//201804 그룹객체 사용금지
					if(KTCE.currentPaper.currentShape != null) {
						if($(KTCE.currentPaper.currentShape.node).attr('data-name') =='objectGroup') return;
						if($(KTCE.currentPaper.currentShape.node).parent().attr('data-name') =='objectGroup') return;
					}

					cX = parseInt(el.data('x'));
					cY = parseInt(el.data('y'));
					cell.cellMouseDownNumber = i;
					var _xs = startX
						, _xe = cX
						, _ys = startY
						, _ye = cY

					if ( startX != null && startY != null && cX != null && cY != null ) {
						if ( startX > cX ) {
							_xs = cX;
							_xe = startX;
						}
						if ( startY > cY ) {
							_ys = cY;
							_ye = startY;
						}

						_cellFill(cX,cX,cY,cY, '#a2a2da');

						initCellFontStyle(el);
						if(tcInterval != null || tcInterval != undefined){
							if(el.parent().select('.text-cursor') != null){
								el.parent().select('.text-cursor').children()[0].attr("visibility", "hidden");
								clearInterval(tcInterval);
								tcInterval = null;
							}
						}	
					}
					
					//input box font size 직접입력값 조절
					var indexX = el.attr('data-index-x');
					var indexY = el.attr('data-index-y');
					var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));
					var currentTextBox = $("#text" + _tableNumber + "_" + indexX + "_" + indexY + "_" + obj.id + " text.textBox");
					if(currentTextBox.length>0) {
						var _selfSize = parseFloat($("#text" + _tableNumber + "_" + indexX + "_" + indexY + "_" + obj.id + " text.textBox").attr("style").split(":")[1].split("p")[0]);
						$("input.numberSize").val(_selfSize);
					}
					
				});
			});

			function _cellFill(x1,x2,y1,y2, fill_color) {
				var fillColor= (fill_color==null)?'#a2a2da':fill_color;	
	
				fnTableCellFillReset();

				thisCellArray = [];

				var mergeCellActive = function(_merge, _cell) {
					for(var i=0; i<_merge.length; i++) {
						if(parseInt(_merge[i]) == _cell) {
							for(var j=0; j<_merge.length; j++) {
								cell[_merge[j]].attr({
									fill : '#a2a2da'
									//fill : fillColor
									, opacity : 0.4						
									, 'data-active' : 'active'	
								});
								thisCellArray.push(cell[_merge[j]]);	
							}
						}	
					}
				}

				cell.forEach(function(el, k) {
					var thisX = parseInt(el.data('x'))
						, thisY = parseInt(el.data('y'))
					var cellNumber = (thisX+1) * (y1+1) - y2;
					if (thisX >= x1 && thisX <= x2 && thisY >= y1 && thisY <= y2 ) {						
						el.attr({
							fill : fillColor
							, opacity : 0.4						
							, 'data-active' : 'active'
						});
						thisCellArray.push(el);	
					}
				});
				
				thisCellArray.forEach(function(el, i) {

					var _x = parseInt(el.data('x'))
						, _y = parseInt(el.data('y'))
				});

				if(cell.cellMouseDownNumber===null || cell.cellMouseMoveNumber === null) return;

				var _mergeDownCell = cell[cell.cellMouseDownNumber].attr('data-merge');
				var _mergeMoveCell = cell[cell.cellMouseMoveNumber].attr('data-merge');
				
				if(cell.cellMouseUpNumber != null) {
					var _mergeUpCell = cell[cell.cellMouseUpNumber].attr('data-merge');
				}

				if(_mergeDownCell != undefined ) {
					var _tempArray = _mergeDownCell.split(",");
					mergeCellActive(_tempArray, cell.cellMouseDownNumber);

				}
				if(_mergeMoveCell != undefined ) {
					var _tempArray = _mergeMoveCell.split(",");
					mergeCellActive(_tempArray, cell.cellMouseMoveNumber);
				}
				if(KTCE.tableCellDragFlag) {
					cell.forEach(function(element, idx) {
						var _tempMergeCell = cell[idx].attr('data-merge');
						var _tempActiveCell = cell[idx].attr('data-active');
						if(_tempMergeCell != undefined && _tempActiveCell != undefined) {
							var _tempArray = _tempMergeCell.split(",");
							for(var k=0; k<_tempArray.length; k++) {
								cell[_tempArray[k]].attr({
									fill : '#a2a2da'
									//fill : fillColor
									, opacity : 0.4						
									, 'data-active' : 'active'	
								});
								thisCellArray.push(cell[_tempArray[k]]);	
							}

						}
					});

				}
		
					
			}

		}

		// 모든 테이블의 cell 선택 리셋
		function fnTableCellFillReset() {
			KTCE.currentPaper.tableArray.forEach(function(el, i) {
				
				el.cellHoverArray.forEach(function(cel, j) {
					cel.attr({
						fill : '#fff'
						, opacity : 0						
						, 'data-active' : ''
					});
					cel.removeData('borderL').removeData('borderT').removeData('borderR').removeData('borderB')
				});
			});

			if(tcInterval != null || tcInterval != undefined){
				var tableTextArray = KTCE.currentPaper.objOuter.selectAll(".tableTextWrapper");
				for(var i=0; i<tableTextArray.length; i++){
					var cursor = tableTextArray[i].select(".text-cursor").children()[0];
					cursor.attr('visibility', 'hidden');				
				}
				clearInterval(tcInterval);
				tcInterval = null;
			}
		}

		globalYLineApply = undefined;
		globalXLineApply = undefined;

		// 테이블 라인 기능
		function fnTableLineBinding(obj) {	
			var xLine = obj.xLineArray
			, yLine = obj.yLineArray
			, minSize = 1
			, maxSize = 1;
		
			var topTextWrapper, bottomTextWrapper, leftTextWrapper, rightTextWrapper = null;
			var topTextArray, bottomTextArray, leftTextArray, rightTextArray = null;
			var topTextY, bottomTextY, leftTextX, rightTextX = null;
			var tableId, tableTextWrapperId = null;
			var xLineIdx , yLineIdx = null;
			var _mouseDown = {};
				_mouseDown.x, _mouseDown.y, _mouseDown.dx, _mouseDown.dy = null;
				
			var _topTextY = [], _bottomTextY = [], _topTextinitY = [], _bottomTextinitY = [];
			var _leftTextX = [], _rightTextX = [], _leftTextinitX = [], _rightTextinitX = [];
			var _uToplineY1 = [], _uToplineY2 = [], _uBottomlineY1 = [], _uBottomlineY2 = [];
			var _uLeftlineX1 = [], _uLeftlineX2 = [], _uRightlineX1 = [], _uRightlineX2 = [];					
				
			// xLine
			xLine.forEach(function(el, i) {
				if ( i >= obj.length.x && i < xLine.length - obj.length.x ) {							
					el.drag(_xLineDragMove, _xLineDragStart, _xLineDragEnd);							
					el.attr({
						cursor : 'n-resize'
					});
				}
			});
						
			function _xLineDragMove(dx, dy) {	
				
				if(KTCE.currentPaper.currentShape === null) return;
				
				//표 미선택에 따른 라인 드래그 방지
				if(KTCE.currentPaper.currentShape.freeTransform === undefined) return;		
				
                _mouseDown.dx = dx;//matrix.e;
                _mouseDown.dy = dy;//matrix.f;
                //if(_mouseDown.x != _mouseDown.dx || _mouseDown.y != _mouseDown.dy) {
                if(_mouseDown.dy != 0) {
                	topTextWrapper.css({'opacity':0.15})
    				bottomTextWrapper.css({'opacity':0.15})
                }
				
				var cY = parseInt(this.data('firstY'))
					, moveY = cY + dy
					, minY = getMinMaxY(this.data('y')).min
					, maxY = getMinMaxY(this.data('y')).max
					moveY = moveY / KTCE.currentPaper.currentShape.freeTransform.attrs.scale.y
				var diffY = parseInt(this.data("startY1")) + dy / KTCE.currentPaper.currentShape.freeTransform.attrs.scale.y;
				//표라인 드래그 유/무에 따른 저장확인로직
				KTCE.currentPaper.tableArray.lineDragFlag = true;	
				
				var tableX = (KTCE.currentPaper.currentShape.attr('tableX')=== null) ? KTCE.currentPaper.currentShape.attr('tablex') : KTCE.currentPaper.currentShape.attr('tableX');				
				var tableY = (tableX == undefined) ? $(KTCE.currentPaper.currentShape.node).attr('tableY') : tableX;				
				var topLimit = [], bottomLimit = [], topStrokeWidth = [], bottomStrokeWidth = [];
				var scaleY = KTCE.currentPaper.currentShape.freeTransform.attrs.scale.y;
				var _tableNumber = parseInt($("#" + tableId).attr('data-id').substring(6,8));
				
				for(var c=0; c < tableX; c++) {					
					var _tempTopCell = $("#" + tableId + '>rect.xCellHover.x' + c + "_y" + (yLineIdx - 1));
					var _tempTopMergeCell = _tempTopCell.attr('data-merge');
					var _tempBottomCell = $("#" + tableId + '>rect.xCellHover.x' + c + "_y" + yLineIdx);
					var _tempBottomMergeCell = _tempBottomCell.attr('data-merge');										
					var _top = _bottom = tempTopStrokeWidth = tempBottomStrokeWidth = null;

					//병합셀 구간 예외처리
					if(_tempTopMergeCell == undefined) {
						//_top = $(tableTextWrapperId + " #text" + _tableNumber + "_" + c + "_" + (yLineIdx - 1)).attr('data-height');
						//_bottom = $(tableTextWrapperId + " #text" + _tableNumber + "_" + c + "_" + yLineIdx).attr('data-height');						
						_top = $(tableTextWrapperId + " #text" + _tableNumber + "_" + c + "_" + (yLineIdx - 1) + "_" + tableId).attr('data-height');
						_bottom = $(tableTextWrapperId + " #text" + _tableNumber + "_" + c + "_" + yLineIdx + "_" + tableId).attr('data-height');
						tempTopStrokeWidth = parseFloat($("#" + tableId + "  #xLine" + _tableNumber + "_" + (parseInt($(this.node).attr('data-y')) - 1) + "_" + c + "_" + tableId).css('stroke-width'));
						tempBottomStrokeWidth = parseFloat($("#" + tableId + "  #xLine" + _tableNumber + "_" + parseInt($(this.node).attr('data-y')) + "_" + c + "_" + tableId).css('stroke-width'));
						
					}else{
						_top = 1;
						_bottom = 1;
						tempTopStrokeWidth = 1;
						tempBottomStrokeWidth = 1;
					}
					
					topLimit[c] = (_top == undefined) ? 1 : _top/scaleY;
					bottomLimit[c] = (_bottom == undefined) ? 1 : _bottom/scaleY;
					topStrokeWidth[c] =  (tempTopStrokeWidth == undefined) ? 1 : tempTopStrokeWidth;
					bottomStrokeWidth[c] =  (tempBottomStrokeWidth == undefined) ? 1 : tempBottomStrokeWidth;
				}

				var topLimitMax =  Math.max.apply(null, topLimit);
				var bottomLimitMax =  Math.max.apply(null, bottomLimit);
				var topStrokeWidthLimitMax =  Math.max.apply(null, topStrokeWidth);
				var bottomStrokeWidthLimitMax =  Math.max.apply(null, bottomStrokeWidth);
				
				topLimitMax += topStrokeWidthLimitMax;
				bottomLimitMax += bottomStrokeWidthLimitMax;	
								
				if(dy < 0 && topLimitMax > (diffY - minY)) {
					return;
				}else if(dy > 0 && bottomLimitMax > (maxY - diffY)) {
					return;
				}else{
					//_dragFlag = true;
				}

				if ( diffY > minY && diffY < maxY ) {					
					topTextArray.each(function(idx, el){
	                    var $this = $(el);
	                    var topVerticalAlign = $this.parent().attr('vertical-align');
	                    
	                    switch(topVerticalAlign){
	                    case 'top':
	                    	var topMovY = 0;
	                    	break;
	                    case 'middle':
	                    	var topMovY = dy/2;
	                    	break;
	                    case 'bottom':
	                    	var topMovY = dy;
	                    	break;
	                    }
	                    var newTopTextY = _topTextY[idx] + topMovY;
	                    var newTopTextinitY = _topTextinitY[idx] + topMovY;
	                    $this.attr({'y': newTopTextY, 'data-inity': newTopTextinitY});
	                });
					bottomTextArray.each(function(idx, el){
	                    var $this = $(el);
	                    var bottomVerticalAlign = $this.parent().attr('vertical-align');
	                    switch(bottomVerticalAlign){
	                    case 'top':
	                    	var bottomMovY = dy;
	                    	break;
	                    case 'middle':
	                    	var bottomMovY = dy/2;
	                    	break;
	                    case 'bottom':
	                    	var bottomMovY = 0;
	                    	break;
	                    }
	                    var newBottomTextY = _bottomTextY[idx] + bottomMovY;
	                    var newBottomTextinitY = _bottomTextinitY[idx] + bottomMovY;
	                    $this.attr({'y': newBottomTextY, 'data-inity': newBottomTextinitY});
	                    
	                });
					
					topUlineArray.each(function(idx, el){
	                    var $this = $(el);
	                    var topVerticalAlign = $this.parent().parent().attr('vertical-align');
	                    switch(topVerticalAlign){
	                    case 'top':
	                    	var topMovY = 0;
	                    	break;
	                    case 'middle':
	                    	var topMovY = dy/2;
	                    	break;
	                    case 'bottom':
	                    	var topMovY = dy;
	                    	break;
	                    }
	                    var uToplineY1 = _uToplineY1[idx] + topMovY;
	                    var uToplineY2 = _uToplineY2[idx] + topMovY;
	                    $this.attr({'y1': uToplineY1, 'y2': uToplineY2});
	                });

					bottomUlineArray.each(function(idx, el){
	                    var $this = $(el);
	                    var bottomVerticalAlign = $this.parent().parent().attr('vertical-align');
	                    switch(bottomVerticalAlign){
	                    case 'top':
	                    	var topMovY = dy;
	                    	break;
	                    case 'middle':
	                    	var topMovY = dy/2;
	                    	break;
	                    case 'bottom':
	                    	var topMovY = 0;
	                    	break;
	                    }
	                    var uBottomlineY1 = _uBottomlineY1[idx] + topMovY;
	                    var uBottomlineY2 = _uBottomlineY2[idx] + topMovY;
	                    $this.attr({'y1': uBottomlineY1, 'y2': uBottomlineY2});
	                });	
					xLineApply(this.data('y'), dy / KTCE.currentPaper.currentShape.freeTransform.attrs.scale.y);
				}
			}
			
			function _xLineDragStart(dx, dy, e) {
				_mouseDown.x = dx;
                _mouseDown.y = dy;
			
                tableId = this.parent().node.id;
				tableTextWrapperId = "g.xTableTexts_" + tableId;
				xLineIdx = parseInt(this.attr('data-x'));
				yLineIdx = parseInt(this.attr('data-y'));
				topTextWrapper = $(tableTextWrapperId).find('g.cellTextWrapper[data-celly="' + (yLineIdx-1) +'"]');
				bottomTextWrapper = $(tableTextWrapperId).find('g.cellTextWrapper[data-celly="' + yLineIdx +'"]');
                topTextArray = topTextWrapper.find('text');
                bottomTextArray = bottomTextWrapper.find('text');
                topTextY = parseFloat($(topTextArray[0]).attr('y'));
                bottomTextY = parseFloat($(bottomTextArray[0]).attr('y'));
                	
                topUlineArray = topTextWrapper.find('g.textUnderLine>line');
                bottomUlineArray = bottomTextWrapper.find('g.textUnderLine>line');
                
				_topTextY = [], _bottomTextY = [], _topTextinitY = [], _bottomTextinitY = [];
				_uToplineY1 = [], _uToplineY2 = [], _uBottomlineY1 = [], _uBottomlineY2 = [];
				topTextArray.each(function(idx, el){
                    var $this = $(el);
                    _topTextY[idx] =  parseFloat($this.attr('y'));
                    _topTextinitY[idx] = parseFloat($this.attr('data-inity'));
                });
				bottomTextArray.each(function(idx, el){
                    var $this = $(el);
                    _bottomTextY[idx] =  parseFloat($this.attr('y'));
                    _bottomTextinitY[idx] = parseFloat($this.attr('data-inity'));
                });
				topUlineArray.each(function(idx, el){
                    var $this = $(el);
                    _uToplineY1[idx] =  parseFloat($this.attr('y1'));
                    _uToplineY2[idx] =  parseFloat($this.attr('y2'));
                });
				bottomUlineArray.each(function(idx, el){
                    var $this = $(el);
                    _uBottomlineY1[idx] =  parseFloat($this.attr('y1'));
                    _uBottomlineY2[idx] =  parseFloat($this.attr('y2'));
                });                

				var cY = parseInt(this.attr('y2'))

				this.data('firstY', cY);
				xLineInit(parseInt(this.attr("data-y")));
			}
			
			function _xLineDragEnd() {
				if(KTCE.currentPaper.tableArray.lineDragFlag) {
					KTCE.currentPaper.tableArray.lineDragFlag = false;

					topTextWrapper.css({'opacity':1});
					bottomTextWrapper.css({'opacity':1});
					
					fnCellUpdate(obj);
					fnCellTextVerticalAlign('newLine');
										
					fnSaveState();
				}
				
			}	
	
			function xLineInit(x){
				xLine.forEach(function(el, i) {
					//if(텍스트height<el.y2가 크면)
					//if ( el.data('x') == x ) {
						el.data("startY1", el.attr("y1"))
						el.data("startY2", el.attr("y2"))
					//}
				});
	
				for( i = 0; i < yLine.length; i++) {
					yLine[ i ].data("startY1", yLine[ i ].attr("y1"));
					yLine[ i ].data("startY2", yLine[ i ].attr("y2"));
				}
			}
	
			//y:line number,  movY: 사이즈
			function xLineApply(y, movY) {
				
				var _lineNum = null
				xLine.forEach(function(el, i) {
					if ( el.data('y') == y ) {
						var xLineY1 = parseFloat(el.data("startY1")) + movY;
						var xLineY2 = parseFloat(el.data("startY2")) + movY;
						el.attr({
							y1 : xLineY1
							, y2 : xLineY2
							, 'data-init-pos-y1' : xLineY1
							, 'data-init-pos-y2' : xLineY2
						});

						_lineNum = Math.floor(i/obj.length.x);
					}
				});

				var numRows = yLine.length / obj.length.y;
				var aboveRowStartAt = numRows * ( y - 1 );
				var belowRowStartAt = numRows * y;
				var afterRowStartAt = numRows * ( y + 1 );

				for( var i = aboveRowStartAt; i < belowRowStartAt; i++ ) {
					var yLineY2 = parseFloat(yLine[ i ].data("startY2")) + movY;
					yLine[i].attr({
						y2 : yLineY2
						, 'data-init-pos-y2' : yLineY2
					});

				}
				for( i = belowRowStartAt; i < afterRowStartAt; i++ ) {
					var yLineY1 = parseFloat(yLine[ i ].data("startY1")) + movY;
					yLine[i].attr({
						y1 : yLineY1
						, 'data-init-pos-y1' : yLineY1
					});
				}
				
				//2017-02-21 //아래 사용X
				/*
				var topY = topTextY + movY;
            	var bottomY = bottomTextY + movY;
            	topTextArray.attr('y', topY);
            	bottomTextArray.attr('y', bottomY);
            	*/
				
				//표내 배경 및 rect, line 크기 실시간 반영
				fnCellLineUpdate(obj);
				
			}
	
			function getMinMaxY(y) {
				var _iy = null
					, _xy = null;
	
				xLine.forEach(function(el, i) {
					var thisY = parseInt(el.attr("data-y"));
					if ( y == thisY-1 ) {
						_iy = parseInt(el.data("startY2"))
					} else if ( y == thisY+1 ) {
						_xy = parseInt(el.data("startY2"))
					}
				});
	
				return {
					min : _xy + minSize
					, max : _iy - maxSize
				}
			}
	
			// yLine
			yLine.forEach(function(el, i) {
				var indexY = i % ( obj.length.x + 1 );
				if ( indexY != 0 && indexY != obj.length.x ) {					
					el.drag(_yLineDragMove, _yLineDragStart, _yLineDragEnd);					
					el.attr({
						cursor : 'e-resize'
					});
				}
			});
			
			function _yLineDragMove(dx, dy) {
				
				if(KTCE.currentPaper.currentShape === null) return;				
				
				//표 미선택에 따른 라인 드래그 방지
				if(KTCE.currentPaper.currentShape.freeTransform === undefined) return;				
								
				var matrix = KTCE.currentPaper.currentShape.attr('transform').globalMatrix;
                _mouseDown.dx = dx;//matrix.e;
                _mouseDown.dy = dy;//matrix.f;
                //if(_mouseDown.x != _mouseDown.dx || _mouseDown.y != _mouseDown.dy) {
                if(_mouseDown.dx != 0) {
                	leftTextWrapper.css({'opacity':0.15})
    				rightTextWrapper.css({'opacity':0.15})
                }
                				
				var cX = parseInt(this.data('firstX'))
					, moveX = cX + dx
					, minX = getMinMaxX(this.data('x')).min
					, maxX = getMinMaxX(this.data('x')).max
					moveX = moveX / KTCE.currentPaper.currentShape.freeTransform.attrs.scale.x
				var diffX = parseInt(this.data("startX1")) + dx / KTCE.currentPaper.currentShape.freeTransform.attrs.scale.x;

				//표라인 드래그 유/무에 따른 저장확인로직
				KTCE.currentPaper.tableArray.lineDragFlag = true;
				
				var tempTableX = (KTCE.currentPaper.currentShape.attr('tableX')===null) ? KTCE.currentPaper.currentShape.attr('tablex') : KTCE.currentPaper.currentShape.attr('tableX');
				var tableY = (tempTableX == undefined) ? $(KTCE.currentPaper.currentShape.node).attr('tableY') : tempTableX;
				var tableId = $(KTCE.currentPaper.currentShape.node).attr('id');
				var tableTextWrapperId = ".xTableTexts_" + tableId;				
				var leftLimit = [], rightLimit = [], leftStrokeWidth=[], rightStrokeWidth=[];
				var scaleX = KTCE.currentPaper.currentShape.freeTransform.attrs.scale.x;
				var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));

				for(var r=0; r<tableY; r++) {					
					var _left = $(tableTextWrapperId + " #text" + _tableNumber + "_" + (parseInt($(this.node).attr('data-x')) - 1) + "_" + r + "_" + tableId).attr('data-width');
					var _right = $(tableTextWrapperId + " #text" + _tableNumber + "_" + parseInt($(this.node).attr('data-x')) + "_" + r + "_" + tableId).attr('data-width');
					var tempLeftStrokeWidth = parseFloat($("#" + tableId + "  #yLine" + _tableNumber + "_" + (parseInt($(this.node).attr('data-x')) - 1) + "_" + r + "_" + tableId).css('stroke-width'));
					var tempRightStrokeWidth = parseFloat($("#" + tableId + "  #yLine" + _tableNumber + "_" + parseInt($(this.node).attr('data-x')) + "_" + r + "_" + tableId).css('stroke-width'));					

					leftLimit[r] = (_left == undefined) ? 1 : _left/scaleX;
					rightLimit[r] = (_right == undefined) ? 1 : _right/scaleX;
					
					leftStrokeWidth[r] =  (tempLeftStrokeWidth == undefined ) ? 1 : tempLeftStrokeWidth;
					rightStrokeWidth[r] =  (tempRightStrokeWidth == undefined ) ? 1 : tempRightStrokeWidth;
				}
				
				var leftLimitMax =  Math.max.apply(null, leftLimit);
				var rightLimitMax =  Math.max.apply(null, rightLimit);
				var leftStrokeWidthLimitMax =  Math.max.apply(null, leftStrokeWidth);
				var rightStrokeWidthLimitMax =  Math.max.apply(null, rightStrokeWidth);
				
				leftLimitMax += leftStrokeWidthLimitMax;
				rightLimitMax += rightStrokeWidthLimitMax;
				
				//좌측 셀 사이즈 조절 한계점
				if(dx < 0 && leftLimitMax> (diffX - minX)) {
					return;
				}else if(dx > 0 && rightLimitMax > (maxX - diffX)) {
					return;
				}else{
				}

				if ( diffX > minX && diffX < maxX ) {
					
					leftTextArray.each(function(idx, el){
	                    var $this = $(el);
	                    var leftAlign = $this.parent().attr('text-align');
	                    switch(leftAlign){
	                    case 'left':
	                    	var leftMovX = 0;
	                    	break;
	                    case 'center':
	                    	var leftMovX = dx/2;
	                    	break;
	                    case 'right':
	                    	var leftMovX = dx;
	                    	break;
	                    }
	                    var newLeftTextX = _leftTextX[idx] + leftMovX;
	                    var newLeftTextinitX = _leftTextinitX[idx] + leftMovX;
	                    $this.attr({'x': newLeftTextX, 'data-initx': newLeftTextinitX});
	                    
	                });
					rightTextArray.each(function(idx, el){
	                    var $this = $(el);
	                    var rightAlign = $this.parent().attr('text-align');
	                    switch(rightAlign){
	                    case 'left':
	                    	var rightMovX = dx;
	                    	break;
	                    case 'center':
	                    	var rightMovX = dx/2;
	                    	break;
	                    case 'right':
	                    	var rightMovX = 0;
	                    	break;
	                    }
	                    var newRightTextX = _rightTextX[idx] + rightMovX;
	                    var newRightTextinitX = _rightTextinitX[idx] + rightMovX;
	                    $this.attr({'x': newRightTextX, 'data-initx': newRightTextinitX});
	                    
	                });
					
					leftUlineArray.each(function(idx, el){
	                    var $this = $(el);
	                    var leftAlign = $this.parent().parent().attr('text-align');
	                    switch(leftAlign){
	                    case 'left':
	                    	var leftMovX = 0;
	                    	break;
	                    case 'center':
	                    	var leftMovX = dx/2;
	                    	break;
	                    case 'right':
	                    	var leftMovX = dx;
	                    	break;
	                    }
	                    var uLeftlineX1 = _uLeftlineX1[idx] + leftMovX;
	                    var uLeftlineX2 = _uLeftlineX2[idx] + leftMovX;
	                    $this.attr({'x1': uLeftlineX1, 'x2': uLeftlineX2});
	                });

					rightUlineArray.each(function(idx, el){
	                    var $this = $(el);
	                    var rightAlign = $this.parent().parent().attr('text-align');
	                    switch(rightAlign){
	                    case 'left':
	                    	var rightMovX = dx;
	                    	break;
	                    case 'center':
	                    	var rightMovX = dx/2;
	                    	break;
	                    case 'right':
	                    	var rightMovX = 0;
	                    	break;
	                    }
	                    var uRightlineX1 = _uRightlineX1[idx] + rightMovX;
	                    var uRightlineX2 = _uRightlineX2[idx] + rightMovX;
	                    $this.attr({'x1': uRightlineX1, 'x2': uRightlineX2});
	                });
					
					yLineApply(this.data('x'), dx / KTCE.currentPaper.currentShape.freeTransform.attrs.scale.x);
				}
			}
			
			function _yLineDragStart(dx, dy, e) {
	
				fnSetTableCellMargin(KTCE.currentPaper);
				
				_mouseDown.dx = dx;//matrix.e;
                _mouseDown.dy = dy;//matrix.f;
                
                tableId = this.parent().node.id;
				tableTextWrapperId = "g.xTableTexts_" + tableId;
				xLineIdx = parseInt(this.attr('data-x'));
				yLineIdx = parseInt(this.attr('data-y'));
				leftTextWrapper = $(tableTextWrapperId).find('g.cellTextWrapper[data-cellx="' + (xLineIdx-1) +'"]');
				rightTextWrapper = $(tableTextWrapperId).find('g.cellTextWrapper[data-cellx="' + xLineIdx +'"]');
                leftTextArray = leftTextWrapper.find('text');
                rightTextArray = rightTextWrapper.find('text');
                leftTextX = parseFloat($(leftTextArray[0]).attr('x'));
                rightTextX = parseFloat($(rightTextArray[0]).attr('x'));
                	
                leftUlineArray = leftTextWrapper.find('g.textUnderLine>line');
                rightUlineArray = rightTextWrapper.find('g.textUnderLine>line');
                
				_leftTextX = [], _rightTextX = [], _leftTextinitX = [], _rightTextinitX = [];
				_uLeftlineX1 = [], _uLeftlineX2 = [], _uRightlineX1 = [], _uRightlineX2 = [];
				leftTextArray.each(function(idx, el){
                    var $this = $(el);
                    _leftTextX[idx] =  parseFloat($this.attr('x'));
                    _leftTextinitX[idx] = parseFloat($this.attr('data-initx'));
                });
				rightTextArray.each(function(idx, el){
                    var $this = $(el);
                    _rightTextX[idx] =  parseFloat($this.attr('x'));
                    _rightTextinitX[idx] = parseFloat($this.attr('data-initx'));
                });
				leftUlineArray.each(function(idx, el){
                    var $this = $(el);
                    _uLeftlineX1[idx] =  parseFloat($this.attr('x1'));
                    _uLeftlineX2[idx] =  parseFloat($this.attr('x2'));
                });
				rightUlineArray.each(function(idx, el){
                    var $this = $(el);
                    _uRightlineX1[idx] =  parseFloat($this.attr('x1'));
                    _uRightlineX2[idx] =  parseFloat($this.attr('x2'));
                });                
				
				var tableTextDisPos = KTCE.currentPaper.tableArray.tableTextDisPos;
				if(browserType.indexOf('msie') != -1){
					var cX = $(this.node).position().left - tableTextDisPos.ie.x;
				}else{
					var cX = $(this.node).position().left - tableTextDisPos.chrome.x;
				}

				this.data('firstX', cX);
				yLineInit(parseInt(this.attr("data-x")));
			}

			function _yLineDragEnd() {
				if(KTCE.currentPaper.tableArray.lineDragFlag) {
					KTCE.currentPaper.tableArray.lineDragFlag = false;
					
					leftTextWrapper.css({'opacity':1})
					rightTextWrapper.css({'opacity':1})

					fnCellUpdate(obj);
					fnCellTextVerticalAlign('newLine');
					
					fnSaveState();
				}
			}			
	
			function yLineInit(x){
				yLine.forEach(function(el, i) {
					el.data("startX1", el.attr("x1"))
					el.data("startX2", el.attr("x2"))
				});
	
				for( i = 0; i < xLine.length; i++) {
					xLine[ i ].data("startX1", xLine[ i ].attr("x1"));
					xLine[ i ].data("startX2", xLine[ i ].attr("x2"));
				}
			}
	
			function yLineApply(x, movX) {
				yLine.forEach(function(el, i) {
					if ( el.attr("data-x") == x){
						var yLineX1 = parseFloat(el.data("startX1")) + movX;
						var yLineX2 = parseFloat(el.data("startX2")) + movX;
						el.attr({
							x1 : yLineX1
							, x2 : yLineX2							
							, 'data-init-pos-x1': yLineX1
							, 'data-init-pos-x2': yLineX2						
						});
					}
				});

				for( var i = x - 1; i < xLine.length; i += obj.length.x ) {
					if( i < 0 ) {
						continue;
					}
					var xLineX2 = parseFloat(xLine[ i ].data("startX2")) + movX;
					xLine[ i ].attr( {
						x2: xLineX2					
						, 'data-init-pos-x2': xLineX2					
					} )
				}

				for( i = x; i < xLine.length; i+= obj.length.x ) {
					var xLineX1 = parseFloat(xLine[ i ].data("startX1")) + movX;
					xLine[ i ].attr( {
						x1: xLineX1						
						, 'data-init-pos-x1': xLineX1					
					} );
				}
				
				//표내 배경 및 rect, line 크기 실시간 반영
				fnCellLineUpdate(obj);
		
			}
	
			globalYLineApply = yLineApply;
			globalXLineApply = xLineApply;
	
			function getMinMaxX(x) {
				var _ix = null
					, _xx = null;
				yLine.forEach(function(el, i) {
					var thisX = parseInt(el.attr("data-x"));
					if ( x == thisX-1 ) {
						_ix = parseInt(el.data("startX1"))
					} else if ( x == thisX+1 ) {
						_xx = parseInt(el.data("startX1"))
					}
				});
	
				return {
					min : _xx + minSize
					, max : _ix - maxSize
				}
			}
		}

		/******************************************************************************/
		/* Section: SVG 페이퍼
		/******************************************************************************/

		// 페이퍼 생성(일반)
		function fnCreatePaper(obj, size, type, backPageFlag, action) {
						
			loadParseObjectState = 'N';
		
			var paper = {}
				, id = obj.replace('#','')
				, svgText = '<div class="paperFrame">'
							+'<svg id="'
							+ id
							+ '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:space="preserve">'
							+ '<rect id="svgBgWhite" width="100%" height="100%" style="fill:rgb(255, 255, 255)"/>'
							+ '<image id="svgBg" class="bgImg" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" style="display:none" ></image>'
							+'</svg></div>'
			var objSvgText = $(svgText);
			objSvgText.find("#svgBgWhite, #svgBg").on("mousedown",function(e){
				canvasOn= true;
			});
			objSvgText.find("#svgBgWhite, #svgBg").on("click", function(e){
				//e.stopPropagation();
				canvasOn= false;
				if(!clicking && !canvasDrag)
				hideAllHandler();	
			});

			multiSelectdragEvent(objSvgText);

			var svgObj = objSvgText.appendTo($('.paperWrapper'))
			svgObj = svgObj.find('svg');

			var s = Snap(svgObj[0])
				, objOuter = s.g().attr({ class : 'objOuter' })
				, objWrap = objOuter.g().attr({ class : 'objectGroup' })
				, dataWrap = s.g().attr({ class : 'dataGroup' })
				, lockObjWrap = s.g().attr({ class : 'lockObjGroup' })
				, scaleFlag = false
				, shapeArray = []
				, width = getPaperSize(800, type, size).width
				, height = getPaperSize(800, type, size).height

			if(action != undefined && action){
				if(obj == "#paper1"){
					var tempObj = Snap.parse(KTCE.paperInfo.frontContent)
				}else {
					var tempObj = Snap.parse(KTCE.paperInfo.backContent)
				}

				//템플릿 로고 변경에 따른 기 전단지 임시 강제 변경 로직(예전 템플릿로고 강제변경)
				fnTemplate(s, KTCE.paperInfo);
					
				setTimeout(function() {
					$('.dimmLoader').fadeOut(150);
				}, 1000);
			} else {		
				fnTemplate(s, KTCE.paperInfo);
			}
			
			paper.s = s;
			paper.objOuter = objOuter;
			paper.objWrap = objWrap;
			paper.dataWrap = dataWrap;
			paper.lockObjWrap = lockObjWrap;
			paper.scaleFlag = scaleFlag;
			paper.shapeArray = shapeArray;
			paper.currentShape = null;
			paper.selectedShapeArray = [];
			paper.thisSVG = $(obj);
			paper.Parent = $(obj).parent();
			paper.width = width;
			paper.height = height;
			paper.textBox = null;
			paper.imageArray = [];
			paper.tableArray = [];
			paper.currentStateIdx = 0;
			paper.stateArray = '';
			paper.size = size;
			paper.type = type;
			paper.tmptId = KTCE.paperInfo.tmptId;

			// SVG 기본 세팅
			s.attr({
				width : width
				, height : height
				, viewbox : '0 0 ' + width + ' ' + height
			});

			//확대축소 기능복구수정
			$(obj).css({
				marginLeft : -($(obj).width()/2)
			});

			//확대축소 기능복구수정

			KTCE.paperArray.push(paper);
			KTCE.currentPaper = paper;

			if ( backPageFlag != undefined && backPageFlag ) {
				fnBackPageShow();
			} else {
				fnPaperChange();
			}
			if(tempObj != undefined){
				var bgImage = $(tempObj.node).find("#svgBg").attr('xlink:href');
				if(bgImage != '') {
					addBgImageListener(bgImage, KTCE.paperArray.length)
				}
			}
			
			
			// IE11 도형등 크기를 늘렸을 때 스크롤 생기는 거 방지 .BY HS. 
			if(browserType.indexOf('msie') != -1) {
				$('svg:not(:root)').css("overflow", "hidden");
			}	
			
			//PNG변환시 batik lib에서 배경이미지 노출되는 버그 방지
			fnsetBackgroundImageClipPath(svgObj);
			
			setTimeout(function() {
				fnBasicWorkCompleteCallback();
			}, 1);
		}
			
		// 손글씨 페이퍼 생성(최초)
		function fnCreateHandPaperLoop(length, size, type) {
			var i = 1
				, max = parseInt(length);

			fnCreateHandPaper('paper'+i, i, size, type, true)

			if ( max > 1 ) {
				make();
			} else {
				KTCE.currentPaper = KTCE.paperArray[0];
				fnHandPaperChange();

				// 로딩 끝
				setTimeout(function() {
					$('.dimmLoader').fadeOut(150);
				}, 500);

				fnSaveState();

				fnBasicWorkCompleteCallback();
			}

			function make() {

				if ( i < max ) {
					i += 1;
					fnCreateHandPaper('paper'+i, i, size, type)
					make();
				} else {

					// 로딩 끝
					setTimeout(function() {
						$('.dimmLoader').fadeOut(150);
					}, 500);

					$('.paperFrame').hide();
					$('.paperFrame').first().show();

					KTCE.currentPaper = KTCE.paperArray[0];
					fnHandPaperChange();

					fnSaveState();

					fnBasicWorkCompleteCallback();
				}
			}
			//확대축소 기능복구수정
			$("#paper1").css({
				marginLeft : -($("#paper1").width()/2)
			});
			KTCE.progress.footer(100);

		}

		// 페이퍼 생성(손글씨)
		function fnCreateHandPaper(obj, idx, size, type, first, hideFlag) {
			var paper = {}
				, id = obj.replace('#','')
				
			var svgText = '<div class="paperFrame">'
							+'<svg id="'
							+ id
							+ '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:space="preserve">'
							+ '<rect id="svgBgWhite" width="100%" height="100%" style="fill:rgb(255, 255, 255)"/>'
							+ '<image id="svgBg" class="bgImg" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="" preserveAspectRatio="none" x="0" y="0" width="100%" height="100%" style="display:none" ></image>'
							+'</svg></div>'


			var svgObj = $(svgText).appendTo($('.paperWrapper'))

			svgObj = svgObj.find('svg');

			var s = Snap(svgObj[0])
				, objOuter = s.g().attr({ class : 'objOuter' })
				, objWrap = objOuter.g().attr({ class : 'objectGroup' })
				, dataWrap = s.g().attr({ class : 'dataGroup' })
				, lockObjWrap = s.g().attr({ class : 'lockObjGroup' })
				, scaleFlag = false
				, shapeArray = []
				, width = getPaperSize(800, type, size).width
				, height = getPaperSize(800, type, size).height

			paper.s = s;
			paper.objOuter = objOuter;
			paper.objWrap = objWrap;
			paper.dataWrap = dataWrap;
			paper.lockObjWrap = lockObjWrap;
			paper.scaleFlag = scaleFlag;
			paper.shapeArray = shapeArray;
			paper.currentShape = null;
			paper.selectedShapeArray = [];

			paper.thisSVG = $('#'+obj);
			paper.Parent = $('#'+obj).parent();
			
			paper.width = width;
			paper.height = height;
			paper.textBox = null;
			paper.imageArray = [];
			paper.tableArray = [];
			paper.currentStateIdx = 0;
			paper.stateArray = '';
			paper.size = size;
			paper.type = type;

			// SVG 기본 세팅
			s.attr({
				width : width
				, height : height
				, viewbox : '0 0 ' + width + ' ' + height
			});

			$(obj).css({
					marginLeft : -($(obj).width()/2)
				});
			KTCE.paperArray.push(paper);

			// 버튼 추가
			var wrap = $('.pageLengthControl')
				, numWrap = wrap.find('.list')
				, currentPageLength = $('.paperFrame').length

			numWrap.append('<button type="button" class="pageNo">' + currentPageLength + '</button>');

			// 최초 생성 시 첫번째 트리거에 active
			if ( first ) {
				numWrap.find('button').first().addClass('active');
			}

			// + 버튼으로 생성 시에 프레임을 감춤
			if ( hideFlag ) {
				paper.Parent.hide();
			}
			if ( KTCE.paperInfo.content != undefined ) {
				if ( KTCE.paperInfo.content[idx-1] != undefined ) {
					//fnParseObject(KTCE.paperInfo, idx-1);
					var content = KTCE.paperInfo.content[idx-1].content;

					// paper[idx]의 오브젝트 parsing
					var obj = $(content).find('g').filter('.objectGroup').children();

					obj.each(function() {
						var _thisHTML = $('<div></div>').append($(this).clone()).html()
							, _obj = Snap.parse(_thisHTML)
							, svgObj = KTCE.paperArray[idx-1].objWrap.append(_obj);
					});
										
					//text filter추가에 따른 로직추가(없을경우 filter적용된 텍스트가 보일질 않음)
					//filter, gradient parsing
					fnParseEffect($(".paperWrapper .paperFrame:eq(" + (idx-1)+ ")").find('svg'), (idx-1), content);						

					if(content != undefined){
						KTCE.currentPaper = KTCE.paperArray[idx-1];
						var bgImage = $(content).find("#svgBg").attr('xlink:href');
						if(bgImage != '') {
							addBgImageListener(bgImage, idx);
						}
					}
					
					// 앞면 data parse
					var objData = $(content).find('g').filter('.dataGroup').children();

					objData.each(function() {
						var _thisHTML = $('<div></div>').append($(this).clone()).html()
							, _obj = Snap.parse(_thisHTML)
							, svgObj = KTCE.paperArray[idx-1].dataWrap.append(_obj);
					});
					
					// 앞면 lock data parse
					var frontLockObjGroup = $(content).find('g').filter('.lockObjGroup').children();
					frontLockObjGroup.each(function() {
						var _thisHTML = $('<div></div>').append($(this).clone()).html()
							, _obj = Snap.parse(_thisHTML)
							, svgObj = KTCE.paperArray[idx-1].lockObjWrap.append(_obj);
					});
					
					KTCE.paperArray[idx-1].objWrap.children().forEach(function(el, i) {
						el.attr({
							'cursor' : 'default'
						});
						fnSetLoadFreeTransform(KTCE.paperArray[idx-1], el);	
					});
				}
			}
			//KTCE.progress.footer(Number($("#sizeOption").val()));

			//원본
			//KTCE.progress.footer(Number($("#sizeOption").val()));		//chrome에서 비정상적으로 select값을 못 받아옴(특히, 100%)
			var sizeValue = $('#sizeOption > option[selected="selected"]').val();
			KTCE.progress.footer(Number(sizeValue));
			
			// 2016-04-26 IE11 도형등 크기를 늘렸을 때 스크롤 생기는 거 방지 .BY HS. 
			if(browserType.indexOf('msie') != -1) {
				$('svg:not(:root)').css("overflow", "hidden");
			}	
			
			var objSvgText = $(svgObj);
				objSvgText.find("#svgBgWhite, #svgBg").off('mousedown').on("mousedown",function(e){
					canvasOn= true;
				});
				objSvgText.find("#svgBgWhite, #svgBg").off('click').on("click", function(e){
					canvasOn= false;
					if(!clicking && !canvasDrag)
					hideAllHandler();	
				});
				multiSelectdragEvent(objSvgText);
		}
		
		// 손글씨 페이지 번호 컨트롤
		//페이지 위치이동
		function fnHandPaperChange(num) {
			var count = KTCE.paperArray.length;
			// 버튼 추가
				var wrap = $('.pageLengthControl')
					, numWrap = wrap.find('.list')
					, paperFrame = $('.paperFrame');
				
			for(var i = 0 ; i < count ; i++){
				if(i==0){
					numWrap.html('<button type="button" class="pageNo">' + (i+1) + '</button>');
				}else{
					numWrap.append('<button type="button" class="pageNo">' + (i+1) + '</button>');
				}
				if($($(paperFrame)[i]).css('display') == 'block'){
					$($(numWrap.find('button'))[i]).addClass('active');
				}
			}
			
			var wrap = $('.pageLengthControl')
				, numWrap = wrap.find('.list')
				, numTrigger = numWrap.find('button')
				, addPage = wrap.find('.control .add')
				, removePage = wrap.find('.control .remove')
				, currentPageLength = $('.paperFrame').length
				, selectedNo = 0
				, pageChanger = wrap.find('.pageChanger')
				, pageUp = pageChanger.find('.pageUp')
				, pageDown = pageChanger.find('.pageDown')
				
				
			addPage.show();
			removePage.show();
				
			//페이지 위/아래 이동 버튼 show/hide
			if($('.paperWrapper .paperFrame').length > 1) {
				pageChanger.show();
			}else{
				pageChanger.hide();
			}
			//페이지 위로이동
			pageUp.off().on({
				click : function() {
					var viewFront = null;
					changePage(selectedNo, 'pageUp');
				}
			});
			//페이지 아래로 이동
			pageDown.off().on({
				click : function() {
				//	changePage(1, $('.paperFrame').first(), $('.paperFrame').last(), null, viewBack);
					var viewBack = null;
					changePage(selectedNo, 'pageDown');
				}
			});
			//앞/뒤 페이지 이동
			function changePage(activeIdx, actionType) {
				if(activeIdx == 0 && actionType == 'pageUp') {
					alert('첫 페이지는 앞면으로 이동할 수 없습니다!');
					return;
				}else if(activeIdx == ($('.paperWrapper .paperFrame').length - 1) && actionType == 'pageDown') {
					alert('마지막 페이지는 뒷면으로 이동할 수 없습니다!');
					return;
				}
				
				var targetPage = null
					,currentPage = null
					, targetIdx = null
					, currentIdx = null
					, goPageNum = 0;				//활성화 페이지 번호
				
				if( actionType == 'pageUp' ) {
					targetPage = $('.paperFrame:eq(' + (selectedNo-1) + ')');
					currentPage = $('.paperFrame:eq(' + (selectedNo) + ')');
					targetIdx = selectedNo - 1;
					currentIdx = selectedNo;
					//활성화 페이지 번호
					goPageNum = targetIdx;
				}else{
					targetPage = $('.paperFrame:eq(' + (selectedNo) + ')');
					currentPage = $('.paperFrame:eq(' + (selectedNo + 1) + ')');
					targetIdx = selectedNo;
					currentIdx = selectedNo + 1;
					//활성화 페이지 번호
					goPageNum = currentIdx;
				}
				
				targetPage.before(currentPage);
				
				var paperTargetInfo = KTCE.paperArray[targetIdx];
				var paperCurrentInfo = KTCE.paperArray[currentIdx];
				KTCE.paperArray[targetIdx] = paperCurrentInfo;
				KTCE.paperArray[currentIdx] = paperTargetInfo;
				paperTargetInfo = null;
				paperCurrentInfo = null;
				
				var currentPaperId = 'paper' + (targetIdx + 1);
				var currentClippathId = 'clippath_paper' + (targetIdx + 1);
				var currentObjectGroupClippathId = 'objectGroupClippath_paper' + (targetIdx + 1);
				var targetPaperId = 'paper' + (currentIdx + 1);
				var targetClippathId = 'clippath_paper' + (currentIdx + 1);
				var targetObjectGroupClippathId = 'objectGroupClippath_paper' + (currentIdx + 1);
				
				currentPage.find('svg').attr('id', currentPaperId);
				if( currentPage.find('svg>image').attr('clip-path') != undefined ) {
					currentPage.find('svg>image').attr('clip-path', 'url("#' + currentClippathId + '")');
					currentPage.find('svg #' + targetClippathId).attr('id', currentClippathId);
				}
				if( currentPage.find('svg .objectGroup').attr('clip-path') != undefined ) {
					currentPage.find('svg .objectGroup').attr('clip-path', 'url("#' + currentObjectGroupClippathId + '")');
					currentPage.find('svg #' + targetObjectGroupClippathId).attr('id', currentObjectGroupClippathId);
				}
				
				targetPage.find('svg').attr('id', targetPaperId);
				if( targetPage.find('svg>image').attr('clip-path') != undefined ) {
					targetPage.find('svg>image').attr('clip-path', 'url("#' + targetClippathId + '")');
					targetPage.find('svg #' + currentClippathId).attr('id', targetClippathId);
				}
				if( targetPage.find('svg .objectGroup').attr('clip-path') != undefined ) {
					targetPage.find('svg .objectGroup').attr('clip-path', 'url("#' + targetObjectGroupClippathId + '")');
					targetPage.find('svg #' + currentObjectGroupClippathId).attr('id', targetObjectGroupClippathId);
				}
				
				//해당 페이지 활성화 버튼 trigger
				$(".pageLengthControl button.pageNo:eq(" + goPageNum + ")").trigger('click');
				
				hideAllHandler();
			}
			
			if ( currentPageLength == 10 ) {
				addPage.hide();
			} else if ( currentPageLength == 1 ) {
				removePage.hide();
			}
			
			// 페이퍼 개수 array KTCE.paperArray
			numTrigger.each(function(i) {
				var _this = $(this)
				_this.off('click').on({
					click : function() {
						$('.paperFrame').hide();
						$('.paperFrame').eq(i).show();
						selectedNo = i;
						numTrigger.removeClass('active');
						_this.addClass('active');
						KTCE.currentPaper = KTCE.paperArray[i];
					}
				});
			});
			
			if ( num != undefined ) {
				numTrigger.removeClass('active');
				numTrigger.eq(num).addClass('active');
			}
			
			addPage.off('click').on({
				click : function() {
					console.log('페이지 추가');
					if ( currentPageLength < 10 ) {
						fnCreateHandPaper('paper' + (parseInt(currentPageLength) + 1), undefined, KTCE.paperInfo.canvasSize, KTCE.paperInfo.canvasType, false, true);
						fnHandPaperChange();
						fnSaveState();
					} else {
						alert('더 이상 페이지를 생성할 수 없습니다.');
					}
				}
			});
			
			removePage.off('click').on({
				click : function() {
					if ( currentPageLength > 1 ) {
						if ( confirm('정말 삭제하시겠습니까?') ) {
							numTrigger.last().remove();
							KTCE.paperArray.splice(selectedNo, 1);
							$('.paperFrame').eq(selectedNo).remove();

							$('.paperFrame').hide();
							$('.paperFrame').eq(0).show();

							fnHandPaperChange(0);
							fnSaveState();
						}
					} else {
						alert('처음 페이지는 삭제할 수 없습니다.');
					}
				}
			});

		}
		
		// 앞뒷면 페이퍼 컨트롤
		// 페이지 위치이동
		function fnPaperChange() {
			var dWrap = $('.paperControl')
				, addPaperTrigger = dWrap.find('.addPaper')
				, deletePaperTrigger = dWrap.find('.deletePaper')
				, views = dWrap.find('.changer')
				, viewFront = views.find('.front')
				, viewBack = views.find('.back')
				, pageChanger = dWrap.find('.pageChanger')
				, pageUp = pageChanger.find('.pageUp')
				, pageDown = pageChanger.find('.pageDown')
			
			//페이지 위/아래 이동 버튼 show/hide
			if($('.paperWrapper .paperFrame').length > 1) {
				pageChanger.show();
			}else{
				pageChanger.hide();
			}
			//페이지 위로이동
			pageUp.off().on({
				click : function() {
					changePage(0, $('.paperFrame').first(), $('.paperFrame').last(), null, viewFront);
				}
			});
			//페이지 아래로 이동
			pageDown.off().on({
				click : function() {
					changePage(1, $('.paperFrame').first(), $('.paperFrame').last(), null, viewBack);
				}
			});
			//앞/뒤 페이지 이동
			function changePage(activeIdx, frontPage, currentPage, backPage, viewBtn) {
				if((activeIdx == 0 && $('.paperFrame:eq(0)').css('display') === 'block') || (activeIdx == 0 && $('.paperWrapper .paperFrame').length <= 1)) {
					alert('첫 페이지는 앞면으로 이동할 수 없습니다!');
					return;
				}else if((activeIdx == 1 && $('.paperFrame:eq(1)').css('display') === 'block') || (activeIdx == 1 && $('.paperWrapper .paperFrame').length <= 1)) {
					alert('마지막 페이지는 뒷면으로 이동할 수 없습니다!');
					return;
				}
			
				frontPage.before(currentPage);
				
				var paperFrontInfo = KTCE.paperArray[0];
				var paperBackInfo = KTCE.paperArray[1];
				KTCE.paperArray[0] = paperBackInfo;
				KTCE.paperArray[1] = paperFrontInfo;
				paperFrontInfo = null;
				paperBackInfo = null;
				
				currentPage.find('svg').attr('id', 'paper1');
				if( currentPage.find('svg>image').attr('clip-path') != undefined ) {
					currentPage.find('svg>image').attr('clip-path', 'url("#clippath_paper1")');
					currentPage.find('svg #clippath_paper2').attr('id', 'clippath_paper1');
				}
				if( currentPage.find('svg .objectGroup').attr('clip-path') != undefined ) {
					currentPage.find('svg .objectGroup').attr('clip-path', 'url("#objectGroupClippath_paper1")');
					currentPage.find('svg #objectGroupClippath_paper2').attr('id', 'objectGroupClippath_paper1');
				}
				
				frontPage.find('svg').attr('id', 'paper2');
				if( frontPage.find('svg>image').attr('clip-path') != undefined ) {
					frontPage.find('svg>image').attr('clip-path', 'url("#clippath_paper2")');
					frontPage.find('svg #clippath_paper1').attr('id', 'clippath_paper2');
				}
				if( frontPage.find('svg .objectGroup').attr('clip-path') != undefined ) {
					frontPage.find('svg .objectGroup').attr('clip-path', 'url("#objectGroupClippath_paper2")');
					frontPage.find('svg #objectGroupClippath_paper1').attr('id', 'objectGroupClippath_paper2');
				}
				
				//앞/뒤 페이지 활성화 버튼 trigger
				viewBtn.trigger('click');
				
				hideAllHandler();
			}
			
			addPaperTrigger.off().on({
				click : function() {
					fnCreatePaper('#paper2', KTCE.currentPaper.size, KTCE.currentPaper.type);
					$('.paperFrame').first().hide();
					addPaperTrigger.hide();
					deletePaperTrigger.show();
					views.show();
					viewFront.removeClass('active');
					viewBack.addClass('active');
					//원본
					//KTCE.progress.footer(Number($("#sizeOption").val()));		//chrome에서 비정상적으로 select값을 못 받아옴(특히, 100%)
					var sizeValue = $('#sizeOption > option[selected="selected"]').val();
					KTCE.progress.footer(Number(sizeValue));
					
				}
			});
	
			viewFront.off().on({
				click : function() {
					viewBack.removeClass('active');
					$(this).addClass('active');
					$('.paperFrame').first().show();
					$('.paperFrame').last().hide();
	
					KTCE.currentPaper = KTCE.paperArray[0];
					fnSaveState();
					
				}
			});
	
			viewBack.off().on({
				click : function() {
					viewFront.removeClass('active');
					$(this).addClass('active');
					$('.paperFrame').last().show();
					$('.paperFrame').first().hide();
	
					KTCE.currentPaper = KTCE.paperArray[1];
					fnSaveState();
				}
			});
			
			deletePaperTrigger.off().on({
				click : function() {
					if ( viewFront.hasClass('active') ) {
						alert('앞면은 삭제할 수 없습니다.');
					} else {
						if ( confirm('정말 삭제하시겠습니까?') ) {
							$('.paperFrame').last().remove();
							KTCE.currentPaper = KTCE.paperArray[0];
	
							KTCE.paperArray.pop();
	
							$('.paperFrame').first().show();
	
							addPaperTrigger.show();
							deletePaperTrigger.hide();
							views.hide();
						}
					}
				}
			});
		}
		
		// 뒷면 생성 트리거
		function fnBackPageShow() {
			var dWrap = $('.paperControl')
				, addPaperTrigger = dWrap.find('.addPaper')
				, deletePaperTrigger = dWrap.find('.deletePaper')
				, views = dWrap.find('.changer')
				, viewFront = views.find('.front')
				, viewBack = views.find('.back')

			addPaperTrigger.hide();
			deletePaperTrigger.show();
			views.show();

			viewBack.removeClass('active');
			viewFront.addClass('active');

			$('.paperFrame').hide();
			$('.paperFrame').first().show();
		}

		// 템플레이트를 페이퍼에 적용
		//function fnTemplate(obj, tmptId) {
		function fnTemplate(obj, paperInfo) {
			var tmptId = paperInfo.tmptId;
			var canvasSize = paperInfo.canvasSize;
			var canvasType = paperInfo.canvasType;
			
			$.ajax({
				url:'/Fwl/FlyerApi.do',
				type:'post',
				data: {
					pageFlag : 'AF_TMPT_DETAIL'
					, tmptId : tmptId
					, canvasSize : canvasSize
					, canvasType : canvasType					
				},
				success:function(data){
					if ( data.result == 'success' ) {
						var tmpCover = Snap.parse('<g class="cover">' + data.content + '</g>')
							, tempG = obj.g().append(tmpCover)
							, tempObj = tempG.children()[0];

						tempObj.appendTo(obj);
						tempG.remove();

						// 로딩 끝
						setTimeout(function() {
							$('.dimmLoader').fadeOut(150);
							
							//CI/BI영역 편집 BlOCKING 처리
							var objDragFlag = false;
							var getTmptCiBiObjInfo = function(obj) {
								var objInfo = {};
								var margin = {};
								var marginValue = 50;	//cibi위치가 하단/우측이라는 전제조건하에 cibi 하단에 obj배치를 방지를 위해 임의 값 50 추가
								if(obj.getBBox().y + obj.getBBox().height + marginValue >= KTCE.currentPaper.height) {	//하단위치
									margin.y = marginValue;
									margin.top = 0;
									margin.bottom = marginValue;
									objInfo.y1 = obj.getBBox().y;
									objInfo.y2 = obj.getBBox().y + obj.getBBox().height + margin.bottom;	 //cibi위치가 하단/우측이라는 전제조건하에 cibi 하단에 obj배치를 방지를 위해 임의 값 50 추가
								}else if(obj.getBBox().y - marginValue <= 0) {	//상단위치
									margin.y = marginValue;
									margin.top = marginValue;
									margin.bottom = 0;
									objInfo.y1 = obj.getBBox().y - margin.top;	//cibi위치가 하단/우측이라는 전제조건하에 cibi 하단에 obj배치를 방지를 위해 임의 값 50 추가
									objInfo.y2 = obj.getBBox().y + obj.getBBox().height;	
								}else{
									margin.y = 0;
									margin.top = 0;
									margin.bottom = 0;
									objInfo.y1 = obj.getBBox().y;
									objInfo.y2 = obj.getBBox().y + obj.getBBox().height;
								}
								if(obj.getBBox().x + obj.getBBox().width + marginValue > KTCE.currentPaper.width) {	//우측위치
									margin.x = marginValue;
									margin.left = 0;
									margin.right = marginValue;
									objInfo.x1 = obj.getBBox().x;
									objInfo.x2 = obj.getBBox().x + obj.getBBox().width + margin.right;	 //cibi위치가 하단/우측이라는 전제조건하에 cibi 오른쪽에 obj배치를 방지를 위해 임의 값 50 추가
								}else if(obj.getBBox().x - marginValue <= 0) {	//좌측위치
									margin.x = marginValue;
									margin.left = marginValue;
									margin.right = 0;
									objInfo.x1 = obj.getBBox().x - margin.left;	//cibi위치가 하단/우측이라는 전제조건하에 cibi 오른쪽에 obj배치를 방지를 위해 임의 값 50 추가
									objInfo.x2 = obj.getBBox().x + obj.getBBox().width;	 
								}else{
									margin.x = 0;
									margin.left = 0;
									margin.right = 0;
									objInfo.x1 = obj.getBBox().x;
									objInfo.x2 = obj.getBBox().x + obj.getBBox().width;	
								}
								objInfo.margin = margin;
								return objInfo;
							}
							var translateInfo ={}
							KTCE.cibiEditBlock = function(ft, action, tInfo) {
								var obj = ft.subject.node;
								if(obj.id == 'cropRect') return;
								if($(obj).attr('class') != undefined) {
									if($(obj).attr('class').indexOf('xImage') > -1) return;
								}
								//if($(obj).attr('class').indexOf('xTable') > -1) return;
								var cibiObj = $('g.cover').find("g[id^='tmptCIBIGroup']");
								var _id = cibiObj.attr('id');
								var tmptCiBiObj = document.getElementById(_id);
								
								if(ft.subject == null) return;
								if(ft.subject.freeTransform == undefined || ft.subject.freeTransform == null) return;
								if(ft.subject.freeTransform.bbox == undefined || ft.subject.freeTransform.bbox == null) return;
							
								var tmptCiBiObjInfo = getTmptCiBiObjInfo(tmptCiBiObj);
								
								var ftObjInfo = {}
								ftObjInfo.x1 = ft.subject.freeTransform.bbox.node.getBBox().x;
								ftObjInfo.x2 = ft.subject.freeTransform.bbox.node.getBBox().x + ft.subject.freeTransform.bbox.node.getBBox().width;
								ftObjInfo.y1 = ft.subject.freeTransform.bbox.node.getBBox().y;
								ftObjInfo.y2 = ft.subject.freeTransform.bbox.node.getBBox().y + ft.subject.freeTransform.bbox.node.getBBox().height;
								
								if(action=='dragStart') {
									translateInfo.startX = ft.subject.freeTransform.bbox.node.getBBox().x + ft.subject.freeTransform.bbox.node.getBBox().width;
									translateInfo.startY = ft.subject.freeTransform.bbox.node.getBBox().y + ft.subject.freeTransform.bbox.node.getBBox().height;
									
									translateInfo.offsetX = translateInfo.startX - tmptCiBiObj.getBBox().x;
									translateInfo.offsetY = translateInfo.startY - tmptCiBiObj.getBBox().y;
									
									if(ft.subject.freeTransform.bbox.node.getBBox().x + ft.subject.freeTransform.bbox.node.getBBox().width > tmptCiBiObj.getBBox().x
										&& ft.subject.freeTransform.bbox.node.getBBox().x < tmptCiBiObj.getBBox().x + tmptCiBiObj.getBBox().width
										&& ft.subject.freeTransform.bbox.node.getBBox().y + ft.subject.freeTransform.bbox.node.getBBox().height > tmptCiBiObj.getBBox().y
										&& ft.subject.freeTransform.bbox.node.getBBox().y < tmptCiBiObj.getBBox().y + tmptCiBiObj.getBBox().height
										//&& $(obj).attr('class').indexOf('textBoxWrap') > -1
										) {
										
										if(ft.subject.freeTransform.bbox.node.getBBox().x < tmptCiBiObj.getBBox().x && translateInfo.startX > tmptCiBiObj.getBBox().x
											&& tmptCiBiObj.getBBox().x - tmptCiBiObjInfo.margin.x > 0) {
											translateInfo.tx = ft.subject.freeTransform.o.translate.x - translateInfo.offsetX - tmptCiBiObjInfo.margin.right;
										}else if(ft.subject.freeTransform.bbox.node.getBBox().x > tmptCiBiObj.getBBox().x + tmptCiBiObj.getBBox().width) {
											translateInfo.tx = ft.subject.freeTransform.o.translate.x;
										}else{
											translateInfo.tx = tInfo.dx;
										}
										
										if(ft.subject.freeTransform.bbox.node.getBBox().y < tmptCiBiObj.getBBox().y && translateInfo.startY > tmptCiBiObj.getBBox().y) {
											translateInfo.ty = ft.subject.freeTransform.o.translate.y - translateInfo.offsetY - tmptCiBiObjInfo.margin.bottom;
										}else if(ft.subject.freeTransform.bbox.node.getBBox().y > tmptCiBiObj.getBBox().y + tmptCiBiObj.getBBox().height) {
											translateInfo.ty = ft.subject.freeTransform.o.translate.y;
										}else{
											translateInfo.ty = tInfo.dy;
										}
									}else{
										translateInfo.tx = tInfo.dx;
										translateInfo.ty = tInfo.dy;
									}
									
								}else if(action == 'scaleEnd') {
									/*
									if(tInfo.dx == 1) {
										translateInfo.tx = ft.subject.freeTransform.o.translate.x;
									}else{
										translateInfo.tx =  ft.subject.freeTransform.attrs.translate.x - ((ft.subject.freeTransform.bbox.node.getBBox().x + ft.subject.freeTransform.bbox.node.getBBox().width) - tmptCiBiObj.getBBox().x) - 20;
									}
									
									if(tInfo.dy == 1) {
										translateInfo.ty = ft.subject.freeTransform.o.translate.y;
									}else{
										translateInfo.ty =  ft.subject.freeTransform.attrs.translate.y - ((ft.subject.freeTransform.bbox.node.getBBox().y + ft.subject.freeTransform.bbox.node.getBBox().height) - tmptCiBiObj.getBBox().y) - 20;
									}
									//translateInfo.tx =  ft.subject.freeTransform.attrs.translate.x - ((ft.subject.freeTransform.bbox.node.getBBox().x + ft.subject.freeTransform.bbox.node.getBBox().width) - tmptCiBiObj.getBBox().x) - 20;
									//translateInfo.ty =  ft.subject.freeTransform.attrs.translate.y - ((ft.subject.freeTransform.bbox.node.getBBox().y + ft.subject.freeTransform.bbox.node.getBBox().height) - tmptCiBiObj.getBBox().y) - 20;
									*/
									translateInfo.tx = ft.subject.freeTransform.o.translate.x;
									translateInfo.ty = ft.subject.freeTransform.o.translate.y;
									translateInfo.dx = ft.subject.freeTransform.o.scale.x;
									translateInfo.dy = ft.subject.freeTransform.o.scale.y;
								}
								
								//var translateInfo ={}
								// cibi 가로/세로 크기영역에 대한 충돌 체크
								if( tmptCiBiObjInfo.x1 < ftObjInfo.x2 && tmptCiBiObjInfo.x2 > ftObjInfo.x1 && 
									tmptCiBiObjInfo.y1 < ftObjInfo.y2 && tmptCiBiObjInfo.y2 > ftObjInfo.y1 ) {
										objDragFlag = false;
										blockingMsg(translateInfo, action);
								}
							};
							
							$('image#svgBg, rect#svgBgWhite').on({
								mousedown : function(e) {
									var cibiObj = $('g.cover').find("g[id^='tmptCIBIGroup']");
									var _id = cibiObj.attr('id');
									var tmptCiBiObj = document.getElementById(_id);
									var tmptCiBiObjInfo = getTmptCiBiObjInfo(tmptCiBiObj);
									if( tmptCiBiObjInfo.x1 < e.offsetX + 80 && tmptCiBiObjInfo.x2 > e.offsetX && 
										tmptCiBiObjInfo.y1 < e.offsetY + 50 && tmptCiBiObjInfo.y2 > e.offsetY ) {
										if(KTCE.textCreating){
											KTCE.editorBlockFlag = true;
											blockingMsg();
											$('body').removeClass('textCreating');
											KTCE.textCreating = false;
										}
									}
								},
								mousemove : function() {
								},
								mouseup : function() {
									KTCE.editorBlockFlag = false;
									objDragFlag = false;
								}
							})
							$('g.cover').off().on({
								mousedown : function() {
									if(KTCE.textCreating){
										KTCE.editorBlockFlag = true;
										blockingMsg();
									}
								},
								mousemove : function() {
								},
								mouseup : function() {
									KTCE.editorBlockFlag = false;
									objDragFlag = false;
								}
							})

							function blockingMsg(translateInfo, action) {
								if(virtualGroup != undefined) virtualGroup.remove();
								var showMsg = function() {
									var _id = $('g.cover').find("g[id^='tmptCIBIGroup']").attr('id');
									var tmptCiBiObj = document.getElementById(_id);
									KTCE.currentPaper.coverWrap = Snap($("g.cover")[0]);
								    $("text#coverBlockMsg").remove();
								    var displayText= 'CI/BI 영역은 사용할 수 없습니다!!!';
									var blockTextGroup = KTCE.currentPaper.coverWrap.text(-20280, -21000, displayText).attr({'class':'coverBlockMsg', 'id':'coverBlockMsg'});
									$("text.coverBlockMsg").css({'font-size': '24pt', 'font-family': 'KTfontBold', 'fill': '#E71828'});
									setTimeout(function() {
										var blockMsgObj = document.getElementById("coverBlockMsg");
										if(blockMsgObj == null) return;
										var msgBBox = blockMsgObj.getBBox();
										var msgX = KTCE.currentPaper.width/2 - msgBBox.width/2 - 100;
										var msgY = KTCE.currentPaper.height - (tmptCiBiObj.getBBox().height/2 + msgBBox.height/2) - 15;
										blockTextGroup.attr({'x': msgX, 'y': msgY})
										$(blockTextGroup.node).fadeIn(300).fadeOut(2500, function(){
											$(this).remove();
										})
									}, 10);
								}
								if(KTCE.textCreating){
									showMsg();
									$('body').removeClass('textCreating');
									KTCE.textCreating = false;
									return;
								}
								
								if(KTCE.currentPaper.currentShape == null) return;
								if(KTCE.currentPaper.currentShape.freeTransform != null) {
									//var currentObj = KTCE.currentPaper.selectedShapeArray[0];
									var currentObj = KTCE.currentPaper.currentShape;
									var _id = $('g.cover').find("g[id^='tmptCIBIGroup']").attr('id');
									var tmptCiBiObj = document.getElementById(_id);
									
									showMsg();
									
									if(action == 'scaleEnd') {
										var tx = translateInfo.tx;
										var ty = translateInfo.ty;
										var dx = translateInfo.dx;
										var dy = translateInfo.dy;
										
										currentObj.transform([
		               						'R' + currentObj.freeTransform.attrs.rotate
		               						, currentObj.freeTransform.attrs.center.x
		               						, currentObj.freeTransform.attrs.center.y
		               						, 'S' + dx
		               						, dy
		               						, currentObj.freeTransform.attrs.center.x
		               						, currentObj.freeTransform.attrs.center.y
		               						, 'T' + tx
		               						, ty
		               					].join(','));
										
										currentObj.freeTransform.attrs.scale.x	= dx;
										currentObj.freeTransform.attrs.scale.y	= dy;
										currentObj.freeTransform.attrs.translate.x	= tx;
										currentObj.freeTransform.attrs.translate.y	= ty;
										
									}else{
										var tx = translateInfo.tx;
										var ty = translateInfo.ty;
										
										currentObj.transform([
		               						'R' + currentObj.freeTransform.attrs.rotate
		               						, currentObj.freeTransform.attrs.center.x
		               						, currentObj.freeTransform.attrs.center.y
		               						, 'S' + currentObj.freeTransform.attrs.scale.x
		               						, currentObj.freeTransform.attrs.scale.y
		               						, currentObj.freeTransform.attrs.center.x
		               						, currentObj.freeTransform.attrs.center.y
		               						, 'T' + tx
		               						, ty
		               					].join(','));
										
										currentObj.freeTransform.attrs.translate.x	= tx;
										currentObj.freeTransform.attrs.translate.y	= ty;
									}
									
									if($(currentObj.node).attr('class').indexOf('xTable') > -1 || $(currentObj.node).attr('class').indexOf('textBoxWrap') > -1) {
										currentObj.freeTransform.hideHandles();
										currentObj.data('hasHandle', false);
										currentObj.freeTransform.updateHandles();
										currentObj.freeTransform.showHandles();
										currentObj.data('hasHandle', true);
									}else{
										//console.log('도형!!!!!!')
									}
									
									currentObj.freeTransform.updateHandles();
									
									//if($(currentObj.node).attr('data-name') === 'xTable') {	//table만 제어
									if($(currentObj.node).attr('class').indexOf('xTable') > -1) {	//table만 제어
										fnObjMove(KTCE.currentPaper.currentShape, 38, 0);
										fnUpdateTextPositionInTable(currentObj.freeTransform);
									}
								}
							}
							
						}, 500);

						//fnSaveState();

					} else {
						alert('템플레이트를 불러오지 못했습니다. 관리자에게 문의해 주세요.');
					}
				},
				error:function(){
					alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
				}
			});
		}

		// 오브젝트 parse
		function fnParseObject(info, idx) {
			// 일반 전단지
			if ( info.hwYn == 'N') {
				var frontHTML = KTCE.paperInfo.frontContent;
				var backHTML = KTCE.paperInfo.backContent;
				//앞면 오브젝트 parse
				var frontObj = $(frontHTML).find('g').filter('.objectGroup').children();

				KTCE.paperArray[0].objWrap.node.innerHTML = "";
				$("g.objectGroup").empty();
				frontObj.each(function() {
					var _thisHTML = $('<div></div>').append($(this).clone()).html()
						, _obj = Snap.parse(_thisHTML)
						, svgObj = KTCE.paperArray[0].objWrap.append(_obj);

				});
				// 앞면 data parse
				var frontData = $(frontHTML).find('g').filter('.dataGroup').children();

				KTCE.paperArray[0].dataWrap.node.innerHTML = "";
				$("g.dataGroup").empty();
				frontData.each(function() {
					var _thisHTML = $('<div></div>').append($(this).clone()).html()
						, _obj = Snap.parse(_thisHTML)
						, svgObj = KTCE.paperArray[0].dataWrap.append(_obj);
				});
				
				//중복체크 로직
				var frontDataWrapHTMLArray = [];
				KTCE.paperArray[0].objWrap.children().forEach(function(el, idx){
					//크롬에서 기 작성된 fill=ragb(0,0,0,0), stroke=rgba(0,0,0,0) 배경색, 라인색 속성 값을 fill='none', stroke='none'으로 변경처리
					//servlet 이미지저장 라이브러리에서 처리 못함.
					try{
						if(el.attr('fill') == 'rgba(0, 0, 0, 0)' || el.attr('fill') == 'rgba(0,0,0,0)'){
							el.attr('fill', 'none');
						};
						if(el.attr('stroke') == 'rgba(0, 0, 0, 0)' || el.attr('stroke') == 'rgba(0,0,0,0)'){
							el.attr('stroke', 'none');
						};
						if(el.select('rect').attr('fill')=='rgba(0, 0, 0, 0)' || el.select('rect').attr('fill')=='rgba(0,0,0,0)') {
							el.select('rect').attr('fill', 'none');
						}
						if(el.select('rect').attr('stroke')=='rgba(0, 0, 0, 0)' || el.select('rect').attr('stroke')=='rgba(0,0,0,0)') {
							el.select('rect').attr('stroke', 'none');
						}
						el.select('defs').remove();
						el.removeAttr('mask', 'none');
					}catch(err){
					}
					
					//이미지 clippath 중복이름 제거(변경) 로직
					if(el.attr('data-name') == 'xImage') {
						if(el.select('clipPath').attr('id') === 'imgcrop-mask') {
							var _newId = el.select('clipPath').id;
							var tempId= el.node.id;
							document.getElementById(tempId).getElementsByTagName('clipPath').item(0).setAttribute('id', _newId);
							document.getElementById(tempId).getElementsByTagName('image').item(0).setAttribute('clip-path', 'url(#' + _newId + ')');
						}
					}
					
					if(el.attr('id') != null) {
						var _tempDataValue;
						if(el.attr('data-name') =='objectGroup') {
							_tempDataValue = $("#paper1 g.dataGroup>g." + el.attr('id'));
							if( _tempDataValue.length >= 1 ) {
								frontDataWrapHTMLArray.push(_tempDataValue);
							}
							
							$("#" + el.attr('id') + ' .hasData').each(function(idx, _el){
								_tempDataValue = $("#paper1 g.dataGroup>g." + $(_el).attr('id'));
								if( _tempDataValue.length >= 1 ) {
									frontDataWrapHTMLArray.push(_tempDataValue);
								}
							});
						}else{
							_tempDataValue = $("#paper1 g.dataGroup>g." + el.attr('id'));
							if( _tempDataValue.length >= 1 ) {
								frontDataWrapHTMLArray.push(_tempDataValue[0]);
							}
						}
					}
				});
				
				$("#paper1 defs>mask").each(function(idx, el){
					var _tempMaskRectId = $("#paper1 defs>mask:eq(" + idx + ") > rect").attr('id');
					if(_tempMaskRectId != null) {
						var _tempDataValue = $("#paper1 .dataGroup>g." + _tempMaskRectId);
						if( _tempDataValue.length >= 1 ) {
							frontDataWrapHTMLArray.push(_tempDataValue[0]);
						}
					}
				});
				
				//objectGroup내 object data정보중 중첩내용제거 로직
				for( var i=0; i < frontDataWrapHTMLArray.length; i++ ) {
					if(i==0) {
						KTCE.paperArray[0].dataWrap.node.innerHTML = "";
						$("g.dataGroup").empty();
					}
					var _thisHTML = $('<div></div>').append(frontDataWrapHTMLArray[i]).html()
					var _obj = Snap.parse(_thisHTML);
					var  svgObj = KTCE.paperArray[0].dataWrap.append(_obj);
				}
				
				// 앞면 lock data parse
				var frontLockObjGroup = $(frontHTML).find('g').filter('.lockObjGroup').children();
				
				$("g.lockObjGroup").empty();
				frontLockObjGroup.each(function() {
					var _thisHTML = $('<div></div>').append($(this).clone()).html()
						, _obj = Snap.parse(_thisHTML)
						, svgObj = KTCE.paperArray[0].lockObjWrap.append(_obj);
				});
				
				// 뒷면 오브젝트 parse
				if ( backHTML != null ) {
					//앞면 오브젝트 parse
					var backObj = $(backHTML).find('g').filter('.objectGroup').children();
					
					KTCE.paperArray[1].objWrap.node.innerHTML = "";
					backObj.each(function() {
						var _thisHTML = $('<div></div>').append($(this).clone()).html()
							, _obj = Snap.parse(_thisHTML)
							, svgObj = KTCE.paperArray[1].objWrap.append(_obj);
					});
					
					// 뒷면 data parse
					var backData = $(backHTML).find('g').filter('.dataGroup').children();
					
					KTCE.paperArray[1].dataWrap.node.innerHTML = "";
					backData.each(function() {
						var _thisHTML = $('<div></div>').append($(this).clone()).html()
							, _obj = Snap.parse(_thisHTML)
							, svgObj = KTCE.paperArray[1].dataWrap.append(_obj);
					});
					
					//objectGroup내 object data정보중 중첩내용제거 로직
					var backDataWrapHTMLArray = [];
					KTCE.paperArray[1].objWrap.children().forEach(function(el, idx){
						//크롬에서 기 작성된 fill=ragb(0,0,0,0), stroke=rgba(0,0,0,0) 배경색, 라인색 속성 값을 fill='none', stroke='none'으로 변경처리
						//servlet 이미지저장 라이브러리에서 처리 못함.
						try{
							if(el.attr('fill') == 'rgba(0, 0, 0, 0)' || el.attr('fill') == 'rgba(0,0,0,0)'){
								el.attr('fill', 'none');
							};
							if(el.attr('stroke') == 'rgba(0, 0, 0, 0)' || el.attr('stroke') == 'rgba(0,0,0,0)'){
								el.attr('stroke', 'none');
							};
							if(el.select('rect').attr('fill')=='rgba(0, 0, 0, 0)' || el.select('rect').attr('fill')=='rgba(0,0,0,0)') {
								el.select('rect').attr('fill', 'none');
							}
							if(el.select('rect').attr('stroke')=='rgba(0, 0, 0, 0)' || el.select('rect').attr('stroke')=='rgba(0,0,0,0)') {
								el.select('rect').attr('stroke', 'none');
							}
							el.select('defs').remove();
							el.removeAttr('mask', 'none');
						}catch(err){
						}
						
						//이미지 clippath 중복이름 제거(변경) 로직
						if(el.attr('data-name') == 'xImage') {
							if(el.select('clipPath').attr('id') === 'imgcrop-mask') {
								var _newId = el.select('clipPath').id;
								var tempId= el.node.id
								document.getElementById(tempId).getElementsByTagName('clipPath').item(0).setAttribute('id', _newId);
								document.getElementById(tempId).getElementsByTagName('image').item(0).setAttribute('clip-path', 'url(#' + _newId + ')');
							}
						}
						
						if(el.attr('id') != null) {
							var _tempDataValue;
							if(el.attr('data-name') =='objectGroup') {
								_tempDataValue = $("#paper2 g.dataGroup>g." + el.attr('id'));
								if( _tempDataValue.length >= 1 ) {
									backDataWrapHTMLArray.push(_tempDataValue);
								}
								
								$("#" + el.attr('id') + ' .hasData').each(function(idx, _el){
									_tempDataValue = $("#paper2 g.dataGroup>g." + $(_el).attr('id'));
									if( _tempDataValue.length >= 1 ) {
										backDataWrapHTMLArray.push(_tempDataValue);
									}
								});
							}else{
								_tempDataValue = $("#paper2 g.dataGroup>g." + el.attr('id'));
								if( _tempDataValue.length >= 1 ) {
									backDataWrapHTMLArray.push(_tempDataValue[0]);
								}
							}
						}
					});
					
					$("#paper2 defs>mask").each(function(idx, el){
						var _tempMaskRectId = $("#paper2 defs>mask:eq(" + idx + ") > rect").attr('id');
						if(_tempMaskRectId != null) {
							var _tempDataValue = $("#paper2 .dataGroup>g." + _tempMaskRectId);
							if( _tempDataValue.length >= 1 ) {
								backDataWrapHTMLArray.push(_tempDataValue[0]);
							}
						}
					});
					
					//objectGroup내 object data정보중 중첩내용제거 로직
					for( var i=0; i < backDataWrapHTMLArray.length; i++ ) {
						if(i==0) KTCE.paperArray[1].dataWrap.node.innerHTML = "";
						var _thisHTML = $('<div></div>').append(backDataWrapHTMLArray[i]).html()
						var _obj = Snap.parse(_thisHTML)
						, svgObj = KTCE.paperArray[1].dataWrap.append(_obj);
					}
					
					// 뒷면 lock data parse
					var backLockObjGroup = $(backHTML).find('g').filter('.lockObjGroup').children();
					
					backLockObjGroup.each(function() {
						var _thisHTML = $('<div></div>').append($(this).clone()).html()
							, _obj = Snap.parse(_thisHTML)
							, svgObj = KTCE.paperArray[1].lockObjWrap.append(_obj);
						//class값으로 해당 객체의 핸들러 옵션 및 cursor 맞추세용~~~
					});
				}
				$('.paperFrame').first().show();
				if(KTCE.paperArray[1] != undefined)	$('.paperFrame').last().hide();
				KTCE.paperArray[0].objWrap.children().forEach(function(el, i) {
					KTCE.currentPaper = KTCE.paperArray[0];
					switch(el.attr('class')) {
						case 'textBox' :
							fnSetFreeTransformTextbox(el);
							break;
						case 'xTable hasData' :
							//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
							fnInitializeTableStrokeWidth(el);
							break;
						default:
							if(!(el.attr('class').indexOf("tableTextWrapper") > -1))
								fnSetFreeTransform(el);
					}
				});
				
				if(KTCE.paperArray[1] != undefined){
					$('.paperFrame').first().hide();
					$('.paperFrame').last().show();
					KTCE.paperArray[1].objWrap.children().forEach(function(el, i) {
						KTCE.currentPaper = KTCE.paperArray[1];
						switch(el.attr('class')) {
							case 'textBox' :
								fnSetFreeTransformTextbox(el);
								break;
							case 'xTable hasData' :
								//IE line 두께에 따른 handler틀어지는 현상 해소를 위해 1픽셀 조절후 원복크기로 조절
								fnInitializeTableStrokeWidth(el);
								break;
							default:
								if(!(el.attr('class').indexOf("tableTextWrapper") > -1))
									fnSetFreeTransform(el);
						}
					});
				}
				
				//text filter추가에 따른 로직추가(없을경우 filter적용된 텍스트가 보일질 않음)
				//filter, gradient parsing
				for(var i=0; i< KTCE.paperArray.length; i++) {
					if(i==0){
						fnParseEffect($(".paperWrapper .paperFrame:eq(" + i + ")").find('svg'), i, frontHTML);
					}else if(i==1){
						fnParseEffect($(".paperWrapper .paperFrame:eq(" + i + ")").find('svg'), i, backHTML);
					}
				}
				
				KTCE.currentPaper = KTCE.paperArray[0];
				$('.paperFrame').first().show();
				if(KTCE.paperArray[1] != undefined)	$('.paperFrame').last().hide();

			// 손글씨
			} else if ( info.hwYn == 'Y' ) {
			}

			setTimeout(function(){
				fnSaveState("load");
			}, 1000);
		}
		
		// 기본 문서정보, 오브젝트가 화면에 바인딩 완료되었는지 확인--> 이후 .dataGroup 의 data 이벤트 바인딩
		var loadParseObjectState = 'N';		
		// 기본작업이 끝남. callback function
		function fnBasicWorkCompleteCallback() {
			//console.log('Basic Work End');			
			loadParseObjectState = 'Y';	
			// 페이퍼에 마우스 이벤트 바인딩
			fnPaperMouseEventBind();
			
			fnSetTableCellMargin(KTCE.currentPaper);
			
			//사용 브라아저 확인			
			fnSetUserAgent();
			
		}

		/******************************************************************************/
		/* Section: 저장 및 로드
		/******************************************************************************/

		// 임시저장
		function fnTempSave() {
			var i = 0

			KTCE.tempFile.uriArray = [];
			KTCE.tempFile.svgArray = [];
			KTCE.tempFile.myImageArray = [];

			trigger.tempSave.on({
				click : function() {
					KTCE.goNext = false;
					//handler이미지 캡쳐 방지를 위해 활성화 된 모든 handler 해제
					hideAllHandler(KTCE.currentPaper);	
					
					$('.dimmLayer').fadeIn(150);
					layer.tempSave.fadeIn(200);
					
					//운영자가 저장시 저장카테고리 지정권한 부여
					var dstinCd = KTCE.paperInfo.flyerDstinCd;

					if(dstinCd === undefined) {
						dstinCd = 0;
					}else{
						switch(dstinCd) {
						case "01":
							dstinCd = 0;
							break;
						case "02":
							dstinCd = 2;
							break;
						case "03":
							dstinCd = 1;
							break;
						default :
							dstinCd = 0;
							break;
						}
					}
					
					$("#flyerDstinCd > option:eq(" + dstinCd + ")").attr("selected", "selected");
					
					return false;
				}
			});

			layer.tempSave.find('.closer').on({
				click : function() {
					$('.dimmLayer').fadeOut(200);
					$('.temporarySave').fadeOut(150);
					//접점코드 입력창
					layer.tempSave.find('#cntpntCd').css('border', '1px solid #333');
				}
			});

			layer.tempSave.find('#goTempSave').on({
				click : function() {
					$(".action_loader").show();
					KTCE.paperInfo.flyerTypeCode = $('#flyerTypeCode').find('option:selected').val();
					KTCE.paperInfo.flyerName = layer.tempSave.find('#flyerName').val();

					printPaperInfo();

					fnNameValidate('#flyerName', function(result) {
						if ( result ) {
							//접점코드 입력정보 창
							KTCE.paperInfo.cntpntCd = layer.tempSave.find('#cntpntCd').val();
							if(KTCE.paperInfo.cntpntCd != undefined ) {
								if(KTCE.paperInfo.cntpntCd == '') {
									alert('매장 접점코드를 입력해 주세요!');
									$(".action_loader").hide();
									layer.tempSave.find('#cntpntCd').css('border', '1px solid #e71828');
									layer.tempSave.find('#cntpntCd').keydown(function() {
										layer.tempSave.find('#cntpntCd').css('border', '1px solid #333');
									})
									
									//ie 초기 input foucs 유지
									$("#cntpntCd").val('').focus();
									if(browserType.indexOf('msie') > -1){	//IE
										setCaretPosition('cntpntCd', 0);
									}
									
									return;
								}
							}
							
							//selected item unactivity
							for(var idx=0; idx<KTCE.paperArray.length; idx++){
								KTCE.paperArray[idx].objWrap.children().forEach(function(a, k) {
									
									// 임시저장시 핸들러 삭제 방지수정 									
									$(".cover ~ *").hide();
									return;
									
									if ( a.hasClass('textBoxWrap') ) {
										a.data('hasHandle', false);
										if(a.freeTransform != undefined){
											a.freeTransform.visibleNoneHandles();
											a.freeTransform.hideHandles();
										}
										if(tcInterval != null || tcInterval != undefined){
											clearInterval(tcInterval);
											tcInterval = null;
										}
										a.select('.text-cursor').children()[0].attr("visibility", 'hidden');
									} else {
										a.data('hasHandle', false);
										if(a.freeTransform != undefined){
											a.freeTransform.visibleNoneHandles();
											a.freeTransform.hideHandles();
										}
										
										if(cropHandler[cropHandleIdx] != undefined) {
											cropHandler[cropHandleIdx].hideHandles();
										}
									}
								});
							}
							//fnTableCellFillReset();
							

							if ( $('.guideLine').hasClass('on') ) {
								
								$(".paperFrame svg").css({"background":""});
								
								// 저장시 눈금자해제 이벤트
								/*
								//2020-04
								$(".paperFrame svg #svgBg").each(function(idx, el){
									if($(el).attr("xlink:href") !=""){
										$(el).show();
									}else{
										$(el).hide();
									}
								});
								*/
								
								// 2020-05: 눈금자 해제시 배경 이미지 원복처리 및 유효성 검증
								setPaperSVGBackGroundDisplay();
								
								$(".paperFrame svg #svgBgWhite").css('opacity', 1);
								
								$('.col7 .guideLine').removeClass('on');
								
							}
							
							KTCE.tempFile.uriArray = [];
							KTCE.tempFile.svgArray = [];
							KTCE.currentPaper.currentShape = null;
							savingTempData();
						} else {
							alert('제목은 최소 한글 2자 이상 최대 40자 이하로 입력해 주세요.');
							$(".action_loader").hide();
							//ie 초기 input foucs 유지
							$("#flyerName").val('').focus();
							if(browserType.indexOf('msie') > -1){	//IE
								setCaretPosition('flyerName', 0);
							}
						}
					});
				}
			});

			function savingTempData(){
				KTCE.tempFile.uriArray = [];
				KTCE.tempFile.svgArray = [];
				KTCE.tempFile.svgArrayForPng = [];
				KTCE.tempFile.myImageArray = [];	
				for(var j=0; j<KTCE.paperArray.length; j++){
					KTCE.tempFile.uriArray.push(null);
					KTCE.tempFile.svgArray.push(null);
					KTCE.tempFile.svgArrayForPng.push(null);
					KTCE.tempFile.myImageArray.push(null);
						
					if(browserType.indexOf('msie') == -1){
						// colne temporay svg for make image with mulity space
						var temp = Snap(KTCE.paperArray[j].s.node.cloneNode(true));
						var tempSvg = $('<div style="opacity:0;"></div>').append($(temp.node)).appendTo('body');
						var textArray = temp.select(".objOuter").selectAll(".textBoxWrap");
						for(var i=0; i < textArray.length; i++){
							var tLine = textArray[i].select('.textLine');
							var subStringArray = tLine.selectAll('text');
							for(var k =0; k< subStringArray.length; k++){
								var x = parseFloat(subStringArray[k].getBBox().x);
								var y = parseFloat(subStringArray[k].attr("y"));
								$("#temp_textarea")[0].removeEventListener('input', id_textarea_inputEvent, false);
								$("#temp_textarea").val($(subStringArray[k].node).text());
								var str = $("#temp_textarea").val();
								var space = 0;
								var spaceArray = [];
								for(var l=0; l<str.length; l++){
									if(str[l] == " ") space++;
									if(str[l] != " " && space > 1){
									   spaceArray.push(l);
									   space = 0;
									} 
								}
								spaceArray.push(str.length)
								var start = 0;
								var next = 0;
								var textSytle = subStringArray[k].attr("style");
								for(var l=0; l<spaceArray.length; l++){
									var splitString = str.substring(start, spaceArray[l]);
									var tempText = textArray[i].select(".textLine").text(x, y, splitString).attr('class','textBox basic').attr("style", textSytle);
									x = x + parseFloat(tempText.getBBox().width);
									start = spaceArray[l];
								}
							}

							for(var k =0; k< subStringArray.length; k++){
								subStringArray[k].remove();
							}
						}
						makeUriArray(KTCE.paperArray[j], j, j+1 == KTCE.paperArray.length ? 'last' : '', temp, tempSvg);
					} else {
						makeSvgArray(KTCE.paperArray[j], j, j+1 == KTCE.paperArray.length ? 'last' : '');	
					}
				}
			}

			function makeUriArray(p, j, n, temp, tempSvg){	
					
				$(temp.node).transit({scale:1, x : -(1/100) + '%'});
				convertToBase64EncodeImage(p, j, n, temp, tempSvg);
			}


			function convertToBase64EncodeImage(p, j, n, temp, tempSvg) {
					
				var svg = $(temp.node)[0];
				var _w = svg.getAttribute("width"),
					_h = svg.getAttribute("height");
				var image = temp.selectAll('image');
				var svgBgImage = temp.select('#svgBg').node.getAttribute('xlink:href');
				var objectGroupImage = temp.selectAll('.objectGroup image');

				var coverImage = temp.selectAll('.cover image');
				
				var arrImg = new Array();

				//배경이미지만 있고 이미지는 지정안된 상태
				if(image.length <= 1 && (svgBgImage=='') && coverImage.length <= 0) {
					//console.log('적용 이미지 없음');
					setTimeout(function(){
						var canvas = document.createElement('canvas');
						//svg --> canvas 변환
						importSvgToCanvas(svg, canvas, p, j, n, tempSvg);
					}, 1000);
					
				}else{ 
					//console.log('변환 대상 이미지수: ', image.length);
					for(var i=0; i<image.length; i++) {
						//arrImg[i] = image[i].node.getAttribute('xlink:href');
						if(image[i].node.style.display != 'none') {
							arrImg[i] = image[i].node.getAttribute('xlink:href');
						}
					}
	
					var chkImageCount=0;
					for(var i=0; i<arrImg.length; i++) {

						if(arrImg[i] != '') {
							toDataUrl(arrImg[i], i, function(base64Img, idx){
								
								image[idx].node.setAttribute('xlink:href', base64Img);
								
								chkImageCount++;
								if(chkImageCount>=arrImg.length) {
									setTimeout(function(){
										//var canvas = document.getElementById('canvas' + j);
										var canvas = document.createElement('canvas');
										importSvgToCanvas(svg, canvas, p, j, n, tempSvg);
									}, 500);
								}
							});
						}else{
							chkImageCount++;
						}
					}
				}

			}

			function toDataUrl(url, idx, callback, outputFormat) {
				var img = new Image();
				img.crossOrigin = 'Anonymous';
				img.onload = function(){
					var canvas = document.createElement('CANVAS');
					var ctx = canvas.getContext('2d');
					canvas.height = this.height;
					canvas.width = this.width;
					ctx.drawImage(this, 0, 0);
					var dataURL = canvas.toDataURL(outputFormat);
					//callback = null;
					callback(dataURL, idx);
				}
				img.src = url;
			}
			
			//SVG to Canvas: svg ==> canvas 변환
			function importSvgToCanvas(sourceSVG, targetCanvas, p, j, n, tempSvg) {
				//console.log('svg-->canvas 변환시작');
				//text 부분만 이미지화
				var canvgSVG = $(sourceSVG).clone();
				$(canvgSVG).find('g.text-cursor').remove();
				var _textBoxWrap = $(canvgSVG).find('g.textBoxWrap');
				var _tableTextWrapper = $(canvgSVG).find('g.tableTextWrapper');
				$(canvgSVG).find('.cover ~*').remove();
				$(canvgSVG).find('#svgBgWhite').remove();
				$(canvgSVG).find('#svgBg').remove();
				$(canvgSVG).find('desc').remove();
				$(canvgSVG).find('defs').remove();
				$(canvgSVG).find('.cover').remove();
				$(canvgSVG).find('.dataGroup').remove();
				$(canvgSVG).find('.objectGroup').html(_textBoxWrap);
				$(canvgSVG).find('.objectGroup').append(_tableTextWrapper);

				// STEP 1: text(g.textBoxWrap) 부분만 이미지화 (이슈: text-shadow 미적용됨)
				svgAsPngUri(canvgSVG[0], null, function(uri) {
					imageToPNG(uri);
				});	
				
				// STEP 2: text뺀(g.textBoxWrap) 나머지 전부 PNG캡쳐
				function imageToPNG(textImage) {
					//var svg = sourceSVG;
					var canvas = targetCanvas;

					//$(sourceSVG).find('g.textBoxWrap').remove();
					var imgElement = document.createElement('img');
						imgElement.src = textImage;

					var width = sourceSVG.getAttribute("width"),
						height = sourceSVG.getAttribute("height");	
			
						canvas.setAttribute('width', width);
						canvas.setAttribute('height', height);
						
					var ctx = canvas.getContext('2d');
					
					// 위 STEP 1. 을 사용하질 않고 text를 캡쳐시 canvas에 직접 그려준 후 캡쳐(글꼴, shadow등 효과 적용가능)
					/*$(sourceSVG).find('g.textBoxWrap').each(function(idx, el){
						var _fontText = $('#' + el.id + ' text').html();
						var _fontFamily = el.style.fontFamily;
						var _fontSize = $('#' + el.id + ' text').css('font-size');
						var _fontColor = el.style.fill;
						var _fontWeight = el.style.fontWeight;
						var _fontStyle = el.style.fontStyle;
						var _fontShadow = el.style.textShadow;
						var _fontTextX = $('#' + el.id + ' text').css('x');
						var _fontTextY = $('#' + el.id + ' text').css('y');
						
						console.log("_fontText:", _fontText, " _fontFamily:", _fontFamily, " _fontSize:", _fontSize, " _fontColor:", _fontColor, " _fontWeight:", _fontWeight, " _fontStyle:", _fontStyle, " _fontShadow:", _fontShadow);
						
						console.log(_fontShadow == '')
						if(_fontShadow !='') {
							//_fontShadow = 2;
							ctx.shadowColor = 'rgb(51,51,51)';
							ctx.shadowOffsetX = 2;
							ctx.shadowOffsetY = 2;
							ctx.shadowBlur = 2;
						}else{
							//_fontShadow = 0;
							ctx.shadowColor = '';
							ctx.shadowOffsetX = 0;
							ctx.shadowOffsetY = 0;
							ctx.shadowBlur = 0;
						}
						ctx.shadowColor = 'rgb(51,51,51)';
						ctx.shadowOffsetX = _fontShadow;
						ctx.shadowOffsetY = _fontShadow;
						ctx.shadowBlur = _fontShadow;
						ctx.font = _fontSize + "'" + _fontFamily + "'";
						//ctx.textBaseline = 'alphabetic';
						//ctx.scale(1,1);
						ctx.fillStyle = _fontColor;
						ctx.fillText(_fontText, _fontTextX, _fontTextY);
						
					});*/
					
					$(sourceSVG).find('g.textBoxWrap').remove();
					$(sourceSVG).find('g.tableTextWrapper').remove();

					svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);

					var img = new Image();
					img.onload = function() {
						// after this, Canvas’ origin-clean is DIRTY
						ctx.drawImage(img, 0, 0, this.width, this.height);
						ctx.drawImage(imgElement, 0, 0);
						var png = canvas.toDataURL("image/png");
						canvas.remove();
						
						KTCE.tempFile.uriArray[j] = Base64.encode(png);

						var _tempTimer = setInterval(function() {
							if(KTCE.tempFile.uriArray[j] != null) {
								clearInterval(_tempTimer);
								_tempTimer = null;
								tempSvg.remove();
							
								makeMyImageArray(p, j, n);
							}
						}, 300);
						
						$("#temporarySave").hide();
						$(".dimmLayer").hide();
						$(".action_loader").hide();
						
					}
					//img.crossOrigin = 'Anonymous';
					img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg_xml)));
					//img.src = url;
				}
			}
			
		function makeMyImageArray(p, j, n){
				p.objWrap.children().forEach(function(el, i) {
					if ( el.hasClass('hasImageId') ) {
						var clone = el.clone();
						clone.removeClass('hasImageId');
						clone.removeClass('hasData');
						var thisClass = clone.attr('class').replace('ID_','');
						KTCE.tempFile.myImageArray[j] = thisClass;
						clone.remove();
					}
				});
				makeSvgArray(p, j, n);
			}
			
			var paperSVGCount = 0;

			function makeSvgArray(p, j, n){
				var svgClone = $(p.s.node).clone();
				// 편집기 확대비율에 대한 미리보기 위치값 정상적용
				$(svgClone).css({'margin-top': 0, 'margin-left': 0});
			
				//paperSVGCount
				//makeSvgSaveFile
				var paperSVG = function() {
					//최종저장 크롬브라우저 인쇄용 저장로직 ie로직으로 강제분기 처리
					var browserChrome = false;
					if(browserType.indexOf('msie') > -1){
						browserChrome = false;

						//ie에서는 filter shadow 정수값이 임의의 값으로 들어가는 것을 방지
						//템플릿 관리자기능 관련 filter 예외
						$(p.s.node).find('defs:eq(0) filter').each(function(idx, el){
							if($(el).find('feGaussianBlur').length < 1) return;
							var _currentFilterId = $(this).attr('id');
							var _w = parseFloat(document.getElementById(_currentFilterId).childNodes[0].getAttribute('stdDeviation'));
							$(svgClone).find('filter:eq(' + idx + ')')[0].childNodes[0].setAttribute('stdDeviation', _w);
						})

					}else{
						browserChrome = true;
					}
					
					if(browserType.indexOf('msie') > -1){
						var css = styles(p, null);
						
						var s = document.createElement('style');
						s.setAttribute('type', 'text/css');
						s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
						var defs = document.createElement('defs');
						defs.appendChild(s);
					
						var innerDefs = defs.innerHTML;	//ie

						//배경 템플릿 관리자 기능 관련 예외적용
						if(svgClone.find('defs').html() != undefined){
							innerDefs = svgClone.find('defs:eq(0)').html() +  innerDefs;
						}
						svgClone.find('defs:eq(0)').append(innerDefs);
					}
		
					//ie cursor 객체 png 캡쳐방지를 위한 none 처리
					try{
						
						$(svgClone).find('g.xImage').removeAttr('mask', 'none');
						$(svgClone).find('g.textcover>rect').attr('fill', 'none');
						
						//cursor hidden 처리
						//$(svgClone).find('g.text-cursor').css('display', 'none');
						var cursor = $(svgClone).find("g.text-cursor");
						if(cursor.length>0)
							$(cursor).attr("style", "display:none");
						
						//배경템플릿삭제
						$(svgClone).find(".cover~*").remove();
						
						//눈금자 삭제처리
						if($(svgClone).find("#svgBgWhite").css('opacity') == 0) {
							//$(p.s.node).find("#svgBgWhite").css('opacity', 1);
							$(p.s.node).find("#svgBgWhite").removeAttr('style');
							$(svgClone).find("#svgBgWhite").removeAttr('style');
						}
					}catch(err){}	
									
					//표 선택셀 활성화 해제
					fnTableCellFillReset();
					try{
						$(svgClone).find('rect.xCellHover').css('opacity', 0);
						$(svgClone).find('rect.xCellHover').attr({'fill':'#ffffff'});
						$(svgClone).find('rect.xCellHover').removeAttr('data-active');
					}catch(err){}
					
					//잠금이미지 삭제처리
					try{
						$(svgClone).find('g.lockObjGroup').hide();
					}catch(err){}
					
					var _svg = $('<div></div>').append(svgClone)
						, _svgHTML = _svg.html()
					KTCE.tempFile.svgArray[j] = window.btoa( encodeURIComponent( _svgHTML ) ) ;
					paperSVGCount++;
					
					_svg.remove();
					console.log('************************************')
					if(paperSVGCount == KTCE.paperArray.length) {
						console.log('저장data 준비완료!!!!!!!');
						//_saveFile();
						//paperSVGCount = 0;
						var _tempTimer = setInterval(function() {
							_saveFile();
							paperSVGCount = 0;
							clearInterval(_tempTimer);
							_tempTimer = null;
						}, 500);
					}
				}
				
				//2020-05 배경 이미지 유효성 검증
				var svgBg = $(svgClone).find("#svgBg");
				var _imageUrl = svgBg.attr("xlink:href");
				try {
					var img = new Image();
					img.crossOrigin = 'Anonymous';
					img.onload = function(){
						svgBg.show();
						paperSVG();
					}
					img.onerror = function() {
						svgBg.hide();
						paperSVG();
					}
					img.src = _imageUrl;
				}catch(err){
					svgBg.hide();
					paperSVG();
				}
				
			}
			function makeSvgArray_원본(p, j, n){
				var svgClone = $(p.s.node).clone();
				// 편집기 확대비율에 대한 미리보기 위치값 정상적용
				$(svgClone).css({'margin-top': 0, 'margin-left': 0});
			
				//최종저장 크롬브라우저 인쇄용 저장로직 ie로직으로 강제분기 처리
				var browserChrome = false;
				if(browserType.indexOf('msie') > -1){
					browserChrome = false;

					//ie에서는 filter shadow 정수값이 임의의 값으로 들어가는 것을 방지
					//템플릿 관리자기능 관련 filter 예외
					$(p.s.node).find('defs:eq(0) filter').each(function(idx, el){
						if($(el).find('feGaussianBlur').length < 1) return;
						var _currentFilterId = $(this).attr('id');
						var _w = parseFloat(document.getElementById(_currentFilterId).childNodes[0].getAttribute('stdDeviation'));
						$(svgClone).find('filter:eq(' + idx + ')')[0].childNodes[0].setAttribute('stdDeviation', _w);
					})

				}else{
					browserChrome = true;
				}
				
				if(browserType.indexOf('msie') > -1){
					var css = styles(p, null);
					
					var s = document.createElement('style');
					s.setAttribute('type', 'text/css');
					s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
					var defs = document.createElement('defs');
					defs.appendChild(s);
				
					var innerDefs = defs.innerHTML;	//ie

					//배경 템플릿 관리자 기능 관련 예외적용
					if(svgClone.find('defs').html() != undefined){
						innerDefs = svgClone.find('defs:eq(0)').html() +  innerDefs;
					}
					svgClone.find('defs:eq(0)').append(innerDefs);
				}
	
				//ie cursor 객체 png 캡쳐방지를 위한 none 처리
				try{
					
					$(svgClone).find('g.xImage').removeAttr('mask', 'none');
					$(svgClone).find('g.textcover>rect').attr('fill', 'none');
					
					//cursor hidden 처리
					//$(svgClone).find('g.text-cursor').css('display', 'none');
					var cursor = $(svgClone).find("g.text-cursor");
					if(cursor.length>0)
						$(cursor).attr("style", "display:none");
					
					//배경템플릿삭제
					$(svgClone).find(".cover~*").remove();
					
					//눈금자 삭제처리
					if($(svgClone).find("#svgBgWhite").css('opacity') == 0) {
						//$(p.s.node).find("#svgBgWhite").css('opacity', 1);
						$(p.s.node).find("#svgBgWhite").removeAttr('style');
						$(svgClone).find("#svgBgWhite").removeAttr('style');
					}
				}catch(err){}	
								
				//표 선택셀 활성화 해제
				fnTableCellFillReset();
				try{
					$(svgClone).find('rect.xCellHover').css('opacity', 0);
					$(svgClone).find('rect.xCellHover').attr({'fill':'#ffffff'});
					$(svgClone).find('rect.xCellHover').removeAttr('data-active');
				}catch(err){}
				
				//잠금이미지 삭제처리
				try{
					$(svgClone).find('g.lockObjGroup').hide();
				}catch(err){}
				
				var _svg = $('<div></div>').append(svgClone)
					, _svgHTML = _svg.html()
				KTCE.tempFile.svgArray[j] = window.btoa( encodeURIComponent( _svgHTML ) ) ;
				paperSVGCount++;
				
				_svg.remove();
				
				if(paperSVGCount == KTCE.paperArray.length) {
					console.log('저장data 준비완료!!!!!!!');
					//_saveFile();
					//paperSVGCount = 0;
					var _tempTimer = setInterval(function() {
						_saveFile();
						paperSVGCount = 0;
						clearInterval(_tempTimer);
						_tempTimer = null;
					}, 500);
				}
				

			}
			
			//svg text만 이미지화(ie11 서블릿 글꼴이슈에 따른 작업)
			function importSvgTextToPng(svgClone, tempId, _currentWidth, _currentHeight, j, n) {
				var _width = _currentWidth,
					_height = _currentHeight;
				
				//var someElement = $("#tempSVG svg").clone().attr('id', 'cloneNode');
				var _tempSVG = $("#" + tempId + " svg");
				var cloneNodeId = "cloneNode" + j;
				var tempCloneNode = _tempSVG.attr('id', cloneNodeId);
				
				var tempTextSVG = $('#' + cloneNodeId + ' .objOuter .objectGroup .textBoxWrap').clone();
								  $('#' + cloneNodeId + ' .objOuter .objectGroup .textBoxWrap').remove();
				var tempAllSVG = $('#' + cloneNodeId + '>*').clone();

				var _style = _tempSVG.attr('style');
				
				var _viewBox = document.getElementById(cloneNodeId).getAttribute('viewBox');
				if(_viewBox == null ) {
					_viewBox = document.getElementById(cloneNodeId).getAttribute('viewbox');
				}	

				var tempSVGCreateNode = "<svg id='" + cloneNodeId + "' style='" + _style + "' width='" + _width + "' height='" + _height + "' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='" + _viewBox + "'></svg>";	

				$('#' + cloneNodeId + ' >*').remove();
				//$('#cloneNode').append(tempCoverSVG);
				
				$('#' + cloneNodeId).append(tempTextSVG);
				$('#' + cloneNodeId).removeAttr('xmlns:space')
		
		
				var cloneSVGNode = [];
				cloneSVGNode[j] = document.getElementById(cloneNodeId);
				/////////////////////////////////////////////////////////////////////
				    document.getElementById(cloneNodeId).expandoProperty = cloneSVGNode[j];
				//////////////////////////////////////////////////////////////////////
				var tempCloneNodeToString = [];
				
		
				if (cloneSVGNode[j].outerHTML) {
					tempCloneNodeToString[j] = cloneSVGNode[j].outerHTML;
				} else if (XMLSerializer) {
				    tempCloneNodeToString[j] = new XMLSerializer().serializeToString(cloneSVGNode[j]);
					///////////////////////////////////////////////////////////////
					document.getElementById(cloneNodeId).expandoProperty = null;
					///////////////////////////////////////////////////////////////
				}
				
				var canvas = document.createElement('canvas');
				$('body').append(canvas);
				var canvasId = 'tempCanvas' +j;
				$(canvas).attr('id', canvasId);
				$(canvas).css('display', 'none')
				
				////////////////////////////////////////////////////////////////////
				//document.getElementById("myCanvas").expandoProperty = canvas;
				//canvas[j].expandoProperty = canvas[j];
				document.getElementById(canvasId).expandoProperty = canvas;
				//////////////////////////////////////////////////////////////////
		
				canvas.width = _width;
				canvas.height = _height;
				
				
				var ctx = canvas.getContext("2d");
				ctx.font = "80pt ollehneoB";
				ctx.fontFamily = "ollehneoB";
				ctx.fillText("올레체B OllehB",189,580);
				
				canvg(canvas, tempCloneNodeToString[j], {useCORS : true, renderCallback : function(dom){
				
				    var svg = (new XMLSerializer()).serializeToString(dom);
				    
					setTimeout(function(e) {
				        var imgURI = canvas.toDataURL('image/png');
				        var tempTextSVG = $('#' + cloneNodeId + '>*').remove();
				        
				        $('#' + cloneNodeId).append(tempAllSVG);
				        
				        var SVG_NS = 'http://www.w3.org/2000/svg';
				        var XLink_NS = 'http://www.w3.org/1999/xlink';
				        var tempImage = document.createElementNS(SVG_NS, 'image');
				        tempImage.setAttributeNS(null, 'width',_width);
				        tempImage.setAttributeNS(null, 'height', _height);
				        tempImage.setAttributeNS(XLink_NS, 'xlink:href', imgURI);
	
				        $('#' + cloneNodeId + ' .objectGroup').append(tempImage);
	
					    imgURI = null;
				        document.getElementById(canvasId).expandoProperty = null;
	
				        console.log('===================================================================');
				        console.log(':: 최종 PNG변환용 DATA 준비완료!! ::');
				        console.log('===================================================================');
				        
				        //TXET이미지 변환버전 SVG(썸네일용)
						var _svgTextHTML = $("#" + tempId).html();
						KTCE.tempFile.svgArrayForPng[j] = window.btoa( encodeURIComponent( _svgTextHTML ) );
						//원본 SVG(DB용)
						var _svg = $('<div></div>').append(svgClone)
						, _svgHTML = _svg.html()
						KTCE.tempFile.svgArray[j] = window.btoa( encodeURIComponent( _svgHTML ) );
						paperSVGCount++;

						_svg.remove();
						
						$("#" + tempId).remove();
						$(canvas[j]).remove();
						
						if(paperSVGCount == KTCE.paperArray.length) {
							console.log('저장data 준비완료!!!');
							var _tempTimer = setInterval(function() {
								clearInterval(_tempTimer);
								_tempTimer = null;
								paperSVGCount = 0;
								_saveFile();
							}, 500);
	
							
						}
					
				    }, 300);
					
				}});
			}


			function _saveFile() {
				//운영자 권한자 VMD 카테고리 지정
				var flyerDstinCd = $('#flyerDstinCd').val();
				if(flyerDstinCd != undefined) {
					KTCE.paperInfo.flyerDstinCd = flyerDstinCd;
				}
				
				var flyerCntpntCd = $('#cntpntCd').val();
				if(flyerCntpntCd != undefined) {
					KTCE.paperInfo.cntpntCd = flyerCntpntCd;
				}
				
				//$(".dataGroup ~ *").show();
				$(".cover ~ *").show();
				// 임시저장이 안되어 있을 경우
				if ( !KTCE.tempSaveFlag ) {		
					// 재사용 전단지일 경우
					if ( KTCE.paperInfo.refFlyerId != '' && KTCE.paperInfo.refFlyerId != undefined ) {
						$.ajax({
							url:'/Fwl/FlyerApi.do',
							type:'post',
							data: {
								pageFlag : 'AF_SAVE'
								, flyerName : KTCE.paperInfo.flyerName
								, flyerSttusCd : '01'
								, canvasSize : KTCE.paperInfo.canvasSize
								, canvasType : KTCE.paperInfo.canvasType
								, tmptId : KTCE.paperInfo.tmptId
								, flyerTypeCode : KTCE.paperInfo.flyerTypeCode
								, hwYn : KTCE.paperInfo.hwYn
								, arrFlyerContent : KTCE.tempFile.svgArray
								//, arrFlyerContentForPng : KTCE.tempFile.svgArrayForPng
								, regFileKey : KTCE.tempFile.myImageArray
								, refFlyerId : KTCE.paperInfo.refFlyerId
								, thumbImg : KTCE.tempFile.uriArray
								, browserType : browserType
								, flyerDstinCd : flyerDstinCd
								, flyerCntpntCd : KTCE.paperInfo.cntpntCd
							},
							success:function(data){
								if  ( data.result == 'success' ) {

									KTCE.tempSaveFlag = true;

									KTCE.paperInfo.flyerId = data.flyerId;
									$(".notice").html(KTCE.paperInfo.flyerName);
									alert('성공적으로 저장되었습니다.');

									printPaperInfo();

									layer.tempSave.find('.closer').trigger('click');

									// 이전 다음 페이지 결정
									if ( KTCE.goNext ) {
										fnChangeStage('next');
									} else if ( KTCE.goPrev ) {
										fnChangeStage('prev');
									} else {
										fnChangeStage('save');
									}									
							
								} else {
									
									alert('데이터 저장에 실패하였습니다. 다시 임시저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');

								}
							}, error : function(e) {
								alert('임시저장에 실패하였습니다.');
								$(".action_loader").hide();
							}
						}).done(function(){$(".action_loader").hide();});

					// 재사용 전단지가 아닐 경우
					} else {
						$.ajax({
							url:'/Fwl/FlyerApi.do',
							type:'post',
							data: {
								pageFlag : 'AF_SAVE'
								, flyerName : KTCE.paperInfo.flyerName
								, flyerSttusCd : '01'
								, canvasSize : KTCE.paperInfo.canvasSize
								, canvasType : KTCE.paperInfo.canvasType
								, tmptId : KTCE.paperInfo.tmptId
								, flyerTypeCode : KTCE.paperInfo.flyerTypeCode
								, hwYn : KTCE.paperInfo.hwYn
								, arrFlyerContent : KTCE.tempFile.svgArray
								//, arrFlyerContentForPng : KTCE.tempFile.svgArrayForPng
								, thumbImg : KTCE.tempFile.uriArray
								, regFileKey : KTCE.tempFile.myImageArray
								, browserType : browserType
								, flyerDstinCd : flyerDstinCd
								, flyerCntpntCd : KTCE.paperInfo.cntpntCd
							},
							success:function(data){
								if  ( data.result == 'success' ) {

									KTCE.tempSaveFlag = true;

									KTCE.paperInfo.flyerId = data.flyerId;

									printPaperInfo();
									$(".notice").html(KTCE.paperInfo.flyerName);
									alert('성공적으로 저장되었습니다.');
									layer.tempSave.find('.closer').trigger('click');

									// 이전 다음 페이지 결정
									if ( KTCE.goNext ) {
										fnChangeStage('next');
									} else if ( KTCE.goPrev ) {
										fnChangeStage('prev');
									} else {
										fnChangeStage('save');
									}
								} else {
									alert('데이터 저장에 실패하였습니다. 다시 임시저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
								}
							}, error : function(e) {
								alert('임시저장에 실패하였습니다.');
								$(".action_loader").hide();
							}
						}).done(function(){$(".action_loader").hide();});
					}

				// 임시저장이 한 번 이상 되었을 경우
				} else {
					// 재사용 전단지일 경우
					if ( KTCE.paperInfo.refFlyerId != '' && KTCE.paperInfo.refFlyerId != undefined ) {

						$.ajax({
							url:'/Fwl/FlyerApi.do',
							type:'post',
							data: {
								pageFlag : 'AF_SAVE'
								, flyerId : KTCE.paperInfo.flyerId
								, flyerName : KTCE.paperInfo.flyerName
								, flyerSttusCd : '01'
								, canvasSize : KTCE.paperInfo.canvasSize
								, canvasType : KTCE.paperInfo.canvasType
								, tmptId : KTCE.paperInfo.tmptId
								, flyerTypeCode : KTCE.paperInfo.flyerTypeCode
								, hwYn : KTCE.paperInfo.hwYn
								, arrFlyerContent : KTCE.tempFile.svgArray
								//, arrFlyerContentForPng : KTCE.tempFile.svgArrayForPng
								, regFileKey : KTCE.tempFile.myImageArray
								, refFlyerId : KTCE.paperInfo.refFlyerId
								, thumbImg : KTCE.tempFile.uriArray
								, browserType : browserType
								, flyerDstinCd : flyerDstinCd
								, flyerCntpntCd : KTCE.paperInfo.cntpntCd
							},
							success:function(data){
								if  ( data.result != 'false' ) {
									console.log('======= 연속 저장 ========');
									printPaperInfo();
									$(".notice").html(KTCE.paperInfo.flyerName);
									alert('성공적으로 저장되었습니다.');
									layer.tempSave.find('.closer').trigger('click');

									// 이전 다음 페이지 결정
									if ( KTCE.goNext ) {
										fnChangeStage('next');
									} else if ( KTCE.goPrev ) {
										fnChangeStage('prev');
									}

								} else {
									alert('데이터 저장에 실패하였습니다. 다시 임시저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
								}

							}
							, error : function(e) {
								alert('임시저장에 실패하였습니다.');
								$(".action_loader").hide();
							}
						}).done(function(){$(".action_loader").hide();});

					// 재사용 전단지가 아닐 경우
					} else {
						$.ajax({
							url:'/Fwl/FlyerApi.do',
							type:'post',
							data: {
								pageFlag : 'AF_SAVE'
								, flyerId : KTCE.paperInfo.flyerId
								, flyerName : KTCE.paperInfo.flyerName
								, flyerSttusCd : '01'
								, canvasSize : KTCE.paperInfo.canvasSize
								, canvasType : KTCE.paperInfo.canvasType
								, tmptId : KTCE.paperInfo.tmptId
								, flyerTypeCode : KTCE.paperInfo.flyerTypeCode
								, hwYn : KTCE.paperInfo.hwYn
								, arrFlyerContent : KTCE.tempFile.svgArray
								//, arrFlyerContentForPng : KTCE.tempFile.svgArrayForPng
								, regFileKey : KTCE.tempFile.myImageArray
								, thumbImg : KTCE.tempFile.uriArray
								, browserType : browserType	
								, flyerDstinCd : flyerDstinCd
								, flyerCntpntCd : KTCE.paperInfo.cntpntCd
							},
							success:function(data){
								if  ( data.result != 'false' ) {
									console.log('======= 연속 저장 ========');
									printPaperInfo();
									$(".notice").html(KTCE.paperInfo.flyerName);
									alert('성공적으로 저장되었습니다.');
									layer.tempSave.find('.closer').trigger('click');

									// 이전 다음 페이지 결정
									if ( KTCE.goNext ) {
										fnChangeStage('next');
									} else if ( KTCE.goPrev ) {
										fnChangeStage('prev');
									}
								} else {
									alert('데이터 저장에 실패하였습니다. 다시 임시저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
								}

							}
							, error : function(e) {
								alert('임시저장에 실패하였습니다.');
								$(".action_loader").hide();
							}
						}).done(function(){$(".action_loader").hide();});
					}

				} // end of 임시저장
			}
			
			function isExternal(url) {
				return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
			}
			
			function styles(el, selectorRemap) {
				var css = "";
				var sheets = document.styleSheets;
				for (var i = 0; i < sheets.length; i++) {
					if (isExternal(sheets[i].href)) {
						//console.warn("Cannot include styles from other hosts: " + sheets[i].href);
						continue;
					}
					var rules = sheets[i].cssRules;
					if (rules != null) {
						for (var j = 0; j < rules.length; j++) {
							var rule = rules[j];
							if (typeof(rule.style) != "undefined") {
								var match = null;
								try {
									match = el.querySelector(rule.selectorText);
								} catch (err) {
									//console.warn('Invalid CSS selector "' + rule.selectorText + '"', err);
								}
								if (match) {
									var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
									css += selector + " { " + rule.style.cssText + " }\n";
								} else if (rule.cssText.match(/^@font-face/)) {
									css += rule.cssText + '\n';									
								}else{
									var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
									css += selector + " { " + rule.style.cssText + " }\n";									
								}
							}
						}
					}
				}
				return css;
			}
			
		}

		// 임시저장된 파일 불러오기 (손글씨)
		function fnLoadSavedHandFile(id, refFlyerId) {
			var contentArray = [];

			$.ajax({
				url:'/Fwl/FlyerApi.do',
				type:'post',
				data: {
					pageFlag : 'AF_DETAIL'
					, flyerId : id
					, contentPage : ''
				},
				success:function(data){
					//if ( data.result != 'false' ) {
					if ( data.result == 'success' ) {
						KTCE.paperInfo = data.flyerInfo;
						KTCE.paperInfo.content = data.flyerContents;

						KTCE.paperInfo.refFlyerId = refFlyerId;
						if(refFlyerId=='')KTCE.tempSaveFlag=true;

						layer.tempSave.find('#flyerName').val(KTCE.paperInfo.flyerName);

						fnCreateHandPaperLoop(KTCE.paperInfo.content.length, KTCE.paperInfo.canvasSize, KTCE.paperInfo.canvasType);

						// category 설정
						$('#flyerTypeCode').find('option').each(function() {
							if ( $(this).val() == KTCE.paperInfo.flyerTypeCode ) {
								$(this).prop('selected', true);
							}
						});

						$('#flyerTypeCode').change();

						fnSaveState();

					} else {
						alert('데이터 저장에 실패하였습니다. 다시 임시저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
					}

				}
				, error : function(e) {
					console.log('불러오기 실패!');
				}
			}).complete(function(){KTCE.progress.footer(100);});

		}

		//canvg.js mask 버그 관련 예외처리
		function maskDataTransfer(s, temp) {

			var maskRoot = $(temp);
			var maskParent = maskRoot.find('.objOuter').prev();
			
			var maskInfo = maskParent.html();
			
			if( maskInfo != null ) {
				switch(s) {
					case 'convert' :	
						maskInfo = maskInfo.replaceAll('<mask', '<g').replace('</mask>', '</g>');
						break; 
					case 'restore' :	
						maskInfo = maskInfo.replaceAll('<g', '<mask').replace('</g>', '</mask>');
						break;
					default:
				}
				maskParent.html('');
				maskParent.html(maskInfo);
			}

			return {'svg':maskRoot[0].outerHTML, 'mask':maskInfo};
		}
	
				
		// 임시저장된 파일 불러오기 (일반)
		function fnLoadSavedFile(id, refFlyerId) {
		
			var frontContent = null
				, backContent = null

			$.ajax({
				url:'/Fwl/FlyerApi.do',
				type:'post',
				data: {
					pageFlag : 'AF_DETAIL'
					, flyerId : id
					, contentPage : ''
				},
				success:function(data){

					if ( data.result == 'success' ) {
						//setTimeout(function(){
							KTCE.paperInfo = data.flyerInfo;
							KTCE.paperInfo.frontContent = data.flyerContents[0].content;
							KTCE.paperInfo.backContent = data.flyerContents[1] != undefined ? data.flyerContents[1].content : null
					
							KTCE.paperInfo.refFlyerId = refFlyerId;
							if(refFlyerId=='')KTCE.tempSaveFlag=true;
							
							layer.tempSave.find('#flyerName').val(KTCE.paperInfo.flyerName);
	
							if ( KTCE.paperInfo.backContent != null ) {
								//console.log('두장이 있음');
								fnCreatePaper('#paper1', KTCE.paperInfo.canvasSize,  KTCE.paperInfo.canvasType, false, true);
								fnCreatePaper('#paper2', KTCE.paperInfo.canvasSize,  KTCE.paperInfo.canvasType, true, true);
								
								//위/아래 페이지 이동 버튼 보이기
								$('.paperControl').find('.pageChanger').show();
							} else {
								//console.log('한장');
								fnCreatePaper('#paper1', KTCE.paperInfo.canvasSize,  KTCE.paperInfo.canvasType, false, true);
								
								//위/아래 페이지 이동 버튼 숨기기
								$('.paperControl').find('.pageChanger').hide();
							}
	
							// fnCreatePaper 함수처리 콜백 처리 확인로직: 임시저장된 전단지 불러올때 저장된 svg data 생성완료 체크
							var _loadParseObjectTimer = setInterval(function() {
								if(loadParseObjectState == 'Y') {
									clearInterval(_loadParseObjectTimer);
									_loadParseObjectTimer = null;
									
									printPaperInfo();
									
									// category 설정
									$('#flyerTypeCode').find('option').each(function() {
										if ( $(this).val() == KTCE.paperInfo.flyerTypeCode ) {
											$(this).prop('selected', true);
										}
									});
			
									$('#flyerTypeCode').change();
									
									fnParseObject(KTCE.paperInfo);
									
									//setTimeout(function(){
									//	fnSaveState("load");
									//}, 500);
									//fnSaveState("load");
									
									// setting paper name
									$(".notice").html(KTCE.paperInfo.flyerName);
									
								}
							}, 100);
							
							
						
					} else {
						alert('데이터 저장에 실패하였습니다. 다시 임시저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
					}

				}
				, error : function(e) {
					console.log('불러오기 실패!');
				}
			}).complete(function(){
				//setTimeout(function(){
					KTCE.progress.footer(100);
				//}, 4000);
			});
		}

		// 페이지 이동 버튼 바인딩
		function fnGoStage() {

			// 다음 단계
			trigger.goNext.on({
				click : function() {
					trigger.tempSave.trigger('click');
					setTimeout(function() {
						KTCE.goNext = true;
					}, 500);
					//KTCE.goNext = true;
					return false;
				}
			});

			// 이전 단계
			trigger.goPrev.on({
				click : function() {
					if ( confirm('페이지를 벗어나면 현재 저장된 정보를 잃게 됩니다. \n\n진행하시겠습니까?') ) {
						fnChangeStage('prev');
					} else {
						KTCE.goPrev = true;
						trigger.tempSave.trigger('click');
					}
				}
			});
		}

		// 이전 혹은 다음으로 페이지 전환
		function fnChangeStage(direction) {

			var nextForm = $('#nextStageForm')
				, flyerId = nextForm.find('input[name=flyerId]')
				, prevForm = $('#prevStageForm')

			window.onbeforeunload = null;

			if ( direction == 'next' ) {
				KTCE.goNext = false;
				flyerId.val(KTCE.paperInfo.flyerId);
				nextForm.submit();
			} else if ( direction == 'prev' ) {
				KTCE.goPrev = false;
				prevForm.submit();
			}
		}

		/******************************************************************************/
		/* Section: Prototype Method
		/******************************************************************************/
		return {
			init : initPage
			, loadSavedFile : fnLoadSavedFile
			, loadSavedHandFile : fnLoadSavedHandFile
			, create : fnCreatePaper
			, createHand : fnCreateHandPaper
			, createHandPaper : fnCreateHandPaperLoop
		}
		
		// 테이블내 텍스트 여백조절
		function fnSetTableCellMargin(paper){
			//table내 text 위치좌표 조정값
			var tableTextDisPos = paper.tableArray.tableTextDisPos = {};
				tableTextDisPos.textMarginLeft = 0;
				tableTextDisPos.textMarginTop = 0;
				
			var svgMargin = {};
				svgMargin.left = parseInt($(KTCE.currentPaper.s.node).css('margin-left'));
				svgMargin.top = parseInt($(KTCE.currentPaper.s.node).css('margin-top'));
				tableTextDisPos.svgMargin = svgMargin;
				
			var chrome = {};
				chrome.x = parseFloat($(KTCE.currentPaper.s.node).position().left);// - svgMargin.left;
				chrome.y = parseFloat($(KTCE.currentPaper.s.node).position().top);// - svgMargin.top;
				
			var ie = {};
				ie.x = parseFloat($(KTCE.currentPaper.s.node).position().left);// - svgMargin.left;
				ie.y = parseFloat($(KTCE.currentPaper.s.node).position().top);// - svgMargin.top;
				
				tableTextDisPos.chrome = chrome;
				tableTextDisPos.ie = ie;
		}
		
		function fnSetTableTexUnderlineBaseSize(paper) {
			var underlineSize = paper.tableArray.underline = {};
			underlineSize.size = [];
		}	

		//선택 font값 구하기
		function fngetFontFamily(fontName) {
			var family = 'KTfontBold';
			switch(fontName) {
				case '산돌고딕L' :
					family = 'SDGothicNeoaL'
					break;
				case '산돌고딕M' :
					family = 'SDGothicNeoaM';
					break;
				case '산돌고딕B' :
					family = 'SDGothicNeoaB';
					break;
				case '올레체L' :
					family = 'ollehneoL';
					break;
				case '올레체M' :
					family = 'ollehneoM';
					break;
				case '올레체B' :
					family = 'ollehneoB';
					break;
				case 'KT서체T' :
					family = 'KTfontThin';
					break;
				case 'KT서체L' :
					family = 'KTfontLight';
					break;
				case 'KT서체M' :
					family = 'KTfontMedium';
					break;
				case 'KT서체B' :
					family = 'KTfontBold';
					break;
				default:
					family = 'KTfontBold';
			}
			
			return family;
		}	

		//표 세로(vertical align) 정렬
		function fnCellTextVerticalAlign(align) {
			if(KTCE.currentPaper.currentShape == null || KTCE.currentPaper.currentShape.attr("data-name") != 'xTable') return;			
			var tableObj = KTCE.currentPaper.currentShape;
			var _cell = tableObj.selectAll('rect.xCellHover[data-active="active"]');
			if(_cell.length == 0 || align == undefined && !textCellEditMode || align == 'newLine'){
				_cell = tableObj.selectAll('rect.xCellHover');
			}

			var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));
			
			_cell.forEach(function(el, idx){
								
				if(align==undefined || align=='newLine') {						
					var vertcalAlign = ($(el.node).attr('data-text-vertical-align')==undefined) ? 'top' : $(el.node).attr('data-text-vertical-align');						
				}else{
					var vertcalAlign = align;
				}
	
				switch(vertcalAlign) {
				case 'top':
					$(el.node).attr({'data-text-vertical-align': 'top'});
					break;
				case 'middle':
					$(el.node).attr({'data-text-vertical-align': 'middle'});
					break;
				case 'bottom':
					$(el.node).attr({'data-text-vertical-align': 'bottom'});
					break;
				}
				
				var cellHeight = parseFloat( el.attr( 'height' ) );
				var _textG = $("g.xTableTexts_" + tableObj.node.id + " #text" + _tableNumber + "_" + el.attr('data-index-x')+ "_" + el.attr('data-index-y') + "_" + tableObj.node.id);				
				if(_textG.length <= 0 ) return;
				
				var bbox = Snap(_textG[0]);
				var _scale = KTCE.currentPaper.currentShape.freeTransform.attrs.scale;//Snap($("#"+tableObj.id)[0]).attr('transform').globalMatrix;
				var top_value = parseFloat(el.attr('y'));
				var middle_value = bbox.getBBox().cy + (cellHeight * _scale.y)/2 - bbox.getBBox().height/2;
				var bottom_value = bbox.getBBox().cy + (cellHeight * _scale.y) - (bbox.getBBox().height + 5.40000915527344);//5.** 값은 글자사이즈 비율, 폰트종류로 조절
				var _text = _textG.find('text');
				var _fontSize = parseInt($(_text).css('font-size'));
				var _fontTopMargin = _fontSize * 0.3;
				var _fontMiddleMargin = 0;
				var _fontBottomMargin = 0;
				var _lineMargin = 3;
				if(browserType.indexOf('msie') != -1){
					//산돌B, 산돌M, 산돌L 등 switch분기 처리
					//_fontTopMargin = _fontSize * 0.24;
					if($(_textG[0]).css('font-family').indexOf('olleh') > -1) { //올레체 경우 여백값 조절
						_fontTopMargin = _fontSize * 0.62;//0.48;
						_fontBottomMargin =  _fontSize * 0.33;
						_fontMiddleMargin = _fontBottomMargin/2;
						_lineMargin = 3;
					}else if($(_textG[0]).css('font-family').indexOf('KT') > -1) { //KT서체 경우 여백값 조절
						_fontTopMargin = _fontSize * 0.288;
						_fontBottomMargin = 0;
						_fontMiddleMargin = 0;
						_lineMargin = 3;
					}else{
						_fontTopMargin = _fontSize * 0.24;
						_fontBottomMargin = 0;
						_fontMiddleMargin = 0;
						_lineMargin = 3;
					}
				}else{
					if($(_textG[0]).css('font-family').indexOf('olleh') > -1) { //올레체 경우 여백값 조절
						_fontTopMargin = _fontSize * 0.2345;
					}else if($(_textG[0]).css('font-family').indexOf('KT') > -1) { //KT서체 경우 여백값 조절절
						_fontTopMargin = _fontSize * 0.250;
					}else{
						_fontTopMargin = _fontSize * 0.2025;
					}
					_lineMargin = 4;
				}

				var _y = _matrixValue = null;
				//셀병합 값 구하기
				var _tempMergeCell = el.attr('data-merge');
				var _tempMergeDataArray = null;
				if(_tempMergeCell !=null ) {
					_tempMergeDataArray = _tempMergeCell.split(",");
					var _tableX = (document.getElementById(tableObj.node.id).getAttribute('tableX')==null) ? document.getElementById(tableObj.node.id).getAttribute('tablex') : document.getElementById(tableObj.node.id).getAttribute('tableX');
					var _tableY = (document.getElementById(tableObj.node.id).getAttribute('tableY')==null) ? document.getElementById(tableObj.node.id).getAttribute('tabley') : document.getElementById(tableObj.node.id).getAttribute('tableY');
					var rowIndex = null;
					var colIndex = null;
					var mergeCellHeight = 0;
					for(var m=0; m<_tempMergeDataArray.length; m++){
						rowIndex = parseInt(_tempMergeDataArray[m]/_tableX);
						colIndex = parseInt(_tempMergeDataArray[m]%_tableX);
						if(parseInt(_tempMergeDataArray[m]/_tableX) != parseInt(_tempMergeDataArray[m+1]/_tableX)) {
							rowIndex = parseInt(_tempMergeDataArray[m]/_tableX);
							colIndex = parseInt(_tempMergeDataArray[0]%_tableX);
							mergeCellHeight += parseFloat($(tableObj.node).find('rect.xCellHover.x' + colIndex + '_y' + rowIndex).attr('height'));
						}
					}
					cellHeight = mergeCellHeight;
				}				
								
				switch(vertcalAlign) {
				case 'top':
					_y = -(_fontTopMargin) + (_lineMargin);
					_matrixValue = "matrix(1,0,0,1,0," + _y + ")";
					_textG.attr({'transform': _matrixValue, 'vertical-align': 'top'});
					break;
				case 'middle':
					_y = ((cellHeight * _scale.y)/2 - bbox.getBBox().height/2) - _fontTopMargin + _fontMiddleMargin;
					_matrixValue = "matrix(1,0,0,1,0," + _y + ")";
					_textG.attr({'transform': _matrixValue, 'vertical-align': 'middle'});
					break;
				case 'bottom':
					_y = ((cellHeight * _scale.y) - bbox.getBBox().height) - _fontTopMargin + _fontBottomMargin - _lineMargin;
					_matrixValue = "matrix(1,0,0,1,0," + _y + ")";
					_textG.attr({'transform': _matrixValue, 'vertical-align': 'bottom'});
					break;
				}
				
				//cursor 위치 유지 관련로직
				var textWrapperForTable =  KTCE.currentPaper.objOuter.select("g.xTableTexts_" + tableObj.node.id);					
				var wordWrapper = textWrapperForTable.select("#text" + _tableNumber + "_" + el.attr('data-index-x') + "_" + el.attr('data-index-y') + "_" + tableObj.node.id);				
				var substring = getTextData(wordWrapper);
				
				//cursor 위치 유지
				//if(textCellEditMode) updateCellCursorPos(wordWrapper);
				if($(el.node).attr('data-active')=="active" && textCellEditMode) updateCellCursorPos(wordWrapper);				
			});
		}
		
		//표 텍스트 밑줄(underline) 처리 함수
		function fnSetCellUnderline(textArray, underlineToggle) {
			textArray.forEach(function(el, idx){
				var textG = el;
				if ( $(textG.node).attr("data-text-underline") == null && underlineToggle || $(textG.node).attr("data-text-underline") == 'none' && underlineToggle ) {
					$(textG.node).attr("data-text-underline", "underline");
				} else if($(textG.node).attr("data-text-underline") != null && underlineToggle ) {
					$(textG.node).attr("data-text-underline", "none");
				} else {
				}
				
				if(textG.select("g.textUnderLine") != null && underlineToggle) {
					textG.select("g.textUnderLine").remove();
				}else{

					if ($(textG.node).attr("data-text-underline") == "underline") {
						
						if(underlineToggle) {
							var underLineG = textG.g().attr("class", "textUnderLine");
						}else{
							var underLineG = textG.select("g.textUnderLine");
						}
						if(underLineG == null) {
							var underLineG = textG.g().attr("class", "textUnderLine");
						}

						var itemArray = textG.selectAll('text');
						var underLine = underLineG.selectAll('line');
						for(var i=0; i<itemArray.length; i++) {
							var _fontSize = parseInt($(itemArray[i].node).css('font-size'));
							if(browserType.indexOf('msie') > -1 && $(textG.node).css('font-style') == 'italic'){	//IE italic
								var underlineMargin = _fontSize * 0.42;
								var _x1 = itemArray[i].getBBox().x + underlineMargin;
								var _x2 = itemArray[i].getBBox().x + itemArray[i].getBBox().width - underlineMargin;
							}else if(browserType.indexOf('msie') > -1 && $(textG.node).css('font-style') != 'italic'){	//IE NOT italic
								var underlineMargin = _fontSize * 0.03;
								var _x1 = itemArray[i].getBBox().x + underlineMargin;
								var _x2 = itemArray[i].getBBox().x + itemArray[i].getBBox().width - underlineMargin;
							}else{
								var _x1 = itemArray[i].getBBox().x;
								var _x2 = itemArray[i].getBBox().x + itemArray[i].getBBox().width;
							}
				
							var _y = itemArray[i].getBBox().y + itemArray[i].getBBox().height;
							if(browserType.indexOf('msie') > -1) {
								if($(textG.node).css('font-family').indexOf('olleh') > -1) { 
									_y = _y - ((_fontSize/0.75) * 0.145);
								}
							}
							
							var textContent = $(itemArray[i].node).text();

							if(underlineToggle) {
								if(textContent === ' ' && textContent.length === 1) {
									underLineG.line(_x1, _y, _x2, _y).attr({
										"fill" : "ffffff",
										"stroke" : $(textG.node).css("fill"),
										"style" : "stroke-width : 1px; visibility: hidden;"
									});
								}else{
									underLineG.line(_x1, _y, _x2, _y).attr({
										"fill" : "#ffffff",
										"stroke" : $(textG.node).css("fill"),
										"style" : "stroke-width : 1px; visibility:visible;"
									});
								}
							}else{
								if(underLine[i] != undefined) {
									if(textContent === ' ' && textContent.length === 1) {
										$(underLine[i].node).css('visibility', 'hidden')
									}else{
										$(underLine[i].node).css('visibility', 'visible')
									}
									underLine[i].attr({'x1': _x1, 'x2': _x2});
								}else{
									if(textContent === ' ' && textContent.length === 1) {
										underLineG.line(_x1, _y, _x2, _y).attr({
											"fill" : "ffffff",
											"stroke" : $(textG.node).css("fill"),
											"style" : "stroke-width : 1px; visibility: hidden;"
										});
									}else{
										underLineG.line(_x1, _y, _x2, _y).attr({
											"fill" : "#ffffff",
											"stroke" : $(textG.node).css("fill"),
											"style" : "stroke-width : 1px; visibility:visible;"
										});
									}
								}
							}
						}
					}
				}
			});
		}
		
	
		/*
		 * IE브라우저에서 표내 글자 center/right 정렬, 이탤릭체 지정시 불필요한 공간차지에 따른 제거 함수
		 * textG: Text그룹
		 * fontSize: Text사이즈
		 * align: center:2, right:1
		 */
		function fnIECellTextItalicMargin(textG, fontSize, align){
			var rightMargin = 0;
			if(browserType.indexOf('msie') > -1 && $(textG).css('font-style') == 'italic'){	//IE italic
				if($(textG).css('font-family').indexOf('olleh') > -1) { 
					rightMargin = (fontSize * 0.45)/align;
				}else{
					rightMargin = (fontSize * 0.55)/align;
				}
			}else{
				rightMargin = 0;
			}
			return rightMargin;
		}
		
		/*
		// 접속 브라우져 기록
		*/
		function fnSetUserAgent(){
			var browserType = null;
			var agent = navigator.userAgent.toLowerCase();
			var name = navigator.appName;
			
			if(name == 'Microsoft Internet Explorer'){
				browserType = 'msie';
			} else {
				if(agent.search('trident') > -1)	browserType='msie11';
				else if(agent.search('edge/') > -1)	browserType='msie12';
				else if(agent.search('chrome') > -1)browserType='chrome';
				else browserType='';
			}
			
			$("#paper1").attr({'data-useragent': browserType} );

		}
		
		// save 시간 기록 
		function fnSetUserSaveDate() {
			var date = new Date();
			var nowYear = date.getFullYear();
			var nowMonth = date.getMonth() + 1;
			var nowDay = date.getDay();
			var nowHours = date.getHours();
			var nowMin = date.getMinutes();
			var saveDate = nowYear+ "/" + nowMonth + "/" + nowDay + " " + nowHours + ":" + nowMin;
			//var nowSec = date.getSeconds(); 
			$(KTCE.paperArray[0].thisSVG[0]).attr( {'data-savedate': saveDate});
		}
		

		/******************************************************************************/
		/* Section: 오브젝트 그룹핑 기능
		/******************************************************************************/
		
		// 그룹 기능 바인딩
		function fnObjectGroupingBinding() {
			var selectObjArray = [];
			var objGrouping = null;
			trigger.objectGrouping.each(function() {
				$(this).on({
					mousedown : function(e) {
						fnSetObjectGrouping(e);
					}
				});
			});
			// objectReGrouping
			trigger.objectReGrouping.each(function() {
				$(this).on({
					mousedown : function(e) {
						fnSetObjectReGrouping(e);
					}
				});
			});
			// objectUnGrouping
			trigger.objectUnGrouping.each(function() {
				$(this).on({
					mousedown : function(e) {
						fnSetObjectUnGrouping(e);
					}
				});
			});
			
			// 객체그룹
			function fnSetObjectGrouping(evt) {
				var selectedShapeArray = KTCE.currentPaper.selectedShapeArray;
				if( selectedShapeArray.length > 1 ) {
					var _currentPaperId = $(KTCE.currentPaper.s.node).attr('id');
					var _currentPaperNum = parseInt(_currentPaperId.substring(5,7));
					var groupingObj = KTCE.currentPaper.objWrap.g().attr({'class': 'hasDataGroup hasData', 'data-name': 'objectGroup'});
					var groupId = groupingObj.id;
					groupingObj.attr('id', groupId);
					var tempShapeZindex = [];
					var tempTableArray = [];
					for(var s=0; s < selectedShapeArray.length; s++ ){
						for ( var i in KTCE.currentPaper.shapeArray ) {
							if ( selectedShapeArray[s].attr("id") == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id")) {
								KTCE.currentPaper.shapeArray[i].unplug();
								KTCE.currentPaper.shapeArray.splice(i, 1);
								break;
							}
						}
						
						$(selectedShapeArray[s].node).off();
						var zIndex = $(selectedShapeArray[s].node).index();
						tempShapeZindex.push(zIndex);
						$(selectedShapeArray[s].node).attr('temp-zindex', zIndex);
						groupingObj.append(selectedShapeArray[s]);
						
						//표 텍스트 & 선택해제
						if ( selectedShapeArray[s].attr("data-name") == 'xTable') {
							//표선택 영역 해제
							var xCellHover = selectedShapeArray[s].selectAll('rect.xCellHover');
							xCellHover.attr({'fill': '#ffffff'})
							xCellHover.forEach(function(el, idx){
								$(el.node).css('opacity', 0);
							})
							
							//표내 텍스트도 그룹핑 처리
							var tableTextWrapId = "xTableTexts_" + selectedShapeArray[s].attr("id");
							groupingObj.append($("." + tableTextWrapId)[0]);
						}
						
						var selectedObj = selectedShapeArray[s];
						if(selectedObj.attr('data-name') == 'xTable') {
							for(var t=0; t < KTCE.currentPaper.tableArray.length; t++) {
								if(KTCE.currentPaper.tableArray[t] != undefined) {
									if ( selectedObj.node.id == KTCE.currentPaper.tableArray[t].id ) {
										KTCE.currentPaper.tableArray.splice(t, 1);
									}else{
										tempTableArray.push( KTCE.currentPaper.tableArray[t]);
									}
								}
							}
						}
					}
					
					//그룹핑 객체 zindex 유지
					tempShapeZindex.sort();
					for(var z=0; z<tempShapeZindex.length; z++) {
						var _tempObj = groupingObj.select('.hasData[temp-zindex="' + tempShapeZindex[z] + '"]');
						groupingObj.append(_tempObj);
						if ( _tempObj.attr("data-name") == 'xTable') {
							var tableTextWrapId = "xTableTexts_" + _tempObj.attr("id");
							groupingObj.append($("." + tableTextWrapId)[0]);
						}
					}
					tempShpaeZindex = null;	//임시값 해제
					
					tempTableArray = KTCE.currentPaper.tableArray;
					KTCE.currentPaper.tableArray = [];
					for(var tt=0; tt<tempTableArray.length; tt++) {
						if(tempTableArray[tt] != undefined) {
							var tableObj = Snap($("#" + tempTableArray[tt].id)[0]);
							fnInitializeTable(tableObj);	//table 정보갱신
						}
					}
					
					//$("#" + groupId).on({
					$(groupingObj.node).on({
						dblclick : function(e) {
							mouseEvent = "dblclick";
							e.preventDefault();
						},
						mousedown : function(e) {
							mouseEvent = "mousedown";
							
							if(groupingObj.freeTransform == undefined) {
								setFreeTransform(groupingObj, e.shiftKey, 'group');
							}else{
								setFreeTransform(groupingObj, e.shiftKey);
							}
							
							if(KTCE.currentPaper.selectedShapeArray.length >= 1 && KTCE.currentPaper.currentShape != null ) {
								fnSetColsDisapled(true);
							}else{
								fnSetColsDisapled(false);
							}
							
						}, 
						mouseup : function(e) {
							mouseEvent = "mouseup";
						},
						mousemove : function(e) {
							mouseEvent = "mousemove";
							e.preventDefault();
						},
						mouseout : function(e) {
							mouseEvent = "mouseout";
						}
					 });
					$(groupingObj.node).trigger('mousedown');
					
				}else {
					alert('그룹핑 기능은 2개이상 객체를 선택해야 합니다!!')
				}
			}
			
			function fnSetColsDisapled(_flag) {
				if(_flag) {
					$(".col15Disabled").hide();	//그룹서식
					$(".col3disabled").show();		//글꼴
					$(".col4disabled").show();		//단락
					$(".col6Disabled").show();		//도형서식
					$(".col12Disabled").show();		//표서식
					$(".col11Disabled").show();		//스타일
					$(".col13Disabled").hide();		//정렬
					$(".col10disabled").show();		//자르기
				}else{
					$(".col15Disabled").show();
				}
			}
			// 객체재그룹
			function fnSetObjectReGrouping(evt) {
				console.log('fnSetObjectReGrouping!')
			}
			// 객체그룹해제
			function fnSetObjectUnGrouping(evt) {
				var selectedShapeArray = KTCE.currentPaper.selectedShapeArray;
				if(selectedShapeArray.length > 0) {
					if(selectedShapeArray[0].hasClass('hasDataGroup')) {
						var objectGroupBBox = selectedShapeArray[0].getBBox();
						var objectGroupft = selectedShapeArray[0].freeTransform;
						var groupObj = $("#" + selectedShapeArray[0].node.id + ">.hasData");
						
						//그룹해제시 잠금삭제처리
						try{
							if(KTCE.currentPaper.lockObjWrap != undefined) {
								selectedShapeArray[0].data('objLock', false);
								$(selectedShapeArray[0].node).removeAttr('data-lock');
								KTCE.currentPaper.lockObjWrap.select("."+ selectedShapeArray[0].node.id).remove();
							}
						}catch(e){}
						
						deleteFreeTransform();
						
						var groupChildObjInfo = [];
						var ungroupObj = [];
						groupObj.each(function(idx, el){
							var _obj = $(el);
							var obj = Snap(_obj[0]);
							var objInfo = $("#" + obj.node.id).offset();
							groupChildObjInfo.push([obj, objInfo, idx]);
						});
						
						$(selectedShapeArray[0].node).parent().append(selectedShapeArray[0].node.childNodes);
						
						for ( var i in KTCE.currentPaper.shapeArray ) {
							if ( selectedShapeArray[0].attr("id") == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id")) {
								KTCE.currentPaper.shapeArray[i].unplug();
								KTCE.currentPaper.shapeArray.splice(i, 1);
							}
						}
						
						KTCE.currentPaper.selectedShapeArray = [];
						var ungroupObj = [];
						groupObj.each(function(idx, el){
							var _obj = $(el);
							var obj = Snap(_obj[0]);
							switch(_obj.attr('class')) {
							case 'textBoxWrap hasData' :
								var matrix = obj.attr('transform').globalMatrix;
								var _cfontSize =  parseInt($(obj.node).find('text.textBox').css('font-size')) * 0.7692307692307692;	//20pt => 26px (pt환산비율: 0.7692307692307692)
								var _fontSize = Math.round(_cfontSize *  objectGroupft.attrs.scale.x);
								fnFontSize(obj, _fontSize + 'pt');
								fnSetFreeTransform(obj, 'reDraw', undefined, KTCE.currentPaper);
								break;
							case 'xTable hasData' :
								var cellTextArray =  $(".xTableTexts_" + obj.node.id).find('text.textBox');
								cellTextArray.each(function(idx, el){
									var _cfontSize =  parseInt($(el).css('font-size')) * 0.7692307692307692;	//20pt => 26px (pt환산비율: 0.7692307692307692)
									var _fontSize = Math.round(_cfontSize * objectGroupft.attrs.scale.x);
									$(el).attr("data-font-size", _fontSize);
									$(el).css("font-size", _fontSize + 'pt');
								})
								fnInitializeTableStrokeWidth(obj, 'ungroup');
								break;
							default:
								if(!(_obj.attr('class').indexOf("tableTextWrapper") > -1))
									fnSetFreeTransform(obj, 'reDraw', undefined, KTCE.currentPaper);
							}
							
							if(obj.freeTransform != null) {
								if(obj.type !='g') {
									//obj.data('hasHandle', true);
									//obj.freeTransform.visibleHandles();
								}else{
									obj.data('hasHandle', true);
									obj.freeTransform.showHandles();
								}
								var objInfo = $("#" + obj.node.id).offset();
								setUnGroupPosition(obj, objInfo, idx);
								//그룹객체/정보 삭제
								selectedShapeArray[0].remove();
								$("g.dataGroup ." + selectedShapeArray[0].node.id).remove();
							}
						});
						
						function setUnGroupPosition(obj, objInfo, idx) {
							var shapeAddFlag = true;
							//var newObjInfo = $("#" + obj.node.id).offset();
							var newObjInfo = objInfo;
							var _matrix = obj.attr('transform').globalMatrix;
							
							if(obj.hasClass('textBoxWrap')){	//textBoxWrap hasData
								obj.freeTransform.attrs.scale.x = 1;
								obj.freeTransform.attrs.scale.y = 1;
								obj.freeTransform.attrs.rotate += objectGroupft.attrs.rotate;
								var tx = obj.freeTransform.attrs.translate.x;
								var ty = obj.freeTransform.attrs.translate.y;
								obj.transform([
								    'R' + obj.freeTransform.attrs.rotate
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'S' + obj.freeTransform.attrs.scale.x
								    , obj.freeTransform.attrs.scale.y
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'T' + tx
								    , ty
								].join(','));
								
								obj.freeTransform.updateHandles();
								KTCE.updateData(obj, obj.freeTransform.attrs);
							
								newObjInfo = $("#" + obj.node.id).offset();
								var ratio = parseFloat($(".screenSizer .uiDesignSelect1 .uiDesignSelect-text").html().split("%")[0])/100;
								obj.freeTransform.attrs.translate.x += (groupChildObjInfo[idx][1].left - parseFloat(newObjInfo.left)) / ratio;
								obj.freeTransform.attrs.translate.y += (groupChildObjInfo[idx][1].top - parseFloat(newObjInfo.top)) / ratio;
								
								var tx = obj.freeTransform.attrs.translate.x;
								var ty = obj.freeTransform.attrs.translate.y;
								obj.transform([
								    'R' + obj.freeTransform.attrs.rotate
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'S' + obj.freeTransform.attrs.scale.x
								    , obj.freeTransform.attrs.scale.y
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'T' + tx
								    , ty
								].join(','));
								
								obj.freeTransform.updateHandles();
								KTCE.updateData(obj, obj.freeTransform.attrs);
								
							}else if(groupChildObjInfo[idx][1].left != newObjInfo.left) {
								obj.freeTransform.attrs.scale.x *= objectGroupft.attrs.scale.x;
								obj.freeTransform.attrs.scale.y *= objectGroupft.attrs.scale.y;
								if(obj.attr('data-name')==='xTable' && objectGroupft.attrs.rotate != 0) {
									var popupmsg = '<span class="popupMsg">표는 회전Mode가 지원하질 않아 기본화면으로 전환합니다!</span>';
									$("span.popupMsg").remove();
									$("body").append(popupmsg);
									var _y = 186 + obj.getBBox().y;
									$("span.popupMsg").css({
										"position": "absolute",
										"display": "none",
										"left": "50%",
										"top": _y,
										"width": KTCE.currentPaper.width,
										"margin":0,
										"margin-left": -(KTCE.currentPaper.width/2 + 8),
										"z-index": 1010,
										"-webkit-user-select": "none",
										"-moz-user-select": "none",
										"-ms-user-select": "none",
										"user-select": "none",
										"background-color": "#555",
										"color": "#fff",
										"font-size": "2.2em",
										"font-weight": "bold",
										"text-align": "center",
										"padding": "10px"
									}).stop().fadeIn(1500).fadeOut(3000, function(){$("span.popupMsg").remove();});
									
									obj.freeTransform.attrs.rotate = 0;
								}else{
									obj.freeTransform.attrs.rotate += objectGroupft.attrs.rotate;
									obj.freeTransform.attrs.rotate = (obj.freeTransform.attrs.rotate < -450) ? obj.freeTransform.attrs.rotate + 360 : obj.freeTransform.attrs.rotate;
								}
								
								var tx = obj.freeTransform.attrs.translate.x;
								var ty = obj.freeTransform.attrs.translate.y;
								obj.transform([
								    'R' + obj.freeTransform.attrs.rotate
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'S' + obj.freeTransform.attrs.scale.x
								    , obj.freeTransform.attrs.scale.y
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'T' + tx
								    , ty
								].join(','));
								
								obj.freeTransform.updateHandles();
								KTCE.updateData(obj, obj.freeTransform.attrs);
								
								newObjInfo = $("#" + obj.node.id).offset();
								var ratio = parseFloat($(".screenSizer .uiDesignSelect1 .uiDesignSelect-text").html().split("%")[0])/100;
								obj.freeTransform.attrs.translate.x += (groupChildObjInfo[idx][1].left - parseFloat(newObjInfo.left)) / ratio;
								obj.freeTransform.attrs.translate.y += (groupChildObjInfo[idx][1].top - parseFloat(newObjInfo.top)) / ratio;
								
								var tx = obj.freeTransform.attrs.translate.x;
								var ty = obj.freeTransform.attrs.translate.y;
								obj.transform([
								    'R' + obj.freeTransform.attrs.rotate
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'S' + obj.freeTransform.attrs.scale.x
								    , obj.freeTransform.attrs.scale.y
								    , obj.freeTransform.attrs.center.x
								    , obj.freeTransform.attrs.center.y
								    , 'T' + tx
								    , ty
								].join(','));
								
								obj.freeTransform.updateHandles();
								KTCE.updateData(obj, obj.freeTransform.attrs);
								
								if(obj.attr('data-name')==='objectGroup') {
									//console.log('group객체');
								}else if(obj.attr('data-name')==='xTable') {
									var matrix = obj.attr('transform').globalMatrix;
									if(matrix.a != 1 && browserType.indexOf('msie') > -1 || matrix.d !=1 && browserType.indexOf('msie') > -1 ) {	//scale값 변경시만
										setIEStrokeWidth(obj);
									}
									//KTCE.updateData(obj, obj.freeTransform.attrs);
									KTCE.currentPaper.currentShape = obj
									fnUpdateTextPositionInTable( obj.freeTransform, false );
									KTCE.currentPaper.currentShape = null;
								}else if(obj.attr('data-name')==='xImage'){
									//console.log('image')
								}else if(obj.hasClass('textBoxWrap')){	//textBoxWrap hasData
									//console.log('textBox!!!!!');
								}else{
									//console.log('도형!!!!');
									if(obj.type == "line"){
										//console.log('line!!');
									}else{
										var matrix = obj.attr('transform').globalMatrix;
										if(matrix.a != 1 && matrix.b == 0 && browserType.indexOf('msie') > -1 || matrix.d !=1 && matrix.b == 0 && browserType.indexOf('msie') > -1 ) {	//scale값 변경시만
											shapeAddFlag = false;
											fnReCreateShape(obj, obj.freeTransform, 'upgroup');
											$("g.dataGroup>g." + obj.node.id).remove();
											
											for ( var i in KTCE.currentPaper.shapeArray ) {
												if ( obj.node.id == $(KTCE.currentPaper.shapeArray[i].subject.node).attr("id")) {
													KTCE.currentPaper.shapeArray[i].unplug();
													KTCE.currentPaper.shapeArray.splice(i, 1);
												}
											}
										}else{	//원본 크기일 경우
											shapeAddFlag = true;
										}
									}
								}
							}else{
								shapeAddFlag = true;
							}
							
							fnSetColsDisapled(true);
							
							setTimeout(function(){
								if(shapeAddFlag) {
									KTCE.currentPaper.selectedShapeArray.push(obj);
								}
								KTCE.currentPaper.currentShape = null;
							}, 10);
						}
						
						selectedShapeArray[0].remove();
						$("g.dataGroup>g." + selectedShapeArray[0].node.id).remove();
						setTimeout(function() {
							fnSaveState();
						}, 1);
					}
				}
			}
			
			function setFreeTransform(groupingObj, shiftKey, mode) {
				var selectedShapeArray = KTCE.currentPaper.selectedShapeArray;
				if(shiftKey) {
				}else{
					deleteFreeTransform(groupingObj);
				}
				
				var obj = groupingObj;
				if(mode==='group') {
					fnSetFreeTransform(obj, mode);
				}else{
				}
				
				if(!shiftKey || KTCE.currentPaper.selectedShapeArray.length == 0) {
					KTCE.currentPaper.currentShape = groupingObj;
					KTCE.currentPaper.selectedShapeArray[0] = groupingObj;
				}else{
					if(KTCE.currentPaper.selectedShapeArray.length >= 1) {
						setTimeout(function(){
							KTCE.currentPaper.currentShape = null;
						}, 100)
					//	$(".col15Disabled").hide();
					}else{
					//	$(".col15Disabled").show();
					}
				}
				
				if(mode==='group') {
					obj.freeTransform.showHandles();
					obj.freeTransform.visibleHandles();
					obj.freeTransform.updateHandles();
					obj.data('hasHandle', true);
					
					//그룹핑객체 선택후 Path활성화(visible)에 따른 그룹핑객체 선택불가로 인한 이벤트 처리불가에 따른 Path 이벤트 처리
					var _el = Snap($(obj.freeTransform.bbox.node)[0]);
					_el.attr({'data-name': 'objectGroupPath', 'data-id': obj.attr('id')})
					_el.unmousedown(addMouseDownEvent);
					_el.mousedown(addMouseDownEvent);
					_el.unmouseup(addMouseUpEvent);
					_el.mouseup(addMouseUpEvent);
				
					$(obj.freeTransform.bbox.node).off().on({
						mousedown:function(e){
							e.stopPropagation();
							e.preventDefault();
						}
					});
				}
				
				setTimeout(function(){
					fnSaveState();
				}, 500);
			}
			
			function deleteFreeTransform(obj) {
				hideAllHandler(KTCE.currentPaper);	
				var selectedShapeArray = KTCE.currentPaper.selectedShapeArray;
				if(selectedShapeArray.length > 0  && selectedShapeArray != null) {
					for(var s=0; s < selectedShapeArray.length; s++ ){
						if(selectedShapeArray[s].freeTransform != null) {
							selectedShapeArray[s].freeTransform.visibleNoneHandles();
							selectedShapeArray[s].freeTransform.updateHandles();
							selectedShapeArray[s].data('hasHandle', false);
							selectedShapeArray[s].freeTransform = null;
						}
						//그룹객체 대상중 잠금적용된 객체 잠금삭제처리
						try{
							if(KTCE.currentPaper.lockObjWrap != undefined) {
								selectedShapeArray[s].data('objLock', false);
								$(selectedShapeArray[s].node).removeAttr('data-lock');
								KTCE.currentPaper.lockObjWrap.select("."+selectedShapeArray[s].node.id).remove();
							}
						}catch(e){}
					}
				}
				
				KTCE.currentPaper.selectedShapeArray = [];
				
			}
			
		}
		
		// 2020년 05월 배경이미지 url 검증 
		function validateImageUrl(node){
			var _imageUrl = node.attr("xlink:href");
			try {
				var img = new Image();
				img.crossOrigin = 'Anonymous';
				img.onload = function(){
					node.show();
				}
				img.onerror = function() {
					node.hide();
				}
				img.src = _imageUrl;
			}catch(err){
				node.hide();
			}
			
		}
		
		// 2020-05 배경이미지 show/hide
		function setPaperSVGBackGroundDisplay() {
			$(".paperFrame svg #svgBg").each(function(idx, el){
				if($(el).attr("xlink:href") !=""){
					var node = $(el);
					// 배경이미지 유효성 검증
					if(validateImageUrl(node)){
						$(el).show();
					}else{
						$(el).hide();
					}
				}else{
					$(el).hide();
				}
			});
		}
		
		
	} // end of KTCE.editor

	KTCE.editor = editor;
	
})();