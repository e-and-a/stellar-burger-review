import orderSlice, { initialState, getOrderByNumber } from './orderSlice';

describe('тестирование редьюсера orderSlice', () => {
  describe('тестирование асинхронного POST экшена getOrderByNumber', () => {
    const actions = {
      pending: {
        type: getOrderByNumber.pending.type,
        payload: null
      },
      rejected: {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Ошибка получения заказа' }
      },
      fulfilled: {
        type: getOrderByNumber.fulfilled.type,
        payload: { 
          orders: [{
            _id: 'order-001',
            number: 1001,
            status: 'done',
            name: 'Космический бургер',
            ingredients: ['bun-001', 'sauce-001'],
            createdAt: '2024-03-20T12:00:00.000Z',
            updatedAt: '2024-03-20T12:05:00.000Z'
          }]
        }
      }
    };

    test('тест синхронного экшена getOrderByNumber.pending', () => {
      const nextState = orderSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });
    test('тест синхронного экшена getOrderByNumber.rejected', () => {
      const nextState = orderSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });
    test('тест синхронного экшена getOrderByNumber.fulfilled', () => {
      const nextState = orderSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.orderByNumberResponse).toBe(
        actions.fulfilled.payload.orders[0]
      );
    });
  });
});
