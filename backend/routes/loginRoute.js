import express from "express";
import { register, login, refresh, logout } from "../controllers/loginController.js";
import { registerSchema ,validate ,ensureAuthenticate} from "../middleware/authmiddleware.js";
const router = express.Router();

router.post("/register",validate(registerSchema) ,register);
router.post("/login",login);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;


