document.addEventListener("DOMContentLoaded", () => {
  // --- Custom Cursor Logic ---
  const cursor = document.querySelector(".cursor");
  const cursorFollower = document.querySelector(".cursor-follower");

  // Check if device supports hover (not touch)
  if (window.matchMedia("(any-hover: hover)").matches) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";

      // Add a slight delay for the follower
      setTimeout(() => {
        cursorFollower.style.left = e.clientX + "px";
        cursorFollower.style.top = e.clientY + "px";
      }, 50);
      
      // Interactive Mechanical Background Parallax (Hero)
      const mechBg = document.querySelector('.hero-mech-bg');
      if (mechBg) {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 40; // Max 20px movement
        const yPos = (e.clientY / window.innerHeight - 0.5) * 40;
        // Keep the base -50% translateY and 15deg rotation, add the mouse parallax
        mechBg.style.transform = `translate(calc(0px + ${xPos}px), calc(-50% + ${yPos}px)) rotate(15deg)`;
      }

      // Interactive Mechanical Background Parallax (About)
      const aboutMechBg = document.querySelector('.about-mech-bg');
      if (aboutMechBg) {
        const xPosAbout = (e.clientX / window.innerWidth - 0.5) * 60; // Slightly stronger effect
        const yPosAbout = (e.clientY / window.innerHeight - 0.5) * 60;
        // Base is -50% Y, -15deg rotation
        aboutMechBg.style.transform = `translate(calc(0px - ${xPosAbout}px), calc(-50% - ${yPosAbout}px)) rotate(-15deg)`;
      }

      // Interactive Kinect Pattern (Dialogue avec le Joint de Culasse)
      const kinectPattern = document.querySelector('.interactive-kinect-pattern');
      if (kinectPattern) {
        const rect = kinectPattern.parentElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        const maxRotate = 40;
        let rotateX = (distanceY / window.innerHeight) * -maxRotate;
        let rotateY = (distanceX / window.innerWidth) * maxRotate;
        
        const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        // Apply effect strongly when cursor is nearby
        if (dist < 800) {
            kinectPattern.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            kinectPattern.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
        }
      }
    });

    // Hover reactions on Links
    const links = document.querySelectorAll("a, button");
    links.forEach((link) => {
      link.addEventListener("mouseenter", () =>
        document.body.classList.add("hovering-link"),
      );
      link.addEventListener("mouseleave", () =>
        document.body.classList.remove("hovering-link"),
      );
    });
  }

  // --- Zero-Gravity Floating Effect (Art Numérique) ---
  const floatingItems = document.querySelectorAll('.floating-item');
  let floatTime = 0;
  
  function animateFloating() {
    floatTime += 0.01;
    floatingItems.forEach((item, index) => {
      const speed = parseFloat(item.getAttribute('data-speed')) || 1;
      // Calculate smooth sine wave movement
      const yOffset = Math.sin(floatTime * speed + index) * 15;
      const xOffset = Math.cos(floatTime * speed * 0.8 + index) * 10;
      const rotation = Math.sin(floatTime * speed * 0.5 + index) * 3;
      
      // Keep the current mouse transform if hovering? 
      // It's cleaner to just apply the float via requestAnimationFrame.
      item.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg)`;
    });
    requestAnimationFrame(animateFloating);
  }
  
  // Start animation loop
  if(floatingItems.length > 0) {
    animateFloating();
  }

  // --- Mechanical Carousel (Design de Produit) ---
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  
  if (track && slides.length > 0) {
    let currentIndex = 0;

    function updateCarousel() {
      // Calculate how much to move the track
      // Center the active slide
      const slideWidth = slides[0].getBoundingClientRect().width;
      const trackWidth = track.parentElement.getBoundingClientRect().width;
      const offset = (trackWidth / 2) - (slideWidth / 2) - (currentIndex * (slideWidth + 48)); // 48 is roughly 3rem gap
      
      track.style.transform = `translateX(${offset}px)`;
      
      slides.forEach((slide, index) => {
        if (index === currentIndex) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
    }

    // Initialize
    updateCarousel();

    // Event Listeners
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    
    // Resize handling to recalculate offset
    window.addEventListener('resize', updateCarousel);
  }

  // --- Smooth Scroll Reveal (Intersection Observer) ---
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: stop observing once revealed
        // observer.unobserve(entry.target);

        // Active nav link highlight
        const id = entry.target.getAttribute("id");
        if (id) {
          document.querySelectorAll(".nav-link").forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${id}`) {
              link.classList.add("active");
            }
          });
        }
      } else {
        // Remove to allow re-animating on scroll up/down
        entry.target.classList.remove("visible");
      }
    });
  }, revealOptions);

  // Observe Sections for Nav Highlight
  document.querySelectorAll(".section").forEach((section) => {
    revealObserver.observe(section);
  });

  // Observe individual gallery items for staggered animation
  const galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 },
  );

  document.querySelectorAll(".gallery-item").forEach((item) => {
    galleryObserver.observe(item);
  });


});
