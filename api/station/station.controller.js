import { logger } from '../../services/logger.service.js'
import { stationService } from './station.service.js'
import { uploadStationImage } from '../services/cloudinary.service.js'

export async function getStations(req, res) {
	try {
		const {filterBy} = req.query
		const stations = await stationService.query(filterBy)
		res.json(stations)
	} catch (err) {
		logger.error('Failed to get stations', err)
		res.status(400).send({ err: 'Failed to get stations' })
	}
}

export async function getStationById(req, res) {
	try {
		const stationId = req.params.id
		const station = await stationService.getById(stationId)
		res.json(station)
	} catch (err) {
		logger.error('Failed to get station', err)
		res.status(400).send({ err: 'Failed to get station' })
	}
}

export async function addStation(req, res) {
	const { loggedinUser, body } = req
	const stationToSave = {// use _id from now
		description: body.description,
		images: body.images?.length
			? body.images.map(img => ({ ...img }))
			: [{ url: '/src/assets/images/default-img.png' }],
		name: body.name,
		tracks: body.tracks ? [...body.tracks] : [],
	}
	try {
		stationToSave.owner = loggedinUser
		const addedStation = await stationService.add(stationToSave)
		res.json(addedStation)
	} catch (err) {
		logger.error('Failed to add station', err)
		res.status(400).send({ err: 'Failed to add station' })
	}
}

export async function updateStation(req, res) {
    try {
        const { loggedinUser, body, file } = req
        const { _id: userId } = loggedinUser
		console.log(body)
        const station = await stationService.getById(req.params.id)
        if (!station) return res.status(404).send('Station not found')
        if (station.owner._id !== userId) {
            return res.status(403).send('Not your station...')
        }

        station.name = body.name ?? station.name
        station.description = body.description ?? station.description
		station.tracks = body.tracks ?? station.tracks
        if (file) {
            const uploadRes = await uploadStationImage(file.buffer,station._id)
            station.images = [{ url: uploadRes.secure_url }]
        }

        const updatedStation = await stationService.update(station)
        res.json(updatedStation)
    } catch (err) {
        logger.error('Failed to update station', err)
        res.status(400).send({ err: 'Failed to update station' })
    }
}

export async function removeStation(req, res) {
	try {
		const stationId = req.params.id
		const removedId = await stationService.remove(stationId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove station', err)
		res.status(400).send({ err: 'Failed to remove station' })
	}
}

export async function addStationMsg(req, res) {
	const { loggedinUser } = req

	try {
		const stationId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await stationService.addStationMsg(stationId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to add station msg', err)
		res.status(400).send({ err: 'Failed to add station msg' })
	}
}

export async function addTrack(req, res) {
    try {
        const stationId = req.params.id
        const track = req.body 
		
        const updatedStation = await stationService.addTrack(stationId, track)
        res.json(updatedStation)
    } catch (err) {
        logger.error('Failed to add track to station', err)
        res.status(400).send({ err: 'Failed to add track to station' })
    }
}

export async function removeTrack(req, res) {
	try {
		const { stationId, trackId } = req.params

		const removedId = await stationService.removeTrack(stationId, trackId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to add track to station', err)
		res.status(400).send({ err: 'Failed to add track to station' })
	}
}