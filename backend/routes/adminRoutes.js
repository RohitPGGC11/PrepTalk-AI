import express from "express";
const Adminrouter = express.Router();
import Question from "../models/Question.js";
import {auth} from "../middleware/auth.js"
import {isAdmin} from "../middleware/isAdmin.js"
import {addQuestion,editQuestion,deleteQuestion} from "../controllers/adminController.js";

Adminrouter.post("/add-question",/* auth, isAdmin,*/ addQuestion);
Adminrouter.put("/edit-question/:id",/* auth, isAdmin,*/ editQuestion);
Adminrouter.delete("/delete-question/:id",/* auth, isAdmin0,*/ deleteQuestion);

Adminrouter.get("/all-questions",/* auth, isAdmin,*/ async (req, res) => {
  const questions = await Question.find({ isActive: true })
    .sort({ domain: 1, order: 1 });

  res.json(questions);
});


export default Adminrouter;
