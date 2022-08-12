let _players = App.players;

// 플레이어가 스페이스에 입장 했을 때 이벤트
App.onJoinPlayer.Add(function(p) {
	_players = App.players;
});


// 플레이어가 스페이스를 나갔을 때 이벤트
App.onLeavePlayer.Add(function(p) {
    _players = App.players;
});

// 플레이어가 채팅을 칠 때 실행
App.onSay.add(function(player, text) {
	if('!꽁치짱' == text){		
		if(player.role == 3001 || player.role == 3000){
			spawnEveryone();
		}
	}
});

//모든 플레이어를 특정 맵으로 스폰
function spawnEveryone() {
    for (let i in _players) {
        let player = _players[i]
        player.spawnAtMap('8MXlBq', 'DvKLQp')
    }
}