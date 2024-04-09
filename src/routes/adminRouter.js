/**
 * @file Defines the admin router.
 * @module adminRouter
 * @author Anna Ståhlberg
 */
// src/routes/snippetRouter.js
import express from 'express'
import { AdminController } from '../controllers/AdminController.js'
import { upload } from '../config/multerConfig.js'

export const router = express.Router()

const controller = new AdminController()

router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/create', controller.create)
router.post('/create', upload.single('image'), controller.postCreate)
