import { useState, useEffect } from 'react'

/**
 * Custom Hook: useGeospatial (Placeholder)
 * 
 * Provides state structure for future Mapbox vector layers, bounding boxes,
 * and telemetry streams.
 */
export function useGeospatial() {
  const [activeLayers, setActiveLayers] = useState(['satellite', 'canopy_ndvi'])
  const [selectedCoordinates, setSelectedCoordinates] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return {
    activeLayers,
    setActiveLayers,
    selectedCoordinates,
    setSelectedCoordinates,
    isLoading,
    setIsLoading
  }
}

export default useGeospatial

