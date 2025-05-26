import { TIngredient, TConstructorIngredient } from '@utils-types';
import { constructorSlice, orderBurger } from '../constructorSlice';

const { reducer: constructorReducer, actions } = constructorSlice;
const { addIngredient } = actions;

describe('constructorSlice', () => {
  it('при добавлении новой булки должна заменить существующую', () => {
    const oldBun: TConstructorIngredient = {
      _id: '1',
      type: 'bun',
      name: 'Старая булка',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 200,
      price: 100,
      image: 'test.jpg',
      image_mobile: 'test-mobile.jpg',
      image_large: 'test-large.jpg',
      id: '1'
    };
    
    const newBun: TIngredient = {
      _id: '2',
      type: 'bun',
      name: 'Новая булка',
      proteins: 12,
      fat: 6,
      carbohydrates: 25,
      calories: 250,
      price: 120,
      image: 'test2.jpg',
      image_mobile: 'test2-mobile.jpg',
      image_large: 'test2-large.jpg'
    };
    
    const stateWithOldBun = {
      ...constructorSlice.getInitialState(),
      constructorItems: {
        bun: oldBun,
        ingredients: []
      }
    };
    
    const state = constructorReducer(
      stateWithOldBun,
      addIngredient(newBun)
    );
    
    expect(state.constructorItems.bun).toMatchObject({
      ...newBun,
      id: expect.any(String)
    });
    expect(state.constructorItems.bun).not.toEqual(oldBun);
  });

  it('после успешного оформления заказа должен сбросить состояние конструктора', () => {
    const testIngredient: TConstructorIngredient = {
      _id: '1',
      type: 'main',
      name: 'Ингредиент 1',
      proteins: 15,
      fat: 8,
      carbohydrates: 30,
      calories: 300,
      price: 150,
      image: 'test.jpg',
      image_mobile: 'test-mobile.jpg',
      image_large: 'test-large.jpg',
      id: '1'
    };

    const testBun: TConstructorIngredient = {
      _id: '3',
      type: 'bun',
      name: 'Булка',
      proteins: 10,
      fat: 5,
      carbohydrates: 20,
      calories: 200,
      price: 100,
      image: 'test.jpg',
      image_mobile: 'test-mobile.jpg',
      image_large: 'test-large.jpg',
      id: '3'
    };
    
    const stateWithItems = {
      ...constructorSlice.getInitialState(),
      constructorItems: {
        bun: testBun,
        ingredients: [testIngredient]
      }
    };
    
    const state = constructorReducer(
      stateWithItems,
      {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: 123 } }
      }
    );
    
    expect(state.constructorItems.ingredients).toHaveLength(0);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.orderModalData).toEqual({ number: 123 });
  });

  it('при добавлении ингредиента должен присвоить ему уникальный идентификатор', () => {
    const ingredient: TIngredient = {
      _id: '1',
      type: 'main',
      name: 'Ингредиент',
      proteins: 0,
      fat: 0,
      carbohydrates: 0,
      calories: 0,
      price: 0,
      image: 'test.jpg',
      image_mobile: 'test-mobile.jpg',
      image_large: 'test-large.jpg'
    };
    
    const state = constructorReducer(
      constructorSlice.getInitialState(),
      addIngredient(ingredient)
    );
    
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients[0]).toMatchObject({
      ...ingredient,
      id: expect.any(String)
    });
  });
}); 