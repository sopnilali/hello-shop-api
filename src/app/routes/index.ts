import express from 'express'
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { BrandRoutes } from '../modules/Brand/brand.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { ProductRoutes } from '../modules/Product/product.route';
import { OrderRoutes } from '../modules/Order/order.route';
import { ReviewsRoutes } from '../modules/Reviews/reviews.route';
import { CouponRoutes } from '../modules/Coupon/coupon.route';
import { ShopRoutes } from '../modules/Shop/shop.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';

const router = express.Router();


const moduleRoutes = [
  {
    path: "/user",
    routes: UserRoutes
  },
  {
    path: "/auth",
    routes: AuthRoutes
  },
  {
    path: "/brand",
    routes: BrandRoutes
  },
  {
    path: "/category",
    routes: CategoryRoutes
  },
  {
    path: "/product",
    routes: ProductRoutes
  },
  {
    path: "/order",
    routes: OrderRoutes
  },
  {
    path: "/review",
    routes: ReviewsRoutes
  },
  {
    path: "/coupon",
    routes: CouponRoutes
  },
  {
    path: "/shop",
    routes: ShopRoutes
  },
  {
    path: "/payment",
    routes: PaymentRoutes
  }
]

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router