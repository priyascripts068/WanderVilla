const mongoose=require("mongoose");
const initdata=require("./data");
const listing=require("../models/listing");
const User=require("../models/user");

const MONGO_URL="mongodb://localhost:27017/wanderVilla";
main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDb=async()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj, owner: new mongoose.Types.ObjectId("6865708a5c7894c9dfe9c2ff")}));
    await listing.insertMany(initdata.data);
    console.log("data was initialised");
}

initDb();