const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    requierd: [true, "Please add number of Weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a turion cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add your Minimum Skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: [true, "Please add bootcamp"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

// Static method to get avgerage of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
          averageCost: Math.ceil(obj[0].averageCost/10) * 10
      })
  } catch (err) {
      console.log(err)
  }
};

// Call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});
// Call getAverageCost before remove
CourseSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

const Course = mongoose.model("Course", CourseSchema);
module.exports = Course;
