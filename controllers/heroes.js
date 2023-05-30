import fs from 'fs';
import mongoose from 'mongoose';
import { Superhero } from '../models/Superhero.js';

export const createHero = async (req, res) => {
  try {
    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    } = req.body;
    let filenames = [];
    if (req.files) {
      filenames = req.files.map(file => file.filename);
    }

    const newHero = new Superhero({
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      Images: filenames,
    });
    console.log('files', req.files);
    const savedHero = await newHero.save();
    res.status(201).json(savedHero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getHeroes = async (req, res) => {
  try {
    const heroesList = await Superhero.find({});
    res.status(200).json(heroesList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
    const updatedData = {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    };

    const updatedHero = await Superhero.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedHero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    res.status(200).json(updatedHero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { files } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
    const superhero = await Superhero.findById(id);

    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    const uploadedImages = Array.isArray(files)
      ? files.map(file => file.filename)
      : [files.filename];

    superhero.Images = [...superhero.Images, ...uploadedImages];
    const updatedSuperhero = await superhero.save();

    res.status(200).json(updatedSuperhero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
    const superhero = await Superhero.findById(id);

    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    superhero.Images = superhero.Images.filter(img => img !== image);

    const imagePath = `public/assets/${image}`;
    fs.unlinkSync(imagePath);
    const updatedSuperhero = await superhero.save();

    res.status(200).json(updatedSuperhero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeSuperhero = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
    const superhero = await Superhero.findByIdAndRemove(id);

    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    superhero.Images.forEach(async image => {
      const imagePath = `public/assets/${image}`;
      fs.unlink(imagePath, err => {
        if (err) {
          console.error(err);
        }
      });
    });

    res.status(200).json({
      message: `Superhero ${superhero.nickname} removed successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
