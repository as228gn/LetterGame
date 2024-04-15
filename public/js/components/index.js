const letterDiv = document.querySelectorAll('.letterContainer')
const dropZone = document.querySelectorAll('.dropZone')

letterDiv.forEach(function (element) {
  element.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text/plain', element.textContent)
  })

  // element.addEventListener('dragend', function (event) {
  //   console.log('dragslut')
  // })
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
    const data = event.dataTransfer.getData('text/plain')

    // Skapa ett nytt element för att innehålla den släppta bokstaven
    const droppedLetter = document.createElement('div')
    droppedLetter.textContent = data

    // Lägg till den släppta bokstaven i dropzonen
    element.appendChild(droppedLetter)
  })
})
