// Generate a random number using the entered max and min numbers
function random(max, min) {
  const number = Math.floor(Math.random() * (max - min) + min)
  return number
}

// Generate the cards based on the number of cards selected
function generateCards(numberOfCards) {
  const section = document.getElementById("game")
  section.innerHTML = ""

  // Calculate grid columns based on number of cards
  const gridColumns = {
    16: 4,
    20: 5,
    24: 6,
    30: 6,
    36: 6,
  }

  // Set the correct grid
  const columns = gridColumns[numberOfCards]
  section.style.gridTemplateColumns = `repeat(${columns}, 1fr)`

  for (let i = 0; i < numberOfCards; i++) {
    const card = document.createElement("button")
    const imageContainer = document.createElement("div")
    card.classList.add("memory-card")
    card.setAttribute("id", "card" + i)
    card.appendChild(imageContainer)
    card.addEventListener("click", () =>
      checkPicture(card, card.getAttribute("id")),
    )
    section.appendChild(card)
  }
}

// Play the game. Generates the selected amount of cards along with their images
function play() {
  setNumberOfCards(parseFloat(sizeList.value))
  generateCards(numberOfCards)
  generateImageList(numberOfCards)
  assignImages(numberOfCards)
  totalClicks = 0
  clickedPictures = []
  matchedCards = 0
  startTime = null
  hardcore = hardcoreToggle.checked
  clearInterval(timerInterval)
  pClicks.textContent = "Clicks: 0"
  pTime.textContent = "Time: 0s"

  if (hardcore) {
    pHardcore.textContent = "HARDCORE"
  } else {
    pHardcore.textContent = ""
  }
}

// Set the number of cards to be used
function setNumberOfCards(number) {
  numberOfCards = number
}

// Reset the image list and generate a new set of images with 2 of each based on the number of cards
function generateImageList(numberOfCards) {
  imageList = []
  for (let i = 0; i < numberOfCards / 2; i++) {
    imageList.push("img/img" + i + ".avif")
    imageList.push("img/img" + i + ".avif")
  }
}

// Assign an image to each card using the imageList and random function
function assignImages(numberOfCards) {
  for (let i = 0; i < numberOfCards; i++) {
    const card = document.getElementById("card" + i)
    const imageContainer = card.firstChild

    // Get a random index out of the available images
    const imageIndex = random(imageList.length, 0)

    // Set the image to the image container and add a custom attribute to later check which image it has
    const imagePath = imageList[imageIndex]
    imageContainer.style.backgroundImage = `url('${imagePath}')`
    imageContainer.setAttribute("picture", imagePath)

    // Remove the image from the list when it has been used
    imageList.splice(imageIndex, 1)
  }
}

// Check what a card is
function checkPicture(card, id) {
  // If the card is already revealed, do nothing
  if (clickedPictures.length < 2) {
    if (card.firstChild.style.display === "block") {
      return
    }

    // Reveal the image of the clicked card
    revealImage(card)

    // Add the picture to the clicked pictures array
    clickedPictures.push({
      picture: card.firstChild.getAttribute("picture"),
      id: id,
    })

    // If there are 2 pictures in the array, check if they are the same
    if (clickedPictures.length === 2) {
      const picture1 = clickedPictures[0].picture
      const picture2 = clickedPictures[1].picture

      if (checkMatch(picture1, picture2)) {
        matchedCards += 2
        clickedPictures = []
        if (matchedCards < numberOfCards) {
          soundMatch.play()
        }

        if (matchedCards === numberOfCards) {
          soundWin.play()
          clearInterval(timerInterval)
        }
      } else {
        soundNoMatch.play()
        setTimeout(() => {
          resetCards(clickedPictures[0].id, clickedPictures[1].id, hardcore)
        }, 1500)
      }
    }
  }
}

// Reveal the image of the clicked card
function revealImage(card) {
  card.firstChild.style.display = "block"
  totalClicks++
  pClicks.textContent = "Clicks: " + totalClicks

  // Start the timer on the first click
  if (totalClicks === 1) {
    startTime = Date.now()
    timerInterval = setInterval(updateTime, 1000)
  }
}

// Check if 2 pictures are the same, returns a boolean
function checkMatch(picture1, picture2) {
  if (picture1 === picture2) {
    return true
  } else {
    return false
  }
}

// Hide the cards again and reset the variables.
function resetCards(id1, id2, hardcore) {
  if (!hardcore) {
    const card1 = document.getElementById(id1)
    const card2 = document.getElementById(id2)

    card1.firstChild.style.display = "none"
    card2.firstChild.style.display = "none"
  } else if (hardcore) {
    for (let i = 0; i < numberOfCards; i++) {
      const card = document.getElementById("card" + i)
      card.firstChild.style.display = "none"
    }
    matchedCards = 0
  }

  clickedPictures = []
}

// Update the timer display
function updateTime() {
  if (startTime) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    pTime.textContent = "Time: " + elapsed + "s"
  }
}

// Global variables
let clickedPictures = []

let numberOfCards = 0

let matchedCards = 0

let imageList = []

let totalClicks = 0

let startTime = null
let timerInterval = null

let hardcore = false

// Get the list of size options
const sizeList = document.getElementById("sizeList")

// Get the play button and run the play function when it is clicked
const btnStart = document.getElementById("btnStart")
btnStart.addEventListener("click", play)

const btnYes = document.getElementById("btnYes")
const btnNo = document.getElementById("btnNo")

const hardcoreToggle = document.getElementById("hardcoreToggle")

const pClicks = document.getElementById("moves")
const pTime = document.getElementById("time")
const pHardcore = document.getElementById("hardcore")

btnYes.addEventListener("click", () => {
  soundMatch.play()
  document.querySelector(".overlay").style.display = "none"
})

btnNo.addEventListener("click", () => {
  soundNoMatch.play()
  alert("You are not a COOL person! Goodbye!")
  window.close()
})

// Sounds
const soundMatch = new Audio("sounds/yippee.mp3")
const soundNoMatch = new Audio("sounds/vine-boom.mp3")
const soundWin = new Audio("sounds/happy.mp3")

soundWin.volume = 0.5
