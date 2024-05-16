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
  /**
   * The startpage.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async index (req, res) {
    res.render('game/index')
  }

  /**
   * The function that sends the image and the correct answer to the view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async play (req, res) {
    if (req.session.images === undefined) {
      const allImages = await ImageModel.find()
      allImages.sort(() => Math.random() - 0.5)

      req.session.images = allImages
    }

    const image = req.session.images.shift()
    if (image === null || image === undefined) {
      req.session.destroy()
      res.redirect('./finnish')
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

  /**
   * The finnishpage.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async finnish (req, res) {
    res.render('game/finnish')
  }
}
