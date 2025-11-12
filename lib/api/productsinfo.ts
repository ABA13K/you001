// lib/api/products.ts
import { ProductDetailResponse, ProductsResponse } from '@/types/product'

const API_BASE_URL = 'https://aa-dev.site/you/api'

export async function getProduct(productId: string): Promise<ProductDetailResponse> {
    try {
        const url = `${API_BASE_URL}/public/products/${productId}`
        console.log(`📤 Fetching product from: ${url}`)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })

        const data = await response.json()
        console.log(`📥 Product API response:`, data)

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        return data
    } catch (error) {
        console.error(`Product API error:`, error)
        throw error
    }
}