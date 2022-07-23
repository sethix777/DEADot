//create the canvas and get the 2d context. 
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const score = document.querySelector("#score")
const kills = document.querySelector("#kills")
const ammo = document.querySelector("#ammo")
const gameOverDiv = document.querySelector("#gameOverDiv")
const restartButton = document.querySelector("#restartButton")
const startButton = document.querySelector("#startButton")
const continueButton = document.querySelector("#continueButton")
const playerDialogue = document.querySelector("#playerDialogue")
const pdDiv = document.querySelector("#pdDiv")
const npcDialogue = document.querySelector("#npcDialogue")
const npcDiv = document.querySelector("#npcDiv")
const currentObjective = document.querySelector("#currentObjective")
const objectiveDiv = document.querySelector("#objectiveDiv")

const poolDiv = document.querySelector("#pool")
const arrayDiv = document.querySelector("#array")
const poolLengthDiv = document.querySelector("#poolLength")
const arrayLengthDiv = document.querySelector("#arrayLength")
//set canvas bounds to the width and height of browser
canvas.width = innerWidth
canvas.height = innerHeight

//audio start when screen clicked
let clicked = false
addEventListener('click', () => {
	if (!clicked) {
		audio.bgMusic.play()
		clicked = true
	}
})


/////OBJECT POOLING\\\\\
let enemiesPool = new Array()
let projectilesPool = new Array()
let particlesPool = new Array()
let ammoDropsPool = new Array()

function devTool(display) {
	poolDiv.style.display = display
	arrayDiv.style.display = display

	poolLengthDiv.innerHTML = projectilesPool.length 
	arrayLengthDiv.innerHTML = projectiles.length
	//poolLengthDiv.innerHTML = enemiesPool.length 
	//arrayLengthDiv.innerHTML = enemies.length
	//poolLengthDiv.innerHTML = particlesPool.length 
	//arrayLengthDiv.innerHTML = particles.length
	// poolLengthDiv.innerHTML = ammoDropsPool.length 
	// arrayLengthDiv.innerHTML = ammoDrops.length
}


//////////////////////////////////

//create player class
class Player {
	constructor(x, y, radius, color) {
		this.position = {
			x: x,
			y: y
		}
		this.radius = radius
		this.color = color
		this.moving = true
		this.velocity = {
			x: 0,
			y: 0
		}
		this.isTalking = false
		this.placingNpc = false
		this.canShoot = true
	}
	draw() {
		//draw placement radius
		if(this.placingNpc) {
			c.beginPath()
			//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
			c.arc(this.position.x, this.position.y, this.radius*4, 0, Math.PI * 2, false)
			c.fillStyle = 'rgba(211,211,211,.5)'
			c.fill()
		}

		c.beginPath()
		//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}

	update() {
		this.draw()

		const friction = 0.7
		this.velocity.x *= friction
		this.velocity.y *= friction


		if (
			this.position.x + this.radius + this.velocity.x <= canvas.width && 
			this.position.x - this.radius + this.velocity.x >= 0 ) 
			{
				this.position.x += this.velocity.x
			} else (this.velocity.x = 0)
		//collision on y axis
		if (
			this.position.y + this.radius + this.velocity.y <= canvas.height && 
			this.position.y - this.radius + this.velocity.y >= 0 ) 
			{
				this.position.y += this.velocity.y
			} else (this.velocity.y = 0)
		

	}
}

class MobileButton { 
	constructor(x, y, radius, color) {
		this.position = {
			x: x,
			y: y
		}
		this.radius = radius
		this.color = color
	}
	draw() {
		c.beginPath()
		//create button circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}

	update() {
		this.draw()
	}
}

let leftJoystick = new MobileButton(90,235, 60, 'rgba(192,192,192,.3)')
let rightJoystick = new MobileButton(660,235, 60, 'rgba(192,192,192,.3)')
let interactButton = new MobileButton(575,175, 30, 'rgba(192,192,192,.5)')

class AimLine {
	constructor(position2 = {x: null, y: null}, color = 'rgba(255,0,0,1)') {
		this.position2 = position2
		this.color = color
	}
	draw() {
		c.strokeStyle = this.color;
	    c.lineWidth = 2;

	    // draw a red line
	    c.beginPath();
	    c.moveTo(player.position.x, player.position.y);
	    c.lineTo(this.position2.x, this.position2.y);
	    c.stroke();
	}

}


//create projectile class
class Projectile {
	constructor(x, y, radius, color, velocity, origin) {
		this.position = {
			x: x,
			y: y
		}
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.moving = true
		this.origin = origin
	}
	draw() {
		c.beginPath()
		//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update() {
		this.draw()
		this.position.x = this.position.x + this.velocity.x 
		this.position.y = this.position.y + this.velocity.y
	}
}

class AmmoDrop {
	constructor(x, y, radius, color, velocity) {
		this.position = {
			x: x,
			y: y
		}
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.moving = true
	}
	draw() {
		c.beginPath()
		//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update() {
		this.draw()
		this.position.x = this.position.x + this.velocity.x 
		this.position.y = this.position.y + this.velocity.y
	}
}

class Enemy {
	constructor(x, y, radius, color, velocity) {
		// this.position.x = x
		// this.position.y = y 
		this.position = {
			x: x,
			y: y
		}
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.moving = true
		this.direction = Math.random()
	}
	draw() {
		c.beginPath()
		//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update() {
		//this.moving = true
		this.draw()
		const angle = Math.atan2(player.position.y - this.position.y, player.position.x - this.position.x)
		monitorCollisions(this, 0,0)
		if (this.moving) {
			this.velocity.x = Math.cos(angle)
			this.velocity.y = Math.sin(angle)
			this.position.x = this.position.x + this.velocity.x 
			this.position.y = this.position.y + this.velocity.y
		} else {

			this.position.x = this.position.x - this.velocity.x 
			this.position.y = this.position.y - this.velocity.y 

			setTimeout(() => {
				this.moving = true
			}, 500)
		}
	}
}

const friction = 0.97
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.position = {
			x: x,
			y: y
		}
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
		this.moving = true
	}
	draw() {
		c.save()
		c.globalAlpha = this.alpha
		c.beginPath()
		//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
		c.restore()
	}
	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.position.x = this.position.x + this.velocity.x 
		this.position.y = this.position.y + this.velocity.y
		this.alpha -= 0.03
	}
}

//test boundary
class Boundary {
	static width = 45
	static height = 45
//88for mystic woods tileset / width
	//width and height should be 66, but changed for new sprite
	constructor({position, width = 45, height = 45, id, scale, isOpen = false, direction, directionCheckX = 0, directionCheckY = 0, building = null, unlocked = true, name = null}) {
		this.position = position
		this.width = width
		this.height = height
		this.id = id,
		this.scale = scale
		this.isOpen = isOpen
		this.isOpening = false
		this.isClosing = false
		this.direction = direction
		this.directionCheckX = directionCheckX
		this.directionCheckY = directionCheckY	
		this.building = building
		this.unlocked = unlocked
		this.name = name
		this.visible = false		
		

	}
	draw() {
		if(this.id == 'collisionDoor') {

			if(this.isOpen && this.isOpening) {
				if(this.direction == 'left') {
					console.log('left opening')
					gsap.to(this.position, {
						x: this.position.x - 45,
						duration: .13
					})
					this.isOpening = false
				} else if(this.direction == 'right') {
					console.log('right opening')
					gsap.to(this.position, {
						x: this.position.x + 45,
						duration: .13
					})
					this.isOpening = false
				} else if(this.direction == 'up') {
					console.log('up opening')
					gsap.to(this.position, {
						y: this.position.y - 45,
						duration: .13
					})
					this.isOpening = false
				} else if(this.direction == 'down') {
					console.log('down opening')
					gsap.to(this.position, {
						y: this.position.y + 45,
						duration: .13
					})
					this.isOpening = false
				}
				
			} else if(!this.isOpen && this.isClosing) {
				if(this.direction == 'left') {
					console.log('left closing')
					gsap.to(this.position, {
						x: this.position.x + 45,
						duration: .13
					})
					this.isClosing = false
				} else if(this.direction == 'right') {
					console.log('right closing')
					gsap.to(this.position, {
						x: this.position.x - 45,
						duration: .13
					})
					this.isClosing = false
				}else if(this.direction == 'up') {
					console.log('up closing')
					gsap.to(this.position, {
						y: this.position.y + 45,
						duration: .13
					})
					this.isClosing = false
				} else if(this.direction == 'down') {
					console.log('down closing')
					gsap.to(this.position, {
						y: this.position.y - 45,
						duration: .13
					})
					this.isClosing = false
				}
				
			}

			//door boundary drawing brown square
			c.fillStyle = 'rgba(111, 78, 55, 1)'
			c.fillRect(this.position.x, this.position.y, this.width, this.height)
			return
		}
		if(this.visible == true) {
			c.fillStyle = 'rgba(255, 223, 0, 0.3)'
			c.fillRect(this.position.x, this.position.y, this.width, this.height)
			return
		}
		//normal boundary
		c.fillStyle = 'rgba(255, 0, 0, 0.0)'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}

	

	open() {
		if(this.id == 'collisionDoor' &&
			(this.position.x + (this.width/2)) - player.position.x < 50 && 
			(this.position.x + (this.width/2)) - player.position.x > -50 &&
			(this.position.y + (this.height/2)) - player.position.y < 50 && 
			(this.position.y + (this.height/2)) - player.position.y > -50)


				if(!this.isOpen && keys.e.pressed && keys.e.lifted) {
					if(checkLocks()) return
					audio.door.play()
					stopMovement()
					stopInteract = true
						setTimeout(() => {
							stopInteract = false
							resumeMovement()
						}, 300)
					keys.e.lifted = false
					this.isOpen = true
					this.isOpening = true
					console.log('open')
				} else if(this.isOpen && keys.e.pressed && keys.e.lifted) {
					keys.e.lifted = false
					if (rectangularCollision({
					rectangle1: player,
					rectangle2: {
						...this, 
						position: {
							x: this.position.x + this.directionCheckX, //directionCheck is either positive or negative for horizontal doors, checks if player is in way
							y: this.position.y + this.directionCheckY	
						},
						id: this.id
					}
					}) 
					) {
						let yoyo
						if(this.direction == 'left' || this.direction == 'right') { 
							if(this.direction == 'left') 
							 yoyo = 5
							else if (this.direction	== 'right') 
							 yoyo = -5
							stopMovement()
							stopInteract = true
							setTimeout(() => {
								stopInteract = false
								resumeMovement()
							}, 300)
							gsap.to(this.position, {
								x: this.position.x + yoyo,
								yoyo: true,
								repeat: 3,
								duration: 0.03
							})
							audio.door.play()
							return
						} else if(this.direction == 'up' || this.direction == 'down') {
							if(this.direction == 'up') 
							 yoyo = 5
							else if (this.direction	== 'down') 
							 yoyo = -5
							stopMovement()
							stopInteract = true
							setTimeout(() => {
								stopInteract = false
								resumeMovement()
							}, 300)
							gsap.to(this.position, {
								y: this.position.y + yoyo,
								yoyo: true,
								repeat: 3,
								duration: 0.03
							})
							audio.door.play()
							return
						}
					}
					audio.door.play()
					stopMovement()
					stopInteract = true
						setTimeout(() => {
							stopInteract = false
							resumeMovement()
						}, 300)
					keys.e.lifted = false
					this.isOpen = false
					this.isClosing = true
					console.log('open')
				}
	}
}
let currentKeyPressed
function stopMovement() {
	if(keys.w.pressed)
		{currentKeyPressed = "w"
				keys.w.pressed = false}
	else if(keys.s.pressed)
		{currentKeyPressed = "s"
					keys.s.pressed = false}	
	else if(keys.a.pressed)
		{currentKeyPressed = "a"
				keys.a.pressed = false}
	else if(keys.d.pressed)
		{currentKeyPressed = "d"
					keys.d.pressed = false}	
}
function resumeMovement() {
	if(currentKeyPressed == "w")
		{keys.w.pressed = true}
	else if(currentKeyPressed == "s")
		{keys.s.pressed = true}	
	else if(currentKeyPressed == "a")
		{keys.a.pressed = true}
	else if(currentKeyPressed == "d")
		{keys.d.pressed = true	}
}
let boundaries = []

///test map
class Maps {
	constructor({position, image}) {
		this.position = position
		this.image = image
	}
	draw() {
	
			c.drawImage(this.image, this.position.x, this.position.y)
		}
		
	}
//}

const background = new Image()
background.src = './assets/maps/map.png'

//set center x/y variables equal to center of canvas
let xCenter = canvas.width/2
let yCenter = canvas.height/2
//set player == to new player object
let player = new Player(xCenter, yCenter, 15, 'yellow')
//draw player

let offset = {
	x: -585,
	y: 300
}

let map = new Maps({
	position: {
		x: xCenter + offset.x,
		y: yCenter - offset.y
	},
	image: background
})

let aimAssist = new AimLine(
			{
				x: 400,
				y: 200
			},
			'rgba(255,0,0,0)'
		)
let mobileDevice = false
let gameOver = true
let projectiles = []
let enemies = []
let particles = []
let ammoDrops = []
let animationId
let intervalId
let killCount = 0
let bulletsMax = 7
let bullets = bulletsMax
let ammoCount = 14
let reloading = false
let playerSpeed = 2.6 //2.6
//let moving = true

function resumeGame() {
	//gameOverDiv.style.display = 'none'
	gsap.to('#gameOverDiv', {
		opacity: 0,
		scale: .8,
		duration: 0.5,
		ease: 'expo.in',
		onComplete: () => {
			gameOverDiv.style.display = 'none'
		}
	})
	animationId
	enemies = []
	gameOver = false
	
}

function init() {
	fillEnemyPool()
	if(mobileDevice) {
		aimAssist = new AimLine(
			{
				x: null,
				y: null
			},
			'rgba(255,0,0,0)'
		)
		enemySpawnRate = 2500
	}


	xCenter = canvas.width/2
    yCenter = canvas.height/2
	player = new Player(xCenter, yCenter, 15, 'yellow')
	map = new Maps({
		position: {
			x: xCenter + offset.x,
			y: yCenter - offset.y
		},
		image: background
	})
	
	makeCollisionMap()
	getNpcs()
	gameOver = false
	projectiles = []
	enemies = []
	particles = []
	ammoDrops = []
	animationId
	killCount = 0
	ammoCount = 314
	bullets = bulletsMax
	score.innerHTML = killCount
	ammo.innerHTML = ammoCount
	playerDialogue.innerHTML = 'What happened!? Where is Pinky!?'
	//gameOverDiv.style.display = 'none'
	gsap.to('#gameOverDiv', {
		opacity: 0,
		scale: .8,
		duration: 0.5,
		ease: 'expo.in',
		onComplete: () => {
			gameOverDiv.style.display = 'none'
		}
	})
	//startGame.style.display = 'none'
	gsap.to('#startGame', {
		opacity: 0,
		scale: .8,
		duration: 0.5,
		ease: 'expo.in',
		onComplete: () => {
			startGame.style.display = 'none'
		}
	})
	currentObjective.innerHTML = ''
	setTimeout(() => {
		playerDialogue.style.display = 'flex'
		audio.talkingPlayer.play()
		newObjectve	 = 'Locate Pinky'
	}, 3000)
	setTimeout(() => {
		playerDialogue.style.display = 'none'
		audio.talkingPlayer.stop()
		currentObjective.style.display = 'flex'
		changeObjective(newObjectve)
	}, 6000)
	//test greannae
	//greeanne.counter = 3
}
let newObjectve
function changeObjective(newObjectve) {
	audio.newObjective.play()
	currentObjective.innerHTML = newObjectve	
	gsap.to('#currentObjective', {
		opacity: 0,
		scale: .8,
		duration: 0.3,
		ease: 'expo.in',
		yoyo: true,
		repeat: 3
	})
}

let x
let y 
let radius
let color
function fillEnemyPool() {
	radius = 10
	x = -10
	y = -10
	color = 'green'
	const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x)
	const velocity = {
		x: Math.cos(angle) *2,
		y: Math.sin(angle) *2
	}
	enemiesPool = []
	for(let i = 0; i <= 225; i++) {
		enemiesPool.push(new Enemy(x, y, radius, color, velocity))
	}
	//console.log('enemies pool : '+enemiesPool.length)
}
let particle
let enemySpawnRate = 500
let enemy
function spawnEnemies() {
	intervalId = setInterval(() => {
		//console.log(intervalId)
		if(gameOver) return
		if(enemies.length > 225) {
			//create particle explosions when enemy[0] is removed from screen
				for (let i = 0; i < 8; i++) {

				particle = particlesPool.pop()
				if(particle != undefined) {
					particle.position.x = enemies[index].position.x
					particle.position.y = enemies[index].position.y
					particle.radius = Math.random() * 3
					particle.color = 'red'
					particle.alpha = 1
					particle.velocity = {
							x: (Math.random() - 0.5) * 2, 
							y: (Math.random() - 0.5) * 2
						}
					particles.push(particle)
				} else {
					particles.push(new Particle(
						enemies[index].position.x, 
						enemies[index].position.y, 
						Math.random() * 3, 
						'red', 
						{
							x: (Math.random() - 0.5) * 2, 
							y: (Math.random() - 0.5) * 2
						}
					))
				}



				}
			//push enemy into enemiesPool
			enemiesPool.push(enemies.splice(0, 1)[0])
			//console.log('enemies pool : '+enemiesPool.length)
		} 

		radius = 10
		//logic that makes enemies spawn randomly all around screen
 		if (Math.random() < .5) {
			 x = Math.random() < .5 ? 0 - radius * 2 : canvas.width + radius * 2
			 y = Math.random() * canvas.height
		} else {
			 x = Math.random() * canvas.width
			 y = Math.random() < .5 ? 0 - radius * 2 : canvas.height + radius * 2
		}

		color = 'green'
		const angle = Math.atan2(canvas.height/2 - y, canvas.width/2 - x)
		const velocity = {
			x: Math.cos(angle) *2,
			y: Math.sin(angle) *2
		}

		enemy = enemiesPool.pop()
		if(enemy != undefined) {
			enemy.position.x = x
			enemy.position.y = y
			enemy.radius = radius
			enemy.color = color
			enemy.velocity = velocity
			enemies.push(enemy)
			//console.log('enemies: '+enemies.length)
			//console.log('enemiesPool: '+enemiesPool.length)

		} else {
			enemies.push(new Enemy(x, y, radius, color, velocity))
			//console.log('enemies: '+enemies.length)
			//console.log('enemiesPool: '+enemiesPool.length)
		}
		
		//console.log(enemies)
	}, enemySpawnRate )
}

let currentCollisions = collisions
function makeCollisionMap() {
	//parse data from referenced collisions layer
	let collisionsMap = []

	boundaries = []

		for (let i = 0; i < currentCollisions.length; i+= 100) {
		collisionsMap.push(currentCollisions.slice(i, 100 + i))
	}


	//set location of collisions tiles correctly
	collisionsMap.forEach((row, i) => {
		row.forEach((symbol, j) => {
			if (symbol == 1) { //wall
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + xCenter + offset.x ,
							y: i * Boundary.height + yCenter - offset.y
						},
						id: 'collisionWall'
					})
					)
			}	
			else if (symbol == 5) { //door
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + xCenter + offset.x ,
							y: i * Boundary.height + yCenter - offset.y
						},
						id: 'collisionDoor',
						isOpen: false,
						direction: 'left',
						directionCheckX: 45

					})
					)
			}
			else if (symbol == 6) { //door
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + xCenter + offset.x ,
							y: i * Boundary.height + yCenter - offset.y
						},
						id: 'collisionDoor',
						isOpen: false,
						direction: 'right',
						directionCheckX: -45
					})
					)
			} else if (symbol == 7) { //door
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + xCenter + offset.x ,
							y: i * Boundary.height + yCenter - offset.y
						},
						id: 'collisionDoor',
						isOpen: false,
						direction: 'up',
						directionCheckY: 45
					})
					)
			} else if (symbol == 8) { //door
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + xCenter + offset.x ,
							y: i * Boundary.height + yCenter - offset.y
						},
						id: 'collisionDoor',
						isOpen: false,
						direction: 'down',
						directionCheckY: -45
					})
					)
			} else if (symbol == 25) { //lock
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + xCenter + offset.x ,
							y: i * Boundary.height + yCenter - offset.y
						},
						id: 'lock',
						isOpen: true,
						building: 1,
						unlocked: false
						
					})
					)
			} else if (symbol == 26) { //lock
				boundaries.push(
					new Boundary({
						position: {
							x: j * Boundary.width + xCenter + offset.x ,
							y: i * Boundary.height + yCenter - offset.y
						},
						id: 'lock',
						isOpen: true,
						building: 2,
						unlocked: false
						
					})
					)
			}
		})
	})
}
makeCollisionMap()

function rectangularCollision({rectangle1, rectangle2}) {
	//if(rectangle2.id == 'npc') return false
	  return(
		rectangle1.position.x + rectangle1.radius >= rectangle2.position.x &&
		rectangle1.position.x - rectangle1.radius <= rectangle2.position.x + rectangle2.width &&
		rectangle1.position.y + rectangle1.radius >= rectangle2.position.y && 
		rectangle1.position.y - rectangle1.radius <= rectangle2.position.y + rectangle2.height
		)
}

function monitorCollisions (entity, boundaryX, boundaryY) {
		
		//monitor for boundary collisions
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (boundary.id == 'npc' && entity != player) return //npc can shoot through itself
			if(boundary.id == 'lock' && boundary.isOpen == true) continue
			if (rectangularCollision({
					rectangle1: entity,
					rectangle2: {
						...boundary, 
						position: {
							x: boundary.position.x + boundaryX ,
							y: boundary.position.y + boundaryY
						},
						id: boundary.id
					}
				}) 
				) {
				//console.log('colliding')
			entity.moving = false
			
			break
		}
	}
}





let camRight = false
let camLeft = false
let camUp = false
let camDown = false
function checkCameraMovement() {

	if(mobileDevice) {
		if ( (keys.d.pressed) && player.position.x + 4 >= canvas.width*.6) {
		camRight = true
		}
		else if ( (keys.a.pressed) && player.position.x - 4 <= canvas.width*.4) {
			camLeft = true
		}
		if ( (keys.s.pressed) && player.position.y + 4 >= canvas.height*.6) {
			camDown = true
		}
		else if ( (keys.w.pressed) && player.position.y - 4 <= canvas.height*.4) {
			camUp = true
		}
		return
	}

	if ( (keys.d.pressed) && player.position.x + 4 >= canvas.width*.8) {
		camRight = true
	}
	else if ( (keys.a.pressed) && player.position.x - 4 <= canvas.width*.2) {
		camLeft = true
	}
	if ( (keys.s.pressed) && player.position.y + 4 >= canvas.height*.8) {
		camDown = true
	}
	else if ( (keys.w.pressed) && player.position.y - 4 <= canvas.height*.2) {
		camUp = true
	}
}
function cameraMovement() {

	if(mobileDevice) {
		if ( (keys.d.pressed) && player.position.x + 4 >= canvas.width*.6) {
		camRight = true
		
		movables.forEach((movable) => {
			movable.position.x -=playerSpeed
		})

		}
		else if ( (keys.a.pressed) && player.position.x - 4 <= canvas.width*.4) {
			camLeft = true
			
			movables.forEach((movable) => {
				movable.position.x +=playerSpeed
			})
			
		}
		if ( (keys.s.pressed) && player.position.y + 4 >= canvas.height*.6) {
			camDown = true
			
			movables.forEach((movable) => {
				movable.position.y -=playerSpeed
			})
			
		}
		else if ( (keys.w.pressed) && player.position.y - 4 <= canvas.height*.4) {
			camUp = true
			
			movables.forEach((movable) => {
				movable.position.y +=playerSpeed
			})

		}
	}

	if ( (keys.d.pressed) && player.position.x + 4 >= canvas.width*.8) {
		camRight = true
		
		movables.forEach((movable) => {
			movable.position.x -=playerSpeed
		})

	}
	else if ( (keys.a.pressed) && player.position.x - 4 <= canvas.width*.2) {
		camLeft = true
		
		movables.forEach((movable) => {
			movable.position.x +=playerSpeed
		})
		
	}
	if ( (keys.s.pressed) && player.position.y + 4 >= canvas.height*.8) {
		camDown = true
		
		movables.forEach((movable) => {
			movable.position.y -=playerSpeed
		})
		
	}
	else if ( (keys.w.pressed) && player.position.y - 4 <= canvas.height*.2) {
		camUp = true
		
		movables.forEach((movable) => {
			movable.position.y +=playerSpeed
		})

	}
}

let checkMapX = map.position.x
let checkMapY = map.position.y

//set as player as placeholder to avoid error
let npcTalking = player
let movables

let ammoDrop	
function animate() {
	//setTimeout(function() {


	animationId = requestAnimationFrame(animate)
	//console.log these to place characters on map???
	//console.log((player.position.x - xCenter) - (map.position.x - checkMapX))
	//console.log((player.position.y - yCenter) - (map.position.y - checkMapY))
	//console.log(enemies)

	//change to 'flex' to display current object pool and live array
	devTool('none')
	movables = [
		map,
		...enemies,
		...boundaries,
		...ammoDrops,
		...projectiles,
		...npcs,
		...particles
	]

	camRight = false
	camLeft = false
	camUp = false
	camDown = false
	player.moving = true
	//console.log(player.moving)
	c.clearRect(0,0, canvas.width, canvas.height)
	c.fillStyle = 'rgba(0, 0, 0, 1)'
	c.fillRect(0,0, canvas.width, canvas.height)

	map.draw()			
	
	boundaries.forEach(boundary => {
		boundary.draw()
		boundary.open()
	})


	
	if(mobileDevice == true) {
		leftJoystick.draw()
		rightJoystick.draw()
		interactButton.draw()
	}

	//loop projectiles and updates projectile location and draws
	for (let index = projectiles.length - 1; index >= 0; index--) {
		const projectile = projectiles[index]
		projectile.update()
		//check if projectile is off screen, remove current projectile if so
		if(
			projectile.position.x + projectile.radius < -200 || 
			projectile.position.x - projectile.radius > canvas.width + 200 ||
			projectile.position.y + projectile.radius < -200 ||
			projectile.position.y - projectile.radius > canvas.height + 200 ) {
					projectilesPool.push(projectiles.splice(index, 1)[index])
		}
	}

	for (let index = enemies.length - 1; index >= 0; index--) {
		const enemy = enemies[index]
		//enemy.update()
		//check if enemy is off screen, remove current enemy if so
		if(
			enemy.position.x + 200 < 0 || 
			enemy.position.x - 200 > canvas.width ||
			enemy.position.y + 200 < 0 ||
			enemy.position.y - 200 > canvas.height ) {
				//push enemy into enemiesPool
				enemiesPool.push(enemies.splice(index, 1)[0])
				//console.log('enemies pool : '+enemiesPool.length)
		}
	}
	
	npcs.forEach(npc => {
		npc.update()
	})
	npcs.forEach(npc => {
		npc.defend()
	})
	aimAssist.draw()
	player.update()

	//check for dialogue, npcs.js,
	checkDialogue()
	
	//every frame set position of dialogue box above player and npcTalking
	pdDiv.style.left = player.position.x -100
	pdDiv.style.top = player.position.y -225
	npcDiv.style.left = npcTalking.position.x -100
	npcDiv.style.top = npcTalking.position.y -225

	for (let index = particles.length - 1; index >= 0; index--) {
		const particle = particles[index]
		if (particle.alpha <= 0) {
			particlesPool.push(particles.splice(index, 1)[0])
		} else {
		particle.update()
		}
	}

	for (let index = ammoDrops.length - 1; index >= 0; index--) {
		const ammoDrop = ammoDrops[index]

		const dist = Math.hypot(player.position.x - ammoDrop.position.x, player.position.y - ammoDrop.position.y)
		if(dist - ammoDrop.radius - player.radius  < 1) {
			ammoDrop.radius	= 10
			audio.ammoPickup.play()
			if(mobileDevice) ammoCount += 4
			else ammoCount += 2
			ammo.innerHTML = ammoCount
			ammoDropsPool.push(ammoDrops.splice(index, 1)[0])
			}
		}

	ammoDrops.forEach((ammoDrop) => {
		ammoDrop.draw()
	})
	
	
	//loops through enemies, removes enemies off screen
	for (let index = enemies.length - 1; index >= 0; index--) {
		const enemy = enemies[index]

		const dist = Math.hypot(player.position.x - enemy.position.x, player.position.y - enemy.position.y)
		if(dist - enemy.radius - player.radius  < 1) {
			gameOver = true
			clearInterval(intervalId)
			kills.innerHTML = killCount
			gameOverDiv.style.display = 'block'
			gsap.fromTo('#gameOverDiv', {scale: 0.8, opacity: 0}, {
				opacity: 1,
				scale: 1,
				duration: 0.7,
				ease: 'expo',
			})
				cancelAnimationFrame(animationId)	
			}
		enemy.update()
		//loop through projectiles, check distance between projectile and enemy
		for (let projectilesIndex = projectiles.length - 1; projectilesIndex >= 0; projectilesIndex--) {
			const projectile = projectiles[projectilesIndex]
			const dist = Math.hypot(projectile.position.x - enemy.position.x, projectile.position.y - enemy.position.y)

			
			monitorCollisions(projectile, 0,0)
			if (!projectile.moving) {
				for (let i = 0; i < 8; i++) {
					particle = particlesPool.pop()
					if(particle != undefined) {
						particle.position.x = projectile.position.x
						particle.position.y = projectile.position.y
						particle.radius = Math.random() * 3
						particle.color = 'white'
						particle.alpha = 1
						particle.velocity = {
								x: (Math.random() - 0.5) * 2, 
								y: (Math.random() - 0.5) * 2
							}
						particles.push(particle)
					} else {
						particles.push(new Particle(
							projectile.position.x, 
							projectile.position.y, 
							Math.random() * 3, 
							'white', 
							{
								x: (Math.random() - 0.5) * 2, 
								y: (Math.random() - 0.5) * 2
							}
						))
					}
				}
				projectilesPool.push(projectiles.splice(projectilesIndex, 1)[projectilesIndex])
			}
			//if dist is less than one, or practically 0, remove both the current enemy and projectile
			if(dist - enemy.radius - projectile.radius  < 1) {
				killCount++
				audio.hit.play()
				score.innerHTML = killCount
				//create particle explosions
				for (let i = 0; i < 8; i++) {
					particle = particlesPool.pop()
					if(particle != undefined) {
						particle.position.x = enemies[index].position.x
						particle.position.y = enemies[index].position.y
						particle.radius = Math.random() * 3
						particle.color = 'red'
						particle.alpha = 1
						particle.velocity = {
								x: (Math.random() - 0.5) * 2, 
								y: (Math.random() - 0.5) * 2
							}
						particles.push(particle)
					} else {
						particles.push(new Particle(
							enemies[index].position.x, 
							enemies[index].position.y, 
							Math.random() * 3, 
							'red', 
							{
								x: (Math.random() - 0.5) * 2, 
								y: (Math.random() - 0.5) * 2
							}
						))
					}
				}
				
				//push enemy into enemiesPool
				enemiesPool.push(enemies.splice(index, 1)[0])
				//console.log('enemies pool : '+enemiesPool.length)
				

				projectilesPool.push(projectiles.splice(projectilesIndex, 1)[projectilesIndex])

				if(projectile.origin == 'player' || ammoCount < 4) {

					ammoDrop = ammoDropsPool.pop()
					if(ammoDrop != undefined) {
						ammoDrop.position.x = enemy.position.x
						ammoDrop.position.y = enemy.position.y
						ammoDrop.radius = 5
						ammoDrop.color = 'orange'
						ammoDrop.alpha = 1
						ammoDrop.velocity = {
								x: 0, 
								y: 0
							}
						ammoDrops.push(ammoDrop)
					} else {
						ammoDrops.push(new AmmoDrop(
							enemy.position.x,
							enemy.position.y,
							5,
							'orange',
							{
								x: 0,
								y: 0
							}
						))
					}
				}
			}
		}
	}

	

	
	if (keys.r.pressed && !reloading && bullets < bulletsMax && ammoCount > 0) {
		keys.r.pressed = false
		reloading = true
		audio.reload.play()
		setTimeout(() => {
			if(ammoCount >= bulletsMax) {
				bullets = bulletsMax
				reloading = false
			} else {
				bullets = ammoCount
				reloading = false
			}
		}, 1000)
	}

	if(keys.w.pressed) {
		
		if (keys.a.pressed) {
			monitorCollisions(player,4,0)
			checkCameraMovement()
			if(player.moving && !camLeft) {
				player.velocity.x = -playerSpeed
			} else (player.velocity.x = 0)
		}
		if (keys.d.pressed) {
			monitorCollisions(player,-4,0)
			checkCameraMovement()
			if(player.moving && !camRight) {
				player.velocity.x =  playerSpeed
			} else (player.velocity.x = 0)
		} 	

		monitorCollisions(player,0,4)
		if (player.moving) cameraMovement()
		if(player.moving && !camUp) {
			player.velocity.y = -playerSpeed
		} else (player.velocity.y = 0)
		
	}
	else if (keys.s.pressed) {
		
		if (keys.a.pressed) {
			monitorCollisions(player,4,0)
			checkCameraMovement()
			if(player.moving && !camLeft) {
				player.velocity.x = -playerSpeed
			} else (player.velocity.x = 0)
		}
		if (keys.d.pressed) {
			monitorCollisions(player,-4,0)
			checkCameraMovement()
			if(player.moving && !camRight) {
				player.velocity.x =  playerSpeed
			} else (player.velocity.x = 0)
		} 

		monitorCollisions(player,0,-4)
		if (player.moving) cameraMovement()
		if(player.moving && !camDown) {
			player.velocity.y = playerSpeed
		} else (player.velocity.y = 0)
		
	}
	else if (keys.a.pressed) {
		
		if (keys.w.pressed) {
			monitorCollisions(player,0,4)
			checkCameraMovement()
			if(player.moving && !camUp) {
				player.velocity.y = -playerSpeed
			} else (player.velocity.y = 0)
		}
		if (keys.s.pressed) {
			monitorCollisions(player,0,-4)
			checkCameraMovement()
			if(player.moving && !camDown) {
				player.velocity.y = -playerSpeed
			} else (player.velocity.y = 0)
		}

		monitorCollisions(player,4,0)
		if (player.moving) cameraMovement()
		if(player.moving && !camLeft) {
			player.velocity.x = -playerSpeed
		} else (player.velocity.x = 0)
	} 
	else if (keys.d.pressed) {
		
		if (keys.w.pressed) {
			monitorCollisions(player,0,4)
			checkCameraMovement()
			if(player.moving && !camUp) {
				player.velocity.y = -playerSpeed
			} else (player.velocity.y = 0)
		}
		if (keys.s.pressed) {
			monitorCollisions(player,0,-4)
			checkCameraMovement()
			if(player.moving && !camDown) {
				player.velocity.y = -playerSpeed
			} else (player.velocity.y = 0)
		}

		monitorCollisions(player,-4,0)
		if (player.moving) cameraMovement()
		if(player.moving && !camRight) {
			player.velocity.x =  playerSpeed
		} else (player.velocity.x = 0)
	} 

//	}, 1000 / 80)	
}

let projectile
window.addEventListener('click', (event) => {
	if(mobileDevice) return
	if (gameOver) return
	//ange is set equal to angle of right triangle using click
	const angle = Math.atan2(event.clientY - player.position.y, event.clientX - player.position.x)
	const velocity = {
		x: Math.cos(angle) *25,
		y: Math.sin(angle) *25
	}
	//console.log(angle)
	if (bullets > 0 && ammoCount > 0 && !reloading) {
		bullets--
		ammoCount--
		audio.shoot.play()
		ammo.innerHTML = ammoCount

		projectile = projectilesPool.pop()
		if(projectile != undefined) {
			projectile.position.x = player.position.x
			projectile.position.y = player.position.y
			projectile.radius = 5
			projectile.color = 'orange'
			projectile.velocity = velocity
			projectile.origin = 'player'
			projectile.moving = true
			projectiles.push(projectile)
			//console.log('enemies: '+enemies.length)
			//console.log('enemiesPool: '+enemiesPool.length)

		} else {
			projectiles.push(new Projectile(
			player.position.x,
			player.position.y, 
			5, 
			'orange', 
			velocity,
			'player'
			))
		}

		
	}
	else if (bullets == 0 && !reloading) audio.empty.play()
})



continueButton.addEventListener('click', () => {
	setTimeout(resumeGame, 200)
	setTimeout(spawnEnemies, 200)
	setTimeout(animate, 200)
})

restartButton.addEventListener('click', () => {
	setTimeout(init, 200)
	setTimeout(spawnEnemies, 200)
	setTimeout(animate, 200)
	
})

startButton.addEventListener('click', () => {
	setTimeout(init, 200)
	setTimeout(spawnEnemies, 200)
	setTimeout(animate, 200)
})



// window.addEventListener('keydown', (event) => {

// 	switch (event.key) {
// 		case 'w':
// 			player.velocity.y = -3
// 			break
// 		case 's':
// 			player.velocity.y = 3
// 			break
// 		case 'a':
// 			player.velocity.x = -3
// 			break
// 		case 'd':
// 			player.velocity.x = 3
// 			break
// 	}
// })

/////////////////////
const keys = {
	i: {
		pressed: false,
		lifted: true
	},
	space: {
		pressed: false
	},
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	},
	m: {
		pressed: false
	},
	e: {
		pressed: false,
		lifted: true
	},
	r: {
		pressed: false,
		//lifted: true
	}
}



//Event Listeners for movement, battle, inventory?
let stopInteract = false
let lastKey = ' '
window.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'i':
		keys.i.pressed = true
		break
		case ' ':
		keys.space.pressed = true
		break
		case 'w':
		if(stopInteract	== false)keys.w.pressed = true, currentKeyPressed = "w"
		lastKey = 'w'
		break
		case 'a':
		if(stopInteract	== false)keys.a.pressed = true, currentKeyPressed = "a"
		lastKey = 'a'
		break
		case 's':
		if(stopInteract	== false)keys.s.pressed = true, currentKeyPressed = "s"
		lastKey = 's'
		break
		case 'd':
		if(stopInteract	== false)keys.d.pressed = true, currentKeyPressed = "d"
		lastKey = 'd'
		break
		case 'm':
		keys.m.pressed = true
		lastKey = 'm'
		break
		case 'e':
		if(stopInteract	== false) keys.e.pressed = true
		lastKey = 'e'
		break
		case 'r':
		keys.r.pressed = true
		//keys.r.lifted = false
		lastKey = 'r'
		break
	}
	
})

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'i':
		keys.i.pressed = false
		keys.i.lifted = true
		break
		case ' ':
		
		break
		case 'w':
		keys.w.pressed = false
		currentKeyPressed = ""
		break
		case 'a':
		keys.a.pressed = false
		currentKeyPressed = ""
		break
		case 's':
		keys.s.pressed = false
		currentKeyPressed = ""
		break
		case 'd':
		keys.d.pressed = false
		currentKeyPressed = ""
		break
		case 'm':
		keys.m.pressed = false
		lastKey = 'm'
		break
		case 'e':
		keys.e.pressed = false
		keys.e.lifted = true
		lastKey = 'e'
		break
		case 'r':
		keys.r.pressed = false
		keys.r.lifted = true
		lastKey = 'r'
		break
	}

})

window.addEventListener('resize', () => {
	canvas.width = innerWidth
	canvas.height = innerHeight
	init()
})





/////mobile controls\\\\\
let initialTouchLeft
let initialTouchRight

window.addEventListener("touchstart", e => {
	//console.log("Start")
	//e.preventDefault()
	[...e.changedTouches].forEach(touch => {
		const dot = document.createElement('div')
		dot.classList.add("dot")
		dot.style.top = Math.round(`${touch.pageY}`, 0)
		dot.style.left = Math.round(`${touch.pageX}`, 0)
		dot.id = touch.identifier
		document.body.append(dot)

		
		if(Math.round(`${touch.pageX}`, 0) <= canvas.width/2) {
			initialTouchLeft = {
				x: Math.round(`${touch.pageX}`, 0),
				y: Math.round(`${touch.pageY}`, 0)
			}
		}
		if(Math.round(`${touch.pageX}`, 0) > canvas.width/2) {
			initialTouchRight = {
				x: Math.round(`${touch.pageX}`, 0),
				y: Math.round(`${touch.pageY}`, 0)
			}
			if(Math.round(`${touch.pageX}`, 0) <= interactButton.position.x + interactButton.radius &&
				Math.round(`${touch.pageX}`, 0) >= interactButton.position.x - interactButton.radius &&
				Math.round(`${touch.pageY}`, 0) <= interactButton.position.y + interactButton.radius &&
				Math.round(`${touch.pageY}`, 0) >= interactButton.position.y - interactButton.radius) {
				console.log('interact')
			keys.e.pressed = true
			
			}
		}

		if(mobileDevice == false) mobileDevice = true
		//console.log(initialTouch)
	})
})

window.addEventListener("touchmove", e => {
	//console.log("Move")
	//e.preventDefault()
	[...e.changedTouches].forEach(touch => {
		const dot = document.getElementById(touch.identifier)
		dot.style.top = Math.round(`${touch.pageY}`, 0)
		dot.style.left = Math.round(`${touch.pageX}`, 0)
		let currentTouch = {
			x:Math.round(`${touch.pageX}`, 0),
			y:Math.round(`${touch.pageY}`, 0)
		} 

		//console.log('initial' + initialTouch.x)
		//console.log('current touch: ' + currentTouch.x)
		//console.log(canvas.width/2)

		//LEFT SIDE TOUCH JOYSTICK CONTROLS\\
		if(currentTouch.x <= canvas.width/2) {
			//console.log('leftside')
			//move up
			if(currentTouch.y < initialTouchLeft.y - 15) {
				keys.w.pressed = true
			}else keys.w.pressed = false
			//move down
			if(currentTouch.y > initialTouchLeft.y + 15) {
				keys.s.pressed = true
			} else keys.s.pressed = false
			//move left
			if(currentTouch.x < initialTouchLeft.x - 15) {
				keys.a.pressed = true
			} else keys.a.pressed = false
			//move right
			if(currentTouch.x > initialTouchLeft.x + 15) {
				keys.d.pressed = true
			} else keys.d.pressed = false

		}

		//RIGHT SIDE TOUCH JOYSTICK CONTROLS\\
		if(currentTouch.x >= canvas.width/2) {

			if(currentTouch.x > initialTouchRight.x + 1 || currentTouch.x < initialTouchRight.x - 1 ||
				currentTouch.y > initialTouchRight.y + 1 || currentTouch.y < initialTouchRight.y - 1) {
				const angle = Math.atan2(currentTouch.y - initialTouchRight.y, currentTouch.x - initialTouchRight.x)
				let position2X = player.position.x + (Math.cos(angle) * 700)
				let position2Y = player.position.y + (Math.sin(angle) * 700)
				aimAssist.color = 'rgba(255,0,0,1)'
				aimAssist.position2.x = position2X
				aimAssist.position2.y = position2Y

				if(currentTouch.x > initialTouchRight.x + 25 || currentTouch.x < initialTouchRight.x - 25 ||
					currentTouch.y > initialTouchRight.y + 25 || currentTouch.y < initialTouchRight.y - 25) {
					//console.log('rightside')
					if (gameOver) return
					//ange is set equal to angle of right triangle using click
					
					const angle = Math.atan2(currentTouch.y - initialTouchRight.y, currentTouch.x - initialTouchRight.x)
					const velocity = {
						x: Math.cos(angle) *25,
						y: Math.sin(angle) *25
					}
					//console.log(angle)
					if (bullets > 0 && ammoCount > 0 && !reloading && player.canShoot) {
						player.canShoot = false
						bullets--
						ammoCount--
						audio.shoot.play()
						ammo.innerHTML = ammoCount


						projectile = projectilesPool.pop()
						if(projectile != undefined) {
							projectile.position.x = player.position.x
							projectile.position.y = player.position.y
							projectile.radius = 5
							projectile.color = 'orange'
							projectile.velocity = velocity
							projectile.origin = 'player'
							projectile.moving = true
							projectiles.push(projectile)
							//console.log('enemies: '+enemies.length)
							//console.log('enemiesPool: '+enemiesPool.length)

						} else {
							projectiles.push(new Projectile(
							player.position.x,
							player.position.y, 
							5, 
							'orange', 
							velocity,
							'player'
							))
						}


						setTimeout(() => {
							player.canShoot = true
						}, 400)
					}
					else if (bullets == 0 && !reloading) {
						//audio.empty.play()
						keys.r.pressed = true
					}
				}
			}
		}

	})	
	
})

window.addEventListener("touchend", e => {
	//console.log("End")
	[...e.changedTouches].forEach(touch => {
		const dot = document.getElementById(touch.identifier)
		dot.remove()
		let currentTouch = {
			x:Math.round(`${touch.pageX}`, 0),
			y:Math.round(`${touch.pageY}`, 0)
		} 
		if(currentTouch.x <= canvas.width/2) {
			keys.w.pressed = false
			keys.s.pressed = false
			keys.a.pressed = false
			keys.d.pressed = false
		}
		else if(currentTouch.x >= canvas.width/2) {
			joystickRight = false
			keys.e.pressed = false
			keys.e.lifted = true
			initialTouchRight = {
				x: null,
				y: null
			}
			aimAssist.position2.x = player.position.x
			aimAssist.position2.y = player.position.y
			aimAssist.color = 'rgba(255,0,0,0)'
		} 
	})	
})





