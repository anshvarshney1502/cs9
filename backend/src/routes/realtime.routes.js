import { Router } from 'express'
import { sseHandler } from '../services/sse.service.js'
import { checkRole, verifyToken } from '../middleware/authMiddleware.js'

const router = Router()

// Only authenticated users can connect to the realtime update stream
router.get('/stream', verifyToken, checkRole('USER', 'RESOLVER', 'ADMIN'), sseHandler)

export default router
