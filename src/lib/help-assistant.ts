export const helpSuggestions = [
  "Como funciona a análise?",
  "Preciso enviar uma foto?",
  "Como recebo as recomendações?",
  "Como meus dados são usados?",
] as const;

const helpTopics = [
  {
    keywords: ["funciona", "análise", "analise", "começar", "comecar", "usar", "passo"],
    reply:
      "A experiência começa em “Analisar minha pele”. Você responde algumas perguntas sobre sensibilidade, rotina e preferências. Quando a etapa de foto estiver disponível, ela ajudará a observar sinais visuais. Ao final, a D’Accord organiza tudo em uma curadoria explicada.",
  },
  {
    keywords: ["foto", "câmera", "camera", "imagem", "rosto"],
    reply:
      "A foto será uma etapa opcional e guiada. Use luz natural, fique de frente para a câmera e evite filtros ou maquiagem intensa. Você poderá continuar pelo questionário quando não quiser enviar uma imagem.",
  },
  {
    keywords: ["recomendação", "recomendacao", "produto", "resultado", "curadoria", "preço", "preco"],
    reply:
      "Depois da análise, você recebe produtos organizados por compatibilidade, motivo da indicação, textura, função e faixa de preço. A recomendação é cosmética e sempre explica por que cada item pode fazer sentido para a sua rotina.",
  },
  {
    keywords: ["dados", "privacidade", "seguro", "segurança", "armazen", "excluir"],
    reply:
      "A D’Accord foi desenhada para solicitar apenas os dados necessários para a experiência. Antes de qualquer envio de foto, a tela informará como ela será usada e oferecerá os controles disponíveis. Você também pode consultar a página de privacidade.",
  },
  {
    keywords: ["dermatologista", "médico", "medico", "diagnóstico", "diagnostico", "doença", "doenca"],
    reply:
      "A D’Accord oferece orientação cosmética e não realiza diagnóstico médico. Para sintomas persistentes, lesões, dor ou dúvidas clínicas, procure uma pessoa dermatologista.",
  },
] as const;

export function answerHelpQuestion(message: string) {
  const normalizedMessage = message
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

  const topic = helpTopics.find(({ keywords }) =>
    keywords.some((keyword) =>
      normalizedMessage.includes(
        keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR"),
      ),
    ),
  );

  return (
    topic?.reply ??
    "Posso ajudar com o início da análise, envio de foto, recomendações, produtos e privacidade. Escolha uma sugestão abaixo ou descreva em qual etapa você encontrou dificuldade."
  );
}
