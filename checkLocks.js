

function lockCollision(boundary) {
	if (rectangularCollision({
				rectangle1: player,
				rectangle2: {
					...boundary, 
					position: {
						x: boundary.position.x ,
						y: boundary.position.y
					},
					id: boundary.id
				}
			}) 
		) {
			return(true)
		}
} 


function checkLocks() {
	//monitor for boundary collisions
	for (let i = 0; i < boundaries.length; i++) {
		const boundary = boundaries[i]
		if(boundary.id != 'lock' && boundary.isOpen == true) continue
			if(lockCollision(boundary) == true){
				if(boundary.building == '1' && boundary.unlocked == false )
				 {
				 	keys.e.pressed = false
				 	playerDialogue.innerHTML = 'The door seems to be locked...'
						playerDialogue.style.display = 'flex'
						setTimeout(() => {
								playerDialogue.style.display = 'none'				
						}, 3000)
					console.log('locked')
					//returning true means it is locked and no door opens
					return(true)
				
				break
				} else if(boundary.building == '2' && boundary.unlocked == false )
				 {
				 	keys.e.pressed = false
				 	playerDialogue.innerHTML = 'The door seems to be locked...'
						playerDialogue.style.display = 'flex'
						setTimeout(() => {
								playerDialogue.style.display = 'none'				
						}, 3000)
					console.log('locked')
					//returning true means it is locked and no door opens
					return(true)
				
				break
				} else false
			}
	}
}

		
	