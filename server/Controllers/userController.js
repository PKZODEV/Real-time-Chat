const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ message: "User with given email already exist..." });

    if (!name || !email || !password)
      return res.status(400).json({ message: "All Field Required..." });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ message: "Email must be a valid email..." });

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .json({ message: "Password must be a strong password..." });

    // if (user)
    //   return res.status(400).json({ message: "มีผู้ใช้นี้ในระบบแล้ว..." });

    // if (!name || !email || !password)
    //   return res
    //     .status(400)
    //     .json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง..." });

    // if (!validator.isEmail(email))
    //   return res.status(400).json({ message: "รูปแบบ Email ไม่ถูกต้อง..." });

    // if (!validator.isStrongPassword(password))
    //   return res
    //     .status(400)
    //     .json({ message: "รหัสผ่านจะต้องเป็นรหัสผ่านที่รัดกุม..." });

    user = new userModel({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("Invalid email or password...");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json("Invalid email or password...");

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {}
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
