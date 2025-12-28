import { logger } from '../../services/logger.service.js'
import { stationService } from './station.service.js'

export async function getStations(req, res) {
	try {
		console.log(req.stationsId)
		const filterBy = {
			stationsId:req?.stationsId
		}
		const stations = await stationService.query(filterBy)
		res.json(stations)
	} catch (err) {
		logger.error('Failed to get stations', err)
		res.status(400).send({ err: 'Failed to get stations' })
	}
}

export async function getStationById(req, res) {
	try {
		const carId = req.params.id
		const station = await stationService.getById(carId)
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


// export async function updateUserStation(req, res) { zohar?
// 	const { loggedinUser, body: station } = req
// 	console.log('req:',req)
// 	const { _id: userId, isAdmin } = loggedinUser

// 	if (!isAdmin && station.owner.id !== userId) {
// 		res.status(403).send('Not your station...')
// 		return
// 	}

// 	try {
// 		const updatedStation = await stationService.update(station, loggedinUser)
// 		res.json(updatedStation)
// 	} catch (err) {
// 		logger.error('Failed to update station', err)
// 		res.status(400).send({ err: 'Failed to update station' })
// 	}
// }

export async function updateStation(req, res) {
	const { loggedinUser, body: station } = req
	console.log('req:', req)
	const { _id: userId } = loggedinUser

	if (station.owner.id !== userId) {
		res.status(403).send('Not your station...')
		return
	}

	try {
		const updatedStation = await stationService.update(station, loggedinUser)
		res.json(updatedStation)
	} catch (err) {
		logger.error('Failed to update station', err)
		res.status(400).send({ err: 'Failed to update station' })
	}
}

export async function removeStation(req, res) {
	try {
		const carId = req.params.id
		const removedId = await stationService.remove(carId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove station', err)
		res.status(400).send({ err: 'Failed to remove station' })
	}
}

export async function addStationMsg(req, res) {
	const { loggedinUser } = req

	try {
		const carId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await stationService.addStationMsg(carId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to add station msg', err)
		res.status(400).send({ err: 'Failed to add station msg' })
	}
}

// export async function removeStationMsg(req, res) {
// 	try {
// 		const { id: carId, msgId } = req.params

// 		const removedId = await stationService.removeStationMsg(carId, msgId)
// 		res.send(removedId)
// 	} catch (err) {
// 		logger.error('Failed to remove station msg', err)
// 		res.status(400).send({ err: 'Failed to remove station msg' })
// 	}
// }
