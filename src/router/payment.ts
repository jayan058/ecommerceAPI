import { Router } from 'express';
import * as paymentController from '../controller/payment';
import { authenticate,authorize } from '../middleware/auth';
const paymentRouter = Router();
paymentRouter.post('/checkout',  authenticate,
authorize(["remove_from_cart"]),paymentController.checkout);
paymentRouter.get('/verify/:userId', paymentController.paymentVerify);
export default paymentRouter;