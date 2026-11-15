# Registro → Entrada - Saída

App de registro de entrada e saída de estudantes, com leitura de crachá no portão (leitor USB, câmera ou nome).

- Abra no celular: https://diashildebrando-hue.github.io/entrada-saida/
- No Android, use o menu do navegador → **Instalar app** / **Adicionar à tela inicial**.
- A lista de alunos e as fotos ficam em `dados.bin` e `fotos.bin`, **cifradas** (AES-256, chave derivada de senha). Sem a senha, os arquivos não mostram nada. Depois de digitar a senha, os dados ficam guardados só naquele aparelho.
- `versao.json` só diz qual é a versão da lista (sem nenhum dado de aluno). Quando ela muda, o app avisa e pede a senha para atualizar o aparelho.
