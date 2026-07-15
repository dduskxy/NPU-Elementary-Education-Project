document.addEventListener("DOMContentLoaded", () => {
  // GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Custom Cursor
  const cursor = document.querySelector('.cursor');
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    });
  });

  const interactiveElements = document.querySelectorAll('a, button, .gallery-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

  // Preloader Animation
  const tlLoader = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove('loading');
      initHeroAnimations();
    }
  });

  tlLoader
    .to('.loader-progress', { width: '100%', duration: 1.5, ease: 'power3.inOut' })
    .to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, "+=0.2");

  // Hero Animations
  function initHeroAnimations() {
    const tlHero = gsap.timeline();
    
    tlHero
      .fromTo('.hero-img', 
        { scale: 1.2 }, 
        { scale: 1, duration: 2, ease: 'power3.out' }, 0)
      .to('.hero-title', { 
        y: '0%', 
        duration: 1.2, 
        stagger: 0.1, 
        ease: 'expo.out' 
      }, "-=1.5")
      .fromTo('.hero-subtitle', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }, "-=0.8")
      .fromTo('.scroll-line',
        { y: '-100%' },
        { y: '100%', duration: 1.5, repeat: -1, ease: 'power2.inOut' }, "-=0.5");
  }

  // Scroll Animations
  
  // Parallax Hero Background
  gsap.to('.hero-img', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Reveal Text
  const revealTexts = document.querySelectorAll('.reveal-text > *');
  revealTexts.forEach(text => {
    gsap.to(text, {
      y: '0%',
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: text.parentElement,
        start: 'top 90%',
      }
    });
  });

  // Fade Up Elements
  const fadeUps = document.querySelectorAll('.fade-up');
  fadeUps.forEach(el => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      }
    });
  });

  // Horizontal Gallery Scroll
  const galleryWrapper = document.querySelector('.gallery-wrapper');
  if (galleryWrapper) {
    gsap.to(galleryWrapper, {
      xPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '.gallery',
        start: 'top 60%',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
});
