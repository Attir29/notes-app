import express from "express";
import { sayHello } from "../handlers/helloHandlers.js";

const helloRoute = express.Router();

helloRoute.get("/", sayHello);

export default helloRoute;
