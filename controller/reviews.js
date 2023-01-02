const ErrorRespose = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Reviews = require("../models/Reviews");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Reviews");

// @desc Get reviews
// @route GET /api/vi/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Reviews.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single review
// @route GET /api/vi/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorRespose(`No review found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: review });
});

// @desc Add review
// @route GET /api/vi/bootcamps/:bootcampId/reviews
// @access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorRespose(`No bootcamp with id of ${req.params.bootcampId}`, 404)
    );
  }
  const review = await Review.create(req.body);
  await review.save();
  res.status(201).json({ success: true, data: review });
});


// @desc Upadate review
// @route PUT /api/vi/review/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {

  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorRespose(`No review found with id of ${req.params.id}`, 404)
    );
  }
//Make sure Review is belongs to user or user is admin
 if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
  return next(new ErrorRespose(`Not authorize to update review up.reveiw`, 401 ))
 }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  await review.save();
  res.status(201).json({ success: true, data: review });
});
// @desc Delete review
// @route Delete /api/vi/review/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorRespose(`No review found with id of ${req.params.id}`, 404)
    );
  }
//Make sure Review is belongs to user or user is admin
 if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
  return next(new ErrorRespose(`Not authorize to update review up.reveiw`, 401 ))
 }
// to delete
 await review.remove()

  res.status(201).json({ success: true, data: 'Review Deleted' });
});
