import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
    const userId = url.searchParams.get('userId');
    if (!userId) {
        return json({ error: 'No userId provided.' }, { status: 400 });
    }

    const {
        data: userData,
        error: userError,
    } = await supabase
        .from('user')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (userError || userData === null) {
        return json({ error: 'User not found' }, { status: 404 })
    }


    const {
        data: submissionData,
        error: submissionError,
    } = await supabase
        .from('submission')
        .select('*')
        .eq('user', userId);

    if (submissionError || submissionData.length < 1) {
        return json({
            user: userData,
            submissions: [],
        })
    } else {
        return json({
            user: userData,
            submissions: submissionData,
        })
    }
}

export const POST = async ({ request, locals: { supabase } }) => {
    const userData = await request.json();

    if (
        !userData.id ||
        !userData.name ||
        !userData.email ||
        !userData.roll_number ||
        !userData.major ||
        !userData.batch
    ) {
        return json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userObject = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roll_number: userData.roll_number,
        major: userData.major,
        batch: userData.batch,
    };

    const {
        data: insertData,
        error: insertError,
    } = await supabase
        .from('user')
        .insert([userObject])
        .select();
    
    if (insertError) {
        return json({ error: insertError.message }, { status: 500 });
    }
    
    return json({ user: insertData[0], submissions: [] }, { status: 201 });
}