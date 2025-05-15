import express from 'express'
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { BrandRoutes } from '../modules/Brand/brand.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { ProductRoutes } from '../modules/Product/product.route';
import { OrderRoutes } from '../modules/Order/order.route';

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
  }
]

moduleRoutes.forEach(({ path, routes }) => {
  router.use(path, routes);
});

export default router