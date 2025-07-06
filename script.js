// Variáveis globais
let currentSlide = 0
const totalSlides = 4
let autoSlideInterval

// Função para scroll suave até seção
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Funções do carrossel
function updateCarousel() {
  const carousel = document.getElementById("carousel")
  const indicators = document.querySelectorAll(".indicator")

  // Atualizar posição do carrossel
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`

  // Atualizar indicadores
  indicators.forEach((indicator, index) => {
    if (index === currentSlide) {
      indicator.classList.add("active")
      indicator.classList.remove("bg-purple-300")
      indicator.classList.add("bg-purple-600")
    } else {
      indicator.classList.remove("active")
      indicator.classList.remove("bg-purple-600")
      indicator.classList.add("bg-purple-300")
    }
  })
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
  resetAutoSlide()
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
  updateCarousel()
  resetAutoSlide()
}

function goToSlide(slideIndex) {
  currentSlide = slideIndex
  updateCarousel()
  resetAutoSlide()
}

// Auto-play do carrossel
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 4000)
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval)
  startAutoSlide()
}

// Inicialização quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  // Iniciar auto-play do carrossel
  startAutoSlide()

  // Pausar auto-play quando mouse estiver sobre o carrossel
  const carouselContainer = document.querySelector(".relative")
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      clearInterval(autoSlideInterval)
    })

    carouselContainer.addEventListener("mouseleave", () => {
      startAutoSlide()
    })
  }

  // Adicionar animação de entrada aos elementos
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-in")
      }
    })
  }, observerOptions)

  // Observar seções para animação
  const sections = document.querySelectorAll("section")
  sections.forEach((section) => {
    observer.observe(section)
  })
})

// Função para destacar seção ativa na navegação
function updateActiveNavigation() {
  const sections = ["home", "sobre", "atividades", "contato"]
  const navButtons = document.querySelectorAll("nav button")

  let currentSection = "home"

  sections.forEach((sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSection = sectionId
      }
    }
  })

  // Atualizar estilo dos botões de navegação
  navButtons.forEach((button, index) => {
    const sectionName = sections[index]
    if (sectionName === currentSection) {
      button.classList.add("font-bold")
      button.classList.add("text-amber-800")
    } else {
      button.classList.remove("font-bold")
      button.classList.remove("text-amber-800")
    }
  })
}

// Atualizar navegação no scroll
window.addEventListener("scroll", updateActiveNavigation)

// Função para smooth scroll em dispositivos que não suportam CSS scroll-behavior
function smoothScrollTo(element) {
  const targetPosition = element.offsetTop - 80 // Offset para o header fixo
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  const duration = 800
  let start = null

  function animation(currentTime) {
    if (start === null) start = currentTime
    const timeElapsed = currentTime - start
    const run = ease(timeElapsed, startPosition, distance, duration)
    window.scrollTo(0, run)
    if (timeElapsed < duration) requestAnimationFrame(animation)
  }

  function ease(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  requestAnimationFrame(animation)
}

// Adicionar efeito de loading
window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})
