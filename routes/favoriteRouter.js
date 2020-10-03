const express = require("express"); // using express middleware
const Favorite = require("../models/favorite"); // using Campsite model
const bodyParser = require("body-parser"); // using body-parser middleware
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find()
      .populate("user")
      .populate("campsite")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsite")
      .then((favorites) => {
        if (favorites.length < 1) {
          Favorite.create({ user: req.user._id, campsites: req.body })
            .then((favorite) => {
              console.log("fav Created ", favorite);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
       
          favorites.forEach((favorite) => {
            favorite.campsites.filter((campsite) => {
           
              req.body.forEach((bodyCampsite) => {
                if (campsite != bodyCampsite) {
                  favorites.campsites.push(bodyCampsite);
                }
              });
            });
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   
    Favorite.deleteMany({ user: req.user._id })
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });
favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403;
    res.end("GET operation not supported on /favorites");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .populate("user")
     
      .then((favorite) => {
       
        if (favorite.campsites.includes(req.params.campsiteId)) {
          err = new Error(
            `Campsite ${req.params.campsiteId} already a favorite..`
          );
          err.status = 400;
          return next(err);
        } else {
          favorite.campsites.push(req.params.campsiteId);
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // put request that is not supported
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites/campsiteId");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        console.log(favorite); // can do this in one line prob
        const favs = favorite.campsites.filter((campsite) => {
          if (campsite.id != req.params.campsiteId) {
            return campsite;
          }
        });
        favorite.campsites = favs;
        favorite
          .save()
          .then((favorite) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;