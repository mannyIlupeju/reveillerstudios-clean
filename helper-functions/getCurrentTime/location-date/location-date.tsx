import React, {useEffect} from 'react'
import { useGlobalContext } from '@/Context/GlobalContext';


function LocationDate() {
  const {timeState, setCurrentTime} = useGlobalContext()


  useEffect(() => {

    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours(); // Get the hours in 24-hour format
      const minutes = String(now.getMinutes()).padStart(2, '0'); // Pad single digit with '0'
      const seconds = String(now.getSeconds()).padStart(2, '0');

      // Determine AM or PM
      const period = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12 || 12; // Convert 0 to 12 for midnight
      const formattedHours = String(hours).padStart(2, '0'); // Ensure two digits

      setCurrentTime(`${formattedHours}::${minutes}::${seconds} ${period}`);
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [setCurrentTime])

  return (
    <div className="text-zinc-800">
      {timeState.currentTime}
    </div>
  )
  
}

export default LocationDate;


