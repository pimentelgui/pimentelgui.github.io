
document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll("[data-carousel]");

    carousels.forEach((carousel) => {
        const viewport = carousel.querySelector("[data-carousel-viewport]");
        const track = carousel.querySelector("[data-carousel-track]");
        const previousButton = carousel.querySelector("[data-carousel-prev]");
        const nextButton = carousel.querySelector("[data-carousel-next]");

        if (!viewport || !track) return;

        const getStep = () => {
            const slide = track.querySelector(".carousel-slide");
            if (!slide) return viewport.clientWidth;

            const gap = parseFloat(
                getComputedStyle(track).gap
            ) || 0;

            return slide.getBoundingClientRect().width + gap;
        };

        const updateButtons = () => {
            const maxScroll = viewport.scrollWidth - viewport.clientWidth;
            const canScroll = maxScroll > 2;

            if (previousButton) {
                previousButton.disabled =
                    !canScroll || viewport.scrollLeft <= 2;
            }

            if (nextButton) {
                nextButton.disabled =
                    !canScroll || viewport.scrollLeft >= maxScroll - 2;
            }

            viewport.classList.toggle("is-draggable", canScroll);
        };

        previousButton?.addEventListener("click", () => {
            viewport.scrollBy({
                left: -getStep(),
                behavior: "smooth"
            });
        });

        nextButton?.addEventListener("click", () => {
            viewport.scrollBy({
                left: getStep(),
                behavior: "smooth"
            });
        });

        viewport.addEventListener("scroll", updateButtons);
        window.addEventListener("resize", updateButtons);

        // Arrastar com o mouse
        let dragging = false;
        let startX = 0;
        let startScroll = 0;
        let moved = false;

        viewport.addEventListener("mousedown", (event) => {
            if (event.button !== 0) return;
            if (event.target.closest("a, button")) return;

            dragging = true;
            moved = false;
            startX = event.pageX;
            startScroll = viewport.scrollLeft;

            viewport.classList.add("is-dragging");
        });

        window.addEventListener("mousemove", (event) => {
            if (!dragging) return;

            const distance = event.pageX - startX;

            if (Math.abs(distance) > 4) moved = true;

            viewport.scrollLeft = startScroll - distance;
        });

        window.addEventListener("mouseup", () => {
            if (!dragging) return;

            dragging = false;
            viewport.classList.remove("is-dragging");
        });

        viewport.addEventListener("click", (event) => {
            if (!moved) return;

            event.preventDefault();
            event.stopPropagation();
            moved = false;
        }, true);

        updateButtons();
    });
});
