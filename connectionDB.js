const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set("strictQuery", false);
const mongoDBurl = process.env.DATABASE_URL;

main().catch((err) => console.log(err));
async function main(){
  await mongoose.connect(mongoDBurl);
  console.log('Connected to MongoDB database:', mongoose.connection.name);
}