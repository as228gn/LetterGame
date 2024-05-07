/**
 * The letter-element web component module.
 *
 * @author Anna Ståhlberg <as228gn@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
.letterDiv {
  width: 100px; /* Bredden på boxen */
  height: 100px; /* Höjden på boxen */
  background-color: #de1a1a; /* Bakgrundsfärg */
  border: 2px solid #dd0e75; /* Ram med tjocklek och färg */
  border-radius: 10px; /* Rundade hörn */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* Skugga */
  font-size: 50px; /* Justera textstorleken */
  color: rgb(17, 17, 31); /* Ändra textfärgen */
  font-family: Arial, sans-serif; /* Justera typsnittet */
  text-align: center; /* Centrera horisontellt */
  line-height: 100px; /* Centrera vertikalt */
  display: inline-block;
  cursor: move;
}
.dropDiv {
  width: 100px; /* Bredden på boxen */
  height: 100px; /* Höjden på boxen */
  background-color: #de1a6c; /* Bakgrundsfärg */
  border: 2px solid #dd0e75; /* Ram med tjocklek och färg */
  border-radius: 10px; /* Rundade hörn */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* Skugga */
  font-size: 50px; /* Justera textstorleken */
  color: rgb(17, 17, 31); /* Ändra textfärgen */
  font-family: Arial, sans-serif; /* Justera typsnittet */
  text-align: center; /* Centrera horisontellt */
  line-height: 100px; /* Centrera vertikalt */
  display: inline-block;
}
.hide {
  display: none;
}
#correctAnswerButton {
  width: 200px;
  height: 150px;
  background-image: url('../img/smiley-163510_640.jpg');
  background-size: cover;
  border: none;
}
</style>
<div id="letterContainer"></div>
<div id="dropZoneContainer"></div>
<input id="correctLetter" class="hide" type="text" name="correctAnswer">
<form method="post" action="./game/play">
<div>
  <button id="correctAnswerButton" class="hide" type="submit"></button>
</div>
</form>
`

customElements.define('letter-element',
  /**
   * Represents a letter element.
   */
  class extends HTMLElement {
    #letterContainer
    #dropZoneContainer
    #dropDiv
    #letterElement
    #answer
    #letterDiv
    /**
     * Creates an instance of the current type.
     */
    constructor() {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#letterContainer = this.shadowRoot.querySelector('#letterContainer')
      this.#dropZoneContainer = this.shadowRoot.querySelector('#dropZoneContainer')
      this.#dropDiv = this.shadowRoot.querySelectorAll('.dropDiv')
      this.#letterDiv = this.shadowRoot.querySelectorAll('.letterDiv')
      this.#letterElement = this
    }

    connectedCallback() {
      const shuffledAnswer = this.#letterElement.getAttribute('data-shuffledAnswer')
      for (let i = 0; i < shuffledAnswer.length; i++) {
        const letter = document.createElement('div')
        const l = document.createTextNode(shuffledAnswer[i])
        letter.appendChild(l)
        letter.setAttribute('draggable', 'true')
        letter.setAttribute('id', 'letter' + [i])
        letter.classList.add('letterDiv')
        this.#letterContainer.appendChild(letter)
        letter.addEventListener('dragstart', function (event) {
          event.dataTransfer.setData('text', event.target.id)
        })
      }
      const correctAnswer = this.#letterElement.getAttribute('data-correctAnswer')
      const component = this

      for (let i = 0; i < correctAnswer.length; i++) {
        const dropZone = document.createElement('div')
        dropZone.classList.add('dropDiv')
        this.#dropZoneContainer.appendChild(dropZone)

        dropZone.addEventListener('dragover', function (event) {
          // Tillåt droppning
          event.preventDefault()
        })
        dropZone.addEventListener('drop', function (event) {
          // Förhindra standardbeteendet
          event.preventDefault()

          const sourceId = event.dataTransfer.getData('text')
          const source = component.shadowRoot.querySelector('#' + sourceId)

          // Hämta data från drag-and-drop händelse
          event.target.appendChild(source)
          const letterDivAnswers = component.shadowRoot.querySelectorAll('#dropZoneContainer .dropDiv')
          const answer = component.shadowRoot.querySelector('#correctLetter')
          answer.value = ''

          letterDivAnswers.forEach(function (element) {
            answer.value += element.textContent.trim()
            if (answer.value === correctAnswer) {
              const button = component.shadowRoot.querySelector('#correctAnswerButton')

              // När du vill visa knappen igen, ta bort klassen "hide"
              button.classList.remove('hide')
            }
          })
        })
      }
    }
  }
)

//     const letterDivAnswers = document.querySelectorAll('#dropZoneContainer .letterContainer')
//     const correctAnswer = dropZoneContainer.getAttribute('data-correctAnswer')
//     answer.value = ''

//     letterDivAnswers.forEach(function (element) {
//       answer.value += element.textContent.trim()
//       if (answer.value === correctAnswer) {
//         const button = document.getElementById('correctAnswerButton');

//         // När du vill visa knappen igen, ta bort klassen "hide"
//         button.classList.remove('hide')
//       }
//     })