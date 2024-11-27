const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'plants.json');

// Helper function to read the JSON file
const readJsonFile = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return { plants: [] };
  }
};

// Function to get all plants
const getAllPlants = () => {
  const data = readJsonFile();
  return data.plants;
};

// Function to get a plant by ID
const getPlantById = (plantId) => {
  const data = readJsonFile();
  return data.plants.find(plant => plant.plantId === plantId);
};

module.exports = {
  getAllPlants,
  getPlantById
};
