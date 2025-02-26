import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography, Link } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corregir el problema de los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PropertyMap = ({ property, properties, center, zoom = 13 }) => {
  // Si es una sola propiedad
  if (property) {
    const position = [property.latitude, property.longitude];

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <Typography variant="subtitle2" gutterBottom>
                {property.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {property.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {property.city}, {property.state}
              </Typography>
              <Link
                href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', mt: 1 }}
              >
                Cómo llegar
              </Link>
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    );
  }

  // Si es un listado de propiedades
  if (properties && properties.length > 0) {
    const bounds = L.latLngBounds(
      properties.map((p) => [p.latitude, p.longitude])
    );

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <MapContainer
          bounds={bounds}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
            >
              <Popup>
                <Typography variant="subtitle2" gutterBottom>
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {property.city}, {property.state}
                </Typography>
                <Link
                  href={`/properties/${property.id}`}
                  sx={{ display: 'block', mt: 1 }}
                >
                  Ver detalles
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    );
  }

  // Si no hay coordenadas disponibles
  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Ubicación no disponible
      </Typography>
    </Box>
  );
};

export default PropertyMap; 