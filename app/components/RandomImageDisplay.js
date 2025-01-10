'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const RandomImageDisplay = () => {
  const [images, setImages] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [soundFiles, setSoundFiles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const preloadedImages = useRef(new Map())
  const preloadedAudio = useRef(new Map())

  useEffect(() => {
    const loadResources = async () => {
      try {
        const soundResponse = await fetch('/api/sounds')
        const soundFilesList = await soundResponse.json()
        setSoundFiles(soundFilesList)

        soundFilesList.forEach((file) => {
          const audio = new Audio(`/mp3/${file}`)
          preloadedAudio.current.set(file, audio)
        })

        let loadedCount = 0
        for (let i = 1; i <= 13; i++) {
          const filename = `${String(i).padStart(2, '0')}.jpg`
          const img = new window.Image()
          img.src = `/shoots/${filename}`
          img.onload = () => {
            preloadedImages.current.set(filename, img)
            loadedCount++
            if (loadedCount === 13) {
              setIsLoading(false)
              const firstImage = preloadedImages.current.get('01.jpg')
              const aspectRatio =
                firstImage.naturalWidth / firstImage.naturalHeight
              const size = 300
              const width = size
              const height = size / aspectRatio
              const x = window.innerWidth / 2 - width / 2
              const y = window.innerHeight / 2 - height / 2
              setImageIndex(1)
              setImages([{ src: `/shoots/01.jpg`, x, y, width, height }])
            }
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки файлов:', error)
      }
    }

    loadResources()
  }, [])

  const getNextImage = async (event) => {
    if (isLoading) return

    const nextIndex = (imageIndex % 13) + 1
    const nextImage = `${String(nextIndex).padStart(2, '0')}.jpg`

    if (preloadedImages.current.has(nextImage)) {
      const img = preloadedImages.current.get(nextImage)
      const aspectRatio = img.naturalWidth / img.naturalHeight
      const size = Math.floor(Math.random() * (600 - 100 + 1)) + 100
      const width = size
      const height = size / aspectRatio
      const x = event.clientX - width / 2
      const y = event.clientY - height / 2

      setImageIndex(nextIndex)
      setImages((prevImages) => [
        ...prevImages,
        { src: `/shoots/${nextImage}`, x, y, width, height },
      ])

      if (soundFiles.length > 0) {
        const randomSound =
          soundFiles[Math.floor(Math.random() * soundFiles.length)]
        const audio = preloadedAudio.current.get(randomSound)
        audio.currentTime = 0
        audio.play()
      }
    }
  }

  return (
    <div className="fixed z-0 inset-0" onClick={getNextImage}>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full pointer-events-none select-none">
          <p className="text-[12px] leading-[15px] tracking-wider uppercase text-[#FFCC00] animate-pulse">
            Aevum
          </p>
        </div>
      ) : (
        <div className="">
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute overflow-hidden pointer-events-none select-none border border-black"
              style={{
                left: `${image.x}px`,
                top: `${image.y}px`,
                width: `${image.width}px`,
                height: `${image.height}px`,
              }}
            >
              <Image
                src={image.src}
                alt="Random Image"
                width={image.width}
                height={image.height}
                unoptimized={true}
                style={{
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  transform: 'scale(1.05)',
                }}
              />
            </div>
          ))}
          <div className="p-[20px] fixed bottom-0 inset-x-0 text-center w-full text-[12px] leading-[15px] z-10 text-[#FFCC00]">
            <div className="uppercase tracking-wider max-w-[320px] mx-auto">
              Tempus oscillat inter principium indefinitum et infinitatem
              fluentem
              {/* Время колеблется между неопределенным началом и текущей бесконечностью */}
            </div>
            <div className="mt-[5px]">
              All images are taken from the film "El sol del membrillo" by
              Víctor Erice
              <br />
              Created by{' '}
              <Link
                href="https://www.instagram.com/p_frlv/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Pasha Frolov
              </Link>{' '}
              for{' '}
              <Link
                href="https://mediumeducation.ru/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Medium
              </Link>
              , 2025
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RandomImageDisplay
