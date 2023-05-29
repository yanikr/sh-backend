import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    real_name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    origin_description: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    superpowers: {
      type: String,
      required: true,
      min: 5,
    },
    catch_phrase: {
      type: String,
      default: '',
    },
    Images: {
      type: Array,
      default: [],
    },
  },
  { versionKey: false }
);

export const Superhero = mongoose.model('Superhero', schema, 'superheroes');
