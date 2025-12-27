import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import {  updateUserStation} from './station.controller.js'

const router = express.Router()

router.use(requireAuth)

// router.get('/', log, getCars)
// router.get('/:id', log, getCarById)
// router.post('/', log, requireAuth, addCar)
router.put('/:id', requireAuth, updateUserStation)
// router.delete('/:id', requireAuth, removeCar)
// router.delete('/:id', requireAuth, requireAdmin, removeCar)

// router.post('/:id/msg', requireAuth, addCarMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeCarMsg)

export const stationRoutes = router