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
  async index(req, res) {
    res.render('game/index')
  }

  async getRandomImage(req, res) {
    const randomImage = await ImageModel.aggregate([{ $sample: { size: 1 } }])
    const fileName = randomImage[0].fileName
    console.log(fileName)
    res.render('game/play', { fileName })
  }
}