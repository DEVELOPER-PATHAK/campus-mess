// const cron = require('node-cron');
// const Student = require('../models/Student');
import studentModel from "../models/studentModel.js";

import cron from 'node-cron';
// import Student from "../models/studentModel.js";

export const  updater=  cron.schedule('0 0 * * *', async () => {
  try {
    console.log("Running DB reset...");

    await studentModel.updateMany({}, { $set: { status: 'Eating' } });

    console.log("Database updated successfully");
  } catch (err) {
    console.error(err);
  }
}, {
  timezone: "Asia/Kolkata"
});