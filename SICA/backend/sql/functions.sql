CREATE OR REPLACE FUNCTION validar_cpf(cpf TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    numeros TEXT;
    soma INTEGER;
    resto INTEGER;
    digito INTEGER;
    i INTEGER;
BEGIN
    -- Remove pontos e traços
    numeros := regexp_replace(cpf, '[^0-9]', '', 'g');

    -- Verifica quantidade de dígitos
    IF length(numeros) <> 11 THEN
        RETURN FALSE;
    END IF;

    -- Rejeita sequências repetidas
    IF numeros ~ '^([0-9])\1{10}$' THEN
        RETURN FALSE;
    END IF;

    -- Primeiro dígito verificador
    soma := 0;

    FOR i IN 1..9 LOOP
        soma := soma + CAST(substr(numeros, i, 1) AS INTEGER) * (11 - i);
    END LOOP;

    resto := (soma * 10) % 11;
    IF resto = 10 THEN resto := 0; END IF;

    IF resto <> CAST(substr(numeros, 10, 1) AS INTEGER) THEN
        RETURN FALSE;
    END IF;

    -- Segundo dígito verificador
    soma := 0;

    FOR i IN 1..10 LOOP
        soma := soma + CAST(substr(numeros, i, 1) AS INTEGER) * (12 - i);
    END LOOP;

    resto := (soma * 10) % 11;
    IF resto = 10 THEN resto := 0; END IF;

    IF resto <> CAST(substr(numeros, 11, 1) AS INTEGER) THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;