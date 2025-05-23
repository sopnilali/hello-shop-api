"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const brand_route_1 = require("../modules/Brand/brand.route");
const category_route_1 = require("../modules/Category/category.route");
const product_route_1 = require("../modules/Product/product.route");
const order_route_1 = require("../modules/Order/order.route");
const reviews_route_1 = require("../modules/Reviews/reviews.route");
const coupon_route_1 = require("../modules/Coupon/coupon.route");
const shop_route_1 = require("../modules/Shop/shop.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const blogCategory_route_1 = require("../modules/BlogCategory/blogCategory.route");
const blog_route_1 = require("../modules/Blog/blog.route");
const discount_route_1 = require("../modules/Discount/discount.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        routes: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        routes: auth_route_1.AuthRoutes
    },
    {
        path: "/brand",
        routes: brand_route_1.BrandRoutes
    },
    {
        path: "/category",
        routes: category_route_1.CategoryRoutes
    },
    {
        path: "/product",
        routes: product_route_1.ProductRoutes
    },
    {
        path: "/order",
        routes: order_route_1.OrderRoutes
    },
    {
        path: "/review",
        routes: reviews_route_1.ReviewsRoutes
    },
    {
        path: "/coupon",
        routes: coupon_route_1.CouponRoutes
    },
    {
        path: "/shop",
        routes: shop_route_1.ShopRoutes
    },
    {
        path: "/payment",
        routes: payment_route_1.PaymentRoutes
    },
    {
        path: "/blog-category",
        routes: blogCategory_route_1.BlogCategoryRoutes
    },
    {
        path: "/blog",
        routes: blog_route_1.BlogRoutes
    },
    {
        path: "/discount",
        routes: discount_route_1.DiscountRoutes
    }
];
moduleRoutes.forEach(({ path, routes }) => {
    router.use(path, routes);
});
exports.default = router;
