export const PI = Math.PI
export const TWO_PI = PI * 2

export function toRadians (angle) {
  return PI * angle / 180
}

export function x (radius, theta, cx = 0) {
  return radius * Math.cos(theta) + cx
}

export function y (radius, theta, cy = 0) {
  return radius * Math.sin(theta) + cy
}

export function coords (radius, theta, cx = 0, cy = 0) {
  return {
    x: x(radius, theta, cx),
    y: y(radius, theta, cy)
  }
}

export function polygon (sides, radius, cx = 0, cy = 0, rotation = 0) {
  const angle = 360/sides
  const vertices = []

  for (var i = 0; i < sides; i++) {
    const _coords = coords(radius, toRadians((angle * i) + rotation), cx, cy)
    vertices.push(_coords)
  }

  return vertices
}

export function star (points, innerRadius, outerRadius, cx = 0, cy = 0, rotation = 0, round = false) {
  const outer = polygon(points, outerRadius, cx, cy, rotation)
  const inner = polygon(points, innerRadius, cx, cy, (360 / points / 2) + rotation)
  const vertices = []
  
  for (var i = 0; i < points; i++) {
    vertices.push({ x: outer[i].x, y: outer[i].y })
    vertices.push({ x: inner[i].x, y: inner[i].y })
  }

  return { outer, inner, vertices }
}

export function circle (ctx, x, y, radius, start = 0, end = TWO_PI) {
  ctx.beginPath()
  ctx.arc(x, y, radius, start, end)
  ctx.closePath()
  return ctx
}

export function drawShape (ctx, vertices) {
  vertices.forEach(({ x, y }, i) => {
    if (i === 0) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.closePath()
  return ctx
}

export function heart(ctx, xOffset, yOffset, radius, start = 0, end = TWO_PI) {
  const x = t => radius*(16*Math.sin(t)**3)
  const y = t => -radius*(13*Math.cos(t) - 5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))
  const { width } = ctx.canvas 
  ctx.beginPath()
  const tick = 1
  for (var t = start + TWO_PI/2; t <= end + TWO_PI/2; t += TWO_PI/100) { 
    if (t == start) {
     ctx.moveTo(x(t)+xOffset, y(t) + yOffset)
    } else {
      ctx.lineTo(x(t) + xOffset, y(t)+ yOffset)
    }
  }
}
export function plusBackground(ctx, radius, amount) {
  const { width, height } = ctx.canvas 
  for (var i = 0; i <amount; i += 1 ) {
    const x = Math.random()*width
    const y = Math.random()*height
    ctx.moveTo(x+radius,y)
    ctx.lineTo(x-radius, y)
    ctx.moveTo(x,y+radius)
    ctx.lineTo(x, y-radius)
    ctx.closePath()
  }
}

export function lightning(ctx, xOffset, yOffset, radius, energy, beat) { 
  //ctx.beginPath()
  ctx.arc(xOffset, yOffset, radius, 0, TWO_PI)
  ctx.lineWidth = beat/10
  //ctx.stroke()
  // For each point on the circle
  for (var t = 0; t <= TWO_PI; t += TWO_PI/beat*4) {
    const cx = Math.cos(t)*radius + xOffset;
    const cy = Math.sin(t)*radius + yOffset;
    const nx = Math.cos(t)*(radius + energy) + xOffset;
    const ny = Math.sin(t)*(radius + energy)+ yOffset;
    ctx.moveTo(cx, cy) 
    ctx.lineTo(nx, ny) 
    ctx.closePath()
  }
}

export function flowerOfLife(ctx, xOffset, yOffset, radius, maxDepth=3, start = 0, end = TWO_PI, depth=0) {
  if (depth > maxDepth)
    return;
  ctx.beginPath()
  ctx.arc(xOffset, yOffset, radius, start, end)
  ctx.stroke()
  // For each point on the circle
  for (var t = TWO_PI/12; t <= TWO_PI; t += TWO_PI/6) {
    const cx = Math.cos(t)*radius + xOffset;
    const cy = Math.sin(t)*radius + yOffset;
    flowerOfLife(ctx, cx, cy, radius, maxDepth, start, end, depth + 1)
  }
}

export function flower(ctx, xOffset, yOffset, radius, start = 0, end = TWO_PI) {
  const r = x => radius*2*(3*Math.sin(10*x))+x/2*Math.cos(10*radius*x)
  const { width } = ctx.canvas 
  ctx.beginPath()
  const tick = 1
  for (var t = start; t <= end; t += TWO_PI/1000) { 
    const x = r(t)*Math.cos(t) + xOffset
    const y = r(t)*Math.sin(t) + yOffset
    if (x === -50) {
     ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
}


function rotatePoint(x,y,cx,cy, rotation) {
  var coords = { x: x, y: y}
  return coords;
  coords.x = Math.cos(rotation)*(x-cx) - Math.sin(rotation)*(y-cy) + cx
  coords.y = Math.sin(rotation)*(y-cy) + Math.cos(rotation)*(x-cx) + cy
  return coords;
}


export function waveyCircle(ctx, xOffset, yOffset, radius, rotation=0, start = 0, end = TWO_PI) {
  const r = x => radius*((Math.sin((x * 6))**2 + Math.sin(x)) + 10) 
  const { width } = ctx.canvas 
  ctx.beginPath()
  const tick = 1
  for (var t = start; t <= end; t += TWO_PI/1000) { 
    const x = r(t)*Math.cos(t) + xOffset
    const y = r(t)*Math.sin(t) + yOffset
    
    const _coords = rotatePoint(x,y, xOffset, yOffset, rotation) 
    if (x === -50) {
     ctx.moveTo(_coords.x, _coords.y)
    } else {
      ctx.lineTo(_coords.x, _coords.y)
    }
  }
}

export function line(ctx, xOffset, yOffset, slope, frequency, tick = 5) {
  const y = x => ((slope * x + xOffset) + yOffset)
  const { width } = ctx.canvas 
  ctx.beginPath()
  for (var x = -50; x < width + 50; x += tick) {
    if (x === -50) {
      ctx.moveTo(x, y(x))
    } else {
      ctx.lineTo(x, y(x))
    }
  }
}
export function chaos(ctx, radius, amount) {
  const { width, height } = ctx.canvas 
  for (var i = 0; i <amount; i += 1 ) {
    const x = Math.random()*width
    const y = Math.random()*height
    ctx.moveTo(x,y)
    ctx.arc(x, y, radius, 0, TWO_PI/4)
    ctx.closePath()
  }
}
export function speckle(ctx, radius, amount) {
  const { width, height } = ctx.canvas 
  for (var i = 0; i <amount; i += 1 ) {
    const x = Math.random()*width
    const y = Math.random()*height
    ctx.moveTo(x,y)
    ctx.arc(x, y, radius, 0, TWO_PI)
    ctx.closePath()
  }
}

export function tan (ctx, xOffset, yOffset, amplitude, frequency, tick = 5) {
  const y = x => (amplitude * Math.tan((x / frequency) + xOffset) + yOffset)
  const { width } = ctx.canvas 
  ctx.beginPath()
  for (var x = -50; x < width + 50; x += tick) {
    if (x === -50) {
      ctx.moveTo(x, y(x))
    } else {
      ctx.lineTo(x, y(x))
    }
  }
}
export function sin (ctx, xOffset, yOffset, amplitude, frequency, tick = 5) {
  const y = x => (amplitude * Math.sin((x / frequency) + xOffset) + yOffset)
  const { width } = ctx.canvas 
  ctx.beginPath()
  for (var x = -50; x < width + 50; x += tick) {
    if (x === -50) {
     ctx.moveTo(x, y(x))
    } else {
      ctx.lineTo(x, y(x))
    }
  }
}
