# MulitaMiner · Laboratório de IA Aplicada

Página do projeto desenvolvido na disciplina Laboratório de IA Aplicada
(UNIPAMPA, 2026) por Beatriz Machado, Cristhian Kapelinski e Guilherme
Klauberg. Publicada pelo GitHub Pages a partir deste repositório.

## A ferramenta

Scanners de vulnerabilidade (OpenVAS, Nessus, Qualys, ZAP) entregam o
resultado como um relatório em PDF, cada um com seu layout e seu vocabulário.
Para consolidar, comparar ou priorizar os achados de várias ferramentas, alguém
precisa ler e transcrever à mão.

O MulitaMiner lê o PDF e devolve um registro por achado, num esquema único
(nome, severidade, host, porta, protocolo, descrição, solução, impacto,
referências e origem), pronto para planilha, SARIF, CSAF ou DefectDojo. O
pipeline tem cinco etapas e só uma delas usa um modelo de linguagem:

1. **Ler**: o texto sai do PDF sem OCR; cabeçalhos e quebras de página são
   removidos.
2. **Segmentar**: uma configuração por scanner diz onde cada achado começa.
   O resultado é um bloco por achado, com id fixo, antes de qualquer chamada
   ao modelo.
3. **Extrair**: os blocos vão ao modelo em lotes, com um esquema JSON; a
   resposta só vale se devolver os mesmos ids.
4. **Consolidar**: severidade e CVSS normalizados, duplicatas fundidas.
5. **Exportar**: JSON, XLSX, CSV, SARIF, CSAF ou DefectDojo.

O modelo é trocável. Pode ser um serviço em nuvem ou um modelo pequeno rodando
numa GPU da própria organização, para que o relatório, que descreve a
superfície de ataque da rede, não saia dela. O projeto da disciplina compara os
dois caminhos e um terceiro: o mesmo modelo pequeno ajustado com exemplos
gerados automaticamente, pareando o PDF com a planilha que o próprio scanner
exporta. Um scanner novo entra com um arquivo JSON e um prompt, sem mudar
código.

Código da ferramenta: <https://github.com/INARI18/MulitaMiner2>.
Modelo ajustado: <https://huggingface.co/Inari18/mulita-extractor-qwen2.5-1.5b>.

## Este repositório

Site estático, sem etapa de build. Para ver localmente, abra `index.html` no
navegador.

- `index.html`: a página, em português; o inglês vem de `assets/app.js`
- `assets/style.css`: estilos, tema claro e escuro
- `assets/app.js`: troca de idioma e de tema, gráficos em SVG
- `assets/stages/`: ilustrações das etapas do pipeline
- `pdfs/`: as apresentações entregues na disciplina (tarefas 4 a 10)

Para atualizar uma apresentação, substitua o PDF em `pdfs/` mantendo o nome.
