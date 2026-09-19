"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("./models/User"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
(0, db_1.default)();
const importData = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User_1.default.findOne({ email: 'admin@roomfinder.com' });
        if (adminExists) {
            console.log('Admin user already exists!');
            process.exit();
        }
        const adminUser = new User_1.default({
            name: 'Admin User',
            email: 'admin@roomfinder.com',
            password: 'AdminPassword123!',
            role: 'ADMIN',
        });
        await adminUser.save();
        console.log('Admin user created successfully!');
        process.exit();
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};
importData();
//# sourceMappingURL=seeder.js.map