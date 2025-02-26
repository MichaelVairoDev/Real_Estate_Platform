import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box, CircularProgress, Typography } from '@mui/material';

const VirtualTour = ({ panoramaUrl }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !panoramaUrl) return;

    // Inicializar Three.js
    const init = () => {
      // Crear escena
      sceneRef.current = new THREE.Scene();

      // Crear cámara
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current.position.set(0, 0, 0.1);

      // Crear renderizador
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      containerRef.current.appendChild(rendererRef.current.domElement);

      // Crear controles
      controlsRef.current = new OrbitControls(
        cameraRef.current,
        rendererRef.current.domElement
      );
      controlsRef.current.enableZoom = false;
      controlsRef.current.enablePan = false;
      controlsRef.current.rotateSpeed = -0.5;

      // Crear geometría esférica
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1); // Invertir la geometría para ver la textura desde dentro

      // Cargar textura panorámica
      const loader = new THREE.TextureLoader();
      loader.load(
        panoramaUrl,
        (texture) => {
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const sphere = new THREE.Mesh(geometry, material);
          sceneRef.current.add(sphere);
        },
        undefined,
        (error) => {
          console.error('Error al cargar la textura:', error);
        }
      );

      // Iniciar animación
      animate();
    };

    // Función de animación
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      requestAnimationFrame(animate);
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Manejar redimensionamiento
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    // Inicializar escena
    init();

    // Agregar listener para redimensionamiento
    window.addEventListener('resize', handleResize);

    // Limpieza
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [panoramaUrl]);

  if (!panoramaUrl) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Tour virtual no disponible
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: 400,
        position: 'relative',
        '& canvas': {
          outline: 'none',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            px: 2,
            py: 1,
            borderRadius: 1,
          }}
        >
          Arrastra para explorar • Usa dos dedos para rotar
        </Typography>
      </Box>
    </Box>
  );
};

export default VirtualTour; 