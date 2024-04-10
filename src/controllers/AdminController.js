/**
 * @file Defines the AdminController class.
 * @module AdminController
 * @author Anna Ståhlberg
 */
import { ImageModel } from '../models/ImageModel.js'
/**
 * Encapsulates a controller.
 */
export class AdminController {
  async index(req, res) {
    res.render('admin/index')
  }

  async create(req, res) {
    res.render('admin/create')
  }

  async postCreate(req, res) {
    const correctAnswer = req.body.correctAnswer
    const fileName = req.file.filename

    await ImageModel.create({
      correctAnswer,
      fileName
    })
    console.log(req.file.path)
    console.log(req.body.correctAnswer)
    res.render('admin/create')
  }
}
