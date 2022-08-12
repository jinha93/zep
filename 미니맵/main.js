//UI가 노출될 위치(정렬, 가로, 세로) 값을 변수로 사전에 제작
let position = 'middle';
let width = 350;
let height = 350;

let _players = App.players;

// 플레이어가 입장 할 때 동작하는 함수
App.onJoinPlayer.Add(function (p) {
	_players = App.players;
	
	p.tag = {
		widget: null,
	};
	
	p.tag.widget = p.showWidget('my.html', position, width, height);
});

// 플레이어가 퇴장 할 때 동작하는 함수
App.onLeavePlayer.Add(function (p) {
	_players = App.players;
	
	if (p.tag.widget) {
		p.tag.widget.destroy();
		p.tag.widget = null;
	}
});

// called every 20ms
// 20ms 마다 호출되는 업데이트
// param1 : deltatime ( elapsedTime )
App.onUpdate.Add(function(dt) {
	
	for(let i in _players){
		let p = _players[i];
		
		if(p.tag.widget == null){
			return;
		}
		
		p.tag.widget.sendMessage({
			tileX: p.tileX,
			tileY: p.tileY,
		});
		
	}
});



