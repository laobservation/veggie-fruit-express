
import { useState, useEffect } from 'react';

const heroSlides = [
  {
    image: '/images/hero-1.jpg',
    title: 'Fresh Farm Products',
    subtitle: 'Delivered directly from farm to your door',
    position: 'left',
  },
  {
    image: '/images/hero-2.jpg',
    title: 'Organic Vegetables',
    subtitle: 'Grown naturally without pesticides',
    position: 'right',
  },
  {
    image: '/images/hero-3.jpg',
    title: 'Seasonal Fruits',
    subtitle: 'Enjoy the taste of every season',
    position: 'center',
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <div className="carousel-inner h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {heroSlides.map((slide, index) => (
          <div key={index} className="carousel-item relative h-full">
            <div 
              className="w-full h-full bg-cover bg-center" 
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
              }}
            >
              <div className={`container mx-auto px-6 h-full flex items-center ${
                slide.position === 'left' ? 'justify-start' : 
                slide.position === 'right' ? 'justify-end' : 
                'justify-center'
              }`}>
                <div className="max-w-lg text-center md:text-left bg-black/30 p-6 rounded-lg backdrop-blur-sm">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{slide.title}</h1>
                  <p className="text-xl text-white mb-6">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-veggie-primary' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
