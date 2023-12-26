// import JustValidate from 'just-validate';

window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu'),
        menuItem = document.querySelectorAll('.menu_item'),
        hamburger = document.querySelector('.hamburger'),
        btnsReq = document.querySelectorAll('.btn_request'),
        modal = document.querySelector('.modal'),
        thanksModal = document.querySelector('#thanks')
        close = document.querySelector('.modal__close'),
        form = document.querySelector('#form');
        

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('menu_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('menu_active');
        })
    })
    const timeoutID = setTimeout(openModal, 30000);

    btnsReq.forEach(btn => {
        btn.addEventListener('click', openModal)  
    })

    window.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modal.classList.contains('modal__active')) {
            closeModal();
        }
    })

    close.addEventListener('click', closeModal);

    function openModalByScroll () {
        if(window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
        }
    }

    window.addEventListener('scroll', openModalByScroll)

    function closeModal() {
        modal.classList.remove('modal__active');
    }
    
    function openModal() {
        modal.classList.add('modal__active');
        clearInterval(timeoutID);
    }

    function showThanksModal() {
        thanksModal.classList.add('modal__active');
        setTimeout(() => {
            thanksModal.classList.remove('modal__active');
        } , 4000)
    }
    
    // form validation
    const validate = new JustValidate(form, {
        errorFieldCssClass: 'is-invalid',
         errorLabelStyle: {
           textAlign: 'center',
           marginTop: '10px',
           fontSize: '16px',
           color: 'var(--btn-color)',
         },
         successFieldCssClass: 'is-valid',
         successLabelStyle: {
           fontSize: '16px',
           color: 'var(--btn-color)',
         },
         focusInvalidField: true,
         lockForm: true,
       });

    validate.addField('[name="name"]', [
            {
                rule: 'required',
                errorMessage: 'Пожалуйста, введите ваше имя',
            },
            {
            rule: 'minLength',
            value: 2,
            errorMessage: 'Ваше имя должно содержать минимум 2 буквы'
            },
            {
            rule: 'maxLength',
            value: 30,
            errorMessage: 'Ваше имя должно содержать не более 30 символов'
            },
        ])
        .addField('[name="phone"]', [
            {
            rule: 'required',
            errorMessage: 'Пожалуйста, введите ваш номер телефона',
            }
        ])  
        .addField('[name="email"]', [
            {
            rule: 'required',
            errorMessage: 'Пожалуйста, введите ваш email'
            },
            {
            rule: 'email',
            errorMessage: 'Email должен быть в формате ***@mail.ru'
            }
    ]);

    // inputmask 
    let inputsTel = document.querySelectorAll('input[type="phone"]'),
        inputMask = new Inputmask('+7 (999) 999-99-99');
    inputMask.mask(inputsTel);

    // sending the form data
    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
                                    // селектор формы
            let formData = new FormData(form) // //FormData это объект который позволяет сформировать данные с определенной формы в формате ключ-значение(создает объект), но для этого у импутов обязательно должен быть атрибут name='', иначе FormData не сможет найти эти импуты и взять из них value
            
            fetch('mailer/smart.php', {
                method: 'POST',
                body: formData,
            })
            .then(closeModal())
            .then(showThanksModal())
            .catch(() => {
                form.append("Что-то пошло не так")
            })
            .finally(form.reset())
        })
    }

    postData(form);
})  