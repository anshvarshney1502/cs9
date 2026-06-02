// Active SSE client connections: userId -> Array of HTTP response streams
const activeConnections = new Map()

/**
 * Add a new client connection
 */
export function addClient(userId, res) {
  if (!activeConnections.has(userId)) {
    activeConnections.set(userId, [])
  }
  activeConnections.get(userId).push(res)
}

/**
 * Remove a client connection
 */
export function removeClient(userId, res) {
  const userConns = activeConnections.get(userId)
  if (userConns) {
    const index = userConns.indexOf(res)
    if (index !== -1) {
      userConns.splice(index, 1)
    }
    if (userConns.length === 0) {
      activeConnections.delete(userId)
    }
  }
}

/**
 * Send an event to a specific user
 */
export function sendToUser(userId, eventName, data) {
  const userConns = activeConnections.get(userId)
  if (userConns) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
    for (const res of userConns) {
      res.write(payload)
    }
  }
}

/**
 * Send an event to all connected users
 */
export function sendToAll(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
  for (const conns of activeConnections.values()) {
    for (const res of conns) {
      res.write(payload)
    }
  }
}

/**
 * SSE controller to handle connection registration
 */
export function sseHandler(req, res) {
  console.log('[SSE] Connection request received, user:', req.user?.userId)
  const userId = req.user?.userId
  if (!userId) {
    console.log('[SSE] Connection rejected: unauthorized')
    res.status(401).end()
    return
  }

  // Set headers for SSE stream
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Disable Nginx buffering
  res.flushHeaders()

  // Send initial establish comment to keep the connection alive
  res.write(': ok\n\n')

  // Register client
  addClient(userId, res)

  // Keep-alive ping interval (every 30s)
  const pingInterval = setInterval(() => {
    res.write(': ping\n\n')
  }, 30000)

  // Cleanup on connection close
  req.on('close', () => {
    clearInterval(pingInterval)
    removeClient(userId, res)
  })
}
