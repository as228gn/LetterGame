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
  // correctAnswer

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
      imageUrl: randomImage[0].imageUrl,
      correctAnswer: answer,
      shuffledAnswer: shuffle

    }
    res.render('game/play', { viewData })
  }
}
