import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
//const { data, ...indexes } = initData(sourceData);// ШАГ 1(7)
const api = initData(sourceData); // ШАГ 1(7)

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    // расширьте существующий return вот так
    ...state,
    rowsPerPage,
    page,
  };
}
//-------------------------------------------------------------------//

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
//ШАГ 1(7)
/*function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let result = [...data]; // копируем для последующего изменения
  // @todo: использование
  //result = applySearching(result, state, action); //ШАГ 0 (7)
  //result = applyPagination(result, state, action);//ШАГ 0 (7)
  //result = applySorting(result, state, action);//ШАГ 0 (7)
  //result = applyFiltering(result, state, action); //ШАГ 0 (7) //ИСПОЛЬЗУЕТ ФИЛЬТР ШАГ 4

  sampleTable.render(result);
}*/
//ШАГ 1(7)
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // копируем для последующего изменения
  // @todo: использование
  //
  //
  //
  //
  query = applyPagination(query, state, action); //ШАГ 2(7)
  query = applyFiltering(query, state, action); // result заменяем на query //ШАГ 3(7)
  query = applySearching(query, state, action); // result заменяем на query //ШАГ 4(7)
  query = applySorting(query, state, action); // result заменяем на query //ШАГ 5(7)
  const { total, items } = await api.getRecords(query);
  updatePagination(total, query); //ШАГ 2(7)
  sampleTable.render(items);
} //ШАГ 1(7)

//-------------------------------------------------------------------//

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация
const applySearching = initSearching("search");
//const applyPagination = initPagination(
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);
const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);
//ШАГ 0 (7)
//const applyFiltering = initFiltering(sampleTable.filter.elements, {
//  // передаём элементы фильтра
//  searchBySeller: indexes.sellers, // для элемента с именем searchBySeller устанавливаем массив продавцов
//}); //ШАГ 0 (7)//ИНИЦИАЛИЗИРУЕМ ФИЛЬТР ШАГ 4
//ШАГ 0 (7)
// ШАГ 3(7)
const { applyFiltering, updateIndexes } = initFiltering(
  // ШАГ 3(7)
  sampleTable.filter.elements
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

//ШАГ 1(7)
async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  }); // ШАГ 3(7)
} //ШАГ 1(7)
init().then(render); //ШАГ 1(7)
//render();
