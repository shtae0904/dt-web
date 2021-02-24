function fnBrowerTypeAction() {
	
	var getBrowserType = null;
	var agent = navigator.userAgent.toLowerCase();
	var name = navigator.appName;
	
	if(name == 'Microsoft Internet Explorer'){
		getBrowserType = 'msie';
	} else {
		if(agent.search('trident') > -1)	getBrowserType='msie11';
		else if(agent.search('edge/') > -1)	getBrowserType='msie12';
		else if(agent.search('chrome') > -1)getBrowserType='chrome';
		else getBrowserType='';
	}

	//ie 접속사용자 ie11 접속여부 확인
	//var agentChk = getBrowserType();
	var agentChk = getBrowserType;
	//if(agentChk === 'msie' || agentChk === 'msie12') {
	if(agentChk === 'msie') {
		alert('IE 11(Internet Explorer 11) 브라우저로 접속해 주세요!!');
		location.href = './flyer/error/browser_error.jsp';
	}
}
fnBrowerTypeAction();