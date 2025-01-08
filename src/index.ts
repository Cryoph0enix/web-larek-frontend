import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsApi } from './components/application/ProductsApi';
import {ensureElement, cloneTemplate } from './utils/utils';
import { ApplicationState } from './components/application/ApplicationState';
import { MarketPlace} from './components/view/MarketPlace';
import { ProductCard } from './components/view/ProductCard';
import { Popup } from './components/view/Popup';
import { Basket } from './components/view/Basket';
import { Order } from './components/view/Order';
import { IOrderDetails } from './types';
import { OrderConfirmed } from './components/view/OrderConfirmed';
import { Product } from './components/base/Product';
import { ContactInformation} from './components/base/ContactInformation';
import { ProductPreview } from './components/view/ProductPreview';
import { ProductsBasket } from './components/view/ProductsBasket';

const eventEmitter = new EventEmitter();
const productsApi = new ProductsApi(CDN_URL, API_URL);

eventEmitter.onAll(({ eventName}) => {
	return eventName;
})

// Шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');


// Модель состояния приложения
const applicationState = new ApplicationState({}, eventEmitter);

// Глобальные контейнеры
const marketPlace = new MarketPlace(document.body, eventEmitter);
const popup = new Popup(ensureElement<HTMLElement>('#modal-container'), eventEmitter)

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate<HTMLTemplateElement>(basketTemplate), eventEmitter);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), eventEmitter);
const contacts = new ContactInformation(cloneTemplate<HTMLFormElement>(contactsTemplate), eventEmitter);

// Сохранение данных карточек в модели данных сайта
const updateMarketPlaceItems = () => {
	// Получаем список товаров из каталога продуктов
	const items = applicationState.productCatalog;
	// Обновляем элементы на сайте
	marketPlace.items = items.map(createProductCard);
}

function createProductCard(item: Product) {
	// Создаем карточку продукта с клоном шаблона
	const productCard = new ProductCard(cloneTemplate(cardCatalogTemplate), {
		onClick: () => handleCardSelect(item)
	});
	// Возвращаем отрендеренный элемент карточки продукта
	return productCard.render({
		name: item.title,
		category: item.category,
		imageUrl: `${productsApi.cdn}${item.image}`,
		cost: item.price
	});
}

function handleCardSelect(item: Product) {
	// Генерируем событие выбора карточки
	eventEmitter.emit('card:select', item);
}

eventEmitter.on('items:changed', updateMarketPlaceItems);

//Настройка превью
const handleCardPreviewSelect = (item: Product) => {
	applicationState.updatePreview(item);
}

const handlePreviewChange = (item: Product) => {
	// Создаем экземпляр карточки продукта с обработчиком клика
	const productPreview = createProductPreview(item);
	// Отображаем всплывающее окно с содержимым карточки продукта
	renderPopup(productPreview, item);
}

function createProductPreview(item: Product) {
	return new ProductPreview(cloneTemplate(cardPreviewTemplate), {
		// Обработчик клика, который генерирует событие добавления карточки
		onClick: () => eventEmitter.emit('card:add', item)
	});
}

function renderPopup(productPreview: ProductPreview, item: Product) {
	popup.render({
		// Рендерим содержимое карточки продукта с необходимыми данными
		popupContent: productPreview.render({
			name: item.title,
			category: item.category,
			imageUrl: `${productsApi.cdn}${item.image}`,
			cost: item.price,
			text: item.description
		})
	});
}

eventEmitter.on('card:select', handleCardPreviewSelect);
eventEmitter.on('preview:changed', handlePreviewChange);

// Добавление товаров в корзину
const handleAddToCart = (item: Product) => {
	applicationState.addItemToOrder(item);
	applicationState.addItemToCart(item);
	marketPlace.counter = applicationState.basketItems.length;
	popup.closeModal()
}

eventEmitter.on('card:add', handleAddToCart);

// Функция для обновления состояния корзины
const updateBasketState = () => {
	basket.setDisabled(basket.basketButton, applicationState.isBasketEmpty);
	basket.totalAmount = applicationState.calculateTotal();

	let i = 1;
	basket.cartItems = applicationState.basketItems.map((item) => {
		const card = new ProductsBasket(cloneTemplate(cardBasketTemplate), {
			onClick: () => eventEmitter.emit('card:remove', item)
		});
		return card.render({
			name: item.title,
			cost: item.price,
			index: i++
		});
	});

	popup.render({
		popupContent: basket.render()
	});
};

// Обработчик открытия корзины
eventEmitter.on('basket:open', () => {
	updateBasketState();
});

// Обработчик удаления товара из корзины
eventEmitter.on('card:remove', (item: Product) => {
	applicationState.removeItemFromCart(item);
	applicationState.removeItemFromOrder(item);
	marketPlace.counter = applicationState.basketItems.length;
	updateBasketState();
});

// Обработчик валидации форм
const handleValidationErrors = (validationErrors: Partial<IOrderDetails>) => {
	const { payment, address, phone, email } = validationErrors;
	order.isValid = !address && !payment;
	contacts.isValid = !phone && !email;
	order.validationErrors = Object.values({address, payment}).filter(i => !!i).join('; ');
	contacts.validationErrors = Object.values({phone, email}).filter(i => !!i).join('; ');
}

eventEmitter.on('formErrors:change', handleValidationErrors);

// Обработчик изменений полей ввода
const handleFieldChange = (type: 'contacts' | 'order', data: { field: keyof IOrderDetails; value: string }) => {
	const { field, value } = data;
	if (type === 'contacts') {
		applicationState.updateContactsField(field, value);
	} else if (type === 'order') {
		applicationState.updateOrderField(field, value);
	}
}

eventEmitter.on(/^contacts\..*:change/, (data: { field: keyof IOrderDetails; value: string }) => handleFieldChange('contacts', data));
eventEmitter.on(/^order\..*:change/, (data: { field: keyof IOrderDetails; value: string }) => handleFieldChange('order', data));

// Обработчик изменения способа оплаты
const handlePaymentChange = (button: HTMLButtonElement) => {
	applicationState.currentOrder.payment = button.name;
}

eventEmitter.on('payment:change', handlePaymentChange);

// Обработчик открытия поля заказа
eventEmitter.on('order:open', () => {
	popup.render({
		popupContent: order.render({
			address: '',
			payment: 'card',
			isValid: false,
			validationErrors: []
		})
	});
});

// Обработчик отправки формы заказа
eventEmitter.on('order:submit', () => {
	applicationState.currentOrder.total = applicationState.calculateTotal();
	popup.render({
		popupContent: contacts.render({
			email: '',
			phone: '',
			isValid: false,
			validationErrors: []
		})
	});
});

// Очистка корзины
function clearBasket() {
	applicationState.emptyCart();
	marketPlace.counter = applicationState.basketItems.length;
	updateBasketState();
}

// Обработчик формы заполнения контактной информации
eventEmitter.on('contacts:submit', () => {
	productsApi.productsOrder(applicationState.currentOrder)
		.then((result) => {
			const success = new OrderConfirmed(cloneTemplate(successTemplate), {
				handleSuccess: () => {
					clearBasket();
					popup.closeModal();
				}
			});
			popup.render({
				popupContent: success.render({
					totalAmount: applicationState.calculateTotal()
				})
			})
		})
		.catch(error => {
			console.error('Ошибка при отправке контактной информации', error);
		})
});

// Блокировка прокрутки страницы при открытом попапе
const togglePageScroll = (isLocked: boolean) => {
	marketPlace.lockClass = isLocked;
}

eventEmitter.on('modal:open', () => togglePageScroll(true));
eventEmitter.on('modal:close', () => togglePageScroll(false));

// Загрузка товаров с сервера
productsApi.fetchProductList()
	.then(applicationState.updateCatalog.bind(applicationState))
	.catch(error => {
		console.error('Ошибка при загрузке товаров', error);
	});