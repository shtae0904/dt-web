/**
 * id값으로 전단지 사용하기
 * @param flyerId
 * @returns successFunc
 */
function goModify(flyerId, hwYn, editType) {
	
	var destination = ''
		, form = $('#editfrm');
	var b_Width = (parseInt(screen.width, 10) / 2) - 700, b_Height = (parseInt(screen.height, 10) / 2) - 450;
	
	//var pop = window.open( "/flyerdocs/html/loading.html" , "FLYER_EDITER", "width=1400,height=790, left=" + b_Width + ",top =" + b_Height /*+",history=no,status=no,resizable=no,scrollbars=no,menubar=no"*/);
	
	var loadingImg = "/flyerEditor/images/common/loading.gif";
	if(document.location.href.indexOf("https") > -1) {
		loadingImg = "https://" + document.location.host + "/flyerEditor/images/common/loading.gif";
	}else {
		loadingImg = "http://" + document.location.host + "/flyerEditor/images/common/loading.gif";
	}
    var str = '<div class="pop_fixed" style="position: fixed; left: 50%; top: 50%; width: 120px; margin: -50px 0 0 -60px;">';
        str += '<div style="background: #fff;text-align: center;padding: 10px; border-radius: 8px 8px 8px 8px; -moz-border-radius: 8px 8px 8px 8px; -webkit-border-radius: 8px 8px 8px 8px;">';
        //str += '    <img src="/flyerEditor/images/common/loading.gif" alt="로딩중" width="70" />';
        str += '    <img src="' + loadingImg + '" alt="로딩중" width="70" />';
        str += '</div>';
        str += '</div>';
        
    var pop = window.open( "" , "FLYER_EDITER", "width=1400,height=790, left=" + b_Width + ",top =" + b_Height + ",resizable=yes, scrollbars=yes");
    	
    if(pop.window.location.href.indexOf("FlyerEditor.do") > -1) {
        pop.addEventListener('unload', function(){
            pop.document.body.innerHTML = str;
        });
    }else{
        pop.document.body.innerHTML = str;
    }
    
	if(pop == null){
		//alert("팝업차단기능을 예외처리나 해제해 주세요");
		alert("팝업차단기능을 해제해 주세요");
	}else{
		
		if ( hwYn == 'Y' ) {
			destination = 'stage3_hand';
		} else {
			destination = 'stage3_normal';
		}

		if (form.find('input[name=flyerId]').length ) form.find('input[name=flyerId]').remove();
		if (form.find('input[name=refFlyerId]').length ) form.find('input[name=refFlyerId]').remove();
		if (form.find('input[name=editType]').length ) form.find('input[name=editType]').remove();

		form.append($('<input type="hidden" name="flyerId" value="' + flyerId + '">)'));
		if(editType == 'use')form.append($('<input type="hidden" name="refFlyerId" value="' + flyerId + '">)'));
		if(editType == 'modify')form.append($('<input type="hidden" name="editType" value="modify">)'));

		form.find("input[name=pageFlag]").val(destination);
		form.attr("target","FLYER_EDITER");
		form.submit();
		
	}
	
}
function goModify2(id,editType) {

	var destination = ''
		, info = null
		, form = $('#editfrm');
	var b_Width = (parseInt(screen.width, 10) / 2) - 700, b_Height = (parseInt(screen.height, 10) / 2) - 450;
	var pop = window.open( "/flyerdocs/html/loading.html" , "FLYER_EDITER", "width=1400,height=790, left=" + b_Width + ",top =" + b_Height /*+",history=no,status=no,resizable=no,scrollbars=no,menubar=no"*/);
	/*
	var pop = window.open( "" , "FLYER_EDITER", "width=1400,height=790, left=" + b_Width + ",top =" + b_Height + ", resizable=yes, scrollbars=yes" +",history=no,status=no,resizable=no,scrollbars=no,menubar=no");
    var str = '<div class="pop_fixed" style="position: fixed; left: 50%; top: 50%; width: 120px; margin: -50px 0 0 -60px;">';
        str += '<div style="background: #fff;text-align: center;padding: 10px; border-radius: 8px 8px 8px 8px; -moz-border-radius: 8px 8px 8px 8px; -webkit-border-radius: 8px 8px 8px 8px;">';
        str += '    <img src="/flyerEditor/images/common/loading.gif" alt="로딩중" width="70" />';
        str += '</div>';
        str += '</div>';
    
    if(pop.window.location.href.indexOf("FlyerEditor.do") > -1) {
        pop.addEventListener('unload', function(){
            pop.document.body.innerHTML = str;
        });
    }else{
        pop.document.body.innerHTML = str;
    }
    */

/*
	//ie 접속사용자 ie11 접속여부 확인
	var agentChk = getBrowserType();
	if(agentChk === 'msie' || agentChk === 'msie12') {
		alert('IE 11(Internet Explorer 11) 브라우저로 접속해 주세요!!')
		location.href = './flyer/error/browser_error.jsp';
	}
*/

	if(pop == null){
		//alert("팝업차단기능을 예외처리나 해제해 주세요");
		alert("팝업차단기능을 해제해 주세요");
	}else{
		$.ajax({
			url:'/Fwl/FlyerApi.do',
			type:'post',
			data: {
				pageFlag : 'AF_DETAIL'
				, flyerId : id
				, contentPage : ''
			},
			success:function(data){

				info = data.flyerInfo;

				if ( info.hwYn == 'Y' ) {
					destination = 'stage3_hand';
				} else {
					destination = 'stage3_normal';
				}

				if ( form.find('input[name=flyerId]').length ) form.find('input[name=flyerId]').remove();
				if ( form.find('input[name=reFflyerId]').length ) form.find('input[name=reFflyerId]').remove();

				form.append($('<input type="hidden" name="flyerId" value="' + info.flyerId + '">)'));
				if(editType == 'use')form.append($('<input type="hidden" name="refFlyerId" value="' + info.flyerId + '">)'));
				if(editType == 'modify')form.append($('<input type="hidden" name="editType" value="modify">)'));

				form.find("input[name=pageFlag]").val(destination);
				form.attr("target","FLYER_EDITER");
				form.submit();

			}
            ,beforeSend: function(){
                pop.addEventListener('unload', function(){
                    pop.document.body.innerHTML = str;
                });
            }
		});
        
	}
	
}

function setSize(info) {

	var typeIdx = 0
		, sizeIdx = 0
		, width = 0
		, height = 0

	width = getPaperSize(512, info.canvasType, info.canvasSize).width;
	height = getPaperSize(512, info.canvasType, info.canvasSize).height;
		
	return {
		width : width
		, height : height
	}

}

function createSVGcontent(info, previewArea, pageSelector) {

	previewArea.html('');
	
	var svgWidth = setSize(info).width
		, svgHeight = setSize(info).height;

	$("#detailTitle").attr("canvas-size", info.canvasSize);
	
	// 일반 전단지
	if ( info.hwYn == 'N' ) {

		pageSelector.filter('.hand').hide();

		var frontContent = $('<div class="svgWrap active">' + info.content[0].content + '</div>');

		frontContent.appendTo(previewArea);
		pageSelector.filter('.normal').find('button').removeClass("active");
		pageSelector.filter('.normal').find('button').first().addClass("active");

		if ( info.content[1] != null ) {
			var backContent = $('<div class="svgWrap">' + info.content[1].content + '</div>').hide()
			backContent.appendTo(previewArea);

			pageSelectorBind(info, pageSelector.filter('.normal'));
			pageSelector.filter('.normal').find('button').last().show();
			
		} else {
			pageSelector.filter('.normal').find('button').last().hide();
		}
		pageSelector.filter('.normal').show();
		
		var _transInfo, _viewHeight;
		if(info.canvasType == 'WD' ){
			if(info.canvasSize == 'PS') {
				_transInfo = "scale(0.43) translate(-66%, -66%)";
				_viewHeight = parseFloat($(info.content[0].content).attr("height")) * 0.43 + 2;
			}else{
				_transInfo = "scale(0.45, 0.45) translate(-60%, -60%)";
				_viewHeight = parseFloat($(info.content[0].content).attr("height")) * 0.45 + 8;
			}
		} else {
			var _transInfo = "scale(0.65, 0.65) translate(-27%, -27%)";
			var _viewHeight = parseFloat($(info.content[0].content).attr("height")) * 0.65;
		}
		
		$('.svgWrap svg').css({
			width : $(info.content[0].content).attr("width")
			, height : $(info.content[0].content).attr("height")
			, transform : _transInfo
		});	
		$('div.svgWrap').css('height', _viewHeight + 'px');
		
	// 손글씨
	} else if ( info.hwYn == 'Y' ) {

		var contLength = info.content.length

		pageSelector.filter('.normal').hide();
		pageSelector.filter('.normal').find('button').removeClass("active");

		$.each(info.content, function(i, el) {
			var cont = $('<div class="svgWrap">' + el.content + '</div>')
			cont.appendTo(previewArea);
		});

		pageSelector.filter('.hand').empty();
		for ( var i=0; i<contLength; i++ ) {
			$('<button type="button" value="'+ i +'">' + (i+1) + '</button>').appendTo(pageSelector.filter('.hand'));
		}

		pageSelector.filter('.hand').find('button').first().addClass('active');
		pageSelector.filter('.hand').show();
		
		$('.svgWrap').hide();
		$('.svgWrap').first().addClass('active').show();

		pageSelectorBind(info, pageSelector.filter('.hand'));
		
		var _transInfo, _viewHeight;
		if(info.canvasType == 'WD' ){
			if(info.canvasSize == 'PS') {
				_transInfo = "scale(0.43) translate(-66%, -66%)";
				_viewHeight = parseFloat($(info.content[0].content).attr("height")) * 0.43 + 2;
			}else{
				_transInfo = "scale(0.45, 0.45) translate(-60%, -60%)";
				_viewHeight = parseFloat($(info.content[0].content).attr("height")) * 0.45 + 8;
			}
		} else {
			_transInfo = "scale(0.65, 0.65) translate(-27%, -27%)";
			_viewHeight = parseFloat($(info.content[0].content).attr("height")) * 0.65;
		}
		
		$('.svgWrap svg').css({
			width : $(info.content[0].content).attr("width")
			, height : $(info.content[0].content).attr("height")
			, transform : _transInfo
		});	
		
		$('div.svgWrap').css('height', _viewHeight + 'px');
	}
	// 편집기 확대비율에 대한 미리보기 위치값 정상적용
	$('.svgWrap svg').css({'margin-top': 0, 'margin-left': 0});	
}

function pageSelectorBind(info, pageSelector) {

	pageSelector.find('button').each(function(i) {

		$(this).on({
			click : function() {
				pageSelector.find('button').removeClass('active');
				$(this).addClass('active');

				$('.svgWrap').removeClass('active').hide();
				$('.svgWrap').eq(i).addClass('active').show();
				
				// 인쇄대상
				$('#printArea .svgWrap').removeClass('active').hide();
				$('#printArea .svgWrap').eq(i).addClass('active').show();
			}
		});

	});

}

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
		width = constNum
		height = (width*x)/y
	}

	return {
		width : width
		, height : height
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
	$('<div class="dimmLoader"></div>').appendTo('.pop_leaflet_view');
	var index = $('.page_info > .active').val();
	
	var temp = Snap($(document.querySelectorAll('svg')[index]).clone()[0]);
	
	var tempSvg = $('<div id="tempSVG" width="100" height="100" style="position:absolute;left:-5000px;top:-5000px;overflow:hidden;"></div>').append($(temp.node)).appendTo('body');
	
	//단윈환산: 1mm --> 3.779527559px
	if($("#detailTitle").attr("canvas-size") == "PS"){
		ratio = 3;
	}else if($("#detailTitle").attr("canvas-size") == "A3"){
		ratio = 4.385;	//기존비율(2016년)
	}else if($("#detailTitle").attr("canvas-size") == "A4"){
		ratio = 3.1;
	}else{
		ratio = 2.185;	
	}
	
	if($('#canvas').length != 0){
		$('#canvas').remove();
	}

	var browserType = getBrowserType();
			
	//최종저장 크롬브라우저 인쇄용 저장로직 ie로직으로 강제분기 처리			
	var browserChrome = false;
	if(browserType.indexOf('msie') > -1){
		browserChrome = false;					
		//ie에서는 filter shadow 정수값이 임의의 값으로 들어가는 것을 방지
		//$(document.querySelectorAll('svg')[index]).clone()[0]
		var _currentSVGId = $(document.querySelectorAll('svg')[index]).attr('id');
		//2017-12-06 : 템플릿 관리자기능 관련 filter 예외
		//$("#" + _currentSVGId).find('filter').each(function(idx, el){
		$("#" + _currentSVGId).find('defs:eq(0) filter').each(function(idx, el){		
			if($(el).find('feGaussianBlur').length < 1) return;
			var _currentFilterId = $(this).attr('id');
			var _w = parseFloat(document.getElementById(_currentFilterId).childNodes[0].getAttribute('stdDeviation'));
			$(temp.node).find('filter:eq(' + idx + ')')[0].childNodes[0].setAttribute('stdDeviation', _w);
		})		
	}else{
		browserChrome = true;
	}
	
	_svgWidth = $(flyerInfo.content[0].content).attr('width');
	_svgHeight = $(flyerInfo.content[0].content).attr('height');
	$(temp.node).attr({'width': _svgWidth, 'height':_svgHeight});
	
	if(browserType.indexOf('msie') > -1){	//ie
		var css = styles(temp, null);
		var s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
		var defs = document.createElement('defs');
		defs.appendChild(s);
		
		var innerDefs = defs.innerHTML;
		
		//if($(temp.node).find('defs').html() != undefined){
		if($(temp).find('defs').html() != undefined){
			innerDefs = $(temp.node).find('defs').html() + innerDefs;	
		}
		
		// 배경 템플릿 관리자 기능 관련 예외적용
		$("#" + $(temp.node).attr('id') + '>defs').append(innerDefs);

		$(temp.node).transit({scale:1, x : -(1/100) + '%'});
		
		var _currentWidth = parseFloat($(temp.node)[0].getAttribute("width"));
		var _currentHeight = parseFloat($(temp.node)[0].getAttribute("height"));
		var _newWidth = _currentWidth*ratio,
			_newHeight = _currentHeight*ratio;
		$($(temp.node)[0]).css({width: _newWidth, height: _newHeight});
		$(temp.node)[0].setAttribute('width', _newWidth);
		$(temp.node)[0].setAttribute('height', _newHeight);
		
		try{
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
		
		flyerInfo.pngSVG = [];
		flyerInfo.pngSVG[0] = window.btoa( encodeURIComponent( _svgHTML ) );

		//_svg.remove();
		
		var _tempTimer = setInterval(function() {
			clearInterval(_tempTimer);
			_saveFile();
		}, 500);
		
	}else{		
		try{
			$(temp.node).removeAttr('xmlns:ns1');
			$(temp.node).removeAttr('ns1:xmlns:space');

			if($(temp.node).attr('xmlns:xlink') === undefined || $(temp.node).attr('xmlns:xlink')=== ''){
				$(temp.node).attr('xmlns:xlink', 'http://www.w3.org/1999/xlink');
			}
		}catch(err){}
		
		$(temp.node).transit({scale:1, x : -(1/100) + '%'});
		convertToBase64EncodeImage(temp, tempSvg, ratio);
	}
}


//svg text만 이미지화(ie11 서블릿 글꼴이슈에 따른 작업)
function importSvgTextToPng(obj, _currentWidth, _currentHeight, _newWidth, _newHeight, ratio) {
	var _width = _currentWidth,
		_height = _currentHeight;
	
	var _tempSVG = $("#tempSVG svg");
	var tempCloneNode = _tempSVG.attr('id', 'cloneNode');
	
	var temp = Snap($(document.getElementById('cloneNode'))[0]);
	
	//temp.select(".objOuter").
	var textArray = temp.select(".objOuter").selectAll(".textBoxWrap");
	var textArrayChilden = temp.select(".objOuter").selectAll(".textBoxWrap text");
	for(var i=0; i < textArray.length; i++){
		$(textArray[i])[0].attr('fontSize', $(textArrayChilden[i])[0].attr('fontSize'));
	}
	
	var tempTextSVG = $('#cloneNode .objOuter .objectGroup .textBoxWrap').clone();
	
	$('#cloneNode .objOuter .objectGroup .textBoxWrap').remove();
	var tempAllSVG = $('#cloneNode>*').clone();
	
	var _style = _tempSVG.attr('style');
	
	try{
		var _viewBox = document.getElementById("cloneNode").getAttribute('viewBox');	
		if(_viewBox == null ) {
			_viewBox = document.getElementById("cloneNode").getAttribute('viewbox');
		}
	}catch(err){
		console.log('err', err);
	}
	
	var tempSVGNode = "<svg id='cloneNode' style='" + _style + "' width='" + _width + "' height='" + _height + "' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='" + _viewBox + "'></svg>";	
	$("#tempSVG").html(tempSVGNode);
	
	var tempCoverSVG = $('#cloneNode .cover').clone();

	$('#cloneNode>*').remove();
	//$('#cloneNode').append(tempCoverSVG);
	$('#cloneNode').append(tempTextSVG);
	
	var cloneSVGNode = document.getElementById("cloneNode");
	
	$(cloneSVGNode).transit({scale:1, x : -(1/100) + '%'});
	
	var _newWidth = _currentWidth*ratio,
		_newHeight = _currentHeight*ratio;

	$(cloneSVGNode).css({width: _newWidth, height: _newHeight});
	$(cloneSVGNode)[0].setAttribute('width', _newWidth);
	$(cloneSVGNode)[0].setAttribute('height', _newHeight);
	
	try{
	    document.getElementById("cloneNode").expandoProperty = cloneSVGNode;
	}catch(err){
		console.log('err', err);
	}
	var tempCloneNodeToString = null;
	
	if (cloneSVGNode.outerHTML) {
		tempCloneNodeToString = cloneSVGNode.outerHTML;
	} else if (XMLSerializer) {tempCloneNodeToString = new XMLSerializer().serializeToString(cloneSVGNode);
		try{
			document.getElementById("cloneNode").expandoProperty = null;
		}catch(err){
			console.log('err', err);
		}
	}

	var canvas = document.createElement('canvas');
	$(canvas).attr('tempCanvas');
	$(canvas).css('display', 'none')
	$('body').append(canvas);
	try{
		canvas.expandoProperty = canvas;
	}catch(err){
		console.log('err', err);
	}

	canvas.width = _width;
	canvas.height = _height;

	canvg(canvas, tempCloneNodeToString, {useCORS : true, renderCallback : function(dom){
	    //var svg = (new XMLSerializer()).serializeToString(dom);
		setTimeout(function(e) {
	        var imgURI = canvas.toDataURL('image/png');
	        //console.log('canvas capture completed!');
	        //console.log('imgURI created complete');
	        var tempTextSVG = $('#cloneNode>*').remove();
	        
	        $('#cloneNode').append(tempAllSVG);
	    	
	        var SVG_NS = 'http://www.w3.org/2000/svg';
	        var XLink_NS = 'http://www.w3.org/1999/xlink';
	        var tempImage = document.createElementNS(SVG_NS, 'image');
	        tempImage.setAttributeNS(null, 'width',_width);
	        tempImage.setAttributeNS(null, 'height', _height);
	        tempImage.setAttributeNS(XLink_NS, 'xlink:href', imgURI);

	        $('#cloneNode .objectGroup').append(tempImage);

	        imgURI = null;
	        try{
		        //document.getElementById("myCanvas").expandoProperty = null;
		        canvas.expandoProperty = null;
	        }catch(err){
	    		console.log('err', err)
	    	}

	        console.log('===================================================================');
	        console.log(':: 최종 PNG변환용 DATA 준비완료!! ::');
	        //console.log($('#cloneSVG').html());
	        console.log('===================================================================');
	       
			var _svgHTML = $("#tempSVG").html();
			flyerInfo.pngSVG = [];
			flyerInfo.pngSVG[0] = window.btoa( encodeURIComponent( _svgHTML ) );
	
			var _tempTimer = setInterval(function() {
				clearInterval(_tempTimer);
				_saveFile();
				$("#tempSVG").remove();
				$(canvas).remove();
			}, 500);
		
	    }, 300);
		
	}});
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


function _saveFile() {

	var browserType = getBrowserType();
	// 재사용 전단지일 경우
	if ( flyerInfo.flyerId != '' && flyerInfo.flyerId != undefined ) {
		console.log('SVG-Data uploading....');
		$.ajax({
			url:'/Fwl/FlyerApi.do',
			type:'post',
			timeout: 1000*60*2,	//2분설정
			data: {
				pageFlag : 'AF_IMG_SAVE'	//AF_SAVE 
				, flyerId : flyerInfo.flyerId
				, flyerName : flyerInfo.flyerName
				, flyerSttusCd : flyerInfo.flyerSttusCd
				, canvasSize : flyerInfo.canvasSize
				, canvasType : flyerInfo.canvasType
				, tmptId : flyerInfo.tmptId
				, flyerTypeCode : flyerInfo.flyerTypeCode
				, hwYn : flyerInfo.hwYn
				, arrFlyerContent : flyerInfo.pngSVG
				, regFileKey : null
				, thumbImg : null
				, browserType : browserType
			},
			beforeSend:function() {
				//console.log('print svg-data uploading....');
				setTimeout(function() {
					console.log('Convert SVG to PNG....');
				}, 1500);
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
								var url = URL.createObjectURL(blob); 
								var a = document.createElement('a');
								//a.setAttribute('href', img.src);
								a.setAttribute('href', url);
								a.setAttribute('download', fileName);
								a.style.display = "none";
								document.body.appendChild(a);	//DOM 바인딩
								a.click();
								//document.boby.removeChild(a);
								
								setTimeout(function() {
									document.body.removeChild(a);
									URL.revokeObjectURL(url);	// URL을 DOM과 바인딩후 해제하여 메모리 누수 방지
								}, 100);
							}
							setTimeout(function() {
								blob = null;
								$('.dimmLoader').stop(true, true).fadeOut(150).remove();
								$(".action_loader").hide();
								console.log('Pring PNG downloading success');
							}, 100);
						}
						img.src = data.msg;
					}catch(err){
						alert('이미지 저장에 실패하였습니다. 다시 시도 해 보세요.');
						$('.dimmLoader').stop(true, true).fadeOut(150).remove();
					}
				} else {
					alert('이미지 저장에 실패하였습니다. \n다시 시도하시거나 관리자에게 문의해 주시기 바랍니다.');
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
		}).done(function(){
			
		});


	} // end of 임시저장
}

function convertToBase64EncodeImage(temp, tempSvg, ratio) {
	var _w = parseFloat($(temp.node)[0].getAttribute("width"))*ratio,
		_h = parseFloat($(temp.node)[0].getAttribute("height"))*ratio;

	$($(temp.node)[0]).css({width: _w, height: _h});
	$(temp.node)[0].setAttribute('width', _w);
	$(temp.node)[0].setAttribute('height', _h);

	var svg = $(temp.node)[0];

	var image = temp.selectAll('image');
	//console.log(temp.select('#svgBg'))
	var svgBgEle = temp.select('#svgBg');
	var svgBgImage = '';
	if(svgBgEle != null) {
		svgBgImage = temp.select('#svgBg').node.getAttribute('xlink:href');
	}
	//var svgBgImage = temp.select('#svgBg').node.getAttribute('xlink:href');
	var objectGroupImage = temp.selectAll('.objectGroup image');
	var coverImage = temp.selectAll('.cover image');
	var arrImg = new Array();

	//배경이미지만 있고 이미지는 지정안된 상태
	if(image.length <= 0 && (svgBgImage=='') && coverImage.length <= 0) {
		//console.log('적용 이미지 없음');
		setTimeout(function(){
			var canvas = document.createElement('canvas');
			//svg --> canvas 변환
			importSvgToCanvas(svg, canvas, tempSvg, ratio);
		}, 1000);
	}else{ 
		for(var i=0; i<image.length; i++) {
			if(image[i].node.style.display != 'none') {
			//if($(image[i].node).css("display") != 'none') {
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
						console.log("준비완료");					
						//svg text 폰트 값 손실방지를 위한 대기시간 1.5초
						setTimeout(function(){
							var canvas = document.createElement('canvas');
							//svg --> canvas 변환
							importSvgToCanvas(svg, canvas, tempSvg, ratio);
						}, 500);
					}
				});
			}else{
				chkImageCount++;
				if(chkImageCount>=arrImg.length) {
					console.log("준비완료");					
					//svg text 폰트 값 손실방지를 위한 대기시간 1.5초
					setTimeout(function(){
						var canvas = document.createElement('canvas');
						//svg --> canvas 변환
						importSvgToCanvas(svg, canvas, tempSvg, ratio);
					}, 500);
				}
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
		//var dataURL;
			canvas.height = this.height;
			canvas.width = this.width;
			ctx.drawImage(this, 0, 0);
		var dataURL = canvas.toDataURL(outputFormat);
			canvas.remove();
		callback(dataURL, idx);
	}
	img.src = url;
}

//SVG to Canvas: svg ==> canvas 변환
function importSvgToCanvas(sourceSVG, targetCanvas, tempSvg, ratio) {
	console.log('svg-->canvas 변환시작');
	
	//저장하기시 비율 지정
	//==============================================================
	//var ratio = 3.1;
	//var width = parseFloat(sourceSVG.getAttribute("width"))*ratio,
	//	height = parseFloat(sourceSVG.getAttribute("height"))*ratio;
	
	//sourceSVG.setAttribute('width', width);
	//sourceSVG.setAttribute('height', height);
	//$(canvgSVG).attr('width', width);
	//$(canvgSVG).attr('height', height);

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
	//$(canvgSVG).find('g.xImage').remove();
	//console.log($(canvgSVG).find('g.xImage').length);
	//console.log($(canvgSVG).find('g.xImage'));
	$(canvgSVG).find('.cover').remove();
	$(canvgSVG).find('.dataGroup').remove();
	$(canvgSVG).find('.objectGroup').html(_textBoxWrap);
	$(canvgSVG).find('.objectGroup').append(_tableTextWrapper);
	

	
	// STEP 1: text(g.textBoxWrap) 부분만 이미지화 (이슈: text-shadow 미적용됨)
	//console.log(canvgSVG[0]);
/*	svgAsPngUri(canvgSVG[0], null, function(uri) {
		//console.log(uri);
		imageToPNG(uri);
	});	*/
	
	var imgSVG = canvgSVG[0];

	var imgDATA = (new XMLSerializer()).serializeToString(imgSVG);

	var imgCANVAS = $('<canvas  id="img-canvas" width="'
			+ $(imgDATA).attr("width")
			+ '" height="'
			+ $(imgDATA).attr("height")
			+ '"></canvas>');

	canvg(imgCANVAS[0], imgDATA, {useCORS : true, renderCallback : function(){
		var imgURI = imgCANVAS[0].toDataURL('image/png');
		imgCANVAS.remove();
		imageToPNG(imgURI);
	}});

	// STEP 2: text뺀(g.textBoxWrap) 나머지 전부 PNG캡쳐
	function imageToPNG(textImage) {
		var canvas = targetCanvas;
		var imgElement = document.createElement('img');
			imgElement.src = textImage;

		var width = sourceSVG.getAttribute("width"),
			height = sourceSVG.getAttribute("height");	

			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			
		var ctx = canvas.getContext('2d');
		
		$(sourceSVG).find('g.textBoxWrap').remove();
		$(sourceSVG).find('g.tableTextWrapper').remove();
		
		svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
		
		// this is just a JavaScript (HTML) image
		var img = new Image();
		img.onload = function() {
			// after this, Canvas’ origin-clean is DIRTY
			ctx.drawImage(img, 0, 0, this.width, this.height);
			ctx.drawImage(imgElement, 0, 0, this.width, this.height);
			var png = canvas.toDataURL("image/png");
			canvas.remove();

			var _tempTimer = setInterval(function() {
					clearInterval(_tempTimer);
					
					document.downFrm.dataUri.value = png;
					document.downFrm.submit();
					$('.dimmLoader').stop(true, true).fadeOut(150).remove();
					tempSvg.remove();

			}, 500);
	
		}
		//img.crossOrigin = 'Anonymous';
		img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg_xml)));
	}
}


function fnPrint(info) {

	if ( !$('#printArea').length ) {
		//$('<div id="printArea"></div>').appendTo('body');
		$('<div id="printArea"><div class="svgWrap"></div></div>').appendTo('body');
	}

	var dir = info.canvasType == 'HD' ? '세로' : '가로';

	$('.checkAlert .txt1 span').html(info.canvasSize + ' - ' + dir);

	$('.checkAlert').fadeIn(150, function() {

		$('.checkAlert .ok').off().on({
			click : function() {
				var svgWidth = setSize(info).width
					, svgHeight = setSize(info).height;

				$('.checkAlert').fadeOut(150,function(){
					//$("#detailPopView.pop_fixed").css({'border':0})
					
					var browserType = getBrowserType();
					if(browserType.indexOf('msie') > -1){
						try{
							var web='<OBJECT ID="previewWeb" width=0 height=0 classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
							document.body.insertAdjacentHTML('beforeEnd',web);
							previewWeb.ExecWB(7, 1);
							previewWeb.outerHTML='';
						}catch(e){
							console.log("ie print 미리보기 error: ", e);
							window.print();
						}
					}else{
						window.print();
					}
					
					//$("#detailPopView.pop_fixed").css({'border':'solid 1px #ccc;'})

				});
			}
		});

	});

}
