import store, { rootReducer } from '../services/store';

test('должен вернуть начальное состояние при неизвестном действии', () => {
  const expected = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
  expect(expected).toEqual(store.getState());
});
