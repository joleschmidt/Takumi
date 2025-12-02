import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Vendor {
    name: string
    url: string
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const vendor: Vendor = body

        // Validate vendor data
        if (!vendor.name || !vendor.url) {
            return NextResponse.json(
                { error: 'Vendor name and URL are required' },
                { status: 400 }
            )
        }

        // Get current product
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('vendors')
            .eq('id', id)
            .single()

        if (fetchError || !product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Add new vendor to array
        const currentVendors: Vendor[] = product.vendors || []
        const updatedVendors = [...currentVendors, vendor]

        // Update product
        const { data, error } = await supabase
            .from('products')
            .update({ vendors: updatedVendors })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating product vendors:', error)
            return NextResponse.json(
                { error: 'Failed to add vendor', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { success: true, product: data },
            { status: 200 }
        )
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { searchParams } = new URL(request.url)
        const vendorIndex = parseInt(searchParams.get('index') || '-1')

        if (vendorIndex < 0) {
            return NextResponse.json(
                { error: 'Vendor index is required' },
                { status: 400 }
            )
        }

        // Get current product
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('vendors')
            .eq('id', id)
            .single()

        if (fetchError || !product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Remove vendor from array
        const currentVendors: Vendor[] = product.vendors || []
        const updatedVendors = currentVendors.filter((_, index) => index !== vendorIndex)

        // Update product
        const { data, error } = await supabase
            .from('products')
            .update({ vendors: updatedVendors })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating product vendors:', error)
            return NextResponse.json(
                { error: 'Failed to remove vendor', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { success: true, product: data },
            { status: 200 }
        )
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

