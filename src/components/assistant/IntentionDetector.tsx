
import { type Assistant } from "@/types/assistant";

interface IntentionMatch {
  intention: string;
  response: string;
  suggestions: string[];
  tone: "formal" | "informal";
}

const intentionPatterns: Record<string, IntentionMatch[]> = {
  "financial-advisor": [
    {
      intention: "ficar rico|enriquecer|ganhar dinheiro|fazer dinheiro",
      response: "Entendo que você quer construir riqueza! Isso é um excelente objetivo. Para começar, vou sugerir algumas estratégias comprovadas: primeiro, estabeleça uma reserva de emergência, depois comece a investir regularmente em uma carteira diversificada. O segredo está na consistência e no tempo - pequenos investimentos mensais podem se transformar em grandes fortunas com o poder dos juros compostos.",
      suggestions: [
        "Como começar a investir com pouco dinheiro?",
        "Qual o primeiro passo para construir riqueza?",
        "Me mostre estratégias de investimento para longo prazo"
      ],
      tone: "formal"
    },
    {
      intention: "ficar podre de rico|ganhar uma grana|fazer uma bolada|descolar uma bufunfa",
      response: "E aí! Querendo fazer chover dinheiro, né? Boa! Pra começar essa jornada, a gente pode bolar umas paradas espertas: primeiro, junta uma grana pra qualquer perrengue, depois bora investir um pouquinho todo mês em paradas diferentes. O lance é não parar e deixar o tempo fazer a mágica dele!",
      suggestions: [
        "Qual a boa pra investir sem ter muita grana?",
        "Primeiro passo pra ficar rico, qual é?",
        "Me dá umas ideias de investimento daora pra daqui a um tempo"
      ],
      tone: "informal"
    },
    {
      intention: "quero nadar na grana|como descolar uma bufunfa monstra|quero me dar bem financeiramente",
      response: "Opa! Então a meta é encher o bolso? Curti! Se liga na ideia: guarda um troco pra não passar aperto e depois vai botando uma graninha em uns negócios variados todo mês. Com jeitinho e sem pressa, o resultado vem!",
      suggestions: [
        "Como invisto com pouca bufunfa?",
        "Qual o esquema pra começar a juntar dinheiro?",
        "Mostra aí uns investimentos bacanas pra longo prazo."
      ],
      tone: "informal"
    },
    {
      intention: "tô querendo juntar uma dinheirama|como faço pra ter mais money|quero ficar com os bolsos forrados",
      response: "Demorou! Quer forrar os bolsos, né? Vamos nessa! O bagulho é o seguinte: primeiro, faz uma reserva pra qualquer imprevisto. Depois, vai aplicando uma parte da sua grana em coisas diferentes, tipo um pouquinho aqui, um pouquinho ali. A parada é ter paciência e ser constante, que nem tartaruga!",
      suggestions: [
        "Com quanto de grana já dá pra começar a investir?",
        "Qual a primeira coisa pra fazer pra juntar uma bolada?",
        "Me fala uns investimentos que rendem bem depois de um tempo."
      ],
      tone: "informal"
    },
    {
      intention: "comprar casa|comprar imóvel|financiar casa|casa própria",
      response: "Ótimo objetivo! Comprar uma casa é um dos maiores investimentos da vida. Vamos criar um plano personalizado para você: primeiro, calcule quanto você pode dar de entrada (idealmente 20% do valor), depois organize suas finanças para conseguir uma boa taxa de financiamento. Também é importante considerar todos os custos extras como documentação, ITBI e reformas.",
      suggestions: [
        "Quanto preciso juntar para dar entrada numa casa?",
        "Como melhorar meu score para conseguir bom financiamento?",
        "Quais são todos os custos para comprar uma casa?"
      ],
      tone: "formal"
    },
    {
      intention: "comprar minha casinha|descolar um cantinho|ter meu cafofo",
      response: "Aí sim! Ter o próprio cafofo é um sonho massa. Bora botar no papel: primeiro, vê quanto você consegue juntar pra entrada (uns 20% do valor seria show), depois dá um talento nas contas pra pegar um financiamento bacana. Fica de olho também nas paradas extras tipo papelada, imposto e aquela reforminha básica.",
      suggestions: [
        "Quanto de grana preciso pra entrada da casa?",
        "Como faço pra ter um nome limpo e pegar financiamento?",
        "Quais as taxas e tretas na hora de comprar uma casa?"
      ],
      tone: "informal"
    },
    {
      intention: "sonho com meu barraquinho|quero um lugar pra chamar de meu|como consigo minha morada",
      response: "Fechou! Ter o seu próprio cantinho é demais. Saca só o plano: junta uma grana pra dar de entrada, o ideal é uns 20% do valor do imóvel. Aí, organiza suas contas pra conseguir um financiamento com juros baixos. Não esquece dos gastos por fora, tipo documento, imposto e talvez uma pintura nova.",
      suggestions: [
        "Quanto preciso ter pra dar o pontapé inicial na casa?",
        "Como deixo meu nome na praça pra financiar de boa?",
        "Quais são os perrengues de grana ao comprar um cafofo?"
      ],
      tone: "informal"
    },
    {
      intention: "comprar carro|trocar carro|financiar carro",
      response: "Vejo que você quer adquirir um veículo! Vamos pensar estrategicamente: considere se é melhor comprar à vista, financiar ou fazer um consórcio. Analise também se um carro usado em bom estado não atenderia suas necessidades com melhor custo-benefício. Lembre-se de incluir no orçamento seguro, IPVA, manutenção e combustível.",
      suggestions: [
        "É melhor financiar ou comprar à vista?",
        "Como calcular o custo total de ter um carro?",
        "Consórcio vale a pena?"
      ],
      tone: "formal"
    },
    {
      intention: "pegar um possante|comprar um carango|descolar um automóvel",
      response: "Opa! Querendo um carro novo na garagem, hein? Vamos pensar com a cabeça: será que vale mais a pena pagar tudo de uma vez, entrar num financiamento ou fazer um consórcio? E que tal um usadinho filé, já pensou? Não esquece de botar na conta o seguro, IPVA, as revisões e a gasosa.",
      suggestions: [
        "Financiar ou pagar à vista, qual a melhor?",
        "Quanto custa ter um carro no final das contas?",
        "Consórcio é uma boa?"
      ],
      tone: "informal"
    },
    {
      intention: "quero uma nave|tô a fim de uma máquina|como faço pra ter meu bruto",
      response: "Massa! Um carro na mão é liberdade, né? Mas se liga: antes de acelerar, pensa se é melhor quitar de uma vez, parcelar ou entrar num grupo de consórcio. Um seminovo inteirão também pode ser uma boa, viu? E lembra de separar a grana do seguro, dos impostos e da gasolina!",
      suggestions: [
        "Qual a melhor forma de pagar um carro: tudo de uma vez ou parcelado?",
        "Quanto vou gastar de verdade com um carro todo mês?",
        "Vale a pena entrar em consórcio pra pegar um carro?"
      ],
      tone: "informal"
    },
    {
      intention: "viajar|fazer viagem|conhecer lugares",
      response: "Que sonho maravilhoso! Viajar é um investimento em experiências. Vamos criar um plano financeiro para sua viagem: defina o destino e calcule todos os custos (passagem, hospedagem, alimentação, passeios), depois estabeleça uma meta mensal de economia. Uma dica: pesquise épocas mais baratas e considere programas de milhas.",
      suggestions: [
        "Como economizar para uma viagem internacional?",
        "Qual a melhor forma de usar milhas aéreas?",
        "Como planejar financeiramente uma viagem?"
      ],
      tone: "formal"
    },
    {
      intention: "botar o pé na estrada|turistar por aí|zarpar",
      response: "Boa! Viajar é tudo de bom. Bora fazer um plano pra essa trip: escolhe o pico, calcula os gastos (passagem, onde ficar, rango, rolês), e aí define uma meta pra guardar uma grana todo mês. Dica de ouro: fica de olho nas épocas mais em conta e usa aquelas milhas espertas.",
      suggestions: [
        "Como juntar grana pra uma viagem pra gringa?",
        "Qual o bizu pra usar milhas e viajar de boa?",
        "Me ajuda a organizar a grana pra viajar?"
      ],
      tone: "informal"
    },
    {
      intention: "quero dar um rolê pelo mundo|conhecer uns picos diferentes|partiu explorar",
      response: "Demorou! Explorar o mundão é demais. Se liga no esquema: decide pra onde quer ir, levanta quanto vai custar tudo (aéreo, hotel, comida, passeios) e depois faz um plano pra juntar a grana. Fica esperto com promoção de passagem e usa milhas, que ajuda um monte!",
      suggestions: [
        "Como faço pra guardar dinheiro pra viajar pra fora?",
        "Qual a manha de usar milhas pra economizar na viagem?",
        "Me dá umas dicas pra planejar uma viagem sem estourar o orçamento."
      ],
      tone: "informal"
    },
    {
      intention: "aposentar|aposentadoria|parar de trabalhar|independência financeira",
      response: "Excelente pensamento de longo prazo! A aposentadoria confortável requer planejamento. Vamos calcular quanto você precisa: a regra geral é ter 25 vezes seus gastos anuais investidos. Comece contribuindo para a previdência privada e investindo em uma carteira diversificada. Quanto antes começar, menor será o valor mensal necessário.",
      suggestions: [
        "Quanto preciso para me aposentar?",
        "Previdência privada vale a pena?",
        "Como calcular minha aposentadoria ideal?"
      ],
      tone: "formal"
    },
    {
      intention: "pendurar as chuteiras|viver de renda|sossegar o facho",
      response: "Aí sim, pensando no futuro! Pra curtir a vida adoidado sem se preocupar com boleto, o esquema é planejar. A conta básica é ter 25 vezes o que você gasta no ano guardado e rendendo. Começa a botar uma grana na previdência e a investir em várias paradas diferentes. Quanto mais cedo começar, mais suave vai ser!",
      suggestions: [
        "Quanta grana preciso pra parar de trampar?",
        "Previdência privada é uma boa mesmo?",
        "Como calculo quanto preciso pra viver de boa?"
      ],
      tone: "informal"
    },
    {
      intention: "quero viver de boa sem trampar|parar de bater cartão|alcançar a liberdade financeira",
      response: "Maneiro! Sonho de consumo de muito mortal é largar o batente e viver de boa. A parada é juntar uma bolada que seja tipo 25 vezes o que você gasta num ano. Começa investindo numa previdência e em outros esquemas variados. Quanto antes, melhor pra não precisar de um montão por mês.",
      suggestions: [
        "Quanto de bufunfa preciso pra dizer 'chega' pro chefe?",
        "Vale a pena mesmo botar grana em previdência privada?",
        "Como faço a conta pra saber quanto preciso pra viver de renda?"
      ],
      tone: "informal"
    }
  ],
  "budget-assistant": [
    {
      intention: "economizar|poupar|gastar menos|cortar gastos",
      response: "Ótima intenção! Vou te ajudar a identificar onde você pode economizar sem perder qualidade de vida. Primeiro, vamos analisar seus gastos dos últimos 3 meses para encontrar padrões. Depois, aplicaremos a regra 50-30-20: 50% para necessidades, 30% para desejos e 20% para poupança. Pequenas mudanças podem gerar grandes economias!",
      suggestions: [
        "Onde posso cortar gastos sem afetar minha qualidade de vida?",
        "Como aplicar a regra 50-30-20 no meu orçamento?",
        "Me ajude a identificar gastos desnecessários"
      ],
      tone: "formal"
    },
    {
      intention: "apertar o cinto|segurar a grana|dar uma maneirada nos gastos",
      response: "É isso aí! Bora dar um jeito nessa gastança. Primeiro, vamos dar uma olhada nos seus gastos dos últimos 3 meses pra ver onde o dinheiro tá indo. Depois, a gente usa a manha do 50-30-20: metade pra o que precisa, um tanto pra o que quer e o resto pra guardar. Qualquer troquinho economizado já faz uma diferença!",
      suggestions: [
        "Onde dá pra cortar gasto sem sofrer?",
        "Como uso essa regra do 50-30-20 na minha vida?",
        "Me mostra onde tô gastando sem precisar?"
      ],
      tone: "informal"
    },
    {
      intention: "quero que sobre mais grana|como faço pra gastar menos e juntar um troco|preciso fechar a torneira",
      response: "Boa! Fazer a grana render mais é o caminho. Vamos dar uma geral nos seus gastos recentes pra sacar onde dá pra economizar. Depois, a gente pode usar o esquema 50-30-20: uma parte pras contas, outra pro lazer e o resto pra poupar. Até as moedinhas fazem a diferença no final!",
      suggestions: [
        "Como economizo sem abrir mão de tudo que gosto?",
        "Me explica esse lance de 50-30-20.",
        "Me ajuda a ver onde tô torrando dinheiro à toa."
      ],
      tone: "informal"
    },
    {
      intention: "controlar gastos|organizar dinheiro|fazer orçamento",
      response: "Perfeito! Organizar as finanças é o primeiro passo para o sucesso financeiro. Vamos criar um sistema simples: categorize todos seus gastos, defina limites para cada categoria e acompanhe semanalmente. Use a regra: toda compra acima de R$ 100 deve ser pensada por 24 horas antes de decidir.",
      suggestions: [
        "Como criar um orçamento que funciona?",
        "Qual app ou método usar para controlar gastos?",
        "Como definir limites para cada categoria de gasto?"
      ],
      tone: "formal"
    },
    {
      intention: "botar as contas em dia|dar um jeito na bagunça financeira|organizar minha grana",
      response: "Show de bola! Organizar a grana é o segredo. Bora fazer assim: anota tudo que você gasta, separa por tipo, bota um limite pra cada um e dá uma olhada toda semana. E ó, se for comprar algo acima de 100 conto, pensa um dia inteiro antes de bater o martelo.",
      suggestions: [
        "Como faço um orçamento que eu consiga seguir?",
        "Qual o melhor jeito de anotar meus gastos, app ou caderno?",
        "Como saber o limite de grana pra cada coisa?"
      ],
      tone: "informal"
    },
    {
      intention: "preciso de um help pra organizar as finanças|minha vida financeira tá um caos|como ponho ordem no meu dinheiro",
      response: "Relaxa que eu te ajudo a sair dessa! Deixar as contas nos trinques é mais fácil do que parece. O lance é anotar todo gasto, separar por caixinha (tipo 'casa', 'comida', 'lazer'), definir um teto pra cada uma e conferir toda semana. E uma dica de ouro: compra grande, só depois de pensar um dia inteiro!",
      suggestions: [
        "Me ensina a fazer um orçamento sem complicação.",
        "É melhor usar app ou planilha pra controlar a grana?",
        "Como defino quanto posso gastar com cada parada?"
      ],
      tone: "informal"
    }
  ]
};

// Simple list of informal triggers to check first.
// This could be expanded with more sophisticated NLP in the future.
const informalTriggers = [
  "grana", "bufunfa", "chover dinheiro", "paradas espertas", "perrengue", "daora", 
  "casinha", "cantinho", "cafofo", "massa", "show", "bacana", "papelada", "tretas",
  "possante", "carango", "automóvel", "hein", "filé", "gasosa",
  "botar o pé na estrada", "turistar por aí", "zarpar", "trip", "pico", "rango", "rolês", "bizu", "pra gringa",
  "pendurar as chuteiras", "viver de renda", "sossegar o facho", "adoidado", "boleto", "trampar",
  "apertar o cinto", "segurar a grana", "dar uma maneirada", "gastança", "manha", "troquinho",
  "botar as contas em dia", "dar um jeito na bagunça financeira", "organizar minha grana", "conto"
];

export const detectIntention = (message: string, assistantId: string): IntentionMatch | null => {
  const lowerMessage = message.toLowerCase();
  const patterns = intentionPatterns[assistantId] || [];

  // Separate patterns by tone
  const informalPatterns = patterns.filter(p => p.tone === 'informal');
  const formalPatterns = patterns.filter(p => p.tone === 'formal');

  // Check for general informal triggers in the message OR specific informal intention patterns
  const isInformalQuery = informalTriggers.some(trigger => lowerMessage.includes(trigger.toLowerCase()));

  // Prioritize informal patterns if informal triggers are present or if an informal intention is directly matched
  if (isInformalQuery) {
    for (const pattern of informalPatterns) {
      const regex = new RegExp(pattern.intention, 'i');
      if (regex.test(lowerMessage)) {
        return pattern;
      }
    }
  }

  // Try to match specific informal patterns even if no general informal trigger was found
  for (const pattern of informalPatterns) {
    const regex = new RegExp(pattern.intention, 'i');
    if (regex.test(lowerMessage)) {
      return pattern;
    }
  }

  // Fallback to formal patterns
  for (const pattern of formalPatterns) {
    const regex = new RegExp(pattern.intention, 'i');
    if (regex.test(lowerMessage)) {
      return pattern;
    }
  }
  
  return null;
};
