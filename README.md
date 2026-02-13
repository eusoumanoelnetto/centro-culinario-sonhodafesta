<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16GoLjbK99EE4-L9Pkmu2i55m-6y9SATr

## Run Locally

**Prerequisites:**  Node.js 20+

1. Install dependencies: `npm install`
2. Create a `.env.local` file containing `GEMINI_API_KEY=seu_token` (opcionalmente use `VITE_GEMINI_API_KEY` se preferir o padrão Vite)
3. Execute o projeto: `npm run dev`

Sem chave de API, o chat Nina funciona em modo offline exibindo uma mensagem informativa.

## Deploy automático no GitHub Pages

1. Faça push do código para o branch `main` do repositório `centro-culinario-sonhodafesta` no GitHub.
2. Habilite **GitHub Pages** para usar a origem **GitHub Actions** em *Settings → Pages*.
3. Toda vez que houver push no `main`, o workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) irá compilar (`npm run build`) e publicar o conteúdo de `dist` no ambiente GitHub Pages.

> Dica: Caso deseje usar uma chave de API no ambiente de produção, configure o segredo `GEMINI_API_KEY` no repositório e ajuste o workflow para expor a variável durante o build.
