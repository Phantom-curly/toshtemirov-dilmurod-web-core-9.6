# Урок 8.5. Задание: как начать

Чтобы начать, клонируйте репозиторий: `git clone https://github.com/Habsida-Projects/webpack-static-template-ru.git`. Установка и команды описаны в [README](README.md).

В репозитории уже настроены:

- webpack
- Sass (SCSS)
- autoprefixer
- Babel

[Что такое webpack?](https://www.freecodecamp.org/news/an-intro-to-webpack-what-it-is-and-how-to-use-it-8304ecdc3c60/) (на английском)

[Документация webpack](https://webpack.js.org/) (на английском)

### Что такое Autoprefixer?

Autoprefixer автоматически добавляет к CSS-свойствам вендорные префиксы.

[Посмотреть, как он работает](https://autoprefixer.github.io/).

## С чего начать разработку?

Раньше вы писали HTML в файле `index.html`, а CSS в файле `style.css` и подключали стили к странице тегом link.

Сейчас всё работает так же, только стили и скрипты к странице подключает webpack. Вы указываете точку входа, webpack проходит по всем импортам от неё, собирает их в один файл и подключает его к странице.

- Точка входа для **JS**: `src/js/index.js`.
- Точка входа для **стилей**: `src/scss/style.scss`.
- HTML лежит в `src/index.html`.

## Как разбить SCSS на файлы?

Разбивайте по БЭМ-блокам: один файл на блок, в папке `src/scss/blocks/`. Имя файла начинается с `_` (такой файл называется _partial_): `_menu.scss`, `_header.scss`.

Подключите каждый блок в точке входа `src/scss/style.scss` через `@use`:

```scss
// src/scss/style.scss
@use 'fonts';
@use 'blocks/page';
@use 'blocks/menu';
```

Путь пишется без `_` и без `.scss`.

### Переменные подключаются через `@use` в каждом файле

Общие переменные лежат в `src/scss/_variables.scss`. Переменная, подключённая в `style.scss`, **не видна** в файлах блоков: `@use` действует только в том файле, где он написан. Поэтому каждый блок, которому нужны переменные, подключает их сам:

```scss
// src/scss/blocks/_menu.scss
@use '../variables' as vars;

.menu {
  background: vars.$background;

  &__item {
    &--active {
      color: vars.$accent;
    }
  }
}
```

Если забыть строку с `@use`, сборка упадёт с ошибкой `Undefined variable`.

> В старых руководствах встречается `@import`. В Sass он устарел и будет удалён, поэтому используйте `@use`.

### Пути в `url()`

Пути в `url()` считаются от **`src/scss/style.scss`**, даже в файле блока. Например, фоновая картинка из `src/img/hero.jpg` всегда пишется так:

```scss
// src/scss/blocks/_hero.scss
.hero {
  background-image: url('../img/hero.jpg');
}
```

Картинки и шрифты, которые используются в стилях, webpack сам копирует в сборку.

## Как разбить JS на файлы?

Чтобы добавить файл в сборку, импортируйте его в `src/js/index.js`:

```js
import { myVariable } from './path/to/filename'
```

В другом файле (который вы импортируете) экспортируйте функции, переменные и так далее:

```js
export const myVariable = 'Block 7'
```

[Модули, экспорт и импорт](https://learn.javascript.ru/import-export)

P.S. Если в файле, который уже импортирован в `src/js/index.js`, написать ещё один `import`, webpack тоже включит его в сборку.

## Библиотеки со своим CSS (на примере Swiper)

В JS можно импортировать и файлы `.scss`, и обычные `.css`. Многие библиотеки поставляют обычный CSS, который подключается именно так.

1. Установите библиотеку:

   ```bash
   npm install swiper
   ```

2. Добавьте разметку. Классы `swiper`, `swiper-wrapper` и `swiper-slide` обязательны, а рядом с ними можно ставить свои БЭМ-классы:

   ```html
   <div class="brands__swiper swiper">
     <div class="swiper-wrapper">
       <div class="brands__item swiper-slide">Lenovo</div>
       <div class="brands__item swiper-slide">Samsung</div>
       <div class="brands__item swiper-slide">Apple</div>
     </div>
     <div class="swiper-pagination"></div>
   </div>
   ```

3. Импортируйте в `src/js/index.js` Swiper, его стили и нужные модули. В ядро не входят дополнительные модули, например пагинация: модуль **и** его CSS импортируются отдельно.

   ```js
   import Swiper from 'swiper'
   import { Pagination } from 'swiper/modules'
   import 'swiper/css'
   import 'swiper/css/pagination'

   // Только на мобильных: решается один раз, при загрузке страницы
   if (window.matchMedia('(max-width: 767px)').matches) {
     new Swiper('.brands__swiper', {
       modules: [Pagination],
       slidesPerView: 'auto',
       spaceBetween: 16,
       pagination: {
         el: '.swiper-pagination',
         clickable: true
       }
     })
   }
   ```

4. Задайте стили для обоих состояний. Когда Swiper запускается, он добавляет класс `swiper-initialized`. Если страницу открыли на широком экране, Swiper не запускается: слайды остаются в стандартном flex-ряду Swiper и выходят за край. Расставьте их сами на **`.swiper-wrapper`** (слайды лежат в нём, а не прямо в `.brands__swiper`):

   ```scss
   // src/scss/blocks/_brands.scss
   .brands__item {
     width: 240px; // ширина слайда, пока работает Swiper
   }

   // Swiper не запущен (страницу открыли на широком экране)
   .brands__swiper:not(.swiper-initialized) {
     .swiper-wrapper {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
       gap: 16px;
     }

     .brands__item {
       width: auto;
     }

     .swiper-pagination {
       display: none;
     }
   }
   ```

   Используйте `:not(.swiper-initialized)`, а не медиазапрос `@media`. Swiper решает, запускаться или нет, один раз при загрузке страницы, поэтому раскладка должна следовать этому решению, а не текущей ширине окна. С медиазапросом слайдер, загруженный на мобильном, превратится в сломанную сетку, если расширить окно.

## Куда класть картинки?

Кладите картинки в папку `src/img` и указывайте их в HTML как `./img/...`:

```html
<img src="./img/logo.svg" alt="Логотип" />
```

Всегда начинайте путь с `./`, а не с `/`. Пути, которые начинаются с `/`, ломаются на GitHub Pages.

## Как посмотреть результат?

Во время разработки запускайте `npm start`: сайт откроется по адресу http://localhost:9000 и будет обновляться при каждом сохранении.

`npm run build` складывает готовый сайт в папку `dist`:

- `dist/index.html`
- `dist/js/bundle.js`: весь ваш JS
- `dist/style.css`: все ваши стили
- `dist/img`, `dist/fonts`, `dist/static`: картинки и шрифты

## Вопросы

### Почему точка входа именно `src/js/index.js`?

Потому что она указана в опции `entry` в [webpack.config.js](webpack.config.js).

Поменяйте точку входа и переименуйте файлы, чтобы посмотреть, что получится.

### Почему точка входа для SCSS именно `src/scss/style.scss`?

Потому что этот файл импортируется в точке входа JS, [src/js/index.js](src/js/index.js).

### Как webpack понимает, что делать с импортами `*.scss` и `*.css`?

Через раздел `module.rules` в [webpack.config.js](webpack.config.js). Каждое правило говорит, к каким файлам оно применяется (`test`) и какие загрузчики (loaders) их обрабатывают. Для SCSS, обычного CSS, шрифтов и картинок есть отдельные правила.

### Нужно ли настраивать Autoprefixer?

Нет. Он уже настроен в разделе `postcss` файла [package.json](package.json), а поддерживаемые браузеры перечислены там же, в `browserslist`.
