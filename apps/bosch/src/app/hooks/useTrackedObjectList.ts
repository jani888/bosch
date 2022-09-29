import { useEffect, useState } from 'react';
import { TrackedObject, trackedObjects } from '../simulation';

export function useTrackedObjectList() {
  const [trackedObjectList, setTrackedObjectList] = useState<TrackedObject[]>(
    []
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackedObjectList(JSON.parse(JSON.stringify(trackedObjects)));
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return trackedObjectList;
}
