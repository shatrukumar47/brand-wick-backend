const express = require('express');
const { userRegister, userLogin, checkUsernameAvailability, userLogout } = require('../controllers/user.controller');

const userRoute = express.Router();

//register
userRoute.post("/register", userRegister);

//check username availability
userRoute.get("/check-username/:username", checkUsernameAvailability)

//login
userRoute.post("/login", userLogin)

//logout
userRoute.post("/logout", userLogout)

module.exports = {
    userRoute
}