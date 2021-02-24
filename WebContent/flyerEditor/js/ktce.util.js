/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : 편집기 각종 유틸
* 설명     : 편집기 함수에서 사용할 유틸 정의
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/
/*
 * KTCE util
 * @Class
 * @Description : KTCE 각종 유틸
 **/

/*
 * Snap 기능 추가
 *
 */

Snap.plugin(function (Snap, Element, Paper, glob) {
	var elproto = Element.prototype;
	elproto.prev = function () {
		var _prevItem = null
			, _this = this
			, _parent = this.parent()
			, _items = _parent.children()
			, _thisIdx = null

		_items.forEach(function(el, i) {
			el.attr('data-snapelement',i);
		});

		_thisIdx = parseInt(_this.attr('data-snapelement'));

		_items.forEach(function(el, i) {
			if ( _thisIdx-1 == i ) _prevItem = el;
		});

		return _prevItem;
	};
	elproto.next = function () {
		var _nextItem = null
			, _this = this
			, _parent = this.parent()
			, _items = _parent.children()
			, _thisIdx = null

		_items.forEach(function(el, i) {
			el.attr('data-snapelement',i);
		});

		_thisIdx = parseInt(_this.attr('data-snapelement'));

		_items.forEach(function(el, i) {
			if ( _thisIdx+1 == i ) _nextItem = el;
		});

		return _nextItem;
	};
});

// addTransform : transform 값을 override 하지 않고 현재 값에서 추가적으로 값을 더하여 적용함
Snap.plugin( function( Snap, Element, Paper, global ) {
	Element.prototype.addTransform = function( t ) {
		return this.transform( this.transform().localMatrix.toTransformString() + t );
	};
});

// show
Snap.plugin( function( Snap, Element, Paper, global ) {
	Element.prototype.show = function( t ) {
		return this.attr('display','block');
	};
});

// hide
Snap.plugin( function( Snap, Element, Paper, global ) {
	Element.prototype.hide = function( t ) {
		return this.attr('display','none');
	};
});

// 용지 높이값 얻기
/*

- 용지비율
- A5 : 148 X 210
- A4 : 210 X 297
- A3 : 297 X 420
- POST : 600 X 900
*/
function getPaperHeight(type, width) {
	var x,y, height;

	switch(type) {
		case 1 :
			x = 600;
			y = 900;
			break;
		case 3 :
			x = 297;
			y = 420;
			break;
		case 4 :
			x = 210;
			y = 297;
			break;
		case 5 :
			x = 148;
			y = 210;
		default :
	}

	height = (width*y)/x;

	return height;
}

function getPaperWidth(type, height) {
	var x,y, width;

	switch(type) {
		case 1 :
			x = 900;
			y = 600;
			break;
		case 3 :
			x = 420;
			y = 297;
			break;
		case 4 :
			x = 297;
			y = 210;
			break;
		case 5 :
			x = 210;
			y = 148;
		default :
	}

	width = (height*x)/y;

	return width;
}

function getXY(type, paperSize) {

	var x,y;

	switch(paperSize) {
		case 'PS' :
			x = 600;
			y = 900;
			break;
		case 'A3' :
			x = 297;
			y = 420;
			break;
		case 'A4' :
			x = 210;
			y = 297;
			break;
		case 'A5' :
			x = 148;
			y = 210;
		default :
	}

	return {
		x : x
		, y : y
	}
}

function getPaperSize(constNum, type, paperSize) {

	var x = getXY(type, paperSize).x
		, y = getXY(type, paperSize).y
		, width, height

	if ( type == 'HD' ) {
		width = constNum
		height = (width*y)/x
	} else if ( type == 'WD' ) {
		height = constNum
		width = (height*y)/x
	}

	return {
		width : width
		, height : height
	}
}

// 현재 paper의 정보를 출력
function printPaperInfo() {
	console.log('======= PaperInfo ========\n');
	var output = '';
	for ( var property in KTCE.paperInfo ) {
		//if ( property != 'frontContent' && property != 'backContent' ) {
		output += property + ' : ' + KTCE.paperInfo[property] +'\n';
		//}
	}
}

// 배열의 특정 순서까지의 합계를 구한다.
function getTotalToIndex(array, order) {
	var sum = 0;
	for ( var i=0; i<order+1; i++) {
		sum += array[i];
	}
	return sum;
}

// 현재 paper의 정보를 출력
function printObjectInfo(obj) {
	var output = '';

	for ( var property in obj ) {
		//if ( property != 'frontContent' && property != 'backContent' ) {
		output += property + ' : ' + KTCE.paperInfo[property] +'\n';
		//}
	}

	console.log(output);
}

// 로딩이 모두 끝남
function pageLoadEnd() {
	setTimeout(function() {
		$('.dimmLoader').fadeOut(150);
	}, 500);
}

// 전단지명 validate
function fnNameValidate(obj, callback) {

	var val = $(obj).val().trim();

	if ( val.length < 2 || val.length >= 40 ) {
		if ( callback != undefined && typeof callback == 'function' ) {
			callback(false);
		}
	} else {
		if ( callback != undefined && typeof callback == 'function' ) {
			callback(true);
		}
	}

}

// url에서 파라미터 값을 반환
function fnGetURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++)
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam)
		{
			return sParameterName[1];
		}
	}
}

// SVG to PNG
(function() {
    var out$ = typeof exports != 'undefined' && exports || this;

    out$.svgAsPngUri = function(el, options, cb) {
    	var svg = el;		
		var data = (new XMLSerializer()).serializeToString(svg);
		var canvas = $('<canvas id="canvas" width="'
					+ $(data).attr("width")
					+ '" height="'
					+ $(data).attr("height")
					+ '"></canvas>').appendTo('body');
		canvg(canvas[0], data, {useCORS : true, renderCallback : function(){
			var imgURI = canvas[0].toDataURL('image/png');
			cb(imgURI);
		}});
    }

    out$.saveSvgAsPng = function(el, name, options) {
        options = options || {};
        out$.svgAsPngUri(el, options, function(uri) {
            var a = document.createElement('a');
            a.download = name;
            a.href = uri;
            document.body.appendChild(a);
			a.target = '_blank';
            a.addEventListener("click", function(e) {
                a.parentNode.removeChild(a);
            });
            a.click();
        });
    }
})();

// jquery 기능 추가
// outerHTML
(function ($) {
  var jdiv = $('<div>'), div = jdiv.get(0);

  var getter = ('outerHTML' in div) ?
    // native support
    function(){ return this.get(0).outerHTML; } :

    // no native support
    function(){ return jdiv.html(this.first().clone()).html(); };

  $.fn.outerHTML = function(){
    return arguments.length ?
      this.replaceWith.apply(this, arguments) :
      getter.call(this);
  };

}(jQuery));

// hasAttr
(function ($) {
	$.fn.hasAttr = function(name) {
		try {
			return this.attr(name) !== undefined;
		} catch(e) {
			console.log('[Error Message] : ' + e.message);
		}
	};
}(jQuery));

/*
	로컬 이미지 미리보기
	usage :

	var opt = {
		img: $('#img_preview'),
		w: 200,
		h: 200
	};

	$('#input_file').setPreview(opt);
*/
(function() {
	$.fn.setPreview = function(opt){
		"use strict"
		var defaultOpt = {
			inputFile: $(this),
			img: null,
			w: 200,
			h: 200
		};
		$.extend(defaultOpt, opt);

		var previewImage = function(){
			if (!defaultOpt.inputFile || !defaultOpt.img) return;

			var inputFile = defaultOpt.inputFile.get(0);
			var img       = defaultOpt.img.get(0);

			// FileReader
			if (window.FileReader) {
				// image 파일만
				if (!inputFile.files[0].type.match(/image\//)) return;

				// preview
				try {
					var reader = new FileReader();
					reader.onload = function(e){
						img.src = e.target.result;
						//img.style.width  = defaultOpt.w+'px';
						//img.style.height = defaultOpt.h+'px';
						img.style.display = '';
					}
					reader.readAsDataURL(inputFile.files[0]);
				} catch (e) {
					// exception...
				}
			// img.filters (MSIE)
			} else if (img.filters) {
				inputFile.select();
				inputFile.blur();
				var imgSrc = document.selection.createRange().text;

				img.style.width  = defaultOpt.w+'px';
				img.style.height = defaultOpt.h+'px';
				img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enable='true',sizingMethod='scale',src=\""+imgSrc+"\")";
				img.style.display = '';
			// no support
			} else {
				// Safari5, ...
			}
		};

		// onchange
		$(this).change(function(){
			previewImage();
		});
	};
})();

/*
 * KTCE.util.select
 * @Function
 * @Description : 디자인 셀렉트 기능
 **/
(function() {
	var select = function(opts) {

		try {

			var options = {
					target : opts.target
					, duration : 0
					, scrollInit : opts.scrollInit ? opts.scrollInit : false
					, control : $(opts.target).hasAttr('data-control') ? true : false
					, addClass : opts.addClass == undefined ? '' : opts.addClass
					, upScroll : opts.upScroll == undefined ? true : opts.upScroll
				}

			$(options.target).each(function(originIndex) {

				var origin = $(this);

				// remove if module exist
				if ( origin.prev('.uiDesignSelect-wrap').length ) origin.prev('.uiDesignSelect-wrap').remove();

				var originOption = origin.find('option')
					, originDisplay = origin.attr('data-display') ? origin.attr('data-display') : 'inline-block'
					, originDisabled = origin.hasAttr('disabled') ? true : false
					, originWidth = origin.attr('data-width') ? parseInt(origin.attr('data-width'), 10) : null
					, originSelected = originOption.filter(':selected')
					, currentIdx = originSelected.index()
					, select = $('<div class="uiDesignSelect-wrap uiDesignSelect' + (originIndex+1) + ' ' + opts.addClass + '"></div>')
					, optionListWrap = $('<div class="uiDesignSelect-optionList"></div>').appendTo(select)
					, optionList = $('<div class="uiDesignSelect-ul"></div>').appendTo(optionListWrap);
					
					originSelected = origin.find("option[selected='selected']");//.val();
					if( originSelected.html() == undefined) {
						originSelected = originOption.filter(':selected');
					}
					currentIdx = originSelected.index();
					
				if ( options.control ) {

					var selected = $('<strong class="uiDesignSelect-selected"><button type="button" class="uiDesignSelect-prev"></button><a href="#" class="uiDesignSelect-trigger"><span class="uiDesignSelect-text">' + originSelected.html() + '</span><i class="uiDesignSelect-ico"></i></a><button type="button" class="uiDesignSelect-next"></button></strong>').prependTo(select)
						, btnPrev = selected.find('.uiDesignSelect-prev')
						, btnNext = selected.find('.uiDesignSelect-next');

				} else {
					//원본 2017-08-22 이전
					//var selected = $('<strong class="uiDesignSelect-selected"><a href="#" class="uiDesignSelect-trigger"><span class="uiDesignSelect-text">' + originSelected.html() + '</span><i class="uiDesignSelect-ico"></i></a></strong>').prependTo(select)
					
					//2017-08-22 : font size 직접입력추가
					if(originIndex==1) {
						var browserType = getBrowserType();
						if(browserType.indexOf('msie') > -1){   
							var sizeInput = '<input type="number" name="numberSize" class="numberSize" size="3" maxlength="3" min="1" max="600" style="position: absolute;top: 0;left: 0; display: inline-block; width: 100%; height: inherit; margin: 0; padding: 0px 16px 0px 0px; border: none; border-image: none; text-align: right; font-weight: 400; vertical-align: middle; background-color: #ffffff; IME-MODE:disabled;" value="' + originSelected.html() + '" />';
						}else{
							var sizeInput = '<input type="number" name="numberSize" class="numberSize" size="3" maxlength="3" min="1" max="600" style="position: absolute;top: 0;left: 0; display: inline-block; width: 100%; height: inherit; margin: 0; padding: 0px 2px 0px 0px; border: none; border-image: none; text-align: right; font-weight: 400; vertical-align: middle; background-color: #ffffff; IME-MODE:disabled;" value="' + originSelected.html() + '" />';
						}
						var selected = $('<strong class="uiDesignSelect-selected"><a class="uiDesignSelect-trigger"><span class="uiDesignSelect-text">' + originSelected.html() + '</span>' + sizeInput + '<i class="uiDesignSelect-ico"></i></a></strong>').prependTo(select)
					}else{
						var selected = $('<strong class="uiDesignSelect-selected"><a href="#" class="uiDesignSelect-trigger"><span class="uiDesignSelect-text">' + originSelected.html() + '</span><i class="uiDesignSelect-ico"></i></a></strong>').prependTo(select)
					}
				}

				if ( originDisabled ) {
					select.addClass('disabled');
				}

				select.css({
					'zIndex' : 30-originIndex
					, 'display' : originDisplay
				});

				origin.addClass('uiOriginSelect uiOriginSelect'+(originIndex+1));
				originOption.each(function(i) {
					var thisHTML = $(this).html();
					$('<div class="uiDesignSelect-li"><a href="#" class="uiDesignSelect-listTrigger">' + thisHTML + '</a></div>').appendTo(optionList);
				});

				select.insertBefore(origin);

				optionListWrap.show().css('position','relative');

				// set Var
				var selectTrigger = selected.find('.uiDesignSelect-trigger')
					, selectedTriggerText = selectTrigger.find('.uiDesignSelect-text')
					, selectedIco = selectTrigger.find('.uiDesignSelect-ico')
					, optionLI = optionListWrap.find('.uiDesignSelect-li')
					, optionTrigger = optionList.find('.uiDesignSelect-listTrigger')
					, optionListWrapHeight = optionListWrap.outerHeight(true)
					, optionListWrapWidth = optionListWrap.outerWidth(true) + selectedIco.width();

				if ( originWidth != null ) {
					optionListWrapWidth = originWidth;

				} else {
					optionsListWrapWidth = selectTrigger.width() - 2;
				}

				optionListWrap.width(optionListWrapWidth);

				// scroll Init
				if ( options.scrollInit ) {
					optionListWrap.mCustomScrollbar({
						theme : 'dark'
						//, autoHideScrollbar : true
						, scrollInteria : 200
					});
				}

				optionTrigger.css({
					width : optionListWrapWidth - 2
				});
				selected.css({
					width : optionListWrapWidth + parseInt(selectTrigger.css('border-left-width')) + parseInt(selectTrigger.css('border-right-width'))
				});

				optionTrigger.eq(currentIdx).addClass('uiSelect-active');

				// check slideUp or slideDown
				if ( options.upScroll ) checkUpDown();

				// height to 0
				optionListWrap.height(0).css('position','absolute');

				// binding
				if ( !originDisabled ) {
					selectTrigger.on({
						click : function() {
							if ( optionListWrap.hasClass('uiSelect-state-open') ) {
								_hide();
							} else {
								_allHide();
								_show();
							}
							return false;
						}
					});
				}

				if ( options.control ) {
					btnPrev.on({
						click : function() {
							currentIdx -= 1;
							if ( currentIdx < 0 ) currentIdx = optionTrigger.length - 1;

							selectedTriggerText.text(optionTrigger.eq(currentIdx).html());
							_update();
						}
					});

					btnNext.on({
						click : function() {
							currentIdx += 1;
							if ( currentIdx >= optionTrigger.length ) currentIdx = 0;

							selectedTriggerText.text(optionTrigger.eq(currentIdx).html());
							_update();
						}
					});
				}

				optionTrigger.each(function(i) {
					$(this).on({
						click : function() {
							var _this = $(this)
								, thisText = _this.html();

							setTimeout(function() {
								selectedTriggerText.text(thisText);
								
								//2017-08-22 : input box font size 직접입력값 조절
								select.find("input.numberSize").val(thisText);
							}, (options.duration*1000)/2);

							currentIdx = i;

							_hide();
							_update();

							return false;
						}
						, change : function() {
							var _this = $(this)
								, thisText = _this.html();

							selectedTriggerText.text(thisText);
							currentIdx = i;

							optionTrigger.removeClass('uiSelect-active');
							optionTrigger.eq(currentIdx).addClass('uiSelect-active');
						}
					});
				});

				$(document).on({
					'click.uiSelect' : function() {

						var e = e || window.event
							, target = $(e.target);

						if ( !target.parents('.uiDesignSelect-wrap').length ) {
							_hide();
						}
					}
				});

				// check slideUp or slideDown
				function checkUpDown() {
					var bodyHeight = $('body').height()
						, posY = select.offset().top
						, selectHeight = select.height() + optionListWrap.height() + 20;

					if ( bodyHeight < posY + selectHeight ) {
						select.addClass('upSlide');
					}
				}

				// show optionList
				function _show() {
					optionListWrap.stop().animate({
						height : optionListWrapHeight
					}, options.duration*1000);
					optionListWrap.addClass('uiSelect-state-open');
					selected.addClass('uiSelect-state-open');
				}

				// other select hide
				function _allHide() {
					var otherSelect = $('.uiDesignSelect-wrap').not(select);

					otherSelect.each(function() {
						var thisList = $(this).find('.uiDesignSelect-optionList')
							, thisSelected = $(this).find('.uiDesignSelect-selected');

						thisList.stop().animate({
							height : 0
						}, options.duration*1000, function() {
							//thisList.hide();
						});
						thisSelected.removeClass('uiSelect-state-open');
						thisList.removeClass('uiSelect-state-open');
					});
				}

				// hide optionList
				function _hide() {
					optionListWrap.stop().animate({
						height : 0
					}, options.duration*1000, function() {
						//optionListWrap.hide();
					});
					optionListWrap.removeClass('uiSelect-state-open');
					selected.removeClass('uiSelect-state-open');
				}

				// update to Origin
				function _update() {
					optionTrigger.removeClass('uiSelect-active');
					optionTrigger.eq(currentIdx).addClass('uiSelect-active');
					originOption.removeAttr('selected');
					originOption.eq(currentIdx).attr('selected','selected');
					origin.change();
				}
				
				//2017-08-22 : font size 직접입력추가
				var inputBox = select.find('input.numberSize');
				inputBox.on({
					'keydown keyup': function(event) {
						if(event.type == 'keydown') {
							KTCE.inputFontSizeFocus = true;
						}else if(event.type == 'keyup') {
							KTCE.inputFontSizeFocus = false;
						}
						
					    var inputString = this.value;
					    if(event.keyCode === 13) {
					    	$("#temp_textarea").focusout();
					    	
					    	if(KTCE.paperInfo.hwYn == 'N') {					//일반
					    		if(inputString < 6) {
						    		alert('최소 6 이상을 입력해 주세요!!!');
						    		this.value = 6;
						    		return false;
						    	}else if(inputString > 600){
						    		alert('초대 입력 값은 600을 넘을 수 없습니다.');
						    		this.value = 600;
						    		return false;
						    	}
					    	}else{												// 한글자
					    		if(inputString < 10) {
						    		alert('최소 10 이상을 입력해 주세요!!!');
						    		this.value = 10;
						    		return false;
						    	}else if(inputString > 900){
						    		alert('초대 입력 값은 900을 넘을 수 없습니다.');
						    		this.value = 900;
						    		return false;
						    	}
					    	}
					    	
					    	var obj = KTCE.currentPaper.currentShape;
					    	
					    	_hide();
					    	
					    	inputBox.hide();
					    	inputBox.show();
				    		$("#temp_textarea").hide();
				    		$("#temp_textarea").show();
				    		
					    	setTimeout(function(){
					    		if(obj != null) {
					    			if(obj.hasClass('textBoxWrap')) {
					    				KTCE.clearTextMode(obj);
					    				KTCE.fontSize(obj, inputString + 'pt');
					    			}else if( obj.hasClass( 'xTable' ) ) {
					    				KTCE.clearTableInputMode(obj);
					    				KTCE.cellfontSize(obj, inputString);
					    			}
					    			
					    		}else{
					    			$(KTCE.currentPaper.selectedShapeArray).each(function(idx, el) {
				    					if(el.hasClass('textBoxWrap')) {
				    						KTCE.clearTextMode(el);
				    						KTCE.fontSize(el, inputString + 'pt');
				    					}else if(el.hasClass( 'xTable' )) {
				    						KTCE.clearTableInputMode(el);
				    						KTCE.cellfontSize(el, inputString);
				    					}
									});
					    		}
					    		
					    		inputBox.prev().html(inputString);
					    		
							    $("#temp_textarea").focus();
						    	optionTrigger.removeClass('uiSelect-active');
						    	
						    	for(var cIdx=0; cIdx < optionTrigger.length; cIdx++) {
						    		var el = optionTrigger.eq(cIdx);
						    		if(el.html() == inputString) {
						    			el.addClass('uiSelect-active');
						    			break;
						    		}
						    	}
						    	
						    	KTCE.inputFontSizeFocus = false;
						    	
					    	}, 100);
					    	return false;
					    }else{
					    	if(event.keyCode == 16) {	//shift
					    		
					    	}else if( !(event.keyCode >= 37 && event.keyCode <= 40) && event.keyCode != 8 && event.keyCode < 45 || event.keyCode > 57 && event.keyCode < 96 || event.keyCode > 105) {
						        var string = inputString.substring(0, inputString.length);
						        if(event.type == 'keydown') {
						        	alert('숫자만 입력해 주세요!!!');
						        }
						        setTimeout(function() {
						            this.value = string;
						            this.onfocusin = "true";
						        }, 10)
						
						        return false;
						    }
					    }
					}
				});
				
			});

		} catch(e) {
			console.log('[Error Message] : ' + e.message);
		}

	}
	KTCE.util.select = select;
})();

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['snap'], function(Snap) {
			return factory(Snap || root.Snap);
		});
	} else {
		factory(Snap);
	}
}(this, function(Snap) {

	// toFront(), toBack() 메서드를 Snap에 추가
	Snap.plugin(function(Snap, Element, Paper, glob) {
		var elproto = Element.prototype;
		elproto.toFront = function() {
			this.appendTo(this.paper);
			return this;

		};
		elproto.toBack = function() {
			this.prependTo(this.paper);
			return this;
		};
	});

	// freeTransform 기능
	Snap.plugin(function(Snap, Element, Paper, glob) {
		var freeTransform = function(subject, options, callback) {

			// 메서드 채이닝용 명령
			if (subject.freeTransform) {
				return subject.freeTransform;
			}

			var paper = subject.paper,
				bbox = subject.getBBox(true);

			var ft = subject.freeTransform = {
				attrs: {
					x: bbox.x,
					y: bbox.y,
					size: {
						x: bbox.width,
						y: bbox.height
					},
					center: {
						x: bbox.cx,
						y: bbox.cy
					},
					rotate: 0,
					scale: {
						x: 1,
						y: 1
					},
					translate: {
						x: 0,
						y: 0
					},
					ratio: 1
				},
				axes: null,
				bbox: null,
				callback: null,
				items: [],
				handles: {
					center: null,
					x: null,
					y: null
				},
				offset: {
					rotate: 0,
					scale: {
						x: 1,
						y: 1
					},
					translate: {
						x: 0,
						y: 0
					}
				},
				opts: {
					animate: false,
					attrs: {
						fill: '#b3b3b3',
						stroke: '#333'
					},
					bboxAttrs: {
						fill: 'none',
						stroke: '#666',
						'stroke-dasharray': '1, 0',  
						//'stroke-dasharray': '0, 0',
						opacity: 0.5
					},
					axesAttrs: {
						fill: 'none',
						stroke: 'none',
						'stroke-dasharray': '0, 0',
						opacity: 0,
						display : 'none'
					},
					discAttrs: {
						fill: '#717171',
						stroke: '#999'
					},
					boundary: {
						x: paper._left || 0,
						y: paper._top || 0,
						width: null,
						height: null
					},
					distance: 1.3,
					drag: true,
					draw: false,
					keepRatio: false,
					range: {
						rotate: [-180, 180],
						scale: [-99999, 99999]
					},
					rotate: true,
					scale: true,
					snap: {
						rotate: 0,
						scale: 0,
						drag: 0
					},
					snapDist: {
						rotate: 0,
						scale: 0,
						drag: 7
					},
					size: 4,
					bodyCursor: 'auto',
					cornerCursors: ['', '', '', ''],
					sideCursors: ['', '', '', ''],
					table : false,
					textBoxFlag : false,
					textWrap : null,
					textBox : null
				},
				subject: subject
				, selfDrag : null
			};

			/**
			 * shift키 눌렸을 때
			 */
			$(document).on({
				'keydown.freeTransform': function(e) {
					if (e.shiftKey) {
						ft.opts.keepRatio = ['axis', 'bboxCorners', 'bboxSides'];
					}
				},
				'keyup.freeTransform': function(e) {
					if(ft.subject.type == "image"){
						ft.opts.keepRatio = ['axis', 'bboxCorners', 'bboxSides'];
					} else if(ft.subject.type == "g"){
						if(ft.subject.hasClass('textBoxWrap')){
							ft.opts.keepRatio = ['axis', 'bboxCorners', 'bboxSides'];
						} else {
							ft.opts.keepRatio = [];
						}
					} else{
						ft.opts.keepRatio = [];
					}
				}
			});

			/**
			 * 오브젝트의 transform 상태를 파악하여 value를 업데이트한다.
			 */
			ft.updateHandles = function() {
				if (ft.handles.bbox || ft.opts.rotate.indexOf('self') >= 0) {
					var corners = getBBox();
				}

				// rotation 값
				var rad = {
					x: (ft.attrs.rotate) * Math.PI / 180,
					y: (ft.attrs.rotate + 270) * Math.PI / 180
				};

				var radius = {
					x: ft.attrs.size.x / 2 * ft.attrs.scale.x,
					y: ft.attrs.size.y / 2 * ft.attrs.scale.y
				};

				ft.axes.map(function(axis) {
					if (ft.handles[axis]) {

						var cx = ft.attrs.center.x + ft.attrs.translate.x + radius[axis] * ft.opts.distance * Math.cos(rad[axis]),
							cy = ft.attrs.center.y + ft.attrs.translate.y + radius[axis] * ft.opts.distance * Math.sin(rad[axis]);

						// boundary가 있을 때
						if (ft.opts.boundary) {
							cx = Math.max(Math.min(cx, ft.opts.boundary.x + (ft.opts.boundary.width || getPaperSize().x)), ft.opts.boundary.x);
							cy = Math.max(Math.min(cy, ft.opts.boundary.y + (ft.opts.boundary.height || getPaperSize().y)), ft.opts.boundary.y);
						}

						ft.handles[axis].disc.attr({
							'cx': cx,
							'cy': cy
						});

						ft.handles[axis].line.toFront().attr({
							path: [
								['M', ft.attrs.center.x + ft.attrs.translate.x, ft.attrs.center.y + ft.attrs.translate.y],
								['L', ft.handles[axis].disc.attr('cx'), ft.handles[axis].disc.attr('cy')]
							]
						});

						ft.handles[axis].disc.toFront();
					}
				});

				// bbox 설정되어 있을 때
				if (ft.bbox) {

					// 드래그를 위해 전체 컨트롤 박스를 가장 위로 올린다.
					ft.bbox.toFront().attr({
						path: [
							['M', corners[0].x, corners[0].y],
							['L', corners[1].x, corners[1].y],
							['L', corners[2].x, corners[2].y],
							['L', corners[3].x, corners[3].y],
							['L', corners[0].x, corners[0].y]
						]
					});

					// bbox 핸들러에 x,y 크기 조정 방향 설정
					var bboxHandleDirection = [
						[-1, -1],
						[1, -1],
						[1, 1],
						[-1, 1],
						[0, -1],
						[1, 0],
						[0, 1],
						[-1, 0]
					];

					if (ft.handles.bbox) {
						ft.handles.bbox.map(function(handle, i) {
							var cx, cy, j, k;

							if (handle.isCorner) {
								cx = corners[i].x;
								cy = corners[i].y;
							} else {
								j = i % 4;
								k = (j + 1) % corners.length;
								cx = (corners[j].x + corners[k].x) / 2;
								cy = (corners[j].y + corners[k].y) / 2;
							}

							handle.element.toFront()
								.attr({
									x: cx - (handle.isCorner ? ft.opts.size.bboxCorners : ft.opts.size.bboxSides),
									y: cy - (handle.isCorner ? ft.opts.size.bboxCorners : ft.opts.size.bboxSides)
								})
								.transform('R' + ft.attrs.rotate);

							handle.x = bboxHandleDirection[i][0];
							handle.y = bboxHandleDirection[i][1];
						});
					}
				}

				// 외곽 써클 라인이 설정되어 있을 때
				if (ft.circle) {
					ft.circle.attr({
						cx: ft.attrs.center.x + ft.attrs.translate.x,
						cy: ft.attrs.center.y + ft.attrs.translate.y,
						r: Math.max(radius.x, radius.y) * ft.opts.distance
					});
				}

				// 오브젝트 중앙에 드래그용 써클이 설정되어 있을 때
				if (ft.handles.center) {
					ft.handles.center.disc.toFront().attr({
						cx: ft.attrs.center.x + ft.attrs.translate.x,
						cy: ft.attrs.center.y + ft.attrs.translate.y
					});
				}

				// 로테이션이 오브젝트 자기 자신에도 설정되어 있을 때
				if (ft.opts.rotate.indexOf('self') >= 0) {
					radius = Math.max(
						Math.sqrt(Math.pow(corners[1].x - corners[0].x, 2) + Math.pow(corners[1].y - corners[0].y, 2)),
						Math.sqrt(Math.pow(corners[2].x - corners[1].x, 2) + Math.pow(corners[2].y - corners[1].y, 2))
					) / 2;
				}

				return ft;
			};

			/**
			 * 오브젝트에 컨트롤용 핸들러를 생성
			 */
			ft.showHandles = function() {
				ft.hideHandles();

				ft.axes.map(function(axis) {
					ft.handles[axis] = {};

					ft.handles[axis].line = paper
						.path([
							['M', ft.attrs.center.x, ft.attrs.center.y]
						])
						.attr(ft.opts.axesAttrs);

					ft.handles[axis].disc = paper
						.circle(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size.axes)
						.attr(ft.opts.attrs);
				});

				if (ft.opts.draw.indexOf('bbox') >= 0) {
					ft.bbox = paper
						.path('')
						.attr(ft.opts.bboxAttrs)

					ft.handles.bbox = [];

					var i, handle, cursor;

					for (i = (ft.opts.scale.indexOf('bboxCorners') >= 0 ? 0 : 4); i < (ft.opts.scale.indexOf('bboxSides') === -1 ? 4 : 8); i++) {
						handle = {};

						handle.axis = i % 2 ? 'x' : 'y';
						handle.isCorner = i < 4;

						cursor = (handle.isCorner) ? ft.opts.cornerCursors[i] : ft.opts.sideCursors[i - 4];

						handle.element = paper
							.rect(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides'] * 2, ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides'] * 2)
							.attr(ft.opts.attrs)
							.attr('cursor', cursor);

						ft.handles.bbox[i] = handle;
					}
				}

				if (ft.opts.draw.indexOf('circle') !== -1) {
					ft.circle = paper
						.circle(0, 0, 0)
						.attr(ft.opts.bboxAttrs);
				}

				if (ft.opts.drag.indexOf('center') !== -1) {
					ft.handles.center = {};

					ft.handles.center.disc = paper
						.circle(ft.attrs.center.x, ft.attrs.center.y, ft.opts.size.center)
						.attr(ft.opts.attrs);
				}

				// x,y축 핸들러 생성
				ft.axes.map(function(axis) {
					if (!ft.handles[axis]) {
						return;
					}

					var rotate = ft.opts.rotate.indexOf('axis' + axis.toUpperCase()) !== -1,
						scale = ft.opts.scale.indexOf('axis' + axis.toUpperCase()) !== -1;

					var _dragMove = function(dx, dy) {
						
						if(ft.isLock(ft.subject)) {	//잠금상태 체크
							//console.log('객체 잠금상태입니다!!!!')
							return;
						}
						
						// 전체 박스가 스케일 조정이 되어 있을 때
						if (ft.o.viewBoxRatio) {
							dx *= ft.o.viewBoxRatio.x;
							dy *= ft.o.viewBoxRatio.y;
						}

						var cx = dx + parseInt(ft.handles[axis].disc.ox, 10),
							cy = dy + parseInt(ft.handles[axis].disc.oy, 10);

						var mirrored = {
							x: ft.o.scale.x < 0,
							y: ft.o.scale.y < 0
						};

						if (rotate) {
							var rad = Math.atan2(cy - ft.o.center.y - ft.o.translate.y, cx - ft.o.center.x - ft.o.translate.x);

							ft.attrs.rotate = rad * 180 / Math.PI - (axis === 'y' ? 270 : 0);

							if (mirrored[axis]) {
								ft.attrs.rotate -= 180;
							}
						}

						// 최대 제한선에서 핸들러가 넘어가지 않도록 함
						if (ft.opts.boundary) {
							cx = Math.max(Math.min(cx, ft.opts.boundary.x + (ft.opts.boundary.width || getPaperSize().x)), ft.opts.boundary.x);
							cy = Math.max(Math.min(cy, ft.opts.boundary.y + (ft.opts.boundary.height || getPaperSize().y)), ft.opts.boundary.y);
						}

						var radius = Math.sqrt(Math.pow(cx - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(cy - ft.o.center.y - ft.o.translate.y, 2));

						if (scale) {
							ft.attrs.scale[axis] = radius / (ft.o.size[axis] / 2 * ft.opts.distance);

							if (mirrored[axis]) {
								ft.attrs.scale[axis] *= -1;
							}
						}

						applyLimits();

						// 비율 유지 설정되어 있을 때
						if (ft.opts.keepRatio.indexOf('axis' + axis.toUpperCase()) !== -1) {
							keepRatio(axis);
						} else {
							ft.attrs.ratio = ft.attrs.scale.x / ft.attrs.scale.y;
						}

						if (ft.attrs.scale.x && ft.attrs.scale.y) {
							ft.apply();
						}

						asyncCallback([rotate ? 'rotate' : null, scale ? 'scale' : null]);
					}
					var _dragStart = function() {

						// offset 위치값
						ft.o = cloneObj(ft.attrs);

						if (paper._viewBox) {
							ft.o.viewBoxRatio = {
								x: paper._viewBox[2] / getPaperSize().x,
								y: paper._viewBox[3] / getPaperSize().y
							};
						}

						ft.handles[axis].disc.ox = parseInt(this.attr('cx'), 10);
						ft.handles[axis].disc.oy = parseInt(this.attr('cy'), 10);

						asyncCallback([rotate ? 'rotate start' : null, scale ? 'scale start' : null]);
					}
					var _dragEnd = function() {
						asyncCallback([rotate ? 'rotate end' : null, scale ? 'scale end' : null]);

						// 상태 저장
						KTCE.saveState();
					}

					ft.handles[axis].disc.attr(ft.opts.discAttrs)
					ft.handles[axis].disc.drag(_dragMove, _dragStart, _dragEnd);
				});

				// bbox 핸들러 드래그 바인딩
				if (ft.opts.draw.indexOf('bbox') >= 0 && (ft.opts.scale.indexOf('bboxCorners') !== -1 || ft.opts.scale.indexOf('bboxSides') !== -1)) {
					if($(ft.subject.node).not('.hasDataGroup').find('text.textBox').length == 0){	// grouping내 텍스트는 제외 및 selector 버그 개선
						ft.handles.bbox.map(function(handle) {
							var pDx = ft.attrs.scale.x, pDy = ft.attrs.scale.y;
							var _dragMove = function(dx, dy) {
								KTCE.currentPaper.shapeDragState = 'mousescalemove';
								
								if(ft.isLock(ft.subject)) {	//잠금상태 체크
									//console.log('객체 잠금상태입니다!!!!')
									return;
								}
								
								if($(ft.subject.node).attr("data-name") == "xTable"){
	
									//multi 선택 후 표 드래그시 에러 방지
									if(KTCE.currentPaper.currentShape == null) return;
	
									var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));
									var _tableArray = KTCE.currentPaper.tableArray[_tableNumber];
									
									if(pDx > ft.attrs.scale.x || pDy > ft.attrs.scale.y){
										var chkValue = true;
										var direction = {
											x : (pDx == ft.attrs.scale.x),
											y : (pDy == ft.attrs.scale.y)
										}									
										for(var i=0; i< _tableArray.cellHoverArray.length; i++){
											var tCell = _tableArray.cellHoverArray[i];
											if(!KTCE.checkTextToCell(tCell, _tableArray, direction)){
												chkValue = false;
												break;
											}
										}
										
										if(!chkValue) return;
									}
									
									//실시간 표내 텍스트 위치 반영
									//var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));
									for(var y=0; y< _tableArray.tableY; y++){
										for(var x=0; x< _tableArray.tableX; x++){
											var textWrapper = _tableArray.cellTextArray[y][x];
											if(textWrapper != undefined) {
												$(textWrapper.node).css('opacity', 0);
											}
										}
									}
								}
	//							pDx = dx;
	//							pDy = dy;
								// viewBox might be scaled
								if (ft.o.viewBoxRatio) {
									dx *= ft.o.viewBoxRatio.x;
									dy *= ft.o.viewBoxRatio.y;
								}
	
								var sin, cos, rx, ry, rdx, rdy, mx, my, sx, sy,
									previous = cloneObj(ft.attrs);
	
								sin = ft.o.rotate.sin;
								cos = ft.o.rotate.cos;
	
								// First rotate dx, dy to element alignment
								rx = dx * cos - dy * sin;
								ry = dx * sin + dy * cos;
	
								rx *= Math.abs(handle.x);
								ry *= Math.abs(handle.y);
	
								// And finally rotate back to canvas alignment
								rdx = rx * cos + ry * sin;
								rdy = rx * -sin + ry * cos;
	
								ft.attrs.translate = {
									x: ft.o.translate.x + rdx / 2,
									y: ft.o.translate.y + rdy / 2
								};
	
								// Mouse position, relative to element center after translation
								mx = ft.o.handlePos.cx + dx - ft.attrs.center.x - ft.attrs.translate.x;
								my = ft.o.handlePos.cy + dy - ft.attrs.center.y - ft.attrs.translate.y;
	
								// Position rotated to align with element
								rx = mx * cos - my * sin;
								ry = mx * sin + my * cos;
	
								// Maintain aspect ratio
								if (handle.isCorner && ft.opts.keepRatio.indexOf('bboxCorners') !== -1) {
									var
										ratio = (ft.attrs.size.x * ft.attrs.scale.x) / (ft.attrs.size.y * ft.attrs.scale.y),
										tdy = rx * handle.x * (1 / ratio),
										tdx = ry * handle.y * ratio;
	
									if (tdx > tdy * ratio) {
										rx = tdx * handle.x;
									} else {
										ry = tdy * handle.y;
									}
								}
	
								// Scale element so that handle is at mouse position
								sx = rx * 2 * handle.x / ft.o.size.x;
								sy = ry * 2 * handle.y / ft.o.size.y;
	
								ft.attrs.scale = {
									x: sx || ft.attrs.scale.x,
									y: sy || ft.attrs.scale.y
								};
	
	
								// Check boundaries
								if (!isWithinBoundaries().x || !isWithinBoundaries().y) {
									ft.attrs = previous;
								}
	
								applyLimits();
	
								// Maintain aspect ratio
								if ((handle.isCorner && ft.opts.keepRatio.indexOf('bboxCorners') !== -1) || (!handle.isCorner && ft.opts.keepRatio.indexOf('bboxSides') !== -1)) {
									keepRatio(handle.axis);
	
									var trans = {
										x: (ft.attrs.scale.x - ft.o.scale.x) * ft.o.size.x * handle.x,
										y: (ft.attrs.scale.y - ft.o.scale.y) * ft.o.size.y * handle.y
									};
	
									rx = trans.x * cos + trans.y * sin;
									ry = -trans.x * sin + trans.y * cos;
	
									ft.attrs.translate.x = ft.o.translate.x + rx / 2;
									ft.attrs.translate.y = ft.o.translate.y + ry / 2;
								}
	
								ft.attrs.ratio = ft.attrs.scale.x / ft.attrs.scale.y;
	
								asyncCallback(['scale']);
	
								ft.apply();
	
							}
							var _dragStart = function(dx, dy, e) {
								KTCE.currentPaper.shapeDragState = 'mousescalestart';	
								
								$(".contextMenuEditBoxWrap").hide();
								
								var rotate = ((360 - ft.attrs.rotate) % 360) / 180 * Math.PI,
									handlePos = {
										x: parseInt(handle.element.attr('x'), 10),
										y: parseInt(handle.element.attr('y'), 10)
									};
								
								// Offset values
								ft.o = cloneObj(ft.attrs);
								
								//--------------------> 2016-04-29 IE11 텍스트 박스 scale 확대 안되게.. BY HS
								if ( ft.subject.hasClass('textBoxWrap') ) {
									ft.o.handlePos = {};
								}else if ( ft.subject.hasClass('hasDataGroup') ) { 	//그룹핑 scale
									ft.opts.keepRatio = ['bbox', 'bboxCorners', 'bboxSides'];
									
									ft.o.handlePos = {
										cx: handlePos.x + ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides'],
										cy: handlePos.y + ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides']
									};
								}else {
									ft.o.handlePos = {
										cx: handlePos.x + ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides'],
										cy: handlePos.y + ft.opts.size[handle.isCorner ? 'bboxCorners' : 'bboxSides']
									};									
								}
								
								// Pre-compute rotation sin & cos for efficiency
								ft.o.rotate = {
									sin: Math.sin(rotate),
									cos: Math.cos(rotate)
								};
	
								if (paper._viewBox) {
									ft.o.viewBoxRatio = {
										x: paper._viewBox[2] / getPaperSize().x,
										y: paper._viewBox[3] / getPaperSize().y
									};
								}
	
								// store current body cursor; @see _dragEnd()
								//ft.opts.bodyCursor = window.getComputedStyle(document.body).cursor;
	
								// make body inherit cursor in case pointer strays while dragging
								document.body.style.cursor = handle.element.attr('cursor');
	
								asyncCallback(['scale start']);
								pDx = ft.attrs.scale.x, pDy = ft.attrs.scale.y;
							}
							var _dragEnd = function() {	
								KTCE.currentPaper.shapeDragState = 'mousescaleup';	
								// restore initial body cursor
								document.body.style.cursor = ft.opts.bodyCursor;
	
								asyncCallback(['scale end']);
								
								if($(ft.subject.node).attr("data-name") == "xTable"){
	
									//multi 선택 후 표 드래그시 에러 방지
									if(KTCE.currentPaper.currentShape == null) return;
	
									var _tableNumber = parseInt(KTCE.currentPaper.currentShape.node.getAttribute('data-id').substring(6,8));
									setTimeout(function(){
										for(var y=0; y< KTCE.currentPaper.tableArray[_tableNumber].tableY; y++){
											for(var x=0; x< KTCE.currentPaper.tableArray[_tableNumber].tableX; x++){
												var textWrapper = KTCE.currentPaper.tableArray[_tableNumber].cellTextArray[y][x];
												if(textWrapper != undefined) {
													$(textWrapper.node).css('opacity', 1);
												}
											}
										}
									}, 10);
								}else{
									// 상태 저장
									KTCE.saveState();
								}
								
								pDx = ft.attrs.scale.x, pDy = ft.attrs.scale.y;
								
								//CI/BI영역 편집 BlOCKING 처리
								if(KTCE.paperInfo.hwYn == 'N') {	//일반전단지
									var scaleInfo = {};
									scaleInfo.dx = pDx;
									scaleInfo.dy = pDy;
									var cibiEditBlock = KTCE.cibiEditBlock;
									cibiEditBlock(ft, 'scaleEnd', scaleInfo);
								}
								
							}
	
							handle.element.drag(_dragMove, _dragStart, _dragEnd);
						});
					}
					
				}

				// 오브젝트 드래그 이벤트, 중앙 원 핸들러
				var draggables = [];

				if (ft.opts.drag.indexOf('self') >= 0 && ft.opts.scale.indexOf('self') === -1 && ft.opts.rotate.indexOf('self') === -1) {
					//그룹핑 이동
					if(subject.attr('data-name') == 'objectGroup') {
						draggables.push(ft.bbox);
					}else{
						draggables.push(subject);
					}
					subject.attr('cursor', 'move')
				}

				if (ft.opts.drag.indexOf('center') >= 0) {
					draggables.push(ft.handles.center.disc);
					ft.handles.center.disc.attr('cursor', 'move')
				}

				draggables.map(function(draggable) {

					//실시간 표내 텍스트 위치 반영
					var textArray = null, ulineArray = null;
					var _x = [], _y = [], _initX = [], _initY = [];
					var _ulineX1 = [], _ulineX2 = [], _ulineY1 = [], _ulineY2 = [];

					var _dragMove = function(dx, dy, x, y, e) {

						if (e.which != 3) {	
							KTCE.currentPaper.shapeDragState = 'mousemove';	
							KTCE.object.moving = true;
							$('.contextMenu').hide();
							
							if(ft.isLock(ft.subject)) {	//잠금상태 체크
								//console.log('객체 잠금상태입니다!!!!')
								return;
							}

							// viewBox might be scaled
							if (ft.o.viewBoxRatio) {
								dx *= ft.o.viewBoxRatio.x;
								dy *= ft.o.viewBoxRatio.y;
							}

							ft.attrs.translate.x = ft.o.translate.x + dx;
							ft.attrs.translate.y = ft.o.translate.y + dy;

							var bbox = cloneObj(ft.o.bbox);

							bbox.x += dx;
							bbox.y += dy;

							applyLimits(bbox);

							asyncCallback(['drag']);

							ft.apply();
							
							//update text position for table
							if($(ft.subject.node).attr("data-name") == "xTable"){
								
								//2018-07: Y축 핸들러 틀어지는 버그
								if(ft.handles.bbox==null) return;
								var handlerRectY2 = (KTCE.currentPaper.currentShape.getBBox().y + KTCE.currentPaper.currentShape.getBBox().height) - parseFloat($(ft.handles.bbox[0].element.node).attr('height'))/2;
								$(ft.handles.bbox[2].element.node).attr('y', handlerRectY2);
								$(ft.handles.bbox[3].element.node).attr('y', handlerRectY2);
								$(ft.handles.bbox[6].element.node).attr('y', handlerRectY2);
								/*
								var handlerRectX2 = (KTCE.currentPaper.currentShape.getBBox().x + KTCE.currentPaper.currentShape.getBBox().width) - parseFloat($(ft.handles.bbox[0].element.node).attr('width'))/2;
								$(ft.handles.bbox[1].element.node).attr('x', handlerRectX2);
								$(ft.handles.bbox[2].element.node).attr('x', handlerRectX2);
								$(ft.handles.bbox[5].element.node).attr('x', handlerRectX2);
								*/
								
								//cursor 아이콘 숨김처리
								$("g.text-cursor").hide();
								
								//실시간 표내 텍스트 위치 반영
								textArray.each(function(idx, el){
				                    var $this = $(el);
				                    var textX = _x[idx] + dx;
				                    var textY = _y[idx] + dy;
				                    var initX = _initX[idx] + dx;
				                    var initY = _initY[idx] + dy;
				                    $this.attr({'x': textX, 'y': textY, 'data-initx': initX, 'data-inity': initY});
				                    
				                });
								
								ulineArray.each(function(idx, el){
				                    var $this = $(el);
				                    var ulineX1 = _ulineX1[idx] + dx;
				                    var ulineX2 = _ulineX2[idx] + dx;
				                    var ulineY1 = _ulineY1[idx] + dy;
				                    var ulineY2 = _ulineY2[idx] + dy;
				                    $this.attr({'x1': ulineX1, 'x2': ulineX2, 'y1': ulineY1, 'y2': ulineY2});
				                });
								
								
							}
							
							//CI/BI영역 편집 BlOCKING 처리
							if(KTCE.paperInfo.hwYn == 'N') {	//일반전단지
							//if($(ft.subject.node).attr('class').indexOf('textBoxWrap') > -1) {	//textBox만 제어
								var cibiEditBlock = KTCE.cibiEditBlock;
								cibiEditBlock(ft, 'dragMove');
							//}
							}
							
						}
					}

					var _dragStart = function(dx, dy, e) {
						if (e.which != 3) {	
							KTCE.currentPaper.shapeDragState = 'mousestart';	
							//실시간 표내 텍스트 위치 반영
							_x = [], _y = [];
							_initX = [], _initY = [];
							_ulineX1 = [], _ulineX2 = [], _ulineY1 = [], _ulineY2 = [];
							textArray = $("g.xTableTexts_" + ft.subject.node.id).find('text');
							textArray.each(function(idx, el){
			                    var $this = $(el);
			                    _x[idx] =  parseFloat($this.attr('x'));
			                    _y[idx] =  parseFloat($this.attr('y'));
			                    _initX[idx] = parseFloat($this.attr('data-initx'));
			                    _initY[idx] = parseFloat($this.attr('data-inity'));
			                });
							
							ulineArray = $("g.xTableTexts_" + ft.subject.node.id).find('g.textUnderLine>line');
							ulineArray.each(function(idx, el){
			                    var $this = $(el);
			                    _ulineX1[idx] =  parseFloat($this.attr('x1'));
			                    _ulineX2[idx] =  parseFloat($this.attr('x2'));
			                    _ulineY1[idx] =  parseFloat($this.attr('y1'));
			                    _ulineY2[idx] =  parseFloat($this.attr('y2'));
			                });
							
							// Offset values
							ft.o = cloneObj(ft.attrs);

							if (ft.opts.snap.drag) {
								ft.o.bbox = subject.getBBox();
							}

							// viewBox might be scaled
							if (paper._viewBox) {
								ft.o.viewBoxRatio = {
									x: paper._viewBox[2] / getPaperSize().x,
									y: paper._viewBox[3] / getPaperSize().y
								};
							}

							ft.axes.map(function(axis) {
								if (ft.handles[axis]) {
									ft.handles[axis].disc.ox = ft.handles[axis].disc.attr('cx');
									ft.handles[axis].disc.oy = ft.handles[axis].disc.attr('cy');
								}
							});

							asyncCallback(['drag start']);
							
							if(KTCE.paperInfo.hwYn == 'N') {	//일반전단지
								var scaleInfo = {};
								scaleInfo.dx = ft.o.translate.x;
								scaleInfo.dy = ft.o.translate.y;
								var cibiEditBlock = KTCE.cibiEditBlock;
								cibiEditBlock(ft, 'dragStart', scaleInfo);
							}
						}
					}

					var _dragEnd = function() {	
						KTCE.currentPaper.shapeDragState = 'mouseup';
						asyncCallback(['drag end']);
						KTCE.object.moving = false;

						try{
							if(KTCE.currentPaper.currentShape!=null) {
								if(ft.attrs.translate.x != ft.o.translate.x) {
									// 상태 저장
									KTCE.saveState();
								}
								/*
								//2018-12 이전원본
								if(KTCE.currentPaper.currentShape.hasClass('textBoxWrap')) {
									KTCE.saveState();
								}else if(ft.attrs.translate.x != ft.o.translate.x && !KTCE.currentPaper.currentShape.hasClass('textBoxWrap')) {
									if($(ft.subject.node).attr("data-name") == "xTable"){
										
									}else{
										// 상태 저장
										KTCE.saveState();
									}
								}
								*/
							}
						}catch(err){console.log('translate err', err)}
												
					}

					draggable.drag(_dragMove, _dragStart, _dragEnd);

					// 드래그 rebinding을 위해 설정
					ft.selfDrag = function() {
						draggable.drag(_dragMove, _dragStart, _dragEnd);
					}
				});

				var rotate = ft.opts.rotate.indexOf('self') >= 0,
					scale = ft.opts.scale.indexOf('self') >= 0;

				if (rotate || scale) {
					subject.drag(function(dx, dy, x, y) {
						if (rotate) {
							var rad = Math.atan2(y - ft.o.center.y - ft.o.translate.y, x - ft.o.center.x - ft.o.translate.x);

							ft.attrs.rotate = ft.o.rotate + (rad * 180 / Math.PI) - ft.o.deg;
						}

						var mirrored = {
							x: ft.o.scale.x < 0,
							y: ft.o.scale.y < 0
						};

						if (scale) {
							var radius = Math.sqrt(Math.pow(x - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(y - ft.o.center.y - ft.o.translate.y, 2));

							ft.attrs.scale.x = ft.attrs.scale.y = (mirrored.x ? -1 : 1) * ft.o.scale.x + (radius - ft.o.radius) / (ft.o.size.x / 2);

							if (mirrored.x) {
								ft.attrs.scale.x *= -1;
							}
							if (mirrored.y) {
								ft.attrs.scale.y *= -1;
							}
						}

						applyLimits();

						ft.apply();

						asyncCallback([rotate ? 'rotate' : null, scale ? 'scale' : null]);
					}, function(x, y) {
						// Offset values
						ft.o = cloneObj(ft.attrs);

						ft.o.deg = Math.atan2(y - ft.o.center.y - ft.o.translate.y, x - ft.o.center.x - ft.o.translate.x) * 180 / Math.PI;

						ft.o.radius = Math.sqrt(Math.pow(x - ft.o.center.x - ft.o.translate.x, 2) + Math.pow(y - ft.o.center.y - ft.o.translate.y, 2));

						// viewBox might be scaled
						if (paper._viewBox) {
							ft.o.viewBoxRatio = {
								x: paper._viewBox[2] / getPaperSize().x,
								y: paper._viewBox[3] / getPaperSize().y
							};
						}

						asyncCallback([rotate ? 'rotate start' : null, scale ? 'scale start' : null]);
					}, function() {
						asyncCallback([rotate ? 'rotate end' : null, scale ? 'scale end' : null]);
					});
				}

				ft.updateHandles();

				return ft;
			};

			/**
			 * 핸들러 visibility visible로 설정
			 */
			ft.visibleHandles = function() {

				if (ft.handles.center) {
					ft.handles.center.disc.attr({
						visibility: 'visible'
					});
				}

				['x', 'y'].map(function(axis) {
					if (ft.handles[axis]) {
						ft.handles[axis].disc.attr({
							visibility: 'visible'
						});
						ft.handles[axis].line.attr({
							visibility: 'visible'
						});
					}
				});

				if (ft.bbox) {
					ft.bbox.attr({
						visibility: 'visible'
					});
					if (ft.handles.bbox) {
						ft.handles.bbox.map(function(handle) {
							handle.element.attr({
								visibility: 'visible'
							});
						});
					}
				}

				if (ft.circle) {
					ft.circle.attr({
						visibility: 'visible'
					});
				}
				iconBarEnable(ft);
				
				return ft;

			}

			/**
			 * 핸들러 visibilty hidden으로 설정
			 */
			ft.visibleNoneHandles = function(opts) {

				if (ft.handles.center) {
					ft.handles.center.disc.attr({
						visibility: 'hidden'
					});
				}

				['x', 'y'].map(function(axis) {
					if (ft.handles[axis]) {
						ft.handles[axis].disc.attr({
							visibility: 'hidden'
						});
						ft.handles[axis].line.attr({
							visibility: 'hidden'
						});
					}
				});

				if (ft.bbox) {
					ft.bbox.attr({
						visibility: 'hidden'
					});

					if (ft.handles.bbox) {
						ft.handles.bbox.map(function(handle) {
							handle.element.attr({
								visibility: 'hidden'
							});
						});
					}
				}

				if (ft.circle) {
					ft.circle.attr({
						visibility: 'hidden'
					});
				}

				iconBarDisabled(ft);

				if(opts == undefined || opts != "multiple")
					KTCE.currentPaper.selectedShapeArray = [];	

				return ft;
			};

			/**
			 * 핸들러 제거
			 */
			ft.hideHandles = function(opts) {

				var opts = opts || {}

				if (opts.undrag === undefined) {
					opts.undrag = true;
				}

				if (opts.undrag) {
					ft.items.map(function(item) {
						item.el.undrag();
					});
				}

				if (ft.handles.center) {
					ft.handles.center.disc.remove();
					ft.handles.center = null;

				}

				['x', 'y'].map(function(axis) {
					if (ft.handles[axis]) {
						ft.handles[axis].disc.remove();
						ft.handles[axis].line.remove();
						ft.handles[axis] = null;
					}
				});

				if (ft.bbox) {
					ft.bbox.remove();
					ft.bbox = null;

					if (ft.handles.bbox) {
						ft.handles.bbox.map(function(handle) {
							handle.element.remove();
						});

						ft.handles.bbox = null;
					}
				}

				if (ft.circle) {
					ft.circle.remove();
					ft.circle = null;
				}

				return ft;
			};

			// default 값을 options값으로 대체
			ft.setOpts = function(options, callback) {
				if (callback !== undefined) {
					ft.callback = typeof callback === 'function' ? callback : false;
				}

				var i, j;

				for (i in options) {
					if (options[i] && options[i].constructor === Object) {
						if (ft.opts[i] === false) {
							ft.opts[i] = {};
						}
						for (j in options[i]) {
							if (options[i].hasOwnProperty(j)) {
								ft.opts[i][j] = options[i][j];
							}
						}
					} else {
						ft.opts[i] = options[i];
					}
				}

				if (ft.opts.animate === true) {
					ft.opts.animate = {
						delay: 700,
						easing: 'linear'
					};
				}
				if (ft.opts.drag === true) {
					ft.opts.drag = ['center', 'self'];
				}
				if (ft.opts.keepRatio === true) {
					ft.opts.keepRatio = ['bboxCorners', 'bboxSides'];
				}
				if (ft.opts.rotate === true) {
					ft.opts.rotate = ['axisX', 'axisY'];
				}
				if (ft.opts.scale === true) {
					ft.opts.scale = ['axisX', 'axisY', 'bboxCorners', 'bboxSides'];
				}
				if (ft.opts.objectId === true) {
					ft.opts.objectId = options.objectId;
				}

				// objectId 설정
				ft.objectId = options.objectId;

				['drag', 'draw', 'keepRatio', 'rotate', 'scale'].map(function(option) {
					if (ft.opts[option] === false) {
						ft.opts[option] = [];
					}
				});

				ft.axes = [];

				if (ft.opts.rotate.indexOf('axisX') >= 0 || ft.opts.scale.indexOf('axisX') >= 0) {
					ft.axes.push('x');
				}
				if (ft.opts.rotate.indexOf('axisY') >= 0 || ft.opts.scale.indexOf('axisY') >= 0) {
					ft.axes.push('y');
				}

				['drag', 'rotate', 'scale'].map(function(option) {
					if (!ft.opts.snapDist[option]) {
						ft.opts.snapDist[option] = ft.opts.snap[option];
					}
				});

				// Force numbers
				ft.opts.range = {
					rotate: [parseFloat(ft.opts.range.rotate[0]), parseFloat(ft.opts.range.rotate[1])],
					scale: [parseFloat(ft.opts.range.scale[0]), parseFloat(ft.opts.range.scale[1])]
				};


				ft.opts.snap = {
					drag: parseFloat(ft.opts.snap.drag),
					rotate: parseFloat(ft.opts.snap.rotate),
					scale: parseFloat(ft.opts.snap.scale)
				};

				ft.opts.snapDist = {
					drag: parseFloat(ft.opts.snapDist.drag),
					rotate: parseFloat(ft.opts.snapDist.rotate),
					scale: parseFloat(ft.opts.snapDist.scale)
				};

				if (typeof ft.opts.size === 'string') {
					ft.opts.size = parseFloat(ft.opts.size);
				}

				if (!isNaN(ft.opts.size)) {
					ft.opts.size = {
						axes: ft.opts.size,
						bboxCorners: ft.opts.size,
						bboxSides: ft.opts.size,
						center: ft.opts.size
					};
				}

				if (typeof ft.opts.distance === 'string') {
					ft.opts.distance = parseFloat(ft.opts.distance);
				}


				ft.showHandles();

				asyncCallback(['init']);

				return ft;
			};

			ft.setOpts(options, callback);

			/**
			 * Apply transformations, optionally update attributes manually
			 */
			ft.apply = function() {
				ft.items.map(function(item, i) {

					// Take offset values into account
					var
						center = {
							x: ft.attrs.center.x + ft.offset.translate.x,
							y: ft.attrs.center.y + ft.offset.translate.y
						},
						rotate = ft.attrs.rotate - ft.offset.rotate,
						scale = {
							x: ft.attrs.scale.x / ft.offset.scale.x,
							y: ft.attrs.scale.y / ft.offset.scale.y
						},
						translate = {
							x: ft.attrs.translate.x - ft.offset.translate.x,
							y: ft.attrs.translate.y - ft.offset.translate.y
						},
						size = {
							x: ft.attrs.x + ft.attrs.size.x,
							y: ft.attrs.y + ft.attrs.size.y
						}

					if (ft.opts.animate) {
						asyncCallback(['animate start']);

						item.el.animate({
								transform: [
									'R' + rotate, center.x, center.y,
									'S' + scale.x, scale.y, center.x, center.y,
									'T' + translate.x, translate.y
								].join(',')
							},
							ft.opts.animate.delay,
							ft.opts.animate.easing,
							function() {
								asyncCallback(['animate end']);

								ft.updateHandles();
							}
						);
					} else {

						item.el.transform([
							'R' + rotate, center.x, center.y,
							'S' + scale.x, scale.y, center.x, center.y,
							'T' + translate.x, translate.y
						].join(','));

						asyncCallback(['apply']);

						ft.updateHandles();

						// item.el : snap 객체
						// ft.attrs : transform 정보

						setTimeout(function() {
							KTCE.updateData(item.el, ft.attrs);
						}, 1);


						// 텍스트 박스 위치 연동
						if ( ft.opts.textBoxFlag == true ) {

						} else {
						}
					}
				});

				return ft;
			};

			/**
			 * Clean exit
			 */
			ft.unplug = function() {
				var attrs = ft.attrs;

				ft.hideHandles();

				// Goodbye
				delete subject.freeTransform;

				return attrs;
			};

			// Store attributes for each item
			function scan(subject) {
				(subject.type === 'set' ? subject.items : [subject]).map(function(item) {
					if (item.type === 'set') {
						scan(item);
					} else {
						ft.items.push({
							el: item,
							attrs: {
								rotate: 0,
								scale: {
									x: 1,
									y: 1
								},
								translate: {
									x: 0,
									y: 0
								}
							},
							transformString: item.transform().toString()
						});
					}
				});
			}

			scan(subject);

			// Get the current transform values for each item
			ft.items.map(function(item, i) {
				if (item.el._ && item.el._.transform && typeof item.el._.transform === 'object') {
					item.el._.transform.map(function(transform) {
						if (transform[0]) {
							switch (transform[0].toUpperCase()) {
								case 'T':
									ft.items[i].attrs.translate.x += transform[1];
									ft.items[i].attrs.translate.y += transform[2];

									break;
								case 'S':
									ft.items[i].attrs.scale.x *= transform[1];
									ft.items[i].attrs.scale.y *= transform[2];

									break;
								case 'R':
									ft.items[i].attrs.rotate += transform[1];

									break;
							}
						}
					});
				}
			});

			// If subject is not of type set, the first item _is_ the subject
			if (subject.type !== 'set') {
				ft.attrs.rotate = ft.items[0].attrs.rotate;
				ft.attrs.scale = ft.items[0].attrs.scale;
				ft.attrs.translate = ft.items[0].attrs.translate;

				ft.items[0].attrs = {
					rotate: 0,
					scale: {
						x: 1,
						y: 1
					},
					translate: {
						x: 0,
						y: 0
					}
				};

				ft.items[0].transformString = '';
			}

			ft.attrs.ratio = ft.attrs.scale.x / ft.attrs.scale.y;

			/**
			 * Get rotated bounding box
			 */
			function getBBox() {
				var rad = {
					x: (ft.attrs.rotate) * Math.PI / 180,
					y: (ft.attrs.rotate + 90) * Math.PI / 180
				};

				var radius = {
					x: ft.attrs.size.x / 2 * ft.attrs.scale.x,
					y: ft.attrs.size.y / 2 * ft.attrs.scale.y
				};

				var
					corners = [],
					signs = [{
						x: -1,
						y: -1
					}, {
						x: 1,
						y: -1
					}, {
						x: 1,
						y: 1
					}, {
						x: -1,
						y: 1
					}];

				signs.map(function(sign) {
					corners.push({
						x: (ft.attrs.center.x + ft.attrs.translate.x + sign.x * radius.x * Math.cos(rad.x)) + sign.y * radius.y * Math.cos(rad.y),
						y: (ft.attrs.center.y + ft.attrs.translate.y + sign.x * radius.x * Math.sin(rad.x)) + sign.y * radius.y * Math.sin(rad.y)
					});
				});

				return corners;
			}

			/**
			 * Get dimension of the paper
			 */
			function getPaperSize() {

				// TODO: check and remove. Old Snap shims here
				// var match = {
				//     x: /^([0-9]+)%$/.exec(paper.attr('width')),
				//     y: /^([0-9]+)%$/.exec(paper.attr('height'))
				// };
				//
				//
				// return {
				//     x: match.x ? paper.canvas.clientWidth  || paper.canvas.parentNode.clientWidth  * parseInt(match.x[1], 10) * 0.01 : paper.canvas.clientWidth  || paper.width,
				//     y: match.y ? paper.canvas.clientHeight || paper.canvas.parentNode.clientHeight * parseInt(match.y[1], 10) * 0.01 : paper.canvas.clientHeight || paper.height
				// };
				//

				return {
					x: parseInt(paper.node.clientWidth),
					y: parseInt(paper.node.clientHeight)
				}
			}

			/**
			 * Apply limits
			 */
			function applyLimits(bbox) {
				// Snap to grid
				if (bbox && ft.opts.snap.drag) {
					var
						x = bbox.x,
						y = bbox.y,
						dist = {
							x: 0,
							y: 0
						},
						snap = {
							x: 0,
							y: 0
						};

					[0, 1].map(function() {
						// Top and left sides first
						dist.x = x - Math.round(x / ft.opts.snap.drag) * ft.opts.snap.drag;
						dist.y = y - Math.round(y / ft.opts.snap.drag) * ft.opts.snap.drag;

						if (Math.abs(dist.x) <= ft.opts.snapDist.drag) {
							snap.x = dist.x;
						}
						if (Math.abs(dist.y) <= ft.opts.snapDist.drag) {
							snap.y = dist.y;
						}

						// Repeat for bottom and right sides
						x += bbox.width - snap.x;
						y += bbox.height - snap.y;
					});

					ft.attrs.translate.x -= snap.x;
					ft.attrs.translate.y -= snap.y;
				}

				// Keep center within boundaries
				if (ft.opts.boundary) {
					var b = ft.opts.boundary;
					b.width = b.width || getPaperSize().x;
					b.height = b.height || getPaperSize().y;

					if (ft.attrs.center.x + ft.attrs.translate.x < b.x) {
						ft.attrs.translate.x += b.x - (ft.attrs.center.x + ft.attrs.translate.x);
					}
					if (ft.attrs.center.y + ft.attrs.translate.y < b.y) {
						ft.attrs.translate.y += b.y - (ft.attrs.center.y + ft.attrs.translate.y);
					}
					if (ft.attrs.center.x + ft.attrs.translate.x > b.x + b.width) {
						ft.attrs.translate.x += b.x + b.width - (ft.attrs.center.x + ft.attrs.translate.x);
					}
					if (ft.attrs.center.y + ft.attrs.translate.y > b.y + b.height) {
						ft.attrs.translate.y += b.y + b.height - (ft.attrs.center.y + ft.attrs.translate.y);
					}
				}

				// Snap to angle, rotate with increments
				dist = Math.abs(ft.attrs.rotate % ft.opts.snap.rotate);
				dist = Math.min(dist, ft.opts.snap.rotate - dist);

				if (dist < ft.opts.snapDist.rotate) {
					ft.attrs.rotate = Math.round(ft.attrs.rotate / ft.opts.snap.rotate) * ft.opts.snap.rotate;
				}

				// Snap to scale, scale with increments
				dist = {
					x: Math.abs((ft.attrs.scale.x * ft.attrs.size.x) % ft.opts.snap.scale),
					y: Math.abs((ft.attrs.scale.y * ft.attrs.size.x) % ft.opts.snap.scale)
				};

				dist = {
					x: Math.min(dist.x, ft.opts.snap.scale - dist.x),
					y: Math.min(dist.y, ft.opts.snap.scale - dist.y)
				};

				if (dist.x < ft.opts.snapDist.scale) {
					ft.attrs.scale.x = Math.round(ft.attrs.scale.x * ft.attrs.size.x / ft.opts.snap.scale) * ft.opts.snap.scale / ft.attrs.size.x;
				}

				if (dist.y < ft.opts.snapDist.scale) {
					ft.attrs.scale.y = Math.round(ft.attrs.scale.y * ft.attrs.size.y / ft.opts.snap.scale) * ft.opts.snap.scale / ft.attrs.size.y;
				}

				// Limit range of rotation
				if (ft.opts.range.rotate) {
					var deg = (360 + ft.attrs.rotate) % 360;

					if (deg > 180) {
						deg -= 360;
					}

					if (deg < ft.opts.range.rotate[0]) {
						ft.attrs.rotate += ft.opts.range.rotate[0] - deg;
					}
					if (deg > ft.opts.range.rotate[1]) {
						ft.attrs.rotate += ft.opts.range.rotate[1] - deg;
					}
				}

				// Limit scale
				if (ft.opts.range.scale) {
					if (ft.attrs.scale.x * ft.attrs.size.x < ft.opts.range.scale[0]) {
						ft.attrs.scale.x = ft.opts.range.scale[0] / ft.attrs.size.x;
					}

					if (ft.attrs.scale.y * ft.attrs.size.y < ft.opts.range.scale[0]) {
						ft.attrs.scale.y = ft.opts.range.scale[0] / ft.attrs.size.y;
					}

					if (ft.attrs.scale.x * ft.attrs.size.x > ft.opts.range.scale[1]) {
						ft.attrs.scale.x = ft.opts.range.scale[1] / ft.attrs.size.x;
					}

					if (ft.attrs.scale.y * ft.attrs.size.y > ft.opts.range.scale[1]) {
						ft.attrs.scale.y = ft.opts.range.scale[1] / ft.attrs.size.y;
					}
				}
			}

			function isWithinBoundaries() {
				return {
					x: ft.attrs.scale.x * ft.attrs.size.x >= ft.opts.range.scale[0] && ft.attrs.scale.x * ft.attrs.size.x <= ft.opts.range.scale[1],
					y: ft.attrs.scale.y * ft.attrs.size.y >= ft.opts.range.scale[0] && ft.attrs.scale.y * ft.attrs.size.y <= ft.opts.range.scale[1]
				};
			}

			function keepRatio(axis) {
				if (axis === 'x') {
					ft.attrs.scale.y = ft.attrs.scale.x / ft.attrs.ratio;
				} else {
					ft.attrs.scale.x = ft.attrs.scale.y * ft.attrs.ratio;
				}
			}

			/**
			 * Recursive copy of object
			 */
			function cloneObj(obj) {
				var i, clone = {};

				for (i in obj) {
					clone[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
				}

				return clone;
			}

			var timeout = false;

			/**
			 * Call callback asynchronously for better performance
			 */
			function asyncCallback(e) {
				if (ft.callback) {
					// Remove empty values
					var events = [];

					e.map(function(e, i) {
						if (e) {
							events.push(e);
						}
					});

					//2018-12 ie 속도에 따른 기존 cursor 사자라는 버그 개선
					var _cursor = ft.subject.node.style.cursor;
					
					clearTimeout(timeout);

					timeout = setTimeout(function() {
						if (ft.callback) {
							ft.callback(ft, events);
						}
						
						//2018-12 ie 속도에 따른 기존 cursor 사자라는 버그 개선
						ft.subject.node.style.cursor = _cursor;
						
					}, 1);
				}
			}
			
			ft.isGroup = function(obj){
				var groupFlag = false;
				try {
					if(obj.attr('data-name')==='objectGroup'){
						groupFlag = true;
					}
				}catch(e){groupFlag = false;}
				return groupFlag;
			};
			
			function lockObjState(obj) {
				var lockFlag = false;
				try {
					if(obj.data('objLock') || obj.attr('data-lock')==='lock') {
						lockFlag = true;
					}
				}catch(e){}
				return lockFlag;
			}
			
			ft.isLock = function(obj){
				var lockFlag = false;
				try {
					if(obj.data('objLock') || obj.attr('data-lock')==='lock'){
						lockFlag = true;
					}
				}catch(e){lockFlag = false;}
				return lockFlag;
			};
			
			ft.updateHandles();

			// Enable method chaining
			return ft;
		};
		
		Snap.freeTransform = freeTransform
	})

}));

function iconBarDisabled(selectedObj){
	$(".col3disabled").show();
	$(".col4disabled").show();
	$(".col6Disabled").show();
	$(".col11Disabled").show();
	$(".col10disabled").show();
	$(".col12Disabled").show();
	$(".col13Disabled").show();
	$(".col15Disabled").show();
}
function iconBarEnable(selectedObj){
	iconBarDisabled();
	
	if(KTCE.currentPaper.selectedShapeArray.length < 2){
		
		try {
			//도구모음/contextMenu 사용여부 체크
			var contextMenuLockElement = $("div.contextMenu button.objectLock>img");
			var contextMenuLockElementSrc = contextMenuLockElement.attr('src');
			
			if(selectedObj.subject.freeTransform.isLock(selectedObj.subject)) {
				var tempArr = contextMenuLockElementSrc.split("_on");
				var newSrc = tempArr.join("_off");
				
				//잘라내기/삭제/복사/붙이기 사용잠금
				$('button.objectCut').attr('disabled', true).css('opacity', 0.3);
				$('button.objectDelete').attr('disabled', true).css('opacity', 0.3);
				$('button.objectCopy').attr('disabled', true).css('opacity', 0.3);
				$('button.objectPaste').attr('disabled', true).css('opacity', 0.3);
				//투명도/회전 사용잠금
				$('button.objectOpacity').attr('disabled', true).css('opacity', 0.3);
				$('button.objectRotate').attr('disabled', true).css('opacity', 0.3);
			}else{
				var tempArr = contextMenuLockElementSrc.split("_off");
				var newSrc = tempArr.join("_on");
				
				//잘라내기/삭제/복사/붙이기 잠금해제
				$('button.objectCut').removeAttr('disabled style');
				$('button.objectDelete').removeAttr('disabled style');
				$('button.objectCopy').removeAttr('disabled style');
				$('button.objectPaste').removeAttr('disabled style');
				
				//투명도/회전 잠금해제
				$('button.objectOpacity').removeAttr('disabled style');
				$('button.objectRotate').removeAttr('disabled style');
			}
			//contextMenu 잠금아이콘 on/off 노출제어
			if(newSrc.length > 0) {
				contextMenuLockElement.attr('src', newSrc);
			}
		}catch(e){console.log('error>', e)}
		
		var subType = selectedObj.subject.type;
		var _objectId = $(selectedObj.subject.node).attr('data-name');
		$(".col11Disabled").hide();	//스타일
		$(".col13Disabled").hide();	//정렬
		if(_objectId == 'objectGroup'){
			$(".col15Disabled").hide();	//그룹서식
			$(".col3disabled").show();		//글꼴
			$(".col4disabled").show();		//단락
			$(".col6Disabled").show();		//도형서식
			$(".col12Disabled").show();		//표서식
			$(".col11Disabled").show();		//스타일
			//$(".col13Disabled").show();		//정렬
			$(".col10disabled").show();		//자르기
		}else if(subType == "g" && _objectId != 'xImage' && _objectId != 'objectGroup'){
			
			try {
				if( selectedObj.subject.freeTransform.isLock(selectedObj.subject) ) {
					//console.log('잠금객체는 글꼴 및 단락 편집도구를 사용을 지원하질 않습니다!');
					return;
				}
			}catch(e){}
			
			if(selectedObj.subject.hasClass('textBoxWrap')){
				selectedObj.opts.keepRatio = ['axis', 'bboxCorners', 'bboxSides'];
				$(".col3disabled").hide();
				$(".col4disabled").hide();
			} else {  //selected table
				$(".col3disabled").hide();		//글꼴
				$(".col4disabled").hide();		//단락
				$(".col12Disabled").hide();		//표서식
			}
		} else if(subType == "image" || _objectId == 'xImage'){
			if(_objectId == 'objectGroup') return;
			selectedObj.opts.keepRatio = ['axis', 'bboxCorners', 'bboxSides'];
			$(".col11Disabled").show();
			$(".col10disabled").hide();
		} else {
			if(_objectId == 'objectGroup') return;
			$(".col6Disabled").hide();
		}

	}else{
		if($(".col15Disabled").show()) {
			$(".col15Disabled").hide();	//그룹서식
		}
	}
}

/*
 CSS Browser Selector js v0.5.3 (July 2, 2013)

 -- original --
 Rafael Lima (http://rafael.adm.br)
 http://rafael.adm.br/css_browser_selector
 License: http://creativecommons.org/licenses/by/2.5/
 Contributors: http://rafael.adm.br/css_browser_selector#contributors
 -- /original --

 Fork project: http://code.google.com/p/css-browser-selector/
 Song Hyo-Jin (shj at xenosi.de)
 */
function css_browser_selector(n){var b=n.toLowerCase(),f=function(c){return b.indexOf(c)>-1},h="gecko",k="webkit",p="safari",j="chrome",d="opera",e="mobile",l=0,a=window.devicePixelRatio?(window.devicePixelRatio+"").replace(".","_"):"1";var i=[(!(/opera|webtv/.test(b))&&/msie\s(\d+)/.test(b)&&(l=RegExp.$1*1))?("ie ie"+l+((l==6||l==7)?" ie67 ie678 ie6789":(l==8)?" ie678 ie6789":(l==9)?" ie6789 ie9m":(l>9)?" ie9m":"")):(/trident\/\d+.*?;\s*rv:(\d+)\.(\d+)\)/.test(b)&&(l=[RegExp.$1,RegExp.$2]))?"ie ie"+l[0]+" ie"+l[0]+"_"+l[1]+" ie9m":(/firefox\/(\d+)\.(\d+)/.test(b)&&(re=RegExp))?h+" ff ff"+re.$1+" ff"+re.$1+"_"+re.$2:f("gecko/")?h:f(d)?d+(/version\/(\d+)/.test(b)?" "+d+RegExp.$1:(/opera(\s|\/)(\d+)/.test(b)?" "+d+RegExp.$2:"")):f("konqueror")?"konqueror":f("blackberry")?e+" blackberry":(f(j)||f("crios"))?k+" "+j:f("iron")?k+" iron":!f("cpu os")&&f("applewebkit/")?k+" "+p:f("mozilla/")?h:"",f("android")?e+" android":"",f("tablet")?"tablet":"",f("j2me")?e+" j2me":f("ipad; u; cpu os")?e+" chrome android tablet":f("ipad;u;cpu os")?e+" chromedef android tablet":f("iphone")?e+" ios iphone":f("ipod")?e+" ios ipod":f("ipad")?e+" ios ipad tablet":f("mac")?"mac":f("darwin")?"mac":f("webtv")?"webtv":f("win")?"win"+(f("windows nt 6.0")?" vista":""):f("freebsd")?"freebsd":(f("x11")||f("linux"))?"linux":"",(a!="1")?" retina ratio"+a:"","js portrait"].join(" ");if(window.jQuery&&!window.jQuery.browser){window.jQuery.browser=l?{msie:1,version:l}:{}}return i}(function(j,b){var c=css_browser_selector(navigator.userAgent);var g=j.documentElement;g.className+=" "+c;var a=c.replace(/^\s*|\s*$/g,"").split(/ +/);b.CSSBS=1;for(var f=0;f<a.length;f++){b["CSSBS_"+a[f]]=1}var e=function(d){return j.documentElement[d]||j.body[d]};if(b.jQuery){(function(q){var h="portrait",k="landscape";var i="smartnarrow",u="smartwide",x="tabletnarrow",r="tabletwide",w=i+" "+u+" "+x+" "+r+" pc";var v=q(g);var s=0,o=0;function d(){if(s!=0){return}try{var l=e("clientWidth"),p=e("clientHeight");if(l>p){v.removeClass(h).addClass(k)}else{v.removeClass(k).addClass(h)}if(l==o){return}o=l}catch(m){}s=setTimeout(n,100)}function n(){try{v.removeClass(w);v.addClass((o<=360)?i:(o<=640)?u:(o<=768)?x:(o<=1024)?r:"pc")}catch(l){}s=0}if(b.CSSBS_ie){setInterval(d,1000)}else{q(b).on("resize orientationchange",d).trigger("resize")}})(b.jQuery)}})(document,window);


//reaplce At index
String.prototype.replaceAt = function(index, character){
	return this.substring(0, index) + character + this.substring(index+1, this.length);
}


//ie outerHTML 대응
function outerHTMLCheck(svgNode) {
	var _outer = null;
	if (svgNode.outerHTML) {
		_outer = svgNode.outerHTML;
	} else if (XMLSerializer) {
	    _outer = new XMLSerializer().serializeToString(svgNode);
	}
	
	return _outer;
}


/*
* @Function
* @Description : 남은 세션타임 5분 사전인지 팝업알림
* @DATE : 2017-02-20
**/
(function() {
	//운영관리>편집기관리>스타일관리 사용시 세션타임 알림 미사용
	if(opener.parent.sessionTimeCheck.styleEditor) {
		fnSetSessionExtension();	//세션타임 연장
		return;
	}
	//현재 남은 세션타임값 확인(초단위)
	var lastAccessedTime = fnGetSessionTime();	
	var initEvnetTimeoutTimer = null;
	var sessionTimeoutTimer = null;
	var foucsoutTimer = null;
	var sessionTimeInterval = null;
	var sessionExtensionAlertFlag = false;
	var sessionTime = undefined;
	var alertDisplayTime = 60 * 8;	//세션 연장팝어창 5분전에 표시이나, 불확실한 세션값으로 인하여 8분전에 미리 계산
	
	//현재 남은 세션타임값 확인(초단위)
	//var lastAccessedTime = fnGetSessionTime();
	
	var initTime = 30;
	var endTime = 60 * 5; //5분
	var rMinute = 5;
	var rSecond = 0;
	
	// 세션만료 이벤트 바인딩
	function fnSetSessionEventBind() {
		
		//opener.parent.sessionTimeCheck.setWindowEvent();
		
		var mouseEvent = null;
		var timerFlag = false;
		$(window).on({
			mouseenter : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'mouseenter';
				fnSetSessionTimeoutStartAction(timerFlag);
			},
			mouseleave : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = true;
				mouseEvent = 'mouseleave';
				fnSetSessionTimeoutStartAction(timerFlag);
			}, 
			mouseover : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'mouseover';
				//fnSetSessionTimeoutStartAction(timerFlag);
			}, 
			mousedown : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'mousedown';
				fnSetSessionTimeoutStartAction(timerFlag);
			}, 
			mousemove : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'mousemove';
				
				fnSetSessionTimeoutStartAction(timerFlag);
			},
			click : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'click';
				fnSetSessionTimeoutStartAction(timerFlag);
			},
			dblclick : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'dblclick';
				fnSetSessionTimeoutStartAction(timerFlag);
			},
			keydown : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'keydown';
				fnSetSessionTimeoutStartAction(timerFlag);
			},
			focus : function() {
			},
			focusin : function() {
				if(sessionExtensionAlertFlag) return;
				timerFlag = false;
				mouseEvent = 'focusin';
				fnSetSessionTimeoutStartAction(timerFlag);
			},
			focusout : function() {
				if(sessionExtensionAlertFlag) return;
				
				timerFlag = true;
				mouseEvent = 'focusout';
				
				//부모창 사용중인지 판단
				//fnSetFocusoutTimeInterval();
				
				fnSetSessionTimeoutStartAction(timerFlag);
			}
		});
	}
	
	function fnSetSessionEventUnBind() {
		//opener.parent.sessionTimeCheck.setWindowEvent();
		if(initEvnetTimeoutTimer != null){
			clearTimeout(initEvnetTimeoutTimer);
			initEvnetTimeoutTimer = null;
		}
		$(window).off('mousemove mouseenter mouseleave mouseover mousedown click dblclick keydown focus focusin focusout');
	}
	/*
	function fnSetFocusoutTimeInterval() {
		
		fnSetFocusoutClearInterval();
		
		foucsoutTimer = setInterval(function() {
			
			if(opener.parent.sessionTimeCheck != null ) {
				var parentEvent = opener.parent.sessionTimeCheck.getWindowEvent();
				if(!parentEvent.parentTimerFlag) {
					fnSetSessionTimeoutStartAction(false);
				}else{
					fnSetSessionTimeoutStartAction(true);
					clearInterval(foucsoutTimer);
					foucsoutTimer = null;
				}
			}else{
				
			}
			
			
		}, 1000*1);
	}
	function fnSetFocusoutClearInterval() {
		if(foucsoutTimer != null){
			clearInterval(foucsoutTimer);
			tempTimer = null;
		}
	}
	*/
	function fnSetSessionTimeoutStartAction(timerFlag) {
			
		//var initTime = 30;
		
		if(initEvnetTimeoutTimer != null){
			clearTimeout(initEvnetTimeoutTimer);
			initEvnetTimeoutTimer = null;
		}
		
		if(sessionTimeoutTimer != null) {
			clearTimeout(sessionTimeoutTimer);
			sessionTimeoutTimer = null;
		}
			
		initEvnetTimeoutTimer = setTimeout(function() {
				
			if(initEvnetTimeoutTimer != null){
				clearTimeout(initEvnetTimeoutTimer);
				initEvnetTimeoutTimer = null;
			}
			//현재 남은 세션타임값 확인(초단위)
			fnGetSessionTime('initEvnetTimeoutTimer');
			
		}, 1000 * initTime);
				
	}
		
	function fnSetSessionTimeoutCheckAction(accessedTimeCount) {
		
		var time = 1000 * accessedTimeCount;
		
		if(sessionTimeoutTimer != null) {
			clearTimeout(sessionTimeoutTimer);
			sessionTimeoutTimer = null;
		}
		
		if(accessedTimeCount === undefined) return;
		
		sessionTimeoutTimer = setTimeout(function() {
			/*
			//부모창 사용중인지 확인
			if(!parentEvent.parentTimerFlag) {
				console.log('parent event on!!!!!');
				fnSetSessionTimeoutAction(true);
				return;
			}
			*/
			
			if(sessionTimeoutTimer != null) {
				clearTimeout(sessionTimeoutTimer);
				sessionTimeoutTimer = null;
			}
						
			//현재 남은 세션타임값 확인(초단위)
			fnGetSessionTime('sessionTimeoutTimer');	
			
		}, time);

	}
	
	// 세션만료 5분전 로그인 시간 연장하기 알림창
	function fnSetSessionExtensionAlert() {

		sessionExtensionAlertFlag = true;
		if(sessionTimeInterval != null) {
			clearInterval(sessionTimeInterval);
		}
		
		var pop = 	'<div class="msgPopup" id="sTimeExtensionPopup" style="display: block;">';
		pop +=  '	<h2 class="tit">로그인 만료시간 알림</h2>';
		pop +=  '	<div class="msgPopupWrap">';
		pop +=  '		<div class="msgPopupContentWrap">';
		pop +=  '			<div class="popupMessage">';
		pop +=  				'<p class="timeMsg">로그인 만료 <span class="realTimeMsg" id="sessiontime">5분 00초</span> 전입니다.</p>';
		pop +=  				'<button type="button" class="btn btnS color1" id="sTimeExtensionBtn">연장하기 >></button>';
		pop +=  '			</div>';
		pop +=  '		</div>';
		pop +=  '	</div>';
		pop +=  '</div>';

		$('body').append($(pop));

		$('.dimmLayer').css('z-index', 1021).fadeIn(150);
		$('.msgPopup').fadeIn(200);
		
		var timeLen = function(str, len) {
	        str = str + "";
	        while(str.length < len) {
	            str = "0" + str;
	        }
	        return str;
	    }
		
		
		//현재 남은 세션타임값 확인(초단위)
		//var lastAccessedTime = fnGetSessionTime();
		endTime = 60 * 5; //5분
		
		rMinute = parseInt(endTime/60);
		rSecond = endTime % 60;
		rSecond = timeLen(rSecond, 2);
		var displayTime = rMinute + "분 " + rSecond + "초";
		$("#sessiontime").text(displayTime);
		
		var chkCount = 0;
		sessionTimeInterval = setInterval(function() {
			if(endTime>0) {
				
				//부모창 실행 여부확인
				if(opener.parent.sessionTimeCheck != null  && chkCount%10 === 1) {
					var parentEvent = opener.parent.sessionTimeCheck.getWindowEvent();
					if(!parentEvent.parentTimerFlag) {// && parentEvent.parentMouseEvent === 'focusin') {
						//console.log('부모창 사용중!!');

						fnGetSessionTime('parent');	
						return;
					}
				}
				
				endTime--;
				rMinute = parseInt(endTime/60);
				rSecond = endTime % 60;
				rSecond = timeLen(rSecond, 2);
				var displayTime = rMinute + "분 " + rSecond + "초";
				$("#sessiontime").text(displayTime);
			}else if(endTime <= 0) {
				
				fnSetSessionEventUnBind();
				
				if(sessionTimeInterval != null) {
					clearInterval(sessionTimeInterval);
				}
				//console.log('로그인 세션 만료!!!!');
				
				//opener.parent.sessionTimeCheck.setSessionDestroy();	//header.jsp -세션삭제

				fnDelSessionTime();	//세션타임 삭제
				
				$("#sTimeExtensionPopup>h2").text('로그인 시간 만료!')
				var timeEndPopMsg = '<p class="timeMsg">로그인 시간이 <span class="realTimeMsg">만료</span>되었습니다! <br>사용시 <span class="realTimeMsg">재로그인</span>이 필요합니다!</p>';
				$("div.popupMessage").empty().html(timeEndPopMsg);
				
				var sTimeEndActionBtn = document.getElementById('sTimeExtensionPopup');
				sTimeEndActionBtn.onclick = function() {
					$('.dimmLayer').css('z-index', 1010).fadeOut(200);
					$('.msgPopup').fadeOut(150).remove();
				}
			}
			
		}, 1000);


		var sTimeActionBtn = document.getElementById('sTimeExtensionBtn');
		sTimeActionBtn.onclick = function() {
			
			sessionExtensionAlertFlag = false;
			
			if(sessionTimeInterval != null) {
				clearInterval(sessionTimeInterval);
			}
			$('.dimmLayer').css('z-index', 1010).fadeOut(200);
			$('.msgPopup').fadeOut(150).remove();
			//console.log('로그인 세션 연장');
			//세션타임 연장
			fnSetSessionExtension();
		}
		
	}
	
	//현재 세션타임 확인
	function fnGetSessionTime(action) {
		
		gf_ajax(
			"/Fwl/Common.do",
          {
				"pageFlag":'SESSION_GET_TIME',
				"seChk":'ture'
			},
			function(data){
				
				var result = data.result;
				if(result === 'success') {
					//console.log("남은 세션타임은 " + data.sessiontime + "입니다.");
					if(data.sessiontime === undefined) return;
					sessionTime = data.sessiontime;
					lastAccessedTime = data.sessiontime;
					var accessedTimeCount = lastAccessedTime - alertDisplayTime;					
					
					if(action === 'initEvnetTimeoutTimer') {
						
						if( lastAccessedTime >= alertDisplayTime-initTime && lastAccessedTime != undefined) {
				    		
				    		//세션 남은시간 카운터 후 
				    		//fnSetSessionTimeoutCheckAction(accessedTimeCount);
				    		
				    		var time = 1000 * accessedTimeCount;
				    		
				    		if(sessionTimeoutTimer != null) {
				    			clearTimeout(sessionTimeoutTimer);
				    			sessionTimeoutTimer = null;
				    		}
				    		
				    		sessionTimeoutTimer = setTimeout(function() {
				    			if(sessionTimeoutTimer != null) {
				    				clearTimeout(sessionTimeoutTimer);
				    				sessionTimeoutTimer = null;
				    			}
				    						
				    			//현재 남은 세션타임값 확인(초단위)
				    			fnGetSessionTime('sessionTimeoutTimer');	

				    		}, time);
				    		
				    	}else{
				    		//console.log('세션타임이 너무짧음. 연장실행!!');
				    		
				    		if(sessionTimeoutTimer != null) {
				    			clearTimeout(sessionTimeoutTimer);
				    			sessionTimeoutTimer = null;
				    		}
				    		
				    		sessionTimeoutTimer = setTimeout(function() {
				    			if(sessionTimeoutTimer != null) {
				    				clearTimeout(sessionTimeoutTimer);
				    				sessionTimeoutTimer = null;
				    			}
				    						
				    			//세션타임 연장
					    		fnSetSessionExtension();

				    		}, 1000);
				    		
				    	}
					}else if(action === 'sessionTimeoutTimer'){
						
						//if( lastAccessedTime <= alertDisplayTime) {	//남은세션시간인 5분이하(정확하게 5분10초)이면 세션연장 팝업창 실행(보이기)
						if( lastAccessedTime <= alertDisplayTime + 50) {	//남은세션시간인 5분이하(정확하게 5분10초)이면 세션연장 팝업창 실행(보이기)
							fnSetSessionExtensionAlert();
						}else{	//남은시간이 5분이상이면 세션연장 팝업창 대기모드(숨김) 실행
							//console.log('대기모드 실행');

							//fnSetSessionTimeoutAction();
							
							fnSetSessionTimeoutCheckAction(accessedTimeCount);
						}
					}else if(action === 'parent') {	//부모창 사용중

						if( lastAccessedTime >= alertDisplayTime && lastAccessedTime != undefined) {
							sessionExtensionAlertFlag = false;
							
							if(sessionTimeInterval != null) {
								clearInterval(sessionTimeInterval);
							}
							
							$('.dimmLayer').css('z-index', 1010).fadeOut(200);
							$('.msgPopup').fadeOut(150).remove();
							
							fnSetSessionTimeoutStartAction(true);
						}
					}
				}else{
					var msg = data.msg;
					console.log('error msg: ', msg);
				}
			},
			function(data){
				alert("세션타임확인 실패하였습니다.");
				if(data===undefined) fnSetSessionEventUnBind(); 
				if(sessionTimeInterval != null) {
					clearInterval(sessionTimeInterval);
					sessionTimeInterval = null;
				}
				sessionTime = undefined;
			}
		);
		return sessionTime;
	}
	
	//세션 타임 연장
	function fnSetSessionExtension() {
		gf_ajax(
			"/Fwl/Common.do",
			{"pageFlag":'SESSION_SET_TIME'},
			function(data){
				var result = data.result;
				if(result ='success') {
					//console.log("세션연장완료: 연장 시간은 " + data.sessiontime + "입니다.");
					//console.log("세션연장");
					//fnSetSessionTimeoutStartAction();
					if(opener.parent.sessionTimeCheck.styleEditor) {
						opener.parent.sessionTimeCheck.styleEditor = false;
					}else{
						fnSetSessionTimeoutStartAction();
					}
				}else{
					console.log('세션타임 연장을 실패하였습니다.')
				}
			},
			function(data){
				alert("세션타임 연장을 실패하였습니다.");
          }
		);
	}
	
	//세션 타임 삭제
	function fnDelSessionTime() {
		gf_ajax(
			"/Fwl/Common.do",
			{"pageFlag":'SESSION_DEL_TIME'},
			function(data){
				console.log("세션타임이 삭제처리 되었습니다.");
			},
			function(data){
				alert("세션타임 삭제에 실패하였습니다.");
			}
		);
	}
	
	fnSetSessionEventBind();
		
})();
