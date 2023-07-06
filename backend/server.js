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
var product = require("./model/product.js");
var user = require("./model/user.js");
var student = require("./model/student.js");
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
            console.log(data[0])
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
app.post("/add-product", upload.any(), (req, res) => {
  
  try {
    if (req.files && req.body && req.body.name && req.body.comments && req.body.taskAssignment && req.body.sessionDay && req.body.sessionMonth && req.body.sessionYear  && req.body.subject &&
      req.body.hours && req.body.tutor) {
      let new_product = new product();
      new_product.name = req.body.name;
      new_product.comments = req.body.comments;
      new_product.taskAssignment = req.body.taskAssignment;
      new_product.sessionDay = req.body.sessionDay;
      new_product.sessionMonth = req.body.sessionMonth;
      new_product.sessionYear = req.body.sessionYear;
      new_product.subject = req.body.subject;
      new_product.attendance = req.body.attendance;
      new_product.tutor = req.body.tutor;
      new_product.hours = req.body.hours;
      new_product.user_id = req.user.id;
      new_product.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Product Added successfully.'
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
app.post("/update-product", upload.any(), (req, res) => {
  try {
    if (req.files && req.body && req.body.comments && req.body.taskAssignment && req.body.sessionDay && req.body.sessionMonth && req.body.sessionYear &&
      req.body.id && req.body.hours) {

      product.findById(req.body.id, (err, new_product) => {

        if (req.files && req.files[0] && req.files[0].filename) {
          new_product.image = req.files[0].filename;
        }
        if (req.body.comments) {
          new_product.comments = req.body.comments;
        }
        if (req.body.taskAssignment) {
          new_product.taskAssignment = req.body.taskAssignment;
        }
        if (req.body.sessionDay) {
          new_product.sessionDay = req.body.sessionDay;
        }
        if (req.body.sessionMonth) {
          new_product.sessionMonth = req.body.sessionMonth;
        }
        if (req.body.sessionYear) {
          new_product.sessionYear = req.body.sessionYear;
        }
        if (req.body.hours) {
          new_product.hours = req.body.hours;
        }

        new_product.save((err, data) => {
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
app.post("/delete-product", (req, res) => {
  try {
    if (req.body && req.body.id) {
      product.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
          res.status(200).json({
            status: true,
            title: 'Product deleted.'
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
        tutors: tutors
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
app.get("/get-product", (req, res) => {
  try {
    var query = {};
    query["$and"] = [];
    query["$and"].push({
      is_delete: false,
      user_id: req.user.id
    });
    if (req.query && req.query.search) {
      query["$and"].push({
        name: { $regex: req.query.search }
      });
    }
    var perPage = 8;
    var page = req.query.page || 1;
    product.find(query, { date: 1, name: 1, id: 1, comments: 1, taskAssignment: 1,sessionDay: 1,sessionYear: 1,sessionMonth: 1, subject: 1, attendance: 1, hours: 1, tutor: 1 })
      .sort({date: -1})  // Sorting in descending order
      .skip((perPage * page) - perPage).limit(perPage)
      .then((data) => {
        product.find(query).count()
          .then((count) => {

            if (data && data.length > 0) {
              res.status(200).json({
                status: true,
                title: 'Product retrived.',
                products: data,
                current_page: page,
                total: count,
                pages: Math.ceil(count / perPage),
              });
            } else {
              res.status(400).json({
                errorMessage: 'There is no product!',
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




/*Api to get and search users with pagination and search by username*/
app.get("/get-users", (req, res) => {
  try {
    var query = {};
    if (req.query && req.query.search) {
      query["fullName"] = { $regex: req.query.search };
    }
    var perPage = 8;
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


/* Api to add Student */
app.post("/add-student", upload.any(), (req, res) => {
  
  try {
    if (req.body && req.body.name && req.body.tutor && req.body.grade ) {
      let new_student = new student();
      new_student.name = req.body.name;
      new_student.tutor = req.body.tutor;
      new_student.grade = req.body.grade;
      new_student.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Student Info Added successfully.'
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


/* Api to update students */
app.post("/update-student", (req, res) => {
  
  try {
    if (req.body && req.body.id) {
      var update = {};

      if(req.body.name) {
        update.name = req.body.name;
      }
      if(req.body.tutor) {
        update.tutor = req.body.tutor;
      }
      if(req.body.grade) {
        update.grade = req.body.grade;
      }
      if(req.body.averageMark) {
        update.averageMark = req.body.averageMark;
      }

      student.findByIdAndUpdate(req.body.id, update, { new: true }, (err, data) => {
        
        if (err) {
          res.status(400).json({
            errorMessage: 'Error updating student.',
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Student updated successfully.',
            user: data
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide the student ID and details to update.',
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
/* Api to delete Students */
app.post("/delete-student", (req, res) => {
  try {
    if (req.body && req.body.id) {
      student.findByIdAndRemove(req.body.id, (err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: 'Error deleting student.',
            status: false
          });
        } else {
          res.status(200).json({
            status: true,
            title: 'Student deleted successfully.'
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: 'Please provide the student ID.',
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

