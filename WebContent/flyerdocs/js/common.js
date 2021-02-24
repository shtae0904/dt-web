	$(document).ready(function() {

		// gnb
		$('.gnb ul > li').click(function() {
			$('.gnb ul > li').not($(this)).removeClass('on');
			$(this).addClass('on');
		});
		$('.gnb ul li').hover(function() {
			$(this).find('.gnb_sub').stop(true, true).fadeIn('');
		}, function() {
			$(this).find('.gnb_sub').stop(true, true).fadeOut('');
		});
	
		// 전단지 리스트 오버
		$('.leaflet_list li').hover(function() {
			$(this).find('.list_over').stop(true, true).fadeIn('');
		}, function() {
			$(this).find('.list_over').stop(true, true).fadeOut('slow');
		});
		
		// 테이블 순서버튼 오버
		$('.table_num').hover(function() {
			$(this).find('.table_num_btn').stop(true,true).show();
		}, function() {
			$(this).find('.table_num_btn').stop(true,true).hide();
		});

	
		// 조건검색 보기
		$('.open_search').toggle(function() {
			$(this).html('<img src="/flyerdocs/images/btntxt_dsearch_close.png" alt="조건검색 닫기" />');
			$('.searchWrap').slideDown('fast');
		}, function() {
			$(this).html('<img src="/flyerdocs/images/btntxt_dsearch_open.png" alt="조건검색" />');
			$('.searchWrap').slideUp('fast');
		});
		
	
		// 자료실 snb
		$('.snb_category > li').click(function() {
			$('.snb_category > li').not($(this)).removeClass('on');
			$(this).addClass('on');
		});
		$('.snb_category li ul li').click(function() {
			$('.snb_category li ul li').not($(this)).removeClass('on');
			$(this).addClass('on');
		});
	
		// 전단지 레이어 height
		$(function() {
			function resizeWindow() {
				var winH = $(window).height();
				$(".pop_leaflet").css({height:winH-2+"px"});
				$(".pop_leaflet_view").css({height:winH-178+"px"});
				$(".pop_leaflet_nav").css({height:winH-127+"px"});
				$(".edit_bgWrap2").css({height:winH-310+"px"}); // 151014 배경 관리
				$(".edit_bgWrap3").css({height:winH-310+"px"}); // 151014 배경 관리
				$(".edit_bg_scroll").css({height:winH-254+"px"}); // 151014 배경 추가/수정 레이어
			}
			$(window).resize(resizeWindow);
			resizeWindow();
		});
		
		// 통계관리 날짜 탭
		$('.stat_tab1 li').click(function(){
			$('.stat_tab1 li').not($(this)).removeClass('on');
			$(this).addClass('on');
		});
		$('.stat_tab2 li').click(function(){
			$('.stat_tab2 li').not($(this)).removeClass('on');
			$(this).addClass('on');
		});

	
		// 레이어
		$('.pop_login_close').click(function() {
			$('.pop_login, .pop_overlay', top.document).fadeOut('');
		});
	
		$('.pop_search_open').click(function() {
			$('.pop_search', top.document).fadeIn('');
		});
		$('.pop_search_close').click(function() {
			$('.pop_search', top.document).fadeOut('');
		});
	
	});
	
	/**
	 * 페이징 번호 클릭 함수
	 * 
	 * @param formName
	 * @param pageNumber
	 * @returns {Boolean}
	 */
	function gf_goPage(formName, pageNumber) {
		$('#page').val(pageNumber);
		if($('#' + formName + ' input[name=pageFlag]').val() == undefined 
				|| $('#' + formName + ' input[name=pageFlag]').val() == ''
				|| $('#' + formName + ' input[name=pageFlag]').val().search('PF_SELECT') == -1){
				$('#' + formName + ' input[name=pageFlag]').val('PF_SELECT');
			}
		if($('#' + formName + ' input[name=checkPage]').val() == 'selfMonitoring'){
			$(window).scrollTop(0);
			var url = $('#' + formName).attr('action');
			getList(url, "", "페이지 이동중 에러가 발생하였습니다."); 
		}else{
			$('#' + formName).submit();
		}
		return false;
	}
	
	/**
	 * 페이징 번호 클릭 함수
	 * 
	 * @param formName
	 * @param pageNumber
	 * @returns {Boolean}
	 */
	function gf_goPagePopup(formName, pageNumber) {
		$('#' + formName + ' input[id=page]').val(pageNumber);
	
		var url = $('#' + formName).attr('action');
		var params = $('#' + formName).serialize().replace(/%/g, '%25');
		$('#div_' + formName).load(url, params);
		return false;
	}
	
	var g_isAjaxAvailable = true;
	
	function gf_isAjaxAvailable() {
		return g_isAjaxAvailable;
	}
	
	function gf_ajax(url, params, successFunc, errorFunc) {
		if (!g_isAjaxAvailable) {
			return false;
		}
		g_isAjaxAvailable = false;
		$.ajax({
			url : url,
			type : 'POST',
			dataType : 'json',
			cache : false,
			data : params,
			error : function() {
				// gf_showAjaxLoadingImage(false);
				errorFunc();
			},
			success : function(data) {
				// gf_showAjaxLoadingImage(false);
				successFunc(data);
			},
			complete : function() {
				g_isAjaxAvailable = true;
			},
			beforeSend : function() {
				// gf_showAjaxLoadingImage(true);
			}
		});
	
		return true;
	}
	
	/**
	 * 파일 업로드 초기화
	 */
	function initFileUpload(){
		$("#uploadFile").val('');
		$('#textUploadFile').val('');
		$('#spanFw').append($('#uploadFile'));
	}
	
	/**
	 * PDS 서버에 파일 업로드
	 * @param formName
	 * @param successFunc
	 */
	function fileUpload(formName, successFunc, completeFunc) {
		$("#" + formName).ajaxForm({
			cache : false,
			//timeout : 30*1000,
			dataType : "json",
			beforeSubmit : function(data, fm, opt) {
				var fileVal = $("#" + formName + " input[type=file]").val();
				var uploadType = $("#" + formName + " input[name=uploadType]").val();

				if(!uploadImgCK(fileVal)){
					if(uploadType == 'bbs'){
						initFileUpload();
					}
					return false;
				}else{
					return true;
				}
			},
			success : function(data, statusText) {
				successFunc(data);
			},
			error : function(request, status, error) {
				alert("파일 업로드 중 오류가 발생했습니다! \n\n나중에 다시 시도해주세요!");
			},
			complete : function(data){
				completeFunc();
			}
			
		});
	
		$("#" + formName).submit();
	}
	
	
	
	
	
	/**
     * 이미지 파일명 확인
     * @param value
     * @returns {Boolean}
     */
    function uploadImgCK(value) {
    	var src = getFileExtension(value);
        if (src == "") {
            alert("등록 할 파일을 선택 하세요.");
            return false;
        } else if (src.toLowerCase() != 'ace' && src.toLowerCase() != 'alz' && src.toLowerCase() != 'bmp' && src.toLowerCase() != 'bz2'
        			&& src.toLowerCase() != 'doc' && src.toLowerCase() != 'docx' && src.toLowerCase() != 'gif' && src.toLowerCase() != 'gz'
        			&& src.toLowerCase() != 'hwp' && src.toLowerCase() != 'jpeg' && src.toLowerCase() != 'jpg' && src.toLowerCase() != 'pdf' 
        			&& src.toLowerCase() != 'png' && src.toLowerCase() != 'ppt' && src.toLowerCase() != 'pptx' && src.toLowerCase() != 'rar'
        			&& src.toLowerCase() != 'tar' && src.toLowerCase() != 'txt' && src.toLowerCase() != 'xls' && src.toLowerCase() != 'xlsx' 
        			&& src.toLowerCase() != 'zip' && src.toLowerCase() != 'ai' && src.toLowerCase() != 'psd') {
            alert("허용되지 않은 파일입니다. \n\n확인 후 다시 등록해 주세요");
            return false;
        }
        return true;
    }
    
    /**
     * 파일 확장자
     * @param filePath
     * @returns
     */
    function getFileExtension(filePath) {
        var lastIndex = -1;
        lastIndex = filePath.lastIndexOf('.');
        if (lastIndex != -1) {
            extension = filePath.substring(lastIndex+1,filePath.length);
        } else {
            extension = "";
        }
        return extension;
    }
    
    /**
     * 공백 앞 뒤 제거
     * @param obj1
     * @returns
     */
	function TrimX(obj1){
	    obj1 = obj1.replace(/^(\s+)|(\s+)$/g, "");
		return obj1;
	}
	
	/**
     * input box 문자 Null 체크
     * @param objInput,msgStr
     * @returns
     */
	function validFieldText(objInput, msgStr){
		if(TrimX(objInput.value) == "") {
			alert(msgStr);
			objInput.focus();
			return false;
		}
		return true;
	}
	

	/**
	 * 테이블 행 위로 클릭 이벤트
	 * @param index
	 */
	function goUp(index){
		var currElement = $('#tr' + index);
		var prevHtml = currElement.prev().html();
		var prevTrId = currElement.prev().attr("id");
		
		if( prevHtml == null || prevTrId == undefined){
			alert("최상위 리스트입니다!");
			return;
		}
		currElement.insertBefore(currElement.prev());
	}

	/**
	 * 테이블 행 아래로 클릭 이벤트
	 * @param index
	 * @returns
	 */
	function goDown(index){
		var currElement = $('#tr' + index);
		var nextHtml = currElement.next().html();
		var nextTrId = currElement.next().attr("id");
		
		if (nextHtml == null || nextTrId == undefined) {
			alert("최하위 리스트입니다!");
			return;
		}
		currElement.insertAfter(currElement.next());
	}
	
	
	/**
	 * HTML 태그를 TEXTAREA 출력으로 변환
	 * @param content
	 * @returns
	 */
	function convertToTextarea(content){
		content = content.replace(/<br>/g, "\n");
		content = content.replace(/&nbsp;/g, " ");
		return content;
	}
	
	function convertToHtml(content){
		content = content.replace(/\n/g, "<br>");		
		return content;
	}
	

	/**
	 * 첨부파일 확인
	 */
	function checkUploadFile(){
		var fileVal = $('#uploadFile').val();
		if(!uploadImgCK(fileVal)){
			$('#uploadFile').replaceWith($("#uploadFile").clone(true));
			$('#uploadFile').val("");
			$('#textUploadFile').val("");
		}else{
			$('#textUploadFile').val(fileVal);
		}
	}
	
	/**
	 * 전단지내용 암호화
	 */
	var Base64 = {
 
        // private property
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
        // public method for encoding
        encode : function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
 
            while (i < input.length) {
 
              chr1 = input.charCodeAt(i++);
              chr2 = input.charCodeAt(i++);
              chr3 = input.charCodeAt(i++);
 
              enc1 = chr1 >> 2;
              enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
              enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
              enc4 = chr3 & 63;
 
              if (isNaN(chr2)) {
                  enc3 = enc4 = 64;
              } else if (isNaN(chr3)) {
                  enc4 = 64;
              }
 
              output = output +
                  this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                  this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
            }
 
            return output;
        },
 
        // public method for decoding
        decode : function (input)
        {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
 
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            while (i < input.length)
            {
                 enc1 = this._keyStr.indexOf(input.charAt(i++));
                 enc2 = this._keyStr.indexOf(input.charAt(i++));
                 enc3 = this._keyStr.indexOf(input.charAt(i++));
                 enc4 = this._keyStr.indexOf(input.charAt(i++));
 
                 chr1 = (enc1 << 2) | (enc2 >> 4);
                 chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                 chr3 = ((enc3 & 3) << 6) | enc4;
 
                 output = output + String.fromCharCode(chr1);
 
                 if (enc3 != 64) {
                     output = output + String.fromCharCode(chr2);
                 }
                 if (enc4 != 64) {
                     output = output + String.fromCharCode(chr3);
                 }
            }
 
            return output;
        }
    };
 
    function changeSourceView(obj) {
        var encodeStr = Base64.encode( obj.value );
        var decodeStr = Base64.decode( encodeStr );
        document.mainForm.resultEncode.value = encodeStr;
        document.mainForm.resultDecode.value = decodeStr;
    }
	
	/**
	 * 글자를 앞에서부터 원하는 바이트만큼 잘라 리턴
	 * @param reqLen
	 * @returns {String}
	 */
	String.prototype.cut = function(reqLen){
		var str = this;
		var len = 0;
		for(var i=0; i<str.length; i++){
			len += (str.charCodeAt(i) > 128) ? 2 : 1;
			if(len > reqLen)
				return str.substring(0, i) + "...";
		}
		return str;
	};
	
	/**
	 * 해당 문자열의 바이트단위 길이를 리턴
	 * @returns {Number}
	 */
	String.prototype.bytes = function(){
		var str = this;
		var len = 0;
		for (var i=0; i<str.length; i++)
			len += (str.charCodeAt(i) > 128) ? 2 : 1;
		return len;
	};
	
	String.prototype.replaceAll = function(find, replace){
		return this.replace(new RegExp(find, 'g'), replace);
	}

	function getBrowserType(){
		var word;
		var agent = navigator.userAgent.toLowerCase();
		var name = navigator.appName;
		
		if(name == 'Microsoft Internet Explorer'){
			word = 'msie';
		} else {
			if(agent.search('trident') > -1)	word='msie11';
			else if(agent.search('edge/') > -1)	word='msie12';
			else if(agent.search('chrome') > -1)word='chrome';
			else word='';
		}
		return word;
	}
	
	
	
	
	/**
	 * 페이지 로딩 이미지
	 * @param status: 로딩이미지 show/hide(true:show, false:hide)
	 * 
	 */
	function setLoadingImage(status) {
		if(status) {
			if($("#loading_div").length <= 0) {
				$("#loading_div").remove();
				var divWrapElement = document.createElement("div");
					divWrapElement.setAttribute('id', 'loading_div');
				var divElement = document.createElement("div");
					divElement.setAttribute('class', 'loadingImg');
				var img = document.createElement("img");
					img.src = '/flyerEditor/images/common/loading.gif';
				divElement.appendChild(img);
				divWrapElement.appendChild(divElement);
				$("body").append(divWrapElement);
			}
			$("#loading_div .loadingImg").css('height', parseInt($(document).height()));
			$("#loading_div").show();
		}else{
			$("#loading_div").hide();
		}
	}
	
	/**
	 * 페이지 로딩 메시지
	 * @param targetTable: 해당 table내 메시지 처리(tr>th(td)
	 * @param msg: 로딩메시지(..로딩중/...에러발생/...데이터없음/..)
	 * @param targetObj: tab버튼으로 페이지 show 처리시 해당 Object(jquery선택자)
	 */
	function setLoadingMsg(targetTable, msg, targetObj) {
		targetTable.each(function(idx, el){
			var thLength = $(el).find("tr.top th").length;
			$(el).find("tr:not(.top)").remove();
			$(el).append('<tr><td colspan="' + thLength + '" align="center">' + msg + '</td></tr>')
			
		});
		try{
			targetObj.show();
		}catch(e){}
	}
	
	var isAjaxLoadingAvailable = true;
	function isAjaxLoadingAvailable() {
		return isAjaxLoadingAvailable;
	}
	/**
	 * 페이지 데이터 ajax 통신
	 * @param url: 
	 * @param type: get/post
	 * @param params: 파라메터 
	 * @param successFunc: ajax통신 성공에 대한 리턴 결과 값
	 * @param errorFunc: ajax통신 실패에 대한 리턴 결과 값
	 */
	function ajaxDataLoading(url, type, params, loadingMsgFlag, resultViewFunc) {
		//자가점검통계 유무 체크
		var selfStatsList = (url.indexOf("SelfMonitorStatsMng.do") > -1) ? true : false;
		
		if (!isAjaxLoadingAvailable) {
			return false;
		}
		isAjaxLoadingAvailable = false;
		
		var errorFunc = function(data){
			try{
				if(typeof(data) === 'object'){
					if(data.ERROR_MESSAGE == null || data.ERROR_MESSAGE=="") {
						alert("리스트 조회중 오류 발생!!");
					}else{
						alert(data.ERROR_MESSAGE);
					}
				}else if(data === undefined || data === null || typeof(data) === 'string') {
					gf_ajax(
						"/Fwl/Common.do",
						{
							"pageFlag":'SESSION_GET_TIME'
							//,"seChk":'true'
						},
						function(data){
							var alertAction = function(_type) {
								switch(_type) {
									case 1:
										alert('세션이 종료되었습니다.\n다시 로그인 후 이용 가능합니다.');
										location.href= "/Fwl/FlyerMain.do";
										break;
									case 2:
										alert('리스트 조회중 오류 발생가 발생하였습니다!');
										break;
									default:
										alert('리스트 조회중 오류 발생가 발생하였습니다!');
										break;
								}
							}
							if(data == null || data.sessiontime === undefined) {
								alertAction(1);
							}else if(parseInt(data.sessiontime) <= 0) {
								alertAction(1);
							}else if(data.result === 'success') {
								alertAction(2);
							}
						},
						function(data){
							alert('리스트 조회중 오류 발생가 발생하였습니다!');
						}
					);
				}
				
				/*
				if(data.ERROR_MESSAGE == null || data.ERROR_MESSAGE=="") {
                    alert("리스트 조회중 오류 발생!!");
                }else{
                    alert(data.ERROR_MESSAGE);  
                }
				*/ 
				 
            }catch(e){}
            
            setLoadingImage(false);
            
            if(selfStatsList) {	//자가점검통계
            	var tabCode = $("#tabCode").val();
                var tabIdx = tabCode.charAt(tabCode.length-1);
                var cIdx = eval(tabIdx-1);
            	var targetObj = $("div.selfContentView:eq(" + cIdx + ")");
                setLoadingMsg(targetObj.find("table"), "리스트 조회중 오류발생!!", targetObj);
            }else{
            	var targetObj = $('#dataList');
            	setLoadingMsg(targetObj, "<br>리스트 조회중 오류발생!!<br><br>");
            }
		}
		
		$.ajax({
			url: url,
			type: type,
			data: params,
			//cache: false,
			//dataType: "json",
			error : function() {
				errorFunc();
				//setLoadingImage(false);
			},
			success:function(data){
				//successFunc(data);
				if(data.result === "success") {
					if(selfStatsList) {	//자가점검통계
						var tabCode = data.tabCode;
						tabCode = (tabCode =='' || tabCode==null) ? 'selfTab01' : tabCode;
						resultViewFunc(data, tabCode);
						//기존 ajax통신 데이터 상태 반영
						$("#" + tabCode).attr('selfViewflag', true);
					}else{
						resultViewFunc(data, url);
					}
				}else{
					errorFunc(data);
				}
				/*}else if(data.result === "fail"){
					errorFunc(data);
				}else{
					if(typeof(data) !== 'object') {
						alert('로그인 후 이용 가능합니다.');
						location.href= "/Fwl/FlyerMain.do";
					}
				}*/
			},
			complete : function() {
				//setLoadingImage(false);
				isAjaxLoadingAvailable = true;
				//completeFunc();
				setLoadingImage(false);
			},
			beforeSend : function() {
				//setLoadingImage(true);
				//beforeSendFunc();
				setLoadingImage(true);
				if(loadingMsgFlag) {
					if(selfStatsList) {	//자가점검통계
						var tabCode = $("#tabCode").val();
		                var tabIdx = tabCode.charAt(tabCode.length-1);
		                var cIdx = eval(tabIdx-1);
						var targetObj = $("div.selfContentView:eq(" + cIdx + ")");
						setLoadingMsg(targetObj.find("table"), "리스트 조회중!!", targetObj);
					}else{
						var targetObj = $('#dataList');
						setLoadingMsg(targetObj, "<br>리스트 조회중!!<br><br>");
					}
				}
			}
		});
		
		return true;
	}
	
	function ajaxDataLoading2(url, type,  params, successFunc, errorFunc, completeFunc, beforeSendFunc) {
		if (!isAjaxLoadingAvailable) {
			return false;
		}
		isAjaxLoadingAvailable = false;
		
		$.ajax({
			url: url,
			type: type,
			data: params,
			error : function() {
				errorFunc()
				//setLoadingImage(false);
			},
			success:function(data){
				successFunc(data);		
			},
			complete : function() {
				//setLoadingImage(false);
				isAjaxLoadingAvailable = true;
				completeFunc()
			},
			beforeSend : function() {
				//setLoadingImage(true);
				beforeSendFunc();
			}
		});
		
		return true;
	}
	
	/*
	 * 페이지 로딩 메시지
	 * @param targetTable: 해당 table내 메시지 처리(tr>th(td)
	 * @param msg: 로딩메시지(..로딩중/...에러발생/...데이터없음/..)
	 * @param targetObj: tab버튼으로 페이지 show 처리시 해당 Object(jquery선택자)
	 */
	function setPagingPartHtml(targetObj, targetData, callback) {
		var pagingPart = targetData.replaceAll("<br>", "");
		targetObj.empty().append(pagingPart);
		targetObj.find('a').removeAttr('onclick');
		
       	//pageDataLoading(pageNum);
      
		targetObj.find('a').each(function(i){
			$(this).removeAttr("href");
    		$(this).on({
    			click: function() {
    				var pageNum = 1;
    				if($(this).text() === "<") {
    					pageNum = parseInt($(this).next().text()) - 1;
    				}else if($(this).text() === ">") {
    					pageNum = parseInt($(this).prev().text()) + 1;
    				}else{
    					pageNum = parseInt($(this).text());
    				}
    				//이동 페이지번호 지정
	    			callback(pageNum);
	    			if(parseInt($("html").scrollTop()) > 80) {
	    				$("html").scrollTop(80);
	    			}
				}
    			
    		});
    	});
		
	}
	