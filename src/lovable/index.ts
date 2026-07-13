import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export const lovable = {
  auth: {
    signInWithOAuth: async (provider: "google" | "apple" | "microsoft", opts?: { redirect_uri?: string }) => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as "google" | "apple",
        options: {
          redirectTo: opts?.redirect_uri,
        },
      });
      if (error) return { error };
      return { data };
    },
  },
};