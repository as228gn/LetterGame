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
  margin-right: 20px;
  width: 100%; /* Bredden på boxen */
  height: 100%; /* Höjden på boxen */
  background-color: #de1a1a; /* Bakgrundsfärg */
  border: 3px solid #dd0e75; /* Ram med tjocklek och färg */
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
  overflow: hidden;
  margin-top: 50px;
  margin-right: 20px;
  width: 100px; /* Bredden på boxen */
  height: 100px; /* Höjden på boxen */
  background-color: #de1a6c; /* Bakgrundsfärg */
  border: 3px solid #de1a1a; /* Ram med tjocklek och färg */
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
  height: 200px;
  background-image: url('../img/smiley-163510_640.jpg');
  background-size: cover;
  border: none;
  margin-top: 20px;
  border-radius: 50%;
  background-position: center;
}
#componentContainer {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrera element horisontellt */
  text-align: center; /* Centrera element vertikalt */
}
.letterDivContainer {
  margin-right: 20px;
  width: 100px; /* Bredden på boxen */
  height: 100px; /* Höjden på boxen */
  background-color: rgb(239, 211, 89); /* Bakgrundsfärg */
  border: 3px solid #dd0e75; /* Ram med tjocklek och färg */
  border-radius: 10px; /* Rundade hörn */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3); /* Skugga */
  display: inline-block;
  overflow: hidden;
}
</style>
<div id="componentContainer">
  <div id="letterContainer"></div>
  <div id="dropZoneContainer"></div>
  <input id="correctLetter" class="hide" type="text" name="correctAnswer">
  <form method="post" action="./game/play">
  <div>
    <button id="correctAnswerButton" class="hide" type="submit"></button>
  </div>
  </form>
</div>
`

customElements.define('letter-element',
  /**
   * Represents a letter element.
   */
  class extends HTMLElement {
    #letterContainer
    #dropZoneContainer
    #letterElement
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
      this.#letterElement = this
    }

    connectedCallback() {
      const shuffledAnswer = this.#letterElement.getAttribute('data-shuffledAnswer')
      for (let i = 0; i < shuffledAnswer.length; i++) {
        const letterDivContainer = document.createElement('div')
        letterDivContainer.classList.add('letterDivContainer')
        const letter = document.createElement('div')
        const l = document.createTextNode(shuffledAnswer[i])
        letter.appendChild(l)
        letter.setAttribute('draggable', 'true')
        letter.setAttribute('id', 'letter' + [i])
        letter.classList.add('letterDiv')
        letterDivContainer.appendChild(letter)
        this.#letterContainer.appendChild(letterDivContainer)
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
          const origin = source.parentNode

          if (event.currentTarget.innerHTML !== '') {
            const existingLetterDiv = event.currentTarget.children[0]
            origin.appendChild(existingLetterDiv)
            event.currentTarget.appendChild(source)
          } else {
            event.currentTarget.appendChild(source)
          }

          // Hämta data från drag-and-drop händelse
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
