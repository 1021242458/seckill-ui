import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'

//商品查询
export const productListService = (params)=>{
   return  request.get('/product/search',{params:params})
}