import { useCallback, useState } from "react";

function useStep(initialStep = 0) {
  const [step, setStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    setStep((p) => ++p);
  }, []);

  const prevStep = useCallback(() => {
    setStep((p) => --p);
  }, []);

  return { step, setStep, nextStep, prevStep };
}

export default useStep;
