import express from "express";
import { sayHello } from "../handlers/helloHandlers";


const helloRouter = express.Router();

helloRouter.get("/", sayHello);

export default hellorouter;
