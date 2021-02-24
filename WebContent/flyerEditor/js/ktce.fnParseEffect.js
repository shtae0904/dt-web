/**
 * 확대미리보기, 최종저장 미리보기에서 filter, gradient, kt font일관적용 등 효과 적용
 */
//filter, gradient 등 효과 parsing 적용
function fnParseEffect (targetSVG, index, objHTML) {
	$(targetSVG[0]).find('defs:eq(0)').append($(objHTML).find('defs:eq(0)').find('filter'));
	$(targetSVG[0]).find('defs:eq(0)').html($(objHTML).find('defs:eq(0)>*'));
	
	//PNG변환시 batik lib에서 배경이미지 노출되는 버그 방지
	fnsetBackgroundImageClipPath(objHTML);
	
	//404 Not image 삭제처리
	var images = $(targetSVG[0]).find('image');
	fnDelete404NotImage(images);
	images = null;
	
	if($(targetSVG[0]).find('g.objectGroup')[0] !=undefined) {	//저장 전단지 사용시, 크게보기, 최종저장인쇄
		$(targetSVG[0]).find('g.objectGroup g.cellTextWrapper').each(function(idx, node){
			fnFontFamilyReStore(node);
			fnTextShadowAction(targetSVG, node, true);
		});
		$(targetSVG[0]).find('g.objectGroup g.textBoxWrap').each(function(idx, node){
			fnFontFamilyReStore(node);
			fnTextShadowAction(targetSVG, node, true)
		});
		$(targetSVG[0]).find('g.objectGroup>*').each(function(idx, el){
			fnShapeEffectAction(targetSVG, idx, el);
		});
	}
}

//텍스트 그림자효과 Check
function fnTextShadowAction(targetSVG, targetG, styleAction) {
	if($(targetG).css('text-shadow') != 'none') {	//text-shadow
		var browserType = getBrowserType();
		if(browserType.indexOf('msie') > -1){	//IE
			console.log('IE text-shadow--> filter 변경!!');
			$("#"+$(targetG).attr('data-filter-id')).remove();
			fnTextShadow(targetSVG, Snap(targetG), styleAction);
		}else{
			if($(targetG).attr('filter') != undefined) {
				console.log('Chrome filter --> text-shadow 변경!!');
				$("#"+$(targetG).attr('data-filter-id')).remove();
				$(targetG).removeAttr('filter');
				fnTextShadow(targetSVG, Snap(targetG),styleAction);
			}
		}
	}else{
		
	}
}

/*
 * 텍스트 그림자효과 Filter 지정
 */
function fnTextShadow(targetSVG, obj, styleAction) {
	//표안 텍스트가 없을 경우 실행중지(에러방지)
	if(obj === null) return;

	if($(obj.node).css("text-shadow") == 'none' || styleAction){
		$(obj.node).css({
			'text-shadow' : '2px 2px 2px #333'
		})

	} else {	
		$(obj.node).css({
			'text-shadow' : 'none'
		});
	}
	var browserType = getBrowserType();
	if(browserType.indexOf('msie') > -1){	//IE
		if($(obj.node).attr('filter') == undefined || styleAction){
			var paper = Snap(targetSVG[0]);
			var _filter = paper.filter(Snap.filter.shadow(2,2,2));
			obj.attr({'data-filter-id': _filter.node.id});
			obj.attr({filter: _filter});
			//한글자 전단지에서 text글자가 600pt크기에서 그림자 효과 지정시 짤림현상 해소(필요시 width값 추가)
			if($(targetSVG[0]).parent().parent().hasClass('svgViewCont')) {
				var hwYn = flyerInfo.hwYn;
			}else{
				var hwYn = KTCE.paperInfo.hwYn;
			}
			
			if(hwYn === 'Y') {
				$("#" + _filter.node.id).attr('x', '20%');
			}else{
				$("#" + _filter.node.id).attr('x', '0');
			}
		}else{
			console.log('ie remove shadow filter');
			$(obj.node).removeAttr('filter');
			
			var _filterId = $(obj.node).attr('data-filter-id');
			var filterIdCount = 0;
			$(targetSVG[0]).find('.objectGroup>*').each(function(idx, el){
				if($(el).attr('data-filter-id') == _filterId) {
					filterIdCount++;
					if(filterIdCount > 1){
						return;
					}
				}
				
			});
			
			if(filterIdCount <= 1) {
				$("#" + obj.attr('data-filter-id')).remove();
			}
			
			//원본
			//$("#" + obj.attr('data-filter-id')).remove();
		}
	}else{	// NOT IE

	}
	
}

/**
 * 도형 filter효과 액션(201804 추가)
 */
function fnShapeEffectAction(targetSVG, index, node, hasDataGroup) {
	var _this = node;
	/*
	var _tableTextWrapperArray = $(targetSVG[0]).find('g.cellTextWrapper');
	_tableTextWrapperArray.each(function(idx, node){	
		fnFontFamilyReStore(node);
		fnTextShadowAction(targetSVG, node, true);
	});
	
	var _textBoxWrapArray = $(targetSVG[0]).find('g.textBoxWrap');
	_textBoxWrapArray.each(function(idx, node){	
		fnFontFamilyReStore(node);
		fnTextShadowAction(targetSVG, node, true)
	});
	*/
	
	var _shapeArray = $(targetSVG[0]).find('.hasData[filter]');//.filter("not(g)");
	_shapeArray.each(function(idx, node){
		if($(node).find('text').length > 0) {
			
		}else{
			if($(node).attr('filter') != undefined) {
				var _filterId = $(node).attr('data-filter-id');
				if(document.getElementById(_filterId) != null) {
					//템플릿 관리자기능 관련 filter 예외
					if($("#" + _filterId).find('feGaussianBlur').length < 1) return;
	
					var shadowWidth = parseFloat(document.getElementById(_filterId).childNodes[0].getAttribute('stdDeviation'));
					var filterIdCount = 0;
					var removeFilter = false;
					if(hasDataGroup) {
						var findPath = 'g.objectGroup>g.hasDataGroup>*';
					}else{
						var findPath = 'g.objectGroup>*';
					}
					$(targetSVG[0]).find(findPath).each(function(idx, el){
						if($(el).attr('data-filter-id') == _filterId) {
					//		filterIdCount++;
						}
					});
					
					if($(node).attr('data-filter-id') == _filterId) {
						filterIdCount++;
					}
					
					if(document.getElementById(_filterId).childNodes.length > 1) {
						$("#"+_filterId).remove();
						if(filterIdCount <= 1) {
							//$("#"+_filterId).remove();
							removeFilter = true;
							fnShapeShadow(targetSVG, Snap(node), shadowWidth, removeFilter);
						}else{
							removeFilter = false;
							//box-shadow
							fnShapeShadow(targetSVG, Snap(node), shadowWidth);
						}
					}else{
						//$("#"+_filterId).remove();
						if(filterIdCount <= 1) {
							$("#"+_filterId).remove();
							removeFilter = true;
							fnShapeBlur(targetSVG, Snap(node), shadowWidth, removeFilter);
						}else{
							removeFilter = false;
							//box-blur
							fnShapeBlur(targetSVG, Snap(node), shadowWidth);
						}
					}
				}
			}
		}
	});
}

/**
* 도형 그림자 효과 
*/
function fnShapeShadow(targetSVG, obj, shadowWidth, removeFilter) {
	var thisWidth = shadowWidth;	 
	var paper = Snap(targetSVG[0]);
	var filter = paper.filter(Snap.filter.shadow(0, 0, thisWidth, 'rgb(51,51,51)'), 1);
	var svgId = targetSVG[0].id;
	
	if(removeFilter) $(".svgViewCont .svgWrap active defs>#" + obj.attr('data-filter-id')).remove();	
	if(removeFilter) $("#"+svgId + " defs>#" + obj.attr('data-filter-id')).remove();

	obj.attr({
		filter : filter,						
		//'data-filter-id' : filter.attr('id')						
		'data-filter-id' : filter.node.id
	});	
	
}

/**
* 도형 가장자리 효과
*/
function fnShapeBlur(targetSVG, obj, shadowWidth, removeFilter){
	var paper = Snap(targetSVG[0]);//Snap(KTCE.currentPaper.s.node);
	var filter = paper.filter(Snap.filter.blur(shadowWidth));
	if(removeFilter) $(".svgViewCont .svgWrap active defs>#" + obj.attr('data-filter-id')).remove();
	obj.attr({
		filter : filter,
		'data-filter-id' : filter.attr('id')
	});
}	

// java servlet PNG저장 batik lib 버그에 따른 글꼴 변환에 따른 Editor영역에 맞게 글꼴 원복
function fnFontFamilyReStore(obj) {

	//폰트교체(2019-05-31): 산돌고딕 > KT서체
	fnsetChangeFontFamily(obj);
	
	var fontFamily = $(obj).css('font-family').split('_');
	var fontStyle = $(obj).css('font-style');
	var fontWeight = $(obj).css('font-weight');
	if(fontStyle === 'italic' || fontWeight === 'bold') {
		$(obj).css({'font-family': fontFamily[0]});
	}
}

/**
* 도형 그라데이션 효과
*/

function fnShapeGradient(obj) {

}

/**
 * title: 배경 이미지 clippath 적용
 * date : 2017-09-20
 * content : PNG변환시 batik lib에서 배경이미지 노출되는 버그 방지
 */
function fnsetBackgroundImageClipPath(obj) {
	var id = $(obj).attr('id');
	var svgBg = $("#" + id + " #svgBg");
	var _x = $(obj).attr('x');
	var _y = $(obj).attr('y');
	var _w = $(obj).attr('width');
	var _h = $(obj).attr('height');

//	if(svgBg.attr("xlink:href") !='' && svgBg.attr("xlink:href") !=undefined && svgBg.attr("xlink:href") != null){
		var clippath = $(obj).find("#clippath_" + id );
		if(clippath.length > 0){
			svgBg.attr('clip-path', "url(\"#clippath_" + id + "\")");
			//배경이미지가 노출되는 버그 방지를 위해(좌/우/상/하 값 축소)
			$("#clippath_" + id + ">rect").attr({'x': 0.5, 'y': 0.5, 'width': _w-1, "height": _h-1});
		}else{
			//if(frontBg.attr('clip-path') == '' || frontBg.attr('clip-path') == undefined || frontBg.attr('clip-path') == 'none') {
				$("#" + id + " #clippath_" + id).remove();
				var clippathRect = Snap("#" + id).rect(0,0,_w, _h).attr('fill', 'none');
				Snap(svgBg[0]).attr('clip-path', clippathRect);
				var clippathId = svgBg.attr('clip-path');
				
				if(clippathId != undefined) {
					clippathId = clippathId.split("#")[1].split(")")[0].split("\"")[0].split("'")[0];
					$("#" + id + " #" + clippathId).attr('id', "clippath_" + id);
					svgBg.attr('clip-path', "url(\"#clippath_" + id + "\")");
					
					//배경이미지가 노출되는 버그 방지를 위해(좌/우/상/하 값 축소)
					$("#clippath_" + id + ">rect").attr({'x': 0.5, 'y': 0.5, 'width': _w-1, "height": _h-1});
					
				}
			//}
		}
		
//	}
	
	//2017-10-10 : PNG변환시 batik lib에서 svg canvas 영역범위 밖 이미지 노출되는 버그 방지
	//fnsetObjectGroupImageClipPath(obj);
	fnsetObjectGroupClipPath(obj);
	
}

/**
 * title: 오브젝트 이미지에 clippath 적용
 * date : 2017-10-10
 * content : PNG변환시 batik lib에서 svg canvas 영역범위 밖 이미지 노출되는 버그 방지
 */
function fnsetObjectGroupClipPath(obj) {
	var id = $(obj).attr('id');
	var objectGroup = $("#" + id + " g.objectGroup");
	var objectGroupClippath = $(obj).find("#objectGroupClippath_" + id );
	if(objectGroupClippath.length > 0){
		objectGroup.attr('clip-path', "url(\"#objectGroupClippath_" + id + "\")");
	}else{
		var _w = parseInt($(obj).attr('width')) - 2;
		var _h = parseInt($(obj).attr('height')) - 2;
	//	$("#" + id + " #objectGroupClippath_" + id).remove();
		var clippathRect = Snap("#" + id).rect(1, 1, _w, _h).attr('fill', 'none');
		Snap(objectGroup[0]).attr('clip-path', clippathRect);
		
		var clippathId = objectGroup.attr('clip-path');
		if(clippathId != undefined) {
			clippathId = clippathId.split("#")[1].split(")")[0].split("\"")[0].split("'")[0];
			$("#" + id + " #" + clippathId).attr('id', "objectGroupClippath_" + id);
			objectGroup.attr('clip-path', "url(\"#objectGroupClippath_" + id + "\")");
		}
		
	}
}

function fnsetObjectGroupImageClipPath(obj) {
	var id = $(obj).attr('id');
	var clippath = $(obj).find("#clippath_" + id );
	var xImageGroup = $("#" + id + " g.objectGroup>g.xImage");
	xImageGroup.each(function(idx, el){
		if(clippath.length > 0) {
			if($(el).attr('clip-path') === undefined) {
				$(el).attr('clip-path', "url(\"#clippath_" + id + "\")");
			}
		}else{
			$(el).removeAttr('clip-path');
		}
	});
}
/**
 * title: image xlink:href 이미지 삭제에 다른 404 not 이미지 삭제
 * date : 2019-11-26
 * content : PNG변환시 batik lib에서 404 image는 null값에 대하여 error발생함, 해당 image소스 삭제처리
 */
function fnDelete404NotImage(obj) {
	var images = obj;
	try{
		images.each(function(idx, el){
			var image = $(this);
			if(image.css("display") == 'none' && image.attr('id') != 'svgBg') {
				var imgUrl = image.attr("xlink:href");
				$.ajax({
					url: imgUrl,
					error: function(xhr, status, error) {
						if(xhr.status == 404) {
							console.log("delete: 404 not found image!!");
							var count = (image.attr("use-count") == undefined) ? 1 : parseInt(image.attr("use-count")) + 1;
							image.attr("use-count", count);
							if(count > 5) {
								var id = image.parent().attr("id");
								//해당 image g node 삭제처리
								if(image.parent().attr('class').indexOf('xImage') > -1) {
									image.parent().remove();
									//해당 data 소스 삭제처리
									$(".dataGroup " + id).remove();
								}else{
									image.remove();
									//해당 data 소스 삭제처리
									$(".dataGroup " + id).remove();
								}
							}
						}
					},
					success: function() {
					}
				});
				return;
			}
			
			if(image.attr('id') == 'svgBg' || (image.parent().attr("id").indexOf("paper") > -1)) {
				var url = image.attr("xlink:href");
				if(url =="" || url == null) {
					image.css("display", "none");
				}
				//image.css("display", "none");
			}else{
				var url = image.attr("xlink:href");
				var img = new Image();
				img.crossOrigin = 'Anonymous';
				img.onerror = function() {
					console.log("image onload error!!");
					//var id = image.parent().attr("id");
					//해당 image g node 삭제처리
					//image.parent().remove();
					//해당 data 소스 삭제처리
					//$(".dataGroup " + id).remove();
					var imgUrl = this.src;
					$.ajax({
						url: imgUrl,
						error: function(xhr, status, error) {
							if(xhr.status == 404) {
								console.log("hide: 404 not found image!!");
								var count = (image.attr("use-count") == undefined) ? 1 : parseInt(image.attr("use-count")) + 1;
								//image.attr("xlink:href", "http://localhost/flyerdocs/images/sta.png");
								image.attr("org-href", imgUrl);
								image.attr("use-count", count);
								image.hide();
								image.parent().hide();
							}
						},
						success: function() {
						}
					});
				}
				img.src = url;
			}
		});
	}catch(err){}
	images = null;
	
}

//(라이센스)폰트바꾸기(산돌고딕 > KT서체)
function fnsetChangeFontFamily(obj) {
	var fontFamily= $(obj).css('font-family');
	if(fontFamily.toUpperCase().indexOf('KTFONT') > -1) {
		//console.log('KT서체: ', fontFamily)
	}else{
		var family = fngetChangeFontFamily(fontFamily);
		$(obj).css('font-family', family);
	}
	
}

function fngetChangeFontFamily(fontFamily) {
	var family = fontFamily;
	family = family.split("_")[0];
	switch(family) {
		case 'SDGothicNeoaL' :
			family = 'KTfontLight';
			break;
		case 'SDGothicNeoaM' :
			family = 'KTfontMedium';
			break;
		case 'SDGothicNeoaB' :
			family = 'KTfontBold';
			break;
		case 'ollehneoL' :
			family = 'KTfontLight';
			break;
		case 'ollehneoM' :
			family = 'KTfontMedium';
			break;
		case 'ollehneoB' :
			family = 'KTfontBold';
			break;
		default:
			family = family;
	}

	return family;
}