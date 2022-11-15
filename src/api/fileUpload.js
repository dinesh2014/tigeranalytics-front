import axios from 'axios';
import { backendUrl } from 'src/base';

class FileUploadApi {
  async uploadCSV(fileName) {
    const formData = new FormData();
    formData.append("data", fileName);
    await axios.post(backendUrl + '/product/upload',formData)
    
    return Promise.resolve(fileName);
  }

  async listProduct() {
    const product = await axios.get(backendUrl + '/product/list')

    console.log(product.data)
    
    return Promise.resolve(product.data);
  }

  async deleteProduct(id) {
    const product = await axios.delete(backendUrl + '/product/delete',{
      data: {
        id
      }
    })

     
    return Promise.resolve(product.data);
  }

  async editProduct(product) {
    const products = await axios.delete(backendUrl + '/product/edit',{
      data: {
        product
      }
    })    
    return Promise.resolve(products.data);
  }

}



export const fileUploadApi = new FileUploadApi();