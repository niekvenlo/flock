// FLOCKING

function diffVector (vectorOne, vectorTwo) {
  let xNew = vectorOne.x - vectorTwo.x
  let yNew = vectorOne.y - vectorTwo.y
  let zNew = vectorOne.z - vectorTwo.z
  if (!zNew) {
    return { x: xNew, y: yNew }
  }
  return { x: xNew, y: yNew, z: zNew }
}
function vectorLength (vector) {
  let xx = vector.x ** 2
  let yy = vector.y ** 2
  let zz = vector.z ** 2
  if (!zz) {
    return Math.sqrt(xx + yy)
  }
  return Math.sqrt(xx + yy + zz)
}
function sumVectors (...vectors) {
  // console.log(vectors[0])
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
function normalizeVector (vector) {
  let sumLength = vectorLength(vector)
  return {
    x: vector.x / sumLength,
    y: vector.y / sumLength,
    z: vector.z / sumLength
  }
}
function randomNumber (n) {
  return Math.floor(Math.random() * n)
}

class Boid {
  constructor (a, b, c, d, e, f) {
    a = a || randomNumber(120)
    b = b || randomNumber(120)
    c = c || randomNumber(120)

    d = d || randomNumber(10)
    e = e || 5
    f = f || 0

    this.position = {x: a, y: b, z: c}
    this.velocity = {x: d, y: e, z: f}
    // console.log(vectorLength(this.position))
    // console.log(vectorLength(this.velocity))
  }
}

let boids = new Array(10).fill(1).map(element => new Boid())
// console.log(boids)

let parameters = {
  alignmentDistance: 100,
  cohesionDistance: 100,
  repulsionDistance: 100,
  stepTime: 16
}

function withinReach (boid, currentBoid, maxDistance) {
  return vectorLength(diffVector(boid.position, currentBoid.position)) < maxDistance
}

function getAlignment (currentBoid) {
  let sumOfBoids = boids
    .filter(everyOtherBoid => withinReach(
      everyOtherBoid,
      currentBoid,
      parameters.alignmentDistance
    ))
    .map(boid => boid.velocity)
    .reduce((resultant, everyOtherBoidVelocity) => {
      return sumVectors(resultant, everyOtherBoidVelocity)
    })
  return normalizeVector(sumOfBoids)
}

//
// function getCohesion (currentBoid) {
//   // As getAlignment
// }
//
// function getRepulsion (currentBoid) {
//   // As getAlignment
// }
//
// function updateBoids (boid) {
//   // Called for each boid.
//   let align = getAlignment(boid)
//   let cohere = getCohesion(boid)
//   let repel = getRepulsion(boid)
//   boid.velocity.x += align.x + cohere.x + repel.x
//   boid.velocity.y += align.y + cohere.y + repel.y
//   boid.velocity.z += align.z + cohere.z + repel.z
//   boid.position.x += boid.position.x + boid.velocity.x * parameters.stepTime
//   boid.position.y += boid.position.y + boid.velocity.y * parameters.stepTime
//   boid.position.z += boid.position.z + boid.velocity.z * parameters.stepTime
// }
// boids.map(boid => updateBoids(boid))
