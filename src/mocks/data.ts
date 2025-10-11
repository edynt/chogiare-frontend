import type { DemoData } from '@/types'
import sampleData from '../../public/data/sample-products.json'

export const demoData: DemoData = {
  categories: sampleData.categories,
  products: sampleData.products,
  users: sampleData.users,
  orders: sampleData.orders,
}