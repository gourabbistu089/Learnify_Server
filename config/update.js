const mongoose = require('mongoose');
const Profile = require('../models/Profile');

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("Connected to DB");

  // Update all profiles by setting default values if fields don't exist
  const result = await Profile.updateMany(
    {},
    {
      $set: {
        github: "",
        twitter: "",
        website: "",
        linkedin: ""
      }
    }
  );

  console.log("Updated documents:", result.modifiedCount);
  mongoose.disconnect();
})
.catch(err => {
  console.error("DB connection error", err);
});
