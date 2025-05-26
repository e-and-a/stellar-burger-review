import feedSlice, { getFeeds, initialState } from './feedSlice';

describe('тестирование редьюсера feedSlice', () => {
  describe('тестирование асинхронного GET экшена getFeeds', () => {
    const actions = {
      pending: {
        type: getFeeds.pending.type,
        payload: null
      },
      rejected: {
        type: getFeeds.rejected.type,
        error: { message: 'Ошибка получения ленты заказов' }
      },
      fulfilled: {
        type: getFeeds.fulfilled.type,
        payload: { 
          orders: [
            {
              _id: 'order-001',
              number: 1001,
              status: 'done',
              name: 'Космический бургер',
              ingredients: ['bun-001', 'sauce-001'],
              createdAt: '2024-03-20T12:00:00.000Z',
              updatedAt: '2024-03-20T12:05:00.000Z'
            },
            {
              _id: 'order-002',
              number: 1002,
              status: 'pending',
              name: 'Галактический бургер',
              ingredients: ['bun-002', 'sauce-002'],
              createdAt: '2024-03-20T12:10:00.000Z',
              updatedAt: '2024-03-20T12:15:00.000Z'
            }
          ]
        }
      }
    };

    test('должен установить состояние загрузки при запросе ленты заказов', () => {
      const state = feedSlice(initialState, actions.pending);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при получении ленты заказов', () => {
      const state = feedSlice(initialState, actions.rejected);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('должен сохранить ленту заказов при успешном запросе', () => {
      const state = feedSlice(initialState, actions.fulfilled);
      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(actions.fulfilled.payload.orders);
    });
  });
});
