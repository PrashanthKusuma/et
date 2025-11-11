import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Set initial state
    checkSize()

    // Add resize listener
    window.addEventListener("resize", checkSize)

    // Cleanup listener
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  return isMobile
}
