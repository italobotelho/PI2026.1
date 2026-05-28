"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl, LayerGroup } from 'react-leaflet';
import api from '@/app/services/api';
import HeatmapLayer from './HeatmapLayer';

// Coordenadas centrais de Campinas
const CENTRO_CAMPINAS: [number, number] = [-22.9056, -47.0608];

export default function MapComponent() {
  const [riscoData, setRiscoData] = useState<any>(null);
  const [vulnData, setVulnData] = useState<any>(null);
  const [casosData, setCasosData] = useState<[number, number, number][]>([]);

  useEffect(() => {
    // Busca os polígonos que curámos no MongoDB
    api.get('/dashboard/mapas/risco').then(res => setRiscoData(res.data)).catch(() => {});
    api.get('/dashboard/mapas/vulnerabilidade').then(res => setVulnData(res.data)).catch(() => {});
    
    // Simular busca de casos geolocalizados para o Heatmap
    // Num cenário real, isso viria da API
    const mockCasos: [number, number, number][] = Array.from({ length: 150 }).map(() => [
      CENTRO_CAMPINAS[0] + (Math.random() - 0.5) * 0.1,
      CENTRO_CAMPINAS[1] + (Math.random() - 0.5) * 0.1,
      Math.random() // Intensidade
    ]);
    setCasosData(mockCasos);
  }, []);

  // Estilos das nossas camadas geográficas
  const estiloRisco = { color: '#ef4444', weight: 2, fillOpacity: 0.2 }; // Vermelho
  const estiloVuln = { color: '#eab308', weight: 2, fillOpacity: 0.2 }; // Amarelo

  return (
    <MapContainer 
      center={CENTRO_CAMPINAS} 
      zoom={12} 
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

        {/* Camada de Heatmap: Casos */}
        {casosData.length > 0 && (
          <LayersControl.Overlay checked name="Densidade de Casos (Heatmap)">
            <LayerGroup>
              <HeatmapLayer points={casosData} />
            </LayerGroup>
          </LayersControl.Overlay>
        )}

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