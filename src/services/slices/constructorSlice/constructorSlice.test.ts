import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient
} from './constructorSlice';
import { expect, test, describe } from '@jest/globals';

describe('constructorSlice reducer tests', () => {
  const mockBun = {
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
  };

  const mockSauce = {
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
  };

  describe('addIngredient action tests', () => {
    test('should add sauce to ingredients array', () => {
      const state = constructorSlice(initialState, addIngredient(mockSauce));
      const addedIngredient = state.constructorItems.ingredients[0];
      
      expect(addedIngredient).toMatchObject({
        ...mockSauce,
        id: expect.any(String)
      });
    });

    test('should add bun to bun field', () => {
      const state = constructorSlice(initialState, addIngredient(mockBun));
      
      expect(state.constructorItems.bun).toMatchObject({
        ...mockBun,
        id: expect.any(String)
      });
    });

    test('should replace existing bun with new one', () => {
      const stateWithBun = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          bun: { ...mockBun, id: 'old-bun-id' }
        }
      };

      const newBun = {
        ...mockBun,
        _id: 'bun-002',
        name: 'Квантовая булка Y-2000'
      };

      const state = constructorSlice(stateWithBun, addIngredient(newBun));
      
      expect(state.constructorItems.bun).toMatchObject({
        ...newBun,
        id: expect.any(String)
      });
    });
  });

  describe('removeIngredient action tests', () => {
    test('should remove ingredient by id', () => {
      const stateWithIngredient = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [{ ...mockSauce, id: 'sauce-to-remove' }]
        }
      };

      const state = constructorSlice(stateWithIngredient, removeIngredient('sauce-to-remove'));
      
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredient actions tests', () => {
    const mockIngredients = [
      { ...mockSauce, id: 'sauce-1', name: 'Соус Альфа' },
      { ...mockSauce, id: 'sauce-2', name: 'Соус Бета' },
      { ...mockSauce, id: 'sauce-3', name: 'Соус Гамма' }
    ];

    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: mockIngredients
      }
    };

    test('should move ingredient up', () => {
      const state = constructorSlice(stateWithIngredients, moveIngredientUp(2));
      
      expect(state.constructorItems.ingredients[1].id).toBe('sauce-3');
      expect(state.constructorItems.ingredients[2].id).toBe('sauce-2');
    });

    test('should move ingredient down', () => {
      const state = constructorSlice(stateWithIngredients, moveIngredientDown(0));
      
      expect(state.constructorItems.ingredients[0].id).toBe('sauce-2');
      expect(state.constructorItems.ingredients[1].id).toBe('sauce-1');
    });
  });

  describe('orderBurger action tests', () => {
    const mockOrderNumber = 777;
    const mockError = 'Квантовая ошибка в пространстве-времени';

    test('should handle pending state', () => {
      const state = constructorSlice(initialState, {
        type: orderBurger.pending.type,
        payload: null
      });

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('should handle rejected state', () => {
      const state = constructorSlice(initialState, {
        type: orderBurger.rejected.type,
        error: { message: mockError }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBe(mockError);
      expect(state.orderModalData).toBeNull();
    });

    test('should handle fulfilled state', () => {
      const state = constructorSlice(initialState, {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: mockOrderNumber } }
      });

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orderModalData?.number).toBe(mockOrderNumber);
    });
  });
});
