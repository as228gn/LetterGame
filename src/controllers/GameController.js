/**
 * @file Defines the AdminController class.
 * @module AdminController
 * @author Anna Ståhlberg
 */
import { ImageModel } from '../models/ImageModel.js'
/**
 * Encapsulates a controller.
 */
export class GameController {
  //correctAnswer

  async index(req, res) {
    res.render('game/index')
  }

  async getRandomImage(req, res) {
    // if (req.body.correctAnswer === this.correctAnswer) {
    //   console.log('Run function for correct answer')
    // }
    const randomImage = await ImageModel.aggregate([{ $sample: { size: 1 } }])
    const answer = randomImage[0].correctAnswer

    const letters = answer.split('')
    letters.sort(() => Math.random() - 0.5)
    const shuffle = letters.join('')

    const viewData = {
      fileName: randomImage[0].fileName,
      correctAnswer: answer,
      shuffledAnswer: shuffle

    }
console.log(answer)
console.log(req.body.correctAnswer)
    if (req.body.correctAnswer === answer) {
      console.log('rätt')
    }
    // const fileName = randomImage[0].fileName
    // this.correctAnswer = randomImage[0].correctAnswer
    res.render('game/play', { viewData })
  }
}