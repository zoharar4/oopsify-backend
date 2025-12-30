import express from 'express'
import multer from 'multer'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { getStations,getStationById,addStation,updateStation,removeStation,addTrack,removeTrack} from './station.controller.js'


const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

const router = express.Router()

// router.use(requireAuth)

router.get('/', log, getStations)
router.get('/:id', log, getStationById)
router.post('/', log, requireAuth, addStation)
router.put('/:id', requireAuth,upload.single('image'), updateStation) //
router.delete('/:id', requireAuth, removeStation)
// router.post('/:id/msg', requireAuth, addStationMsg)
router.post('/:id/track',requireAuth,addTrack)
router.delete('/:stationId/:trackId',requireAuth,removeTrack)
// 
// router.delete('/:id/msg/:msgId', requireAuth, removeStationMsg)

export const stationRoutes = router