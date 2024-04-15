/**
 * @file Defines the AdminController class.
 * @module AdminController
 * @author Anna Ståhlberg
 */
import { ImageModel } from '../models/ImageModel.js'
import fs from 'fs'

/**
 * Encapsulates a controller.
 */
export class AdminController {
  /**
  * Provide req.doc to the route if :id is present.
  *
  * @param {object} req - Express request object.
  * @param {object} res - Express response object.
  * @param {Function} next - Express next middleware function.
  * @param {string} id - The value of the id for the document to load.
  */
  async loadImageDocument (req, res, next, id) {
    try {
      // Get the image document.
      const imageDoc = await ImageModel.findById(id)

      // If the image document is not found, throw an error.
      if (!imageDoc) {
        const error = new Error('The image you requested does not exist.')
        error.status = 404
        throw error
      }

      // Provide the image document to req.
      req.doc = imageDoc

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing all images.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const images = await ImageModel.find({ })

      res.render('admin/index', { images })
    } catch (error) {
      next(error)
    }
  }

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
    res.render('admin/create')
  }

  /**
   * Returns a HTML form for deleting an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete (req, res) {
    try {
      res.render('admin/delete', { viewData: req.doc.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('admin/delete')
    }
  }

  /**
   * Deletes the specified image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async deletePost (req, res) {
    try {
      const image = await ImageModel.findById(req.body.id)
      fs.unlink(`${'./public/uploads/'}${image.fileName}`, (err) => {
        if (err) {
          console.error('Fel vid radering av fil:', err)
          return
        }
        console.log('Filen har raderats')
      })
      await req.doc.deleteOne()
      // req.session.flash = { type: 'success', text: 'The image was deleted successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('admin/delete')
    }
  }
}
