const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const mainUrl = "https://ny.bestfriends.org";
const url =
  "https://ny.bestfriends.org/get-involved/adopt/pets?field_animal_species_tid_selective=974&field_animal_sex_value_selective=All&field_animal_age_value_selective=All&field_animal_size_value_selective=All&field_animal_name_value=&sort_by=created_1&sort_by=created_1";

request(url, (err, response, html) => {
  if (!err && response.statusCode == 200) {
    const $ = cheerio.load(html);
    //console.log($(html))
    const dogData = $(".pet-list-item"); //searching by class
    const dogLinks = [];

    dogData.each((i, dog) => {
      //retreiving link to single dog landning page
      //looping through the array
      // const item = $(el).text();
      const link = $(dog)
        .find("a")
        .attr("href");
      // const itemId = link.slice(24);
      dogLinks.push(link);
    });

    const allDogData = [];
    for (let i = 0; i < dogLinks.length; i++) {
      const link = mainUrl + dogLinks[i];

      request(link, (err, response, html) => {
        //second client request call to single page view
        if (!err && response.statusCode == 200) {
          const $ = cheerio.load(html);
          // const dogDetails = $(".pet-card").text();
          const image = $(".pet-card").children()[0].childNodes[1].attribs.src;
          // .attr("src");
          const name = $(".pet-card")
            .find("h3")
            .text()
            .split("        ")[1]
            .split("      ")[0];
          const breed = $(".petpoint-pet-breeds")
            .children(".info")
            .text();
          const age = $(".petpoint-pet-age")
            .children(".info")
            .text()
            .split("            ")[1]
            .split("      ")[0];
          const sex = $(".petpoint-pet-sex")
            .children(".info")
            .text();
          const size = $(".petpoint-pet-weight")
            .children(".info")
            .text()
            .split("pounds")
            .join("pounds / ");
          const color = $(".petpoint-pet-color")
            .children(".info")
            .text();

          const data = {
            //store the data I was to display on app as an object and pushing it into an array of allDogData
            link,
            image,
            name,
            breed,
            age,
            sex,
            size,
            color
          };
          allDogData.push(data);
          saveData(allDogData);
        } else console.log("Unable to find this specific dog", err);
      });
    }
  } else console.log("Cannot process your request for", url, err);
});

function saveData(data) {
  const contents = JSON.stringify(data, null, 2);
  const filePath = path.join(__dirname, "seed-data.json");
  fs.writeFile(filePath, contents, "utf8", function(err) {
    if (err) console.log(err);
    else console.log("The data from bestfriends.org was saved!");
  });
}
