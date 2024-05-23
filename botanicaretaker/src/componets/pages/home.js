import React, { useState, useEffect, useCallback, useRef } from 'react';
import './home.css';
import * as tf from '@tensorflow/tfjs';

const growthStages = [
  { minHeight: 0, maxHeight: 30, image: '/images/Stage1.png', label: 'Stage 1' },
  { minHeight: 31, maxHeight: 45, image: '/images/Stage2.png', label: 'Stage 2' },
  { minHeight: 46, maxHeight: 60, image: '/images/Stage3.png', label: 'Stage 3' },
  { minHeight: 61, maxHeight: 75, image: '/images/Stage4.png', label: 'Stage 4' },
  { minHeight: 76, maxHeight: 90, image: '/images/Stage5.png', label: 'Stage 5' },
  { minHeight: 91, maxHeight: 105, image: '/images/Stage6.png', label: 'Stage 6' },
  { minHeight: 106, maxHeight: 120, image: '/images/Stage7.png', label: 'Stage 7' }
];

function Home() {
  const [isWatered, setIsWatered] = useState(false);
  const [height, setHeight] = useState(30); // Initial height of the plant in cm
  const [currentStage, setCurrentStage] = useState(growthStages[0]);
  const modelRef = useRef(null);
  const epochLogRef = useRef({});

  const createAndTrainModel = useCallback(async () => {
    if (modelRef.current) {
      modelRef.current.dispose();
    }

    const numSamples = 100;
    const soilMoisture = tf.randomUniform([numSamples], 0.1, 0.4);
    const temperature = tf.fill([numSamples], 72);
    const humidity = tf.randomUniform([numSamples], 20, 50);
    const lightExposure = tf.fill([numSamples], 0.5);
    const waterMl = tf.randomUniform([numSamples], 10, 50);

    const features = tf.stack([soilMoisture, temperature, humidity, lightExposure], 1);
    const labels = soilMoisture.less(0.3).cast('float32');

    const newModel = tf.sequential();
    newModel.add(tf.layers.dense({ units: 4, inputShape: [4], activation: 'relu' }));
    newModel.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    newModel.compile({
      optimizer: tf.train.adam(),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });

    const summarizeArray = (arr) => {
      const min = tf.min(arr).arraySync();
      const max = tf.max(arr).arraySync();
      const mean = tf.mean(arr).arraySync();
      return { min, max, mean };
    };

    const logDataAfterEpoch = (epoch, logs) => {
      if (!epochLogRef.current[epoch]) {
        epochLogRef.current[epoch] = true;

        const summaryObject = {
          "Epoch": epoch,
          "Soil Moisture": summarizeArray(soilMoisture),
          "Temperature": summarizeArray(temperature),
          "Humidity": summarizeArray(humidity),
          "Light Exposure": summarizeArray(lightExposure),
          "Water ML": summarizeArray(waterMl)
        };

        console.log("Epoch", epoch, ": Summary of data:", [summaryObject]);
      }
    };

    await newModel.fit(features, labels, {
      epochs: 5,
      batchSize: 5,
      callbacks: { onEpochEnd: logDataAfterEpoch },
    });

    modelRef.current = newModel;

    soilMoisture.dispose();
    temperature.dispose();
    humidity.dispose();
    lightExposure.dispose();
    waterMl.dispose();
    features.dispose();
    labels.dispose();
  }, []);

  useEffect(() => {
    createAndTrainModel();

    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, [createAndTrainModel]);

  const logWatering = (newHeight, stage) => {
    const summaryObject = {
      "Height": newHeight,
      "Stage": stage.label,
      "Soil Moisture": { min: 0.1, max: 0.4, mean: 0.25 },  // Dummy values, replace with real data if available
      "Temperature": { min: 72, max: 72, mean: 72 },  // Dummy values, replace with real data if available
      "Humidity": { min: 20, max: 50, mean: 35 },  // Dummy values, replace with real data if available
      "Light Exposure": { min: 0.5, max: 0.5, mean: 0.5 },  // Dummy values, replace with real data if available
      "Water ML": { min: 10, max: 50, mean: 30 }  // Dummy values, replace with real data if available
    };

    console.log("Plant was watered. New state:", summaryObject);
  };

  const getCurrentStage = (height) => {
    return growthStages.find(stage => height >= stage.minHeight && height <= stage.maxHeight);
  };

  const waterPlant = () => {
    setIsWatered(true);
    setHeight(prevHeight => {
      const newHeight = prevHeight + 5;
      console.log("New height:", newHeight); // Log the new height

      const nextStage = getCurrentStage(newHeight);
      console.log("Next stage:", nextStage); // Log the next stage

      if (nextStage !== currentStage) {
        console.log(`The plant has advanced to the ${nextStage.label} stage.`);
        setCurrentStage(nextStage);
      }

      logWatering(newHeight, nextStage);
      return newHeight;
    });

    setTimeout(() => {
      setIsWatered(false);
    }, 60000); // 1 minute
  };

  const predictWateringNeed = useCallback(async () => {
    if (modelRef.current) {
      const soilMoisture = tf.scalar(Math.random() * 0.3 + 0.1);
      const temperature = tf.scalar(72);
      const humidity = tf.scalar(Math.random() * 30 + 20);
      const lightExposure = tf.scalar(0.5);
      const input = tf.stack([soilMoisture, temperature, humidity, lightExposure], 0).reshape([1, 4]);

      const prediction = modelRef.current.predict(input);
      const result = (await prediction.data())[0];
      input.dispose();
      prediction.dispose();
      soilMoisture.dispose();
      temperature.dispose();
      humidity.dispose();
      lightExposure.dispose();

      return result > 0.5;
    }
    return false;
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!isWatered) {
        const needsWater = await predictWateringNeed();
        if (needsWater) {
          waterPlant();
        }
      }
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, [isWatered, predictWateringNeed, waterPlant]);

  return (
    <div className='home'>
      <div className='content'>
        <div className='plant'>
          <div className='Water' style={{ width: '100%', height: '400px', backgroundColor: isWatered ? 'green' : 'red', margin: '20px auto' }}>
            <img className='can' src={currentStage.image} alt='Plant' />
          </div>
          <div>
            Current Height: {height.toFixed(2)} cm
          </div>
        </div>
        <button onClick={waterPlant} className='WaterCan'>
          <img src='/images/watering.PNG' alt='watering' />
        </button>
      </div>
    </div>
  );
}

export default Home;
