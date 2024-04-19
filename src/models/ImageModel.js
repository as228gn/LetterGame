/**
 * @file Defines the image model.
 * @module ImageModel
 * @author Anna Ståhlberg
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  correctAnswer: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  imageUrl: {
    type: String,
    required: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ImageModel = mongoose.model('Image', schema)
