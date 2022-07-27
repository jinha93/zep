// 변수에 SpriteSheet를 읽어 저장
let wonderDragonz = App.loadSpritesheet('wonder-dragonz.png', 48, 64, {
    left: [0],
    right: [1],
}, 1);

// 플레이어가 입장할 때 바로 블루맨 그림으로 교체해준다.
App.onJoinPlayer.Add(function(player){
	if(player.role == 3001 || player.role == 3000){
		player.sprite = wonderDragonz;
		player.moveSpeed = 160;
	}
	 
  // 플레이어 속성이 변경되었으므로 호출해서 실제 반영해준다.
	player.sendUpdated();
})