const express=require('express');
const {registerUser,loginUser}=require('../controllers/AuthController')

const router=express.Router();
// Register route - POST /api/auth/register
/**
 * Route: /api/auth/register
 * Description: Register a new user
 * Method: POST
 */
router.post('/register',registerUser)

// Login route - POST /api/auth/login
/**
 * Route: /api/auth/login
 * Description: Login an existing user
 * Method: POST
 */
router.post('/login',loginUser)

module.exports=router;