import { IOrder, IOrderResponse, IProduct } from '../../types';
import { Api, ApiListResponse} from "../base/api";

export class ProductsApi extends Api {
	cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options)
		this.cdn = cdn;
	}
	fetchProductList() {
		return this.get('/product')
			.then((data: ApiListResponse<IProduct>) => {
				return data.items.map((item) => ({ ...item }))
			})
	}
	productsOrder(order: IOrder): Promise<IOrderResponse> {
		return this.post('/order', order).then(
			(data: IOrderResponse) => data
		);
	}
}