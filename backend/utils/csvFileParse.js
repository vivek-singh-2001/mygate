const fs = require("fs");
const csv = require("csv-parser");

// Function to parse the CSV file
exports.parseCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(processCsvData(results));
      })
      .on("error", (err) => reject(err));
  });
};

// Helper function to structure the data from CSV into a proper format
const processCsvData = (csvData) => {
  const wings = [];



  csvData.forEach((row) => {
    const wingName = row["Wing Name"]?.trim();

    const floorNumber = row[" Floors"]?.trim();

    const numberOfHouses = parseInt(row["Number of Houses "]?.trim(), 10);

    // Correctly find the wing by its name
    const wing = wings.find((w) => w.name === wingName);

    if (!wing) {
      wings.push({
        name: wingName,
        floors: [
          {
            number: floorNumber,
            houses: numberOfHouses,
          },
        ],
      });
    } else {
      const floor = wing.floors.find((f) => f.number === floorNumber);
      if (!floor) {
        wing.floors.push({
          number: floorNumber,
          houses: numberOfHouses,
        });
      } else {
        floor.houses += numberOfHouses;
      }
    }
  });



  return wings;
};
