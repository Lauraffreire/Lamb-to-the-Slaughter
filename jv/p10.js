const container = document.getElementById("eyes-container");

const NUM_EYES = 20;
const EYE_WIDTH = 120;
const EYE_HEIGHT = 60;
const MIN_DISTANCE = 170;
const MIN_DISTANCE_IMAGES = 10;

const eyes = [];
const imageEyes = Array.from(document.querySelectorAll(".image-eye"));
const pupilColors = [
    "#2f2c1b", "#4a6285", "#324561", "#666",
    "#240c06", "#3d2907", "#615237", "#8d8664"
];

/* ================= COLLISIONS ================= */

function collidesWithEyes(x, y) {
    return eyes.some(e => {
        const dx = e.x - x;
        const dy = e.y - y;
        return Math.hypot(dx, dy) < MIN_DISTANCE;
    });
}

function collidesWithImages(x, y) {
    return imageEyes.some(img => {
        const rect = img.getBoundingClientRect();
        return !(
            x + EYE_WIDTH + MIN_DISTANCE_IMAGES < rect.left ||
            x > rect.right + MIN_DISTANCE_IMAGES ||
            y + EYE_HEIGHT + MIN_DISTANCE_IMAGES < rect.top ||
            y > rect.bottom + MIN_DISTANCE_IMAGES
        );
    });
}

/* ================= CREATE BACKGROUND EYES ================= */

function createEye() {
    const eye = document.createElement("div");
    eye.classList.add("eye");
    eye.innerHTML = "<i></i>";

    const pupil = eye.querySelector("i");
    const innerPupil = document.createElement("div");
    innerPupil.classList.add("pupil");
    pupil.appendChild(innerPupil);

    pupil.style.background =
        pupilColors[Math.floor(Math.random() * pupilColors.length)];

    let x, y, tries = 0, placed = false;

    while (!placed && tries < 1000) {
        x = Math.random() * (window.innerWidth - EYE_WIDTH);
        y = Math.random() * (window.innerHeight - EYE_HEIGHT);

        if (!collidesWithEyes(x, y) && !collidesWithImages(x, y)) {
            placed = true;
        }
        tries++;
    }

    if (!placed) {
        x = Math.random() * (window.innerWidth - EYE_WIDTH);
        y = Math.random() * (window.innerHeight - EYE_HEIGHT);
    }

    eye.style.left = `${x}px`;
    eye.style.top = `${y}px`;
    container.appendChild(eye);

    const eyeObj = {
        eye,
        pupil,
        x, y,
        blinkProgress: 0,
        closing: false,
        hovering: false,
        speed: 0.004 + Math.random() * 0.01,
        nextBlink: performance.now() + Math.random() * 4000 + 1000
    };

    eye.addEventListener("mouseenter", () => {
        eyeObj.hovering = true;
        eyeObj.closing = true;
    });

    eye.addEventListener("mouseleave", () => {
        eyeObj.hovering = false;
    });

    eyes.push(eyeObj);
}

for (let i = 0; i < NUM_EYES; i++) createEye();

/* ================= PUPIL FOLLOW ================= */

document.addEventListener("mousemove", e => {
    eyes.forEach(({ pupil, eye }) => {
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        const distance = 15;

        pupil.style.transform =
            `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
    });
});

/* ================= BLINK BACKGROUND EYES ================= */

function animate() {
    const now = performance.now();

    eyes.forEach(o => {
        if (!o.hovering && !o.closing && now >= o.nextBlink) {
            o.closing = true;
        }

        if (o.closing) {
            o.blinkProgress += o.speed;
            if (o.blinkProgress >= 1) {
                o.blinkProgress = 1;
                o.closing = false;
                o.nextBlink = now + Math.random() * 4000 + 1000;
            }
        } else if (!o.hovering && o.blinkProgress > 0) {
            o.blinkProgress -= o.speed;
        }

        if (o.hovering && o.blinkProgress < 1) {
            o.blinkProgress += o.speed * 2;
        }

        const val = -47 * o.blinkProgress;
        o.eye.style.setProperty("--eyelid", `${val}%`);
        o.eye.style.setProperty("--eyelid2", `${-val}%`);
    });

    requestAnimationFrame(animate);
}

animate();

/* ================= IMAGE EYES ================= */

const imageEyeObjs = [];

imageEyes.forEach(eye => {
    const obj = {
        eye,
        blinkProgress: 0,
        closing: false,
        hovering: false,
        selected: false,
        speed: 0.008,
        nextBlink: performance.now() + Math.random() * 3000 + 1500
    };

    eye.addEventListener("mouseenter", () => {
        obj.hovering = true;
        obj.closing = true;
    });

    eye.addEventListener("mouseleave", () => {
        obj.hovering = false;
    });

    const radio = eye.closest("label")?.querySelector("input");
    if (radio) {
        radio.addEventListener("change", () => {
            imageEyeObjs.forEach(o => o.selected = false);
            obj.selected = radio.checked;
            obj.closing = true;
        });
    }

    imageEyeObjs.push(obj);
});

function animateImageEyes() {
    const now = performance.now();

    imageEyeObjs.forEach(o => {
        if (o.selected) {
            o.blinkProgress = 1;
        } else if (o.closing) {
            o.blinkProgress += o.hovering ? o.speed * 2 : o.speed;
            if (o.blinkProgress >= 1) {
                o.blinkProgress = 1;
                o.closing = false;
                o.nextBlink = now + Math.random() * 3000 + 1500;
            }
        } else if (!o.hovering && o.blinkProgress > 0) {
            o.blinkProgress -= o.speed;
        }

        const val = -50 * o.blinkProgress;
        o.eye.style.setProperty("--eyelid", `${val}%`);
        o.eye.style.setProperty("--eyelid2", `${-val}%`);
    });

    requestAnimationFrame(animateImageEyes);
}

animateImageEyes();
