const userModel = require("../Models/userModel"); // Interact with database
const bcrypt = require("bcrypt"); // En-code password and compare
const validator = require("validator"); // Check-valid of Email and password
const jwt = require("jsonwebtoken"); // Create and valid token

// Create token
const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" }); // Create token available for 3 days
}

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
    
        let user = await userModel.findOne({ email });
    
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) { 
            return res.status(400).json({ message: "Invalid email" });
        }
        
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Password not strong enough" });
        }

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
    
        user = new userModel({
            name, email, password
        })
    
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
    
        await user.save();
    
        const token = createToken(user._id);
    
        res.status(200).json({ _id: user._id, name, email, token });

    } catch(err) {
        console.log(err);
        res.status(500).json({ err });
    }

};

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}

const getUsers = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.find();

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}

module.exports = { registerUser, loginUser, findUser, getUsers };