import '../scss/style.scss'
import Swiper from 'swiper'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import '../scss/style.scss'

const swiper = new Swiper(".swiper", {
    direction: "horizontal",
    loop: false,
    slidesPerView: "auto",
    spaceBetween: 16,
    slidesOffsetBefore: 16,
    slidesOffsetAfter: 16,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    breakpoints: {
        768: {
            enabled: false,
            spaceBetween: 0,
        },
    },
});

const menuButton = document.querySelector(".menu__button");
const closeButton = document.querySelector(".close__button");
const sidebar = document.querySelector(".sidebar");
const backdrop = document.querySelector(".sidebar-backdrop");

menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
    backdrop.classList.toggle("is-active");
});

closeButton.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
    backdrop.classList.toggle("is-active");
});

const readMoreButton = document.querySelector(".main__readmore");
const textSecond = document.querySelector(".main__text--second");
const buttonText = readMoreButton.querySelector("span");

readMoreButton.addEventListener("click", () => {
    const isVisible = textSecond.classList.toggle("is-visible");
    readMoreButton.classList.toggle("more__button__rotated");

    buttonText.textContent = isVisible ? "Скрыть" : "Читать далее";
});

const more_button1 = document.querySelector(".swiper1__readmore");
const more_button2 = document.querySelector(".swiper2__readmore");
const item_list1 = document.querySelector(".swiper1");
const item_list2 = document.querySelector(".swiper2");
const button_text1 = more_button1.querySelector("span");
const button_text2 = more_button2.querySelector("span");

more_button1.addEventListener("click", () => {
    item_list1.classList.toggle("swiper__expanded");
    more_button1.classList.toggle("more__button__rotated");

    if (button_text1.textContent === "Показать все") {
        button_text1.textContent = "Скрыть";
    } else {
        button_text1.textContent = "Показать все";
    }
});

more_button2.addEventListener("click", () => {
    item_list2.classList.toggle("swiper__expanded");
    more_button2.classList.toggle("more__button__rotated");

    if (button_text2.textContent === "Показать все") {
        button_text2.textContent = "Скрыть";
    } else {
        button_text2.textContent = "Показать все";
    }
});
