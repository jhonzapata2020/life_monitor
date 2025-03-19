import dynamic from "next/dynamic"

// Importar el componente del cliente sin SSR
const ParticleEffectClient = dynamic(() => import("./particle-effect-client"), {
  ssr: false,
})

interface ParticleEffectProps {
  className?: string
}

// Componente wrapper que evita la renderización en el servidor
const ParticleEffect = (props: ParticleEffectProps) => {
  return <ParticleEffectClient {...props} />
}

export default ParticleEffect

