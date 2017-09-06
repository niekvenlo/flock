// FLOCKING

class Boid {
  contructor () {
    this.velocity = {x: 0, y: 0, z: 0}
    this.position = {x: 0, y: 0, z: 0}
  }
}

let boids = new Array(1).fill(1).map(element => new Boid())

let parameters = {
  alignmentDistance: 100,
  cohesionDistance: 100,
  repulsionDistance: 100,
  stepTime: 16
}

function withinReach (boid, maxDistance) {
  /* Return true for boids that are close enough */
}

function getAlignment (currentBoid) {
  boids
    .filter(boid => withinReach(boid, parameters.alignmentDistance))
    .reduce(everyOtherBoid => {
    // Reduce to single velocity vector
    })
    .map(/* Normalize velocity vector */)
}

function getCohesion (currentBoid) {
  // As getAlignment
}

function getRepulsion (currentBoid) {
  // As getAlignment
}

function updateBoids (boid) {
  // Called for each boid.
  let align = getAlignment(boid)
  let cohere = getCohesion(boid)
  let repel = getRepulsion(boid)
  boid.velocity.x += align.x + cohere.x + repel.x
  boid.velocity.y += align.y + cohere.y + repel.y
  boid.velocity.z += align.z + cohere.z + repel.z
  boid.position.x += boid.position.x + boid.velocity.x * parameters.stepTime
  boid.position.y += boid.position.y + boid.velocity.y * parameters.stepTime
  boid.position.z += boid.position.z + boid.velocity.z * parameters.stepTime
}
boids.map(boid => updateBoids(boid))
