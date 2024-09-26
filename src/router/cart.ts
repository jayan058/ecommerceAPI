import express from 'express';
import * as cartController from "../controller/cart"
import {authenticate,authorize} from '../middleware/auth';

const cartRoute = express.Router();
cartRoute.post('/', authenticate, authorize(["add_to_cart"]),cartController.addToCart);




export default cartRoute;