import { redirect } from "@sveltejs/kit";

export const GET = async ({ url, locals: { supabase }}) => {
    const code = url.searchParams.get('code');
    if (code) {
        console.log(code)
        await supabase.auth.exchangeCodeForSession(code);
    }
    redirect(303, '/')
}