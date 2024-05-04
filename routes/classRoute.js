const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Class = require("../models/classModel");

router.post("/add-class", async (req, res) => {
  try {
    const { classCode, classTitle, subjects } = req.body;

    let classData = await Class.findOne({ classCode: classCode });

    if (classData) {
      // If class exists, add new subject
      const updatedClass = await Class.findOneAndUpdate(
        { classCode: classCode },
        { $push: { subjects: subjects } },
        { new: true }
      );
      res.status(200).send({
        message: "Subject added to existing class successfully!",
        success: true,
        data: updatedClass,
      });
    } else {
      // If class doesn't exist, create new class
      const newClass = await Class.create({
        classCode: classCode,
        classTitle: classTitle,
        subjects: [subjects], // Note: subjects should be an array
      });
      res.status(200).send({
        message: "New class added successfully!",
        success: true,
        data: newClass,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/get-all-classes", async (req, res) => {
  try {
    const classes = await Class.find().sort([["createdAt", "descending"]]);
    if (!classes) {
      res.status(404).json({
        message: "Faild to fetched Classes",
        success: false,
      });
    }
    res.status(200).json({
      message: "Classes fetched successfully!",
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
      success: false,
    });
  }
});
router.post("/delete-class/:id", authMiddleware, async (req, res) => {
  try {
    // Assuming `Class` is your model name
    const foundClass = await Class.findByIdAndDelete(req.params.id);
    if (!foundClass) {
      return res.status(404).json({
        message: "Class not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Class deleted successfully",
      success: true,
      data: foundClass, // Optionally, you can include the deleted class data in the response
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
