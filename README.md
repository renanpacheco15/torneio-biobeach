# Torneio BioBeach Live

Sistema web para operação ao vivo do Torneio BioBeach, transformando as súmulas oficiais em controle digital com ranking em tempo real no navegador.

## Rotas

- `/` - acesso rápido para operação.
- `/atleta` - tela pública para atletas acompanharem grupo, jogos e ranking.
- `/tabela` e `/mata-mata` - central pública com oitavas, quartas, semifinais e grande final.
- `/oitavas` - confrontos das oitavas de final.
- `/quartas` - confrontos das quartas de final.
- `/semifinais` - confrontos das semifinais.
- `/final` - tela premium da grande final.
- `/mesario/1` até `/mesario/8` - lançamento de resultados por quadra.
- `/admin/master` - painel central com trava, correções, nomes, backup e logs.
- `/telao` - visual 16:9 para exibição no evento.

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois abra:

```text
http://localhost:3000
```

## Dados e regras

O projeto já vem com:

- 8 grupos oficiais.
- 40 duplas oficiais.
- 10 jogos por grupo na ordem de descanso informada.
- Cálculo automático de J, V, D, PF, PC, saldo e aproveitamento.
- Classificação por vitórias, saldo, pontos feitos, pontos sofridos, confronto direto e decisão manual do admin.
- Chaveamento preparado para oitavas, quartas, semifinais e final.
- Mata-mata digital com placares, status e avanço por vencedor.

## Operação

### Mesário

O mesário acessa `/mesario/[numero]`, por exemplo `/mesario/4`.

Ele pode:

- iniciar jogo;
- lançar placar;
- finalizar jogo;
- corrigir placar;
- acompanhar ranking parcial.

O sistema valida placar vazio, número negativo e empate.

### Admin

O admin acessa `/admin/master`.

Ele pode:

- travar ou destravar lançamentos dos mesários;
- corrigir resultados;
- editar nomes;
- exportar backup JSON;
- importar backup JSON;
- resetar resultados;
- acompanhar logs;
- ajustar desempate manual.

### Atleta

O atleta acessa `/atleta`, escolhe o grupo e pode buscar a própria dupla.

### Telão

O telão acessa `/telao`.

Ele alterna automaticamente os grupos a cada 10 segundos e mostra ranking, classificados, últimos resultados, próximos jogos e contador geral.

## Armazenamento

Nesta versão, os dados ficam no `localStorage` do navegador.

Também há sincronização entre abas usando `BroadcastChannel`, então uma aba de mesário, admin, atleta e telão no mesmo navegador atualizam juntas.

Para usar em vários dispositivos ao mesmo tempo, a estrutura já separa o armazenamento em `src/lib/tournament/store.ts`. Esse arquivo pode ser trocado futuramente por:

- Supabase Realtime;
- Firebase;
- API própria com WebSocket.

## Deploy na Vercel

1. Suba o projeto para um repositório Git.
2. Importe o repositório na Vercel.
3. Use o preset Next.js.
4. Build command: `npm run build`.
5. Output padrão do Next.js.

Observação: com `localStorage`, cada dispositivo mantém seus próprios dados. Para operação real multi-dispositivo, conectar Supabase/Firebase antes do evento.
