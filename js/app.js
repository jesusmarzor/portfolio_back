'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);
// Crea etiqueta HTML
const createContainer = (label, attr, dad, content) => {
    let elem = document.createElement(label);
    for(let a of Object.keys(attr)){
        elem.setAttribute(a,attr[a]);
    }
    if(content != undefined)
        elem.innerHTML = content;

    if(dad != undefined)
        dad.append(elem);
    return elem;
}
// --Barra de navegación--
// Devuelve true si has llegado al final de la página
const isFinal = () => {
    const footer = $('.footer');
    const footer_height = footer.getBoundingClientRect().bottom ;
    if(parseInt(screen.height - footer_height) == 0){
        return true;
    }
    return false;
}
 const activeElementMenu = (selection,menu) => {
    menu.forEach(element => {
        if(element == selection){
            element.classList.add('active');
        }else{
            element.classList.remove('active');
        }
    });
}
const selectMenu = (about,portfolio,contact,menu) => {
    if(about.getBoundingClientRect().top > 1){
        activeElementMenu(menu[0],menu)
    }else if(about.getBoundingClientRect().top <= 1 && portfolio.getBoundingClientRect().top > 1){
        activeElementMenu(menu[1],menu)
    }else if(portfolio.getBoundingClientRect().top <= 1 && contact.getBoundingClientRect().top > 1 && !isFinal()){
        activeElementMenu(menu[2],menu)
    }else{
        activeElementMenu(menu[3],menu)
    }
}
// Burger
const effectBurger = (burger,header,nav,mobile) => {
    if(burger.classList.contains('open') || mobile){
        burger.classList.remove('open');
        header.classList.remove('deploy');
        nav.classList.remove('desopacity');
    }else{
        burger.classList.add('open');
        header.classList.add('deploy');
        nav.classList.add('desopacity');
    }
}
// darkmode or lightmode
const mode = (iconOn,iconOff,body,mode) => {
    iconOff.classList.remove('aparition');
    iconOff.classList.add('desaparition');
    iconOn.classList.add('aparition');
    iconOn.classList.remove('desaparition');
    body.classList.add('dark');
    if(mode){
        localStorage.setItem('darkmode',"true");
        body.classList.add('dark');
    }else{
        localStorage.setItem('darkmode',"false");
        body.classList.remove('dark');
    }
}
// --Proyectos--
// Coger los proyectos del json
const getProjects = async (url,container) => {
    try{
        const res = await fetch(url);
        const projects = await res.json();
        for (let p of projects){
            let fragment = document.createDocumentFragment();
            let project = createContainer('div',{class:'portfolio__project project'},fragment);
            createContainer('img',{class:'project__img', src:p.img, alt: p.title,loading:'lazy',width:352},project);
            createContainer('h2',{class:'project__title'},project,p.title);
            let description = createContainer('div',{class:'project__description'},project);
            createContainer('p',{class:'project_p'},description,p.description);
            let buttons = createContainer('div',{class:'project__button button'},project);
            setColor(createContainer('a',{class:'button__github',href:p.url__github, target:'_blank', rel:'noreferrer'},buttons,'Ver código'),p.color,true);
            if(p.url__demo !=  "" && p.url__demo != undefined){
                setColor(createContainer('a',{class:'button__demo',href:p.url__demo, target:'_blank', rel:'noreferrer'},buttons,'Ver demo'),p.color,false);
            }
            container.append(fragment);
        }
    }catch(error){
        console.log(error.message)
    }
}
// Colores de los proyectos
const setColor = (elem, color, filled) => {
    if(filled){
        elem.style.backgroundColor = color;
        elem.style.borderColor = color;
        elem.addEventListener('mouseenter', () => {
            elem.style.color = color;
            elem.style.backgroundColor = "transparent";
        })
        elem.addEventListener('mouseleave', () => {
            elem.style.backgroundColor = color;
            elem.style.color = null;
        })
    }else{
        elem.style.color = color;
        elem.style.borderColor = color;
        elem.addEventListener('mouseenter', () => {
            elem.style.backgroundColor = color;
            elem.style.color = null;
        })
        elem.addEventListener('mouseleave', () => {
            elem.style.backgroundColor = "transparent";
            elem.style.color = color;
        })
    }
}
// --Contacto--
// Saber si el mensaje llego con exito
const handleSubmit = async(event,f) => {
    event.preventDefault();
    const form= new FormData(f)
    const response = await fetch(f.action,{
        method: f.method,
        body: form,
        headers:{
            'Accept': 'application/json'
        }
    })
    if(response.ok){
        f.reset();
        interval(createContainer('p',{class: 'form__answer', style:'color:#a4d338;'},f,"Mensaje enviado con éxito!!"));
    }else{
        interval(createContainer('p',{class: 'form__answer', style:'color:#e14b41;'},f,"Error al enviar el mensaje!!"));
    }
}
// Elimina elemento(en este caso el mensaje al enviar el formulario) en 5s
const interval = (elem) => {
    setTimeout(()=>{
        elem.remove()
    },5000)
}
// Validar el formulario
const validationForm = (event,form__name,form__email,form__message) => {
    event.preventDefault();
    let error = false;
    const name = $('#name');
    const email = $('#email');
    const message = $('#message');

    if(name.value.length == 0) {
        if(name.style.borderColor != "red"){
            name.style.border = "1px solid red";
            createContainer('p',{class:'form__error'},form__name,'Introduce tu nombre.');
        }
        error = true;
    }else if(name.style.borderColor == "red"){
        name.style.border = "1px solid #ced4da";
        form__name.removeChild(form__name.lastChild);
    }
	if(!(/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/).exec(email.value)){
		if(email.style.borderColor != "red"){
            email.style.border = "1px solid red";
            createContainer('p',{class:'form__error'},form__email,'Introduce un email correcto.');  
        }
        error = true;
    }else if(email.style.borderColor == "red"){
        email.style.border = "1px solid #ced4da";
        form__email.removeChild(form__email.lastChild);
    }
    if(message.value.length == 0) {
        if(message.style.borderColor != "red"){
            message.style.border = "1px solid red";
            createContainer('p',{class:'form__error'},form__message,'Introduce tu mensaje.');
        }
        error = true;
    }else if(message.style.borderColor == "red"){
        message.style.border = "1px solid #ced4da";
        form__message.removeChild(form__message.lastChild);
    }
    if(error){
        return false;
    }
    return true;
}
document.addEventListener('DOMContentLoaded', () => {
    // Secciones
    const header = $('.header')
    const about = $('.about');
    const portfolio = $('.portfolio');
    const contact = $('.contact');
    const menu = $$('.nav__a');
    const [home_a,about_a,portfolio_a,contact_a] = menu;
    // Bara de navegacion
    selectMenu(about,portfolio,contact,menu);
    window.addEventListener('scroll', () => {
        effectBurger(burger,header,nav,true);
        selectMenu(about,portfolio,contact,menu);
    })
    home_a.addEventListener('click', (e) => {
        e.preventDefault();
        window.scroll({
            top: 0,
            behavior: "smooth"
        })
    })
    about_a.addEventListener('click', (e) => {
        e.preventDefault();
        window.scroll({
            top: about.getBoundingClientRect().top + (window.scrollY || window.pageYOffset),
            behavior: "smooth"
        })
    })
    portfolio_a.addEventListener('click', (e) => {
        e.preventDefault();
        window.scroll({
            top: portfolio.getBoundingClientRect().top + (window.scrollY || window.pageYOffset),
            behavior: "smooth"
        })
    })
    contact_a.addEventListener('click', (e) => {
        e.preventDefault();
        window.scroll({
            top: contact.getBoundingClientRect().top + (window.scrollY || window.pageYOffset),
            behavior: "smooth"
        })
    })
    $('#writeme').addEventListener('click',(e) => {
        e.preventDefault();
        window.scroll({
            top: contact.getBoundingClientRect().top + (window.scrollY || window.pageYOffset),
            behavior: "smooth"
        })
    });
    // Burger
    const nav = $('.nav');
    const burger = $('.menu');
    burger.addEventListener('click', () => {
        effectBurger(burger,header,nav,false);
    })
    about.addEventListener('click', () => {
        effectBurger(burger,header,nav,true);
    })
    nav.addEventListener('click', () => {
        effectBurger(burger,header,nav,true);
    })
    // darkmode or lightmode
    const body = $('body');
    const dark = $('.mode__dark');
    const light = $('.mode__light');
    if(localStorage.getItem('darkmode') == "true"){
        mode(light,dark,body,true)
    }
    dark.addEventListener('click', () => {
        mode(light,dark,body,true)
        
    })
    light.addEventListener('click', () => {
        mode(dark,light,body,false)
    })
    // Proyectos
    const projects = $('.portfolio__projects');
    getProjects('../projects.json',projects);
    // Contacto
    const form__name = $('.form__name');
    const form__email = $('.form__email');
    const form__message = $('.form__message');
    $('#form__submit').addEventListener('click',(event)=>{
        if(validationForm(event,form__name,form__email,form__message)){
            handleSubmit(event,form);
        }
    });
});