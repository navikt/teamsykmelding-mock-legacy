'use client'

import dynamic from 'next/dynamic'

const Egg = dynamic(() => import('./Egg'), { ssr: false })

export default Egg
