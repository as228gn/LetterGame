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

  async finnish(req, res) {
    res.render('game/finnish')
  }

  async getRandomImage(req, res) {
    if (req.session.images === undefined) {
      const allImages = await ImageModel.find()
      allImages.sort(() => Math.random() - 0.5)

      req.session.images = allImages
    }

    const image = req.session.images.shift()
    if (image === null || image === undefined) {
      res.render('game/finnish')
      req.session.destroy()
      return
    }

    const answer = image.correctAnswer

    const letters = answer.split('')
    letters.sort(() => Math.random() - 0.5)
    const shuffle = letters.join('')

    const viewData = {
      imageUrl: image.imageUrl,
      correctAnswer: answer,
      shuffledAnswer: shuffle

    }
    res.render('game/play', { viewData })
  }
}
