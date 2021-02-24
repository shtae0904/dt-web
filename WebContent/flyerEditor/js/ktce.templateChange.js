// 배경 템플릿 변경 로직
function fnTemplateChange(objArray, paperInfo) {
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
				for(var i=0; i<objArray.length; i++) {
					var obj = Snap(objArray[i]);
					var tmpCover = Snap.parse(data.content);
					if(obj.select('g.cover') != null) {
					
						$(obj.node).find('g.cover').text('');
						$(obj.node).find('g.cover').removeAttr('style');
						
						obj.select('g.cover').append(tmpCover);
					}
					
				}
				setInitDetailViewEffect();
				
			} else {
				alert('템플레이트를 불러오지 못했습니다. 관리자에게 문의해 주세요.');
			}
		},
		error:function(){
			alert('서버와의 통신에 실패하였습니다. 관리자에게 문의해 주세요.');
		}
	});
}

function setInitDetailViewEffect() {
	
	setTimeout(function() {
		detailViewDataBind();
		clearTimeout(this);
	}, 1000);
	
	function detailViewDataBind() {
		
		$("div.svgViewCont").show();
		
		if($("div.svgViewCont").length>0) {
			//크롬에서 기 작성된 fill=ragb(0,0,0,0), stroke=rgba(0,0,0,0) 배경색, 라인색 속성 값을 fill='none', stroke='none'으로 변경처리
			//servlet 이미지저장 라이브러리에서 처리 못함.
			$("div.svgViewCont div.svgWrap.active svg g.objectGroup>*").each(function(idx, el){
				try{
					if($(el).attr('fill') == 'rgba(0, 0, 0, 0)' || $(el).attr('fill') == 'rgba(0,0,0,0)'){
						$(el).attr('fill', 'none');
					};
					if($(el).attr('stroke') == 'rgba(0, 0, 0, 0)' || $(el).attr('stroke') == 'rgba(0,0,0,0)'){
						$(el).attr('stroke', 'none');
					};

					if($(el).find('rect').attr('fill')=='rgba(0, 0, 0, 0)' || $(el).find('rect').attr('fill')=='rgba(0,0,0,0)') {
						$(el).find('rect').attr('fill', 'none');
					}
					if($(el).find('rect').attr('stroke')=='rgba(0, 0, 0, 0)' || $(el).find('rect').attr('stroke')=='rgba(0,0,0,0)') {
						$(el).find('rect').attr('stroke', 'none');
					}
					$(el).find('defs').remove();
					
					$(el).removeAttr('mask', 'none');
					
				}catch(err){
					
				}
				
				//이미지 clippath 중복이름 제거(변경) 로직
				if($(el).attr('data-name') == 'xImage') {
					if($(el).find('clipPath').attr('id') === 'imgcrop-mask') {
						var _newId = "clippath" + $(el).attr('id');
						var tempId= $(el).attr('id');		
						document.getElementById(tempId).getElementsByTagName('clipPath').item(0).setAttribute('id', _newId);
						document.getElementById(tempId).getElementsByTagName('image').item(0).setAttribute('clip-path', 'url(#' + _newId + ')');	
					}
				}
				
			});

			//text filter추가에 따른 로직추가(없을경우 filter적용된 텍스트가 보일질 않음)
			//filter, gradient parsing
			for(var i=0; i< flyerInfo.content.length; i++) {
				fnParseEffect ($(".svgViewCont .svgWrap:eq(" + i + ")").find('svg'),i, flyerInfo.content[i].content);
			}
			
			//clearInterval(_Timer);
			//_Timer = null;
			$("#detailPopView .detailViewLoading").removeClass('active');
			
			//인쇄용 미리 로딩(이미지관련)
			if ( !$('#printArea').length ) {
				$('<div id="printArea"></div>').appendTo('body');
			}
			
			$('#printArea').html('');
			//$('#printArea').css('display','block');
			//$('#printArea').append($('.svgWrap.active').clone());
			$('#printArea').append($('.svgWrap').clone());
			$('#printArea .svgWrap').css({width:'100%', height:'100%'})
			$('#printArea .svgWrap svg').css({
				width : parseFloat($(flyerInfo.content[0].content).attr('width'))
				, height : parseFloat($(flyerInfo.content[0].content).attr('height'))
				, transform: 'scale(1, 1) translate(0px, 0px)'
			});
		}
	}
}
