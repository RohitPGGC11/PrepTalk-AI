import express from "express";
const Adminrouter = express.Router();

import {addQuestion,editQuestion,deleteQuestion,getQuestions, fetchOne} from "../controllers/adminController.js";

//pending for protected Route.


Adminrouter.post("/add-question", addQuestion);
Adminrouter.put("/edit-question/:id",/* auth, isAdmin,*/ editQuestion);
Adminrouter.delete("/delete-question/:id",/* auth, isAdmin0,*/ deleteQuestion);
Adminrouter.get("/fetch-questions",getQuestions);
Adminrouter.get("/fetch-one/:id",fetchOne);



export default Adminrouter;
