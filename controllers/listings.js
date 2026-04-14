const Listing = require("../models/listing")

module.exports.index = async(req,res)=>{
  const allListings=  await Listing.find({}) 
  res.render("listings/index.ejs",{allListings});
}
module.exports.renderNewForm = (req,res)=>{
  console.log(req.user)
  res.render("listings/new.ejs") 
}
module.exports.showListing = async(req,res)=>{
  let {id} = req.params;
  const listing =   await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
    path:"author",
  },
})
  .populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exists!")
    return  res.redirect("/listings")
  }
  console.log(listing.lat, listing.lng);
  console.log(listing)
  res.render("listings/show.ejs",{listing})

}
module.exports.createListing = async (req, res) => {
  try {
    //  Check if image uploaded
    if (!req.file) {
      req.flash("error", "Image is required!");
      return res.redirect("/listings/new");
    }

    const { location, country } = req.body.listing;
    const url = req.file.path;
    const filename = req.file.filename;

    //  Geocode location
    let lat = null, lng = null;
    if (location && country) {
      const address = encodeURIComponent(`${location}, ${country}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`,
        { headers: {
  "User-Agent": "wanderlust-app (faiz.dev@demo.com)"
} }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      }
    }

    // Save listing
    const newListing = new Listing({
      ...req.body.listing,
      owner: req.user._id,
      image: { url, filename },
      lat,
      lng
    });

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings/new");
  }
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exists!")
    return  res.redirect("/listings")
  }
  res.render("listings/edit.ejs", { listing });
}
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    delete req.body.listing.image; // prevent postman hops

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    //  Update image if new file uploaded
    if (req.file) {
      const url = req.file.path;
      const filename = req.file.filename;
      listing.image = { url, filename };
    }

    // Update lat/lng if location/country changed
    const { location, country } = req.body.listing;
    if (location && country) {
      const address = encodeURIComponent(`${location}, ${country}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`,
         { headers: { "User-Agent": "MyAirbnbApp/1.0" } }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        listing.lat = parseFloat(data[0].lat);
        listing.lng = parseFloat(data[0].lon);
      }
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted!")
  res.redirect("/listings");
}
