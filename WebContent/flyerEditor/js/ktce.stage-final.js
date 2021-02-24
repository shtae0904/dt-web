/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE stage-final
* 설명     : 편집기 최종저장 기능 함수 정의 
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/

/*
 * KTCE Editor
 * @Package
 * @Description : KTCE 최종저장 이후 프로세스
 **/
(function() {

	var finalStage = function(info) {

		var fnLayer = $('#saveComplete')
			, finalSave = $('#finalSave')
			, goMyFlyer = $('#goMyFlyer')
			, preivewLayerTrigger = $('#goFunction')
			, previewLayer = $('#printPreview')
			, canvasTypeSelector = previewLayer.find('.canvasType').find('button')
			, fitSelector = previewLayer.find('.canvasFit').find('button')
			, printTrigger = $('#PRINT')
			, previewLayerCloser = $('#CANCEL')
			, downloadTrigger = $('#DOWNLOAD')
			, previewArea = $('.previewArea')
			, pageSelector = previewLayer.find('.pageSelector')
			, svgWidth = 0
			, svgHeight = 0
			, handFlag = false
			, info = KTCE.paperInfo
		
		//$('<div id="printArea"></div>').appendTo('body');
		//인쇄용 미리 로딩(이미지관련)
		if ( !$('#printArea').length ) {
			$('<div id="printArea"><div class="svgWrap"></div></div>').appendTo('body');
		}
		
		// 기본 정보에 의한 프린트 설정
		setPrint();

		// 다운로드 기능
		setDownloadFn();

		// 마이전단지 페이지로 이동
		goMyFlyer.on({
			click : function() {
				window.opener.location.href = "/Fwl/MyFlyer.do";
				window.close();
			}
		});

		// 저장 혹은 프린트 레이어 바인딩
		preivewLayerTrigger.on({
			click : function() {

				fnLayer.hide();
				previewLayer.fadeIn(250);
				
			}

		});

		// 프린트 하기
		printTrigger.on({
			click : function() {

				var dir = KTCE.paperInfo.canvasType == 'HD' ? '세로' : '가로';

				$('.checkAlert .txt1 span').html(KTCE.paperInfo.canvasSize + ' - ' + dir);

				$('.checkAlert').fadeIn(150, function() {

					$('.checkAlert .ok').off().on({
						click : function() {
							
							//ie 인쇄내용 미리 로딩				
							$('#printArea div.svgWrap').html('');
							//$('#printArea').css('display','block');
							var _cloneSVG = $('.svgWrap.active svg').clone();
							$('#printArea div.svgWrap').append($('.svgWrap.active svg'));
							
							//$(".previewArea").append(_cloneSVG);

							//$('#printArea .svgWrap svg').css({
							$('#printArea svg').css({
								width : svgWidth
								, height : svgHeight
								, transform: 'scale(1, 1) translate(-0.35%, 0px)'
								/*, transform: 'scale(1, 1) translate(-0.01%, 0px)'*/	//2018-01-09 이전
							});
							
							$('.checkAlert').fadeOut();
							//$('.pop_leaflet').hide();
							
							
							//setTimeout(function(){
								window.print();
								$(".previewArea .svgWrap.active").append(_cloneSVG);
								//$('.pop_leaflet').show();
								console.log('final print!')
							//}, 500);
							
						}
					});

				});



			}
		});

		// 레이어 닫기
		previewLayerCloser.on({
			click : function() {
				previewLayer.hide();
			}
		});

		// 최종저장
		finalSave.on({
			click : function() {

				//$('.dimmLoader').fadeIn(150);

				// validation
				fnNameValidate('#flyerName', function(result) {

					//console.log('validate end');

					if ( result ) {
						$.ajax({
							url:'/Fwl/FlyerApi.do',
							type:'post',
							data: {
								pageFlag : 'AF_FINAL_STORAGE'
								, flyerId : KTCE.paperInfo.flyerId
								, flyerName : $('#flyerName').val()
								, flyerTypeCode : $('#flyerTypeCode').find('option:selected').val()
								, editType : $('#editType').val()
							},
							success:function(data){
						
								if ( data.result != 'false' ) {

									//$('.dimmLoader').stop(true, true).fadeOut(150);

									KTCE.paperInfo.flyerName = $('#flyerName').val();
									KTCE.paperInfo.flyerTypeCode = $('#flyerTypeCode').find('option:selected').val();

									// 레이어 띄우기
									fnLayer.fadeIn(250);
									
								} else {
									alert('데이터 저장에 실패하였습니다. 다시 저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
								}

							}, error : function(e) {
								alert('데이터 저장에 실패하였습니다. 다시 저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
							}
						});
					} else {
						alert('제목은 최소 한글 2자 이상 최대 20자 이하로 입력해 주세요.');
					}

				});

			}
		});

		function imageToBase64(callback) {

			var svgWrap = $('.svgWrap')
				, i = 0;

			if ( svgWrap.eq(i).length ) svgLoop();

			function svgLoop() {

				var thisSvg = svgWrap.eq(i).children('svg')
					, image = thisSvg.find('image')
					, hrefArray = []
					, j = 0;

				if ( image.eq(j).length ) imageLoop();

				function imageLoop() {

					var _this = image.eq(j)
						, href = Base64.encode(_this.attr('xlink:href'))
					
					if((_this.attr('xlink:href').indexOf('data:image/png;base64,')) == -1){

						$.ajax({
							url:'/Fwl/FlyerApi.do',
							type:'post',
							data: {
								pageFlag : 'AF_CONVERT'
								, imageUrl : href
							},
							success:function(data){
								_this.attr('xlink:href', data.msg);
								hrefArray.push(data.msg);
								j += 1;
			
								if ( image.eq(j).length ) {
									imageLoop();
								} else {
									i += 1;
									if ( svgWrap.eq(i).length ) {
										svgLoop();
									} else {
										callback();
									}
								}
							}, error : function(e) {
								alert('이미지 전환 작업중 에러가 발생하였습니다. 다시 저장을 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
							}
						});
					} else {
						j += 1;
						if ( image.eq(j).length ) {
							imageLoop();
						} else {
							i += 1;
							if ( svgWrap.eq(i).length ) {
								svgLoop();
							} else {
								callback();
							}
						}
					}
				}
			}
		}

		function triggerDownload(imgURI){
			var evt = new MouseEvent('click', {
				view : window,
				bubble : false,
				cancelable : true
			});

			var a = document.createElement('a');
			a.setAttribute('download', 'fiyer-image.png');
			a.setAttribute('href', imgURI);
			a.setAttribute('target', '_blank');

			a.dispatchEvent(evt);
			$('.dimmLoader').stop(true, true).fadeOut(150).remove();
		}

		
		function fnDownload() {
			$('<div class="dimmLoader"></div>').appendTo('.previewLayerWrap');

			//var temp = Snap($(document.querySelector('svg')).clone()[0]);
			var temp = Snap($(document.querySelector('.previewArea .svgWrap.active svg')).clone()[0]);

			var browserType = getBrowserType();
						
			//최종저장 크롬브라우저 인쇄용 저장로직 ie로직으로 강제분기 처리			
			var browserChrome = false;
			if(browserType.indexOf('msie') > -1){
				browserChrome = false;
			}else{
				browserChrome = true;
			}
			
			if(browserType.indexOf('msie') > -1 || browserChrome){

			//if(browserType.indexOf('msie') > -1){
				tempSvg = $('<div id="tempSVG" style="position:absolute;left:-5000px;top:-5000px;overflow:hidden;"></div>').append($(temp.node)).appendTo('body');
				var tempSVGContentAll = $('#tempSVG svg>*').clone(true);
				var _width = parseFloat($(temp.node)[0].getAttribute("width"));
				var _height = parseFloat($(temp.node)[0].getAttribute("height"));
				var _style = $(temp.node).attr('style');

				try{
					var _viewBox = $("#tempSVG svg")[0].getAttribute('viewBox');	
					if(_viewBox == null ) {
						_viewBox = $("#tempSVG svg")[0].getAttribute('viewBox');
					}
				}catch(err){
					console.log('err', err);
				}
				var tempPrintSVGNode = "<svg id='cloneNode' style='" + _style + "' width='" + _width + "' height='" + _height + "' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='" + _viewBox + "'></svg>";	
				$("#tempSVG").html(tempPrintSVGNode);
				$("#cloneNode").append(tempSVGContentAll);
				
				temp = Snap($(document.getElementById('cloneNode'))[0]);
				
			}else{
				//tempSvg = $('<div></div>').append($(temp.node)).appendTo('body');
				//textArray = temp.select(".objOuter").selectAll(".textBoxWrap");
			}

			//단윈환산: 1mm --> 3.779527559px
			if(KTCE.paperInfo.canvasSize == "PS"){
				//ratio = 4.375;	//3500px: 5250px(실용지 사이즈의 154.3402777800286%); <-- local 서버에서 처리 못함(메모리 부족)
				//2267.7165354, 원본비율: 2.83464566925
				ratio = 3;	//2400px:3600px;
			}else if(KTCE.paperInfo.canvasSize == "A3"){
				ratio = 4.385;	//기존비율(2016년)
				//ratio = 2.1925; //인쇄용 1754px:2480px(실용지사이즈의 156.2556116745571%)
			}else if(KTCE.paperInfo.canvasSize == "A4"){
				ratio = 3.1;	//기존비율(2016년) //3.124603174648742 
				//ratio = 1.55;	//1240px:1754(실용지사이즈의 156.2301587324371%)
			}else{
				ratio = 2.185;	//기존비율(2016년)	
				//ratio = 1.0625;  //850px:1206px(실용지사이즈의 151.9566441463602%)
			}
	
			
			if($('#canvas').length != 0){
				$('#canvas').remove();
			}
			
			if(browserType.indexOf('msie') > -1){				
				//ie에서는 filter shadow 정수값이 임의의 값으로 들어가는 것을 방지
				//$(document.querySelectorAll('svg')[index]).clone()[0]
				var _currentSVGId = $(document.querySelector('.previewArea .svgWrap.active svg')).attr('id');

				//2017-12-06 : 템플릿 관리자기능 관련 filter 예외
				//$("#" + _currentSVGId).find('filter').each(function(idx, el){
				$("#" + _currentSVGId).find('defs:eq(0) filter').each(function(idx, el){
					var _currentFilterId = $(this).attr('id');
					var _w = parseFloat(document.getElementById(_currentFilterId).childNodes[0].getAttribute('stdDeviation'));
					$(temp.node).find('filter:eq(' + idx + ')')[0].childNodes[0].setAttribute('stdDeviation', _w);
				})

			}			

			//if(browserType.indexOf('msie') > -1){	//ie
			if(browserType.indexOf('msie') > -1 || browserChrome){	//ie, 크롬
				var css = styles(temp, null);
				var s = document.createElement('style');
				s.setAttribute('type', 'text/css');
				s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
				var defs = document.createElement('defs');
				defs.appendChild(s);
				var innerDefs = defs.innerHTML;
				if($(temp).find('defs').html() != undefined){
					innerDefs = $(temp.node).find('defs').html() +  innerDefs;	
				}
				$(temp.node).find('defs').append(innerDefs);
				
				//batik lib 에저장버그로  글꼴변경시 정규식 미처리를 사전에 예방하기 위하여 font batik lib에 맞게 변경
				var textArray = $(temp.node).find('g.textBoxWrap');
				var cellTextArray = $(temp.node).find('g.cellTextWrapper');
				textArray.each(function(idx, el){
					var fontFamily = $(this).css('font-family');
					var fontStyle = $(this).css('font-style');
					var fontWeight = $(this).css('font-weight');
					if(fontStyle === 'italic' && fontWeight !== 'bold') {
						$(this).css({'font-family': fontFamily + "_italic"});
					}else if(fontStyle !== 'italic' && fontWeight === 'bold') {
						$(this).css({'font-family': fontFamily+ "_bold"});
					}else if(fontStyle === 'italic' && fontWeight === 'bold') {
						$(this).css({'font-family': fontFamily+ "_italic_bold"});
					}
				});
				cellTextArray.each(function(idx, el){
					var fontFamily = $(this).css('font-family');
					var fontStyle = $(this).css('font-style');
					var fontWeight = $(this).css('font-weight');
					if(fontStyle === 'italic' && fontWeight !== 'bold') {
						$(this).css({'font-family': fontFamily + "_italic"});
					}else if(fontStyle !== 'italic' && fontWeight === 'bold') {
						$(this).css({'font-family': fontFamily+ "_bold"});
					}else if(fontStyle === 'italic' && fontWeight === 'bold') {
						$(this).css({'font-family': fontFamily+ "_italic_bold"});
					}
				});
			}
		
			$(temp.node).transit({scale:1, x : -(1/100) + '%'});
			
			var _currentWidth = parseFloat($(temp.node)[0].getAttribute("width"));
			var _currentHeight = parseFloat($(temp.node)[0].getAttribute("height"));
			
			var _newWidth = _currentWidth*ratio,
				_newHeight = _currentHeight*ratio;
			
					
			$($(temp.node)[0]).css({width: _newWidth, height: _newHeight});
			$(temp.node)[0].setAttribute('width', _newWidth);
			$(temp.node)[0].setAttribute('height', _newHeight);
			
			try{				
				if($("#" + temp.node.id + ".objectGroup>*").attr('fill') == 'rgba(0, 0, 0, 0)'){
					$("#" + temp.node.id + ".objectGroup>*").attr('fill', 'none');
				};	
				$(temp.node).find('g.xImage').removeAttr('mask', 'none');
				$(temp.node).find('g.textcover>rect').attr('fill', 'none');
				$(temp.node).find('g.text-cursor').remove();
				$(temp.node).find('.dataGroup').remove();
				$(temp.node).find(".cover~*").remove();
			}catch(err){}
			
			$(temp.node).css('margin-top', '0px');
			$(temp.node).css('margin-left', '0px');
	
			//ie cursor 객체 png 캡쳐방지를 위한 none 처리
			$(temp.node).find('g.text-cursor').css('display', 'none');			
		
			var _svg = $('<div></div>').append($(temp.node))
				, _svgHTML = _svg.html();
			KTCE.paperInfo.pngSVG = [];
			KTCE.paperInfo.pngSVG[0] = window.btoa( encodeURIComponent( _svgHTML ) );
			
			var _tempTimer = setInterval(function() {
				clearInterval(_tempTimer);
				_saveFile();
			}, 500);
		}
		
		
		function isExternal(url) {
			return url && url.lastIndexOf('http', 0) == 0 && url.lastIndexOf(window.location.host) == -1;
		}
		
		function styles(el, selectorRemap) {
			var css = "";
			var sheets = document.styleSheets;
			for (var i = 0; i < sheets.length; i++) {
				if (isExternal(sheets[i].href)) {
					console.warn("Cannot include styles from other hosts: " + sheets[i].href);
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
							}else{	// batik 라이브러리 local font적용을 위한 css삽입
								var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
								css += selector + " { " + rule.style.cssText + " }\n";									
							}
						}
					}
				}
			}
			return css;
		}
		
		function _saveFile() {

			console.log('인쇄용 DATA전송');

			var browserType = getBrowserType();
				// 재사용 전단지일 경우
			if ( KTCE.paperInfo.flyerId != '' && KTCE.paperInfo.flyerId != undefined ) {
				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					data: {
						pageFlag : 'AF_IMG_SAVE'	//AF_SAVE 
						, flyerId : KTCE.paperInfo.flyerId
						, flyerName : KTCE.paperInfo.flyerName
						, flyerSttusCd : KTCE.paperInfo.flyerSttusCd
						, canvasSize : KTCE.paperInfo.canvasSize
						, canvasType : KTCE.paperInfo.canvasType
						, tmptId : KTCE.paperInfo.tmptId
						, flyerTypeCode : KTCE.paperInfo.flyerTypeCode
						, hwYn : KTCE.paperInfo.hwYn
						, arrFlyerContent : KTCE.paperInfo.pngSVG
						, regFileKey : null
						, thumbImg : null
						, browserType : browserType
					},
					success:function(data){
						if  ( data.result == 'success' ) {
							console.log('print PNG downloading....');
							try {
								var img = new Image();
								img.crossOrigin = 'Anonymous';
								img.onload = function(){
									var fileName = "flyer-image.png";
									// 1. 이미지(base64) 데이터를 Blob Object로 변환
									var imgData = window.atob(img.src.split(",")[1]);
									//var imgData = window.atob(img.src.replace(/^data:image\/(png|jpg);base64,/, ""));
									var len = imgData.length;
									var buf = new ArrayBuffer(len);	//bit > Buffer
									var view = new Uint8Array(buf);	//bufferfmf 8bit Unsigned Int..
									var blob, i;
									
									for(i=0; i<len; i++) {
										//view[i] = imgData.charCodeAt(i) && 0xff;	//비트 마스킹을 통해 msb를 보호 <==bit mask처리시 이미지정상 생성안됨(없음)
										view[i] = imgData.charCodeAt(i);
									}
									imgData = null;
									img = null;
									
									//Blob 객체를 image/png 타입으로 생성(application/octet-stream도 가능)
									//const blobSpported = new Blob(['a']).size === 1; //브라우져 지원여부
									blob = new Blob([view], { 
										//type: "application/octet-stream"
										type: "image/png"
									});
									view = null;
									
									/*
									const chunks = [];
									//이미지를 원하는 만큼 잘라쓰기시
									const _byte = 1024;
									const chunkSize = Math.ceil(blob.size /_byte);
									for(let i=0; i <chunkSize; i += 1) {
										const startByte = _byte * i;
										const endByte = ((startByte + _byte) > blob.size) ? blob.size : (startByte + _byte);
										chunks.push(
											blob.slice(startByte, endByte , blob.type)
										);
									}
									const blob2 = new Blob(chunks, blob.type);
									
									//const _url_ = window.URL.createObjectURL(chunks[0]);
									const _url_ = window.URL.createObjectURL(blob2);
									const _img = document.createElement("img");
									//document.body.appendChild(_img);
									_img.src = _url_;
									_img.width = 400;
									window.URL.revokeObjectURL(_url_);
									*/
								
									/*
									 * (참고: IE10+지원)
									 * - msSaveOrOpenBlob: 저장 및 열기 단추를 모두 제공 
									 * - msSaveBlob: 저장 단추만 사용자에게 제공
									 */
									// 2. 저장 및 열기
									// blob과 저장될 파일명
									if(window.navigator.msSaveOrOpenBlob) { //IE인 경우
										console.log('ie!!');
										
										window.navigator.msSaveOrOpenBlob(blob, fileName);
									}else{
										console.log('not ie!!')
										// msSaveOrOpenBlob 미지원시 즉, IE가 아닌경우 
										// Blob객체를 URL기능으로 재사용
										var url = URL.createObjectURL(blob); 
										var a = document.createElement('a');
										a.setAttribute('href', url);
										a.setAttribute('download', fileName);
										a.style.display = "none";
										document.body.appendChild(a);	//DOM 바인딩
										a.click();
										setTimeout(function() {
											document.body.removeChild(a);
											URL.revokeObjectURL(url);	// URL을 DOM과 바인딩후 해제하여 메모리 누수 방지
										}, 100);
									}
								}
								img.src = data.msg;
								
								
								
								
								
								
								/*
								function loadXHR(url) {
									return new Promise((resolve, reject) => {
										try {
											const xhr = new XMLHttpRequest();
											xhr.open("GET", url);
											xhr.responseType = "blob";
											xhr.onerror = evnet => {
												reject('Network error: ${evnet}');
											};
											xhr.onload = () => {
												if(xhr.status === 200) {
													resolve(xhr.response);
												}else{
													jecect('XHR load error : ${xhr.statusText');
												}
											};
											xhr.send();
										}catch(err){
											reject(err.message);
										}
									});
								}
								
								loadXHR('http~~')
								.then(blob => {
									const url = window.URL.createObjectURL(blob)
									documnet.getElementById("image").src = url;
									return url;
								})
								.then(url => {
									// Ater DOM updates...
									process.nextTick(() => {
										window.URL.revokeObjectURL(url);
									});
								});
								*/
							}catch(err){
								alert('이미지 저장에 실패하였습니다. 다시 시도 해 보세요.');
								$('.dimmLoader').stop(true, true).fadeOut(150).remove();
							}
						} else {
							alert('이미지 저장에 실패하였습니다. 다시 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
							$('.dimmLoader').stop(true, true).fadeOut(150).remove();
						}
					}
					, error : function(e) {
						alert('이미지 저장하기에 실패하였습니다.');
						$('.dimmLoader').stop(true, true).fadeOut(150).remove();
						console.log(e)
					}, complete: function(e){
						$('.dimmLoader').stop(true, true).fadeOut(150).remove();
					}
				}).done(function(){$(".action_loader").hide();});
			} // end of 임시저장
		}
		
		function _saveFile_20200305() {

			console.log('인쇄용 DATA전송');

			var browserType = getBrowserType();
				// 재사용 전단지일 경우
			if ( KTCE.paperInfo.flyerId != '' && KTCE.paperInfo.flyerId != undefined ) {

				$.ajax({
					url:'/Fwl/FlyerApi.do',
					type:'post',
					data: {
						pageFlag : 'AF_IMG_SAVE'	//AF_SAVE 
						, flyerId : KTCE.paperInfo.flyerId
						, flyerName : KTCE.paperInfo.flyerName
						, flyerSttusCd : KTCE.paperInfo.flyerSttusCd
						, canvasSize : KTCE.paperInfo.canvasSize
						, canvasType : KTCE.paperInfo.canvasType
						, tmptId : KTCE.paperInfo.tmptId
						, flyerTypeCode : KTCE.paperInfo.flyerTypeCode
						, hwYn : KTCE.paperInfo.hwYn
						, arrFlyerContent : KTCE.paperInfo.pngSVG
						, regFileKey : null
						, thumbImg : null
						, browserType : browserType
					},
					success:function(data){
						if  ( data.result == 'success' ) {
							
							//20200227 이전 인쇄용 이미지 downloading 기능
							//var imgURI = data.msg;//'data:image/png;base64,' + data.streamMsg;//'data:image;base64,' + data.streamMsg;
							//document.downFrm.dataUri.value = imgURI;
							//document.downFrm.submit();
							//$('.dimmLoader').stop(true, true).fadeOut(150).remove();
							
							//20200227 쇄용 이미지 downloading 기능개선
							console.log('print PNG downloading....');
							var img = new Image();
							img.crossOrigin = 'Anonymous';
							img.onload = function(){;
								var fileName = "flyer-image.png";
								// 1. 이미지(base64) 데이터를 Blob Object로 변환
								var imgData = window.atob(img.src.split(",")[1]);
								//var imgData = window.atob(img.src.replace(/^data:image\/(png|jpg);base64,/, ""));
								var len = imgData.length;
								var buf = new ArrayBuffer(len);	//bit > Buffer
								var view = new Uint8Array(buf);	//bufferfmf 8bit Unsigned Int..
								var blob, i;
								
								for(i=0; i<len; i++) {
									//view[i] = imgData.charCodeAt(i) && 0xff;	//비트 마스킹을 통해 msb를 보호 <==bit mask처리시 이미지정상 생성안됨(없음)
									view[i] = imgData.charCodeAt(i);
								}
								imgData = null;
								imgURI = null;
								img = null;
								
								//Blob 객체를 image/png 타입으로 생성(application/octet-stream도 가능)
								//const blob = new Blob([view], {});
								//const chunk = blob.slice(0,1024, 'image/png');	//1kb의 png blob 객체 생성
								//const blobSpported = new Blob(['a']).size === 1; //브라우져 지원여부
								blob = new Blob([view], { 
									//type: "application/octet-stream"
									type: "image/png"
								});
								view = null;
								
								/*
								 * (참고: IE10+지원)
								 * - msSaveOrOpenBlob: 저장 및 열기 단추를 모두 제공 
								 * - msSaveBlob: 저장 단추만 사용자에게 제공
								 */
								// 2. 저장 및 열기
								// blob과 저장될 파일명
								if(window.navigator.msSaveOrOpenBlob) { //IE인 경우
									console.log('ie!!');
									window.navigator.msSaveOrOpenBlob(blob, fileName);
								}else{
									console.log('not ie!!')
									// msSaveOrOpenBlob 미지원시 즉, IE가 아닌경우 
									// Blob객체를 URL기능으로 재사용
									//var url = URL.createObjectURL(blob); 
									var a = document.createElement("a");
									a.style = "display: none";
									//a.href = url;
									a.href = img.src;
									a.download = fileName;
									
									document.body.appendChild(a);
									a.click();
									
									setTimeout(function() {
										document.body.removeChild(a);
										//URL.revokeObjectURL(url);	//js에서 URL.createObjectURL 사용에 따른 생성된 URL 해제로 메모리 누수 방지
										/**
										//const url = URL.createObjectURL(blob); //Create Blob URL
										//a create 중략
										//a.href = url
										//document.body.appendChild(img);		 //DOM 바인딩
										//URL.revokeObjectURL(url);				 // URL을 DOM과 바인딩후 해제하여 메모리 누수 방지
										 */
									}, 100);
								}
								setTimeout(function() {
									blob = null;
									$('.dimmLoader').stop(true, true).fadeOut(150).remove();
									console.log('Pring PNG downloading success');
								}, 100);
							}
							img.src = data.msg;
						} else {
							alert('이미지 저장에 실패하였습니다. 다시 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
							$('.dimmLoader').stop(true, true).fadeOut(150).remove();
						}
					}
					, error : function(e) {
						alert('이미지 저장하기에 실패하였습니다.');
						$('.dimmLoader').stop(true, true).fadeOut(150).remove();
						console.log(e)
					}
				}).done(function(){$(".action_loader").hide();});
			} // end of 임시저장
		}
		
		function setDownloadFn() {
			downloadTrigger.on({
				click : function() {
					fnDownload();
				}
			});
		}
		
		
		function setPrint() {

			var typeIdx = 0
				, sizeIdx = 0
				, width = 0
				, height = 0

			canvasTypeSelector.removeClass('active').addClass('deactive');

			switch(info.canvasSize) {
				case 'A3' :
					typeIdx = 0;
					break;
				case 'A4' :
					typeIdx = 1;
					break;
				case 'A5' :
					typeIdx = 2;
					break;
			}

			canvasTypeSelector.eq(typeIdx).addClass('active').removeClass('deactive');

//			width = getPaperSize(300, info.canvasType, info.canvasSize).width;
//			height = getPaperSize(300, info.canvasType, info.canvasSize).height;
			width = getPaperSize(512, info.canvasType, info.canvasSize).width;
			height = getPaperSize(512, info.canvasType, info.canvasSize).height;

			svgWidth = width;
			svgHeight = height;

		}

	}

	KTCE.finalStage = finalStage;

})();