const crypt = require("../helpers/crypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../helpers/db");
const { ROLES } = require("../constants/contants");
const {
  getFailureResponse,
  getSuccessResponse
} = require("../helpers/response");

module.exports.login = function (req, res, next) {
  const { mobile_no, password } = req.body;
  try {
    db.executeQuery(
      `select * from login where mobile_no = ? and password = ?`,
      [mobile_no, password]
    )
      .then(rows => {
          // TODO own code for login
          if(rows.length > 0){
            res.status(200).json(getSuccessResponse(rows));
          }else{
            res.status(200).json(getFailureResponse("Username and password are wrong"));
          }
      })
      .catch(err => {
        console.log("Error in UserController at authenticate function :");
        console.log(err);
        res.status(200).json(getFailureResponse("Network Error"));
      });
  } catch (ex) {
    console.log("Error in UserController at authenticate function :" + ex);
    res.status(200).json(getFailureResponse());
  }
};

module.exports.register = function (req, res, next) {
  const { name, email, mobile_no, password} = req.body;
  try {
    db.executeQuery("SELECT * FROM login WHERE mobile_no = ?", [mobile_no])
      .then(rows => {
        if (rows.length > 0) {
          res.status(200).json(getFailureResponse("mobile_no already exists."));
        } else {
          // TODO
          db.executeQuery("INSERT into login (name, email, mobile_no, password) values (?,?,?,?)", [name, email, mobile_no, password])
            .then(response => {
              if(response){
                res.status(200).json(getSuccessResponse(response));
              }
            })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(200).json(getFailureResponse());
      });
  } catch (ex) {
    console.log(ex);
    res.status(200).json(getFailureResponse());
  }
};

module.exports.checkIn = function (req, res, next) {
  const {user_id} = req.body;
  const date = new Date();
  const currentDate = date.getFullYear() + "-" + Number(date.getMonth() + 1) + "-" + date.getDate();
  try {
    db.executeQuery("select * from attendence where user_id = ? and date =?", [user_id, currentDate])
      .then(rows => {
        const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        if(rows.length > 0){
          console.log(rows);
          const {id, IN1, IN2, IN3, IN4, IN5, IN6} = rows[0];
          if(IN1 == null){
            db.executeQuery("update attendence set IN1 = ? where id = ?", [time , id])
              .then(data => {
                res.status(200).json(getSuccessResponse(data));
              })
              .catch(err => {
                res.status(200).json(getFailureResponse("Some Network Issue"));
              })
          }else if(IN2 == null){
            db.executeQuery("update attendence set IN2 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(IN3 == null){
            db.executeQuery("update attendence set IN3 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(IN4 == null){
            db.executeQuery("update attendence set IN4 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(IN5 == null){
            db.executeQuery("update attendence set IN5 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(IN6 == null){
            db.executeQuery("update attendence set IN6 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else{
            res.status(200).json(getSuccessResponse("Your Check limit exceeded"));
          }
        }else{
          db.executeQuery("insert into attendence (user_id, date, IN1) values (?, ?, ?)" , [user_id, currentDate, time])
            .then(rows => {
              res.status(200).json(getSuccessResponse(rows));
            })
            .catch(err => {
              res.status(200).json(getSuccessResponse("Some Network Issue"));
            });
        }
      })
  } catch (ex) {
    console.log(ex);
    res.status(200).json(getFailureResponse());
  }
};

module.exports.checkOut = function (req, res, next) {
  const {user_id} = req.body;
  const date = new Date();
  const currentDate = date.getFullYear() + "-" + Number(date.getMonth() + 1) + "-" + date.getDate();
  try {
    db.executeQuery("select * from attendence where user_id = ? and date =?", [user_id, currentDate])
      .then(rows => {
        const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        if(rows.length > 0){
          const {id, OUT1, OUT2, OUT3, OUT4, OUT5, OUT6} = rows[0];
          if(OUT1 == null){
            db.executeQuery("update attendence set OUT1 = ? where id = ?", [time , id])
              .then(data => {
                res.status(200).json(getSuccessResponse(data));
              })
              .catch(err => {
                res.status(200).json(getFailureResponse("Some Network Issue"));
              })
          }else if(OUT2 == null){
            db.executeQuery("update attendence set OUT2 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(OUT3 == null){
            db.executeQuery("update attendence set OUT3 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(OUT4 == null){
            db.executeQuery("update attendence set OUT4 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(OUT5 == null){
            db.executeQuery("update attendence set OUT5 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else if(OUT6 == null){
            db.executeQuery("update attendence set OUT6 = ? where id = ?", [time , id])
            .then(data => {
              res.status(200).json(getSuccessResponse(data));
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Some Network Issue"));
            })
          }else{
            res.status(200).json(getSuccessResponse("Your Check limit exceeded"));
          }
        }else{
          db.executeQuery("insert into attendence (user_id, date, OUT1) values (?, ?, ?)" , [user_id, currentDate, time])
            .then(rows => {
              res.status(200).json(getSuccessResponse(rows));
            })
            .catch(err => {
              res.status(200).json(getSuccessResponse("Some Network Issue"));
            });
        }
      })
  } catch (ex) {
    console.log(ex);
    res.status(200).json(getFailureResponse());
  }
};

module.exports.getAllDataById = function (req, res, next) {
  const {user_id} = req.body;
  const date = new Date();
  const currentDate = date.getFullYear() + "-" + Number(date.getMonth() + 1) + "-" + date.getDate();
  try {
    db.executeQuery("Select * from attendence where user_id=? and date=?", [
      user_id, currentDate
    ])
      .then(rows => {
        if (rows.length > 0) {
          res.status(200).json(getSuccessResponse(rows));
        } else {
          res.status(200).json(getFailureResponse("No data found"));
        }
      })
      .catch(err => {
        console.log(err);
        res.status(200).json(getFailureResponse());
      });
  } catch (ex) {
    console.log(ex);
    res.status(200).json(getFailureResponse());
  }
};