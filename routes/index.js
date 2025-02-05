const express = require("express");
const router = express.Router();
const request = require("request");

const apiKey = process.env.API_KEY;

const apiBaseUrl = "http://api.themoviedb.org/3";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = "http://image.tmdb.org/t/p/w500";

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  request.get(nowPlayingUrl, (err, response, movieData) => {
    const parsedData = JSON.parse(movieData);

    res.render("index", {
      parsedData: parsedData.results,
    });
  });
});

router.get("/movie/:id", (req, res, next) => {
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;

  request.get(thisMovieUrl, (err, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    res.render("single-movie", {
      parsedData,
    });
  });
});

router.post("/search", (req, res, next) => {
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;

  request.get(movieUrl, (err, response, movieData) => {
    let parsedData = JSON.parse(movieData);

    if (cat === "person") {
      parsedData.results = parsedData.results[0].known_for;
    }

    res.render("index", {
      parsedData: parsedData.results,
    });
  });
});
module.exports = router;
