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
    const wingName = row["Wing Name"]; // Correctly getting wing name

    const floorNumber = row["Floors"];

    const numberOfHouses = parseInt(row["Number of Houses"], 10); // Correctly getting number of houses

    // Correctly find the wing by its name
    const wing = wings.find((w) => w.name === wingName); // Use wingName to find

    if (!wing) {
      // If wing doesn't exist, create a new one
      wings.push({
        name: wingName,
        floors: [
          {
            number: floorNumber,
            houses: numberOfHouses, // Store the house count directly
          },
        ],
      });
    } else {
      // If the wing exists, find the corresponding floor
      const floor = wing.floors.find((f) => f.number === floorNumber);
      if (!floor) {
        // If the floor doesn't exist, create it
        wing.floors.push({
          number: floorNumber,
          houses: numberOfHouses, // Store the house count directly
        });
      } else {
        // If the floor exists, accumulate the number of houses
        floor.houses += numberOfHouses; // Accumulate the count of houses
      }
    }
  });

  return wings;
};
