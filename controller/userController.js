// const User = require("../model/userModel");
// const { sendEmail } = require("../utils/sendMail");

// const user = async (req, res) => {
//   const { email, mobile, address, firstName, lastName, passes } = req.body;

//   try {
//     // Save user details to the database
//     const newUser = new User({
//       email,
//       mobile,
//       address,
//       firstName,
//       lastName,
//       passes,
//     });

//     await newUser.save(); 

//     const id = newUser._id;

//     const dummyLink = `http://192.168.29.219:3000/admin/${id}`;

//     await sendEmail(email, firstName, lastName, passes, id);

//     res.status(201).json({ success: true, data: newUser, link: dummyLink });
//   } catch (error) {
//     console.error("Error saving user or sending email:", error);
//     res.status(400).json({ error: error.message, success: false });
//   }
// };

// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getUser = async (req, res) => {
//   const { id } = req.params;

//   try {
  
//     const user = await User.findOne({ _id: id });

//     if (!user) {
//       return res.status(400).json({ success: false, message: "User Not Found!" });
//     }

//     return res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// module.exports = { user, getUsers, getUser };
