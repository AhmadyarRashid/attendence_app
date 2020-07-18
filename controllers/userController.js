const crypt = require("../helpers/crypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../helpers/db");
const { ROLES } = require("../constants/contants");
const geolib = require('geolib');
const {
  getFailureResponse,
  getSuccessResponse
} = require("../helpers/response");

module.exports.login = function (req, res, next) {
  const { mobile_no, password, lat, lng } = req.body;
  try {
    db.executeQuery(
      `select * from login where mobile_no = ? and password = ?`,
      [mobile_no, password]
    )
      .then(rows => {
        // TODO own code for login
        if (rows.length > 0) {
          db.executeQuery(`select * from store_location where store_id = ?`, [rows[0].store_id])
            .then(doc => {
              if (doc.length > 0) {
                res.status(200).json(getSuccessResponse({ rows, doc }))
                // console.log('---- data ----', rows, doc, lat, lng)
                // let withinRadius = geolib.isPointWithinRadius(
                //   { latitude: parseFloat(lat), longitude: parseFloat(lng) },
                //   { latitude: parseFloat(doc[0].leti), longitude: parseFloat(doc[0].longi) },
                //   parseFloat(doc[0].radius)
                // );

                // // user is within radius or not 
                // if (withinRadius) {
                //   console.log('login response is ---', { rows, doc })
                 
                // } else {
                //   res.status(200).json(getFailureResponse('You are not in radius of store'));
                // }

              } else {
                res.status(200).json(getFailureResponse("No store is assign to that user"));
              }
            })
            .catch(err => {
              res.status(200).json(getFailureResponse("Network Error"));
            });
          // res.status(200).json(getSuccessResponse(rows));
        } else {
          res.status(200).json(getFailureResponse("Your cell# or password is incorrect"));
        }
      })
      .catch(err => {
        console.log(err);
        res.status(200).json(getFailureResponse("Network Error"));
      });
  } catch (ex) {
    console.log("Error in UserController at authenticate function :" + ex);
    res.status(200).json(getFailureResponse());
  }
};

module.exports.register = function (req, res, next) {
  const { name, email, mobile_no, password, lati, longi } = req.body;
  console.log('--- register ---', req.body);
  try {
    db.executeQuery("SELECT * FROM login WHERE mobile_no = ?", [mobile_no])
      .then(rows => {
        if (rows.length > 0) {
          res.status(200).json(getFailureResponse("mobile_no already exists."));
        } else {
          // TODO
          db.executeQuery("INSERT into login (name, email, mobile_no, password, lati, longi) values (?,?,?,?,?,?)", [name, email, mobile_no, password, lati, longi])
            .then(response => {
              if (response) {
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
  const { user_id, time, currentDate, lat, lng } = req.body;
  console.log('check in ', user_id, time, currentDate, lat, lng);

  // ============ check
  db.executeQuery(`select * from login where id = ?`, [user_id])
    .then(getStoreId => {
      db.executeQuery(`select * from store_location where store_id = ?`, [getStoreId[0].store_id])
        .then(storeDetails => {
          if (storeDetails.length > 0) {
            let withinRadius = geolib.isPointWithinRadius(
              { latitude: parseFloat(lat), longitude: parseFloat(lng) },
              { latitude: parseFloat(storeDetails[0].leti), longitude: parseFloat(storeDetails[0].longi) },
              parseFloat(storeDetails[0].radius)
            );
            if (withinRadius) {
              try {
                db.executeQuery("select * from attendence where user_id = ? and date =?", [user_id, currentDate])
                  .then(rows => {
                    if (rows.length > 0) {
                      console.log(rows);
                      const { id, IN1, IN2, IN3, IN4, IN5, IN6 } = rows[0];
                      if (IN1 == null) {
                        db.executeQuery("update attendence set IN1 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (IN2 == null) {
                        db.executeQuery("update attendence set IN2 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (IN3 == null) {
                        db.executeQuery("update attendence set IN3 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (IN4 == null) {
                        db.executeQuery("update attendence set IN4 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (IN5 == null) {
                        db.executeQuery("update attendence set IN5 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (IN6 == null) {
                        db.executeQuery("update attendence set IN6 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else {
                        res.status(200).json(getSuccessResponse("Your Check limit exceeded"));
                      }
                    } else {
                      db.executeQuery("insert into attendence (user_id, date, IN1) values (?, ?, CURRENT_TIMESTAMP)", [user_id, currentDate])
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
            } else {
              console.log('===== you are not in radius ----')
              res.status(200).json(getFailureResponse('You are not with in radius of assigned stored'))
            }
            // return withinRadius;
          }
        })
        .catch(err => {
          console.log('---- error ----', err)
        })
    })
    .catch(err => {
      console.log('---- error ----', err)
    });
};

module.exports.checkOut = function (req, res, next) {
  const { user_id, time, currentDate, lat, lng } = req.body;
  console.log('check out ', user_id, time, currentDate, lat, lng);

  // ============ check
  db.executeQuery(`select * from login where id = ?`, [user_id])
    .then(getStoreId => {
      db.executeQuery(`select * from store_location where store_id = ?`, [getStoreId[0].store_id])
        .then(storeDetails => {
          if (storeDetails.length > 0) {
            let withinRadius = geolib.isPointWithinRadius(
              { latitude: parseFloat(lat), longitude: parseFloat(lng) },
              { latitude: parseFloat(storeDetails[0].leti), longitude: parseFloat(storeDetails[0].longi) },
              parseFloat(storeDetails[0].radius)
            );

            if (withinRadius) {
              try {
                db.executeQuery("select * from attendence where user_id = ? and date = ?", [user_id, currentDate])
                  .then(rows => {
                    if (rows.length > 0) {
                      const { id, OUT1, OUT2, OUT3, OUT4, OUT5, OUT6 } = rows[0];
                      if (OUT1 == null) {
                        db.executeQuery("update attendence set OUT1 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (OUT2 == null) {
                        db.executeQuery("update attendence set OUT2 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (OUT3 == null) {
                        db.executeQuery("update attendence set OUT3 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (OUT4 == null) {
                        db.executeQuery("update attendence set OUT4 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (OUT5 == null) {
                        db.executeQuery("update attendence set OUT5 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else if (OUT6 == null) {
                        db.executeQuery("update attendence set OUT6 = CURRENT_TIMESTAMP where id = ?", [id])
                          .then(data => {
                            res.status(200).json(getSuccessResponse(data));
                          })
                          .catch(err => {
                            res.status(200).json(getFailureResponse("Some Network Issue"));
                          })
                      } else {
                        res.status(200).json(getSuccessResponse("Your Check limit exceeded"));
                      }
                    } else {
                      db.executeQuery("insert into attendence (user_id, date, OUT1) values (?, ?, CURRENT_TIMESTAMP)", [user_id, currentDate])
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
            } else {
              console.log('===== you are not in radius ----')
              res.status(200).json(getFailureResponse('You are not with in radius of assigned stored'))
            }
            // return withinRadius;
          }
        })
        .catch(err => {
          console.log('---- error ----', err)
        })
    })
    .catch(err => {
      console.log('---- error ----', err)
    });
};

module.exports.getAllDataById = function (req, res, next) {
  const { user_id, currentDate } = req.body;
  try {
    db.executeQuery("Select * from attendence where user_id=? and date= ?", [
      user_id, currentDate
    ])
      .then(rows => {
        if (rows.length > 0) {
          const data = rows[0];
          let disable = 'checkOut';
          let a = Object.entries(data);
          for (item of a) {
            if (item[1] == null && item[0].substring(0, 2) == 'IN') {
              disable = 'checkIn';
              break;
            }
            if (item[1] == null && item[0].substring(0, 2) == 'OU') {
              disable = 'checkOut';
              break;
            }
          }
          // console.log('final --', disable)
          res.status(200).json(getSuccessResponse({ disable, rows }));
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

module.exports.getAllLocations = (req, res, next) => {
  try {
    db.executeQuery(
      `select * from store_location`
    ).then(resposne => {
      res.status(200).json(getSuccessResponse(resposne));
    }).catch(err => {
      res.status(200).json(getFailureResponse('Failed to load'))
    })
  } catch (e) {
    res.status(200).json(getFailureResponse('Something went wrong'));
  }
}

module.exports.getDateFilter = (req, res, next) => {
  const { user_id, fDate, tDate } = req.body;
  try {
    db.executeQuery(
      `select * from attendence where date >= ? and date <= ? and user_id = ?`, [fDate, tDate, user_id]
    ).then(rows => {
      res.status(200).json(getSuccessResponse({ rows }));
    }).catch(err => {
      res.status(200).json(getFailureResponse('Failed to load'))
    })
  } catch (e) {
    res.status(200).json(getFailureResponse('Something went wrong'));
  }
}

module.exports.changePassword = (req, res, next) => {
  const {user_id, newPassword} = req.body;

  try{
    db.executeQuery(
      `update login set password = ? where id = ?`, [newPassword, user_id]
    ).then(rows => {
      res.status(200).json(getSuccessResponse({ rows }));
    }).catch(err => {
      res.status(200).json(getFailureResponse('Failed to load'))
    })
  }catch(e){
    res.status(200).json(getFailureResponse('Something went wrong'));
  }
}