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

async function getById(carId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(carId) }

		const collection = await dbService.getCollection('station')
		const station = await collection.findOne(criteria)

		station.createdAt = station._id.getTimestamp()
		return station
	} catch (err) {
		logger.error(`while finding station ${carId}`, err)
		throw err
	}
}

async function remove(carId) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	const { _id: ownerId, isAdmin } = loggedinUser

	try {
		const criteria = {
			_id: ObjectId.createFromHexString(carId),
		}
		if (!isAdmin) criteria['owner._id'] = ownerId

		const collection = await dbService.getCollection('station')
		const res = await collection.deleteOne(criteria)

		if (res.deletedCount === 0) throw ('Not your station')
		return carId
	} catch (err) {
		logger.error(`cannot remove station ${carId}`, err)
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

async function update(station, loggedinUser) {

	try {
		const collection = await dbService.getCollection('user')
		const userObjectId = ObjectId.createFromHexString(loggedinUser._id)

		if (station.id === 'liked-tracks') {
			await collection.updateOne({ _id: userObjectId }, { $set: { likedTracks: station } })
		} else {
			await collection.updateOne({ _id: userObjectId, 'stations.id': station.id }, { $set: { 'stations.$': station } })
		}

		const updatedUser = await collection.findOne({_id :userObjectId})
		return updatedUser
	} catch (err) {
		logger.error(`cannot update station ${station.id}`, err)
		throw err
	}
}

async function addStationMsg(carId, msg) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(carId) }
		msg.id = makeId()

		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add station msg ${carId}`, err)
		throw err
	}
}

async function removeStationMsg(carId, msgId) {
	try {
		const criteria = { _id: ObjectId.createFromHexString(carId) }

		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

		return msgId
	} catch (err) {
		logger.error(`cannot remove station msg ${carId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	console.log('criteria',filterBy)
	const criteria = {
		_id: {$in: filterBy.stationsId.map((_id) => _id)}
	}

	return criteria
}
