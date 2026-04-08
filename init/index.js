const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=> {
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
})
async function main() {
     await mongoose.connect(Mongo_url);
}

const initDB = async ()=>{
     await Listing.deleteMany({})
     initData = initData.data.map((obj) => ({
  ...obj,
  owner: "69d0e7e02d553e2b7b6ead51",
}));
     await Listing.insertMany(initData)
     console.log("database is initialized")
}
initDB();