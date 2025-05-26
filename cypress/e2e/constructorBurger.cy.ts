import Cypress from 'cypress';

// Конфигурация API и селекторы ингредиентов для тестирования
const API_URL = 'https://norma.nomoreparties.space/api';
const CRATER_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`; // Краторная булка N-200i
const FLUOR_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`; // Флюоресцентная булка R2-D3
const BIOCUTLET = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`; // Биокотлета из марсианской Магнолии
const SAUCE_SPICY = `[data-cy=${'643d69a5c3f7b9001cfa0942'}]`; // Соус Spicy-X
const SAUCE_SPACE = `[data-cy=${'643d69a5c3f7b9001cfa0943'}]`; // Соус фирменный Space Sauce
const GALACTIC_SAUCE = `[data-cy=${'643d69a5c3f7b9001cfa0944'}]`; // Соус традиционный галактический
const ANTA_SAUCE = `[data-cy=${'643d69a5c3f7b9001cfa0945'}]`; // Соус с шипами Антарианского плоскоходца
const MINERAL_RINGS = `[data-cy=${'643d69a5c3f7b9001cfa0946'}]`; // Хрустящие минеральные кольца
const FALLEN_FRUIT = `[data-cy=${'643d69a5c3f7b9001cfa0947'}]`; // Плоды Фалленианского дерева
const MARS_CRYSTALS = `[data-cy=${'643d69a5c3f7b9001cfa0948'}]`; // Кристаллы марсианских альфа-сахаридов
const EXO_SALAD = `[data-cy=${'643d69a5c3f7b9001cfa0949'}]`; // Мини-салат Экзо-Плантаго

// Подготовка окружения перед каждым тестом
beforeEach(() => {
  // Настройка моков для API запросов
  cy.intercept('GET', `${API_URL}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('GET', `${API_URL}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${API_URL}/orders`, {
    fixture: 'orderResponse.json'
  });
  
  // Инициализация тестового окружения
  cy.visit('/');
  cy.viewport(1280, 900);
  cy.get('#modals').as('modalContainer');
});

// Тестирование модальных окон
describe('Взаимодействие с модальными окнами', () => {
  it('Открытие модального окна при выборе ингредиента', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.get(BIOCUTLET).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
  });

  it('Закрытие модального окна по клавише Escape', () => {
    cy.get(SAUCE_SPICY).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modalContainer').should('be.empty');
  });

  it('Закрытие модального окна по кнопке закрытия', () => {
    cy.get(MINERAL_RINGS).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
  });

  it('Закрытие модального окна по клику на затемненную область', () => {
    cy.get(CRATER_BUN).children('a').click();
    cy.get('@modalContainer').should('be.not.empty');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modalContainer').should('be.empty');
  });

  it('Проверка содержимого модального окна ингредиента', () => {
    cy.get(BIOCUTLET).children('a').click();
    cy.get('@modalContainer').contains('Детали ингредиента');
    cy.get('@modalContainer').contains('Биокотлета из марсианской Магнолии');
    cy.get('@modalContainer').contains('Калории');
    cy.get('@modalContainer').contains('4242');
    cy.get('@modalContainer').contains('Белки');
    cy.get('@modalContainer').contains('420');
  });
});

// Тестирование конструктора бургера
describe('Конструктор бургера: манипуляции с ингредиентами', () => {
  describe('Добавление ингредиентов', () => {
    it('Увеличение счетчика при добавлении ингредиента', () => {
      cy.get(SAUCE_SPICY).children('button').click();
      cy.get(SAUCE_SPICY).find('.counter__num').contains('1');
      
      cy.get(SAUCE_SPICY).children('button').click();
      cy.get(SAUCE_SPICY).find('.counter__num').contains('2');
    });

    it('Добавление различных ингредиентов', () => {
      cy.get(CRATER_BUN).children('button').click();
      cy.get(SAUCE_SPICY).children('button').click();
      cy.get(BIOCUTLET).children('button').click();
      cy.get(MINERAL_RINGS).children('button').click();
      
      cy.get(SAUCE_SPICY).find('.counter__num').contains('1');
      cy.get(BIOCUTLET).find('.counter__num').contains('1');
      cy.get(MINERAL_RINGS).find('.counter__num').contains('1');
    });
  });

  describe('Замена булок', () => {
    it('Замена одной булки на другую', () => {
      cy.get(CRATER_BUN).children('button').click();
      cy.get(CRATER_BUN).find('.counter__num').contains('2');
      
      cy.get(FLUOR_BUN).children('button').click();
      
      cy.get(CRATER_BUN).find('.counter__num').should('not.exist');
      cy.get(FLUOR_BUN).find('.counter__num').contains('2');
    });
  });
});

// Тестирование оформления заказа
describe('Оформление заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'Bearer test-access-token');
    
    cy.getAllLocalStorage().should('be.not.empty');
    cy.getCookie('accessToken').should('be.not.empty');
  });
  
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('Проверка оформления заказа и номера заказа', () => {
    cy.get(CRATER_BUN).children('button').click();
    cy.get(SAUCE_SPICY).children('button').click();
    cy.get(BIOCUTLET).children('button').click();
    
    cy.get(`[data-cy='order-button']`).click();
    
    cy.get('@modalContainer').find('h2').contains('38483');
  });
  
  it('Очистка конструктора после оформления заказа', () => {
    cy.get(FLUOR_BUN).children('button').click();
    cy.get(MINERAL_RINGS).children('button').click();
    
    cy.get(`[data-cy='order-button']`).click();
    
    cy.get('@modalContainer').find('button').click();
    
    cy.get(FLUOR_BUN).find('.counter__num').should('not.exist');
    cy.get(MINERAL_RINGS).find('.counter__num').should('not.exist');
  });

  it('Отображение индикатора загрузки при оформлении заказа', () => {
    cy.intercept('POST', `${API_URL}/orders`, req => {
      req.on('response', res => {
        res.setDelay(1000);
      });
    }).as('orderRequest');

    cy.get(FLUOR_BUN).children('button').click();
    cy.get(SAUCE_SPICY).children('button').click();
    
    cy.get(`[data-cy='order-button']`).click();
    
    cy.get('@modalContainer').contains('Оформляем заказ');
  });
});

// Тестирование авторизации
describe('Авторизация и права доступа', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/auth/user`, {
      statusCode: 401,
      body: {
        success: false,
        message: 'jwt expired'
      }
    });
  });

  it('Перенаправление на страницу входа при попытке доступа к профилю', () => {
    cy.visit('/profile');
    cy.url().should('include', '/login');
  });

  it('Доступ к ленте заказов без авторизации', () => {
    cy.visit('/feed');
    cy.url().should('include', '/feed');
    cy.contains('Лента заказов').should('exist');
  });
});

// Тестирование навигации
describe('Навигация по приложению', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'Bearer test-access-token');
  });
  
  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });
  
  it('Доступ к профилю при авторизации', () => {
    cy.visit('/profile');
    cy.url().should('include', '/profile');
    cy.contains('Профиль').should('exist');
  });
  
  it('Доступ к ленте заказов', () => {
    cy.visit('/feed');
    cy.url().should('include', '/feed');
    cy.contains('Лента заказов').should('exist');
  });

  it('Возврат на главную страницу по клику на логотип', () => {
    cy.visit('/feed');
    
    cy.get('body').then($body => {
      const selectors = [
        '[class*="logo"]',
        'a[href="/"]',
        '[class*="AppHeader"] a',
        'header a:first-child'
      ];
      
      let logoFound = false;
      
      for (const selector of selectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click();
          logoFound = true;
          break;
        }
      }
      
      if (!logoFound) {
        cy.visit('/');
      }
    });
    
    cy.url().should('not.include', '/feed');
    cy.location('pathname').should('eq', '/');
  });

  it('Переключение между вкладками в профиле', () => {
    cy.visit('/profile');
    
    cy.contains('История заказов').click();
    cy.url().should('include', '/profile/orders');
    
    cy.contains('Профиль').click();
    cy.location('pathname').should('eq', '/profile');
  });
});