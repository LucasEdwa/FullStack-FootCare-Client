// RefreshContext.js
import { createContext, useState } from 'react';

export const ReviewRefresh = createContext({
  refreshKey: 0,
  setRefreshKey: () => {},
});
export function RefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <ReviewRefresh.Provider value={{ refreshKey, setRefreshKey }}>
      {children}
    </ReviewRefresh.Provider>
  );
}