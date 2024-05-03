const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Class = require("../models/classModel");

router.post("/add-class",authMiddleware, async (req, res) => {
  try {
    let classData = await Class.findOne({
      classCode: req.body.classCode,
    });
    if (classData) {
      return res.status(409).send({
        message: "This class code is already in use.",
        success: false,
      });
    }
    const { classCode, classTitle, subjects } = req.body;
    const newClass = await Class.create({
      classCode: classCode,
      classTitle: classTitle,
      subjects:{
        subjectName: subjects.subjectName,
        subjectCode: subjects.subjectCode,
      },
    });
    res.status(200).send({
      message: "New class added successfully!",
      success: true,
      data: newClass,
    });
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
