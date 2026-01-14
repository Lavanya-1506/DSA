import { useState, useCallback } from 'react';

export const useAlgorithmRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [results, setResults] = useState(null);

  const runAlgorithm = useCallback(async (algorithm, input) => {
    setIsRunning(true);
    setCurrentStep(0);
    setResults(null);

    try {
      const result = await algorithm(input);
      setResults(result);
      
      // Simulate step-by-step execution
      if (result.animations) {
        for (let i = 0; i < result.animations.length; i++) {
          setCurrentStep(i);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
    } catch (error) {
      console.error('Algorithm execution failed:', error);
      setResults({ error: error.message });
    } finally {
      setIsRunning(false);
    }
  }, [speed]);

  const pauseAlgorithm = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetAlgorithm = useCallback(() => {
    setIsRunning(false);
    setCurrentStep(0);
    setResults(null);
  }, []);

  return {
    isRunning,
    currentStep,
    speed,
    setSpeed,
    results,
    runAlgorithm,
    pauseAlgorithm,
    resetAlgorithm
  };
};