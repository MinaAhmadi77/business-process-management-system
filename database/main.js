// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const faker = require("faker");
const jalaliMoment = require("jalali-moment");
// Create the Express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Set the allowed origin (or specific origins instead of '*')
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Set allowed HTTP methods
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Set allowed request headers
  next();
});
// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://erfanrmz:kimyamina123%40@cluster1.udsctit.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the mainInformation schema
const mainInformationSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  fieldAndEducationalGroup: String,
  serviceMethod: String,
  AcademicRank: String,
  Base: Number,
  secondaryPost: String,
  teachingLoad: String,
  numberOfUndergraduateStudents: Number,
  numberOfMasterStudents: Number,
  numberOfPhdStudents: Number,
});

// Define the WeeklyProgram schema
const weeklyProgramSchema = new mongoose.Schema({
  WeeklyProgramStatus: String,
  WeeklyProgramRegistrationDeadline: Date,
  teacher: String,
  year: Number,
  table: {
    Saturday: [
      {
        subject: String,
        workplace: String,
        workType: String,
        placeType: String,
        startTime: String,
        duration: String,
      },
    ],
    Sunday: [
      {
        subject: String,
        workplace: String,
        workType: String,
        placeType: String,
        startTime: String,
        duration: String,
      },
    ],
    Monday: [
      {
        subject: String,
        workplace: String,
        workType: String,
        placeType: String,
        startTime: String,
        duration: String,
      },
    ],
    Tuesday: [
      {
        subject: String,
        workplace: String,
        workType: String,
        placeType: String,
        startTime: String,
        duration: String,
      },
    ],
    Wednesday: [
      {
        subject: String,
        workplace: String,
        workType: String,
        placeType: String,
        startTime: String,
        duration: String,
      },
    ],
    Thursday: [
      {
        subject: String,
        workplace: String,
        workType: String,
        placeType: String,
        startTime: String,
        duration: String,
      },
    ],
  },
});

// Create models from the schemas
const MainInformation = mongoose.model(
  "MainInformation",
  mainInformationSchema
);
const WeeklyProgram = mongoose.model("WeeklyProgram", weeklyProgramSchema);

// Define the GET route for /main-information
app.get("/main-information", async (req, res) => {
  const { user } = req.query;
  // console.log("hello");
  const data = await MainInformation.findOne({ username: user }).exec();
  // console.log(data.teachingLoad);
  res.json(data);
  //   MainInformation.findOne({ username: username }, async (error, data) => {
  //     if (err) {
  //       res.status(500).send(err);
  //     } else {
  //       res.json(data);
  //     }
  //   });
});
// Define the GET route for generating example MainInformation data and saving it to the database
// Define the GET route for /weekly-program
app.get("/weekly-program", async (req, res) => {
  const { user, year } = req.query;
  console.log(year);
  var yearss = parseInt(year);
  console.log(yearss);
  const data = await WeeklyProgram.findOne({
    teacher: user.toString(),
    year: year,
  }).exec();
  if (data != null) {
    console.log(data.table);
    res.json(data.table);
  } else {
    const exampleWeeklyProgram = {
      WeeklyProgramStatus: "Active",
      WeeklyProgramRegistrationDeadline: new Date(),
      teacher: user,
      year: parseInt(year),
      table: {
        Saturday: generateRandomProgramTable(),
        Sunday: generateRandomProgramTable(),
        Monday: generateRandomProgramTable(),
        Tuesday: generateRandomProgramTable(),
        Wednesday: generateRandomProgramTable(),
        Thursday: generateRandomProgramTable(),
      },
    };

    const weeklyProgram = new WeeklyProgram(exampleWeeklyProgram);
    await weeklyProgram.save();
    const data = await WeeklyProgram.findOne({
      teacher: user.toString(),
      year: parseInt(year),
    }).exec();
    console.log(data.table);
    res.json(data.table);
  }
});
app.post("/update-section", async (req, res) => {
  try {
    const {
      teacher,
      buttonid,
      type,
      title,
      place,
      placetitle,
      repeat,
      day,
      timeminutes,
      timehour,
      startTimeMin,
      startTimeHour,
    } = req.body;
    const duration = parseInt(timehour) + parseInt(timeminutes) / 60;
    const startingTime =
      startTimeHour.toString() + ":" + startTimeMin.toString();
    // Check what is the provided day
    var section = Math.floor(buttonid / 8);
    var arraySection = buttonid % 8;
    console.log(section);
    const currentDate = jalaliMoment();
    const currentMonth = currentDate.jMonth() + 1;
    const currentYear = currentDate.jYear();
    const result =
      currentMonth >= 6 && currentMonth <= 12
        ? `${currentYear}2`
        : `${currentYear}1`;
    console.log(result);
    // Find the WeeklyProgram document for the given teacher and year
    const weeklyProgram = await WeeklyProgram.findOne({
      teacher: teacher,
      year: parseInt(result),
    });

    // Check if the WeeklyProgram document exists
    // if (!weeklyProgram) {
    //   // return res.status(404).send("WeeklyProgram not found");
    //   console.log("WeeklyProgram not found");
    //   const exampleWeeklyProgram = {
    //     WeeklyProgramStatus: "Active",
    //     WeeklyProgramRegistrationDeadline: new Date(),
    //     teacher: teacher,
    //     year: 14021,
    //     table: {
    //       Saturday: generateEmptyProgramTable(),
    //       Sunday: generateEmptyProgramTable(),
    //       Monday: generateEmptyProgramTable(),
    //       Tuesday: generateEmptyProgramTable(),
    //       Wednesday: generateEmptyProgramTable(),
    //       Thursday: generateEmptyProgramTable(),
    //     },
    //   };

    //   const weeklyProgram = new WeeklyProgram(exampleWeeklyProgram);
    //   await weeklyProgram.save();
    // }
    // weeklyProgram = await WeeklyProgram.findOne({
    //   teacher: "sabaii",
    //   year: 14021,
    // });
    if (section == 0) {
      console.log("shanbe");
      weeklyProgram.table.Saturday[arraySection].subject = title;
      weeklyProgram.table.Saturday[arraySection].workplace = placetitle;
      weeklyProgram.table.Saturday[arraySection].workType = type;
      weeklyProgram.table.Saturday[arraySection].placeType = place;
      weeklyProgram.table.Saturday[arraySection].startTime = startingTime;
      weeklyProgram.table.Saturday[arraySection].duration = duration;
      await weeklyProgram.save();
    }
    if (section == 1) {
      console.log("1shanbe");

      weeklyProgram.table.Sunday[arraySection].subject = title;
      weeklyProgram.table.Sunday[arraySection].workplace = placetitle;
      weeklyProgram.table.Sunday[arraySection].workType = type;
      weeklyProgram.table.Sunday[arraySection].placeType = place;
      weeklyProgram.table.Sunday[arraySection].startTime = startingTime;
      weeklyProgram.table.Sunday[arraySection].duration = duration;
      await weeklyProgram.save();
    }
    if (section == 2) {
      console.log("2shanbe");

      weeklyProgram.table.Monday[arraySection].subject = title;
      weeklyProgram.table.Monday[arraySection].workplace = placetitle;
      weeklyProgram.table.Monday[arraySection].workType = type;
      weeklyProgram.table.Monday[arraySection].placeType = place;
      weeklyProgram.table.Monday[arraySection].startTime = startingTime;
      weeklyProgram.table.Monday[arraySection].duration = duration;
      await weeklyProgram.save();
    }
    if (section == 3) {
      console.log("3shanbe");

      weeklyProgram.table.Tuesday[arraySection].subject = title;
      weeklyProgram.table.Tuesday[arraySection].workplace = placetitle;
      weeklyProgram.table.Tuesday[arraySection].workType = type;
      weeklyProgram.table.Tuesday[arraySection].placeType = place;
      weeklyProgram.table.Tuesday[arraySection].startTime = startingTime;
      weeklyProgram.table.Tuesday[arraySection].duration = duration;
      await weeklyProgram.save();
    }
    if (section == 4) {
      console.log("4shanbe");

      weeklyProgram.table.Wednesday[arraySection].subject = title;
      weeklyProgram.table.Wednesday[arraySection].workplace = placetitle;
      weeklyProgram.table.Wednesday[arraySection].workType = type;
      weeklyProgram.table.Wednesday[arraySection].placeType = place;
      weeklyProgram.table.Wednesday[arraySection].startTime = startingTime;
      weeklyProgram.table.Wednesday[arraySection].duration = duration;
      await weeklyProgram.save();
    }
    if (section == 5) {
      console.log("5shanbe");

      weeklyProgram.table.Thursday[arraySection].subject = title;
      weeklyProgram.table.Thursday[arraySection].workplace = placetitle;
      weeklyProgram.table.Thursday[arraySection].workType = type;
      weeklyProgram.table.Thursday[arraySection].placeType = place;
      weeklyProgram.table.Thursday[arraySection].startTime = startingTime;
      weeklyProgram.table.Thursday[arraySection].duration = duration;
      await weeklyProgram.save();
    }

    console.log("Section updated successfully");

    res.send("Section updated successfully");
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).send("Error updating section");
  }
});
app.get("/getStatus", async (req, res) => {
  const { user, year } = req.query;
  console.log(year);
  var yearss = parseInt(year);
  console.log(yearss);
  const data = await WeeklyProgram.findOne({
    teacher: user,
    year: yearss,
  }).exec();
});
app.get("/getDuration", async (req, res) => {
  const { user, year } = req.query;
  console.log(year);
  var yearss = parseInt(year);
  console.log(yearss);
  var times = {
    education: 0,
    research: 0,
    executive: 0,
    inside: 0,
    outside: 0,
  };
  const data = await WeeklyProgram.findOne({
    teacher: user,
    year: yearss,
  }).exec();
  data.table.Saturday.forEach((element) => {
    if (element.workType == "آموزشی") {
      times.education += parseInt(element.duration);
    } else if (element.workType == "اجرایی") {
      times.executive += parseInt(element.duration);
    } else if (element.workType == "پژوهشی") {
      times.research += parseInt(element.duration);
    }
    if (element.workplace == "خارج دانشگاه") {
      times.outside += parseInt(element.duration);
    } else {
      times.inside += parseInt(element.duration);
    }
  });
  data.table.Sunday.forEach((element) => {
    if (element.workType == "آموزشی") {
      times.education += parseInt(element.duration);
    } else if (element.workType == "اجرایی") {
      times.executive += parseInt(element.duration);
    } else if (element.workType == "پژوهشی") {
      times.research += parseInt(element.duration);
    }
    if (element.workplace == "خارج دانشگاه") {
      times.outside += parseInt(element.duration);
    } else {
      times.inside += parseInt(element.duration);
    }
  });
  data.table.Monday.forEach((element) => {
    if (element.workType == "آموزشی") {
      times.education += parseInt(element.duration);
    } else if (element.workType == "اجرایی") {
      times.executive += parseInt(element.duration);
    } else if (element.workType == "پژوهشی") {
      times.research += parseInt(element.duration);
    }
    if (element.workplace == "خارج دانشگاه") {
      times.outside += parseInt(element.duration);
    } else {
      times.inside += parseInt(element.duration);
    }
  });
  data.table.Tuesday.forEach((element) => {
    if (element.workType == "آموزشی") {
      times.education += parseInt(element.duration);
    } else if (element.workType == "اجرایی") {
      times.executive += parseInt(element.duration);
    } else if (element.workType == "پژوهشی") {
      times.research += parseInt(element.duration);
    }
    if (element.workplace == "خارج دانشگاه") {
      times.outside += parseInt(element.duration);
    } else {
      times.inside += parseInt(element.duration);
    }
  });
  data.table.Wednesday.forEach((element) => {
    if (element.workType == "آموزشی") {
      times.education += parseInt(element.duration);
    } else if (element.workType == "اجرایی") {
      times.executive += parseInt(element.duration);
    } else if (element.workType == "پژوهشی") {
      times.research += parseInt(element.duration);
    }
    if (element.workplace == "خارج دانشگاه") {
      times.outside += parseInt(element.duration);
    } else {
      times.inside += parseInt(element.duration);
    }
  });
  data.table.Thursday.forEach((element) => {
    if (element.workType == "آموزشی") {
      times.education += parseInt(element.duration);
    } else if (element.workType == "اجرایی") {
      times.executive += parseInt(element.duration);
    } else if (element.workType == "پژوهشی") {
      times.research += parseInt(element.duration);
    }
    if (element.workplace == "خارج دانشگاه") {
      times.outside += parseInt(element.duration);
    } else {
      times.inside += parseInt(element.duration);
    }
  });

  res.json(times);
});

app.get("/example-main-information", async (req, res) => {
  try {
    const exampleMainInformation = {
      username: "john.doe",
      name: "John Doe",
      fieldAndEducationalGroup: "Computer Science",
      serviceMethod: "Full-time",
      AcademicRank: "Professor",
      Base: 5000,
      secondaryPost: "Head of Department",
      teachingLoad: "20 hours per week",
      numberOfUndergraduateStudents: 100,
      numberOfMasterStudents: 50,
      numberOfPhdStudents: 20,
    };

    const mainInformation = new MainInformation(exampleMainInformation);
    await mainInformation.save();

    res.send("Example MainInformation data saved successfully.");
  } catch (error) {
    console.error(
      "Error generating and saving example MainInformation:",
      error
    );
    res
      .status(500)
      .send("Error generating and saving example MainInformation.");
  }
});

app.get("/example-weekly-program", async (req, res) => {
  try {
    const exampleWeeklyProgram = {
      WeeklyProgramStatus: "Active",
      WeeklyProgramRegistrationDeadline: new Date(),
      teacher: "John Doe",
      year: 2020,
      table: {
        Monday: generateRandomProgramTable(),
        Tuesday: generateRandomProgramTable(),
        Wednesday: generateRandomProgramTable(),
        Thursday: generateRandomProgramTable(),
        Friday: generateRandomProgramTable(),
        Saturday: generateRandomProgramTable(),
      },
    };

    const weeklyProgram = new WeeklyProgram(exampleWeeklyProgram);
    await weeklyProgram.save();

    res.send("Example WeeklyProgram data saved successfully.");
  } catch (error) {
    console.error("Error generating and saving example WeeklyProgram:", error);
    res.status(500).send("Error generating and saving example WeeklyProgram.");
  }
});

// Helper function to generate random program table with 8 sections
function generateRandomProgramTable() {
  const programTable = [];
  for (let section = 1; section <= 8; section++) {
    programTable.push({
      subject: "-",
      workplace: "-",
      workType: "-",
      placeType: "-",
      startTime: "-",
      duration: "-",
    });
  }
  return programTable;
}

// Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
