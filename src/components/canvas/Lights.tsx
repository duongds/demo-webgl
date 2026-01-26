const Lights = () => {
    return (
        <>
            {/* Soft ambient light to fill shadows */}
            <ambientLight intensity={0.4} />

            {/* Main directional light (like the sun) */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            {/* Accent light from opposite side */}
            <directionalLight
                position={[-3, 3, -5]}
                intensity={0.3}
                color="#764ba2"
            />
        </>
    )
}

export default Lights
