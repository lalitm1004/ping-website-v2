import { json } from '@sveltejs/kit';



export const POST = async ({ request, locals:{supabase} }) => {
    const userData = await request.json();

    // Insert user into the fixuser table
    const { data: insertData, error } = await supabase
        .from('fixuser')
        .insert([
            {
                id: userData.id,
                name: userData.name,
                email: userData.email,
            }
        ])
        .select(); // Ensure we select the inserted data

    if (error) {
        return json({ error: 'Failed to insert user', details: error }, { status: 400 });
    }

    return json({ user: insertData[0], submissions: [] }, { status: 201 });
};
