// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// }

// serve(async (req) => {
//   // Handle CORS preflight
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders })
//   }

//   try {
//     // Criar cliente Supabase com Service Role (acesso admin)
//     const supabaseAdmin = createClient(
//       Deno.env.get('SUPABASE_URL') ?? '',
//       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
//       {
//         auth: {
//           autoRefreshToken: false,
//           persistSession: false
//         }
//       }
//     )

//     // Verificar se quem está chamando é admin
//     const authHeader = req.headers.get('Authorization')!
//     const token = authHeader.replace('Bearer ', '')

//     const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token)

//     if (authError || !callerUser) {
//       return new Response(
//         JSON.stringify({ error: 'Nao autorizado' }),
//         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       )
//     }

//     // Verificar se é admin
//     const { data: callerProfile } = await supabaseAdmin
//       .from('profiles')
//       .select('role')
//       .eq('id', callerUser.id)
//       .single()

//     if (callerProfile?.role !== 'admin') {
//       return new Response(
//         JSON.stringify({ error: 'Apenas administradores podem alterar senhas' }),
//         { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       )
//     }

//     // Obter dados do body
//     const { userId, newPassword } = await req.json()

//     if (!userId || !newPassword) {
//       return new Response(
//         JSON.stringify({ error: 'userId e newPassword sao obrigatorios' }),
//         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       )
//     }

//     if (newPassword.length < 6) {
//       return new Response(
//         JSON.stringify({ error: 'A senha deve ter pelo menos 6 caracteres' }),
//         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       )
//     }

//     // Atualizar senha do usuario
//     const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
//       userId,
//       { password: newPassword }
//     )

//     if (updateError) {
//       return new Response(
//         JSON.stringify({ error: updateError.message }),
//         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       )
//     }

//     return new Response(
//       JSON.stringify({ success: true, message: 'Senha alterada com sucesso' }),
//       { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//     )

//   } catch (error) {
//     return new Response(
//       JSON.stringify({ error: error.message }),
//       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//     )
//   }
// })
