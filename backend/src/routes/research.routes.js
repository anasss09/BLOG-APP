import express from 'express';
import { deleteBlog, getDashboardStats, patchUpdate, postCreate, postViewsCount } from '../controller/research.controller.js';
import { authorizeRoles } from '../middleware/authorizeRole.js';
import { verifyjwt } from '../middleware/verifyJWT.js';
import upload from '../utils/multer.js';
import { getBlogs } from '../controller/research.controller.js';


const router = express.Router();

// POST route
router.post('/create', verifyjwt, authorizeRoles("admin", "editor"), upload.single('image'), postCreate);
router.post("/view/:id", postViewsCount);

// PATCH route
router.patch('/:researchId', verifyjwt, authorizeRoles("admin", "editor"), upload.single('image'), patchUpdate);

// DELETE route
router.delete('/delete/:researchId', verifyjwt, authorizeRoles("admin", "editor"), deleteBlog);

// GET route
router.get('/', getBlogs);
router.get('/stats', verifyjwt, authorizeRoles("admin", "editor", "member"), getDashboardStats);

export default router;