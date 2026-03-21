-- Adiciona coluna para controle de reset mensal
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS edit_count_month INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS edit_count_reset_at DATE NOT NULL DEFAULT date_trunc('month', now())::date;

-- Atualiza a função de verificação com reset mensal automático
CREATE OR REPLACE FUNCTION public.check_and_increment_edit(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile profiles%ROWTYPE;
  v_limit INTEGER := 3;
  v_current_month DATE := date_trunc('month', now())::date;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE user_id = p_user_id;

  -- Se o mês mudou, reseta o contador
  IF v_profile.edit_count_reset_at < v_current_month THEN
    UPDATE profiles 
    SET edit_count_month = 0,
        edit_count_reset_at = v_current_month
    WHERE user_id = p_user_id;
    v_profile.edit_count_month := 0;
  END IF;

  -- Plano pago → sempre permitido
  IF v_profile.plan != 'free' THEN
    RETURN json_build_object('allowed', true, 'edit_count', v_profile.edit_count_month, 'limit', -1);
  END IF;

  -- Plano free → verifica limite
  IF v_profile.edit_count_month >= v_limit THEN
    RETURN json_build_object(
      'allowed', false, 
      'edit_count', v_profile.edit_count_month, 
      'limit', v_limit,
      'resets_at', (v_current_month + INTERVAL '1 month')::text
    );
  END IF;

  -- Incrementa e permite
  UPDATE profiles 
  SET edit_count_month = edit_count_month + 1
  WHERE user_id = p_user_id;

  RETURN json_build_object(
    'allowed', true, 
    'edit_count', v_profile.edit_count_month + 1, 
    'limit', v_limit,
    'resets_at', (v_current_month + INTERVAL '1 month')::text
  );
END;
$$;
