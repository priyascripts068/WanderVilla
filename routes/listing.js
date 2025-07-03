const express=require("express");
const router = express.Router();
const listing=require("../models/listing");
const Review =require("../models/review");
const {isLoggedIn}=require("../middleware.js");

//index route
router.get("/",async (req,res)=>{
    const allListings= await listing.find({});
    res.render("listings/index",{allListings});
});
//New Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new");
});
//show route
router.get("/:id",async (req, res) => {
  try {
  const {id} = req.params;
  const foundListing = await listing.findById(id).populate("reviews").populate("owner");
        
  if(!foundListing) {
  req.flash("error", "Listing you requested for does not exist");
  return res.redirect("/listings");
  }
  res.render("listings/show", { listing: foundListing });
  } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
  }
    
});
//Create Route
router.post("/",isLoggedIn,async (req, res) => {
    try {
        let listingData = req.body.listing;
        const newListing = new listing(listingData);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to create listing");
        res.redirect("/listings");
    }
});
//Edit route
router.get("/:id/edit",isLoggedIn,async(req,res)=>{
    try {
        const { id } = req.params;
        const foundListing = await listing.findById(id);
        
        if (!foundListing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/edit", { listing: foundListing });
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("/listings");
    }
});

//Update Route
router.put("/:id",isLoggedIn, async (req, res) => {
  try {
        let { id } = req.params;
        await listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to update listing");
        res.redirect("/listings");
    }
});

//Delete Route
router.delete("/:id",isLoggedIn, async (req, res) => {
  try {
        let { id } = req.params;
        // First, find the listing to get its reviews
        const foundListing = await listing.findById(id);
        if (!foundListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        // Delete all associated reviews first
        if (foundListing.reviews && foundListing.reviews.length > 0) {
            await Review.deleteMany({ _id: { $in: foundListing.reviews } });
        }
        // Then delete the listing
        await listing.findByIdAndDelete(id);
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listings");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to delete listing");
        res.redirect("/listings");
    }
});

//review Route
router.post("/:id/review",isLoggedIn, async(req,res)=>{
  try{
    let newlisting=await listing.findById(req.params.id);
    if (!newlisting) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
    let newReview=new Review(req.body.review);
    newlisting.reviews.push(newReview);
    await newlisting.save();
    await newReview.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${newlisting._id}`);
  }catch(err){
    console.log(err);
    req.flash("error", "Failed to add review");
    res.redirect(`/listings/${req.params.id}`);
  }
    
})
//delete Review Route
router.delete("/:id/review/:reviewId",isLoggedIn,async(req,res)=>{
    try {
        let { id, reviewId } = req.params;
        // Remove review reference from listing
        await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        // Delete the review
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to delete review");
        res.redirect(`/listings/${id}`);
    }
});

module.exports=router;