const letterDiv = document.querySelectorAll('.letterContainer')
const dropZone = document.querySelectorAll('.dropZone')
const answer = document.querySelector('#correctLetter')
const dropZoneContainer = document.querySelector('#dropZoneContainer')

letterDiv.forEach(function (element) {
  element.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text', event.target.id)
  })
})

dropZone.forEach(function (element) {
  element.addEventListener('dragover', function (event) {
    // Tillåt droppning
    event.preventDefault()
  })

  element.addEventListener('drop', function (event) {
    // Förhindra standardbeteendet
    event.preventDefault()

    // Hämta data från drag-and-drop händelse
    const data = event.dataTransfer.getData('text')
    event.target.appendChild(document.getElementById(data))

    const letterDivAnswers = document.querySelectorAll('#dropZoneContainer .letterContainer')
    const correctAnswer = dropZoneContainer.getAttribute('data-correctAnswer')
    answer.value = ''

    letterDivAnswers.forEach(function (element) {
      answer.value += element.textContent.trim()
      if (answer.value === correctAnswer) {
        const button = document.getElementById('correctAnswerButton');

        // När du vill visa knappen igen, ta bort klassen "hide"
        button.classList.remove('hide')
      }
    })
  })
})
