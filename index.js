const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Basics{
    movement({up,left,down,right}) {
        let result = [0,0]
        if (up) {result[1]--}
        if (down) {result[1]++} 
        if (right) {result[0]++}
        if (left) {result[0]--}
        return result
    }
}

class Player{
    constructor({pos,velocity,rotation}) {
        this.pos= pos
        this.velocity = velocity
        this.rotation = rotation
    }
    getVertices() {
        const cos = Math.cos(this.rotation)
        const sin = Math.sin(this.rotation)
    
        return [
          {
            x: this.pos.x + cos * 30 - sin * 0,
            y: this.pos.y + sin * 30 + cos * 0,
          },
          {
            x: this.pos.x + cos * -10 - sin * 10,
            y: this.pos.y + sin * -10 + cos * 10,
          },
          {
            x: this.pos.x + cos * -10 - sin * -10,
            y: this.pos.y + sin * -10 + cos * -10,
          },
        ]
      }
    draw() {
        c.save()
        c.translate(this.pos.x,this.pos.y)
        c.rotate(this.rotation)
        c.translate(-this.pos.x,-this.pos.y)

        c.beginPath()
        c.arc(this.pos.x,this.pos.y, 5, 0 ,Math.PI * 2, false)
        c.fillStyle='purple'
        c.fill()
        c.closePath()
        // c.fillStyle = 'red'
        // c.fillRect(this.pos.x,this.pos.y,35,80)
        c.beginPath()
        c.moveTo(this.pos.x+30, this.pos.y)
        c.lineTo(this.pos.x-10, this.pos.y-10)
        c.lineTo(this.pos.x-10, this.pos.y+10)
        c.closePath()
        
        c.strokeStyle="white"
        c.stroke()
        c.restore()
    }

    update() {
        // const moveBy = this.movement({
        //     up:   keys.w.pressed,
        //     down: keys.s.pressed,
        //     right:keys.d.pressed,
        //     left: keys.a.pressed,})
        this.pos.x+=this.velocity.x
        this.pos.y+=this.velocity.y
        this.draw()
    }
}

class Projectile{
    constructor({pos,velocity}) {
        this.pos=pos
        this.velocity=velocity
        this.radius=5
    }
    draw(){
        c.beginPath()
        c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2,false)
        c.closePath()
        c.fillStyle="white"
        c.fill()
    }
    update(){
        this.pos.x += this.velocity.x
        this.pos.y += this.velocity.y
        this.draw()
    }
}

class Asteriods{
    constructor({pos,velocity,radius}) {
        this.pos=pos
        this.velocity=velocity
        this.radius=radius
        this.trueRadius=radius
    }
    draw(){
        c.beginPath()
        c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2,false)
        c.closePath()
        c.fillStyle="white"
        c.fill()
    }
    update(){
        this.pos.x += this.velocity.x
        this.pos.y += this.velocity.y
        if (this.radius>this.trueRadius) {
            if (this.radius<=SMALL_CIRCLE_NO_EXIST) {this.radius=0;this.trueRadius=0}
            else if(this.radius<=CIRCLE_NO_EXIST) {this.radius*=ASTERIOD_SMOOTHNESS_SMALL}
            else this.radius*=ASTERIOD_SMOOTHNESS
            if(this.radius<this.trueRadius) {this.radius=this.trueRadius}
        }
        this.draw()
    }
}


let alive=true

const diaScreenSize = Math.sqrt(screen.width*screen.width, screen.height*screen.height);
const bigScreenSize = Math.max(canvas.width,canvas.height)

const SPEED = 4
const ROTATION_SPEED = 0.0689
const FRICTION = 0.97
const FRICTION_S_KEY = 0.8
const CIRCLE_SHRINK_ON_HIT = 0.65
const SPEED_PROJ = 4
const SPEED_AST = 0.0021
const ASTERIOD_FREQUENCY = 780
const CIRCLE_NO_EXIST = 17
const SMALL_CIRCLE_NO_EXIST = 1
const ASTERIOD_SMOOTHNESS = 0.96125
const ASTERIOD_SMOOTHNESS_SMALL = 0.7
const SCORE_AMOUNT = 100


function reset() {
    if (!alive) {
        // displayGameOver(false)
        gameOver.style.animation="hideDivDown 1.5s";
        gameOver.style.animationFillMode = "forwards"
        alive = true
        score=0
        refreshScore()
        player = createPlayer()
        asteriods = []
        projectiles = []
        interval = asteriodCreate()
        window.requestAnimationFrame(animate)
    }
}

function createPlayer() {
    return new Player({
        pos: {x:canvas.width/2,y:canvas.height/2},
        velocity: {x:0,y:0},
        rotation: 0,
    })
}

let player = createPlayer()
let projectiles = []
let asteriods = []

function asteriodCreate() {
    return window.setInterval(() => {
        let x, y    
        let vx, vy
        let rsw = Math.floor(Math.random()*canvas.width)
        let rsh=Math.floor(Math.random()*canvas.height)
        let radius = Math.floor( 62 ** Math.random() + 10 )
        if (Math.random()*900<=1) {radius=112}
    
        const circle_rad = Math.PI*2*Math.random()
        const circle_radius = diaScreenSize/2 + radius
    
    
        x= (Math.cos(circle_rad)*circle_radius) //
        y= (Math.sin(-circle_rad)*circle_radius) //
        // vx = -(x)/speed_ast
        // vy = -(y)/speed_ast
        x+=(canvas.width/2)
        y+=(canvas.height/2)
        vx = ((x-rsw)*-1)*SPEED_AST
        vy = ((y-rsh)*-1)*SPEED_AST
    
    
        asteriods.push(new Asteriods({
            pos:{
                x:x,
                y:y,
            },
            velocity: {
                x: vx,
                y: vy,
            },
            radius:radius
        }))
    
    }, 780)
}

let interval = asteriodCreate()


function circleCollision(circle1, circle2) {
    const diffrenceX = circle2.pos.x - circle1.pos.x
    const diffrenceY = circle2.pos.y - circle1.pos.y

    const distance = Math.sqrt(diffrenceX**2+diffrenceY**2)

    if (distance<=circle1.radius+circle2.radius) {
        return true
    }
    return false
}

function animate() {
    if (alive) {
        const animationId = window.requestAnimationFrame(animate)
        c.fillStyle = "rgb(22,22,44)"
        c.fillRect(0,0,canvas.width,canvas.height)

        //projectile for
        for (let i = projectiles.length-1; i>=0; i--) {
            const projectile = projectiles[i];
            projectile.update()
            if (projectile.pos.x + projectile.radius <0 ||
                projectile.pos.x - projectile.radius >canvas.width ||
                projectile.pos.y + projectile.radius <0 ||
                projectile.pos.y - projectile.radius >canvas.height 
                ) {
                projectiles.splice(i,1)
            }
        }
        // asteriod for
        for (let i = asteriods.length-1; i>=0; i--) {
            const asteriod = asteriods[i];
            asteriod.update()

            if (circleTriangleCollision(asteriod, player.getVertices())) {
                clearInterval(interval)
                alive=false
                break
            }

            for (let iProj = projectiles.length-1; iProj>=0; iProj--) {
                const projectile = projectiles[iProj]
                if (circleCollision(asteriod,projectile)) {
                    if (asteriod.radius>40 || asteriod.radius>50 || true) {
                    // let asteriodArea = circleRadiusToArea(asteriod.radius)
                    // const asteriodAreaHit = asteriodArea-(asteriodArea*CIRCLE_SHRINK_ON_HIT)
                    // addScore(asteriodAreaHit/SCORE_AMOUNT)
                    // asteriod.trueRadius = circleAreaToRadius(asteriodAreaHit)
                    const asteriodRadiusNew = asteriod.radius*CIRCLE_SHRINK_ON_HIT
                    const asteriodRadiusDiff = asteriod.radius-(asteriodRadiusNew)
                    refreshScore(asteriodRadiusDiff/SCORE_AMOUNT)
                    asteriod.trueRadius = asteriodRadiusNew
                    if (asteriod.radius<=CIRCLE_NO_EXIST) {
                        refreshScore(asteriod.radius)
                        asteriod.trueRadius=0
                    }
                    if (asteriod.radius<=0) {
                        refreshScore(asteriod.radius)
                        asteriods.splice(i,1)
                    }
                    projectiles.splice(iProj,1)
                    continue
                    } else {

                    }
                }
            }

            if (asteriod.pos.x + asteriod.radius < (canvas.width/2) - (diaScreenSize*2) ||
                asteriod.pos.x - asteriod.radius > (canvas.width/2) + (diaScreenSize*2) ||
                asteriod.pos.y + asteriod.radius < (canvas.height/2) - (diaScreenSize*2) ||
                asteriod.pos.y - asteriod.radius > (canvas.height/2) + (diaScreenSize*2)
                ) {
                asteriods.splice(i,1)
            }
        }


        if (keys.w.pressed) {
            player.velocity.x=Math.cos(player.rotation)*SPEED
            player.velocity.y=Math.sin(player.rotation)*SPEED
        }
        else if (keys.s.pressed){
            player.velocity.x=player.velocity.x*FRICTION_S_KEY
            player.velocity.y=player.velocity.y*FRICTION_S_KEY
        }
        else {
            player.velocity.x=player.velocity.x*FRICTION
            player.velocity.y=player.velocity.y*FRICTION
        }
        if (keys.d.pressed && keys.a.pressed) {}
        else if (keys.d.pressed) player.rotation+=ROTATION_SPEED
        else if (keys.a.pressed) player.rotation-=ROTATION_SPEED
        player.update()
    }
    else {
        c.fillStyle = "rgb(62,22,22)"
        c.fillRect(0,0,canvas.width,canvas.height)
        player.draw()
        for (let i = 0;i<projectiles.length;i++) {
            projectiles[i].draw()
        } for (let i = 0;i<asteriods.length;i++) {
            asteriods[i].draw()
        }
        displayGameOver(true)
        gameOver.style.animation="showDivDown 1.5s";
        gameOver.style.animationFillMode = "forwards"
    }
}

const keys = {
    w: {pressed:false},
    a: {pressed:false},
    d: {pressed:false},
    s: {pressed:false},
}
animate()

window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case "KeyW":
            keys.w.pressed=true
            break
        case "KeyA":
            keys.a.pressed=true
            break
        case "KeyD":
            keys.d.pressed=true
            break
        case "KeyS":
            keys.s.pressed=true
            break
        case "Space":
            console.log("mak")
            if (!e.repeat) {
                if(alive) {
                projectiles.push(new Projectile({
                pos: {
                    x: player.pos.x+Math.cos(player.rotation)*30,
                    y: player.pos.y+Math.sin(player.rotation)*30,
                },
                velocity: {
                    x: Math.cos(player.rotation)*SPEED_PROJ,
                    y: Math.sin(player.rotation)*SPEED_PROJ,   
                },
                }))
                }
                else{
                    reset()
                }
            }
            
    }
})
window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case "KeyW":
            keys.w.pressed=false
            break
        case "KeyA":
            keys.a.pressed=false
            break
        case "KeyD":
            keys.d.pressed=false
            break
        case "KeyS":
            keys.s.pressed=false
            break
    }
})