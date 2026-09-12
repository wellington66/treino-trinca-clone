const app = document.getElementById('app');
const backBtn = document.getElementById('backBtn');
const progressWrap = document.getElementById('progressWrap');
const progressBar = document.getElementById('progressBar');

const state = {
  step: 0,
  answers: {},
};

// ---- Quiz definition ----
const questions = [
  { key: 'idade', title: 'Qual é a sua idade?', options: ['18 a 24 anos', '25 a 34 anos', '35 a 44 anos', '45 a 54 anos', '55 anos+'] },
  { key: 'objetivo', title: 'O que mais pretente alcançar com o Treino Trinca?', options: ['Corpo estético e funcional', 'Ficar com mais disposição e energia', 'Aumentar testosterona e líbido', 'Ficar mais forte'] },
  { key: 'fisico', title: 'E qual é seu fisico atual?', options: ['Magro', 'Falso Magro', 'Atlético', 'Sobremepeso', 'Obeso'] },
  { key: 'treina', title: 'Você já treina?', options: ['Sim', 'Não'] },
  { key: 'tempo', title: 'Quanto tempo você consegue dedicar ao treino por dia?', options: ['Menos de 30 minutos', 'Entre 30 e 50 minutos', 'Entre 50 minutos e 1 hora', '+1 hora'] },
  { key: 'impacto', title: 'Você já viu algo que nem o treino trinca, que com 3 dias por semana te faz perder gordura e ganhar massa muscular de maneira NATURAL?', options: ['Primeira vez!', 'Fiquei impressionado!', 'Não tinha visto…'] },
];

const totalSteps = questions.length + 2; // + altura + peso

function setProgress(pct) {
  progressWrap.hidden = false;
  progressBar.style.setProperty('--pct', pct + '%');
}

function hideProgress() {
  progressWrap.hidden = true;
}

function render() {
  window.scrollTo(0, 0);
  backBtn.hidden = state.step === 0;
  app.innerHTML = '';

  if (state.step === 0) return renderIntro();
  const qIndex = state.step - 1;

  if (qIndex < questions.length) {
    setProgress(Math.round((state.step / totalSteps) * 100));
    return renderQuestion(questions[qIndex]);
  }
  if (qIndex === questions.length) {
    setProgress(Math.round((state.step / totalSteps) * 100));
    return renderSlider('altura', 'Agora me diz.. Qual é a sua altura?', 'Vamos criar seu plano personalizado!', 'cm', 140, 210, 180);
  }
  if (qIndex === questions.length + 1) {
    setProgress(Math.round((state.step / totalSteps) * 100));
    return renderSlider('peso', 'Qual é seu peso atual?', 'Vamos criar seu plano personalizado!', 'kg', 45, 150, 80);
  }
  if (qIndex === questions.length + 2) {
    hideProgress();
    return renderLoading();
  }
  if (qIndex === questions.length + 3) {
    setProgress(95);
    return renderGraph();
  }
  hideProgress();
  return renderSales();
}

function goNext() {
  state.step++;
  render();
}

function goBack() {
  if (state.step === 0) return;
  state.step--;
  render();
}

backBtn.addEventListener('click', goBack);

// ---- Screens ----

function renderIntro() {
  hideProgress();
  app.innerHTML = `
    <h1>Conquiste um Shape Forte e Estético com o Treino Trinca!</h1>
    <div class="hero-wrap">
      <img src="public/hero.jpg" alt="Imagem" class="hero-img" />
    </div>
    <button class="btn" id="startBtn">INICIAR MEU TESTE AGORA!</button>
  `;
  document.getElementById('startBtn').addEventListener('click', goNext);
}

function renderQuestion(q) {
  const list = document.createElement('div');
  list.innerHTML = `<h2>${q.title}</h2><div class="option-list"></div>`;
  const optionList = list.querySelector('.option-list');
  q.options.forEach(opt => {
    const el = document.createElement('div');
    el.className = 'option';
    el.innerHTML = `<span>${opt}</span><span class="chevron">&#8250;</span>`;
    el.addEventListener('click', () => {
      state.answers[q.key] = opt;
      el.classList.add('selected');
      setTimeout(goNext, 250);
    });
    optionList.appendChild(el);
  });
  app.appendChild(list);
}

function renderSlider(key, title, subtitle, unit, min, max, def) {
  const value = state.answers[key] || def;
  app.innerHTML = `
    <h2>${title}</h2>
    <p class="subtitle">${subtitle}</p>
    <div class="unit-toggle">
      <button class="active" type="button">${unit}</button>
      <button type="button" disabled style="opacity:.4;cursor:not-allowed">${unit === 'cm' ? 'pol' : 'lb'}</button>
    </div>
    <div class="slider-value"><span id="sliderNum">${value}</span><span>${unit}</span></div>
    <input type="range" id="sliderInput" min="${min}" max="${max}" value="${value}" />
    <div class="slider-labels"><span>${min}</span><span>${Math.round((min+max)/2)}</span><span>${max}</span></div>
    <button class="btn" id="continueBtn">Continuar</button>
  `;
  const input = document.getElementById('sliderInput');
  const num = document.getElementById('sliderNum');
  input.addEventListener('input', () => { num.textContent = input.value; });
  document.getElementById('continueBtn').addEventListener('click', () => {
    state.answers[key] = input.value;
    goNext();
  });
}

function renderLoading() {
  app.innerHTML = `
    <div class="loading-wrap">
      <p class="loading-title">Carregando suas respostas….</p>
      <div class="loading-bar-label"><span>Carregando...</span><span id="pctLabel">0%</span></div>
      <div class="loading-bar-track"><div class="loading-bar-fill" id="loadFill"></div></div>
    </div>
  `;
  const fill = document.getElementById('loadFill');
  const label = document.getElementById('pctLabel');
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 18 + 8;
    if (pct >= 100) {
      pct = 100;
      clearInterval(iv);
      setTimeout(goNext, 500);
    }
    fill.style.width = pct + '%';
    label.textContent = Math.round(pct) + '%';
  }, 250);
}

function renderGraph() {
  app.innerHTML = `
    <h2 class="graph-title">VAMOS TE AJUDAR A ALCANÇAR <mark>${estimateGoalWeight()}kg NO MENOR TEMPO POSSÍVEL!</mark></h2>
    <div class="graph-box">
      <svg viewBox="0 0 300 200" width="100%">
        <line x1="20" y1="10" x2="20" y2="180" stroke="#eee"/>
        <line x1="20" y1="180" x2="290" y2="180" stroke="#eee"/>
        <polyline points="20,150 150,90 280,20" fill="none" stroke="#bbb" stroke-width="3"/>
        <polyline points="20,150 150,120 280,40" fill="none" stroke="#ffb020" stroke-width="3"/>
        <circle cx="20" cy="150" r="5" fill="#e05a4e"/>
        <circle cx="150" cy="90" r="5" fill="#bbb"/>
        <circle cx="280" cy="20" r="5" fill="#7fd39a"/>
        <circle cx="150" cy="120" r="5" fill="#ffb020"/>
      </svg>
      <div class="slider-labels"><span>Ontem</span><span>Hoje</span><span>Amanhã</span></div>
    </div>
    <button class="btn" id="continueBtn" style="margin-top:24px">Continuar</button>
  `;
  document.getElementById('continueBtn').addEventListener('click', goNext);
}

function estimateGoalWeight() {
  const peso = parseInt(state.answers.peso || 80, 10);
  return Math.max(peso - 6, 55);
}

// ---- Sales page ----

function renderSales() {
  app.innerHTML = `
    <div class="section">
      <h2>SEU PLANO INDIVIDUAL DO <span class="accent" style="color:#3b7cf0">TREINO TRINCA</span> ESTÁ PRONTO!</h2>
      <div class="before-after">
        <img src="public/hero.jpg" alt="Antes" />
        <img src="public/hero.jpg" alt="Depois" style="filter:saturate(1.3) contrast(1.1)" />
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">O QUE VOCÊ VAI RECEBER DENTRO DO <span class="accent">APLICATIVO</span> DO DESAFIO?</h3>
      <div class="benefit-card">
        <h3>✅ 3 TREINOS METABÓLICOS</h3>
        <p>Cada treino é bem fácil, com versões adaptadas se você nunca treinou antes. É só seguir.</p>
      </div>
      <div class="benefit-card">
        <h3>✅ CARDÁPIO METABÓLICO COMPLETO DOS 7 DIAS!</h3>
        <p>Café da manhã, almoço, janta (e até sobremesa) já estão prontos pra você, com receitas gostosas, flexíveis e rápidas de fazer usando o que você já tem em casa.</p>
      </div>
      <div class="benefit-card">
        <h3>✅ APLICATIVO TREINO TRINCA (ACESSO VITALÍCIO)</h3>
        <p>Acesse tudo na palma da sua mão, sem precisar ficar pagando mensalidade.</p>
      </div>
      <div class="benefit-card">
        <h3>✅ PLANILHA DE ACOMPANHAMENTO</h3>
        <p>Veja seu antes, durante e depois, e veja a sua evolução a cada dia, que é a melhor forma de ficar motivado!</p>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">E SE EU TIVER PERGUNTAS DURANTE O DESAFIO?</h3>
      <div class="benefit-card support">
        <h3>✅ GRUPO VIP NO WHATSAPP</h3>
        <p>Você nunca ficará sozinho! Tem uma comunidade inteira de homens fazendo o desafio juntos com você, e suporte da minha equipe todos os dias te ajudando! Se tiver perguntas, é só abrir o grupo e pedir ajuda. Estou com você do início ao fim!</p>
      </div>
    </div>

    <div class="promo-photo"><img src="public/hero.jpg" alt="Treino Trinca"/></div>

    <div class="section">
      <p class="promo-title"><span class="hl">Em Comemoração</span> aos 600 mil Seguidores no Instagram! 🥳</p>
      <p style="text-align:center">Para marcar esse momento, o Desafio Treino Trinca está com uma <strong>oferta especial só nesta semana.</strong></p>
      <p class="promo-price">De <span class="old">R$ 97,00</span> por apenas <span class="new">R$29,90!</span></p>
      ${couponBox()}
    </div>

    <div class="section">
      <h3 class="section-title">OLHA O QUE ACONTECEU COM QUEM PARTICIPOU DO DESAFIO:</h3>
      <div class="testimonial-img"><img src="public/hero.jpg" alt="Depoimento"/></div>
      <div class="testimonial-img"><img src="public/hero.jpg" alt="Depoimento"/></div>
    </div>

    <div class="section">
      <h3 class="section-title">ESSA SERÁ SUA JORNADA NOS PRÓXIMOS 7 DIAS!</h3>
      ${journeyItem('DIA 1-6', 'Desinchar visível')}
      ${journeyItem('DIA 6-10', 'A Definição Começa')}
      ${journeyItem('DIA 10-14', 'Músculos mais fortes')}
      ${journeyItem('DIA 14-21', 'Você se torna irreconhecível')}
    </div>

    <div class="section">
      <p style="text-align:center;font-weight:700">Você já parou pra pensar quanto já gastou tentando secar e ganhar músculo?</p>
      <ul class="cost-list">
        <li><span>🏋️‍♂️ Academia + personal trainer</span><strong>R$ 400</strong></li>
        <li><span>🥗 Dietas e alimentação</span><strong>R$ 300</strong></li>
        <li><span>🥛 Suplementos</span><strong>R$ 3.000</strong></li>
      </ul>
      <div class="price-highlight">
        <div class="label">Desafio Treino Trinca:</div>
        <div class="value">R$ 29,90</div>
      </div>
      <p class="italic-note">Pelo valor de uma pizza, você pode investir em um método natural, validado e que entrega um resultado garantido já nos primeiros dias!</p>
      ${couponBox()}
    </div>

    <div class="section">
      <h3 class="section-title">O QUE O DESAFIO TREINO TRINCA SERÁ CAPAZ DE TRANSFORMAR EM SUA VIDA:</h3>
      <ul class="check-list">
        <li>✅ Destravar o ganho de massa muscular acelerado mesmo enquanto descansa</li>
        <li>✅ Usar camisetas que destacam o shape</li>
        <li>✅ Sair do espelho satisfeito, não frustrado</li>
      </ul>
      <p style="text-align:center;font-weight:700">Chegou o dia de Você Finalmente <span style="color:#ff7a1a">Alcançar aquele shape</span> e nunca mais sentir frustração de si mesmo!</p>
      <p style="text-align:center;font-style:italic">Entre no protocolo científico mais eficiente para o ganho acelerado de massa muscular e definição!</p>
      ${ctaButtonGreen()}
    </div>

    <div class="section">
      <h3 class="section-title">Homens como você conseguiram excelentes resultados com o TREINO TRINCA</h3>
      ${ringStat(30, 'Fusce vitae tellus in risus sagittis condimentum')}
      ${ringStat(30, 'Fusce vitae tellus in risus sagittis condimentum')}
    </div>

    <div class="section" style="text-align:center">
      <img class="guarantee-badge" src="public/logo.webp" alt="Garantia" />
      <p class="guarantee-title">GARANTIA ZERO RISCO<span class="days">30 DIAS</span></p>
      <p>Eu confio tanto que o Desafio Treino Trinca vai tirar seu corpo do Modo Acomodado e fazer você ganhar músculo e definir o abdômen como nunca viu antes... Que você pode testar por 30 dias completos sem risco algum.</p>
      <p>Isso significa que se você seguir os treinos e a dieta metabólica, e não tiver os resultados que quer... <strong style="color:#1fa34a">Eu devolvo 100% do seu dinheiro.</strong></p>
      <p>Você tem 30 dias pra testar. Se não gostar ou não tiver resultado, é só mandar um email pra contato@treinotrinca.com dizendo "quero reembolso" e pronto. Seu investimento volta pra você na hora!</p>
      ${ctaButtonGreen()}
    </div>

    <div class="section">
      <h3 class="section-title">VOCÊ CHEGOU ATÉ AQUI POR UM MOTIVO</h3>
      <p><strong>EU JÁ ESTIVE ONDE VOCÊ ESTÁ AGORA</strong></p>
      <p>Sei o quanto é ruim olhar no espelho e não gostar do que vê. Por isso você pode confiar em mim. Essa é sua chance de finalmente fazer diferente.</p>
      <p>Você não tem nada a perder. Se chegou até aqui, é porque algo dentro de você SABE que está pronto. Confie nesse instinto.</p>
      <p>Toque agora no botão abaixo e participe do Desafio!</p>
      ${couponBox()}
      <button class="btn" id="ctaContinue1">Continuar</button>
    </div>

    <div class="section">
      <p style="text-align:center;font-weight:700">essa é a minha última mensagem para você! 💚</p>
      <p style="text-align:center">Assista o vídeo de 1 minuto abaixo 👇</p>
      <div class="video-box" id="videoBox"><div class="play">▶</div></div>
      ${ctaButtonOrange('COMEÇAR MINHA TRANSFORMAÇÃO AGORA')}
    </div>

    <div class="section">
      <h3 class="section-title">Perguntas Frequentes</h3>
      ${faqItem('Eu nunca treinei antes, consigo fazer?', 'SIM! 68% dos nossos alunos eram sedentários quando começaram. Os treinos são adaptados para todos poderem fazer. Se você consegue subir uma escada, consegue fazer o Treino Trinca, cada exercício vem com demonstração em vídeo e adaptações caso você tenha alguma limitação.')}
      ${faqItem('Quantos treinos por semana eu preciso?', 'Apenas 3 treinos por semana. Mesmo você sendo atarefado, vai conseguir fazer em qualquer dia da semana.')}
      ${faqItem('Já tentei tudo (suplemento, academia, dieta), por que seria diferente agora?', 'Porque o Treino Trinca não contém dietas restritivas e exercícios comuns... Tudo que você tentou antes REFORÇOU o Modo de Acúmulo de Gordura do seu corpo. O Treino Trinca faz o OPOSTO, tira você do Modo de Acúmulo e ativa o Modo de Queima. É um protocolo diferente, não é "mais uma dieta".')}
      ${faqItem('E se eu não me adaptar?', 'Você tem 30 DIAS DE GARANTIA TOTAL. Se você seguir o protocolo (treinos + cardápio) e não ganhar 1 kilo, devolverei 100% do seu dinheiro. Sem perguntas, sem burocracia. Basta mandar um email pra contato@treinotrinca.com. Risco ZERO.')}
      ${faqItem('Quando recebo acesso?', 'IMEDIATAMENTE! Assim que finalizar o pagamento, você recebe o login do aplicativo + dieta + tudo no seu whatsapp. Pode começar hoje mesmo!')}
      ${faqItem('Como funciona o suporte? E se eu tiver perguntas no meio do desafio?', 'Você entra no Grupo VIP do WhatsApp com suporte da equipe todos os dias. Você não fica sozinho em nenhum momento.')}
      ${faqItem('Preciso contar calorias? Pesar comida?', 'NÃO! Zero complicações. O cardápio já vem com porções em medidas caseiras simples (colher, xícara, unidade). Você só segue as receitas prontas.')}
      ${faqItem('O cardápio tem comida cara? Ingredientes difíceis de achar?', 'Não! Tudo com o que você já tem em casa. Arroz, feijão, ovo, frango, legumes, frutas e coisas normais de mercado.')}
      ${faqItem('Posso parcelar?', 'Sim! Até 5x no cartão de crédito. Fica R$ 6,71 por mês. Ou você paga R$ 29,90 à vista e garante acesso completo imediatamente.')}
      <p style="text-align:center;margin-top:20px">Agora é com você...</p>
      ${couponBox()}
      ${ctaButtonOrange('COMEÇAR MINHA TRANSFORMAÇÃO AGORA')}
    </div>
  `;

  document.querySelectorAll('.cta-checkout').forEach(btn => btn.addEventListener('click', openCheckout));
  document.getElementById('ctaContinue1')?.addEventListener('click', openCheckout);
  document.getElementById('videoBox')?.addEventListener('click', openCheckout);
}

function couponBox() {
  return `
    <div class="coupon-box">
      <div class="title">🎟️ SEU CUPOM EXCLUSIVO FOI ATIVADO!</div>
      <div class="code">✅ DESCONTO70%OFF</div>
    </div>
    <button class="btn btn-green cta-checkout">APLICAR CUPOM E GARANTIR VAGA</button>
  `;
}

function ctaButtonGreen() {
  return `<button class="btn btn-green cta-checkout" style="margin-top:16px">APLICAR CUPOM E GARANTIR VAGA</button>`;
}

function ctaButtonOrange(label) {
  return `<button class="btn btn-orange cta-checkout" style="margin-top:16px">${label}</button>`;
}

function journeyItem(pct, text) {
  const [range, ...rest] = text ? [] : [];
  return `
    <div class="journey-item">
      <div class="journey-pct">30%</div>
      <div><h4>${pct}:</h4><p>${text}</p></div>
    </div>
  `;
}

function ringStat(pct, text) {
  return `
    <div class="graph-box" style="text-align:center;margin-bottom:16px">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="#eee" stroke-width="10"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#3b7cf0" stroke-width="10"
          stroke-dasharray="${2*Math.PI*42}" stroke-dashoffset="${2*Math.PI*42*(1-pct/100)}" transform="rotate(-90 50 50)"/>
        <text x="50" y="55" text-anchor="middle" font-size="18" font-weight="800">${pct}%</text>
      </svg>
      <p style="margin-top:10px">${text}</p>
    </div>
  `;
}

function faqItem(q, a) {
  return `
    <details class="faq-item">
      <summary>${q}</summary>
      <p>${a}</p>
    </details>
  `;
}

// ---- Checkout modal (lead capture — no real payment gateway wired) ----
function openCheckout() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box">
      <h3>Garanta sua vaga no Desafio!</h3>
      <p>Deixe seu contato que nossa equipe envia o link de pagamento e acesso pelo WhatsApp.</p>
      <input type="text" placeholder="Seu nome" id="leadName" />
      <input type="tel" placeholder="Seu WhatsApp (com DDD)" id="leadPhone" />
      <button class="btn btn-green" id="leadSubmit">Quero garantir minha vaga</button>
      <button class="modal-close" id="leadClose">Fechar</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById('leadClose').addEventListener('click', () => overlay.remove());
  document.getElementById('leadSubmit').addEventListener('click', () => {
    const name = document.getElementById('leadName').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    if (!name || !phone) { alert('Preencha nome e WhatsApp para continuar.'); return; }
    const msg = encodeURIComponent(`Olá! Meu nome é ${name} e quero garantir minha vaga no Desafio Treino Trinca com o cupom de 70% OFF.`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    overlay.remove();
  });
}

render();
