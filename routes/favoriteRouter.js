const express = require('express'); // using express middleware
const Favorite = require('../models/favorite');  // using Campsite model
const bodyParser = require('body-parser'); // using body-parser middleware
const authenticate = require('../authenticate');
const cors = require('./cors');

const FavoriteRouter = express.Router(); 
FavoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Favorite.find()
    .populate("user")
    .populate("campsite")
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {// creating a new document in the campsite collection
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsite')
    .then((favorites) => {
        favorites.forEach((favorite) => {
            favorite.campsites.filter((campsite) => {
              // check what format the req.body comes in.  should be an array like the instructions say.
              req.body.forEach((bodyCampsite) => {
                if (campsite != bodyCampsite) {
                  favorites.campsites.push(bodyCampsite);
                }
              });
            });
          });
    })
})
    .put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {// put request that is not supported
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // delete request that is deleting any documents in the campsite collection
      favorite.deleteMany({user:req.user._id})
      .then((response) =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err)); 
    })
    favoriteRouter.route('/:campsiteId')
 .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
 .get(cors.cors, authenticate.verifyUser,(req, res, next) => {
     Campsite.findById(req.params.campsiteId)
     .populate('comments.author')
     .then(campsite => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(campsite);
     })
     .catch(err => next(err));
 })
 .post(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => { // post request that is not supported
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsite')
    .then((favorites) => {
        favorites.forEach((favorite) => {
            favorite.campsites.filter((campsite) => {
              // check what format the req.body comes in.  should be an array like the instructions say.
              req.body.forEach((bodyCampsite) => {
                if (campsite != req.params.campsiteId) {
                  favorites.campsites.push(bodyCampsite);
                }
              });
            });
          });
    })
})
    
    .put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => { // put request that is updating any campsites that have an id matching the id requested
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/campsiteId');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => { // delete request that is deleting any campsites that have an id matching the id requested
        Favorite.findOne({user: req.user._id})
        .populate('user')
        .populate('campsite')
        .then((favorite) => {
            const favs =favorite.campsites.filter((campsite) => {
                return campsite.id != req.params.campsiteId;
            });
            favorite.campsite = favs;
        })
        .catch(err => next(err)); 
    });



module.exports = FavoriteRouter;