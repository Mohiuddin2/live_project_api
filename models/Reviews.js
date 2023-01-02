const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the Review"],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, "Please add a text"],
  },
  rating: {
    type: Number,
    min:1,
    max: 10,
    requierd: [true, "Please add a rating 1 to 10"],
  },
  createdAt:{
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true},
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

// One user can submit one review
// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});

// Static method to get avgerage of rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
          averageRating: obj[0].averageRating
      })
  } catch (err) {
      console.log(err)
  }
};

// Call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});
// Call getAverageRating before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});



const Review = mongoose.model('Review', ReviewSchema)
module.exports = Review;
