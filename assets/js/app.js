document.addEventListener("DOMContentLoaded", () => {
  // GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Mobile optimization: Prevent ScrollTrigger recalcs on address bar hide/show
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    lerp: 0.025, // Ultra smooth, very fluid momentum
    wheelMultiplier: 1,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: 2
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
      .to('.hero-img', { scale: 1.05, duration: 2.5, ease: 'power3.out' }, 0)
      .fromTo('.hero-title', 
        { yPercent: 120, opacity: 0, skewY: 5 },
        { yPercent: 0, opacity: 1, skewY: 0, duration: 1.8, stagger: 0.15, ease: 'power4.out', force3D: true }, "-=1.5")
      .fromTo('.hero-subtitle', 
        { y: 25, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.4, ease: 'power2.out', force3D: true }, "-=1.2")
      .fromTo('.scroll-line',
        { y: '-100%' },
        { y: '100%', duration: 1.5, repeat: -1, ease: 'power2.inOut' }, "-=0.5");
  }

  // Scroll Animations
  
  // Parallax Hero Background
  // Cinematic Hero Parallax with Blur
  // We apply parallax and blur to .hero-img for a fluid transition
  gsap.to('.hero-img', {
    yPercent: 15,
    filter: 'brightness(0.3) blur(12px)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // Reveal Text
  const revealTexts = document.querySelectorAll('.reveal-text > *');
  revealTexts.forEach(text => {
    gsap.fromTo(text, 
      { yPercent: 120, opacity: 0, skewY: 3 },
      {
        yPercent: 0,
        opacity: 1,
        skewY: 0,
        duration: 1.6,
        ease: 'power4.out',
        force3D: true,
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
    gsap.fromTo(el, 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: 'power4.out',
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        }
      }
    );
  });

  // Horizontal Gallery Scroll
  let mm = gsap.matchMedia();
  
  mm.add("(min-width: 768px)", () => {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    if (galleryWrapper) {
      // Horizontal Scroll Continuous
      gsap.to(galleryWrapper, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery',
          start: 'top 80%',
          end: 'bottom top',
          scrub: 1.5 // Smoother deceleration
        }
      });
      
      // Gentle Parallax effect on images within gallery
      gsap.to(galleryItems, {
        xPercent: 15,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery',
          start: 'top 90%',
          end: 'bottom top',
          scrub: 2 // Even slower for a dreamy feel
        }
      });
    }
  });

  // Navbar Animation (On Load)
  gsap.fromTo('.nav', 
    { y: '-100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.5, force3D: true }
  );

  // Navbar Hide on Scroll Down, Show on Scroll Up
  let lastScrollY = window.scrollY;
  const navBar = document.querySelector('.nav');
  lenis.on('scroll', (e) => {
    if (e.animatedScroll > 100) {
      if (e.animatedScroll > lastScrollY) {
        // Scrolling down
        gsap.to(navBar, { y: '-100%', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      } else {
        // Scrolling up
        gsap.to(navBar, { y: '0%', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      }
    } else {
      gsap.to(navBar, { y: '0%', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    }
    lastScrollY = e.animatedScroll;
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
