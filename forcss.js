let score=0;
const scoreLabel = document.querySelector("#score")
console.log(scoreLabel)
function refreshScore(scoreToAdd = 0) {
    score+=scoreToAdd
    scoreLabel.innerText = "Score = " + abb_num(Math.floor(score))
}

const gameOver = document.querySelector("#gameOverDiv")

function displayGameOver(show) {
    let zi = -1
    if (show) {zi+=2}
    gameOver.style.zIndex = zi
}