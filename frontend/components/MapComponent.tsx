"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import api from '@/app/services/api';

// Coordenadas centrais de Campinas
const CENTRO_CAMPINAS: [number, number] = [-22.9056, -47.0608];

export default function MapComponent() {
  const [riscoData, setRiscoData] = useState<any>(null);
  const [vulnData, setVulnData] = useState<any>(null);

  useEffect(() => {
    // Busca os polígonos que curámos no MongoDB
    api.get('/dashboard/mapas/risco').then(res => setRiscoData(res.data));
    api.get('/dashboard/mapas/vulnerabilidade').then(res => setVulnData(res.data));
  }, []);

  // Estilos das nossas camadas geográficas
  const estiloRisco = { color: '#ef4444', weight: 2, fillOpacity: 0.4 }; // Vermelho
  const estiloVuln = { color: '#eab308', weight: 2, fillOpacity: 0.4 }; // Amarelo

  return (
    <MapContainer 
      center={CENTRO_CAMPINAS} 
      zoom={11} 
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      {/* Controlo de Camadas (aquela caixinha no canto superior direito) */}
      <LayersControl position="topright">
        
        {/* Camada Base 1: O Mapa Escuro (combina com o nosso tema!) */}
        <LayersControl.BaseLayer checked name="Mapa Escuro">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        </LayersControl.BaseLayer>

        {/* Camada Base 2: O Mapa Claro Padrão */}
        <LayersControl.BaseLayer name="Mapa Claro">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
        </LayersControl.BaseLayer>

        {/* Camada de Polígonos: Risco de Inundação */}
        {riscoData && (
          <LayersControl.Overlay checked name="Risco de Inundação">
            <GeoJSON 
              data={riscoData} 
              style={estiloRisco} 
              onEachFeature={(feature, layer) => {
                // Adiciona um balão ao clicar no polígono
                if (feature.properties && feature.properties.CLASSE) {
                  layer.bindPopup(`<b>Nível de Risco:</b> ${feature.properties.CLASSE}`);
                }
              }} 
            />
          </LayersControl.Overlay>
        )}

        {/* Camada de Polígonos: Vulnerabilidade Habitacional */}
        {vulnData && (
          <LayersControl.Overlay checked name="Vulnerabilidade Habitacional">
            <GeoJSON 
              data={vulnData} 
              style={estiloVuln}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.NOME_AREA) {
                  layer.bindPopup(`<b>Área:</b> ${feature.properties.NOME_AREA}`);
                }
              }}
            />
          </LayersControl.Overlay>
        )}

      </LayersControl>
    </MapContainer>
  );
}