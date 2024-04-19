/**
 * @file Defines the admin router.
 * @module adminRouter
 * @author Anna Ståhlberg
 */
// src/routes/snippetRouter.js
import express from 'express'
import { AdminController } from '../controllers/AdminController.js'
// import { upload } from '../config/multerConfig.js'
import multer from 'multer'

const inMemoryStorage = multer.memoryStorage()
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image')

export const router = express.Router()

const controller = new AdminController()

// Provide req.doc to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadImageDocument(req, res, next, id))

router.get('/', controller.authorize, (req, res, next) => controller.findAll(req, res, next))

router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', (req, res, next) => controller.postLogin(req, res, next))

router.get('/create', controller.authorize, controller.create)
router.post('/create', controller.authorize, uploadStrategy, controller.postCreate)

router.get('/:id/delete', controller.delete)
router.post('/:id/delete', controller.deletePost)
