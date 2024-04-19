/**
 * @file Defines the AdminController class.
 * @module AdminController
 * @author Anna Ståhlberg
 */
import { ImageModel } from '../models/ImageModel.js'
import fs from 'fs'
import { BlockBlobClient } from '@azure/storage-blob'
import getStream from 'into-stream'

/**
 * Encapsulates a controller.
 */
export class AdminController {

  /**
  * Returns a HTML form for login.
  *
  * @param {object} req - Express request object.
  * @param {object} res - Express response object.
  */
  async login(req, res) {
    res.render('admin/login')
  }

  /**
   * Function that login a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async postLogin (req, res, next) {
    try {
      if (req.body.username === process.env.USER_NAME && req.body.password === process.env.PASS_WORD) {
        req.session.username = req.body.username
        res.redirect('/admin')
      } else {
        const error = new Error('Not Found')
        error.status = 404
        throw error
      }
    } catch (error) {
      req.session.flash = { type: 'danger', text: 'Wrong password or username' }
      res.redirect('./login')
    }
  }

  /**
   * Function for authorisation.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorize (req, res, next) {
    try {
      if (req.session.username) {
        next()
      } else {
        const error = new Error('Not found')
        error.status = 404
        throw error
      }
    } catch (error) {
      next(error)
    }
  }

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
  async findAll(req, res, next) {
    try {
      const images = await ImageModel.find({})

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

  /* async handleError(err, res) {
    res.status(500)
    res.render('error', { error: err })
  } */

  async postCreate(req, res) {
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME
    const identifier = Math.random().toString().replace(/0\./, '')
    const blobName = `${identifier}-${req.file.originalname}`
    const blobService = new BlockBlobClient(process.env.AZURE_STORAGE_CONNECTION_STRING, containerName, blobName)

    const stream = getStream(req.file.buffer)
    const streamLength = req.file.buffer.length

    const blobOptions = { blobHTTPHeaders: { blobContentType: 'image/png' } }

    const hostName = 'https://lettergamestorage.blob.core.windows.net'
    const imageUrl = `${hostName}/${containerName}/${blobName}`

    blobService.uploadStream(stream, streamLength, 5, blobOptions)
      .then(
        () => {
          const correctAnswer = req.body.correctAnswer

          ImageModel.create({
            correctAnswer,
            imageUrl
          })
          res.render('admin/create', {
            message: 'File uploaded to Azure Blob storage.'
          })
        }
      ).catch(
        (err) => {
          /* if (err) {
            handleError(err);
            return;
          } */
          console.log(err)
        })
  }

  /**
   * Returns a HTML form for deleting an image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async delete(req, res) {
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
  async deletePost(req, res) {
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
