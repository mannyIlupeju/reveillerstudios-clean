import { useEffect } from 'react';
import { useGlobalContext } from '@/Context/GlobalContext';

function LocationYear() {
  const { timeState, setCurrentYear } = useGlobalContext();

  useEffect(() => {
    const checkYear = () => {
      const currentYear = new Date().getFullYear().toString();
      if (currentYear !== timeState.currentYear) {
        setCurrentYear(currentYear);
      }
    };

    const interval = setInterval(checkYear, 3600000); // Check once every hour
    return () => clearInterval(interval);
  }, [timeState.currentYear, setCurrentYear]);

  return (
    <div className="text-zinc-800">
      {timeState.currentYear}
    </div>
  );
}

export default LocationYear;
