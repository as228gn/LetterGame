/**
 * @file The starting point of the application.
 * @module src/server
 * @author Anna Ståhlberg
 * @version 1.0.0
 */

import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import logger from 'morgan'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectToDatabase } from './config/mongoose.js'
import { router } from './routes/router.js'

// Connect to MongoDB.
await connectToDatabase(process.env.DB_CONNECTION_STRING)

// Get the path of the current module's directory.
const directoryFullName = dirname(fileURLToPath(import.meta.url))

// Set the base URL to use for all relative URLs in a document.
const baseURL = process.env.BASE_URL || '/'

// Create Express application.
const app = express()

// Set up a morgan logger using the dev format for log entries.
app.use(logger('dev'))

// View engine setup.
app.set('view engine', 'ejs')
app.set('views', join(directoryFullName, 'views'))
app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
app.set('layout extractScripts', true)
app.set('layout extractStyles', true)
app.use(expressLayouts)

// Parse requests of the content type application/x-www-form-urlencoded.
// Populates the request object with a body object (req.body).
app.use(express.urlencoded({ extended: false }))

// Serve static files.
app.use(express.static(join(directoryFullName, '..', 'public')))

// Middleware to be executed before the routes.
app.use((req, res, next) => {
  // Pass the base URL to the views.
  res.locals.baseURL = baseURL

  next()
})

// Register routes.
app.use('/', router)

// Error handler.
app.use((err, req, res, next) => {
  console.error(err)

  res
    .status(err.status || 500)
    .send(err.message || 'Internal Server Error')
})

// Starts the HTTP server listening for connections.
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${server.address().port}`)
  console.log('Press Ctrl-C to terminate...')
})
