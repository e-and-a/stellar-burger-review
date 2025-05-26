import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';

describe('тестирование редьюсера ingredientSlice', () => {
  describe('тестирование асинхронного GET экшена getIngredients', () => {
    const actions = {
      pending: {
        type: getIngredients.pending.type,
        payload: null
      },
      rejected: {
        type: getIngredients.rejected.type,
        error: { message: 'Ошибка получения ингредиентов' }
      },
      fulfilled: {
        type: getIngredients.fulfilled.type,
        payload: [
          {
            _id: 'bun-001',
            name: 'Светящаяся булка X-1000',
            type: 'bun',
            proteins: 120,
            fat: 30,
            carbohydrates: 60,
            calories: 500,
            price: 1500,
            image: 'https://example.com/bun-x1000.png',
            image_mobile: 'https://example.com/bun-x1000-mobile.png',
            image_large: 'https://example.com/bun-x1000-large.png'
          },
          {
            _id: 'sauce-001',
            name: 'Космический соус Звездный путь',
            type: 'sauce',
            proteins: 30,
            fat: 15,
            carbohydrates: 20,
            calories: 100,
            price: 150,
            image: 'https://example.com/sauce-star.png',
            image_mobile: 'https://example.com/sauce-star-mobile.png',
            image_large: 'https://example.com/sauce-star-large.png'
          }
        ]
      }
    };

    test('должен установить состояние загрузки при запросе ингредиентов', () => {
      const state = ingredientSlice(initialState, actions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при получении ингредиентов', () => {
      const state = ingredientSlice(initialState, actions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('должен сохранить список ингредиентов при успешном запросе', () => {
      const nextState = ingredientSlice(initialState, actions.fulfilled);
      expect(nextState.loading).toBe(false);
      expect(nextState.ingredients).toEqual(actions.fulfilled.payload);
    });
  });
});
