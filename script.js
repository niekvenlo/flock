// FLOCKING

function differenceVector (vectorOne, vectorTwo) {
  let xNew = vectorOne.x - vectorTwo.x
  let yNew = vectorOne.y - vectorTwo.y
  let zNew = vectorOne.z - vectorTwo.z
  return { x: xNew, y: yNew, z: zNew }
}
function vectorLength (vector) {
  let xx = vector.x ** 2
  let yy = vector.y ** 2
  let zz = vector.z ** 2
  return Math.sqrt(xx + yy + zz)
}
function sumVectors (...vectors) {
  let x = 0
  let y = 0
  let z = 0
  vectors.forEach(vector => {
    x += vector.x
    y += vector.y
    z += vector.z
  })
  return {x, y, z}
}
function multiplyVector (vector, multiplier) {
  return {
    x: vector.x * multiplier,
    y: vector.y * multiplier,
    z: vector.z * multiplier
  }
}
function normalizeVector (vector) {
  let sumLength = vectorLength(vector)
  console.assert(vector.x !== 0 || vector.y !== 0 || vector.z !== 0)
  return {
    x: vector.x / sumLength,
    y: vector.y / sumLength,
    z: vector.z / sumLength
  }
}
function negateVector (vector) {
  return {
    x: -vector.x,
    y: -vector.y,
    z: -vector.z
  }
}
function randomNumber (n) {
  return Math.random() * n
}
function withinReach (boid, currentBoid, maxDistance) {
  // Currently doesn't filter out the currentBoid
  return vectorLength(differenceVector(boid.position, currentBoid.position)) < maxDistance
}

class Boid {
  constructor (a, b, c, d, e, f) {
    let spread = 2000
    a = a || spread / 2 - randomNumber(spread)
    b = b || spread / 2 - randomNumber(spread)
    c = c || spread / 2 - randomNumber(spread)

    d = d || 1
    e = e || 0.5 - randomNumber(1)
    f = f || 0

    this.position = {x: a, y: b, z: c}
    this.velocity = {x: d, y: e, z: f}
    this.metaData = {/* store color information and such */}
  }
}

let parameters = {
  range: {
    alignment: 20,
    cohesion: 200,
    repulsion: 40
  },
  weight: {
    alignment: 0.1,
    cohesion: 0.001,
    repulsion: 0.001,
    centralize: 0.00001
  },
  timeDelta: 25,
  boidSpeed: 0.2,
  numberOfBoids: 500
}

function getAlignment (currentBoid) {
  try {
    let sumOfBoids = boids
      .filter(everyOtherBoid => withinReach(
        everyOtherBoid,
        currentBoid,
        parameters.range.alignment
      ))
      .map(boid => boid.velocity)
      .reduce((resultant, everyOtherBoidVelocity) => {
        return sumVectors(resultant, everyOtherBoidVelocity)
      })
    return normalizeVector(sumOfBoids)
  } catch (e) {
    return { x: 0, y: 0, z: 0 }
  }
}
function getCohesion (currentBoid) {
  try {
    let sumOfBoids = boids
      .filter(everyOtherBoid => withinReach(
        everyOtherBoid,
        currentBoid,
        parameters.range.cohesion
      ))
      .map(boid => boid.position)
      .reduce((resultant, everyOtherBoidPosition) => {
        return sumVectors(resultant, everyOtherBoidPosition)
      })
    return normalizeVector(sumOfBoids)
  } catch (e) {
    return { x: 0, y: 0, z: 0 }
  }
}
function getRepulsion (currentBoid) {
  try {
    let sumOfBoids = boids
      .filter(everyOtherBoid => withinReach(
        everyOtherBoid,
        currentBoid,
        parameters.range.repulsion
      ))
      .map(boid => boid.position)
      .reduce((resultant, everyOtherBoidPosition) => {
        let distanceVector = differenceVector(everyOtherBoidPosition, currentBoid.position)
        return sumVectors(resultant, distanceVector)
      })
      // console.log(vectorLength(sumOfBoids))
    return negateVector(normalizeVector(sumOfBoids))
  } catch (e) {
    return { x: 0, y: 0, z: 0 }
  }
}
function getCentralize (currentBoid) {
  return differenceVector({x: 0, y: 0, z: 0}, currentBoid.position)
}

function updateBoid (boid) {
  // normalized velocity vectors * weight
  let align = multiplyVector(getAlignment(boid), parameters.weight.alignment)
  let cohere = multiplyVector(getCohesion(boid), parameters.weight.cohesion)
  let repel = multiplyVector(getRepulsion(boid), parameters.weight.repulsion)
  let centre = multiplyVector(getCentralize(boid), parameters.weight.centralize)

  let updatedBoid = {}
  // velocity = normalized sum * speed + a vector toward zero
  let normalVelocity = normalizeVector(sumVectors(boid.velocity, align, cohere, repel))
  let centreAdjustedVelocity = sumVectors(normalVelocity, centre)
  updatedBoid.velocity = multiplyVector(centreAdjustedVelocity, parameters.boidSpeed)
  // position = position + (velocity * timeDelta)
  let movement = multiplyVector(updatedBoid.velocity, parameters.timeDelta)
  updatedBoid.position = sumVectors(boid.position, movement)
  // copy meta data
  updatedBoid.metaData = boid.metaData
  return updatedBoid
}

function createCanvas () {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  document.body.appendChild(canvas)
  return {canvas, ctx}
}
function draw (boid, canvas, ctx) {
  let {x, y} = boid.position
  let sx = x + (canvas.width / 2)
  let sy = y + (canvas.height / 2)
  let boidSize = 2
  // boidSize = Math.abs(10 + Math.round(z / 100))
  ctx.beginPath()
  ctx.arc(sx, sy, boidSize, 0, 2 * Math.PI)
  ctx.fill()
  // ctx.fillRect(sx, sy, boidSize, boidSize)
}

function tick (canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  boids.forEach(boid => draw(boid, canvas, ctx))
  boids = boids.map(boid => updateBoid(boid))
}

function start () {
  let {canvas, ctx} = createCanvas()
  setInterval(tick.bind(this, canvas, ctx), parameters.timeDelta)
}

let boids = new Array(parameters.numberOfBoids).fill(1).map(element => new Boid())
window.onload = start
