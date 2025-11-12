// hooks/use-product.ts
import { useState, useCallback } from 'react'
import { getProduct } from '@/lib/api/productsinfo'
import { DetailedProduct, SimilarProduct } from '@/types/product'

export function useProduct() {
    const [product, setProduct] = useState<DetailedProduct | null>(null)
    const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProduct = useCallback(async (productId: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getProduct(productId)
            setProduct(response.data.product)
            setSimilarProducts(response.data.similar_products || [])
            return response.data
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch product'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        product,
        similarProducts,
        isLoading,
        error,
        fetchProduct,
        clearError,
    }
}