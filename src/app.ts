import express, { Request, Response } from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/Users";
import indexRouter from "./routes/index";
// import adminRouter from "./routes/Admin";
import searchDoctors from "./routes/seachDoctors";
import pharmacyRoute from "./routes/pharmacyRoute";
import path from "path";
import { db } from "./config/index";
import professionalRoute from "./routes/professionalRoute";
import smsRouter from "./routes/SmsRoute";
import patientRoute from "./routes/patientRoute";
import adminRoute from "./routes/adminRoute";
// Sequelize connection
db.sync({ force: false })
  .then(() => {
    console.log("Db connected successfuly");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.set("view engine", "ejs");
//Router middleware
app.use("/sms", smsRouter);
app.use("/", indexRouter);
app.use("/users", userRouter);
// app.use("/admins", adminRouter);
app.use("/search-doctors", searchDoctors);
app.use("/pharmacy", pharmacyRoute);
app.use("/patient", patientRoute);
app.use("/admin", adminRoute);
// pro route
app.use("/pro", professionalRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});

export default app;
