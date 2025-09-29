"use client";
import React from "react";


export function AuthContainer({children}: {children: React.ReactNode}) {

  const [currentSlide, setCurrentSlide] = React.useState(0);
  

  
  const slides = [
    {
      image: "/img/portada-auth-2.jpg",
      title: "Relax Spa",
      subtitle: "Salud y Belleza",
      description: "Tu bienestar, nuestra prioridad. Disfruta de tratamientos únicos en un ambiente de paz y armonía."
    },
    {
      image: "/img/portada-auth.jpg", // Puedes cambiar estas rutas por las imágenes que tengas
      title: "Masajes Relajantes",
      subtitle: "Terapias Especializadas",
      description: "Libera el estrés y renueva tu energía con nuestros masajes terapéuticos y relajantes."
    },
    {
      image: "/img/portada-auth-3.jpg",
      title: "Tratamientos Faciales",
      subtitle: "Cuidado de la Piel",
      description: "Rejuvenece tu piel con tratamientos faciales personalizados y productos de alta calidad."
    }
  ];

  // Auto-slide cada 4 segundos
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);


  return (
      <div className="flex min-h-screen relative bg-gray-50">
      {/* Columna izquierda con imagen */}
      <div className="hidden lg:flex relative w-1/2 h-screen overflow-hidden rounded-br-[80px] z-10 " >
      
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.image}
            alt={slide.title}
            className={`absolute inset-0 h-full w-full object-cover  transition-opacity duration-1000 ease-in-out
              ${index === currentSlide ? "opacity-100" : "opacity-0"} `}
          />
        ))}

        {/* Contenido */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-10 bg-gradient-to-t from-black/50 to-transparent">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight transition-all duration-500">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg font-light text-white/90 transition-all duration-500">
              {slides[currentSlide].subtitle}
            </p>
            <p className="text-base text-white/90 max-w-md mx-auto leading-relaxed transition-all duration-500">
              {slides[currentSlide].description}
            </p>
            <div className="flex justify-center space-x-2 pt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 hover:bg-white/80 ${
                    index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha con formulario */}
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2 rounded-tl-[80px] lg:-ml-20 lg:z-20">
        <div className="w-full max-w-md space-y-6">{children}</div>
      </div>
    </div>
  );
}