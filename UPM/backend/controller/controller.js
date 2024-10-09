const User = require('../models/model'); // Ensure this path is correct
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(`User name is ${username}`);
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("User not found. Please register.");
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).send("Password does not match");

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const registerUser = async (req, res) => {
    const { username, password, email, age, gender, phone } = req.body;

    // Log the request body to verify its contents
    console.log('Request Body:', req.body);

    // Ensure password is provided
    if (!password) {
        return res.status(400).send("Password is required.");
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).send("User already registered. Please log in.");

        // Hash the password with salt rounds (10 is a common choice)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            age,
            gender,
            phone
        });

        // Save the new user
        await newUser.save();
        res.status(201).send("User has been created.");
    } catch (err) {
        console.error('Error:', err); // Log the error for debugging
        res.status(400).send(err.message);
    }
};

const updateUser = async (req, res) => {
    const { username, email, age, gender, phone } = req.body; // Ensure `phone` is included
    try {
        const user = await User.findOneAndUpdate(
            { username },
            { email, age, gender, phone },
            { new: true }
        );
        if (!user) return res.status(400).send("User not found");
        res.status(200).json(user); // Send JSON response directly
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const deleteUser = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOneAndDelete({ username });
        if (!user) return res.status(400).send("User not found");
        res.status(200).send("User has been deleted.");
    } catch (err) {
        res.status(400).send(err.message);
    }
};

module.exports = { loginUser, registerUser, updateUser, deleteUser };
