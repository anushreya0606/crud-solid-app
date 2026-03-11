// just handles the filter logic, nothing else
import { useState } from 'react';
import filterStrategies from '../filters/filterStrategies';

const useTaskFilter = (tasks) => {
  const [filter, setFilter] = useState("all");
  const filtered = tasks.filter(filterStrategies[filter]);
  return { filter, setFilter, filtered };
};

export default useTaskFilter;