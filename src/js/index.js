
document.addEventListener("DOMContentLoaded", function () {

    function addClass(el, class_name) {
        el.classList.add(class_name);
    }
    function removeClass(el, class_name) {
        el.classList.remove(class_name);
    }
    function toggleClass(el, class_name) {
        el.classList.toggle(class_name);
    }

    let loadSvg = document.getElementById('load-svg');

    function addLoad() {
        addClass(loadSvg, 'open');
    }
    function removeLoad() {
        removeClass(loadSvg, 'open');
    }

    function removeAllOpen() {
        if (document.querySelector('.open')) {
            document.querySelectorAll('.open').forEach(el => {
                removeClass(el, "open");
            });
        }
    }

    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const screenWidth = window.screen.width
    const screenHeight = window.screen.height

    if (document.querySelector('a[href^="#"]')) {
        const headerOffset = header ? header.offsetHeight : 0;

        // Находим все ссылки с якорями внутри текущей страницы
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Пропускаем пустые якоря (#) и внешние ссылки
            if (href === '#' || href.length <= 1) return;

            const targetId = href.substring(1); // убираем '#'
            const targetElement = document.getElementById(targetId);

            // Если целевой элемент существует — навешиваем обработчик
            if (targetElement) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();

                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset - 40;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                });
            }
        });
    }


    $(function () {
        function slideMenu() {
            var activeState = $("#menu-container .menu-list").hasClass("active");
            $("#menu-container .menu-list").animate({ left: activeState ? "0%" : "-100%" }, 400);
        }
        $("#menu-wrapper").click(function (event) {
            event.stopPropagation();
            $("#hamburger-menu").toggleClass("open");
            $("#menu-container .menu-list").toggleClass("active");
            slideMenu();

            $("header").toggleClass("open");
        });

        $(".menu-list").find(".accordion-toggle").click(function () {
            $(this).next().toggleClass("open").slideToggle("fast");
            $(this).toggleClass("active-tab").find(".menu-link").toggleClass("active");

            $(".menu-list .accordion-content").not($(this).next()).slideUp("fast").removeClass("open");
            $(".menu-list .accordion-toggle").not(jQuery(this)).removeClass("active-tab").find(".menu-link").removeClass("active");
        });
    });

    if (document.querySelector('header')) {
        const headerBot = document.querySelector('header');

        if (!headerBot || !main) return;

        main.style.paddingTop = `${headerBot.offsetHeight}px`;

        // Сохраняем исходную позицию элемента
        let originalHeaderTop = headerBot.offsetTop;

        function handleScroll() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            // Если прокрутили до верха страницы
            if (scrollTop === 0) {
                headerBot.classList.remove('fixed'); // Удаляем класс fixed
                // main.style.paddingTop = '0'; // Сбрасываем padding-top
            }
            // Если прокрутили ниже исходной позиции header
            else if (scrollTop >= originalHeaderTop) {
                headerBot.classList.add('fixed'); // Добавляем класс fixed
                // main.style.paddingTop = `${headerBot.offsetHeight}px`; // Устанавливаем padding-top
            }
        }

        // Обработчик изменения размера окна
        function handleResize() {
            // Пересчитываем исходную позицию при изменении размера окна
            originalHeaderTop = headerBot.offsetTop;
            handleScroll(); // Вызываем handleScroll для корректировки состояния
        }

        // Добавляем обработчики событий
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        // Убедимся, что скрипт выполняется после полной загрузки DOM
        document.addEventListener('DOMContentLoaded', () => {
            // Пересчитываем originalHeaderTop после загрузки DOM
            originalHeaderTop = headerBot.offsetTop;
            handleScroll(); // Вызываем handleScroll для корректировки состояния
        });
    }

    if (document.querySelector('.header-overlay')) {
        const headerOverlay = document.querySelector('.header-overlay');

        headerOverlay.addEventListener('click', () => {
            removeAllOpen();
        })
    }

    if (document.querySelector('[data-accordion-item]')) {
        const accordionItems = document.querySelectorAll('[data-accordion-item]');
        accordionItems.forEach(item => {
            const toggle = item.querySelector('[data-accordion-toggle]');
            const content = item.querySelector('[data-accordion-content]');
            
            if (!toggle || !content) return;
            
            // Обработчик клика на toggle
            toggle.addEventListener('click', () => {
                const isActive = content.classList.contains('active');
                
                if (isActive) {
                    // Закрываем
                    removeClass(content, 'active');
                    removeClass(toggle, 'active');
                    removeClass(item, 'active');
                } else {
                    // Открываем текущий
                    addClass(content, 'active');
                    addClass(toggle, 'active');
                    addClass(item, 'active');
                }
            });
        });
    }

    /**
     * Функционал "Показать еще" для контейнеров с элементами
     * 
     * АТРИБУТЫ КОНТЕЙНЕРА (data-more-container):
     * - data-more-container (ОБЯЗАТЕЛЬНЫЙ) - уникальное значение для связи контейнера с кнопкой
     * - data-more-container-max (НЕОБЯЗАТЕЛЬНЫЙ) - максимальное количество видимых элементов (по умолчанию: 3)
     * - data-more-for-mobile (НЕОБЯЗАТЕЛЬНЫЙ) - если значение "Y", то для скрытых элементов и кнопки 
     *   используется класс "invise-for-mobile" вместо "invise" (для управления видимостью через CSS на разных экранах)
     * 
     * АТРИБУТЫ ЭЛЕМЕНТОВ ВНУТРИ КОНТЕЙНЕРА:
     * - data-more-item (ОБЯЗАТЕЛЬНЫЙ) - указывает на элементы, которые могут быть скрыты/показаны
     * 
     * АТРИБУТЫ КНОПКИ (data-more-button):
     * - data-more-button (ОБЯЗАТЕЛЬНЫЙ) - значение должно совпадать с data-more-container для связи
     * - data-more-btn-num (НЕОБЯЗАТЕЛЬНЫЙ) - количество элементов, которые открываются при клике (по умолчанию: все)
     * 
     * ЛОГИКА РАБОТЫ:
     * 1. При загрузке страницы элементы начиная с (max+1) скрываются:
     *    - Если data-more-for-mobile="Y" → класс "invise-for-mobile"
     *    - Иначе → класс "invise"
     * 2. Кнопка показывается/скрывается в зависимости от наличия скрытых элементов:
     *    - Если есть скрытые элементы и data-more-for-mobile="Y" → кнопке добавляется "invise-for-mobile"
     *    - Если есть скрытые элементы и data-more-for-mobile нет/не "Y" → кнопка без классов (видна)
     *    - Если скрытых элементов нет → кнопке добавляется "invise" (полностью скрыта)
     * 3. При клике на кнопку открывается указанное количество элементов (или все, если атрибут не указан)
     * 
     * CSS СЕЛЕКТОРЫ (в _base.scss):
     * - .invise-for-mobile[data-more-button] - скрывает кнопку на больших экранах (display: none !important)
     * - @media (max-width: 500px):
     *   - .invise-for-mobile:not([data-more-button]) - скрывает элементы на мобильных устройствах
     *   - .invise-for-mobile[data-more-button] - показывает кнопку на мобильных устройствах (display: block !important)
     */
    if (document.querySelector('[data-more-container]')) {
        const moreContainers = document.querySelectorAll('[data-more-container]');
        moreContainers.forEach(container => {
            // Получаем значение атрибута контейнера
            const containerValue = container.getAttribute('data-more-container');

            // Находим соответствующую кнопку
            const button = document.querySelector(`[data-more-button="${containerValue}"]`);
            if (!button) return;

            // Получаем максимальное количество видимых элементов (по умолчанию 3)
            const maxVisible = parseInt(container.getAttribute('data-more-container-max')) || 3;

            // Проверяем атрибут для мобильных устройств
            const forMobile = container.getAttribute('data-more-for-mobile') === 'Y';

            // Получаем все элементы с data-more-item
            const items = container.querySelectorAll('[data-more-item]');

            // Функция для инициализации: скрываем элементы, начиная с (maxVisible + 1)
            function initItems() {
                items.forEach((item, index) => {
                    if (index >= maxVisible) {
                        // Начиная с четвертого элемента (индекс 3) добавляем класс
                        if (forMobile) {
                            addClass(item, 'invise-for-mobile');
                        } else {
                            addClass(item, 'invise');
                        }
                    }
                });

                // Проверяем количество элементов и добавляем нужный класс кнопке
                if (items.length > maxVisible) {
                    // Если есть скрытые элементы
                    if (forMobile) {
                        // Если data-more-for-mobile="Y", добавляем invise-for-mobile
                        addClass(button, 'invise-for-mobile');
                        removeClass(button, 'invise');
                    } else {
                        // Если data-more-for-mobile нет или не равен "Y", не добавляем никакого класса
                        removeClass(button, 'invise');
                        removeClass(button, 'invise-for-mobile');
                    }
                } else {
                    // Если скрытых элементов нет, скрываем кнопку через обычный invise
                    addClass(button, 'invise');
                    removeClass(button, 'invise-for-mobile');
                }
            }

            // Инициализация при загрузке
            initItems();

            // Обработчик клика на кнопку
            button.addEventListener('click', (e) => {
                e.preventDefault();

                // Получаем количество элементов для открытия (по умолчанию все)
                const btnNum = button.getAttribute('data-more-btn-num');
                const numToShow = btnNum ? parseInt(btnNum) : items.length;

                // Находим все скрытые элементы
                const hiddenItems = Array.from(items).filter(item => {
                    return item.classList.contains('invise') || item.classList.contains('invise-for-mobile');
                });

                // Открываем элементы (не больше, чем указано в btnNum, или все)
                const itemsToShow = hiddenItems.slice(0, numToShow);
                itemsToShow.forEach(item => {
                    removeClass(item, 'invise');
                    removeClass(item, 'invise-for-mobile');
                });

                // Проверяем, остались ли еще скрытые элементы
                const remainingHidden = Array.from(items).filter(item => {
                    return item.classList.contains('invise') || item.classList.contains('invise-for-mobile');
                });

                // Обновляем класс кнопки в зависимости от наличия скрытых элементов
                if (remainingHidden.length === 0) {
                    // Если скрытых элементов не осталось, скрываем кнопку через обычный invise
                    addClass(button, 'invise');
                    removeClass(button, 'invise-for-mobile');
                } else {
                    // Если еще есть скрытые элементы
                    if (forMobile) {
                        // Если data-more-for-mobile="Y", добавляем invise-for-mobile
                        addClass(button, 'invise-for-mobile');
                        removeClass(button, 'invise');
                    } else {
                        // Если data-more-for-mobile нет или не равен "Y", не добавляем никакого класса
                        removeClass(button, 'invise');
                        removeClass(button, 'invise-for-mobile');
                    }
                }
            });
        })
    }

    if (document.querySelector('.footer-check-height-cont')) {
        const footerCheckHeightCont = document.querySelectorAll('.footer-check-height-cont');
        footerCheckHeightCont.forEach((el) => {
            const footerCheckHeight = el.querySelectorAll('.footer-check-height');
            footerCheckHeight.forEach((element) => {
                const elementHeight = element.offsetHeight;
                if (elementHeight > 130) {
                    element.classList.add('overflow-hidden-bottom');
                    let dataId = element.getAttribute('data-id');
                    let btn = el.querySelector(`[data-id="${dataId}-footer-menu"]`);
                    if (btn) {
                        removeClass(btn, "invise");
                        btn.addEventListener('click', () => {
                            toggleClass(element, "opened");
                            toggleClass(btn, "opened");
                        })
                    }

                }
            });
        });
    }

    if (document.querySelector('[data-href]')) {
        const data_href = document.querySelectorAll('[data-href]');
        data_href.forEach(element => {
            element.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-popup-open')) {
                    return;
                }
                if (e.target.tagName == 'A') {
                    return;
                }
                if (e.target.closest(".drop_1")) {
                    return;
                }
                window.location = element.getAttribute('data-href');
            })
        });
    }

    if (document.querySelector('.checkbox')) {
        const checkboxs = document.querySelectorAll('.checkbox');

        checkboxs.forEach(el => {
            let checkBoxBtn = el.querySelector('.check-box-btn');

            checkBoxBtn.addEventListener('click', () => {
                if (checkBoxBtn.getAttribute('data-toggle') == 'y') {
                    toggleClass(el, 'checked');
                } else {
                    addClass(el, 'checked');
                    removeClass(el, 'err');
                }
            })
        });
    }

    if (document.querySelector('form')) {
        var overlay = document.querySelector('.overlay');
        var popupCheck = document.querySelector('.popupCheck')
        var popupCheckCloseBtn = popupCheck.querySelector('.close-btn');

        popupCheckCloseBtn.addEventListener('click', () => {
            removeClass(overlay, 'open');
            removeClass(popupCheck, 'open');
        })
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.open').forEach(el => {
                removeClass(el, 'open');
            })
        })

        if (document.querySelector('.btn_pop')) {
            const btnPopAdd = document.querySelectorAll('.btn_pop')

            btnPopAdd.forEach(element => {
                element.addEventListener('click', () => {
                    addClass(overlay, 'open');
                })
            });
        }

    }

    if (document.querySelector('.input_cont')) {
        const input_conts = document.querySelectorAll('.input_cont');

        input_conts.forEach(cont => {
            let inp = cont.querySelector("input");
            let textarea = cont.querySelector("textarea");
            let select = cont.querySelector("select");

            if (select) {
                select.addEventListener('change', function () {
                    addClass(cont, "focus");
                });
            }

            if (inp) {
                inp.addEventListener('focus', () => {
                    addClass(cont, "focus");
                })
                inp.addEventListener('blur', () => {
                    if (inp.name == 'phone') {
                        if (!inp.value.length || inp.value.length < 4) {
                            removeClass(cont, "focus");
                        }
                    } else {
                        if (!inp.value.length) {
                            removeClass(cont, "focus");
                        }
                    }
                })
            }
            if (textarea) {
                textarea.addEventListener('focus', () => {
                    addClass(cont, "focus");
                })
                textarea.addEventListener('blur', () => {
                    if (!textarea.value.length) {
                        removeClass(cont, "focus");
                    }
                })
            }
        });
    }

    if (document.querySelector('[data-popup-open]')) {
        let popupOpenBtns = document.querySelectorAll('[data-popup-open]');

        popupOpenBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {

                if (e.target.tagName == 'A' && !e.target.getAttribute('data-popup-open')) {
                    return;
                }

                e.preventDefault();

                let btnDataId = btn.getAttribute('data-popup-open');

                let dataPopupServiceName = btn.getAttribute('data-popup-service-name');

                let dataPopupStockName = btn.getAttribute('data-popup-stock-name');

                let dataPopupServiceLink = btn.getAttribute('data-popup-service-link');

                let dataPopupSertificateName = btn.getAttribute('data-popup-sertificate-name');

                let dataPopupSpecialistName = btn.getAttribute('data-popup-specialist-name');

                let dataPopupSpecialistLink = btn.getAttribute('data-popup-specialist-link');

                let popup = document.getElementById(`${btnDataId}`);
                if (popup) {

                    let popupForm = popup.querySelector("form");

                    if (popupForm) {

                        let serviceLinkInput = popupForm.querySelector('input[name="service-link"]');
                        if (serviceLinkInput) {
                            popupForm.removeChild(serviceLinkInput);
                        }

                        let specialistNameInput = popupForm.querySelector('input[name="specialist-name"]');
                        if (specialistNameInput) {
                            popupForm.removeChild(specialistNameInput);
                        }

                        let serviceNameInput = popupForm.querySelector('input[name="service-name"]');
                        if (serviceNameInput) {
                            popupForm.removeChild(serviceNameInput);
                        }

                        let specialistLinkInput = popupForm.querySelector('input[name="specialist-link"]');
                        if (specialistLinkInput) {
                            popupForm.removeChild(specialistLinkInput);
                        }

                        let stockNameInput = popupForm.querySelector('input[name="stock-name"]');
                        if (stockNameInput) {
                            popupForm.removeChild(stockNameInput);
                        }
                        let sertificateNameInput = popupForm.querySelector('input[name="sertificate-name"]');
                        if (sertificateNameInput) {
                            popupForm.removeChild(sertificateNameInput);
                        }

                        if (dataPopupStockName) {
                            let stockNameInput = document.createElement("input");
                            stockNameInput.type = "hidden";
                            stockNameInput.name = "stock-name";
                            stockNameInput.value = dataPopupStockName;
                            popupForm.appendChild(stockNameInput);

                        }

                        if (dataPopupSpecialistLink) {
                            let specialistLinkInput = document.createElement("input");
                            specialistLinkInput.type = "hidden";
                            specialistLinkInput.name = "specialist-link";
                            specialistLinkInput.value = dataPopupSpecialistLink;
                            popupForm.appendChild(specialistLinkInput);
                        }

                        if (dataPopupSpecialistName) {
                            let specialistNameInput = document.createElement("input");
                            specialistNameInput.type = "hidden";
                            specialistNameInput.name = "specialist-name";
                            specialistNameInput.value = dataPopupSpecialistName;
                            popupForm.appendChild(specialistNameInput);
                        }

                        if (dataPopupServiceName) {
                            let serviceNameInput = document.createElement("input");
                            serviceNameInput.type = "hidden";
                            serviceNameInput.name = "service-name";
                            serviceNameInput.value = dataPopupServiceName;
                            popupForm.appendChild(serviceNameInput);

                        }

                        if (dataPopupSertificateName) {
                            let sertificateNameInput = document.createElement("input");
                            sertificateNameInput.type = "hidden";
                            sertificateNameInput.name = "sertificate-name";
                            sertificateNameInput.value = dataPopupSertificateName;
                            popupForm.appendChild(sertificateNameInput);
                        }

                        if (dataPopupServiceLink) {
                            let serviceLinkInput = document.createElement("input");
                            serviceLinkInput.type = "hidden";
                            serviceLinkInput.name = "service-link";
                            serviceLinkInput.value = dataPopupServiceLink;
                            popupForm.appendChild(serviceLinkInput);
                        }

                    }

                    addClass(overlay, 'open');
                    addClass(popup, 'open');
                } else {
                    console.error(`Попап с ID: ${btnDataId} не найден`);
                }
            })
        });
    }

    if (document.querySelector('.form-all')) {
        const formSect = document.querySelectorAll(".form-all");
        const titlePopupCheck = popupCheck.querySelector('.h2');

        let widgetId;

        function handleCaptcha(btn, input) {

            // if (!window.smartCaptcha) {
            //     console.error("SmartCaptcha не загружен.");
            //     return;
            // }

            // widgetId = window.smartCaptcha.render(`captcha-container`, {
            //     sitekey: 'ysc1_Y9uiAkGdpunKlCiElSagu658pl0QGAKlFwn3Qlsze326e63b', // Замените на ваш Client Key
            //     invisible: true, // Указываем, что капча невидимая
            //     callback: (token) => {
            //         input.value = token;
            //         btn.click();
            //     },
            // });
        }

        formSect.forEach(formSect => {

            let form = formSect.querySelector("form");
            let formBtn = formSect.querySelector("[type='submit']");
            let nameInp = formSect.querySelector("[name='name']");
            let phoneInp = formSect.querySelector("[name='phone']");
            let textInp = formSect.querySelector("[name='message']");
            let selectInp = formSect.querySelector("[name='service']");

            let checkBoxBtn = formSect.querySelector("[data-processing]");

            if (checkBoxBtn) {
                removeClass(checkBoxBtn, 'checked');
            }

            if (formSect.classList.contains('popupForm')) {
                let closePopupBtn = formSect.querySelector('.close-btn');

                closePopupBtn.addEventListener('click', () => {
                    removeClass(overlay, 'open');
                    removeClass(formSect, 'open');
                })

                formSect.addEventListener('click', (e) => {
                    if (e.target.classList.contains('popupForm')) {
                        overlay.click();
                    }
                })
            }

            function allCheck() {
                if (checkInputsValid(nameInp, 1) && checkInputsValid(phoneInp, 17) && checkCheckBox(checkBoxBtn)) {
                    return true;
                } else {
                    return false;
                }
            }

            function checkCheckBox(checkbox) {
                if (checkbox) {
                    if (checkbox.classList.contains('checked')) {
                        removeClass(checkbox, 'err');
                        formBtn.disabled = false;
                        return true;
                    } else {
                        addClass(checkbox, 'err');
                        formBtn.disabled = true;
                        return false;
                    }
                } else {
                    return true;
                }
            }

            window.addEventListener("DOMContentLoaded", function () {
                [].forEach.call(document.querySelectorAll("[name='phone']"), function (input) {
                    var keyCode;
                    function mask(event) {
                        event.keyCode && (keyCode = event.keyCode);
                        var pos = this.selectionStart;
                        if (pos < 3) event.preventDefault();
                        var matrix = "+7 (___) ___ ____",
                            i = 0,
                            def = matrix.replace(/\D/g, ""),
                            val = this.value.replace(/\D/g, ""),
                            new_value = matrix.replace(/[_\d]/g, function (a) {
                                return i < val.length ? val.charAt(i++) : a
                            });
                        i = new_value.indexOf("_");
                        if (i != -1) {
                            i < 5 && (i = 3);
                            new_value = new_value.slice(0, i)
                        }
                        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                            function (a) {
                                return "\\d{1," + a.length + "}"
                            }).replace(/[+()]/g, "\\$&");
                        reg = new RegExp("^" + reg + "$");
                        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                            this.value = new_value;
                        }
                        if (event.type == "blur" && this.value.length < 5) {
                            this.value = "";
                        }
                    }

                    input.addEventListener("input", mask, false);
                    input.addEventListener("focus", mask, false);
                    input.addEventListener("blur", mask, false);
                    input.addEventListener("keydown", mask, false);

                });
            });

            $(function () {
                $(nameInp).keyup(function () {
                    sergey = $(this).val().toLowerCase(), spout = 'http://,https,url,.ru,.com,.net,.tk,php,.ucoz,www,.ua,.tv,.info,.org,.su,.ру,.су,.ком,.инфо,//'.split(',');
                    for (litvinov = 0; litvinov < spout.length; litvinov++) {
                        if (sergey.search(spout[litvinov]) != -1) {
                            $(this).val(sergey.replace(spout[litvinov], '[Запрещено]'));
                            return true;
                        }
                    }
                });
            });

            function checkInputsValid(input, num) {
                if (input.value.length < num) {
                    input.parentNode.classList.add("err");
                    formBtn.disabled = true;
                    return false;
                } else {
                    input.parentNode.classList.remove("err");

                    return true;
                }
            }

            let check;

            function addLisInput(input, num) {
                checkInputsValid(input, num);
                input.addEventListener('input', check = () => {
                    checkInputsValid(input, num);
                    if (allCheck()) {
                        formBtn.disabled = false;
                    } else {
                        formBtn.disabled = true;
                    }
                })
            }

            function removeLisInput(input) {
                input.removeEventListener('input', check)
            }

            let check_4;

            function addLisCheckBox(checkbox) {
                checkCheckBox(checkbox);
                checkbox.addEventListener('click', check_4 = () => {
                    checkCheckBox(checkbox);
                    if (allCheck()) {
                        formBtn.disabled = false;
                    } else {
                        formBtn.disabled = true;
                    }
                })
            }

            function removeLisCheckBox(checkbox) {
                checkbox.removeEventListener('click', check_4);
            }

            function clearInputs(input) {
                removeLisInput(input);

                if (checkBoxBtn) {
                    removeClass(checkBoxBtn, 'err');
                    removeClass(checkBoxBtn, 'checked');
                }

                input.value = '';
            }

            function handleTextGood() {
                // window.smartCaptcha.destroy(widgetId);
                addLoad();
                setTimeout(() => {
                    removeLoad();
                    titlePopupCheck.textContent = 'Спасибо за заявку! Скоро мы вам перезвоним!';
                    removeClass(formSect, 'open');
                    addClass(overlay, 'open')
                    addClass(popupCheck, 'open')
                    formSect.querySelectorAll('.focus').forEach(el => {
                        removeClass(el, 'focus');
                    });
                    if (textInp) {
                        textInp.value = "";
                    }
                    if (selectInp) {
                        selectInp.value = 'all';
                    }
                    if (nameInp) {
                        clearInputs(nameInp);
                    }
                    clearInputs(phoneInp);

                    clearInputs(captchaInp);
                    setTimeout(() => {
                        document.querySelectorAll('.open').forEach(el => {
                            removeClass(el, 'open');
                        })
                    }, 3500);
                }, 1000);

            }

            function handleTextNoGood() {
                removeLoad();
                titlePopupCheck.textContent = 'Повторите попытку позже';
                removeClass(formSect, 'open');
                addClass(popupCheck, 'open');
                setTimeout(() => {
                    if (overlay.classList.contains('open')) {
                        addClass(formSect, 'open');
                    }
                }, 3500);
            }

            function handleTextError() {
                removeLoad();
                titlePopupCheck.textContent = 'Что-то пошло не так';
                removeClass(formSect, 'open');
                addClass(popupCheck, 'open');
                setTimeout(() => {
                    if (overlay.classList.contains('open')) {
                        addClass(formSect, 'open');
                    }
                }, 3500);
            }

            // Создаем скрытое поле для токена капчи
            let captchaTokenInput = document.createElement('input');
            captchaTokenInput.type = 'hidden';
            captchaTokenInput.name = `captcha_token`;

            // Добавляем скрытое поле в начало текущей формы
            form.prepend(captchaTokenInput);

            let captchaInp = form.querySelector(`[name="captcha_token"]`);

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                removeLisInput(phoneInp);

                if (nameInp) {
                    removeLisInput(nameInp);
                    addLisInput(nameInp, 1);
                }
                addLisInput(phoneInp, 17);

                if (checkBoxBtn) {
                    removeLisCheckBox(checkBoxBtn);
                    addLisCheckBox(checkBoxBtn);
                }

                if (allCheck()) {
                    // if (!captchaInp.value) {
                    //     handleCaptcha(formBtn, captchaInp);
                    //     window.smartCaptcha.execute(widgetId);
                    //     return;
                    // } else {
                    //     addLoad();

                    //     let formData = new FormData(form);
                    //     formData.append('captcha_token', captchaInp.value);
                    //     fetch('/local/templates/main/tools/send.php', {
                    //         method: 'POST',
                    //         body: formData,
                    //     })
                    //         .then((res) => res.json())
                    //         .then(result => {
                    //             if (result.success) {
                    //                 handleTextGood();
                    //             } else {
                    //                 handleTextNoGood();
                    //             }
                    //         })
                    //         .catch((err) => {
                    //             handleTextError();
                    //             console.log(err);
                    //         });
                    // }
                    handleTextGood();
                }

            })
        });
    }

    // Обработка загрузки файлов
    if (document.querySelector('[data-file]')) {
        const fileContainers = document.querySelectorAll('[data-file]');
        
        fileContainers.forEach(container => {
            const fileInput = container.querySelector('input[type="file"]');
            const textElement = container.querySelector('p');
            const maxSizeMB = 20; // Максимальный размер файла в МБ
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
                'application/rtf'
            ];
            const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.rtf'];
            
            if (!fileInput || !textElement) return;
            
            // Функция валидации файла
            function validateFile(file) {
                // Проверка размера
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB > maxSizeMB) {
                    alert(`Файл слишком большой. Максимальный размер: ${maxSizeMB} МБ`);
                    return false;
                }
                
                // Проверка типа файла
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
                
                if (!isValidType) {
                    alert('Разрешены только документы: PDF, DOC, DOCX, XLS, XLSX, TXT, RTF');
                    return false;
                }
                
                return true;
            }
            
            // Функция обновления отображения файла
            function updateFileDisplay(file) {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                textElement.innerHTML = `${file.name} (${fileSizeMB} МБ)`;
            }
            
            // Обработчик клика на контейнер
            container.addEventListener('click', (e) => {
                // Предотвращаем клик, если кликнули на текст (чтобы не открывался дважды)
                if (e.target.tagName === 'SPAN' || e.target.closest('span')) {
                    fileInput.click();
                } else if (e.target === container || e.target.closest('.file_cont-name')) {
                    fileInput.click();
                }
            });
            
            // Обработчик выбора файла через input
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (validateFile(file)) {
                        updateFileDisplay(file);
                    } else {
                        // Сбрасываем input при ошибке
                        fileInput.value = '';
                    }
                }
            });
            
            // Обработчики для drag & drop
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.add('dragover');
            });
            
            container.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove('dragover');
            });
            
            container.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const file = files[0];
                    if (validateFile(file)) {
                        // Устанавливаем файл в input
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInput.files = dataTransfer.files;
                        updateFileDisplay(file);
                    } else {
                        // Сбрасываем input при ошибке
                        fileInput.value = '';
                    }
                }
            });
        });
    }

    if (document.getElementById('isAdmin')) {
        console.log('index.js finish work');
    }
});