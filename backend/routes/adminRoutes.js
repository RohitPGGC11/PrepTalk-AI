import express from "express";
const Adminrouter = express.Router();

//pending for protected Route.

import {isAdmin} from "../middleware/isAdmin.js"

import {addQuestion,editQuestion,deleteQuestion,getQuestions, fetchOne} from "../controllers/adminController.js";

Adminrouter.post("/add-question",/* auth, isAdmin,*/ addQuestion);
Adminrouter.put("/edit-question/:id",/* auth, isAdmin,*/ editQuestion);
Adminrouter.delete("/delete-question/:id",/* auth, isAdmin0,*/ deleteQuestion);
Adminrouter.get("/fetch-questions",getQuestions);
Adminrouter.get("/fetch-one/:id",fetchOne);



export default Adminrouter;
