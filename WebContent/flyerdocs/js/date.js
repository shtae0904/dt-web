	// 달력처리 Start -------------------------------------------------------------------------------------------------------
	$(function() {
		$.datepicker.regional['ko']= {
 		     closeText:'닫기',
 		     prevText:'이전달',
 		     nextText:'다음달',
 		     currentText:'오늘',
 		     monthNames:['1월(JAN)','2월(FEB)','3월(MAR)','4월(APR)','5월(MAY)','6월(JUM)','7월(JUL)','8월(AUG)','9월(SEP)','10월(OCT)','11월(NOV)','12월(DEC)'],
 		     monthNamesShort:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
 		     dayNames:['일','월','화','수','목','금','토'],
 		     dayNamesShort:['일','월','화','수','목','금','토'],
 		     dayNamesMin:['일','월','화','수','목','금','토'],
 		     weekHeader:'Wk',
 		     dateFormat:'yy-mm-dd',
 		     firstDay:0,
 		     isRTL:false,
 		     showMonthAfterYear:true,
 		     yearSuffix:''
 		 };
 		 
 		 $.datepicker.setDefaults($.datepicker.regional['ko']);
 		 
 		 $("#startDate").datepicker({
 		     buttonText:"달력",
 		     dateFormat: 'yy-mm-dd', 	// 데이터 포멧형식
 		     minDate: '-5Y',   			// 오늘 부터 5년전까지만 선택 할 수 있다.
		     maxDate: '+0M',  			// 오늘까지만 선택 할 수 있다.
		     //minDate: '-3M',   		// 오늘 부터 3달전까지만 선택 할 수 있다.
		     //maxDate: '+36M',  		// 오늘 부터 36개월후까지만 선택 할 수 있다.
 		     yearRange: '2013:2040', 	// 년도 제한하기
 		     changeMonth: true, 		// 달별로 선택 할 수 있다.
 		     changeYear: true,   		// 년별로 선택 할 수 있다.
 		     showOtherMonths: true, 	// 이번달 달력안에 상/하 빈칸이 있을경우 전달/다음달 일로 채워준다.
 		     selectOtherMonths: true, 
 		     showButtonPanel: true, //오늘 날짜로 돌아가는 버튼 및 닫기 버튼을 생성한다.
 		     onClose:function(selectedDate){
 		    	if($("#endDate").val() == '') {
 		    		var sdate = new Date();
	 		   		var year = sdate.getFullYear();
	 		   		var month = addOne(sdate.getMonth() + 1);
	 		   		var day = addOne(sdate.getDate());
	 		   		var today = year + "-" + month + "-" + day;
	 		   		$("#endDate").val(today)
 		    		$('#endDate').datepicker('option','maxDate',today);
 		    	}
				//$('#endDate').datepicker('option','minDate',selectedDate);
			 }
 		 });

 		 $("#endDate").datepicker({
 		     buttonText:"달력",
 		     dateFormat: 'yy-mm-dd', 	// 데이터 포멧형식
 		     minDate: '-5Y',   			// 오늘 부터 5년전까지만 선택 할 수 있다.
		     //maxDate: '+0M',   			// 오늘까지만 선택 할 수 있다.
		     //minDate: '-3M',   		// 오늘 부터 3달전까지만 선택 할 수 있다.
		     maxDate: '+36M',   		// 오늘 부터 36개월후까지만 선택 할 수 있다.
 		     yearRange: '2013:2040', 	// 년도 제한하기
 		     changeMonth: true, 		// 달별로 선택 할 수 있다.
 		     changeYear: true,   		// 년별로 선택 할 수 있다.
 		     showOtherMonths: true, 	// 이번달 달력안에 상/하 빈칸이 있을경우 전달/다음달 일로 채워준다.
 		     selectOtherMonths: true, 
 		     showButtonPanel: true 		// 오늘 날짜로 돌아가는 버튼 및 닫기 버튼을 생성한다.
 		    
 		 });

  		$("#startDate, #endDate").on({'keydown keyup': function(event) {
  			
 	 			var inputNumber = this.value.replaceAll('-','');
 	 			if( !(event.keyCode >= 37 && event.keyCode <= 40) && event.keyCode != 8 && event.keyCode < 45 || event.keyCode > 57) {
 			        if(event.type == 'keydown' && event.keyCode !== 13  && event.keyCode !== 8 && event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
 			        	alert('숫자만 입력해 주세요!!!');
 			        }
 			        setTimeout(function() {
 			            this.onfocusin = "true";
 			        }, 10)
 			        return false;
 	 			}else{
 	 				var inputString = "";
 	 				for(var i=0; i<inputNumber.length; i++) {
 	 					//console.log(inputNumber[i])
 	 					if(i==4) {
 	 						inputString += "-" + inputNumber[i];
 	 					}else if(i==6) {
 	 						if(inputNumber[i] =="-") {
 	 							inputString += inputNumber[i];
 	 						}else{
 	 							inputString += "-" + inputNumber[i]
 	 						}
 	 					}else{
 	 						if(inputNumber[i] =="-") return false;
 	 						inputString += inputNumber[i];
 	 					}
 	 				}
 	 				this.value = inputString;
 	 			}
 	 		}
  		})
		
	});
	
	function selectGigan(gigan){
		$('#gigan').val(gigan);
    	var sdate = new Date();
    	var year = sdate.getFullYear();
		var month = addOne(sdate.getMonth() + 1);
		var day = addOne(sdate.getDate());
		var today = year + "-" + month + "-" + day;
		document.getElementById('endDate').value = today;
    		
    	if(gigan=='today'){
    		document.getElementById('startDate').value=today;
    	}else{
    		addDay(year,month-1,day,gigan);
    	}
	}
	
	// 날짜조회 
	function addDay(year,month,day,gigan){
    	
    	if(gigan=='7'){
    		var sdate = new Date(year, month, Number(day) - 7);
    		var year = sdate.getFullYear();
    		var month = addOne(sdate.getMonth() + 1);
    		var day = addOne(sdate.getDate());
    		var today = year + "-" + month + "-" + day;
    		document.getElementById('startDate').value = today;
		}else if(gigan=='1'){
			var sdate = new Date(year, Number(month - 1), day);
			var year = sdate.getFullYear();
			var month = addOne(sdate.getMonth() + 1);
			var day = addOne(sdate.getDate());
			var today = year + "-" + month + "-" + day;
			document.getElementById('startDate').value = today;
		}else if(gigan=='3'){
			var sdate = new Date(year, Number(month - 3), day);
			var year = sdate.getFullYear();
			var month = addOne(sdate.getMonth() + 1);
			var day = addOne(sdate.getDate());
			var today = year + "-" + month + "-" + day;
			document.getElementById('startDate').value = today;
		}else if(gigan=='all'){
			document.getElementById('startDate').value = "";
			document.getElementById('endDate').value = "";
		}
    }
	
	// 날짜조회 
	function listAddDay(year,month,day,gigan){
    	if(gigan=='7'){
    		var sdate = new Date(year, month, Number(day) - 7);
    		var year = sdate.getFullYear();
    		var month = addOne(sdate.getMonth() + 1);
    		var day = addOne(sdate.getDate());
    		var today = year + "-" + month + "-" + day;
    		$("#startDate").val(today);
		}else if(gigan=='1'){
			var sdate = new Date(year, Number(month - 1), day);
			var year = sdate.getFullYear();
			var month = addOne(sdate.getMonth() + 1);
			var day = addOne(sdate.getDate());
			var today = year + "-" + month + "-" + day;
			$("#startDate").val(today);
		}else if(gigan=='3'){
			var sdate = new Date(year, Number(month - 3), day);
			var year = sdate.getFullYear();
			var month = addOne(sdate.getMonth() + 1);
			var day = addOne(sdate.getDate());
			var today = year + "-" + month + "-" + day;
			$("#startDate").val(today);
		}else if(gigan=='all'){
			$("#startDate").val("");
			$("#endDate").val("");
		}
    }
	
    function addOne(day){
	    if (day < 10) {
	    	return "0" + day;
	    } else {
	    	return day;
	    }
    }
    
    function viewStartCal(){
    	$('#startDate').focus();
    }
    function viewEndCal(){
    	$('#endDate').focus();
    }
	// 달력처리 End -------------------------------------------------------------------------------------------------------