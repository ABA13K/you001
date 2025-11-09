// components/account/orders-list.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAccount } from '@/hooks/use-account'
import { Order } from '@/types/auth'
import { Package, Calendar, DollarSign, Loader2 } from 'lucide-react'

export default function OrdersList() {
  const { getOrders, isLoading, error } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        const ordersData = await getOrders()
        if (isMounted) {
          setOrders(ordersData)
        }
      } catch (error) {
        console.error('Failed to load orders:', error)
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [getOrders])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={32} className="animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">When you place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <Package size={24} className="text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.order_number}</h3>
                    <p className="text-sm text-gray-500">{order.item_count} items</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-1" />
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm font-semibold text-gray-900">
                    <DollarSign size={16} className="mr-1" />
                    {order.total_amount.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}