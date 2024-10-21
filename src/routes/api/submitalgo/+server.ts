// src/routes/api/submitalgo/+server.ts

import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY } from '$env/static/public';


// Supabase client configuration
const supabaseUrl =PUBLIC_SUPABASE_URL
const supabaseKey = SUPABASE_SERVICE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse incoming JSON data
        const data = await request.json();

        const { id, name, email, roll_number, major, batch, algorithmFile } = data;

        // Validate required fields
        if (!id || !name || !email || !roll_number || !major || !batch || !algorithmFile) {
            return json({ error: 'Missing required fields.' }, { status: 400 });
        }

        // Step 1: Insert or update user data in the `user` table
        const { error: userError } = await supabase
            .from('user')
            .upsert({
                id,
                name,
                email,
                roll_number,
                major,
                batch
            }, { onConflict: 'id' }); // Update the user if already exists, based on `id`

        if (userError) {
            console.error('Error inserting/updating user:', userError);
            return json({ error: 'Failed to insert/update user data.' }, { status: 500 });
        }

        // Step 2: Insert data into the `submission` table
        const { error: submissionError } = await supabase
            .from('submission')
            .insert({
                user_id: id, // Foreign key to the user table
                algorithm_file: algorithmFile, // Storing the file content
                created_at: new Date() // Optional, timestamp of submission
            });

        if (submissionError) {
            console.error('Error inserting submission:', submissionError);
            return json({ error: 'Failed to insert submission data.' }, { status: 500 });
        }

        // Return success response
        return json({ message: 'Data submitted successfully!' }, { status: 201 });

    } catch (error) {
        console.error('Error processing request:', error);
        return json({ error: 'Failed to submit data.' }, { status: 500 });
    }
};
