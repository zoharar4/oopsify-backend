import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const stationService = {
	remove,
	query,
	getById,
	add,
	update,
	addStationMsg,
	removeStationMsg,
}

async function query(filterBy = null) {
	try {
		const criteria = filterBy && filterBy.stationsId ? _buildCriteria(filterBy) : {}

		const collection = await dbService.getCollection('station')
		var stationCursor = await collection.find(criteria)

		const stations = stationCursor.toArray()
		
		return stations
	} catch (err) {
		logger.error('cannot find stations', err)
		throw err
	}
}

async function getById(stationId) {
	console.log(stationId)
	try {
		const criteria = {
			_id: ObjectId.createFromHexString(stationId),
		}
		const collection = await dbService.getCollection('station')
		const station = await collection.findOne(criteria)

		//station.createdAt = station._id.getTimestamp()
		return station
	} catch (err) {
		logger.error(`while finding station ${stationId}`, err)
		throw err
	}
}

async function remove(stationId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(stationId),
		}
		criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection('station')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your station')
		return stationId
	} catch (err) {
		logger.error(`cannot remove station ${stationId}`, err)
		throw err
	}
}

async function add(station) {
	try {
		const collection = await dbService.getCollection('station')
		await collection.insertOne(station)

		return station
	} catch (err) {
		logger.error('cannot insert station', err)
		throw err
	}
}

// async function update(station, loggedinUser) {

// 	try {
// 		const collection = await dbService.getCollection('user')
// 		const userObjectId = ObjectId.createFromHexString(loggedinUser._id)

// 		if (station.id === 'liked-tracks') {
// 			await collection.updateOne({ _id: userObjectId }, { $set: { likedTracks: station } })
// 		} else {
// 			await collection.updateOne({ _id: userObjectId, 'stations.id': station.id }, { $set: { 'stations.$': station.id } })
// 		}

// 		const updatedUser = await collection.findOne({_id :userObjectId})
// 		return updatedUser
// 	} catch (err) {
// 		logger.error(`cannot update station ${station.id}`, err)
// 		throw err
// 	}
// }

async function update(station) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(station._id)}
        const stationToSave = {
			tracks: station.tracks,
			name: station.name,
			description: station.description,
			images: station.images
        }
		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, {$set: stationToSave })
		return { ...stationToSave, _id: station._id }
	}
	catch (err) {
		logger.error(`cannot update station ${station._id}`, err)
		throw err
	}
}

async function addStationMsg(stationId, msg) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(stationId) }
		msg.id = makeId()

		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	}  catch (err) {
		logger.error(`cannot add station msg ${stationId}`, err)
		throw err
	}
}

async function removeStationMsg(stationId, msgId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(stationId) }

		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

		return msgId
	} catch (err) {
		logger.error(`cannot remove station msg ${stationId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	console.log(filterBy)
	const criteria = {
		_id: {$in: filterBy.stationsId.map((_id) => ObjectId.createFromHexString(_id))}
	}

	return criteria
}
