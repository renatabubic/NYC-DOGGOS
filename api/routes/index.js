const express = require("express");
const router = express.Router();
const bffData = require("./seed-data.json");
const nycaccData = require("./seed-data2.json");

const data = bffData.concat(nycaccData); //one variable for all data

router.get("/", function(req, res, next) {
  try {
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get("/:breed", function(req, res, next) {
  try {
    const selectedBreed = req.params.breed;
    const selectedPet = [];

    data.map(pet => {
      const breed = pet.breed.split(" ");
      if (selectedBreed === "purebred" && pet.breed !== "unknown") {
        if (breed === 1) {
          console.log(pet);
          selectedPet.push(pet);
        }
      } else if (selectedBreed === "mixed" || pet.breed === "unknown") {
        if (breed.length > 1) {
          selectedPet.push(pet);
        }
      }
    });

    res.json(selectedPet);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
