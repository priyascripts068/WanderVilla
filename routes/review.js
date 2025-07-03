const express=require("express");
const router=express.Router({mergeParams: true});
const Review =require("../models/review");


//review
router.post("/", async(req,res)=>{
    let newlisting=await listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newlisting.reviews.push(newReview);
    await newlisting.save();
    await newReview.save();
    req.flash("success","New review created");
    res.redirect(`/listings/${newlisting._id}`);
})

router.delete("/:reviewId",async(req,res)=>{
    let {id , reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
});

module.exports=router;