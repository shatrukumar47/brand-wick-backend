const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { BlacklistTokenModel } = require("../models/blacklistToken.model");
require("dotenv").config();


// User Registration
const userRegister = async (req, res)=>{
    const {name, username, email, password, phone} = req.body;
    try {
        const existingUser = await UserModel.findOne({email});
        const checkusername = await UserModel.findOne({ username: username });

        if (checkusername) {
            res.json({ message: "Username not available", action: false });
        }

        if(existingUser){
            return res.status(400).json({ message: 'Account already exists', action: false });
        }

         //password hashing
         bcrypt.hash(password, +process.env.saltRounds, async (err, hash)=>{
            if(err){
                res.status(400).send({ message: 'Error hashing password', action: false });
            }

            //new user
            const newUser = new UserModel({name, username, email, password: hash, phone});
            await newUser.save();

            res.status(200).json({ message: 'Registered successfully', action: true })
         })
        
    } catch (error) {
        res.status(400).json({ message: `Error registering user: ${error.message}`, action: false });
    }
}

//check username availability
const checkUsernameAvailability = async (req, res)=>{
    const { username } = req.params;

    try {
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
           return res.status(400).json({ action: false, message: "Username not available" });
        } else {
           return res.status(200).json({ action: true, message: "Username available" });
        }
    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" });
    }
}


// User Login
const userLogin = async (req, res)=>{
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({ message: 'User not found!', action: false });
        }

        //checking password
        bcrypt.compare(password, user?.password, (err, result)=>{
            if (!result) {
                res.status(400).send({ message: "Wrong Password!", action: false });
              } else {

                const accessToken = jwt.sign({ userID: user?._id, email: user?.email }, process.env.JWT_SECRET);
                res.status(200).send({
                  message: "Login successfull",
                  username: user?.username,
                  accessToken: accessToken,
                  action: true
                });
              }
        })
    } catch (error) {
        res.status(400).json({ message: `Error login: ${error.message}`, action: false });
    }
}

//User Logout
const userLogout = async (req, res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
    
        // Add the token to the blacklist
        const newToken = new BlacklistTokenModel({token});
        await newToken.save();
    
        res.status(200).json({ message: 'Logout successful', action: true });
    } catch (error) {
        res.status(400).json({ message: `Error logout: ${error.message}`, action: false });
    }
}

module.exports = {
    userRegister, userLogin, checkUsernameAvailability, userLogout
}