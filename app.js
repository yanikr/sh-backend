import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  addImage,
  createHero,
  getHeroById,
  getHeroes,
  removeImages,
  removeSuperhero,
  updateHero,
} from './controllers/heroes.js';
import { uploadMiddleware } from './middlewares/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(express.json());
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.post('/create', uploadMiddleware, createHero);
app.get('/superheroes', getHeroes);
app.get('/:id', getHeroById);
app.patch('/:id', updateHero);
app.delete('/:id', removeSuperhero);
app.post('/:id/add-images', uploadMiddleware, addImage);
app.patch('/:id/remove-images', removeImages);
