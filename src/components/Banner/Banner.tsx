import { useState, useEffect } from 'react'
import type { FC } from 'react'

const Banner: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const bannerImages = [
    {
      url: '/banners/banner1.jpg',
      alt: 'Wellness Festival - 25% off on select products'
    },
    {
      url: '/banners/banner2.jpg',
      alt: 'Comprehensive Health Checkup'
    },
    {
      url: '/banners/banner3.jpg',
      alt: 'Special Medical Offers'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full flex flex-col items-center py-2 lg:py-3 px-3 lg:px-6">
      <div className="relative w-full max-w-[400px] lg:max-w-none h-[160px] sm:h-[150px] md:h-[200px] lg:h-[300px] rounded-lg lg:rounded-xl overflow-hidden">
        {bannerImages.map((image, index) => (
          <div
            key={index}
            className="absolute w-full h-full transition-opacity duration-500"
            style={{
              opacity: currentIndex === index ? 1 : 0,
            }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-2 lg:p-3">
              <p className="text-white text-xs sm:text-sm lg:text-base font-medium">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-1.5 lg:gap-2 mt-2 lg:mt-4">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-blue-600 w-3 lg:w-4' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner