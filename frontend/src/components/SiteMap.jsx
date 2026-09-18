import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export default function SiteMap({
  sites = [],
  isDrawing = false,
  onGeometryChange = () => {},
  onSiteClick = () => {},
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const drawRef = useRef(null)
  const [mapError, setMapError] = useState('')

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      setMapError(
        'Mapbox is not configured. Set VITE_MAPBOX_TOKEN to view or draw site boundaries.'
      )
      return undefined
    }
    mapboxgl.accessToken = MAPBOX_TOKEN
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [78.9629, 20.5937],
      zoom: 4,
    })
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('error', () =>
      setMapError(
        'Mapbox could not load the map. Check the token and network connection.'
      )
    )
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !MAPBOX_TOKEN) return
    const updateSites = () => {
      const features = sites
        .filter((site) => site.geometry)
        .map((site) => ({
          type: 'Feature',
          properties: { id: site.id, name: site.name },
          geometry: site.geometry,
        }))
      const source = map.getSource('saved-sites')
      if (source) source.setData({ type: 'FeatureCollection', features })
      else {
        map.addSource('saved-sites', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features },
        })
        map.addLayer({
          id: 'saved-site-fill',
          type: 'fill',
          source: 'saved-sites',
          paint: { 'fill-color': '#10b981', 'fill-opacity': 0.25 },
        })
        map.addLayer({
          id: 'saved-site-outline',
          type: 'line',
          source: 'saved-sites',
          paint: { 'line-color': '#10b981', 'line-width': 2 },
        })
      }
      if (features.length) {
        const bounds = new mapboxgl.LngLatBounds()
        features.forEach((feature) => {
          const coordinates = feature.geometry.coordinates.flat(3)
          coordinates.forEach((coordinate) => bounds.extend(coordinate))
        })
        map.fitBounds(bounds, { padding: 50, maxZoom: 15 })
      }
    }
    if (map.isStyleLoaded()) updateSites()
    else map.once('load', updateSites)
  }, [sites])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !MAPBOX_TOKEN || !isDrawing) return
    if (drawRef.current) return
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    })
    map.addControl(draw, 'top-left')
    drawRef.current = draw
    const handleDraw = (event) =>
      onGeometryChange(event.features?.[0]?.geometry || null)
    const handleDelete = () => onGeometryChange(null)
    map.on('draw.create', handleDraw)
    map.on('draw.update', handleDraw)
    map.on('draw.delete', handleDelete)
    return () => {
      map.off('draw.create', handleDraw)
      map.off('draw.update', handleDraw)
      map.off('draw.delete', handleDelete)
      if (drawRef.current) map.removeControl(drawRef.current)
      drawRef.current = null
    }
  }, [isDrawing, onGeometryChange])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !MAPBOX_TOKEN || !onSiteClick) return

    const handleSiteClick = (event) => {
      const siteId = event.features?.[0]?.properties?.id
      if (siteId) onSiteClick(siteId)
    }

    const bindClick = () => map.on('click', 'saved-site-fill', handleSiteClick)
    if (map.getLayer('saved-site-fill')) bindClick()
    else map.once('load', bindClick)

    return () => {
      map.off('click', 'saved-site-fill', handleSiteClick)
      map.off('load', bindClick)
    }
  }, [sites, onSiteClick])

  return (
    <div>
      <div
        ref={containerRef}
        style={{
          minHeight: '420px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--bg-surface-elevated)',
        }}
      />
      {mapError && (
        <div
          style={{
            padding: '1rem',
            color: 'var(--accent-amber)',
            background: 'var(--bg-surface-elevated)',
          }}
        >
          {mapError}
        </div>
      )}
    </div>
  )
}
