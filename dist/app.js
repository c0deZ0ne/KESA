"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Users_1 = __importDefault(require("./routes/Users"));
const index_1 = __importDefault(require("./routes/index"));
// import adminRouter from "./routes/Admin";
const seachDoctors_1 = __importDefault(require("./routes/seachDoctors"));
const pharmacyRoute_1 = __importDefault(require("./routes/pharmacyRoute"));
const path_1 = __importDefault(require("path"));
const index_2 = require("./config/index");
const professionalRoute_1 = __importDefault(require("./routes/professionalRoute"));
const SmsRoute_1 = __importDefault(require("./routes/SmsRoute"));
// Sequelize connection
index_2.db.sync()
    .then(() => {
    console.log("Db connected successfuly");
})
    .catch((err) => {
    console.log(err);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
app.set("view engine", "ejs");
//Router middleware
app.use("/sms", SmsRoute_1.default);
app.use("/", index_1.default);
app.use("/users", Users_1.default);
// app.use("/admins", adminRouter);
app.use("/search-doctors", seachDoctors_1.default);
app.use("/pharmacy", pharmacyRoute_1.default);
// pro route
app.use("/pro", professionalRoute_1.default);
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
exports.default = app;
