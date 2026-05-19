import { supabase } from '../../../lib/supabase';

export async function POST(request) {
    const { email } = await request.json()

    if (!email) {
        return Response.json(
            { error: 'Email is required' },
            { status: 400 }
        )
    }

    const { error } = await supabase
        .from('subscribers')
        .insert({ email })

    if (error) {
        if (error.code === '23505') {
            return Response.json(
                { error: 'You are already subscribed!' },
                { status: 400 }
            )
        }
        return Response.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }

    return Response.json(
        { success: true, message: 'Subscribed successfully!' },
        { status: 200 }
    )
}