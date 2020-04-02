const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const mainUrl = "https://www.nycacc.org";
const url =
  "https://www.nycacc.org/adopt/adoption-search?field_animal_id=&field_type=3&field_contact_location=All";

const totalPages = 9;
for (let i = 0; i <= totalPages; i++) {
  const loopedUrl = `${url}&page=${i}`;

  request(loopedUrl, (err, response, html) => {
    if (!err && response.statusCode == 200) {
      const $ = cheerio.load(html);

      const dogData = $(".field-content");
      const dogLinks = [];
      dogData.each((i, dog) => {
        const link = $(dog)
          .find("a")
          .attr("href");
        if (link) dogLinks.push(link);
      });

      const allDogData = [];
      for (let i = 0; i < dogLinks.length; i++) {
        const link = mainUrl + dogLinks[i];

        request(link, (err, response, html) => {
          if (!err && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const image = $(".animal-image-detail")
              .attr("style")
              .split("(")[1]
              .split(")")[0]
              .slice(1)
              .slice(0, -1);

            const name = $(".col-xs-12")
              .find("h2")
              .text()
              .split("\n")[0];

            const sex = $(".animal-specifications")
              .find("p")
              .text()
              .split("Sex: ")[1]
              .split("Age")[0];

            const age = $(".animal-specifications")
              .find("p")
              .text()
              .split("Sex: ")[1]
              .split("Age")[1]
              .split(": ")[1]
              .split(" years")[0];

            const size = $(".animal-specifications")
              .find("p")
              .text()
              .split("Weight: ")[1]
              .split(" lbs.")[0];

            const color = $(".animal-specifications")
              .find("p")
              .text()
              .split("Primary Color: ")[1]
              .split("Secondary")[0]
              .split("Brindle")[0]
              .split("Weight: ")[0];

            const data = {
              link,
              image,
              name,
              breed: "unknown",
              age,
              sex,
              size,
              color
            };
            allDogData.push(data);
          }
          const filteredDogs = [];
          const names = [];
          allDogData.map(dog => {
            if (!names.includes(dog.name)) {
              names.push(dog.name);
              filteredDogs.push(dog);
            }
          });
          console.log(filteredDogs.flat());
          saveData(filteredDogs.flat());
        });
      }
    } else console.log("Cannot process your request for", url, err);
  });
}

function saveData(data) {
  const contents = JSON.stringify(data, null, 2);
  const filePath = path.join(__dirname, "seed-data2.json");
  fs.writeFile(filePath, contents, "utf8", function(err) {
    if (err) console.log(err);
    else console.log("The data from bestfriends.org was saved!");
  });
}
