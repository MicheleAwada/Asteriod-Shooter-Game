function circleTriangleCollision(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges
  for (let i = 0; i < 3; i++) {
    let start = triangle[i]
    let end = triangle[(i + 1) % 3]

    let dx = end.x - start.x
    let dy = end.y - start.y
    let length = Math.sqrt(dx * dx + dy * dy)

    let dot =
      ((circle.pos.x - start.x) * dx +
        (circle.pos.y - start.y) * dy) /
      Math.pow(length, 2)

    let closestX = start.x + dot * dx
    let closestY = start.y + dot * dy

    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x
      closestY = closestY < start.y ? start.y : end.y
    }

    dx = closestX - circle.pos.x
    dy = closestY - circle.pos.y

    let distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= circle.radius) {
      return true
    }
  }

  // No collision
  return false
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  )
}

function circleAreaToRadius(area) {
  return Math.sqrt(area/Math.PI)
}

function circleRadiusToArea(radius) {
    return (radius**2)*Math.PI
}

function abb_num(num) {return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 0
  }).format(num);}
refreshScore(0)