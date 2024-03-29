window.addEventListener('DOMContentLoaded', () => {
    
    //Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');
    
    const hideTabContent = () => {
        tabsContent.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    };

    const showTabContent = (i = 0) => {
        tabsContent[i].style.display = 'block';
        tabsContent[i].classList.add('fade');
        tabs[i].classList.add('tabheader__item_active');
    };


    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    //Timer
    const deadline = '2022-09-16';
    //const deadline = new Date(2022, 05, 04, 14, 35);

    function getTimeRemaining(endTime) {
        const t = new Date(endTime) - new Date();

        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((t / (1000 * 60)) % 60);
        const seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    const addZero = (num) => {
        if (String(num).length == 1) return '0' + String(num);
        else return num;
    };

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        updateClock();
        function updateClock() {
            
            const t = getTimeRemaining(endtime);
            
            if (t.total <= 0) {
                clearInterval(timeInterval);
                days.textContent = '00';
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
                return;
            }
            

            days.textContent = addZero(t.days);
            hours.textContent = addZero(t.hours);
            minutes.textContent = addZero(t.minutes);
            seconds.textContent = addZero(t.seconds);

            
        }
    }

    setClock('.timer', deadline);

    //Modal
    const modalOpenBtns = document.querySelectorAll('[data-modal-open]');
    const modal = document.querySelector('.modal');
    
    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
    }

    const closeModal = () => { 
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    modalOpenBtns.forEach(item => {
        item.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.getAttribute('data-modal-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.code === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    const modalTimer = setTimeout(openModal, 50000);

    const openModalByScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            window.removeEventListener('scroll', openModalByScroll);
            openModal();
        }
    };

    window.addEventListener('scroll', openModalByScroll);

    
    //Card Class

    class MenuCard {
        constructor(imgSrc, alt, subtitle, descr, price, parentSelector, ...classes) {
            this.imgSrc = imgSrc;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        
        render() {
            let element = document.createElement('div');

            if (this.classes.length) {
                this.classes.forEach(item => {
                    element.classList.add(item);
                });
            } else {
                element.classList.add('menu__item');
            }

            element.innerHTML = `
                    <img src="${this.imgSrc}" alt="${this.alt}">
                    <h3 class="menu__item-subtitle">${this.subtitle}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>`;
            this.parent.append(element);
        }
    }

    // const getResource = async (url) => {
    //     const res = await fetch(url);

    //     if (!res.ok) {
    //         throw new Error(`Couldn't fetch ${url}, status 
    //         ${res.status}`);
    //     }

    //     return await res.json();
    // };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });
    
    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));
    
    // function createCard(data) {
    //     data.forEach(({ img, altimg, title, descr, price }) => {
    //         const element = document.createElement('div');
    //         element.classList.add('menu__item');
    //         element.innerHTML = `
    //             <img src="${img}" alt="${altimg}">
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;

    //         document.querySelector('.menu .container').append(element);
    //     });
    // }


    // Forms

    const forms = document.querySelectorAll('form');
        
        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Спасибо. Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...',
        };

        forms.forEach(item => {
            bindPostData(item);
        });
    
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data,
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            }); 
        });
    }
        
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.style.display = 'none';
        openModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class = "modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.style.display = 'block';
            closeModal();
        }, 3000);
    }


    // Slider

    let slideIndex = 1;
    let offset = 0;

    const slides = document.querySelectorAll('.offer__slide'),
        sliderImgNumCurrent = document.querySelector('#current'),
        sliderImgNumTotal = document.querySelector('#total'),
        sliderPrev = document.querySelector('.offer__slider-prev'),
        sliderNext = document.querySelector('.offer__slider-next'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width,
        slider = document.querySelector('.offer__slider');
    
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });
    
    const setSliderNum = (item, value) => {
        if (value < 10) value = '0' + value;
        item.textContent = value;
    };

    const toNum = (str) => {
        return +str.replace(/\D/g, '');
    };
    
    sliderNext.addEventListener('click', () => {
        if (offset == toNum(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += toNum(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;
        
        if (slideIndex === slides.length) slideIndex = 0;
        slideIndex++;
        setSliderNum(sliderImgNumCurrent, slideIndex);
        activeDot(slideIndex - 1);
    });
    
    sliderPrev.addEventListener('click', () => {
        if (offset == 0) {
            offset = toNum(width) * (slides.length - 1);
        } else {
            offset -= toNum(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex === 1) slideIndex = slides.length + 1;
        slideIndex--;
        setSliderNum(sliderImgNumCurrent, slideIndex);
        activeDot(slideIndex - 1);
    });
    
    setSliderNum(sliderImgNumTotal, slides.length);
    setSliderNum(sliderImgNumCurrent, slideIndex);

    slider.style.position = 'relative';

    const sliderNav = document.createElement('ol');
    slider.append(sliderNav);
    sliderNav.classList.add('offer__slider-nav');

    sliderNav.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;`;

    function createDot(id) {
        let dot = document.createElement('li');
        dot.classList.add('offer__slider-dot');
        sliderNav.append(dot);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;`;
        dot.setAttribute('data-id', id);
    }

    slides.forEach((item, i) => {
        createDot(i);
    });

    function activeDot(id) {
        document.querySelectorAll('.offer__slider-dot').forEach((item) => {
                if (+item.getAttribute('data-id') === +id) {
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '.5';
                }
            });
    }

    const openSlide = (id) => {
        offset = toNum(width) * id;
        slidesField.style.transform = `translateX(-${offset}px)`;
        slideIndex = +id + 1;
        setSliderNum(sliderImgNumCurrent, slideIndex);
    };

    slider.addEventListener('click', (e) => {
        if (e.target.className == 'offer__slider-dot') {
            openSlide(e.target.getAttribute('data-id'));
            activeDot(e.target.getAttribute('data-id'));
        }
    });

    activeDot(0);

    /////////////////////////////////////////////////
    
    // const setSliderImg = (slideIndex) => {
    //     setSliderNum(sliderImgNumCurrent, slideIndex);

    //     slides.forEach((item, i) => {
    //         if (i === slideIndex - 1) item.style.display = 'block';
    //         else item.style.display = 'none';
    //     });
    // };
    
    // setSliderNum(sliderImgNumTotal, slides.length);
    // setSliderImg(slideIndex);

    // sliderPrev.addEventListener('click', () => {
    //     if (slideIndex === 1) slideIndex = slides.length + 1;
    //     slideIndex--;
    //     setSliderImg(slideIndex);
    // });
    // sliderNext.addEventListener('click', () => {
    //     if (slideIndex === slides.length) slideIndex = 0;
    //     slideIndex++;
    //     setSliderImg(slideIndex);
    // });

    //Calculator

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = '1.375';
        localStorage.setItem('ratio', '1.375');
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector); 

        elements.forEach(elem => {
            elem.classList.remove(activeClass);

            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-ratio') == localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function caclRes() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    caclRes();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', ratio);
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', sex);
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);
                caclRes();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            caclRes();
        });
        
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

});

