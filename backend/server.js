require('dotenv').config();
var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var multer = require('multer'),
  bodyParser = require('body-parser'),
  path = require('path');
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
var fs = require('fs');
var session = require("./model/session.js");
var user = require("./model/user.js");
var student = require("./model/student.js");
var tutor = require("./model/tutor.js");
var dir = './uploads';
var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(/*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});
app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Apis'
  });
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
	          fullName: req.body.fullName,
            project: req.body.project
          });

          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {

              // If user is a tutor, also save them to the Tutor collection
              if (req.body.role === 'Tutor') {
                let newTutor = new tutor({
                  name: req.body.fullName,
                  payRate: 0,
                  weeklyHours : 0,
                  monthlyHours: 0,
                  yearlyHours: 0,
                  weeklyEarnings : 0,
                  monthlyEarnings: 0,
                  yearlyEarnings: 0,
                });

                newTutor.save((err, data) => {
                  if (err) {
                    console.log('Error saving tutor:', err);
                  } else {
                    console.log('Tutor saved successfully');
                  }
                });
              }

              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id}, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        role: data.role,
        fullName: data.fullName,
        token: token,
        status: true
      });
    }
  });
}


/* Api to add Session */
app.post("/add-session", upload.any(), (req, res) => {
  
  try {
    if (req.files && req.body && req.body.name && req.body.comments && req.body.taskAssignment && req.body.date  &&
      req.body.hours && req.body.tutor) {
      let new_session = new session();
      new_session.name = req.body.name;
      new_session.comments = req.body.comments;
      new_session.taskAssignment = req.body.taskAssignment;
      new_session.date = req.body.date;
      new_session.attendance = req.body.attendance;
      new_session.tutor = req.body.tutor;
      new_session.hours = req.body.hours;
      new_session.user_id = req.user.id;
      new_session.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Session Added successfully.'
          });
        }
      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to update Session */
app.post("/update-session", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.comments && req.body.taskAssignment && req.body.date  &&
      req.body.id && req.body.hours) {

      session.findById(req.body.id, (err, new_session) => {

        if (req.files && req.files[0] && req.files[0].filename) {
          new_session.image = req.files[0].filename;
        }
        if (req.body.comments) {
          new_session.comments = req.body.comments;
        }
        if (req.body.taskAssignment) {
          new_session.taskAssignment = req.body.taskAssignment;
        }
        if (req.body.date) {
          new_session.date = req.body.date;
        }
        if (req.body.hours) {
          new_session.hours = req.body.hours;
        }
        if (req.body.tutor) {
          new_session.tutor = req.body.tutor;
        }

        new_session.save((err, data) => {
          if (err) {
            res.status(400).json({
              errorMessage: err,
              status: false
            });
          } else {
            res.status(200).json({
              status: true,
              title: 'Session updated.'
            });
          }
        });

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to delete Session */
app.post("/delete-session", (req, res) => {
  try {
    if (req.body && req.body.id) {
      session.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Session deleted.'
          });
        } else {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to get all students sorted by full name */
app.get("/get-students", (req, res) => {
  try {
    user.find({ role: "Student" }).sort({fullName: 1}).exec((err, students) => {
      if (err) {
        return res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }

      if (!students || students.length === 0) {
        return res.status(404).json({
          errorMessage: 'No students found!',
          status: false
        });
      }
      return res.status(200).json({
        status: true,
        students: students
      });

    })
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to get all tutors sorted by full name */
app.get("/get-tutors", (req, res) => {
  try {
    user.find({ role: "Tutor" }).sort({fullName: 1}).exec((err, tutors) => {
      if (err) {
        return res.status(400).json({
          errorMessage: 'Something went wrong!',
          status: false
        });
      }

      if (!tutors || tutors.length === 0) {
        return res.status(404).json({
          errorMessage: 'No tutors found!',
          status: false
        });
      }
     
      return res.status(200).json({
       
        status: true,
        tutors: tutors,
       
      });

    })
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});


/*Api to get and search session with pagination and search by name*/
app.get("/get-session", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: new RegExp(req.query.search, "i") }
      });
    } else if (req.query && req.query.searchByTutor) {
      query["$and"].push({
        tutor: { $regex: new RegExp(req.query.searchByTutor, "i") }
      });
    }
    var perPage = 7;
    var page = req.query.page || 1;
    session
      .find(query, {
        date: 1,
        name: 1,
        id: 1,
        comments: 1,
        taskAssignment: 1,
        date: 1,
        subject: 1,
        attendance: 1,
        hours: 1,
        tutor: 1
      })
      .sort({ date: -1 }) // Sorting in descending order
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .then((data) => {
        session
          .find(query)
          .count()
          .then((count) => {
            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: "Session retrieved.",
                sessions: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: "There is no session!",
                status: false
              });
            }
          });
      })
      .catch((err) => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false
    });
  }
});

/*Api to get and search users with pagination and search by username*/
app.get("/get-users", (req, res) => {
  try {
    var query = {};
    if (req.query && req.query.search) {
      query["fullName"] = { $regex: req.query.search };
    }
    var perPage = 7;
    var page = req.query.page || 1;
    user.find(query, { username: 1, fullName: 1, role: 1,password: 1, project: 1 })
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        user.countDocuments(query)
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'User retrieved.',
                users: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'No users found!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* Api to delete User */
app.post("/delete-users", (req, res) => {
  try {
    if (req.body && req.body.id) {
      user.findByIdAndRemove(req.body.id, (err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: 'Error deleting user.',
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'User deleted successfully.'
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide the user ID.',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/* Api to update users */
app.post("/update-users", (req, res) => {
  
  try {
    if (req.body && req.body.id) {
      var update = {};

      if(req.body.username) {
        update.username = req.body.username;
      }
      if(req.body.fullName) {
        update.fullName = req.body.fullName;
      }
      if(req.body.role) {
        update.role = req.body.role;
      }
      if(req.body.password) {
        update.password = req.body.password;
      }
      if(req.body.project) {
        update.project = req.body.project;
      }
      

      user.findByIdAndUpdate(req.body.id, update, { new: true }, (err, data) => {
        
        if (err) {
          res.status(400).json({
            errorMessage: 'Error updating user.',
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'User updated successfully.',
            user: data
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide the user ID and details to update.',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

/*Api to get and search students with pagination and search by name*/
app.get("/get-students", (req, res) => {
  try {
    var query = {};
    if (req.query && req.query.search) {
      query["fullName"] = { $regex: req.query.search };
    }
    var perPage = 8;
    var page = req.query.page || 1;
    student.find(query, { name: 1, tutor: 1, grade: 1, averageMark: 1})
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        student.countDocuments(query)
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Student retrieved.',
                users: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'No students found!',
                status: false
              });
            }

          });

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});


app.get('/weekly-hours/:tutor', function(req, res) {
  var tutorName = req.params.tutor;

  var today = new Date();
  var firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  firstDayOfWeek.setHours(0, 0, 0, 0); // start of the day

  var lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999); // end of the day

  session.aggregate([
      {
          $match: {
              tutor: tutorName,
              date: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
              is_delete: false
          }
      },
      {
          $group: {
              _id: null,
              totalHours: { $sum: "$hours" }
          }
      }
  ]).then(function(result) { 
    

      res.json(result);
  }).catch(function(err){
    console.error(err); // Add this line
      res.send(err);
  });
});


/* Api to update Pay Rate */
app.post("/update-payRate", (req, res) => {
  try {
    if (req.body && req.body.id) {
      var update = {};

      if(req.body.payRate) {
        update.payRate = req.body.payRate;
      }

      tutor.findByIdAndUpdate(req.body.id, update, { new: true }, (err, data) => {
        
        if (err) {
          res.status(400).json({
            errorMessage: 'Error updating Pay Rate.',
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Pay Rate updated successfully.',
            user: data
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide the Pay Rate and details to update.',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

//Api to get Tutor Scheme
app.get("/get-tutorsInfo", (req, res) => {
  try {
    tutor.find({}, { name: 1, payRate: 1, weeklyHours: 1, monthlyHours: 1, yearlyHours: 1, weeklyEarnings: 1, monthlyEarnings: 1,yearlyEarnings: 1})
      .then((data) => {
        
        if (data && data.length > 0) {
          res.status(200).json({
            status: true,
            title: 'Tutor Info retrieved.',
            tutors: data,
          });
        } else {
          res.status(400).json({
            errorMessage: 'No Tutors found!',
            status: false
          });
        }

      }).catch(err => {
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

app.get('/monthly-hours/:tutor', function(req, res) {
  
  var tutorName = req.params.tutor;

  var today = new Date();
  var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0); // start of the day

  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDayOfMonth.setHours(23, 59, 59, 999); // end of the day

  session.aggregate([
      {
          $match: {
              tutor: tutorName,
              date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
              is_delete: false
          }
      },
      {
          $group: {
              _id: null,
              totalHours: { $sum: "$hours" }
          }
          
      }
      
  ]).then(function(result) { 
    
      res.json(result);
  }).catch(function(err){
      console.error(err);
      res.send(err);
  });
});

app.get("/get-payrate/:tutor", (req, res) => {
  try {
    // Extract the tutor's name from the request parameters
    const tutorName = req.params.tutor;

    // Find a tutor with the given name
    tutor.findOne({ name: tutorName }, { payRate: 1 })
      .then((data) => {
        if (data) {
          // If a tutor with the given name exists, return their payRate
          res.status(200).json({
            status: true,
            title: 'Tutor Payrate retrieved.',
            tutor: tutorName,
            payRate: data.payRate
          });
        } else {
          // If no tutor with the given name exists, return an error message
          res.status(400).json({
            errorMessage: 'No Tutor found with the provided name!',
            status: false
          });
        }
      }).catch(err => {
        // If any error occurs while trying to find the tutor, return an error message
        res.status(400).json({
          errorMessage: err.message || err,
          status: false
        });
      });
  } catch (e) {
    // If any error occurs before trying to find the tutor, return an error message
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

// Api to delete a Tutor
app.delete("/delete-tutor", (req, res) => {
  try {
    if (req.body && req.body.id) {
      tutor.findByIdAndRemove(req.body.id, (err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: 'Error deleting Tutor.',
            status: false
          });
        } else if (!data) {
          res.status(404).json({
            errorMessage: 'Tutor with given ID not found.',
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Tutor deleted successfully.'
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide the Tutor ID to delete.',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

app.get('/yearly-hours/:tutor', function(req, res) {
  
  var tutorName = req.params.tutor;

  var today = new Date();
  var firstDayOfYear = new Date(today.getFullYear(), 0, 1); // January 1st
  firstDayOfYear.setHours(0, 0, 0, 0); // start of the day

  var lastDayOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
  lastDayOfYear.setHours(23, 59, 59, 999); // end of the day

  session.aggregate([
      {
          $match: {
              tutor: tutorName,
              date: { $gte: firstDayOfYear, $lte: lastDayOfYear },
              is_delete: false
          }
      },
      {
          $group: {
              _id: null,
              totalHours: { $sum: "$hours" }
          }
          
      }
      
  ]).then(function(result) { 
      res.json(result);
  }).catch(function(err){
      console.error(err);
      res.send(err);
  });
});

/* Api to update Hours and Earnings */
app.post("/update-tutor-details", (req, res) => {
  try {
    if (req.body && req.body.name) {
      var update = {};

      if(req.body.weeklyHours) {
        update.weeklyHours = req.body.weeklyHours;
      }

      if(req.body.monthlyHours) {
        update.monthlyHours = req.body.monthlyHours;
      }

      if(req.body.yearlyHours) {
        update.yearlyHours = req.body.yearlyHours;
      }

      if(req.body.weeklyEarnings) {
        update.weeklyEarnings = req.body.weeklyEarnings;
      }

      if(req.body.monthlyEarnings) {
        update.monthlyEarnings = req.body.monthlyEarnings;
      }

      if(req.body.yearlyEarnings) {
        update.yearlyEarnings = req.body.yearlyEarnings;
      }

      tutor.findOneAndUpdate({ name: req.body.name }, update, { new: true }, (err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: 'Error updating tutor details.',
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Tutor details updated successfully.',
            user: data
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide the name and details to update.',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});


app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});
