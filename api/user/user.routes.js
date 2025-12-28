import express from 'express'

import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

import { getUser, updateUser } from './user.controller.js'

const router = express.Router()

router.get('/:id', getUser)
router.put('/:id', requireAuth, updateUser)

export const userRoutes = router