const multer = require("multer");
const path = require("path");
const jimp = require("jimp");
// const nodemailer = require("nodemailer");
const Users = require("../model/users");
const contacts= require("../model/contact-list");
const bcrypt=require('bcryptjs');




//set storage engine for avatar
const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
  cb(null, 'public/uploads/avatars')
  },
  filename:  (req, file, cb) => {
    cb(null, Date.now() + '-' +file.originalname )
  }
})
//init upload for avatar
const upload = multer({ storage: storage }).single('file');

exports.newUser = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // if (!name || !email || !password || !password2) {
  //   errors.push({ msg: "Passwords do not match" });
  // }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.json({
      status: "error",
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    Users.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.json({
          status: "error",
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // if there is no exists email add new user
        const newUser = new Users({
          name,
          email,
          password
        });

        // hash passport
        // genSalt is a method for bcrypt and 10 is number of characters
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set password to hashed
            newUser.password = hash;
            // save user
            newUser
              .save()
              .then(user => {
                res.json({
                  status: "success"
                });
              })
              .catch(err => res.json({ status: "error", errors: err }));
          });
        });
      }
    });
  }
};
exports.loginUser = (req, res) =>{
  const { email, password } = req.body;
  let errors = [];
  if (!email ) {
    errors.push({ msg: "Enter email address" });
  }
  if(password.trim().length < 6){
    errors.push({ msg: "Password must be at least 6 characters" });
    res.json({
      status: "error",
      errors
    });
  }else{
    Users.findOne({email: email})
      .then(user => {
        if (!user) {
          errors.push({msg: "That email is not registered" })
           res.json({
              status: "error",
              errors
            });
        }else{
        // Match password
        // compare existing passport and user passports
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err){ 
            errors.push({msg: "Something happend with server please try again!"});
            res.json({
              status: "error",
              errors
            })
          }
          if (isMatch) {
            console.log(user['_doc']);
            res.json({
              status: "success",
              id: user['_doc']._id,
              name : user['_doc'].name,
              email: user['_doc'].email,
              date: user['_doc'].date
            })
          } else {
            errors.push({ msg: "Password incorrect" });
            res.json({
              status: "error",
              errors
            })
          }
        });
      }
  });
}
}
exports.uploadAvatar = (req, res) =>{
  upload(req, res, (err) => {
    let errors = [];
    let fileName = req.file.filename;
    //check if there is a photo
    if (fileName) {
      //On here we will process the image resizing
      jimp.read("public/uploads/avatars/" + fileName, (err, file) => {
        if (err) {
          errors.push("something happened while uploading picture");
          res.json({
            status: "error",
            errors
          })
        }
        file
          .resize(250, 250) //resize
          .quality(60) // set the quality of image
          .write("public/uploads/avatars/" + fileName); //save
      });
      res.json({
        status: "success",
        avatar: fileName
      })
    }
  });
}
exports.newContact = (req, res) => {
  let errors = [];
    let newContact = {
      userID: req.body.userID,
      name: req.body.name,
      email: req.body.email,
      avatar: req.body.avatar
    };
    //mongo goes here...
    contacts.create(newContact, (err, contacts) => {
      if (err) {
    console.log(contacts, err);
        errors.push({msg: "Something happened while creating contact please try again"});
        res.json({
          status: "error",
          errors
        })
      }
      else{
        console.log(contacts)
        res.json({
          status: "success",
          newContactData: newContact
        })
      }
    });
};
// //set storage engine for email
// const attachStorager = multer.diskStorage({
//   destination: "public/uploads/attachments",
//   filename: (req, file, cb) => {
//     fileName = "at." + Date.now() + path.extname(file.originalname);
//     cb(null, fileName);
//   }
// });

// //init upload for email
// const attachUpload = multer({
//   storage: attachStorager
// }).single("attach");

// exports.homeRoute = (req, res) => {
//   contacts.find({}, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("index", { contactData: result });
//     }
//   });
// };



// //This function gets the ID and delete contact from contactList array
// exports.deleteContact = (req, res) => {
//   //const {id} = req.params;
//   //console.log(id);

//   contacts.findOneAndRemove({ _id: req.params.id }, (err, result) => {
//     if (err) console.log(err);
//     else console.log(result);
//   });

//   res.redirect("/");
// };

// exports.sendMail = (req, res) => {
//   attachUpload(req, res, () => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: req.body.user, // generated ethereal user
//         pass: req.body.pass // generated ethereal password
//       }
//     });

//     // send mail with defined transport object
//     let info = {
//       from: '"FBW6 Contact List Project 👻" <fb6@dci.com>', // sender address
//       to: req.body.to, // list of receivers
//       cc: req.body.cc,
//       subject: req.body.subject, // Subject line
//       html: "<b>" + req.body.message + "</b>", // html body
//       attachments: [
//         {
//           filename: fileName,
//           path: "public/uploads/attachments/" + fileName
//         }
//       ]
//     };

//     transporter.sendMail(info, (err, info) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Message sent to : " + info.messageId);
//       }
//     });

//     fileName = null;
//     res.redirect("/");
//   });
// };

// exports.updateContact = (req, res) => {
//   upload(req, res, () => {
//     console.log(req.body);

//     //mongo goes here...
//     let updatedContact = {};
//     if (req.body.name != "") {
//       updatedContact.name = req.body.name;
//     }

//     if (req.body.email != "") {
//       updatedContact.mail = req.body.email;
//     }

//     if (fileName != null) {
//       updatedContact.avatar = fileName;
//       console.log(fileName);
//       //On here we will process the image resizing
//       jimp.read("public/uploads/avatars/" + fileName, (err, file) => {
//         if (err) throw err;
//         file
//           .resize(250, 250) //resize
//           .quality(60) // set the quality of image
//           .write("public/uploads/avatars/" + fileName); //save
//       });
//     }

//     if (updatedContact != {}) {
//       contacts.updateOne(
//         { _id: req.body.id },
//         { $set: updatedContact },
//         (err, result) => {
//           if (err) console.log(err);
//           else console.log(result);
//         }
//       );
//       fileName = null;
//     }
//     res.redirect("/");
//   });
// };

