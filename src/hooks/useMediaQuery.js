import { useState, useEffect } from 'react'

/**
 * Custom hook for detecting screen size
 * @returns {Object} - Screen size information
 */
const useMediaQuery = () => {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
    })

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            setScreenSize({
                isMobile: width < 640,
                isTablet: width >= 640 && width < 1024,
                isDesktop: width >= 1024,
                width,
            })
        }

        handleResize() // Initial check
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return screenSize
}

export default useMediaQuery
