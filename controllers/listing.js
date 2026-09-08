const Listing = require("../models/listing");

module.exports.index = async (req, res)=>{
        const allListing = await Listing.find({});
        res.render("listings/index", {allListing});
};

module.exports.renderNewForm = (req, res) =>{
     res.render("listings/new");
};

module.exports.createListing = async (req,res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url, 
        filename,
    };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.showListing = async(req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
        path :"reviews",
        populate: {
            path: "author",
        },
        })
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/lisitngs");
    }
    console.log("Owner:", listing.owner);
    console.log("User:", req.user);

    res.render("listings/show", {listing});
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/lisitngs");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit", {listing , originalImageUrl});

};

module.exports.updateListing = async (req, res) =>{
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {
        url, 
        filename,
    };
    await listing.save();
};
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) =>{
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};


