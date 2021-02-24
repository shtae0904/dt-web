$(function(){
	var listInfo = "<tr><td colspan='7' align='center'><br>리스트 조회중 입니다...<br><br></td></tr>";
	var topList; // 자가점검 등록항목을 뿌려주기 위함.
    var errorMsg = "리스트를 조회하는데 실패하였습니다.";
    var url = $('#listfrm').attr('action');
    $('#listfrm #pageFlag').val('PF_SELECT');
    
    getList(url, listInfo, errorMsg);
	
    $(".tab06 li a").click(function(){
        var tab = $(this).attr('id');
        $('#pageFlag').val('PF_SELECT');
        $('#page').val('1');
        $('#aprovSttus').val(tab); 
        $("#rowPerPage").val($("#rowPerPageView").val());
        
        // Tab색상 변경
        $(".tab06 li a").removeClass('m1 on');
        $(".tab06 li a").addClass('m1');
        $(this).removeClass();
        $(this).addClass('m1 on'); 
        
        getList(url, listInfo, errorMsg);
    });
    
    $("#rowPerPageView").change(function(){
        $('#pageFlag').val('PF_SELECT');
        $('#page').val('1');
        $("#rowPerPage").val($(this).val());
        
        getList(url, listInfo, errorMsg);
    });
    
    $("#goUserView").click(function(){
        $('#golistfrm').submit();
    });
    
    $("#goAdminView").click(function(){
        $('#golistfrm').submit();
    });
});

/* getList(ajax) : selfMonitoringlist가져오기 */
function getList(url, listInfo, errorMsg){
	// 스크롤 위로 이동
	$(".lnb").scrollTop(0);
    var params = $('#listfrm').serialize();
    var pagingPart;
    //로딩중 로그 띄우기
    if(listInfo != ""){
        $('#orderFrm tr:not(:first)').remove();
        $('#orderFrm tbody:last').append(listInfo);
    }
    
    // 로딩화면
    $("#loading_div").show();
    $("#loading_div .loadingImg").addClass('active');
    
    $.ajax({
        url: url,
        type: "post",
        data: params,
        success:function(data){

        	
        	if(data.result == "fail") {
        		alert(data.ERROR_MESSAGE);
        		//로딩화면 hide
                $("#loading_div").hide();
                $('#orderFrm tbody tr:last>td').html("<br>리스트 조회중 오류발생!!<br><br>");
        		return;
        	}else if(data == null || data == '' || data.result!='success') {
        		alert(data.ERROR_MESSAGE);
        		return;
        	}
        	
            //페이징
            //pagingPart = data.pagingPart;	//원본
        	pagingPart = data.pagingPart.replaceAll("<br>", "");
            
            //slfTopList
            topList = "";
            if(data.slfTopList != '' && data.slfTopList != null){
            	for(var j=0; j < data.slfTopList.length; j++){
	               	topList += "<tr><td class='top_tr'><img src='/flyerdocs/images/ico_list_top.png' alt='' />" +
	                   "</td><td class='tal'><a href='javascript:goDetail(\"" + data.slfTopList[j].slfmntrId + "\", \"1\", \"" + data.slfTopList[j].slfmntrAppendType + "\", \"\")'>" + data.slfTopList[j].slfmntrTitle + "</a>" +
	                   "</td><td>" + data.slfTopList[j].expiryDate +
	                   "</td><td colspan='4'><a href='javascript:goDetail(\"" + data.slfTopList[j].slfmntrId + "\", \"1\", \"" + data.slfTopList[j].slfmntrAppendType + "\", \"\")'>자가 점검 결과 등록</a>" +
	                   "</td></tr>";
            	}
            }
            if(data.slfList != '' && data.slfList != null){
                listInfo = "";
                for(var i=0; i < data.slfList.length; i++){
                    // 번호 
                	var listNo;
                	if(url == '/Fwl/SelfMonitoring.do'){
                		listNo = data.totalCount - i - data.searchSelfMonitoring.startRowPosition + 1;
                	}else {
                		listNo = data.totalCount - i - data.searchAdminList.startRowPosition + 1;
                	}
                    // 자가점검 상태표시(점검완료, 승인완료, 반려, 반려(기간만료))
                    var sttus = data.slfList[i].aprovSttus;
                    var dateOver = data.slfList[i].isExpiryDateOver;
                    if(sttus == '반려' && dateOver == 'Expired'){
                        sttus += "<br>(기간만료)";
                    }else {
                        sttus;
                    }
                    if(url == '/Fwl/SelfMonitoring.do'){
                        listInfo += "<tr><td>" + listNo + 
                            "</td><td class='tal'><a href='javascript:goDetail(\"" + data.slfList[i].slfmntrId + "\", \"" +  listNo + "\", \"" + data.slfList[i].slfmntrAppendType + "\", \"" + data.slfList[i].cntpntCd + "\")'>" + data.slfList[i].slfmntrTitle +  "</a>" +
                            "</td><td>" + data.slfList[i].expiryDate + 
                            "</td><td>" + sttus + 
                            "</td><td>" + data.slfList[i].storDeptPartOrgNm + 
                            "</td><td>" + data.slfList[i].regEmpNm + 
                            "</td><td>" + data.slfList[i].regDate + "</td></tr>";
                    }else {
                    	listInfo += "<tr><td>" + listNo + 
                        "</td><td class='tal'><a href='javascript:openDetail(\"" + data.slfList[i].slfmntrId + "\", \"" +  listNo + "\", \"" + data.slfList[i].slfmntrAppendType + "\", \"" + data.slfList[i].cntpntCd + "\")'>" + data.slfList[i].slfmntrTitle +  "</a>" +
                        "</td><td>" + data.slfList[i].expiryDate + 
                        "</td><td>" + sttus + 
                        "</td><td>" + data.slfList[i].storDeptPartOrgNm + 
                        "</td><td>" + data.slfList[i].regEmpNm + 
                        "</td><td>" + data.slfList[i].regDate + "</td></tr>";
                    }
                }
            }else{
            		listInfo = "<tr><td colspan='7' align='center'>내용이 없습니다.</td></tr>";
            }
            //리스트
            $('#orderFrm tr:not(:first)').remove();
            $('#orderFrm tbody:last').append(topList);
            $('#orderFrm tbody:last').append(listInfo);
            
            //search
            //페이지 정보
            if(url == '/Fwl/SelfMonitoring.do'){
            	$('#searchDeptName').val(data.searchSelfMonitoring.searchDeptName);
            	$('#searchDeptNo').val(data.searchSelfMonitoring.searchDeptNo);
            	$('#searchEmpName').val(data.searchSelfMonitoring.searchEmpName);
            	$('#searchEmpNo').val(data.searchSelfMonitoring.searchEmpNo);
            	$('#searchNameview').val(data.searchSelfMonitoring.searchName);
            	
            	$('#aprovSttus').val(data.searchSelfMonitoring.aprovSttus);
            	$('#pageFlag').val(data.searchSelfMonitoring.pageFlag);
            	$('#page').val(data.searchSelfMonitoring.page);
            	$('#rowPerPage').val(data.searchSelfMonitoring.rowPerPage);
            }else {
            	$('#searchDeptName').val(data.searchAdminList.searchDeptName);
                $('#searchDeptNo').val(data.searchAdminList.searchDeptNo);
                $('#searchEmpName').val(data.searchAdminList.searchEmpName);
                $('#searchEmpNo').val(data.searchAdminList.searchEmpNo);
                $('#searchNameview').val(data.searchAdminList.searchName);
                
                $('#aprovSttus').val(data.searchAdminList.aprovSttus);
                $('#pageFlag').val(data.searchAdminList.pageFlag);
                $('#page').val(data.searchAdminList.page);
                $('#rowPerPage').val(data.searchAdminList.rowPerPage);
            }
            
            //페이지 바
            $('#pagingId').empty();
            $('#pagingId').append(pagingPart);
            
            //로딩화면 hide
            $("#loading_div").hide();
        }
    // 사용자화면가기/ 관리자화면가기 크롬에서 에러발생 
    // 에러코드 0 --> 원인 : 페이지 전환 후 ajax를 호출 그러나 크롬에서 속도가 빨라 페이지 전환이 완료 하기도 전에 ajax가 호출됨 
    // 그래서 request.status == 0 일 때 에러에서 빠져나오게 해줌.
    , 
        error: function(request, status, error){
        	if(request.status == 0){
        		return ;
        	}else{
        		alert(errorMsg + "\n" + "code : " + request.status + "\n" + "message : " + request.responseText + "\n" + "error : " + error);
        	}
        }
    });
}

/* 상세조회 */
function goDetail(slfmntrId, listNo, type, cntpntCd){
    $('#slfmntrId').val(slfmntrId);
    $('#listNo').val(listNo);
    $('#cntpntCd').val(cntpntCd);
    $('#searchWord').val($('#searchWord').val() + "[Ontr]"+ $('#aprovSttus').val());
    if(type == 'Require') $('#pageFlag').val('PF_INSERT');
    else if(type == 'Complite') $('#pageFlag').val('PF_DETAIL');
    $('#listfrm').submit();
}

/* 검색  */
function goSearch(){
    $('#pageFlag').val('PF_SELECT');
    $('#page').val('1');
    
    url = $('#listfrm').attr('action');
    listInfo = "";
    errorMsg = "검색중 에러가 발생하였습니다.";
    getList(url, listInfo, errorMsg);
}

/* 검색 엔터 이벤트 */
function searchKeyDown(){
    if(window.event.keyCode == 13){
        goSearch();
    }
}

/**
 * 전단지 편집기 호출
 * @param 
 * @returns
 */
function openDetail(slfmntrId, listNo, type, cntpntCd){
    var b_Width = (parseInt(screen.width, 10) / 2) - 150, b_Height = (parseInt(screen.height, 10) / 2) - 450;
    var pop_status;
    pop_status = window.open( "" , "PF_DETAIL", "width=1050,height=790, left=" + b_Width + ",top =" + b_Height + ",resizable=yes, scrollbars=yes");
    $("#detailfrm").find("input[name=pageFlag]").val("PF_DETAIL");
    $("#detailfrm").attr("target","PF_DETAIL");
    $('#detailfrm #slfmntrId').val(slfmntrId);
    $('#detailfrm #cntpntCd').val(cntpntCd);
    $('#detailfrm #listNo').val(listNo);
    $("#detailfrm").submit();
    
    pop_status.focus();
} 

function closePop(){ //상세 닫기
    $('.pop_open1, .pop_overlay', top.document).fadeOut('');
}