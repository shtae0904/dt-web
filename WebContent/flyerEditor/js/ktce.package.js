/***********************************************************************
[A4S] version [v2.0] Copyright ⓒ [2015] kt corp. All rights reserved.
This is a proprietary software of kt corp, and you may not use this file except in compliance with license agreement with kt corp.
Any redistribution or use of this software, with or without modification shall be strictly prohibited without prior written approval of kt corp,
and the copyright notice above does not evidence any actual or intended publication of such software.
************************************************************************/
/***********************************************************************
* 프로그램명 : KTCE Package
* 설명     : KTCE Editor 공통으로 사용할 Package정의
* 개발자	  : 정승환
* 최초작성일 : 2015.09.21
* 수정이력  :
************************************************************************/
/*
 * KTCE Package
 * @Package
 * @Description : KTCE Package 선언
 **/
KTCE = {
	util : {}								// 유틸리티 객체
	, type : null							// 일반, 손글씨 구분
	, object : {}							// 객체 프로퍼티 저장용

	// 페이퍼
	, currentPaper : {}						// 현재 에디트하고 있는 페이퍼
	, paperArray : []						// 전체 페이퍼 배열

	// 저장
	, tempSaveFlag : false					// 임시 저장 플래그
	, paperInfo : {}						// 현재 편집기의 페이퍼 기본 정보 저장 객체
	, goNext : false						// 에디터에서 다음 단계(CI/BI 검수)로 넘어가기 위한 플래그
	, goPrev : false						// 에디터에서 전 단계(템플레이트 선택)로 넘어가기 위한 플래그
	
	// 임시저장용
	, tempFile : {
		uriArray : []						//
		, svgArray : []						// SVG string
		, myImageArray : []					// 내컴퓨터에서 불러온 이미지의 id
	}

	// do, undo
	, stateStack : []						// 현재 페이퍼 상태 저장 배열
	, reDoStack : []						// redo를 실행하기 위한 저장 배열
	, restoreFlag : false					// 현재 페이퍼가 restoring 중인지 표시하는 플래그
	, saveState : function() {}				// 현재 상태를 저장하기 위한 전역 함수
	, updateData : function() {}			// 현재 상태를 restore하기 위한	함수

	// 텍스트
	, textCreating : false					// 텍스트 만들기 상태
	, textEditModeFlag : false				// 텍스트 편집중 flag
	, position : {							// 페이퍼 내에서 마우스의 위치
		x : null
		, y : null
	}
	, font : {								// 현재 상단 기능바에서 선택되어 있는 폰트 스타일 객체
		size : null							// 폰트 사이즈
		, family : null						// 폰트 종류
		, color : null						// 폰트 색상
	}
	, paragraph : {							// 현재 상단 기능바에서 선택되어 있는 문단 스타일 객체
		lineHeight : null					// 행간
		, letterSpacing : null				// 자간
	}
	, textCursor : null						// 텍스트 커서
	, textCursorPos : {						// 텍스트 커서 위치
		x : null
		, y : null
		, order : null
	}

	// 테이블
	, tableCellDragFlag : false				// 테이블에서 cell이 드래그하고 있는지 판단하는 플래그

};