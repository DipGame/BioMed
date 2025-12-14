document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector('#map')) {
        ymaps.ready(init);

        function init() {
            // Создаем SVG-иконку
            var svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1C4.6862 1 2 3.6862 2 7C2 8.6563 2.6711 10.156 3.7565 11.2417C4.8422 12.328 7.4 13.9 7.55 15.55C7.57249 15.7974 7.7516 16 8 16C8.2484 16 8.42751 15.7974 8.45 15.55C8.6 13.9 11.1578 12.328 12.2435 11.2417C13.3289 10.156 14 8.6563 14 7C14 3.6862 11.3138 1 8 1Z" fill="#FF4433"/><path d="M8.00002 9.10015C9.15982 9.10015 10.1 8.15994 10.1 7.00015C10.1 5.84035 9.15982 4.90015 8.00002 4.90015C6.84023 4.90015 5.90002 5.84035 5.90002 7.00015C5.90002 8.15994 6.84023 9.10015 8.00002 9.10015Z" fill="white"/></svg>
`;

            if (window.innerWidth < 501) {
                // Создаем карту
                var myMap = new ymaps.Map("map", {
                    center: [61.236764, 73.405950],
                    zoom: 16,
                    controls: []
                }, {
                    // Устанавливаем черно-белую палитру
                    geoObjectOpenBalloonIconLayout: "default#image",
                    suppressMapOpenBlock: true
                });
            } else {
                // Создаем карту
                var myMap = new ymaps.Map("map", {
                    center: [61.237964, 73.405950],
                    zoom: 16,
                    controls: []
                }, {
                    // Устанавливаем черно-белую палитру
                    geoObjectOpenBalloonIconLayout: "default#image",
                    suppressMapOpenBlock: true
                });
            }


            // Создаем метку с SVG-иконкой
            var myPlacemark = new ymaps.Placemark([61.237964, 73.405950], {}, {
                iconLayout: 'default#image',
                iconImageHref: 'data:image/svg+xml;base64,' + btoa(svgIcon),
                iconImageSize: [63, 73],
                iconImageOffset: [-31.5, -73]
            });

            // Добавляем метку на карту
            myMap.geoObjects.add(myPlacemark);
        }
    }
    if (document.querySelector('#map2')) {
        ymaps.ready(init);

        function init() {
            // Создаем SVG-иконку
            var svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1C4.6862 1 2 3.6862 2 7C2 8.6563 2.6711 10.156 3.7565 11.2417C4.8422 12.328 7.4 13.9 7.55 15.55C7.57249 15.7974 7.7516 16 8 16C8.2484 16 8.42751 15.7974 8.45 15.55C8.6 13.9 11.1578 12.328 12.2435 11.2417C13.3289 10.156 14 8.6563 14 7C14 3.6862 11.3138 1 8 1Z" fill="#FF4433"/><path d="M8.00002 9.10015C9.15982 9.10015 10.1 8.15994 10.1 7.00015C10.1 5.84035 9.15982 4.90015 8.00002 4.90015C6.84023 4.90015 5.90002 5.84035 5.90002 7.00015C5.90002 8.15994 6.84023 9.10015 8.00002 9.10015Z" fill="white"/></svg>
`;

            // Создаем карту
            var myMap = new ymaps.Map("map2", {
                center: [61.237964, 73.405950],
                zoom: 16,
                controls: []
            }, {
                // Устанавливаем черно-белую палитру
                geoObjectOpenBalloonIconLayout: "default#image",
                suppressMapOpenBlock: true
            });


            // Создаем метку с SVG-иконкой
            var myPlacemark = new ymaps.Placemark([61.237964, 73.405950], {}, {
                iconLayout: 'default#image',
                iconImageHref: 'data:image/svg+xml;base64,' + btoa(svgIcon),
                iconImageSize: [63, 73],
                iconImageOffset: [-31.5, -73]
            });

            // Добавляем метку на карту
            myMap.geoObjects.add(myPlacemark);
        }
    }
})