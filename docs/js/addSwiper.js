document.addEventListener("DOMContentLoaded", function () {

    let mainBannerSection = new Swiper(".mainBannerSection", {
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false,
        // },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1500,
        loop: true,
        slidesPerView: 1,
        navigation: {
            nextEl: ".mainBannerSection .sw-btn-next",
            prevEl: ".mainBannerSection .sw-btn-prev",
        },
    });
    let aboutPartnersSwiper = new Swiper(".aboutPartnersSwiper", {
        loop: true,
        slidesPerView: "auto",
        spaceBetween: 16,
        allowTouchMove: true, // Разрешаем ручную прокрутку
        speed: 0, // Отключаем стандартную анимацию Swiper
    });

    // Непрерывная плавная прокрутка без остановок
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Скорость прокрутки (пикселей за кадр)
    let isUserInteracting = false; // Флаг взаимодействия пользователя
    let resumeTimeout = null;
    
    function continuousScroll() {
        if (!aboutPartnersSwiper || !aboutPartnersSwiper.wrapperEl) {
            requestAnimationFrame(continuousScroll);
            return;
        }
        
        if (!isUserInteracting) {
            const wrapper = aboutPartnersSwiper.wrapperEl;
            scrollPosition += scrollSpeed;
            
            // Получаем ширину wrapper для бесшовного loop
            const wrapperWidth = wrapper.scrollWidth;
            
            // Если прокрутили на половину ширины, сбрасываем позицию
            if (scrollPosition >= wrapperWidth / 2) {
                scrollPosition = 0;
            }
            
            wrapper.style.transition = 'none';
            wrapper.style.transform = `translate3d(-${scrollPosition}px, 0, 0)`;
        } else {
            // Обновляем scrollPosition на текущую позицию Swiper при взаимодействии
            if (aboutPartnersSwiper && aboutPartnersSwiper.wrapperEl) {
                const wrapper = aboutPartnersSwiper.wrapperEl;
                const currentTransform = window.getComputedStyle(wrapper).transform;
                if (currentTransform && currentTransform !== 'none') {
                    const matrix = currentTransform.match(/matrix\(([^)]+)\)/);
                    if (matrix) {
                        const values = matrix[1].split(',');
                        scrollPosition = Math.abs(parseFloat(values[4]) || 0);
                    }
                }
            }
        }
        
        requestAnimationFrame(continuousScroll);
    }
    
    // Обработчики событий Swiper для отслеживания взаимодействия пользователя
    aboutPartnersSwiper.on('touchStart', () => {
        isUserInteracting = true;
        if (resumeTimeout) {
            clearTimeout(resumeTimeout);
        }
    });
    
    aboutPartnersSwiper.on('touchEnd', () => {
        resumeTimeout = setTimeout(() => {
            isUserInteracting = false;
        }, 1500); // Возобновляем автопрокрутку через 1.5 секунды после окончания взаимодействия
    });
    
    aboutPartnersSwiper.on('touchMove', () => {
        isUserInteracting = true;
        if (resumeTimeout) {
            clearTimeout(resumeTimeout);
        }
    });
    
    // Для мыши (десктоп)
    const swiperElement = document.querySelector(".aboutPartnersSwiper");
    if (swiperElement) {
        swiperElement.addEventListener('mousedown', () => {
            isUserInteracting = true;
            if (resumeTimeout) {
                clearTimeout(resumeTimeout);
            }
        });
        
        swiperElement.addEventListener('mouseup', () => {
            resumeTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, 1500);
        });
        
        swiperElement.addEventListener('mouseleave', () => {
            resumeTimeout = setTimeout(() => {
                isUserInteracting = false;
            }, 1500);
        });
    }
    
    // Запускаем непрерывную прокрутку после инициализации Swiper
    setTimeout(() => {
        continuousScroll();
    }, 100);



    if (document.getElementById('isAdmin')) {
        console.log('addSwiper.js finish work');
    }
});
