import express from 'express';
import { deleteNews, patchUpdate, postCreate, postViewsCount, getNews } from '../controller/news.controller.js';
import { authorizeRoles } from '../middleware/authorizeRole.js';
import { verifyjwt } from '../middleware/verifyJWT.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/create', verifyjwt, authorizeRoles("admin", "editor"), upload.single('image'), postCreate);
router.post("/view/:id", postViewsCount);
router.patch('/:id', verifyjwt, authorizeRoles("admin", "editor"), upload.single('image'), patchUpdate);
router.delete('/delete/:id', verifyjwt, authorizeRoles("admin", "editor"), deleteNews);
router.get('/', getNews);

export default router;
