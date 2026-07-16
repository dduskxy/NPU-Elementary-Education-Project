document.addEventListener("DOMContentLoaded", () => {
  // GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    lerp: 0.07, // Buttery smooth momentum
    wheelMultiplier: 1,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  // Prevent scrollbar layout shift by keeping scrollbar but stopping scroll during load
  lenis.stop();

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Custom Cursor
  const cursor = document.querySelector('.cursor');
  
  if (window.matchMedia("(pointer: fine)").matches) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    
    const xTo = gsap.quickTo(cursor, "x", {duration: 0.15, ease: "power3"});
    const yTo = gsap.quickTo(cursor, "y", {duration: 0.15, ease: "power3"});

    document.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    const interactiveElements = document.querySelectorAll('a, button, .gallery-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  } else {
    if (cursor) {
      cursor.style.display = 'none';
    }
  }

  // Set initial states to prevent jump
  gsap.set('.hero-img', { scale: 1.2 });

  // Preloader Animation
  const tlLoader = gsap.timeline({
    onComplete: () => {
      document.body.classList.remove('loading');
      lenis.start(); // Re-enable scroll when loader finishes
    }
  });

  tlLoader
    .to('.loader-progress', { width: '100%', duration: 1.2, ease: 'power4.inOut' })
    .to('.loader-track', { scaleX: 0, opacity: 0, duration: 0.6, ease: 'power3.inOut', transformOrigin: 'right' })
    .to('.loader', { 
      yPercent: -100, 
      duration: 1.2, 
      ease: 'power4.inOut'
    }, "-=0.2")
    .add(initHeroAnimations, "-=1.2"); // Start hero animation earlier for overlap

  // Hero Animations
  function initHeroAnimations() {
    const tlHero = gsap.timeline();
    
    tlHero
      .to('.hero-img', { scale: 1, duration: 2, ease: 'power3.out' }, 0)
      .fromTo('.hero-title', 
        { y: '100%', filter: 'blur(10px)' },
        { y: '0%', filter: 'blur(0px)', duration: 1.4, stagger: 0.1, ease: 'expo.out' }, "-=1.5")
      .fromTo('.hero-subtitle', 
        { y: 20, opacity: 0, filter: 'blur(5px)' }, 
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }, "-=1.0")
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
    gsap.fromTo(text, 
      { y: '100%', filter: 'blur(10px)' },
      {
        y: '0%',
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: text.parentElement,
          start: 'top 90%',
        }
      }
    );
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
  let mm = gsap.matchMedia();
  
  mm.add("(min-width: 768px)", () => {
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

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }
});
