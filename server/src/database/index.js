import 'dotenv/config';
import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose
      .connect(
        process.env.NODE_ENV === 'production'
          ? process.env.MONGO_URL_PROD
          : process.env.MONGO_URL_DEV,
        {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log('Success to connect with Mongo');
      })
      .catch((e) => console.log(e));
  }
}

export default new Database();
