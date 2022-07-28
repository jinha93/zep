// load sprite
let tomb = App.loadSpritesheet('tomb.png', 32, 48, {
    left: [0],  // defined base anim 
    right: [0], // defined base anim 
    up: [0],    // defined base anim 
    down: [0],  // defined base anim 
});
let ice  = App.loadSpritesheet('ice.png', 48, 64, {
    left: [0],  // defined base anim 
    right: [0], // defined base anim 
    up: [0],    // defined base anim 
    down: [0],  // defined base anim 
});
let villain = App.loadSpritesheet('villain.png', 48, 64, {
    left: [5, 6, 7, 8, 9],
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14],
}, 8);

const STATE_INIT = 3000;
const STATE_READY = 3001;
const STATE_PLAYING = 3002;
const STATE_JUDGE = 3004;
const STATE_END = 3005;

let _players = App.players;
let _start = false;	//게임 시작 여부
let _live = 0;	//생존자 수 
let _state = STATE_INIT;
let _stateTimer = 0;

// 플레이어가 스페이스에 입장 했을 때 이벤트
App.onJoinPlayer.Add(function(p) {
	p.tag = {
		ice : false, 		// 얼음 여부, false
		villain : false, 	// 술래 여부, false
		alive : true,		// 생존 여부, true
		attack : 0,			// 죽인 횟수, 0
	};
  
	if(_start){
		p.tag.alive = false;
		p.sprite = tomb;
		p.moveSpeed = 40;
		p.sendUpdated();
	} 
	
	_players = App.players;
});

// 플레이어가 스페이스를 나갔을 때 이벤트
App.onLeavePlayer.Add(function(p) {
    p.title = null;
    p.sprite = null;
    p.moveSpeed = 80;
    p.sendUpdated();

    _players = App.players;
});

// 플레이어가 다른 플레이어를 공격혔을 때 (Z키)
App.onUnitAttacked.Add(function(sender, x, y, target) {
	if(sender.tag.villain){
		return;
	}
	if(!sender.tag.alive){
		return;
	}
	if(!target.tag.ice){
		return;
	}
	
	
	target.tag.ice = false;
	target.sprite = null;
	target.moveSpeed = 80; // 이동속도 정상화
	target.sendUpdated();
	
	sender.tag.attack += 1;
});

// 플레이어가 다른 플레이어와 부딪혔을 때 
App.onPlayerTouched.Add(function(sender, target, x, y) {
    if(_state != STATE_PLAYING){
        return;
	}
    if(!sender.tag.villain){
        return;
	}
    if(!target.tag.alive){
        return;
	}

    target.tag.alive = false;
	target.sprite = tomb;
	target.moveSpeed = 40;
	target.sendUpdated();
	
    sender.tag.attack += 1;
    
    _live = checkSuvivors();
    if(_live > 0){
        App.showCenterLabel(`${target.name} 사망!\n(${_live} 생존!)`);
        return;
    }else{
        startState(STATE_JUDGE);
	}
});


// 플레이어가 지정된 키를 눌렀을 때 실행 (x키)
App.addOnKeyDown(88, function(p){	
	if(!p.tag.ice && !p.tag.villain){
        p.tag.ice = true; 			// 얼음 여부를 true로 변경
		p.sprite = ice;				// 얼음 아바타로 변경
        p.moveSpeed = 0; 			// 이동속도를 0으로 변경
        p.sendUpdated();
    }
});

App.onStart.Add(function(){
    startState(STATE_INIT);
});

// 게임 블록을 밟았을 때 호출되는 이벤트
App.onDestroy.Add(function() {
});

// called every 20ms
// 20ms 마다 호출되는 업데이트
// param1 : deltatime ( elapsedTime )
App.onUpdate.Add(function(dt) {
    if(!_start)
        return;
    
    _stateTimer += dt;

    switch(_state)
    {
        case STATE_INIT:
            App.showCenterLabel("술래는 사람들을 잡고, 사람은 생존하셈.");
            
            if(_stateTimer >= 5)
                startState(STATE_READY);
            break;
        case STATE_READY:
            if(_stateTimer >= 3)
                startState(STATE_PLAYING);
            break;
        case STATE_PLAYING:
            break;
        case STATE_JUDGE:
            App.showCenterLabel(resultstr);

            if(_stateTimer >= 5)
                startState(STATE_END);
            break;
        case STATE_END:
            break;    
    }
});


function startState(state){
	_state = state
	_stateTimer = 0;
	
	switch(_state){
		case STATE_INIT:
			startApp();
            break;
		case STATE_READY:
            App.showCenterLabel("곧 얼음땡 게임이 시작합니다.");
            for(let i in _players)
            {
                let p = _players[i];
                p.moveSpeed = 0;
				
				// 술래 속성 변경
                if(p.tag.villain){
                    p.title = '<술래>';
                    p.sprite = villain;
                }
                p.sendUpdated();
            }
            break;
		case STATE_PLAYING:
            for(let i in _players){
                let p = _players[i];
                // Change speed and label text according to player status
                if(p.tag.villain){
                    p.moveSpeed = 85;
                    p.showCenterLabel('다잡아죽이셈');
                }else{
                    p.moveSpeed = 80;
                    p.showCenterLabel('x누르면 얼음할수잇음');
                }
                p.sendUpdated();
            }
            break;
		case STATE_JUDGE:
            for(let i in _players) {
                let p = _players[i];
                p.moveSpeed = 0;
                p.sendUpdated();
            }

            judgement(_live);
            break;
		case STATE_END:
			_start = false;

            for(let i in _players){
                let p = _players[i];
                p.moveSpeed = 80;
                p.title = null;
                p.sprite = null;
                p.sendUpdated();
            }
			break;
	}
}

function startApp(){
	if(_players.length > 2){
		//술래 세팅
		let villainCnt = Math.floor(_players.length * 0.2);
		if(villainCnt < 1){
			villainCnt = 1;
		};
		
		let allPlayer = [];
        let villainIdx = [];
		
		for(let i = 0; i < _players.length; ++i){
            allPlayer.push(_players[i]);
        }
		
		for(let i = 0; i < villainCnt; ++i){
            let index = Math.floor(allPlayer.length * Math.random());
            if(!villainIdx.includes(allPlayer[index].id))
            {
                villainIdx.push(allPlayer[index].id);
                allPlayer.splice(index, 1);
            }
        }
		
		// give players zombie attribute
        for(let i in _players){
            let p = _players[i];
            // create and utilize option data using tags.
            p.tag = {};
            if(villainIdx.includes(p.id)){
                p.tag.villain = true;
				p.tag.alive = false;
                p.tag.attack = 0;
            }else{
                p.tag.villain = false;
				p.tag.alive = true;
                p.tag.attack = 0;
                _live++;
            }
            
            // when player property changed have to call this method
            // 플레이어 속성 변경 시 반드시 호출하여 업데이트 한다.
            p.sendUpdated();
        }
		
		_start = true;
	}else{
		App.showCenterLabel(`참가자가 3명 이상일 때 시작할 수 있습니다.`);
        startState(STATE_END);
	}
}

//판정
function judgement(number){   
    // The highest number of attacks among all players
    let attack = 0;

	//attack (술래:죽인횟수,시민:땡횟수)
    for(let i in _players){
        let p = _players[i];

        if(p.tag.attack > attack){
            attack = p.tag.attack;
		}            
    }
    
	//MVP
    mvp = [];
    for(let i in _players){   
        let p = _players[i];
        
        if(p.tag.attack == attack){
            mvp.push(p);
		}
    }

    let index = Math.floor(Math.random() * mvp.length);
	
	if(mvp[index].tag.villain){
		resultstr = 'MVP : [' + mvp[index].name + '] 잡은 횟수 : ' + attack;
	}else{
		resultstr = 'MVP : [' + mvp[index].name + '] 땡 횟수 : ' + attack;
	}
}

//생존자 수
function checkSuvivors()
{
    let resultlive = 0;
    for(let i in _players)
    {
        let p = _players[i];
        if(p.tag.alive && !p.tag.ice){
            ++resultlive;
        }
    }

    return resultlive;
}