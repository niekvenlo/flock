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
  return Math.floor(Math.random() * n)
}
function withinReach (boid, currentBoid, maxDistance) {
  // Currently doesn't filter out the currentBoid
  return vectorLength(differenceVector(boid.position, currentBoid.position)) < maxDistance
}

class Boid {
  constructor (a, b, c, d, e, f) {
    a = a || randomNumber(200)
    b = b || randomNumber(200)
    c = c || randomNumber(200)

    d = d || randomNumber(10)
    e = e || randomNumber(4)
    f = f || randomNumber(1)

    this.position = {x: a, y: b, z: c}
    this.velocity = {x: d, y: e, z: f}
    this.metaData = {/* store color information and such */}
  }
}

let boids = new Array(400).fill(1).map(element => new Boid())

let parameters = {
  range: {
    alignment: 100,
    cohesion: 100,
    repulsion: 100
  },
  weight: {
    alignment: 1,
    cohesion: 1,
    repulsion: 1
  },
  timeDelta: 10,
  boidSpeed: 0.1
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
    return negateVector(normalizeVector(sumOfBoids))
  } catch (e) {
    return { x: 0, y: 0, z: 0 }
  }
}

function updateBoid (boid) {
  // normalized velocity vectors * weight
  let align = multiplyVector(getAlignment(boid), parameters.weight.alignment)
  let cohere = multiplyVector(getCohesion(boid), parameters.weight.cohesion)
  let repel = multiplyVector(getRepulsion(boid), parameters.weight.repulsion)

  let updatedBoid = {}
  // velocity = normalized sum * speed
  let normalVelocity = normalizeVector(sumVectors(boid.velocity, align, cohere, repel))
  updatedBoid.velocity = multiplyVector(normalVelocity, parameters.boidSpeed)
  // position = position + (velocity * timeDelta)
  let movement = multiplyVector(updatedBoid.velocity, parameters.timeDelta)
  updatedBoid.position = sumVectors(boid.position, movement)
  // copy meta data
  updatedBoid.metaData = boid.metaData
  return updatedBoid
}

// Quick performance sanity check
let t = Date.now()
let steps = 100
console.log(boids[0].position)
for (let i = 0; i < steps; i++) {
  boids = boids.map(boid => updateBoid(boid))
  if (i % (steps / 10) === 0) {
    console.log(boids[0].position)
  }
}
console.log((Date.now() - t) / steps)
