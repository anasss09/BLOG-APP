import express from 'express';
import { getCheckAuth, getLogout, postLogin, postRegister } from '../controller/auth.controller.js';
import { verifyjwt } from '../middleware/verifyJWT.js ';


const router = express.Router();

// POST request
router.post("/register", postRegister);
router.post("/login", postLogin);

// GET request
router.get('/logout', getLogout);
router.get("/checkAuth", verifyjwt, getCheckAuth);

export default router;