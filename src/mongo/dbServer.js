const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// const uri = "mongodb+srv://read_only:RqlA48bU0soiVk5F@hdccluster.gyeyn.mongodb.net/HDCProd?retryWrites=true&w=majority";

const uri = 'mongodb+srv://trace_api:mSfqaBQVd7KXkx6l@hdccluster.gyeyn.mongodb.net/HDCProd';

// const uri = 'mongodb://localhost:27017/HDCProd';

mongoose
  .connect(uri, options)
  .then((client) => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
  });
