-- ============================================
-- Perguntas de Quiz para todas as aulas
-- ============================================

-- ============================================
-- CURSO 1: FUNDAMENTOS DA FÉ
-- ============================================

-- Aula: A Pessoa de Jesus (ordem 3)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT id INTO lesson_id_var FROM lessons WHERE titulo = 'A Pessoa de Jesus' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Jesus é considerado pela fé cristã como:', 'Jesus Cristo é a segunda pessoa da Trindade, sendo plenamente Deus e plenamente homem - o Verbo que se fez carne.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Apenas um grande profeta', false, 1),
  (q1_id, 'Um anjo enviado por Deus', false, 2),
  (q1_id, 'O Filho de Deus, segunda pessoa da Trindade', true, 3),
  (q1_id, 'Um homem comum que foi divinizado', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual é o significado do nome "Cristo"?', 'Cristo vem do grego "Christos", que significa "ungido". Em hebraico, o equivalente é "Messias" - aquele escolhido e ungido por Deus para salvar Seu povo.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Salvador', false, 1),
  (q2_id, 'Ungido/Messias', true, 2),
  (q2_id, 'Rei dos reis', false, 3),
  (q2_id, 'Filho do homem', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Como Jesus veio ao mundo?', 'Jesus nasceu de uma virgem chamada Maria, pelo poder do Espírito Santo, conforme profetizado em Isaías 7:14 e cumprido em Mateus 1:18-25.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Nasceu de pais humanos comuns', false, 1),
  (q3_id, 'Desceu diretamente do céu já adulto', false, 2),
  (q3_id, 'Nasceu de uma virgem pelo Espírito Santo', true, 3),
  (q3_id, 'Foi criado como Adão', false, 4);

  -- Pergunta 4
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual evento comprova que Jesus venceu a morte?', 'A ressurreição de Jesus no terceiro dia é o evento central da fé cristã, provando Sua divindade e garantindo nossa esperança de vida eterna.', 4)
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q4_id, 'O batismo no rio Jordão', false, 1),
  (q4_id, 'A transfiguração no monte', false, 2),
  (q4_id, 'A ressurreição no terceiro dia', true, 3),
  (q4_id, 'A multiplicação dos pães', false, 4);
END $$;

-- Aula: O Espírito Santo (ordem 4)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT id INTO lesson_id_var FROM lessons WHERE titulo = 'O Espírito Santo' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O Espírito Santo é:', 'O Espírito Santo é a terceira pessoa da Trindade, não uma força impessoal. Ele tem personalidade, vontade e emoções.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Uma energia divina impessoal', false, 1),
  (q1_id, 'A terceira pessoa da Trindade', true, 2),
  (q1_id, 'Apenas uma manifestação de Deus', false, 3),
  (q1_id, 'Um anjo especial', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quando o Espírito Santo foi derramado sobre a igreja?', 'O Espírito Santo foi derramado no dia de Pentecostes, 50 dias após a ressurreição de Jesus, conforme registrado em Atos 2.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'No Natal', false, 1),
  (q2_id, 'Na Páscoa', false, 2),
  (q2_id, 'No Pentecostes', true, 3),
  (q2_id, 'Na Ascensão', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual é uma das principais funções do Espírito Santo na vida do crente?', 'O Espírito Santo guia o crente em toda a verdade, ensina, consola, convence do pecado e capacita para o serviço.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Julgar os pecados cometidos', false, 1),
  (q3_id, 'Guiar em toda a verdade e capacitar para o serviço', true, 2),
  (q3_id, 'Afastar todo tipo de sofrimento', false, 3),
  (q3_id, 'Garantir prosperidade financeira', false, 4);

  -- Pergunta 4
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual destes NÃO é um fruto do Espírito mencionado em Gálatas 5:22-23?', 'Os frutos do Espírito são: amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio. Prosperidade não está na lista.', 4)
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q4_id, 'Amor', false, 1),
  (q4_id, 'Paz', false, 2),
  (q4_id, 'Prosperidade', true, 3),
  (q4_id, 'Domínio próprio', false, 4);
END $$;

-- Aula: Salvação pela Graça (ordem 5)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT id INTO lesson_id_var FROM lessons WHERE titulo = 'Salvação pela Graça' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que significa "graça" no contexto da salvação?', 'Graça é o favor imerecido de Deus - um presente que não podemos conquistar por méritos ou obras, mas que recebemos pela fé em Jesus Cristo.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Recompensa pelas boas obras', false, 1),
  (q1_id, 'Favor imerecido de Deus', true, 2),
  (q1_id, 'Resultado do esforço humano', false, 3),
  (q1_id, 'Bênção material', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Segundo Efésios 2:8-9, somos salvos por:', 'Paulo ensina claramente que somos salvos pela graça mediante a fé, e isso não vem de nós, é dom de Deus - não por obras, para que ninguém se glorie.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Nossas boas ações', false, 1),
  (q2_id, 'Graça mediante a fé', true, 2),
  (q2_id, 'Cumprimento de rituais religiosos', false, 3),
  (q2_id, 'Nascimento em família cristã', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que é necessário para receber a salvação?', 'A Bíblia ensina que devemos reconhecer nosso pecado, arrepender-nos e crer em Jesus Cristo como Senhor e Salvador (Romanos 10:9-10).', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Fazer muitas boas obras', false, 1),
  (q3_id, 'Arrepender-se e crer em Jesus', true, 2),
  (q3_id, 'Nascer em uma família cristã', false, 3),
  (q3_id, 'Frequentar a igreja todos os domingos', false, 4);

  -- Pergunta 4
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Jesus disse em João 14:6 que Ele é:', 'Jesus declarou ser o caminho, a verdade e a vida - a única forma de acesso ao Pai. Não há salvação em nenhum outro nome.', 4)
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q4_id, 'Um dos caminhos para Deus', false, 1),
  (q4_id, 'O caminho, a verdade e a vida', true, 2),
  (q4_id, 'Um grande mestre espiritual', false, 3),
  (q4_id, 'Um exemplo a ser seguido', false, 4);
END $$;

-- Aula: Fé e Obras (ordem 7)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT id INTO lesson_id_var FROM lessons WHERE titulo = 'Fé e Obras' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Segundo Tiago 2:17, a fé sem obras é:', 'Tiago ensina que a fé genuína produz frutos. Uma fé que não resulta em transformação de vida é uma fé morta, sem vida real.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Forte', false, 1),
  (q1_id, 'Morta', true, 2),
  (q1_id, 'Suficiente', false, 3),
  (q1_id, 'Inicial', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual é a relação correta entre fé e obras?', 'Somos salvos pela fé, mas a fé verdadeira produz obras como fruto natural. As obras não salvam, mas evidenciam uma fé genuína.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Obras salvam, fé complementa', false, 1),
  (q2_id, 'Fé salva, obras são evidência da fé', true, 2),
  (q2_id, 'Fé e obras são independentes', false, 3),
  (q2_id, 'Apenas obras são necessárias', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Em Efésios 2:10, Paulo diz que fomos criados em Cristo Jesus para:', 'Somos salvos para boas obras, não por boas obras. Deus preparou de antemão obras para que andássemos nelas.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Ganhar a salvação', false, 1),
  (q3_id, 'Boas obras preparadas por Deus', true, 2),
  (q3_id, 'Viver sem responsabilidades', false, 3),
  (q3_id, 'Julgar os outros', false, 4);
END $$;

-- Aula: A Igreja (ordem 9)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT id INTO lesson_id_var FROM lessons WHERE titulo = 'A Igreja' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que significa a palavra "Igreja" (ekklesia)?', 'Ekklesia vem do grego e significa "chamados para fora" ou "assembleia dos chamados". Refere-se ao povo de Deus reunido, não ao prédio.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Templo ou prédio sagrado', false, 1),
  (q1_id, 'Assembleia dos chamados', true, 2),
  (q1_id, 'Organização religiosa', false, 3),
  (q1_id, 'Local de culto', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'A Bíblia compara a Igreja ao:', 'Paulo usa várias metáforas para a Igreja: corpo de Cristo (sendo Ele a cabeça), noiva de Cristo, templo do Espírito Santo, família de Deus.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Corpo de Cristo', true, 2),
  (q2_id, 'Exército militar', false, 1),
  (q2_id, 'Empresa', false, 3),
  (q2_id, 'Governo', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual é uma das principais funções da Igreja?', 'A Igreja existe para adorar a Deus, edificar os santos, fazer discípulos e servir ao próximo - cumprindo a Grande Comissão.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Acumular riquezas', false, 1),
  (q3_id, 'Fazer discípulos de todas as nações', true, 2),
  (q3_id, 'Exercer poder político', false, 3),
  (q3_id, 'Isolar-se do mundo', false, 4);
END $$;

-- Aula: Crescimento Espiritual (ordem 11)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT id INTO lesson_id_var FROM lessons WHERE titulo = 'Crescimento Espiritual' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual é uma disciplina espiritual fundamental para o crescimento?', 'A leitura e meditação diária na Palavra de Deus é essencial para o crescimento espiritual, conforme Josué 1:8 e Salmo 1:2.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Assistir filmes cristãos', false, 1),
  (q1_id, 'Leitura e meditação na Palavra', true, 2),
  (q1_id, 'Participar de eventos sociais', false, 3),
  (q1_id, 'Ouvir músicas seculares', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Em 2 Pedro 3:18, somos exortados a crescer em:', 'Pedro nos exorta a crescer na graça e no conhecimento de nosso Senhor Jesus Cristo - um processo contínuo de transformação.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Riqueza e poder', false, 1),
  (q2_id, 'Graça e conhecimento de Cristo', true, 2),
  (q2_id, 'Fama e reconhecimento', false, 3),
  (q2_id, 'Habilidades naturais', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que ajuda no crescimento espiritual segundo Hebreus 10:25?', 'O autor de Hebreus nos exorta a não abandonar a congregação, pois a comunhão com outros crentes é vital para o crescimento.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Isolamento para meditação solitária', false, 1),
  (q3_id, 'Não abandonar a congregação', true, 2),
  (q3_id, 'Viagens missionárias frequentes', false, 3),
  (q3_id, 'Estudos acadêmicos avançados', false, 4);
END $$;

-- ============================================
-- CURSO 2: VIDA DE ORAÇÃO
-- ============================================

-- Aula: Tipos de Oração (ordem 2)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Tipos de Oração' AND c.slug = 'vida-de-oracao' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual tipo de oração envolve agradecer a Deus por suas bênçãos?', 'A oração de ação de graças é quando reconhecemos e agradecemos a Deus por tudo que Ele fez e faz em nossas vidas.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Intercessão', false, 1),
  (q1_id, 'Ação de graças', true, 2),
  (q1_id, 'Súplica', false, 3),
  (q1_id, 'Confissão', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Orar pelos outros é chamado de:', 'Intercessão é a oração em favor de outras pessoas, colocando-nos como mediadores entre Deus e aqueles por quem oramos.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Adoração', false, 1),
  (q2_id, 'Confissão', false, 2),
  (q2_id, 'Intercessão', true, 3),
  (q2_id, 'Petição', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Reconhecer nossos pecados diante de Deus é chamado de oração de:', 'A confissão é quando reconhecemos nossos pecados diante de Deus, pedindo perdão e purificação (1 João 1:9).', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Louvor', false, 1),
  (q3_id, 'Petição', false, 2),
  (q3_id, 'Confissão', true, 3),
  (q3_id, 'Consagração', false, 4);
END $$;

-- Aula: O Pai Nosso (ordem 3)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'O Pai Nosso' AND c.slug = 'vida-de-oracao' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Em qual evangelho Jesus ensinou o Pai Nosso aos discípulos?', 'O Pai Nosso é registrado em Mateus 6:9-13 no Sermão do Monte, e também em Lucas 11:2-4 em outro contexto.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Marcos', false, 1),
  (q1_id, 'João', false, 2),
  (q1_id, 'Mateus', true, 3),
  (q1_id, 'Atos', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, '"Venha o teu Reino" nos ensina a orar por:', 'Esta petição nos ensina a desejar e orar pela manifestação do governo de Deus na terra, em nossas vidas e no mundo.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Prosperidade pessoal', false, 1),
  (q2_id, 'A manifestação do governo de Deus', true, 2),
  (q2_id, 'O fim do mundo', false, 3),
  (q2_id, 'Vitória sobre inimigos', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que significa "santificado seja o teu nome"?', 'Significa reconhecer a santidade de Deus, tratando Seu nome com reverência e honra, separando-o como único e santo.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Repetir o nome de Deus muitas vezes', false, 1),
  (q3_id, 'Reconhecer e honrar a santidade de Deus', true, 2),
  (q3_id, 'Não pronunciar o nome de Deus', false, 3),
  (q3_id, 'Fazer promessas a Deus', false, 4);

  -- Pergunta 4
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Na frase "perdoa as nossas dívidas", o que representam as dívidas?', 'As dívidas representam nossos pecados e ofensas contra Deus. Jesus nos ensina a buscar perdão e também a perdoar os outros.', 4)
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q4_id, 'Dívidas financeiras', false, 1),
  (q4_id, 'Nossos pecados e ofensas', true, 2),
  (q4_id, 'Obrigações religiosas', false, 3),
  (q4_id, 'Promessas não cumpridas', false, 4);
END $$;

-- Aula: Oração Intercessória (ordem 4)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Oração Intercessória' AND c.slug = 'vida-de-oracao' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quem é o maior intercessor mencionado na Bíblia?', 'Jesus Cristo é nosso sumo sacerdote que vive sempre para interceder por nós (Hebreus 7:25). Ele é o mediador entre Deus e os homens.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Moisés', false, 1),
  (q1_id, 'Abraão', false, 2),
  (q1_id, 'Jesus Cristo', true, 3),
  (q1_id, 'Paulo', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Em 1 Timóteo 2:1, Paulo nos exorta a interceder por:', 'Paulo instrui que se façam súplicas, orações, intercessões e ações de graças por todos os homens, incluindo autoridades.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Apenas nossos familiares', false, 1),
  (q2_id, 'Todos os homens', true, 2),
  (q2_id, 'Somente os cristãos', false, 3),
  (q2_id, 'Apenas os pobres', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual personagem do AT intercedeu por Sodoma e Gomorra?', 'Abraão intercedeu por Sodoma, pedindo que Deus poupasse a cidade se houvesse justos nela (Gênesis 18:22-33).', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Noé', false, 1),
  (q3_id, 'Abraão', true, 2),
  (q3_id, 'Ló', false, 3),
  (q3_id, 'Jacó', false, 4);
END $$;

-- Aula: Oração no Espírito (ordem 6)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Oração no Espírito' AND c.slug = 'vida-de-oracao' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Segundo Romanos 8:26, o Espírito Santo nos ajuda quando:', 'O Espírito intercede por nós com gemidos inexprimíveis quando não sabemos como orar adequadamente.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Estamos com preguiça de orar', false, 1),
  (q1_id, 'Não sabemos como orar', true, 2),
  (q1_id, 'Queremos impressionar os outros', false, 3),
  (q1_id, 'Oramos em público', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Em Efésios 6:18, Paulo nos instrui a orar:', 'Paulo exorta a orar em todo tempo no Espírito, com toda oração e súplica, vigiando com perseverança.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Apenas nas manhãs', false, 1),
  (q2_id, 'Em todo tempo no Espírito', true, 2),
  (q2_id, 'Somente nas igrejas', false, 3),
  (q2_id, 'Uma vez por semana', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Orar no Espírito significa principalmente:', 'Orar no Espírito é orar sob a direção, poder e ajuda do Espírito Santo, permitindo que Ele guie nossas orações.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Orar em voz alta', false, 1),
  (q3_id, 'Orar sob a direção do Espírito Santo', true, 2),
  (q3_id, 'Orar por muito tempo', false, 3),
  (q3_id, 'Orar palavras decoradas', false, 4);
END $$;

-- Aula: Obstáculos à Oração (ordem 7)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Obstáculos à Oração' AND c.slug = 'vida-de-oracao' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Segundo Isaías 59:2, o que pode separar-nos de Deus e atrapalhar nossas orações?', 'O pecado cria uma barreira entre nós e Deus, impedindo que nossas orações sejam ouvidas até que haja confissão e arrependimento.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'A distância física', false, 1),
  (q1_id, 'O pecado', true, 2),
  (q1_id, 'A falta de tempo', false, 3),
  (q1_id, 'O local da oração', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Tiago 4:3 diz que não recebemos porque:', 'Tiago ensina que pedimos e não recebemos porque pedimos mal, com motivações egoístas, para gastar em nossos próprios prazeres.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Não oramos o suficiente', false, 1),
  (q2_id, 'Pedimos com motivações erradas', true, 2),
  (q2_id, 'Deus não nos ouve', false, 3),
  (q2_id, 'Não merecemos', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'A falta de perdão pode afetar nossas orações?', 'Sim, Jesus ensinou em Marcos 11:25 que devemos perdoar ao orar, para que o Pai também nos perdoe. A amargura bloqueia a oração.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Não, são coisas separadas', false, 1),
  (q3_id, 'Sim, devemos perdoar para sermos ouvidos', true, 2),
  (q3_id, 'Apenas se a pessoa pedir perdão primeiro', false, 3),
  (q3_id, 'Somente em casos graves', false, 4);
END $$;

-- ============================================
-- CURSO 3: PANORAMA BÍBLICO
-- ============================================

-- Aula: Pentateuco (ordem 2)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Pentateuco' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quantos livros compõem o Pentateuco?', 'O Pentateuco é composto por 5 livros: Gênesis, Êxodo, Levítico, Números e Deuteronômio. "Penta" significa cinco em grego.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, '3 livros', false, 1),
  (q1_id, '5 livros', true, 2),
  (q1_id, '7 livros', false, 3),
  (q1_id, '10 livros', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quem é tradicionalmente considerado o autor do Pentateuco?', 'Moisés é tradicionalmente considerado o autor dos cinco primeiros livros da Bíblia, também chamados de "Lei de Moisés" ou Torá.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Abraão', false, 1),
  (q2_id, 'Moisés', true, 2),
  (q2_id, 'Davi', false, 3),
  (q2_id, 'Samuel', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual livro do Pentateuco narra a criação do mundo?', 'Gênesis começa com o relato da criação dos céus e da terra, e continua com a história dos patriarcas.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Êxodo', false, 1),
  (q3_id, 'Gênesis', true, 2),
  (q3_id, 'Levítico', false, 3),
  (q3_id, 'Números', false, 4);

  -- Pergunta 4
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O Êxodo narra principalmente:', 'O livro de Êxodo narra a libertação do povo de Israel da escravidão no Egito sob a liderança de Moisés.', 4)
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q4_id, 'A criação do mundo', false, 1),
  (q4_id, 'A libertação de Israel do Egito', true, 2),
  (q4_id, 'A conquista de Canaã', false, 3),
  (q4_id, 'O reinado de Davi', false, 4);
END $$;

-- Aula: Livros Históricos (ordem 3)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Livros Históricos' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quem liderou Israel na conquista de Canaã após a morte de Moisés?', 'Josué foi o sucessor de Moisés e liderou o povo de Israel na conquista da Terra Prometida.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Calebe', false, 1),
  (q1_id, 'Josué', true, 2),
  (q1_id, 'Gideão', false, 3),
  (q1_id, 'Samuel', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O período dos Juízes foi caracterizado por:', 'Durante o período dos Juízes, Israel vivia um ciclo de pecado, opressão, clamor e libertação através de líderes chamados juízes.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Grande prosperidade contínua', false, 1),
  (q2_id, 'Ciclos de pecado e libertação', true, 2),
  (q2_id, 'Monarquia estável', false, 3),
  (q2_id, 'Paz com todas as nações', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quem foi o primeiro rei de Israel?', 'Saul foi o primeiro rei de Israel, ungido pelo profeta Samuel a pedido do povo (1 Samuel 10).', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Davi', false, 1),
  (q3_id, 'Saul', true, 2),
  (q3_id, 'Salomão', false, 3),
  (q3_id, 'Samuel', false, 4);
END $$;

-- Aula: Livros Poéticos (ordem 4)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Livros Poéticos' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quantos livros compõem a seção poética da Bíblia?', 'Os livros poéticos são: Jó, Salmos, Provérbios, Eclesiastes e Cantares de Salomão - totalizando 5 livros.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, '3 livros', false, 1),
  (q1_id, '5 livros', true, 2),
  (q1_id, '7 livros', false, 3),
  (q1_id, '10 livros', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quem é o principal autor do livro de Salmos?', 'O rei Davi é o principal autor dos Salmos, tendo escrito aproximadamente metade dos 150 salmos.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Salomão', false, 1),
  (q2_id, 'Davi', true, 2),
  (q2_id, 'Moisés', false, 3),
  (q2_id, 'Asafe', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O livro de Jó trata principalmente de:', 'Jó aborda o problema do sofrimento do justo, questionando por que pessoas boas sofrem e explorando a soberania de Deus.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Como ficar rico', false, 1),
  (q3_id, 'O sofrimento e a soberania de Deus', true, 2),
  (q3_id, 'A história de Israel', false, 3),
  (q3_id, 'Profecias do fim dos tempos', false, 4);
END $$;

-- Aula: Profetas Maiores (ordem 5)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Profetas Maiores' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quantos são os Profetas Maiores?', 'São 4 (ou 5 se contar Lamentações): Isaías, Jeremias, Lamentações, Ezequiel e Daniel. São chamados "maiores" pelo tamanho dos livros.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, '3', false, 1),
  (q1_id, '4 ou 5', true, 2),
  (q1_id, '7', false, 3),
  (q1_id, '12', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual profeta teve a visão do vale de ossos secos?', 'Ezequiel teve a visão do vale de ossos secos (Ezequiel 37), simbolizando a restauração de Israel.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Isaías', false, 1),
  (q2_id, 'Jeremias', false, 2),
  (q2_id, 'Ezequiel', true, 3),
  (q2_id, 'Daniel', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Isaías 53 é conhecido por profetizar sobre:', 'Isaías 53 contém a profecia do Servo Sofredor, detalhando o sofrimento vicário do Messias - cumprido em Jesus.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'A criação do mundo', false, 1),
  (q3_id, 'O sofrimento do Messias', true, 2),
  (q3_id, 'O dilúvio', false, 3),
  (q3_id, 'A construção do templo', false, 4);
END $$;

-- Aula: Evangelhos (ordem 8)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Evangelhos' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quantos evangelhos existem no Novo Testamento?', 'Existem 4 evangelhos canônicos: Mateus, Marcos, Lucas e João, cada um com perspectiva única sobre Jesus.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, '2', false, 1),
  (q1_id, '4', true, 2),
  (q1_id, '6', false, 3),
  (q1_id, '12', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual evangelho começa com "No princípio era o Verbo"?', 'O evangelho de João começa com um prólogo teológico profundo sobre a divindade de Cristo como o Verbo (Logos).', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Mateus', false, 1),
  (q2_id, 'Marcos', false, 2),
  (q2_id, 'Lucas', false, 3),
  (q2_id, 'João', true, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Os evangelhos sinóticos são:', 'Mateus, Marcos e Lucas são chamados sinóticos por terem perspectiva similar e muito material em comum.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Mateus, João e Lucas', false, 1),
  (q3_id, 'Mateus, Marcos e Lucas', true, 2),
  (q3_id, 'Marcos, Lucas e João', false, 3),
  (q3_id, 'Todos os quatro', false, 4);

  -- Pergunta 4
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual evangelista era médico?', 'Lucas era médico (Colossenses 4:14) e escreveu tanto o evangelho de Lucas quanto o livro de Atos.', 4)
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q4_id, 'Mateus', false, 1),
  (q4_id, 'Marcos', false, 2),
  (q4_id, 'Lucas', true, 3),
  (q4_id, 'João', false, 4);
END $$;

-- Aula: Atos dos Apóstolos (ordem 9)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Atos dos Apóstolos' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quem escreveu o livro de Atos?', 'Lucas, o médico, escreveu Atos como continuação de seu evangelho, ambos endereçados a Teófilo.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Paulo', false, 1),
  (q1_id, 'Lucas', true, 2),
  (q1_id, 'Pedro', false, 3),
  (q1_id, 'João', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual evento importante aconteceu em Atos 2?', 'Em Atos 2, o Espírito Santo foi derramado no dia de Pentecostes, marcando o nascimento da Igreja.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'A crucificação de Jesus', false, 1),
  (q2_id, 'O derramamento do Espírito Santo', true, 2),
  (q2_id, 'A conversão de Paulo', false, 3),
  (q2_id, 'O concílio de Jerusalém', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Paulo antes de sua conversão era conhecido como:', 'Antes da conversão, Paulo era chamado Saulo e perseguia a igreja. Seu encontro com Jesus na estrada de Damasco o transformou.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Barnabé', false, 1),
  (q3_id, 'Saulo', true, 2),
  (q3_id, 'Silas', false, 3),
  (q3_id, 'Timóteo', false, 4);
END $$;

-- Aula: Cartas Paulinas (ordem 10)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Cartas Paulinas' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quantas cartas Paulo escreveu no Novo Testamento?', 'Paulo escreveu 13 cartas: Romanos, 1-2 Coríntios, Gálatas, Efésios, Filipenses, Colossenses, 1-2 Tessalonicenses, 1-2 Timóteo, Tito e Filemom.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, '7 cartas', false, 1),
  (q1_id, '13 cartas', true, 2),
  (q1_id, '21 cartas', false, 3),
  (q1_id, '27 cartas', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual carta de Paulo é considerada sua obra-prima teológica?', 'Romanos é considerada a obra-prima de Paulo, apresentando sistematicamente a doutrina da justificação pela fé.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Gálatas', false, 1),
  (q2_id, 'Romanos', true, 2),
  (q2_id, 'Efésios', false, 3),
  (q2_id, 'Filipenses', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quais cartas Paulo escreveu da prisão?', 'As cartas da prisão são: Efésios, Filipenses, Colossenses e Filemom - escritas durante sua prisão em Roma.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Romanos e Gálatas', false, 1),
  (q3_id, 'Efésios, Filipenses, Colossenses e Filemom', true, 2),
  (q3_id, '1 e 2 Coríntios', false, 3),
  (q3_id, '1 e 2 Tessalonicenses', false, 4);
END $$;

-- Aula: Apocalipse (ordem 12)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Apocalipse' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Quem escreveu o livro de Apocalipse?', 'O apóstolo João escreveu Apocalipse enquanto estava exilado na ilha de Patmos, por volta de 95 d.C.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Paulo', false, 1),
  (q1_id, 'Pedro', false, 2),
  (q1_id, 'João', true, 3),
  (q1_id, 'Tiago', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que significa a palavra "Apocalipse"?', 'Apocalipse vem do grego "apokalypsis" que significa revelação ou desvelamento - é a revelação de Jesus Cristo.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Fim do mundo', false, 1),
  (q2_id, 'Revelação', true, 2),
  (q2_id, 'Destruição', false, 3),
  (q2_id, 'Julgamento', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Para quantas igrejas João escreve nos capítulos 2-3?', 'João escreve cartas para 7 igrejas da Ásia: Éfeso, Esmirna, Pérgamo, Tiatira, Sardes, Filadélfia e Laodiceia.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, '3 igrejas', false, 1),
  (q3_id, '7 igrejas', true, 2),
  (q3_id, '12 igrejas', false, 3),
  (q3_id, '10 igrejas', false, 4);

  -- Pergunta 4
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual é a promessa final do livro de Apocalipse?', 'Apocalipse termina com a promessa de novos céus e nova terra, onde Deus habitará com seu povo e não haverá mais morte.', 4)
  RETURNING id INTO q4_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q4_id, 'Destruição total', false, 1),
  (q4_id, 'Novos céus e nova terra', true, 2),
  (q4_id, 'Retorno ao Éden original', false, 3),
  (q4_id, 'Fim de toda existência', false, 4);
END $$;

-- Aula: Como Estudar a Bíblia (ordem 14)
DO $$
DECLARE
  lesson_id_var UUID;
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT l.id INTO lesson_id_var FROM lessons l
  JOIN courses c ON l.course_id = c.id
  WHERE l.titulo = 'Como Estudar a Bíblia' AND c.slug = 'panorama-biblico' LIMIT 1;

  -- Pergunta 1
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Qual é o primeiro passo importante para estudar a Bíblia?', 'A oração é fundamental antes do estudo, pedindo ao Espírito Santo que ilumine o entendimento das Escrituras.', 1)
  RETURNING id INTO q1_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q1_id, 'Ler comentários primeiro', false, 1),
  (q1_id, 'Orar pedindo iluminação do Espírito', true, 2),
  (q1_id, 'Escolher o livro mais curto', false, 3),
  (q1_id, 'Procurar versículos famosos', false, 4);

  -- Pergunta 2
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'O que significa interpretar a Bíblia no contexto?', 'Interpretar no contexto significa considerar o cenário histórico, cultural, literário e teológico da passagem estudada.', 2)
  RETURNING id INTO q2_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q2_id, 'Ler apenas o versículo isolado', false, 1),
  (q2_id, 'Considerar o cenário histórico e literário', true, 2),
  (q2_id, 'Aplicar diretamente ao nosso tempo', false, 3),
  (q2_id, 'Ignorar o Antigo Testamento', false, 4);

  -- Pergunta 3
  INSERT INTO questions (lesson_id, texto_pergunta, explicacao, ordem)
  VALUES (lesson_id_var, 'Por que é importante comparar Escritura com Escritura?', 'A Bíblia é seu próprio intérprete. Passagens mais claras ajudam a entender as mais difíceis, mantendo coerência doutrinária.', 3)
  RETURNING id INTO q3_id;

  INSERT INTO question_options (question_id, texto_opcao, is_correta, ordem) VALUES
  (q3_id, 'Para encontrar contradições', false, 1),
  (q3_id, 'Para manter coerência na interpretação', true, 2),
  (q3_id, 'Para decorar mais versículos', false, 3),
  (q3_id, 'Para impressionar os outros', false, 4);
END $$;
