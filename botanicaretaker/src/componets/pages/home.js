import React, { useState, useEffect, useCallback, useRef } from 'react';
import './home.css';
import * as tf from '@tensorflow/tfjs';

function Home() {
  const [isWatered, setIsWatered] = useState(false);
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

  const waterPlant = () => {
    setIsWatered(true);

    setTimeout(() => {
      setIsWatered(false);
    }, 1800000);
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
    }, 1800000);

    return () => clearInterval(intervalId);
  }, [isWatered, predictWateringNeed]);

  return (
     <div className='home'>
      <div className='content>
        <div className='plant>
           <div style={{ width: '100%', height: '400px', backgroundColor: isWatered ? 'green': 'red', margin: '20px auto' }}>
             <img className='can' src='/images/plant7.PNG' alt='Plant' />
            </div>
           <button onClick={waterPlant} className='WaterCan'>
             <img src='/images/watering.PNG' alt='watering' />
           </button>
      </div>
    </div>
  );
}

export default Home;