import React, { useState, useEffect, useCallback, useRef } from 'react';
import './home.css';
import * as tf from '@tensorflow/tfjs';
import { Link } from 'react-router-dom';

const growthStages = [
  { minHeight: 0, maxHeight: 30, image: '/images/Stage1.png', label: 'Stage 1' },
  { minHeight: 31, maxHeight: 45, image: '/images/Stage2.png', label: 'Stage 2' },
  { minHeight: 46, maxHeight: 60, image: '/images/Stage3.png', label: 'Stage 3' },
  { minHeight: 61, maxHeight: 75, image: '/images/Stage4.png', label: 'Stage 4' },
  { minHeight: 76, maxHeight: 90, image: '/images/Stage5.png', label: 'Stage 5' },
  { minHeight: 91, maxHeight: 105, image: '/images/Stage6.png', label: 'Stage 6' },
  { minHeight: 106, maxHeight: 120, image: '/images/Stage7.png', label: 'Stage 7' },
];

const cactusGrowthStages = [
  { minHeight: 0, maxHeight: 20, image: '/images/cactus1.png', label: 'Cactus Stage 1' },
  { minHeight: 21, maxHeight: 40, image: '/images/cactus2.png', label: 'Cactus Stage 2' },
  { minHeight: 41, maxHeight: 60, image: '/images/cactus3.png', label: 'Cactus Stage 3' },
  { minHeight: 61, maxHeight: 80, image: '/images/cactus4.png', label: 'Cactus Stage 4' },
  { minHeight: 81, maxHeight: 100, image: '/images/cactus5.png', label: 'Cactus Stage 5' },
  { minHeight: 101, maxHeight: 120, image: '/images/cactus6.png', label: 'Cactus Stage 6' },
];

function Home() {
  const [isWatered, setIsWatered] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [wateringInProgress, setWateringInProgress] = useState(false);
  const [isCactus, setIsCactus] = useState(false); // Toggle for plant type

  const modelRef = useRef(null);

  // Initial states for both plants
  const initialSnakePlantState = {
    height: 20,
    currentStage: growthStages[0],
  };

  const initialCactusState = {
    height: 20,
    currentStage: cactusGrowthStages[0],
  };

  // Plant states
  const [snakePlantState, setSnakePlantState] = useState(initialSnakePlantState);
  const [cactusState, setCactusState] = useState(initialCactusState);

  // Get the current plant's state
  const { height, currentStage } = isCactus ? cactusState : snakePlantState;

  const WATERING_INTERVAL = 30000; // 30 seconds

  const trainModel = useCallback(async () => {
    const soilMoisture = tf.randomUniform([200], 0.1, 0.5);
    const temperature = tf.fill([200], 72);
    const lightExposure = tf.randomUniform([200], 0.3, 0.7);
    const labels = soilMoisture.less(0.3).cast('float32');

    const features = tf.stack([soilMoisture, temperature, lightExposure], 1);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, inputShape: [3], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    await model.fit(features, labels, {
      epochs: 10,
      batchSize: 10,
    });

    modelRef.current = model;
    tf.dispose([soilMoisture, temperature, lightExposure, labels, features]);
  }, []);

  useEffect(() => {
    trainModel();
  }, [trainModel]);

  const getCurrentStage = (height, stages) => {
    return stages.find(
      (stage) => height >= stage.minHeight && height <= stage.maxHeight
    );
  };

  const waterPlant = useCallback(() => {
    if (wateringInProgress) return;

    setWateringInProgress(true);
    setIsWatered(true);

    const setPlantState = isCactus ? setCactusState : setSnakePlantState;
    const stages = isCactus ? cactusGrowthStages : growthStages;

    setPlantState((prevState) => {
      const newHeight = prevState.height + 3;
      const nextStage = getCurrentStage(newHeight, stages);

      return { height: newHeight, currentStage: nextStage };
    });

    setTimeout(() => {
      setIsWatered(false);
      setWateringInProgress(false);
    }, 30000);
  }, [wateringInProgress, isCactus]);

  const togglePlantType = () => {
    if (isCactus) {
      setCactusState(initialCactusState); // Reset cactus state
    } else {
      setSnakePlantState(initialSnakePlantState); // Reset snake plant state
    }
    setIsCactus((prev) => !prev);
    setRewardPoints(0); // Reset reward points
  };

  return (
    <div className="home">
      <div className="content">
        <div className="plant">
          <div
            className="Water"
            style={{
              width: '300px',
              height: '400px',
              backgroundColor: isWatered ? 'green' : 'red',
            }}
          >
            <button onClick={togglePlantType}>Toggle Plant Type</button>
            <img className="can" src={currentStage.image} alt="Plant" />
          </div>

          <div className="Info">
            <h3>Name of the AI: Mr. Bim Bo</h3>
            <img className="Bimbo" src="/images/Bimbo.png" alt="Bimbo's face" />
            <br />
            <h3>Name of plant: {isCactus ? 'Cactus Gerald' : 'Snake Plant Gerald'}</h3>
            Current Height: {height} cm
            <br />
            Reward Points: {rewardPoints.toFixed(1)}
          </div>
        </div>
        <button onClick={waterPlant} className="WaterCan">
          <img src="/images/watering.PNG" alt="watering" />
        </button>
      </div>

      <Link to="/seed">
        <button className="Seed">
          <img src="/images/Seeds.PNG" alt="seed" />
        </button>
      </Link>
      <img className="Shelf" src="images/shelf.png" alt="shelf" />
    </div>
  );
}

export default Home;
