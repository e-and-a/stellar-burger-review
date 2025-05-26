import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser
} from './userSlice';

describe('тестирование редьюсера userSlice', () => {
  const mockUser = {
    name: 'Космический Повар',
    email: 'chef@space-burger.com'
  };

  const mockOrders = [
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
  ];

  describe('тестирование асинхронного GET экшена getUser', () => {
    const actions = {
      pending: {
        type: getUser.pending.type,
        payload: null
      },
      rejected: {
        type: getUser.rejected.type,
        payload: null
      },
      fulfilled: {
        type: getUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('должен установить состояние загрузки при запросе данных пользователя', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при получении данных пользователя', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.payload);
    });

    test('должен сохранить данные пользователя при успешном запросе', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.userData).toEqual(actions.fulfilled.payload.user);
    });
  });

  describe('тестирование асинхронного GET экшена getOrdersAll', () => {
    const actions = {
      pending: {
        type: getOrdersAll.pending.type,
        payload: null
      },
      rejected: {
        type: getOrdersAll.rejected.type,
        error: { message: 'Ошибка получения заказов пользователя' }
      },
      fulfilled: {
        type: getOrdersAll.fulfilled.type,
        payload: mockOrders
      }
    };

    test('должен установить флаг загрузки при запросе истории заказов', () => {
      const state = userSlice(initialState, actions.pending);
      expect(state.request).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при получении истории заказов', () => {
      const state = userSlice(initialState, actions.rejected);
      expect(state.request).toBe(false);
      expect(state.error).toBe(actions.rejected.error.message);
    });

    test('должен сохранить историю заказов при успешном запросе', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.userOrders).toEqual(actions.fulfilled.payload);
    });
  });

  describe('тестирование асинхронного POST экшена registerUser', () => {
    const actions = {
      pending: {
        type: registerUser.pending.type,
        payload: null
      },
      rejected: {
        type: registerUser.rejected.type,
        error: { message: 'Ошибка регистрации пользователя' }
      },
      fulfilled: {
        type: registerUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('должен установить состояние загрузки при регистрации', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при регистрации', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });

    test('должен сохранить данные пользователя после успешной регистрации', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.userData).toBe(actions.fulfilled.payload.user);
    });
  });

  describe('тестирование асинхронного POST экшена loginUser', () => {
    const actions = {
      pending: {
        type: loginUser.pending.type,
        payload: null
      },
      rejected: {
        type: loginUser.rejected.type,
        error: { message: 'Ошибка входа в систему' }
      },
      fulfilled: {
        type: loginUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('должен установить состояние авторизации при входе', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.loginUserRequest).toBe(true);
      expect(nextState.isAuthChecked).toBe(true);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при входе в систему', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.loginUserRequest).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });

    test('должен установить авторизацию после успешного входа', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.loginUserRequest).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.userData).toBe(actions.fulfilled.payload.user);
    });
  });

  describe('тестирование асинхронного PATCH экшена updateUser', () => {
    const actions = {
      pending: {
        type: updateUser.pending.type,
        payload: null
      },
      rejected: {
        type: updateUser.rejected.type,
        error: { message: 'Ошибка обновления данных пользователя' }
      },
      fulfilled: {
        type: updateUser.fulfilled.type,
        payload: { user: mockUser }
      }
    };

    test('должен установить состояние загрузки при обновлении данных', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при обновлении данных', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });

    test('должен обновить данные пользователя после успешного запроса', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.response).toBe(actions.fulfilled.payload.user);
    });
  });

  describe('тестирование асинхронного POST экшена logoutUser', () => {
    const actions = {
      pending: {
        type: logoutUser.pending.type,
        payload: null
      },
      rejected: {
        type: logoutUser.rejected.type,
        error: { message: 'Ошибка выхода из системы' }
      },
      fulfilled: {
        type: logoutUser.fulfilled.type,
        payload: null
      }
    };

    test('должен установить состояние выхода из системы', () => {
      const nextState = userSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.isAuthChecked).toBe(true);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });

    test('должен обработать ошибку при выходе из системы', () => {
      const nextState = userSlice(initialState, actions.rejected);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });

    test('должен сбросить авторизацию после успешного выхода', () => {
      const nextState = userSlice(initialState, actions.fulfilled);
      expect(nextState.isAuthChecked).toBe(false);
      expect(nextState.isAuthenticated).toBe(false);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.userData).toBe(actions.fulfilled.payload);
    });
  });
});
