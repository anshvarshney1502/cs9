import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'
import connectDB from '../../config/db.js'
import QuestionAssignmentLog from '../../models/question-assignment-log.model.js'

const apply = process.argv.includes('--apply')
const dryRun = !apply

const stats = {
  mode: dryRun ? 'dry-run' : 'apply',
  scannedMissingIds: 0,
  wouldUpdate: 0,
  updated: 0,
}

try {
  await connectDB()

  const filter = { assignment_log_id: { $exists: false } }
  const cursor = QuestionAssignmentLog.collection.find(
    filter,
    { projection: { _id: 1 } },
  )

  for await (const log of cursor) {
    stats.scannedMissingIds += 1

    if (dryRun) {
      stats.wouldUpdate += 1
      continue
    }

    const result = await QuestionAssignmentLog.collection.updateOne(
      { _id: log._id, assignment_log_id: { $exists: false } },
      { $set: { assignment_log_id: randomUUID() } },
    )
    stats.updated += result.modifiedCount
  }

  console.log(JSON.stringify(stats, null, 2))
} finally {
  await mongoose.disconnect()
}
