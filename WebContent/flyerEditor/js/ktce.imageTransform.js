/*
 * KTCE Editor
 * @Package
 * @Description : KTCE 최종저장 이후 프로세스
 **/

 var gfnDonwload = undefined;
(function() {

	var imageTransform = function() {

		var fnLayer = $('#saveComplete')
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
			, paperType = null
			, info = KTCE.paperInfo

		$('.dimmLoader').fadeOut(150);

		// 손글씨인지 판단하여 버튼 감추거나 생성
		if ( KTCE.paperInfo.hwYn == 'Y' ) {
			handFlag = true;
			paperType = '.hand';
			setPreviewLayer();
		} else {
			handFlag = false;
			paperType = '.normal';
			setPreviewLayer();
		}

		// 기본 정보에 의한 프린트 설정
		setPrint();

		// 미리보기 레이어에 컨텐츠 넣기
		setPreviewContent();
		//setPageSelect();
		setPageSelect(paperType);
		
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

			var temp = Snap($(document.querySelector('svg')).clone()[0]);
			var tempSvg = $('<div></div>').append($(temp.node)).appendTo('body');
			var textArray = temp.select(".objOuter").selectAll(".textBoxWrap");
			for(var i=0; i < textArray.length; i++){
				var tLine = textArray[i].select('.textLine');
				var subStringArray = tLine.selectAll('text');
				for(var k =0; k< subStringArray.length; k++){
					var x = parseFloat(subStringArray[k].getBBox().x);
					var y = parseFloat(subStringArray[k].attr("y"));
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

			//단윈환산: 1mm --> 3.779527559px
			if($("#detailTitle").attr("canvas-size") == "PS"){
				//ratio = 4.375;	//3500px: 5250px(실용지 사이즈의 154.3402777800286%); <-- local 서버에서 처리 못함(메모리 부족)
				//2267.7165354, 원본비율: 2.83464566925
				ratio = 3;	//2400px:3600px;
			}else if($("#detailTitle").attr("canvas-size") == "A3"){
				ratio = 4.385;	//기존비율(2016년)
				//ratio = 2.1925; //인쇄용 1754px:2480px(실용지사이즈의 156.2556116745571%)
			}else if($("#detailTitle").attr("canvas-size") == "A4"){
				ratio = 3.1;	//기존비율(2016년) //3.124603174648742 
				//ratio = 1.55;	//1240px:1754(실용지사이즈의 156.2301587324371%)
			}else{
				ratio = 2.185;	//기존비율(2016년)	
				//ratio = 1.0625;  //850px:1206px(실용지사이즈의 151.9566441463602%)
			}
			
			if($('#canvas').length != 0){
				$('#canvas').remove();
			}

			$(temp.node).transit({scale:1, x : -(1/100) + '%'})
			var svg = $(temp.node).clone();
			svg.width(getPaperSize(800, info.canvasType, info.canvasSize).width*ratio);
			svg.height(getPaperSize(800, info.canvasType, info.canvasSize).height*ratio);
			var data = (new XMLSerializer()).serializeToString(svg.get(0));
			var canvas = $('<canvas id="canvas" width="'
						+ $(data).attr("width")
						+ '" height="'
						+ $(data).attr("height")
						+ '"></canvas>').appendTo('body');

			canvg(canvas[0], data, {useCORS : true, renderCallback : function(){
				var imgURI = $('#canvas').get(0).toDataURL('image/png');
				
				document.downFrm.dataUri.value = imgURI;
				document.downFrm.submit();
				$('.dimmLoader').stop(true, true).fadeOut(150).remove();
				tempSvg.remove();
			}});
		}

		gfnDonwload = fnDownload;
		function setDownloadFn() {
			downloadTrigger.on({
				click : function() {
					fnDownload();
				}
			});
		}

		function setPreviewContent() {
			// 일반
			if ( !handFlag ) {

				var frontContent = $('<div class="svgWrap active '+ info.canvasType +'">' + KTCE.paperInfo.frontContent + '</div>')

				frontContent.appendTo(previewArea);

				if ( KTCE.paperInfo.backContent != null ) {
					var backContent = $('<div class="svgWrap ' + info.canvasType + '">' + KTCE.paperInfo.backContent + '</div>')
					backContent.appendTo(previewArea);
				} else {
					pageSelector.filter('.normal').find('button').last().remove();
				}
				
				//text filter추가에 따른 로직추가(없을경우 filter적용된 텍스트가 보일질 않음)
				//filter, gradient parsing
				//console.log($(".previewArea .svgWrap").length)
				for(var i=0; i< $(".previewArea .svgWrap").length; i++) {
					if(i==0){
						fnParseEffect($(".previewArea .svgWrap:eq(" + i + ")").find('svg'), i, KTCE.paperInfo.frontContent);
					}else if(i==1){
						fnParseEffect($(".previewArea .svgWrap:eq(" + i + ")").find('svg'), i, KTCE.paperInfo.backContent);
					}
				}

				if(info.canvasType == "WD"){
					$('.svgWrap svg').css({
						width : svgWidth
						, height : svgHeight
						, transform: "scale(0.385, 0.385) translate(-95%, -81%)"
					});
				} else {
					$('.svgWrap svg').css({
						width : svgWidth
						, height : svgHeight
						, transform: "scale(0.385, 0.385) translate(-81%, -81%)"
					});
				}
			}else{
				
				if(KTCE.paperInfo.flyerContents.length>0) {
					
					$('div.pageSelector.hand').empty();
					for(var i=0; i<KTCE.paperInfo.flyerContents.length;i++){
						if(i==0) {
							var frontContent = $('<div class="svgWrap active '+ info.canvasType +'">' + KTCE.paperInfo.flyerContents[0].content + '</div>')
							frontContent.appendTo(previewArea);
							
							var tempButton = '<button class="active" type="button" value="'+ i + '">' + (i+1) + '</button>';
							
						}else{
							var tempContent = $('<div class="svgWrap ' + info.canvasType + '">' +KTCE.paperInfo.flyerContents[i].content+ '</div>')
							tempContent.appendTo(previewArea);
							
							var tempButton = '<button type="button" value="'+ i + '">' + (i+1)+ '</button>';
						}
						
						$('div.pageSelector.hand').append(tempButton);
						
						//text filter추가에 따른 로직추가(없을경우 filter적용된 텍스트가 보일질 않음)
						//filter, gradient parsing
						fnParseEffect($(".previewArea .svgWrap:eq(" + i + ")").find('svg'), i, KTCE.paperInfo.flyerContents[i].content);
					}
				}else{
					return;
				}
				
				setPreviewLayer(true);
				
				if(info.canvasType == "WD"){
					$('.svgWrap svg').css({
						width : svgWidth
						, height : svgHeight
						, transform: "scale(0.385, 0.385) translate(-95%, -81%)"
					});
				} else {
					$('.svgWrap svg').css({
						width : svgWidth
						, height : svgHeight
						, transform: "scale(0.385, 0.385) translate(-81%, -81%)"
					});
				}
				
			}

		}

		function setPageSelect(paperType) {

			pageSelector.filter(paperType).find('button').each(function(i) {
				$(this).on({
					click : function() {
						pageSelector.find('button').removeClass('active');
						$(this).addClass('active');

						$('.svgWrap').removeClass('active');
						$('.svgWrap').eq(i).addClass('active');
					}
				});
			});
		}


		function setPrint() {

			var typeIdx = 0
				, sizeIdx = 0
				, width = 0
				, height = 0

			canvasTypeSelector.removeClass('active').addClass('deactive');

//START: 2017-01-09 ==========================================================================
			/*
			//원본 2016
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
			}*/
			switch(info.canvasSize) {	
				case 'PS' :
					typeIdx = 0;
					break;
				case 'A3' :
					typeIdx = 1;
					break;
				case 'A4' :
					typeIdx = 2;
					break;
				case 'A5' :
					typeIdx = 3;
					break;
			}
//END: 2017-01-09 ==========================================================================

			canvasTypeSelector.eq(typeIdx).addClass('active').removeClass('deactive');

//			width = getPaperSize(300, info.canvasType, info.canvasSize).width;
//			height = getPaperSize(300, info.canvasType, info.canvasSize).height;
			width = getPaperSize(800, info.canvasType, info.canvasSize).width;
			height = getPaperSize(800, info.canvasType, info.canvasSize).height;

			svgWidth = width;
			svgHeight = height;

		}

		function setPreviewLayer(handFlag) {

			// 일반
			if ( !handFlag ) {
				pageSelector.filter('.hand').hide();
				if ( KTCE.paperInfo.backContent == null ) {
					pageSelector.filter('.hand').find('button').last().hide();
				}

			// 손글씨
			} else {
				pageSelector.filter('.normal').hide();
				pageSelector.filter('.hand').show();
			}

		}

	}

	KTCE.imageTransform = imageTransform;


})();