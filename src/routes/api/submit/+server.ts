import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
    const userData = await request.json();


    const userObject = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roll_number: userData.roll_number,
        major: userData.major,
        batch: userData.batch,
        submission: userData.submission,
        submission_time: userData.submission_time,
    };

    const {
        data: insertData,
        error: insertError,
    } = await supabase
        .from('fixuser')
        .update([userObject])
        .eq('id', userData.id)
        .select();
    const newdata = await supabase.from('fixuser').select();
    console.log(newdata)
    console.log(insertData, insertError)

    if (insertError) {
        return json({ error: insertError.message }, { status: 500 });
    }

    return json({ user: insertData[0], submissions: [] }, { status: 201 });
}