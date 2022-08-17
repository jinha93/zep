// 사이드바 앱이 터치(클릭)되었을 때 동작하는 함수
App.onSidebarTouched.Add(function (p) {
	p.moveSpeed = p.moveSpeed * 2;
	p.sendUpdated();
});

// 플레이어가 입장 할 때 동작하는 함수
App.onJoinPlayer.Add(function (p) {
});

// 플레이어가 퇴장 할 때 동작하는 함수
App.onLeavePlayer.Add(function (p) {
});
