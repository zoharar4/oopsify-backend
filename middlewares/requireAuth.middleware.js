import { config } from '../config/index.js'
import { logger } from '../services/logger.service.js'
import { asyncLocalStorage } from '../services/als.service.js'

export function requireAuth(req, res, next) {
	const { loggedinUser } = asyncLocalStorage.getStore()
	req.loggedinUser = loggedinUser

	if (config.isGuestMode && !loggedinUser) {
		req.loggedinUser = { _id: '', fullname: 'Guest' }
		return next()
	}
	if (!loggedinUser) return res.status(401).send('Not Authenticated')
	next()
}