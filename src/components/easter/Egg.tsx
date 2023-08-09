'use client'

import React, { ReactElement, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

import { useInterval } from '../../utils/useInterval'

function Egg(): ReactElement {
    const canvasRef = useRef<HTMLCanvasElement & { confetti: confetti.CreateTypes }>(null)

    useEffect(() => {
        if (canvasRef.current == null) return

        canvasRef.current.confetti = canvasRef.current.confetti || confetti.create(canvasRef.current, { resize: true })
    }, [])

    useInterval(() => {
        if (canvasRef.current == null) return

        canvasRef.current.confetti({
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 1 },
        })
        canvasRef.current.confetti({
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 1 },
        })
    }, 6900)

    return <canvas ref={canvasRef} className="pointer-events-none h-full w-full absolute top-0 left-0" />
}

export default Egg
