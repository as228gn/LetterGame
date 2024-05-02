const letterDiv = document.querySelectorAll('.letterContainer')
const dropZone = document.querySelectorAll('.dropZone')

letterDiv.forEach(function (element) {
  element.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text', event.target.id)
    //event.target.classList.add('letter')
  })

  element.addEventListener('dragend', function (event) {
   //event.target.classList.add('dragging')
  })
})

dropZone.forEach(function (element) {
  element.addEventListener('dragover', function (event) {
    // Tillåt droppning
    event.preventDefault()
  })

  element.addEventListener('drop', function (event) {
console.log(event)
    // Förhindra standardbeteendet
    event.preventDefault()

    // const letter = document.querySelectorAll('.letter')
    // console.log(letter)
    // letter.remove()

    // Hämta data från drag-and-drop händelse
    const data = event.dataTransfer.getData('text')
    console.log(data)
    event.target.appendChild(document.getElementById(data))
    // Skapa ett nytt element för att innehålla den släppta bokstaven
    // const droppedLetter = document.createElement('div')
    // droppedLetter.textContent = data

    // // Lägg till den släppta bokstaven i dropzonen
    // element.appendChild(droppedLetter)
  })
})
