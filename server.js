import { app } from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
  })
  .catch(err => console.log(`${err}. Connection failed`));
