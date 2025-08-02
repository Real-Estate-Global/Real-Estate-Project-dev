require("dotenv").config();
const MongoDB = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { checkSchema } = require("express-validator");

const checkUserRegister = checkSchema({
    email: { isEmail: true },
    password: { isLength: { options: { min: 6 } } },
    name: { isLength: { options: { min: 2 } } },
    phoneNumber: { isNumeric: { no_symbols: false } },
    profileType: {}
})
const userRegister = async (req, res) => {
    try {
        const { email, password, name, phoneNumber, profileType } = req.body;

        // Check if the email is already registered
        const usersCollection = MongoDB.collection('users');
        const query = { email };
        const existingUser = await usersCollection.findOne(query);

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);  // 10 е cost factor
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = { _id: uuidv4(), email, password: hashedPassword, name, profileType, phoneNumber };
        await usersCollection.insertOne(newUser);

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
}
const editUserProfile = async (req, res) => {
    try {
        const { _id, email, name, phoneNumber, profileType, watermark, avatar, favorites } = req.body;

        // Check if the email is already registered
        const usersCollection = MongoDB.collection('users');
        const query = { _id };
        const existingUser = await usersCollection.findOne(query);

        if (!existingUser) {
            return res.status(400).json({ error: 'User Not Found!' });
        }

        // Build an object with only non-empty values from req.body
        const updateFields = {};
        if (name !== undefined && name !== '') updateFields.name = name;
        if (phoneNumber !== undefined && phoneNumber !== '') updateFields.phoneNumber = phoneNumber;
        if (profileType !== undefined && profileType !== '') updateFields.profileType = profileType;
        if (watermark !== undefined && watermark !== '') updateFields.watermark = watermark;
        if (avatar !== undefined && avatar !== '') updateFields.avatar = avatar;
        if (email !== undefined && email !== '') updateFields.email = email;
        if (favorites !== undefined && Array.isArray(favorites)) updateFields.favorites = favorites;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        // TODO: edit email - user id to be used instead of email or add "newEmail" to the query
        const result = usersCollection.updateOne(query, {
            $set: updateFields
        });

        res.status(201).json(result);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'An error occurred while registering the user' });
    }
}
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const usersCollection = MongoDB.collection('users');
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in the .env file');
            return res.status(500).json({ error: 'Internal server error' });
        }
        const secretKey = process.env.JWT_SECRET || 'default_secret_key';
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '24h' });

        res.status(200).json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
}
const userLogout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'An error occurred while logging out' });
    }
}
const getUserData = async (req, res) => {
    try {
        // Check if the email is already registered
        const usersCollection = MongoDB.collection('users');
        const query = { _id: req.userId };
        const loggedInUser = await usersCollection.findOne(query);

        res.status(200).json(loggedInUser);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'An error occurred while fetching user information' });
    }
}

module.exports = {
    checkUserRegister,
    userRegister,
    userLogin,
    userLogout,
    getUserData,
    editUserProfile,
}
