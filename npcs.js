let npcTemp
class NPC {
	constructor(x, y, radius, color, name, hasGun, hasHat = false, hatColor) {
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
		this.hasGun = hasGun
		this.canShoot = true
		this.counter = 0
		this.hasHat = hasHat
		this.hatColor = hatColor
		this.isFollowing = false
		this.name = name
		this.beingPlaced = false
		this.badSpot = false
	}
	draw() {
		c.beginPath()
		//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
		if(this.hasHat) {
			c.beginPath()
			//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
			c.arc(this.position.x, this.position.y, this.radius/1.5, 0, Math.PI * 2, false)
			c.fillStyle = this.hatColor
			c.fill()
		}
		if(this.beingPlaced) {
			c.beginPath()
			//create player circle with c.arc(x,y,radius,start point, end point, clockwise/counter)
			c.arc(clientX, clientY, this.radius, 0, Math.PI * 2, false)
			c.fillStyle = 'rgba(47,79,79,1)'
			var dx = clientX - player.position.x,
			dy = clientY - player.position.y,
			dist = Math.sqrt(dx * dx + dy * dy);

			if(dist > player.radius*4 || dist < player.radius*2.2) {
					c.fillStyle = 'rgba(255,0,0,.6)'
					this.badSpot = true
				} else this.badSpot = false
			boundaries.forEach(boundary => {
				if(clientX + this.radius > boundary.position.x && clientX - this.radius < boundary.position.x + boundary.width && 
					clientY + this.radius > boundary.position.y && clientY - this.radius < boundary.position.y + boundary.height &&
					boundary.isOpen == false) {
					c.fillStyle = 'rgba(255,0,0,.6)'
					this.badSpot = true
				} 
			})
			
				
			c.fill()
			
		}

	}

	update() {
		this.draw()

		const friction = 0.7
		this.velocity.x *= friction
		this.velocity.y *= friction



		
		//if NPC is following do this
		if(this.isFollowing) {
			console.log('following')
			if(
			player.position.x - this.position.x < 45 && 
			player.position.x - this.position.x > -45 &&
			player.position.y - this.position.y < 45 && 
			player.position.y - this.position.y > -45 ) {
				this.moving = false
			} else this.moving = true

			const angle = Math.atan2(player.position.y - this.position.y, player.position.x - this.position.x)
			//monitorCollisions(this, 0,0)
			if (this.moving) {
				this.velocity.x = Math.cos(angle) * playerSpeed
				this.velocity.y = Math.sin(angle) * playerSpeed
				this.position.x = this.position.x + this.velocity.x 
				this.position.y = this.position.y + this.velocity.y

				boundaries.forEach(boundary => {
					if(boundary.name == this.name) {
						boundary.position.x = this.position.x - this.radius
						boundary.position.y = this.position.y - this.radius
					}
				})
			} 
			if(this.name == 'greely' && player.placingNpc || this.name == "greeny" && player.placingNpc) {
				console.log('greely or greeny following')
				console.log(this)
				boundaries.forEach(boundary => {
					if(boundary.building == 1) {
						console.log('building 1')
						boundary.visible = true
					}
				})
			}
		} 
		else {
			boundaries.forEach(boundary => {
					if(boundary.building == 1 && !player.placingNpc) {
						boundary.visible = false
					}
				})
		}

	}
	defend() {
		enemies.forEach(enemy => {
			if (this.position.x - enemy.position.x < 80 && 
				this.position.x - enemy.position.x > -80 &&
				this.position.y - enemy.position.y < 80 && 
				this.position.y - enemy.position.y > -80 && this.canShoot == true) 
					{
						let currentEnemy = enemy
						console.log(currentEnemy)
						this.canShoot = false
						console.log(enemy.position.y)
						const angle = Math.atan2(currentEnemy.position.y - this.position.y, currentEnemy.position.x - this.position.x)
						const velocity = {
							x: Math.cos(angle) *25,
							y: Math.sin(angle) *25
						}
						console.log(angle)
						console.log(velocity)
							audio.shoot.play()
							projectile = projectilesPool.pop()
							if(projectile != undefined) {
								projectile.position.x = this.position.x
								projectile.position.y = this.position.y
								projectile.radius = 5
								projectile.color = 'orange'
								projectile.velocity = velocity
								projectile.origin = 'npc'
								projectile.moving = true
								projectiles.push(projectile)
								//console.log('enemies: '+enemies.length)
								//console.log('enemiesPool: '+enemiesPool.length)

							} else {
								projectiles.push(new Projectile(
									this.position.x ,
									this.position.y, 
									5, 
									'orange', 
									velocity,
									'npc'
									))
							}													
							
							console.log(...projectiles)
						setTimeout(() => {
							this.canShoot = true
						}, 400)
				}
			
		})
	}
}
let npcs = []
let pinky, greeanne, greeny, greely


function getNpcs() {

	//pinky = new NPC(xCenter - 280, yCenter + 1040, 15, 'pink', true)
	pinky = new NPC(xCenter - 280, yCenter + 1040, 15, 'pink', 'pinky', true)
	greeanne = new NPC(xCenter + 848, yCenter + 419, 15, 'lime', 'greeanne', true)
	greeny = new NPC(xCenter + 3544, yCenter + 433, 13, 'lime', 'greeny', true, true, 'black')
	//3544,433
	greely = new NPC(xCenter + 3614, yCenter + 433, 13, 'lime', 'greely', true, true, 'brown')
	//3614,433 test 111, 111
	npcs = [pinky, greeanne, greeny, greely]
	npcs.forEach(npc => {
		boundaries.push(
			new Boundary({
				position: {
					x: npc.position.x - npc.radius,
					y: npc.position.y - npc.radius
				},
				width: npc.radius*2,
				height: npc.radius*2,
				id: 'npc',
				name: npc.name
			})
			)

		})
}

function checkDialogue() {
	npcs.forEach(npc => {
		if(
			player.position.x - npc.position.x < 35 && 
			player.position.x - npc.position.x > -35 &&
			player.position.y - npc.position.y < 35 && 
			player.position.y - npc.position.y > -35 ) {
		
			if(keys.e.pressed == true && keys.e.lifted == true && !player.isTalking) {
				keys.e.lifted = false
				player.isTalking = true
				
				if(npc == pinky) {
					//set npcTalking variable to current npc selected for npcDiv movement purposes
					npcTalking = npc
					npcDialogue.style.color = 'pink'
					if(pinky.counter == 0) {
						playerDialogue.innerHTML = 'Pinky! Your\'re alive! Where is Bluey!?'
						playerDialogue.style.display = 'flex'
						audio.talkingPlayer.play()
						setTimeout(() => {
								playerDialogue.style.display = 'none'	
								audio.talkingPlayer.stop()			
						}, 3000)
						
						setTimeout(() => {
							npcDialogue.innerHTML = 'Oh, thank DOT you\'re here! I think Bluey is trapped with Greeanne in the building across the street!'
							npcDialogue.style.display = 'flex'
							audio.talkingHigh.play()
						}, 4000)

						setTimeout(() => {
							npcDialogue.style.display = 'none'
							audio.talkingHigh.stop()
						}, 8000)

						setTimeout(() => {
							playerDialogue.innerHTML = 'Don\'t worry Pinks, I\'ll find our boy!'
							playerDialogue.style.display = 'flex'
							audio.talkingPlayer.play()
							boundaries.forEach(boundary => {
								if(boundary.building == '1') boundary.unlocked = true
							})				
						}, 9000)

						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								pinky.counter = 1
								player.isTalking = false	
								newObjective = 'Search the building nearby for Bluey'	
								changeObjective(newObjective)		
						}, 12000)
					}
					//continue pinky here
					if(pinky.counter == 1) {
						playerDialogue.innerHTML = 'Don\'t worry Pinks, I\'ll find our boy!'
						playerDialogue.style.display = 'flex'
						audio.talkingPlayer.play()
						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								player.isTalking = false				
						}, 3000)
					}	
				}

				else if(npc == greeanne) {
					//set npcTalking variable to current npc selected for npcDiv movement purposes
					npcTalking = npc
					npcDialogue.style.color = 'lime'
					if(greeanne.counter == 0) {
						playerDialogue.innerHTML = 'Greeanne! I\'m glad to see you\'re ok!'
						playerDialogue.style.display = 'flex'
						audio.talkingPlayer.play()
						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()				
						}, 2000)
						
						setTimeout(() => {
							npcDialogue.innerHTML = 'This old gal? Of course I\'m ok! Besides, someone is gonna have to be here to arm the residents of DotVille. Might as well be me!'
							npcDialogue.style.display = 'flex'
							audio.talkingHigh.play()
						}, 3000)

						setTimeout(() => {
							npcDialogue.style.display = 'none'
							audio.talkingHigh.stop()
						}, 9000)

						setTimeout(() => {
							playerDialogue.innerHTML = 'Normally I\'d take a look at what you have, but I\'m looking for Bluey. Pinky said he was here with you, but I don\'t see him!?'
							playerDialogue.style.display = 'flex'
							audio.talkingPlayer.play()
							boundaries.forEach(boundary => {
								if(boundary.building == '1') boundary.unlocked = true
							})				
						}, 10000)

						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()				
						}, 16000)

						setTimeout(() => {
							npcDialogue.innerHTML = 'I sent my boys out to the storage armory to get some more guns and ammo. Bluey should be safe with them...'
							npcDialogue.style.display = 'flex'
							audio.talkingHigh.play()
						}, 17000)

						setTimeout(() => {
							npcDialogue.style.display = 'none'
							audio.talkingHigh.stop()
						}, 23000)

						setTimeout(() => {
							npcDialogue.innerHTML = 'Buuut that was about an hour ago. Maybe you should check on them. Bring my boys back with you so they can start protecting my shop.'
							npcDialogue.style.display = 'flex'
							audio.talkingHigh.play()
						}, 24000)

						setTimeout(() => {
							npcDialogue.style.display = 'none'
							audio.talkingHigh.stop()
						}, 30000)

						setTimeout(() => {
							npcDialogue.innerHTML = 'Once they get back here we can look at upgrading that little pea-shooter you call a DOTgun.'
							npcDialogue.style.display = 'flex'
							audio.talkingHigh.play()
						}, 31000)

						setTimeout(() => {
							npcDialogue.style.display = 'none'
							audio.talkingHigh.stop()
						}, 36000)

						setTimeout(() => {
							playerDialogue.innerHTML = 'That\'s the storage building to the East, right? Ok Greeanne, I\'ll be right back with them!'
							playerDialogue.style.display = 'flex'
							audio.talkingPlayer.play()
							boundaries.forEach(boundary => {
								if(boundary.building == '2') boundary.unlocked = true
							})				
						}, 37000)

						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()	
								greeanne.counter = 1
								player.isTalking = false	
								newObjective = 'Get Greeanne\'s boys at the storage building to the East'	
								changeObjective(newObjective)		
						}, 42000)
					}
					//continue greeanne here
					if(greeanne.counter == 1) {
						npcDialogue.innerHTML = 'What are you waiting for? Go get the kids!'
						npcDialogue.style.display = 'flex'
						audio.talkingHigh.play()
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()
								player.isTalking = false				
						}, 3000)
					}
					//continue greeanne here
					if(greeanne.counter == 2) {
						npcDialogue.innerHTML = 'Go post the kids up by the doors to protect my shop!'
						npcDialogue.style.display = 'flex'
						audio.talkingHigh.play()
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()
								player.isTalking = false				
						}, 3000)
					}	
					//continue greeanne here
					if(greeanne.counter == 3) {
						npcDialogue.innerHTML = 'Thanks for bringing them back! They told me Bluey got separated from them on the way there.'
						npcDialogue.style.display = 'flex'
						audio.talkingHigh.play()
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()
												
						}, 4000)

						setTimeout(() => {
								npcDialogue.innerHTML = 'Greeny mentioned it looked like Orangelica swooped in just in time to save him from a group of these things.'
								npcDialogue.style.display = 'flex'
								audio.talkingHigh.play()				
						}, 5000)
						
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()				
						}, 9000)

						setTimeout(() => {
								playerDialogue.innerHTML = 'Orangelica!? She lives on the complete opposite side of DotVille!'
								playerDialogue.style.display = 'flex'
								audio.talkingPlayer.play()
						}, 10000)

						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								player.isTalking = false		
						}, 13000)

						setTimeout(() => {
								npcDialogue.innerHTML = 'I know, and you will never make it that far with that wimpy little DOTgun.'
								npcDialogue.style.display = 'flex'
								audio.talkingHigh.play()				
						}, 14000)
						
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()				
						}, 18000)

						setTimeout(() => {
								npcDialogue.innerHTML = 'You\'d better upgrade that shooter before heading down there. Bring me 300 Dots off them things outside and I\'ll give you ol\' Betsy here.'
								npcDialogue.style.display = 'flex'
								audio.talkingHigh.play()				
						}, 19000)
						
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()				
						}, 25000)

						setTimeout(() => {
								npcDialogue.innerHTML = 'She holds 10 shots per mag, so you\'ll be able to put up a good fight out there!'
								npcDialogue.style.display = 'flex'
								audio.talkingHigh.play()				
						}, 26000)
						
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()				
						}, 32000)

						setTimeout(() => {
								playerDialogue.innerHTML = 'Ok Greeanne, I\'ll be right back with those Dots for you!'
								playerDialogue.style.display = 'flex'
								audio.talkingPlayer.play()
						}, 33000)

						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								greeanne.counter = 4
								player.isTalking = false
								newObjective = 'Bring Greeanne 300 Dots(AMMO) to purchase Ol\' Betsy'
								changeObjective(newObjective)		
						}, 36000)
					}

					if(greeanne.counter == 4) {
						npcDialogue.innerHTML = 'Hurry up and get me those Dots so you can go find Bluey!'
						npcDialogue.style.display = 'flex'
						audio.talkingHigh.play()
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()
								player.isTalking = false
						}, 4000)
					}	
					if(greeanne.counter == 4 && ammoCount >= 300) {
						npcDialogue.innerHTML = 'Ok, here is Ol\' Betsy. Like I said, she holds up to 10 Dots at a time!'
						npcDialogue.style.display = 'flex'
						audio.talkingHigh.play()
						
						setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingHigh.stop()
								player.isTalking = false
								ammoCount = ammoCount - 300
								bulletsMax = 10
								ammo.innerHTML = ammoCount
								audio.ammoPickup.play()
								greeanne.counter = 5
						}, 4000)
					}	
					//continue greeanne here
				}

				else if(npc == greeny) {
					//set npcTalking variable to current npc selected for npcDiv movement purposes
					if(greely.isFollowing) {
						playerDialogue.innerHTML = 'Greeny, you wait here. I should take you back one at a time to be safe. I\'ll be right back!'
						playerDialogue.style.display = 'flex'
						audio.talkingPlayer.play()
						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								player.isTalking = false		
						}, 4000)
						return
					}
					npcTalking = npc
					npcDialogue.style.color = 'lime'
					if(greeny.counter == 0) {
						playerDialogue.innerHTML = 'Let\'s head back to Greeanne\'s shop!'
						playerDialogue.style.display = 'flex'
						audio.talkingPlayer.play()
						greeny.isFollowing = true
						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								greeny.counter = 1
								player.isTalking = false	
								newObjective = 'Bring Greeny back to Greeanne\'s shop'	
								greeanne.counter = 2
								changeObjective(newObjective)		
						}, 3000)
					}
					//continue greeny here
					else if(greeny.counter == 1) {
						
						npcDialogue.innerHTML = 'Where should I wait?'
						placeNpc(greeny)
						npcDialogue.style.display = 'flex'
						audio.talkingMedium.play()
						setTimeout(() => {
							greeny.counter = 2
							npcDialogue.style.display = 'none'
							audio.talkingMedium.stop()
							player.isTalking = false	
							newObjective = 'Press "E" near Greeny to tell him where to wait'	
							changeObjective(newObjective)			
						}, 1500)
					}	
					//continue greeny here
					else if(greeny.counter == 2) {
						if(greeny.badSpot == true) {
							npcDialogue.innerHTML = 'I can\'t go there!'
							npcDialogue.style.display = 'flex'
							audio.talkingMedium.play()
							setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingMedium.stop()
								player.isTalking = false				
							}, 1500)
						} else if(greeny.badSpot == false) {
							npcDialogue.innerHTML = 'Ok, I\'ll wait here!'
							placeNpc(greeny)
							greeanne.counter = 1
							npcDialogue.style.display = 'flex'
							audio.talkingMedium.play()
							setTimeout(() => {
								boundaries.forEach(boundary => {
									if(greeny.position.x + greeny.radius > boundary.position.x && greeny.position.x - greeny.radius < boundary.position.x + boundary.width && 
										greeny.position.y + greeny.radius > boundary.position.y && greeny.position.y - greeny.radius < boundary.position.y + boundary.height &&
										boundary.building == 1) {
										greeny.counter = 3
									} 
								}) 
								if (greeny.counter == 3) console.log('3')
									else greeny.counter = 0
								if(greely.counter == 3 && greeny.counter == 3) {
									newObjective = 'Speak to Greeanne'	
									changeObjective(newObjective)
									greeanne.counter = 3
								} else {
									newObjective = 'Get Greeanne\'s boys at the storage building to the East'	
									changeObjective(newObjective)	
								}
								npcDialogue.style.display = 'none'
								audio.talkingMedium.stop()
								player.isTalking = false											
							}, 3000)
						}
					}	
					//continue Greeny here
					else if(greeny.counter == 3) {
							npcDialogue.innerHTML = 'Thank\'s for helping us get back! I hope you find Bluey!'
							npcDialogue.style.display = 'flex'
							audio.talkingMedium.play()
							setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingMedium.stop()
								player.isTalking = false				
							}, 3000)	
					}
				}

				else if(npc == greely) {
					//set npcTalking variable to current npc selected for npcDiv movement purposes
					if(greeny.isFollowing) {
						playerDialogue.innerHTML = 'Greely, you wait here. I should take you back one at a time to be safe. I\'ll be right back!'
						playerDialogue.style.display = 'flex'
						audio.talkingPlayer.play()
						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								player.isTalking = false		
						}, 4000)
						return
					}
					npcTalking = npc
					npcDialogue.style.color = 'lime'
					if(greely.counter == 0) {
						playerDialogue.innerHTML = 'Let\'s head back to Greeanne\'s shop!'
						playerDialogue.style.display = 'flex'
						audio.talkingPlayer.play()
						greely.isFollowing = true
						setTimeout(() => {
								playerDialogue.style.display = 'none'
								audio.talkingPlayer.stop()
								greely.counter = 1
								player.isTalking = false	
								newObjective = 'Bring Greely back to Greeanne\'s shop'
								greeanne.counter = 2	
								changeObjective(newObjective)		
						}, 3000)
					}
					//continue greely here
					else if(greely.counter == 1) {
						//greely.isFollowing = false
						npcDialogue.innerHTML = 'Where should I wait?'
						placeNpc(greely)
						npcDialogue.style.display = 'flex'
						audio.talkingMedium.play()
						setTimeout(() => {
							greely.counter = 2
							npcDialogue.style.display = 'none'
							audio.talkingMedium.stop()
							player.isTalking = false
							newObjective = 'Press "E" near Greely to tell him where to wait'	
							changeObjective(newObjective)				
						}, 1500)
					}	
					//continue greely here
					else if(greely.counter == 2) {
						if(greely.badSpot == true) {
							npcDialogue.innerHTML = 'I can\'t go there!'
							npcDialogue.style.display = 'flex'
							audio.talkingMedium.play()
							setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingMedium.stop()
								player.isTalking = false				
							}, 1500)
						} else if(greely.badSpot == false) {
							npcDialogue.innerHTML = 'Ok, I\'ll wait here!'
							placeNpc(greely)
							greeanne.counter = 1
							npcDialogue.style.display = 'flex'
							audio.talkingMedium.play()
							setTimeout(() => {
								boundaries.forEach(boundary => {
									if(greely.position.x + greely.radius > boundary.position.x && greely.position.x - greely.radius < boundary.position.x + boundary.width && 
										greely.position.y + greely.radius > boundary.position.y && greely.position.y - greely.radius < boundary.position.y + boundary.height &&
										boundary.building == 1) {
										greely.counter = 3
									} 
								}) 
								if (greely.counter == 3) console.log('3')
									else greely.counter = 0
								if(greely.counter == 3 && greeny.counter == 3) {
									newObjective = 'Speak to Greeanne'	
									changeObjective(newObjective)
									greeanne.counter = 3
								} else {
									newObjective = 'Get Greeanne\'s boys at the storage building to the East'	
									changeObjective(newObjective)	
								}
								npcDialogue.style.display = 'none'
								audio.talkingMedium.stop()
								player.isTalking = false											
							}, 3000)
						}
					}
					//continue greely here
					else if(greely.counter == 3) {
							npcDialogue.innerHTML = 'Thank\'s for helping us get back! I hope you find Bluey!'
							npcDialogue.style.display = 'flex'
							audio.talkingMedium.play()
							setTimeout(() => {
								npcDialogue.style.display = 'none'
								audio.talkingMedium.stop()
								player.isTalking = false				
							}, 3000)	
					}	
				}

				//else other npc here

			}
		}			
	})
}

function stopTalking() {
	player.isTalking = false
}

let npcPlaced = true
function placeNpc(npc) {
	//this allows for placement of npc after radius is visible. add detection for boundaries and within radius
	if(player.placingNpc == true) {

		npc.position.x = clientX
		npc.position.y = clientY
		boundaries.forEach(boundary => {
			if(boundary.name == npc.name) {
				boundary.position.x = npc.position.x - npc.radius
				boundary.position.y = npc.position.y - npc.radius
			}
		})
		setTimeout(() => {
			npc.isFollowing = false
		}, 20)
		npc.placed = true
		player.placingNpc = false
		npc.beingPlaced = false
		return		
	}
	npcPlaced = false
	//player.placingNpc will make player draw a 'placement area radius'
	if(npcPlaced == false && player.placingNpc == false) {
			player.placingNpc = true
			npc.beingPlaced = true
	}
}

let clientX 
let clientY 
function mousemove(event){
	clientX = event.clientX 
    clientY = event.clientY
    // console.log("pageX: ",event.pageX, 
    // "pageY: ", event.pageY, 
    // "clientX: ", event.clientX, 
    // "clientY:", event.clientY)
    
}

window.addEventListener('mousemove', mousemove);