import { MeshGradient } from "@paper-design/shaders-react";
import React from "react";

/**
 * Um componente de layout principal que fornece um fundo de shader animado.
 * Ele envolve o conteúdo filho, garantindo que o fundo seja dinâmico
 * e visualmente atraente, de acordo com o Design System.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo a ser renderizado sobre o fundo.
 * @returns {JSX.Element} O componente de layout com o fundo de shader.
 */
export function MainLayoutWithShader({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background-dark">
      {/* Camada de Shader Principal */}
      <div className="absolute inset-0 z-10">
        <MeshGradient
          colors={[
            '#1C1A1C', // background-dark
            '#A47CF3', // accent-start
            '#683FEA', // accent-end
            '#4A00E0', // Roxo mais escuro para profundidade
          ]}
          speed={1.5}
          className="opacity-70"
        />
      </div>

      {/* Camada de Shader Secundária para textura */}
      <div className="absolute inset-0 z-10">
        <MeshGradient
          colors={['#A47CF3', '#2A282A']}
          speed={2}
          className="opacity-30"
        />
      </div>

      {/* Conteúdo da Página */}
      <main className="relative z-20">{children}</main>
    </div>
  );
}

export default MainLayoutWithShader;