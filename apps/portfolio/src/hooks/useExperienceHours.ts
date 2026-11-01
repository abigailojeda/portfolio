import { useEffect, useState } from "react";

const experienceStart = new Date("2020-10-01T00:00:00+02:00").getTime();
const hoursFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 5,
  maximumFractionDigits: 5,
});

function readExperienceHours() {
  return hoursFormat.format(
    Math.max(0, Date.now() - experienceStart) / 3_600_000,
  );
}

export function useExperienceHours() {
  const [hours, setHours] = useState(readExperienceHours);

  useEffect(() => {
    const interval = setInterval(() => setHours(readExperienceHours()), 1000);

    return () => clearInterval(interval);
  }, []);

  return hours;
}
