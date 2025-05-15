"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../helper/fileUploader");
const router = express_1.default.Router();
router.post('/register', (req, res, next) => {
    req.body = user_validation_1.UserValidation.createUserValidation.parse(req.body);
    return user_controller_1.UserController.createUser(req, res, next);
});
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAllUser);
router.get('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.CUSTOMER, client_1.UserRole.SELLER), user_controller_1.UserController.getSingleUser);
router.patch('/:id', fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.updateUserValidationSchema.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.updateUser(req, res, next);
});
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
