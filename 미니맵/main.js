//UI가 노출될 위치(정렬, 가로, 세로) 값을 변수로 사전에 제작
let _position = 'top-left';
let _width = Map.width * 5;
let _height = Map.height * 5;
let _players = App.players;

// 위젯에 보낼 맵 이미지 로드
let _mapImg = App.loadSpritesheet("map.png");

// 플레이어가 입장 할 때 동작하는 함수
App.onJoinPlayer.Add(function (p) {
	_players = App.players;
	
	p.tag = {
		widget: null,
	};
	
	p.tag.widget = p.showWidget('my.html', _position, _width+60, _height+20);
	p.tag.widget.sendMessage({
		mapImg: _mapImg.body, //map.body는 map 이미지의 base64 data를 가르킴
		width: _width,
		height: _height,
		tileX: p.tileX,
		tileY: p.tileY,
	});
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
			width: _width,
			height: _height,
			tileX: p.tileX,
			tileY: p.tileY,
		});
		
	}
});

