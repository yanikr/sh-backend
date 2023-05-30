import fs from 'fs';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import { Superhero } from '../models/Superhero.js';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

export const createHero = async (req, res) => {
  try {
    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
    } = req.body;
    const files = req.files;
    const uploadedImages = [];
    for (const file of files) {
      const base64String = file.buffer.toString('base64');

      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64String}`,
        {
          folder: 'superheroes', // Specify the folder in Cloudinary where you want to store the images
        }
      );

      uploadedImages.push(uploadResult.secure_url);
    }

    const newHero = new Superhero({
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      Images: uploadedImages,
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

export const getHeroById = async (req, res) => {
  try {
    const { id } = req.params;
    const hero = await Superhero.findById(id);
    if (!hero) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(hero);
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
    console.log(files);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
    const superhero = await Superhero.findById(id);

    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    const uploadedImages = [];

    for (const file of files) {
      const base64String = file.buffer.toString('base64');

      const uploadResult = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${base64String}`,
        {
          folder: 'superheroes', // Specify the folder in Cloudinary where you want to store the images
        }
      );

      uploadedImages.push(uploadResult.secure_url);
    }

    superhero.Images.push(...uploadedImages);
    const updatedSuperhero = await superhero.save();

    res.status(200).json(updatedSuperhero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeImages = async (req, res) => {
  const getPublicIdFromUrl = url => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    return publicId;
  };
  try {
    const { id } = req.params;
    const { Images } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Superhero not found' });
    }
    const superhero = await Superhero.findById(id);

    if (!superhero) {
      return res.status(404).json({ error: 'Superhero not found' });
    }

    const deletedImages = [];

    for (const image of Images) {
      const imageIndex = superhero.Images.findIndex(img =>
        img.startsWith(image)
      );

      if (imageIndex !== -1) {
        const deletedImage = superhero.Images[imageIndex];
        deletedImages.push(deletedImage);
        await cloudinary.uploader.destroy(getPublicIdFromUrl(deletedImage));
      }
    }

    superhero.Images = superhero.Images.filter(
      img => !deletedImages.includes(img)
    );
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
      try {
        const result = await cloudinary.uploader.destroy(image);
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    });

    res.status(200).json({
      message: `Superhero ${superhero.nickname} removed successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
