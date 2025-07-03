const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review");

const listingschema= new schema({
   title : {
    type : String,
    required : true,
   },
   description : String,
   image: {
    filename: String,
    url: {
    type: String,
    set: (v) => v?.trim() === "" ? "https://cdn.pixabay.com/photo/2025/05/14/10/09/bridge-9599215_1280.jpg" : v,
    default: "https://cdn.pixabay.com/photo/2025/05/14/10/09/bridge-9599215_1280.jpg"
     },
   },
   price : Number,
   location : String,
   country : String,
   reviews:[
      {
         type:schema.Types.ObjectId,
         ref:"Review"
      }
   ],
   owner: {
         type:schema.Types.ObjectId,
         ref:"User"
   }
})
listingschema.post("findOneAndDelete",async(listing)=>{
   if(listing){
      await Review.deleteMany({_id :{ $in : listing.reviews}}); //to delete reviews as we delete the listing
   }
})
const listing= mongoose.model("listing",listingschema);

module.exports=listing;