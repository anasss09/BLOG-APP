import express from "express";

import { verifyjwt } from "../middleware/verifyJWT.js";
import { authorizeRoles } from "../middleware/authorizeRole.js";
import {
  getAllUsers,
  patchPassword,
  patchProfile,
  patchUserRole,
} from "../controller/user.controller.js";

const router = express.Router();

router.get("/", verifyjwt, authorizeRoles("admin"), getAllUsers);
router.patch("/:id/role", verifyjwt, authorizeRoles("admin"), patchUserRole);
router.patch("/profile/me", verifyjwt, patchProfile);
router.patch("/password/me", verifyjwt, patchPassword);

export default router;
