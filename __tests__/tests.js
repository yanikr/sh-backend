import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../app.js';
import { Superhero } from '../models/Superhero.js';
import dotenv from 'dotenv';
dotenv.config();

describe('Superhero API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Superhero.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('POST /create', () => {
    it('should create a new superhero', async () => {
      const superheroData = {
        nickname: 'Test Hero',
        real_name: 'Test Name',
        origin_description: 'Test description',
        superpowers: 'Test superpowers',
        catch_phrase: 'Test phrase',
      };

      const response = await request(app)
        .post('/create')
        .send(superheroData)
        .expect(201);

      const savedHero = await Superhero.findById(response.body._id);
      expect(savedHero).toBeTruthy();
      expect(savedHero.nickname).toBe(superheroData.nickname);
      expect(savedHero.real_name).toBe(superheroData.real_name);
      expect(savedHero.origin_description).toBe(
        superheroData.origin_description
      );
      expect(savedHero.superpowers).toBe(superheroData.superpowers);
      expect(savedHero.catch_phrase).toBe(superheroData.catch_phrase);
    });
  });

  describe('PATCH /:id', () => {
    it('should update an existing superhero', async () => {
      const superhero = new Superhero({
        nickname: 'Test Hero',
        real_name: 'Test Name',
        origin_description: 'Test description',
        superpowers: 'Test superpowers',
        catch_phrase: 'Test phrase',
      });

      await superhero.save();

      const updatedData = {
        nickname: 'Hero Test',
        real_name: 'Name Test',
        origin_description: 'Description Test',
        superpowers: 'Superpowers Test',
        catch_phrase: 'Phrase Test',
      };

      const response = await request(app)
        .patch(`/${superhero._id}`)
        .send(updatedData)
        .expect(200);

      const updatedHero = await Superhero.findById(superhero._id);
      expect(updatedHero.nickname).toBe(updatedData.nickname);
      expect(updatedHero.real_name).toBe(updatedData.real_name);
      expect(updatedHero.origin_description).toBe(
        updatedData.origin_description
      );
      expect(updatedHero.superpowers).toBe(updatedData.superpowers);
      expect(updatedHero.catch_phrase).toBe(updatedData.catch_phrase);
    });
    it('should return 404 if superhero does not exist', async () => {
      const updatedData = {
        nickname: 'Hero Test',
        real_name: 'Name Test',
        origin_description: 'Description Test',
        superpowers: 'Superpowers Test',
        catch_phrase: 'Phrase Test',
      };

      const response = await request(app)
        .patch('/nonexistentid')
        .send(updatedData)
        .expect(404);
    });
  });
  describe('DELETE /:id', () => {
    it('should remove an existing superhero', async () => {
      const superhero = new Superhero({
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'Krypton',
        superpowers: 'Flight, Super strength, Heat vision',
        catch_phrase: 'Up, up and away!',
        Images: ['image1.jpg', 'image2.jpg'],
      });

      await superhero.save();
      const response = await request(app)
        .delete(`/${superhero._id.toString()}`)
        .expect(200);

      const removedHero = await Superhero.findById(superhero._id);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        `Superhero ${superhero.nickname} removed successfully`
      );
      expect(removedHero).toBeNull();
    });

    it('should return 404 if superhero does not exist', async () => {
      const response = await request(app).delete('/nonexistentid').expect(404);
    });
  });
});
