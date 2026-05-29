import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'

const questionAssignmentLogSchema = new mongoose.Schema({
  assignment_log_id: {
    type: String,
    default: randomUUID,
    immutable: true,
    unique: true,
    index: true,
  },
  question_id: {
    type: String,
    required: true,
    index: true,
  },
  resolver_id: {
    type: String,
    required: true,
    index: true,
  },
  assigned_by: {
    type: String,
    default: 'SYSTEM',
  },
  reason: {
    type: String,
    default: 'auto-unanswered-48h',
  },
  assigned_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    default: null,
  },
}, {
  timestamps: false,
  collection: 'question_assignment_logs',
})

questionAssignmentLogSchema.index({ assigned_at: -1 })
questionAssignmentLogSchema.index({ question_id: 1, assigned_at: -1 })

const QuestionAssignmentLog = mongoose.model('QuestionAssignmentLog', questionAssignmentLogSchema)

export default QuestionAssignmentLog
