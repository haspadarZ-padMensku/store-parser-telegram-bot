import axios from 'axios';
import { parse } from 'node-html-parser';
import { getFile, saveFile } from '../../utils';

interface Product {
  imageUrl: string;
  name: string;
  description: string;
  price: string;
  url: string;
}

const BASE_URL = 'https://mobistock.by';
const INITIAL_URL = `${BASE_URL}/katalog-tovarov/phones/apple-nizkaya-cena#/sort=p.sort_order/order=ASC/limit=100`;

export const getProducts = async () => {
  const res = await axios.get(INITIAL_URL, { responseType: 'text' });

  const html = await res.data;

  const root = parse(html);

  const mainProductsDiv = root.querySelector('.main-products');

  const items = mainProductsDiv?.querySelectorAll('.product-wrapper');
  const products = items?.map((product) => {
    const url = product.querySelector('.image > a')?.attributes?.href;

    const imageDiv = product.querySelector('img');

    const productDetailsDiv = product.querySelector('.product-details');

    const imageUrl = imageDiv ? parse(imageDiv.toString()).querySelector('img')?.attributes.src : '';

    const captionDiv = productDetailsDiv ? parse(productDetailsDiv.toString()).querySelector('.caption') : '';
    const name = captionDiv ? parse(captionDiv.toString()).querySelector('.name > a')?.innerText?.trim() : '';
    const description = captionDiv ? parse(captionDiv.toString()).querySelector('.description')?.innerText?.trim() : '';
    const price = captionDiv ? parse(captionDiv.toString()).querySelector('.price')?.innerText?.trim() : '';

    return {
      imageUrl,
      name,
      description,
      price,
      url,
    };
  });

  return products as Product[];
};

export const getNewProducts = async () => {
  let newProducts: Product[] = [];

  const products = await getProducts();
  const oldProductsString = await getFile('products.txt');
  if (oldProductsString) {
    const oldProducts = JSON.parse(oldProductsString) || [];

    if (Array.isArray(oldProducts)) {
      newProducts = products?.filter((item) => !oldProducts.find((oldItem) => oldItem.name === item.name)) || [];
    }
  } else {
    await saveFile(JSON.stringify(products), 'products.txt');
    newProducts = products;
  }

  return newProducts;
};

// TODO: open page and parse products
// get new items (save in temp LocalStorage)
