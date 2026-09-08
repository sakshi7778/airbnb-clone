
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    
    // image:{
    //     type: String,
    //     default: " https://unsplash.com/photos/green-trees-beside-river-during-daytime-_aW8L26IEC8",
    //     set: (v) => v === ""
    //             ? "https://unsplash.com/photos/green-trees-beside-river-during-daytime-_aW8L26IEC8"
    //     :v,
    // },


    image: {
            
            filename: String,
            url : String,
    },
    
    price:{
        type: Number,

    },
    location:{
        type: String,
    },
    country:{
        type: String,
    },

    reviews:[
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({ _id:{$in:  listing.reviews }});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;











