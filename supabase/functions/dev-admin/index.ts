import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STUDENT_CODE = "290625";
const TEACHER_CODE = "220824";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/dev-admin\/?/, "");
    const body = req.method !== "GET" && req.method !== "DELETE" ? await req.json() : {};
    const code = body.code ?? url.searchParams.get("code");

    // Validate dev access code
    if (code !== STUDENT_CODE && code !== TEACHER_CODE) {
      return new Response(JSON.stringify({ error: "Código de acesso inválido." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /dev-admin/users?role=student&class_id=xxx — list users
    if (req.method === "GET" && (path === "users" || path === "")) {
      let query = supabase.from("profiles").select("id, name, username, email, role, class_id, avatar_color, xp, level, joined_at");
      const roleFilter = url.searchParams.get("role");
      const classFilter = url.searchParams.get("class_id");
      if (roleFilter) query = query.eq("role", roleFilter);
      if (classFilter) query = query.eq("class_id", classFilter);
      const { data, error } = await query.order("joined_at", { ascending: false });
      if (error) throw error;
      // Also fetch class names
      const { data: classes } = await supabase.from("classes").select("id, name");
      const classMap = new Map((classes ?? []).map((c: any) => [c.id, c.name]));
      const result = (data ?? []).map((u: any) => ({ ...u, class_name: u.class_id ? classMap.get(u.class_id) ?? null : null }));
      return new Response(JSON.stringify({ users: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /dev-admin/users/:id — delete user account + profile
    if (req.method === "DELETE" && path.startsWith("users/")) {
      const userId = path.split("/")[1];
      if (!userId) {
        return new Response(JSON.stringify({ error: "ID do usuário é obrigatório." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Delete profile first (RLS-free via service role)
      const { error: profileErr } = await supabase.from("profiles").delete().eq("id", userId);
      if (profileErr) throw profileErr;
      // Delete auth user
      const { error: authErr } = await supabase.auth.admin.deleteUser(userId);
      if (authErr) throw authErr;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /dev-admin/verify?code=xxx — verify access code and return mode
    if (req.method === "GET" && path === "verify") {
      const mode = code === STUDENT_CODE ? "student" : "teacher";
      return new Response(JSON.stringify({ valid: true, mode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Rota não encontrada." }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
