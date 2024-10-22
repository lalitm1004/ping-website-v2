import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { createServerClient } from '@supabase/ssr';
import { redirect, type Handle } from '@sveltejs/kit';
import type { Database } from "$lib/types/supabase";
import { sequence } from "@sveltejs/kit/hooks";

const supabase: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return event.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    event.cookies.set(name, value, { ...options, path: '/' })
                );
            },
        },
    });

    event.locals.safeGetSession = async () => {

        const {
            data: { user },
            error,
        } = await event.locals.supabase.auth.getUser();
        if (error) {
            return { session: null, user: null };
        }


        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();
        if (!session) {
            return { session: null, user: null };
        }

        return { session: session, user: user };
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    })
}

const comingSoon: Handle = async ({ event, resolve }) => {
    // 

    const currentDate = new Date();
    const targetDate = new Date('2024-10-22T19:15:00'); // 6 PM on 23rd October 2024

    if (currentDate < targetDate) {
        if (event.url.pathname !== '/') {
                 redirect(303, '/');
        }
    }
    return resolve(event);
}

export const handle: Handle = sequence(supabase, comingSoon)