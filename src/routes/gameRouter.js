/**
 * @file Defines the game router.
 * @module gameRouter
 * @author Anna Ståhlberg
 */
// src/routes/gameRouter.js
import express from 'express'
import { GameController } from '../controllers/GameController.js'

export const router = express.Router()

const controller = new GameController()

router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/game/play', (req, res, next) => controller.getRandomImage(req, res, next))
router.post('/game/play', (req, res, next) => controller.getRandomImage(req, res, next))
