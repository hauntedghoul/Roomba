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

function Home() {
  const [isWatered, setIsWatered] = useState(false);
  const [height, setHeight] = useState(20); // Initial height in cm
  const [currentStage, setCurrentStage] = useState(growthStages[0]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [wateringInProgress, setWateringInProgress] = useState(false); // Guard flag

  const modelRef = useRef(null);
  const logTimerRef = useRef(null);
  const wateringTimerRef = useRef(null);

  const WATERING_INTERVAL = 30000; // 30 seconds
  const LOGGING_INTERVAL = 5 * 60 * 1000; // 5 minutes

  // Train AI model
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

  // Log environment state periodically
  const logEnvironment = useCallback(() => {
    const environmentLog = {
      timestamp: new Date().toISOString(),
      soilMoisture: Math.random() * 0.2 + 0.1,
      temperature: 72,
      lightExposure: 0.5,
    };

    console.log('Environment Log:', JSON.stringify(environmentLog, null, 2));
  }, []);

  useEffect(() => {
    logTimerRef.current = setInterval(() => {
      logEnvironment();
    }, LOGGING_INTERVAL);

    return () => clearInterval(logTimerRef.current);
  }, [logEnvironment, LOGGING_INTERVAL]);

  // Determine current stage of growth
  const getCurrentStage = (height) => {
    return growthStages.find(
      (stage) => height >= stage.minHeight && height <= stage.maxHeight
    );
  };

  // Water the plant
  const waterPlant = useCallback(
    (isAi = false) => {
      if (wateringInProgress) return;

      console.log(`Watering triggered. Is AI: ${isAi}`);
      setWateringInProgress(true);
      setIsWatered(true);

      setHeight((prevHeight) => {
        const newHeight = prevHeight + 3;
        const nextStage = getCurrentStage(newHeight);

        console.log("Plant height updated:", newHeight, "Current stage:", currentStage, "Next stage:", nextStage);

        // AI Reward for watering only
        if (isAi) {
          // Reward for watering, subtract 0.5 to compensate for hook.js duplication
          setRewardPoints((prev) => prev + 1 - 0.5);
          console.log("AI rewarded 1 point for watering (adjusted for duplication).");
        }

        // Update stage, but no rewards for stage advancement
        if (nextStage !== currentStage) {
          setCurrentStage(nextStage);
          console.log("Plant advanced to the next stage:", nextStage.label);
        }

        return newHeight;
      });

      setTimeout(() => {
        setIsWatered(false);
        setWateringInProgress(false);
      }, 30000);
    },
    [wateringInProgress, currentStage]
  );

  // AI prediction for watering
  const predictAndWater = useCallback(async () => {
    console.log("AI Predict and Water Triggered");

    if (!modelRef.current || wateringInProgress || isWatered) return;

    const soilMoisture = Math.random() * 0.2 + 0.1;
    const temperature = 72;
    const lightExposure = 0.5;

    try {
      const input = tf.tensor2d([[soilMoisture, temperature, lightExposure]]);
      const prediction = modelRef.current.predict(input);
      const result = (await prediction.data())[0];

      console.log("AI Prediction Result:", result);

      input.dispose();
      prediction.dispose();

      if (result > 0.1) {
        console.log("AI decides to water.");
        waterPlant(true); // AI waters
      }
    } catch (error) {
      console.error("Error during AI prediction:", error);
    }
  }, [waterPlant, wateringInProgress, isWatered]);

  useEffect(() => {
    wateringTimerRef.current = setInterval(() => {
      predictAndWater();
    }, WATERING_INTERVAL);

    return () => clearInterval(wateringTimerRef.current);
  }, [predictAndWater]);

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
            <img className="can" src={currentStage.image} alt="Plant" />
          </div>
          <div className="Info">
            <h3>Name of the AI: Mr. Bim Bo</h3>
            <img className="Bimbo" src="/images/Bimbo.png" alt="Bimbo's face" />
            <br />
            <h3>Name of plant: Gerald the Snake Plant</h3>
            Current Height: {height} cm
            <br />
            Reward Points: {rewardPoints.toFixed(1)}
          </div>
        </div>
        <button onClick={() => waterPlant(false)} className="WaterCan">
          <img src="/images/watering.PNG" alt="watering" />
        </button>
      </div>
      <Link to="/seed">
        <button className="Seed">
          <img src="/images/Seeds.png" alt="Seeds" />
        </button>
      </Link>
    </div>
  );
}

export default Home;