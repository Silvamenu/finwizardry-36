// Local: src/components/LandingPageLayout.tsx

import { MeshGradient } from "@paper-design/shaders-react";
import React from "react";

// Este componente vai "envelopar" o conteúdo da sua landing page
export default function LandingPageLayout({ children }: { children: React.ReactNode }) {
  // Nossas cores! O fundo escuro e os tons de roxo que definimos.
  const gradientColors = [
  '#1C1A1C', // background-dark (adicionado mais vezes)
  '#2A282A', // background-card (um cinza um pouco mais claro)
  '#1C1A1C', // background-dark de novo
  '#683FEA', // accent-end (o toque de violeta)
  '#1C1A1C', // background-dark mais uma vez
];


  return (
    // O container principal que segura tudo
    <div className="relative overflow-hidden bg-background-dark">
      
      {/* O Shader que cria o fundo animado */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={gradientColors}
        speed={0.8} // Velocidade da animação. Ajuste se quiser mais rápido ou mais lento.
      />
      
      {/* Opcional: Efeito adicional com tons de cinza */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-50"
        colors={['#AAAAAA', '#444444']}
        speed={0.2}
      />
      
      {/* Aqui é onde o conteúdo da sua página (títulos, botões, etc.) vai aparecer */}
      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
}