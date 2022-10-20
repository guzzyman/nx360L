import { useEffect, useState } from "react";
import { getCountdown } from "common/Utils";
import useDataRef from "./useDataRef";

/**
 * @param {number | Date} date
 * @param {CountdownOptions} options
 */
function useCountdown(date, options = {}) {
  const { interval = 1000, onProgess, onComplete } = options;
  const [state, setState] = useState(() => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: CountdownStatus.IDLE,
  }));

  const dataRef = useDataRef({ onProgess, onComplete });

  useEffect(() => {
    let intervalId;

    if (date && Date.now() < new Date(date).getTime()) {
      intervalId = setInterval(() => {
        const countdown = getCountdown(new Date(), date);
        const inProgress =
          countdown.days > 0 ||
          countdown.hours > 0 ||
          countdown.minutes > 0 ||
          countdown.seconds > 0;

        if (inProgress) {
          setState((p) => ({
            ...p,
            ...countdown,
            status: CountdownStatus.IN_PROGRESS,
          }));
          dataRef.current.onProgess?.({
            ...countdown,
            status: CountdownStatus.IN_PROGRESS,
          });
        } else {
          setState((p) => ({
            ...p,
            ...countdown,
            status: CountdownStatus.COMPLETED,
          }));
          clearInterval(intervalId);
          dataRef.current.onComplete?.({
            ...countdown,
            status: CountdownStatus.COMPLETED,
          });
        }
      }, interval);
    } else {
      setState((p) => ({
        ...p,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        status: CountdownStatus.COMPLETED_IDLE,
      }));
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [dataRef, date, interval]);

  return {
    ...state,
    idle: state.status === CountdownStatus.IDLE,
    inProgress: state.status === CountdownStatus.IN_PROGRESS,
    completed: state.status === CountdownStatus.COMPLETED,
    completedIdle: state.status === CountdownStatus.COMPLETED_IDLE,
  };
}

export default useCountdown;

const CountdownStatus = {
  IDLE: "IDLE",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  COMPLETED_IDLE: "COMPLETED_IDLE",
};

/**
 * @typedef {{
 * status: keyof typeof CountdownStatus
 * } & ReturnType<typeof getCountdown>} CountdownState
 */

/**
 * @typedef {{
 * date: number | Date;
 * interval: number;
 * onProgess: (countdown: CountdownState) => void;
 * onComplete: (countdown: CountdownState) => void
 * }} CountdownOptions
 */
