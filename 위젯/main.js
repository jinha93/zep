<<<<<<< Updated upstream
//UI가 노출될 위치(정렬, 가로, 세로) 값을 변수로 사전에 제작
let position = 'middle';
let width = 400;
let height = 400;

// my.html로 state라는 태그를 만들어 hello라는 값을 전달
let _widget = App.showWidget('my.html', position, width, height);
=======
let _players = App.players;
let _playerCount = App.playerCount;


// 사이드바 앱이 터치(클릭)되었을 때 동작하는 함수
App.onSidebarTouched.Add(function (p) {
	p.tag.widget = p.showWidget("widget.html", "sidebar", 350, 350);
	p.tag.widget.sendMessage({
		text: "현재 접속자 수 : " + App.playerCount + " 명",
	});
	p.tag.widget.onMessage.Add(function (player, data) {
		if (data.type == "close") {
			player.showCenterLabel("위젯이 닫혔습니다.");
			player.tag.widget.destroy();
			player.tag.widget = null;
		}
	});
});

// 플레이어가 입장 할 때 동작하는 함수
App.onJoinPlayer.Add(function (p) {
	p.tag = {
		widget: null,
	};
});

// 플레이어가 퇴장 할 때 동작하는 함수
App.onLeavePlayer.Add(function (p) {
	if (p.tag.widget) {
		p.tag.widget.destroy();
		p.tag.widget = null;
	}
});
>>>>>>> Stashed changes
