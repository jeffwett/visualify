import Visualizer from './classes/visualizer'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import { getRandomElement } from './util/array'
import { plusBackground,lightning, flowerOfLife, flower, tan, waveyCircle, drawShape, chaos, heart, sin, circle, star, line, polygon, speckle } from './util/canvas'

export default class Example extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 10 })
    this.themes = [['#18FF2A', '#7718FF', '#06C5FE', '#FF4242', '#18FF2A'] , 
        ['#08f7fe', '#09fbd3','#fe53bb','#f5d300'],
        ['#3b27ba', '#e847ae', '#13ca91', '#ff9472']
        ]
    this.theme = getRandomElement(this.themes)
    this.shape = 'circle'
    this.shapes = ['circle', 'lightning','flowerOfLife', 'waveyCircle', 'heart', 'flower', 'star', 'triangle', 'square']
    this.lastShapeTime = 0
    this.lastSeenSegment = null 
  }

  nextColors() {
    this.lastColor = this.nextColor || getRandomElement(this.theme)
    this.nextColor = getRandomElement(this.theme.filter(color => color !== this.nextColor))
  }

  nextTheme() {
    this.theme = getRandomElement(this.theme.filter(theme => theme !== this.theme))
  }

  hooks () {
    this.sync.on('bar', beat => {
      this.nextColors()
    })
    this.sync.on('section', beat => {
      if (!this.lastSeenSegment || beat.duration != this.lastSeenSegment.duration) {
        this.lastSeenSegment = beat
        console.log(beat)
        console.log("next section")
        this.nextShape()
      }
    })
  }

  nextShape() {
     this.shape = getRandomElement(this.shapes.filter(shape => shape !== this.shape))
  }

  paintPolygon( { ctx, height, width, now, beat, bar, sides }) {
    console.log(this.sync)
    if (sides == 3)
      tan(ctx, now / 50, height / 2, this.sync.volume * 10, 0.1, 25 / this.sync.volume)
    else if (sides == 4)
      chaos(ctx, 4, this.sync.volume * 30)
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.beginPath()
    ctx.lineWidth = beat
    drawShape(ctx, polygon(sides, this.sync.volume * height / 7 + beat / 12,  width/2,height/2, now/20)) 
  }
  
  paintStar( { ctx, height, width, now, beat, bar }) {
    //sin(ctx, now / 50, height / 2, this.sync.volume * 100, 100)
    line(ctx, Math.cos(now/10)*width - width/2,height/2, this.sync.volume/2, 10, 10)
    line(ctx, Math.cos(now/10)*width*2 - width/2,height/2, this.sync.volume/2, 10, 10)
    speckle(ctx, 3, 30*this.sync.volume)
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.beginPath()
    ctx.lineWidth = beat 
    drawShape(ctx, star(5, this.sync.volume * height / 14,  this.sync.volume * height / 7 + beat / 10, width/2,height/2, now/20, true).vertices) 
  }
 
  paintHeart( { ctx, height, width, now, beat, bar }) {
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.beginPath()
    ctx.lineWidth = beat
    heart(ctx, width / 2, height / 2, this.sync.volume * height / 80 + beat / 160)
    plusBackground(ctx, 3, 30*this.sync.volume)
  } 
  paintFlower( { ctx, height, width, now, beat, bar }) {
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.beginPath()
    ctx.lineWidth = beat
    flower(ctx, width / 2, height / 2, this.sync.volume * height / 40 + beat / 80)
  } 
  paintFlowerOfLife( { ctx, height, width, now, beat, bar }) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0)'
      ctx.lineWidth = beat/10
      flowerOfLife(ctx, width / 2, height / 2, 30 +2*(this.sync.volume * height / 40 + beat / 80), 3)
  } 
  
  paintWaveyCircle( { ctx, height, width, now, beat, bar }) {
    ctx.fillStyle = 'rgba(0, 0, 0, .12)'
    ctx.fillRect(0, 0, width, height)
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.beginPath()
    ctx.lineWidth = beat
    //ctx.translate(width/2, height/2)
    //ctx.rotate(Math.PI / 180)
    //ctx.translate(-width/2, -height/2)
    waveyCircle(ctx, width / 2, height / 2, this.sync.volume * height / 40 + beat / 80, now*5)
    waveyCircle(ctx, width / 2, height / 2, this.sync.volume * height / 75 + beat / 150, now*5)
  } 
  paintLightning( { ctx, height, width, now, beat, bar }) {
    speckle(ctx, 3, 30*this.sync.volume)
    
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.beginPath()
    ctx.lineWidth = beat/3
    lightning(ctx, width/2,height/2, this.sync.volume * height / 10 + beat/20, this.sync.volume * height, beat) 
  }
  paintCircle( { ctx, height, width, now, beat, bar }) {
    sin(ctx, now / 50, height / 2, this.sync.volume * 100, 100)
    ctx.stroke()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.beginPath()
    ctx.lineWidth = beat
    circle(ctx, width / 2, height / 2, this.sync.volume * height / 5 + beat / 10)
  }

  paint ({ ctx, height, width, now }) {
    const bar = interpolateBasis([0, this.sync.volume * 10, 0])(this.sync.bar.progress)
    const beat = interpolateBasis([0, this.sync.volume * 300, 0])(this.sync.beat.progress)
    var sides = 3
    ctx.fillStyle = 'rgba(0, 0, 0, .08)'
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = bar 
    ctx.strokeStyle = interpolateRgb(this.lastColor, this.nextColor)(this.sync.bar.progress)
    //this.paintStar({ ctx, height, width, now, beat, bar})
    if (this.shape == 'circle') 
      this.paintCircle({ ctx, height, width, now, beat, bar})
    else if (this.shape == 'star')
      this.paintStar({ ctx, height, width, now, beat, bar})
    else if (this.shape == 'triangle')
      this.paintPolygon({ ctx, height, width, now, beat, bar, sides})
    else if (this.shape == 'square') {
      sides = 4
      this.paintPolygon({ ctx, height, width, now, beat, bar, sides})
    }
    else if (this.shape == 'waveyCircle')
      this.paintWaveyCircle({ ctx, height, width, now, beat, bar})
    else if (this.shape == 'heart')
      this.paintHeart({ ctx, height, width, now, beat, bar})
    else if (this.shape == 'flower')
      this.paintFlower({ ctx, height, width, now, beat, bar})
    else if (this.shape == 'flowerOfLife')
      this.paintFlowerOfLife({ ctx, height, width, now, beat, bar})
    else if (this.shape == 'lightning')
      this.paintLightning({ ctx, height, width, now, beat, bar})
    ctx.stroke()
    ctx.fill()
  }
}
