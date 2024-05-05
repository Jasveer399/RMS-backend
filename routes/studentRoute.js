const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");

// router.post("/register", async (req, res) => {
//   try {
//     const { name, rollno, password, email } = await req.body;
//     const studentExists = await Student.findOne({
//       rollNo: rollno,
//     });
//     if (studentExists) {
//       return res.status(200).send({
//         message: "This roll number is already registered",
//         success: false,
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newStudent = new Student({
//       name: name,
//       rollNo: rollno,
//       password: hashedPassword,
//       email: email,
//     });
//     await newStudent.save();
//     res.status(200).send({
//       message: "Registration successful, Please wait for admin approval",
//       success: true,
//     });
//   } catch (error) {
//     console.log("An error occurred while saving the registration");
//     res.status(500).send({
//       message: error.message,
//       succes: false,
//       status: 500,
//     });
//   }
// });

router.post("/add-student", async (req, res) => {
  try {
    const { name, rollNo, email, password } = req.body;
    const studentExists = await Student.findOne({
      rollNo: req.body.rollNo,
    });
    if (studentExists) {
      return res.status(200).send({
        message: "Student already exists",
        success: false,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
      const newStudent = await Student.create({
        name: name,
        rollNo: rollNo,
        email: email,
        password: password,
      });
      res.status(200).send({
        message: "Student added successfully",
        success: true,
        data: newStudent,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      succes: false,
    });
  }
});

// get all students
router.post("/get-all-students", authMiddleware, async (req, res) => {
  try {
    const students = await Student.find(req?.body ? req.body : {});
    res.status(200).send({
      message: "Students fetched successfully",
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).send({
      message: "Faild to fetched Students",
      success: false,
    });
  }
});

router.post("/get-student/:rollNo", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({
      rollNo: req.params.rollNo,
    });
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student fetched successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// update student
router.post("/update-student/:rollNo", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNo: req.params.rollNo },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student updated successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// delete student
router.post("/delete-student/:rollNo", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      rollNo: req.params.rollNo,
    });
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student deleted successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/studentlogin", async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { rollNo: req.body.rollNo },
    });
    student ? console.log(0) : console.log(1);
    if (!student) {
      return res.status(401).send({
        message: "Incorrect Student Roll No",
        success: false,
      });
    }
    const isMatch = bcrypt.compare(req.body.password, student.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid password",
        success: false,
      });
    }
    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    // console.log(token);
    res.status(200).send({
      message: "Login successful",
      success: true,
      data: token, // Sending token and student ID in response
    });
  } catch (error) {
    res.status(500).send({
      message: error.error,
      success: false,
    });
  }
});

module.exports = router;
