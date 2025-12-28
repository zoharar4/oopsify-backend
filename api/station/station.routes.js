import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getStations,getStationById,addStation,updateStation,removeStation} from './station.controller.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', log, getStations)
router.get('/:id', log, getStationById)
router.post('/', log, requireAuth, addStation)
router.put('/:id', requireAuth, updateStation) // zohar
router.delete('/:id', requireAuth, removeStation)
// router.delete('/:id', requireAuth, requireAdmin, removeStation)

// router.post('/:id/msg', requireAuth, addStationMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeStationMsg)

export const stationRoutes = router