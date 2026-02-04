import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase com Service Role (acesso admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verificar se quem esta chamando e admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !callerUser) {
      return new Response(
        JSON.stringify({ error: 'Nao autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se e admin
    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', callerUser.id)
      .single()

    if (callerProfile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Apenas administradores podem editar usuarios' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Obter dados do body
    const { userId, email, nome } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId e obrigatorio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!email && !nome) {
      return new Response(
        JSON.stringify({ error: 'Informe pelo menos email ou nome para atualizar' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Se tiver email, atualizar no Auth
    if (email) {
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { email }
      )

      if (updateAuthError) {
        return new Response(
          JSON.stringify({ error: 'Erro ao atualizar email: ' + updateAuthError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Atualizar perfil na tabela profiles
    const updateData: { email?: string; nome?: string; updated_at: string } = {
      updated_at: new Date().toISOString()
    }

    if (email) updateData.email = email
    if (nome) updateData.nome = nome

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'Erro ao atualizar perfil: ' + profileError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuario atualizado com sucesso'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
