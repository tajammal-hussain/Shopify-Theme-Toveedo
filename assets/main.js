//Cursor
document.addEventListener('DOMContentLoaded', () => {
  let outline = document.querySelector('.outline');
  let cursor = document.querySelector('.cursor');
  let links = document.querySelectorAll('a');

  document.addEventListener('mousemove', function (e) {
    let x = e.clientX + 'px';
    let y = e.clientY + 'px';

    outline.style.transform = `translate( calc(${x} - 50%), calc(${y} - 50%) )`;
    cursor.style.transform = `translate( calc(${x} - 50%), calc(${y} - 50%) )`;
  });

  links.forEach((link) => {
    link.addEventListener('mouseenter', function () {
      outline.classList.add('hover');
      cursor.classList.add('hover');
    });

    link.addEventListener('mouseleave', function () {
      outline.classList.remove('hover');
      cursor.classList.remove('hover');
    });
  });
});

//navbar per icone
var lastScrollTop = 0;

window.addEventListener('scroll', function () {
  var navbar = document.getElementById('navbar');
  var st = window.pageYOffset || document.documentElement.scrollTop;

  if (st >= lastScrollTop) {
    // Scorrimento verso il bazzsso
    //navbar.classList.remove('show');
  } else {
    // Scorrimento verso l'alto
    //navbar.classList.add('show');
  }

  lastScrollTop = st <= 0 ? 0 : st;
});

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
// Import the MotionPathPlugin
gsap.registerPlugin(MotionPathPlugin);

var app = {
  data: {
    canvas: null,
    camera: null,
    scene: null,
    container: null,
    renderer: null,
    textureLoader: null,
    isViewB: true,
    clock: null,
  },
  mounted: function () {
    app.methods.initScene(); // Use 'app.methods' instead of 'app'
  },
  methods: {
    initScene: function () {
      app.data.container = document.getElementById('blur-canvas');
      app.data.renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
      app.data.renderer.setPixelRatio(window.devicePixelRatio);
      app.data.renderer.setSize(window.innerWidth, window.innerHeight);
      app.data.container.appendChild(app.data.renderer.domElement);

      // Create Scene
      app.data.scene = new THREE.Scene();

      // Texture Loader
      app.data.textureLoader = new THREE.TextureLoader();

      // Create Camera
      app.data.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
      app.data.camera.position.set(0, 0, 30);

      //app mask
      app.methods.loaderTransition();
      // Create Blur Back
      app.methods.createBlurBack();

      // Animate the Scene
      app.methods.animate();
      app.methods.animteSun();
      // Handle window resize
      window.addEventListener('resize', app.methods.onResize);
    },
    //App mask
    loaderTransition: function () {
      var t = this;

      // Animate the loader heart element
      gsap.to('.loader-hart', {
        scale: 70,
        duration: 2,
        ease: 'power2.inOut',
      });

      // Animate the app mask element
      gsap.to('.app-mask', {
        maskSize: window.innerWidth > 1024 ? 2 * window.innerWidth : 3 * window.innerHeight,
        duration: 2,
        delay: 0.4,
        ease: 'power2.inOut',
        onComplete: function () {
          // After animation completes, hide the loader heart and modify the app mask
          gsap.set('.loader-hart', {
            display: 'none',
          });
          gsap.set('.app-mask', {
            maskImage: 'none',
            height: 'auto',
          });
        },
      });
    },
    animteSun: function () {
      let sun = document.querySelector('.for-sun img');
      gsap.to(sun, {
        repeat: -1,
        x: '-66.666%',
        ease: 'steps(2)',
        duration: 0.8,
        yoyo: true,
      });
    },

    createBlurBack: function () {
      var t,
        e = this;

      var texturePath = app.methods.isDesktop()
        ? window.shopifyAssetUrl.textureDesktopPath
        : window.shopifyAssetUrl.textureDesktopPath;
      console.log(texturePath);
      app.data.textureLoader.load(texturePath, (texture) => {
        const scale = app.methods.isDesktop() ? 12 : 6;

        // Initial plane geometry
        const planeGeometry = new THREE.PlaneGeometry(texture.image.width / scale, texture.image.height / scale);

        // Create the first mesh with MeshBasicMaterial
        const material1 = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          color: 0xb8b8b8, // Example color
        });
        const mesh1 = new THREE.Mesh(planeGeometry, material1);
        mesh1.position.set(-20, -30, 1);
        app.data.scene.add(mesh1);

        // Create another mesh with MeshStandardMaterial
        const material2 = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          emissive: 0xff0000, // Example emissive color
          roughness: 1,
          opacity: 0.8,
        });
        const mesh2 = new THREE.Mesh(planeGeometry, material2);
        mesh2.position.set(20, -15, 1);
        app.data.scene.add(mesh2);

        // Additional mesh with another material
        const sizeFactor = texture.image.width / scale;
        const additionalGeometry = new THREE.PlaneGeometry(sizeFactor, sizeFactor);

        const material3 = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          emissive: 0x11ff00, // Example emissive color
          roughness: 1,
          opacity: 0,
        });
        const mesh3 = new THREE.Mesh(additionalGeometry, material3);
        mesh3.position.set(25, -7, 1);
        app.data.scene.add(mesh3);

        // Example of adding even more materials and meshes
        // You can repeat the same structure for additional meshes as needed
        // For example:
        const sizeFactor3 = texture.image.width / 12;
        const material5 = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          emissive: 0xff00ff,
          roughness: 1,
        });
        const mesh5 = new THREE.Mesh(new THREE.PlaneGeometry(sizeFactor3, sizeFactor3), material5);
        mesh5.position.set(-30, 20, 1);
        app.data.scene.add(mesh5);

        setTimeout(() => {
          // Assuming e.$store is defined and provides an event subscription
          setTimeout(() => {
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: 'body',
                start: 'top+=500px top',
                toggleActions: 'play none play reverse',
              },
            });

            // Animation for L.position
            timeline.to(mesh1.position, {
              y: 25,
              x: -10,
              duration: 2.5,
            });

            // Animation for L.material.emissive
            timeline.to(mesh1.material.emissive, {
              r: 0.01,
              g: 0.85,
              b: 0.8,
              duration: 2.5,
              yoyo: true, // Reverse direction after each cycle
              repeat: -1, // Infinite loop
            });

            // Animation for z.material.emissive
            timeline.to(mesh2.material.emissive, {
              r: 1,
              g: 0,
              b: 0.96,
              duration: 2.5,
              yoyo: true, // Reverse direction after each cycle
              repeat: -1, // Infinite loop
            });

            // Animation for z.position
            timeline.to(mesh2.position, {
              x: 25,
              y: -7,
              duration: 2.5,
            });

            // Animation for f.material.color
            timeline.to(mesh3.material.color, {
              r: 1,
              g: 0,
              b: 0.96,
              duration: 1.5,
              yoyo: true, // Reverse direction after each cycle
              repeat: -1, // Infinite loop
            });

            // Animation for _.material.opacity
            timeline.to(mesh5.material, {
              opacity: 0.8,
              duration: 2.5,
              scrollTrigger: {
                trigger: '.home-stories',
                start: 'top top',
                toggleActions: 'play none play reverse',
              },
            });

            // Animation for f.material.opacity
            timeline.to(mesh3.material, {
              opacity: 0,
              duration: 2.5,
              scrollTrigger: {
                trigger: '.home-stories',
                start: 'top top',
                toggleActions: 'play none play reverse',
              },
            });

            // Animation for w.material.opacity
            timeline.to(mesh5.material, {
              opacity: 1,
              duration: 2.5,
              scrollTrigger: {
                trigger: '.home-stories',
                start: 'top top',
                toggleActions: 'play none play reverse',
              },
            });

            // Animation for L.scale
            timeline.to(mesh1.scale, {
              x: 1.5,
              y: 1.5,
              z: 1.5,
              duration: 2.5,
              scrollTrigger: {
                trigger: '.home-stories',
                start: 'top top',
                toggleActions: 'play none play reverse',
              },
            });

            // Animation for I.emissive
            timeline.to(mesh3.emissive, {
              r: 0.32,
              g: 0,
              b: 1,
              duration: 1.5,
              yoyo: true, // Reverse direction after each cycle
            });

            //Stars
            gsap.to('.stars', {
              scrollTrigger: {
                trigger: '.natureScroller', // The element that triggers the animation
                scrub: 1, // Smooth scrubbing
                start: '25% top', // Animation starts when ".natureScroller" is 25% from the top of the viewport
                end: '50% top', // Animation ends when ".natureScroller" is 50% from the top of the viewport
              },
              autoAlpha: 0, // Fade out the element (opacity to 0 and visibility hidden)
            });

            const secondText = new SplitType('#second', { type: 'words, chars' });
            const lifeText = new SplitType('#life span', { type: 'words, chars' });

            gsap.from(secondText.chars, {
              autoAlpha: 0,
              y: 50,
              stagger: 0.1,
              scrollTrigger: {
                trigger: '.textTrigger',
                start: 'top top',
                scrub: 1,
              },
            }),
              gsap.from(lifeText.chars, {
                autoAlpha: 0,
                y: 50,
                stagger: 0.1,
                delay: 1,
                scrollTrigger: {
                  trigger: '.textTrigger',
                  start: '50% top',
                  scrub: 1,
                },
              });
            gsap.to('.sunset', {
              scrollTrigger: {
                trigger: '.natureScroller',
                scrub: 1,
                start: ''.concat(25, '% top'),
              },
              backgroundPositionY: '100%',
            });
            gsap.to('.lightImage', {
              duration: 4,
              delay: 2,
              scale: 0.2,
              top: '52vh',
              left: '50%',
              ease: 'power1',
            });
            gsap.to('.natureScroller .cloud-fixed-left', {
              x: () => `${gsap.utils.random(20, 30)}vw`, // Random between 20vw and 30vw
              ease: 'power1.inOut',
              stagger: {
                amount: 0.2,
              },
              scrollTrigger: {
                trigger: '.natureScroller',
                start: 'center center',
                end: '1200px',
                scrub: 1, // Set scrub to a smoother transition value
                anticipatePin: 1, // Adds a smoother scroll anticipation
              },
            });

            gsap.to('.natureScroller .cloud-fixed-right', {
              x: () => `${gsap.utils.random(-30, -20)}vw`, // Random between -30vw and -20vw
              ease: 'power1.inOut',
              stagger: {
                amount: 0.2,
              },
              scrollTrigger: {
                trigger: '.natureScroller',
                start: 'center center',
                end: '1200px',
                scrub: 1, // Set scrub to a smoother transition value
                anticipatePin: 1, // Adds a smoother scroll anticipation
              },
            });
            gsap.utils.toArray('.lifeParallax').forEach((e, t) => {
              gsap.from(e, {
                y: 100 * t,
                scrollTrigger: {
                  trigger: '.natureScroller',
                  scrub: 1,
                  start: '70% bottom',
                  end: 'bottom center',
                },
              });
            });
            const i = gsap.timeline({
              repeat: -1, // Infinite repeat
            });

            // Define the animation for .mainLeaf element
            i.to('.mainLeaf', {
              rotate: -10, // Rotate to -10 degrees
              duration: 5, // Duration of 5 seconds
              ease: 'power1.inOut', // Easing function
            }).to('.mainLeaf', {
              rotate: 0, // Rotate back to 0 degrees
              duration: 5, // Duration of 5 seconds
              ease: 'power1.inOut', // Easing function
            });

            gsap.to('.bubbles1', {
              top: '0',
              duration: 10,
              rotate: 30,
              ease: 'linear',
              repeat: -1,
            });
            gsap.to('.bubbles2', {
              top: '-200px',
              duration: 15,
              rotate: -30,
              ease: 'linear',
              delay: 2,
              repeat: -1,
            });
            gsap.to('.bubbles3', {
              top: '-200px',
              duration: 20,
              rotate: -30,
              ease: 'linear',
              delay: 5,
              repeat: -1,
            });
          }, 500);
        }, 1000);

        //Stars
      });
    },
    animate: function () {
      requestAnimationFrame(app.methods.animate);
      app.data.renderer.render(app.data.scene, app.data.camera);
    },
    onResize: function () {
      app.data.camera.aspect = window.innerWidth / window.innerHeight;
      app.data.camera.updateProjectionMatrix();
      app.data.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    isDesktop: function () {
      return window.innerWidth > 768;
    },
  },
};

// Initialize the app
app.mounted();

var flies = {
  data: {
    butterflies: document.getElementsByClassName('flies'), // Get all elements with class 'flies'
  },
  mounted: function () {
    flies.methods.initFly(); // Initialize the flying animation
  },
  methods: {
    initFly: function () {
      if (flies.data.butterflies.length === 0) {
        console.warn("No elements with the class 'flies' found.");
        return;
      }
      // Loop through each butterfly element and apply random animations
      Array.from(flies.data.butterflies).forEach(function (butterfly) {
        flies.methods.randomPosition(butterfly); // Set random initial position
        var randomX = Math.random() * window.innerWidth;
        var randomY = Math.random() * window.innerHeight;

        // Initial setup of butterfly
        gsap.set(butterfly, {
          xPercent: randomX,
          yPercent: randomY,
          autoAlpha: 1,
        });

        // Start the recursive random movement for each butterfly
        flies.methods.randomGo(butterfly);
      });

      flies.methods.startSeq(); // Start other animations (if needed)
    },
    randomPosition: function (butterfly) {
      // Define the four corner positions: top-left, top-right, bottom-left, bottom-right
      var positions = [
        { top: '0px', left: '0px' }, // Top-left corner
        { top: '0px', right: '0px' }, // Top-right corner
        { bottom: '0px', left: '0px' }, // Bottom-left corner
        { bottom: '0px', right: '0px' }, // Bottom-right corner
      ];

      // Randomly select one of the corner positions
      var position = positions[Math.floor(Math.random() * positions.length)];

      // Apply the randomly selected position to the butterfly's style
      Object.assign(butterfly.style, position);
    },
    randomGo: function (butterfly) {
      // Generate random values for the next animation
      var t = Math.random() * (window.innerWidth - 50) + 50,
        e = Math.random() * (window.innerHeight - 100) + 100,
        o = 10 * Math.random() + 10; // Random duration between 10 and 20

      // GSAP animation with motionPath for each butterfly
      gsap.to(butterfly, {
        motionPath: {
          path: [
            { x: 100, y: 200 }, // Starting point
            { x: t, y: e }, // Random end point
          ],
          curviness: 1, // Smoother path
          autoRotate: true, // Enable autoRotate for smoother motion
        },
        duration: o, // Random duration
        stagger: 0, // No stagger
        ease: 'none', // Linear easing
        delay: 0, // No delay
        onComplete: function () {
          // Call the function again for recursive animation after completion
          flies.methods.randomGo(butterfly);
        },
      });
    },
    startSeq: function () {
      // Example of other animations happening at the same time
      gsap.to('.flies .bat-1', {
        repeat: -1, // Infinite loop
        x: -181, // Move by -181px
        ease: 'steps(2)', // Stepped easing
        duration: 0.5, // Half second per cycle
        yoyo: true, // Reverse direction after each cycle
      });
    },
  },
};

// Start the animation sequence
flies.mounted();

console.log(document.querySelector('.stars'));
