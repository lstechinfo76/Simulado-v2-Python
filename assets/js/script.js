// 🚨 Função Auto-Invocada (IIFE)
(function () {
    // ==========================================
    // AUDIO ENGINE - SONS SUAVES E MODERNOS (CORRIGIDO)
    // ==========================================
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    function initAudio() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    // ==========================================
    // ESTADOS GLOBAIS E CONFIGURAÇÕES SALVAS (LocalStorage)
    // ==========================================
    const CONFIG_KEY = "lstechinfo_infosec_config";
    let config = { sound: true, effects: false, theme: 'dark' };

    try {
        const savedConfig = localStorage.getItem(CONFIG_KEY);
        if (savedConfig) config = JSON.parse(savedConfig);
    } catch (e) { console.warn("Aviso: LocalStorage indisponível.", e); }

    let isSoundEnabled = config.sound;
    let isEffectsEnabled = config.effects;

    if (config.theme === 'light') {
        document.body.removeAttribute("data-theme");
        document.getElementById("theme-toggle").querySelector('.icon').textContent = "🌙";
    }

    if (!isEffectsEnabled) {
        document.body.classList.add("no-effects");
        document.getElementById("effects-toggle").classList.add("muted");
    } else {
        document.body.classList.remove("no-effects");
        document.getElementById("effects-toggle").classList.remove("muted");
    }

    if (!isSoundEnabled) {
        document.getElementById("sound-toggle").classList.add("muted");
    }

    function saveConfig() {
        try {
            config.sound = isSoundEnabled;
            config.effects = isEffectsEnabled;
            config.theme = document.body.hasAttribute("data-theme") ? 'dark' : 'light';
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        } catch (e) { }
    }

    // ==========================================
    // SISTEMA DE TOAST E MODAL (CRIADOR)
    // ==========================================
    const toastContainer = document.getElementById("toast-container");
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = `>_ ${message}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("hide");
            toast.addEventListener("animationend", () => toast.remove());
        }, 2500);
    }

    const aboutBtn = document.getElementById("about-creator-btn");
    const creatorModal = document.getElementById("creator-modal");
    const closeModalBtn = document.getElementById("close-creator-modal");

    if (aboutBtn && creatorModal && closeModalBtn) {
        aboutBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.add("active");
            if (headerActions.classList.contains("open")) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });

        closeModalBtn.addEventListener("click", () => {
            playSound('pop');
            creatorModal.classList.remove("active");
        });

        creatorModal.addEventListener("click", (e) => {
            if (e.target === creatorModal) {
                playSound('pop');
                creatorModal.classList.remove("active");
            }
        });
    }

    // ==========================================
    // MENU HAMBÚRGUER (MOBILE)
    // ==========================================
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const headerActions = document.getElementById("header-actions");

    if (mobileMenuBtn && headerActions) {
        mobileMenuBtn.addEventListener("click", () => {
            const isOpen = headerActions.classList.contains("open");
            if (isOpen) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            } else {
                headerActions.classList.add("open");
                mobileMenuBtn.setAttribute("aria-expanded", "true");
            }
            playSound('pop');
        });

        document.addEventListener("click", (e) => {
            if (headerActions.classList.contains("open") && !headerActions.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                headerActions.classList.remove("open");
                mobileMenuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // ==========================================
    // CONTROLES DE INTERFACE E AUDIO (SUAVE)
    // ==========================================
    function playSound(type) {
        if (!isSoundEnabled) return;
        initAudio();
        const now = audioCtx.currentTime;

        if (type === 'pop') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'correct') {
            [800, 1200].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'triangle';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.15);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.15);
            });
        } else if (type === 'wrong') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'victory') {
            [440, 554, 659, 880].forEach((freq, i) => {
                const o = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                o.type = 'sine';
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, now + i * 0.1);
                g.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.03);
                g.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.3);
                o.connect(g); g.connect(audioCtx.destination);
                o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.3);
            });
        }
    }

    const soundToggleBtn = document.getElementById("sound-toggle");
    const effectsToggleBtn = document.getElementById("effects-toggle");
    const themeToggleBtn = document.getElementById("theme-toggle");

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            isSoundEnabled = !isSoundEnabled;
            if (isSoundEnabled) {
                soundToggleBtn.classList.remove("muted");
                showToast("Áudio: ONLINE");
                playSound('pop');
            } else {
                soundToggleBtn.classList.add("muted");
                showToast("Áudio: OFFLINE");
            }
            saveConfig();
        });
    }

    if (effectsToggleBtn) {
        effectsToggleBtn.addEventListener("click", () => {
            isEffectsEnabled = !isEffectsEnabled;
            if (isEffectsEnabled) {
                effectsToggleBtn.classList.remove("muted");
                document.body.classList.remove("no-effects");
                showToast("Efeitos Visuais: ONLINE");
                playSound('pop');
            } else {
                effectsToggleBtn.classList.add("muted");
                document.body.classList.add("no-effects");
                showToast("Efeitos Visuais: OFFLINE");
                playSound('pop');
            }
            saveConfig();
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            playSound('pop');
            const icon = themeToggleBtn.querySelector('.icon') || themeToggleBtn;
            icon.classList.add("spin-icon");
            setTimeout(() => icon.classList.remove("spin-icon"), 400);

            if (document.body.hasAttribute("data-theme")) {
                document.body.removeAttribute("data-theme");
                setTimeout(() => icon.textContent = "🌙", 150);
                showToast("Modo Claro Ativado");
            } else {
                document.body.setAttribute("data-theme", "dark");
                setTimeout(() => icon.textContent = "☀️", 150);
                showToast("Modo Escuro Ativado");
            }
            saveConfig();
        });
    }

    // ==========================================
    // DETECÇÃO INTELIGENTE DE TECLADO FÍSICO
    // ==========================================
    window.addEventListener('keydown', function detectKeyboard(e) {
        if (e.key !== 'Unidentified' && !document.body.classList.contains('keyboard-active')) {
            document.body.classList.add('keyboard-active');
            window.removeEventListener('keydown', detectKeyboard);
        }
    });

    // ==========================================
    // SISTEMA ANTI-CHEAT (REFINADO)
    // ==========================================
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.addEventListener('copy', event => {
        event.preventDefault();
        showToast("ACESSO NEGADO: Cópia restrita.");
    });
    document.addEventListener('cut', event => event.preventDefault());
    document.addEventListener('paste', event => event.preventDefault());
    document.addEventListener('dragstart', event => event.preventDefault());

    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
            (e.ctrlKey && (e.key === 'S' || e.key === 's')) ||
            (e.ctrlKey && (e.key === 'P' || e.key === 'p'))
        ) {
            e.preventDefault();
        }
    });

    // ==========================================
    // BANCO DE QUESTÕES - PARADIGMAS PYTHON
    // ==========================================
   const questions = [
        {
            question: "1. Em Programação Orientada a Objetos, uma classe pode ser entendida como uma estrutura que define atributos e comportamentos que poderão estar presentes em seus objetos. Considerando esse conceito, assinale a alternativa correta.",
            options: [
                "Uma classe é obrigatoriamente uma variável numérica.",
                "Uma classe só pode possuir métodos, nunca atributos.",
                "Uma classe funciona como uma definição ou modelo a partir do qual objetos podem ser criados.",
                "Uma classe é criada exclusivamente para armazenar listas.",
                "Classes não podem possuir métodos em Python."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>C</b>. Uma classe atua como um 'molde' ou planta-baixa para a criação de instâncias (objetos) em memória."
        },
        {
            question: "2. Analise o código Python:\n\nx = 1\ny = 2\nz = x\nx = y\ny = z\nprint(x, y)\n\nQual será a saída?",
            options: [
                "1 1",
                "2 2",
                "1 2",
                "2 1",
                "3 1"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE LÓGICA]</b> A alternativa correta é a <b>D (2 1)</b>. O código implementa uma lógica clássica de swap (troca de valores) utilizando `z` como variável temporária."
        },
        {
            question: "3. Considere a classe abaixo:\n\nclass Aluno:\n    def __init__(self, nome, nota):\n        self.nome = nome\n        self.nota = nota\n\naluno1 = Aluno(\"Ana\", 9.0)\n\nNo código apresentado, qual é a função do método __init__?",
            options: [
                "Excluir automaticamente um objeto.",
                "Inicializar atributos quando uma instância é criada.",
                "Importar uma biblioteca externa.",
                "Criar uma estrutura de repetição.",
                "Impedir a criação de novos objetos."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>B</b>. O método `__init__` em Python atua como o método construtor da classe."
        },
        {
            question: "4. Amarração dinâmica está relacionada à possibilidade de associações e tipos serem determinados ou alterados durante a execução do programa. Qual das linguagens abaixo é conhecida por possuir tipagem dinâmica?",
            options: [
                "Java",
                "C++",
                "Rust",
                "Go",
                "Python"
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE FUNDAMENTOS]</b> A alternativa correta é a <b>E</b>. O Python resolve os tipos de variáveis no momento de execução (runtime), e não no momento de compilação."
        },
        {
            question: "5. Em Python, considere:\n\nclass Pessoa:\n    def __init__(self, nome):\n        self.nome = nome\n\n    def apresentar(self):\n        return self.nome\n\nNo método apresentar(), o termo 'self' representa:",
            options: [
                "A instância atual da classe que está executando o método.",
                "A classe pai obrigatoriamente.",
                "O nome do método.",
                "Uma variável global criada pelo Python.",
                "O módulo em que a classe foi declarada."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>A</b>. O parâmetro `self` atua como uma referência ao próprio objeto instanciado que está invocando o método."
        },
        {
            question: "6. Analise a expressão:\n\nx = 1 / 2 + 3 // 3 + 4 ** 2\nprint(x)\n\nQual será o valor exibido?",
            options: [
                "21",
                "17",
                "8.5",
                "8",
                "17.5"
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE OPERADORES]</b> A alternativa correta é a <b>E (17.5)</b>. Respeitando a precedência: Potenciação (`4**2 = 16`), Divisão float (`1/2 = 0.5`), Divisão inteira (`3//3 = 1`). Por fim: `0.5 + 1 + 16 = 17.5`."
        },
        {
            question: "7. Em Programação Orientada a Objetos, o conceito que permite criar uma nova classe aproveitando atributos e métodos de outra classe é denominado:",
            options: [
                "Iteração",
                "Herança",
                "Importação",
                "Recursividade",
                "Serialização"
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>B</b>. A Herança permite o reaproveitamento e a extensão de código de uma classe base (mãe) por uma classe derivada (filha)."
        },
        {
            question: "8. O uso de bibliotecas permite ampliar as funcionalidades disponíveis em um programa Python. Qual palavra-chave é utilizada normalmente para importar uma biblioteca ou módulo?",
            options: [
                "package",
                "include",
                "library",
                "import",
                "use"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE SINTAXE]</b> A alternativa correta é a <b>D</b>. A instrução `import` é nativa da sintaxe Python para acoplar módulos inteiros dentro do escopo de execução."
        },
        {
            question: "9. Considere o código:\n\ndef calcular(a, b):\n    resultado = a + b\n    return resultado\n\nprint(calcular(4, 6))\n\nQual será a saída?",
            options: [
                "24",
                "10",
                "46",
                "2",
                "Nenhum valor será exibido."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE FUNÇÕES]</b> A alternativa correta é a <b>B</b>. A função recebe `4` e `6` como argumentos, efetua a soma básica (`4 + 6 = 10`) e devolve o valor."
        },
        {
            question: "10. O polimorfismo é um conceito importante da Programação Orientada a Objetos. Qual alternativa melhor representa uma de suas características?",
            options: [
                "Obriga todos os objetos a possuírem exatamente os mesmos atributos e valores.",
                "Impede uma classe de herdar características de outra.",
                "Permite que diferentes objetos respondam de formas apropriadas a uma mesma operação ou interface.",
                "Elimina a necessidade de métodos.",
                "Transforma automaticamente todos os atributos em privados."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>C</b>. Polimorfismo possibilita que métodos com a mesma assinatura reajam de maneiras diferentes dependendo da classe da instância."
        },
        {
            question: "11. Considere o código:\n\nclass Animal:\n    def emitir_som(self):\n        print(\"Som\")\n\nclass Cachorro(Animal):\n    def emitir_som(self):\n        print(\"Au au\")\n\nanimal = Cachorro()\nanimal.emitir_som()\n\nO que será exibido?",
            options: [
                "Animal",
                "Som",
                "Cachorro",
                "Au au",
                "Ocorrerá obrigatoriamente um erro."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>D</b>. Apesar de `Cachorro` herdar de `Animal`, ele redefiniu o método `emitir_som()`. A instância da classe especializada prioriza o seu próprio método."
        },
        {
            question: "12. Considere dois objetos da classe 'Conta':\n\nconta1 = Conta()\nconta2 = Conta()\nconta1 = conta2\n\nApós a execução da última instrução, o que acontece?",
            options: [
                "conta1 e conta2 passam a referenciar o mesmo objeto.",
                "O conteúdo de conta1 é automaticamente copiado para um novo objeto conta2.",
                "Os dois objetos são fundidos fisicamente na memória.",
                "A instrução é inválida em Python.",
                "conta2 é automaticamente destruído."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE MEMÓRIA]</b> A alternativa correta é a <b>A</b>. Ao fazer `conta1 = conta2`, as duas variáveis passam a apontar para o mesmo endereço de referência na memória."
        },
        {
            question: "13. Em Python, uma função é definida utilizando qual palavra-chave?",
            options: [
                "function",
                "method",
                "func",
                "define",
                "def"
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE SINTAXE]</b> A alternativa correta é a <b>E</b>. A palavra reservada nativa do Python para definir escopos de funções e métodos é `def`."
        },
        {
            question: "14. Considere a função:\n\ndef calcular_area(base, altura):\n    area = base * altura\n    return area\n\nresultado = calcular_area(5, 4)\n\nNo momento da chamada 'calcular_area(5, 4)', os valores 5 e 4 são:",
            options: [
                "Classes.",
                "Atributos.",
                "Argumentos fornecidos à função.",
                "Bibliotecas.",
                "Métodos construtores."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE FUNÇÕES]</b> A alternativa correta é a <b>C</b>. Quando a função é invocada, os valores repassados (5, 4) são chamados de argumentos (ou parâmetros reais)."
        },
        {
            question: "15. Considere o código:\n\nclass Endereco:\n    def __init__(self, rua):\n        self.rua = rua\n\n    def mostrar(self):\n        return self.rua\n\nclass EnderecoCompleto(Endereco):\n    def __init__(self, rua, complemento):\n        super().__init__(rua)\n        self.complemento = complemento\n\n    def mostrar(self):\n        return super().mostrar() + \", \" + self.complemento\n\ne = EnderecoCompleto(\"Av. Brasil\", \"Apto 10\")\nprint(e.mostrar())\n\nQual será a saída?",
            options: [
                "Apto 10",
                "Av. Brasil",
                "Av. Brasil, Apto 10",
                "EnderecoCompleto",
                "Ocorrerá erro porque uma classe filha não pode acessar métodos da classe pai."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>C</b>. O código utiliza o `super()` para reaproveitar lógicas da superclasse. Ele invoca o `mostrar()` pai ('Av. Brasil') e concatena o próprio complemento ('Apto 10')."
        },
        {
            question: "16. Sobre herança múltipla, assinale a alternativa correta.",
            options: [
                "Python permite que uma classe herde diretamente de mais de uma classe.",
                "Python não possui nenhum mecanismo de herança.",
                "Herança múltipla significa criar vários objetos da mesma classe.",
                "Uma classe Python pode possuir apenas uma superclasse em qualquer situação.",
                "Herança múltipla significa executar vários métodos simultaneamente."
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>A</b>. Python suporta Herança Múltipla nativamente, resolvendo ambiguidades de chamada pela estrutura de MRO (Method Resolution Order)."
        },
        {
            question: "17. Em Python, considere:\n\ndef saudacao(nome=\"Aluno\"):\n    print(\"Olá,\", nome)\n\nsaudacao()\n\nQual será a saída?",
            options: [
                "Olá, None",
                "Aluno",
                "Ocorrerá erro porque o argumento é obrigatório.",
                "Olá, Aluno",
                "saudacao Aluno"
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE FUNÇÕES]</b> A alternativa correta é a <b>D</b>. O parâmetro nome foi inicializado com um valor padrão. Quando a função é chamada vazia, o interpretador preenche esse valor default."
        },
        {
            question: "18. O Tkinter é utilizado em Python principalmente para:",
            options: [
                "Criar bancos de dados relacionais.",
                "Desenvolver interfaces gráficas.",
                "Gerenciar exclusivamente arquivos PDF.",
                "Compilar programas Python.",
                "Criar somente aplicações para terminal."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE INTERFACES]</b> A alternativa correta é a <b>B</b>. A biblioteca `tkinter` é o pacote padrão do Python para desenvolvimento de interfaces gráficas de usuário (GUI)."
        },
        {
            question: "19. Considere as afirmativas sobre Tkinter:\n\nI. Tkinter pode ser utilizado para criação de interfaces gráficas em Python.\nII. Uma interface pode possuir elementos como textos, botões e imagens.\nIII. Toda interface criada com Tkinter precisa obrigatoriamente conter apenas imagens.\n\nAssinale a alternativa correta.",
            options: [
                "Somente II está correta.",
                "Somente III está correta.",
                "I, II e III estão corretas.",
                "Somente I e III estão corretas.",
                "Somente I e II estão corretas."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE INTERFACES]</b> A alternativa correta é a <b>E</b>. A afirmativa III é falsa. Uma interface gráfica feita com o Tkinter é montada baseada em Widgets variados e não precisa obrigatoriamente conter apenas imagens."
        },
        {
            question: "20. Considere o código:\n\ndef contador(n):\n    if n == 0:\n        return\n    print(n)\n    contador(n - 1)\n\ncontador(3)\n\nQual conceito de programação é utilizado quando contador() chama a si própria?",
            options: [
                "Polimorfismo.",
                "Encapsulamento.",
                "Recursividade.",
                "Herança múltipla.",
                "Sobrecarga de operadores."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE ALGORITMOS]</b> A alternativa correta é a <b>C</b>. O ato de uma função invocar a si mesma dentro da sua própria estrutura de processamento caracteriza uma rotina recursiva (Recursividade)."
        },
        {
            question: "21. Analise o código:\n\na = 0\nfor i in range(30):\n    if a % 2 == 0:\n        a += 1\n        continue\n    elif a % 5 == 0:\n        break\n    else:\n        a += 3\nprint(a)\n\nQual valor será impresso?",
            options: [
                "30",
                "2",
                "10",
                "6",
                "5"
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE LAÇOS]</b> A alternativa correta é a <b>E</b>. O loop for itera aplicando incrementos e continues lógicos. Ao chegar no momento em que `a = 5`, a condição `5 % 5 == 0` dispara o comando `break`, encerrando o loop e imprimindo 5."
        },
        {
            question: "22. Considere o código:\n\nx = 10\n\ndef exemplo():\n    x = 5\n    print(x)\n\nexemplo()\nprint(x)\n\nQual será a saída?",
            options: [
                "10 e 10",
                "5 e 5",
                "5 e 10",
                "10 e 5",
                "O programa gera erro porque existem duas variáveis chamadas x."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE ESCOPO]</b> A alternativa correta é a <b>C (5 e 10)</b>. Dentro da função `exemplo()`, a variável local sombreia a global (printa 5). Fora da função, a variável global `x` (intacta valendo 10) é chamada e printa 10."
        },
        {
            question: "23. Em relação às variáveis locais e globais em Python, assinale a alternativa correta.",
            options: [
                "Uma variável criada dentro de uma função é sempre global.",
                "Variáveis locais só existem durante a execução/contexto da função em que foram definidas.",
                "Variáveis globais só podem armazenar números inteiros.",
                "Python não permite variáveis locais.",
                "Toda variável local pode ser acessada diretamente por qualquer função sem nenhuma regra de escopo."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE ESCOPO]</b> A alternativa correta é a <b>B</b>. Variáveis locais são alocadas e destruídas assim que a função encerra o seu contexto."
        },
        {
            question: "24. Considere:\n\nclass Veiculo:\n    def mover(self):\n        print(\"Veículo em movimento\")\n\nclass Carro(Veiculo):\n    pass\n\nc = Carro()\nc.mover()\n\nO que acontece?",
            options: [
                "Ocorre erro porque 'Carro' não possui o método mover() declarado diretamente.",
                "Nada acontece.",
                "É exibido 'Carro'.",
                "É exibido 'Veículo em movimento'.",
                "O método é executado somente se for utilizado 'super()' na chamada."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>D</b>. Como a classe `Carro` herda de `Veiculo` sem sobrescrever o método, a instância incorpora o comportamento da classe mãe."
        },
        {
            question: "25. Em Python, considere:\n\ntry:\n    numero = int(input(\"Digite um número: \"))\n    resultado = 10 / numero\nexcept ZeroDivisionError:\n    print(\"Não é possível dividir por zero.\")\n\nQual é a principal função do bloco 'except'?",
            options: [
                "Repetir o programa indefinidamente.",
                "Criar uma classe.",
                "Tratar uma exceção que possa ocorrer no bloco 'try'.",
                "Importar uma biblioteca.",
                "Encerrar o interpretador antes da execução do 'try'."
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE EXCEÇÕES]</b> A alternativa correta é a <b>C</b>. O bloco `except` atua como um manipulador de erros, ativado apenas se um evento anômalo ocorrer durante o processamento do `try`."
        },
        {
            question: "26. Considere:\n\ndef calculaMult(a, b):\n    resultado = a * b\n    return resultado\n\nvalor = calculaMult(3, 4)\n\nNa definição e chamada dessa função, 'calculaMult' é o identificador da função, '3' e '4' são valores fornecidos na chamada e 'resultado' é uma variável criada dentro da função. Assinale a sequência que melhor classifica esses elementos.",
            options: [
                "Classe - parâmetros formais - variável global.",
                "Identificador - argumentos/parâmetros reais – variável local.",
                "Biblioteca - parâmetros formais - atributo.",
                "Identificador - variáveis globais - método.",
                "Classe - argumentos - variável global."
            ],
            _k: "MQ==",
            explanation: "💡 <b>[LOG DE SINTAXE]</b> A alternativa correta é a <b>B</b>. `calculaMult` é o Identificador; `(3, 4)` são Argumentos Reais; e `resultado` é uma Variável Local."
        },
        {
            question: "27. Analise:\n\nclass Produto:\n    def __init__(self, nome, preco):\n        self.nome = nome\n        self.preco = preco\n\n    def desconto(self, percentual):\n        self.preco = self.preco - (self.preco * percentual / 100)\n\np = Produto(\"Teclado\", 200)\np.desconto(10)\nprint(p.preco)\n\nQual valor será exibido?",
            options: [
                "220",
                "190",
                "180",
                "200",
                "20"
            ],
            _k: "Mg==",
            explanation: "💡 <b>[LOG DE LÓGICA DE CLASSE]</b> A alternativa correta é a <b>C (180)</b>. O preço original (200) subtrai o desconto (200 * 10 / 100 = 20), resultando em 180."
        },
        {
            question: "28. Considere:\n\nclass Forma:\n    def calcular_area(self):\n        pass\n\nclass Quadrado(Forma):\n    def __init__(self, lado):\n        self.lado = lado\n    def calcular_area(self):\n        return self.lado * 2\n\nclass Retangulo(Forma):\n    def __init__(self, base, altura):\n        self.base = base\n        self.altura = altura\n    def calcular_area(self):\n        return self.base * self.altura\n\nq = Quadrado(4)\nr = Retangulo(4, 5)\nprint(q.calcular_area(), r.calcular_area())\n\nQual conceito é evidenciado pelo fato de objetos diferentes responderem ao método calcular_area() de acordo com sua própria implementação?",
            options: [
                "Importação.",
                "Recursividade.",
                "Tratamento de exceções.",
                "Polimorfismo.",
                "Estrutura de repetição."
            ],
            _k: "Mw==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>D</b>. O uso da mesma assinatura de método `calcular_area()` reagindo de forma específica em classes filhas diferentes caracteriza o Polimorfismo de Sobrescrita."
        },
        {
            question: "29. Analise o código:\n\nsoma = 0\nnumeros = [2, 4, 6, 8]\nfor numero in numeros:\n    soma += numero\nprint(soma)\n\nQual será a saída?",
            options: [
                "20",
                "8",
                "24",
                "4",
                "10"
            ],
            _k: "MA==",
            explanation: "💡 <b>[LOG DE LAÇOS]</b> A alternativa correta é a <b>A</b>. A soma realiza os incrementos através da lista iterada: 0+2 = 2, 2+4 = 6, 6+6 = 12, 12+8 = 20."
        },
        {
            question: "30. Considere o seguinte cenário:\nUma aplicação possui uma classe 'Funcionario' com os atributos 'nome' e 'salario' e um método calcular_bonus(). As classes 'Gerente' e 'Vendedor' herdam de 'Funcionario', mas implementam 'calcular_bonus()' de maneiras diferentes de acordo com as regras de cada cargo.\n\nQuais conceitos da Programação Orientada a Objetos aparecem de forma mais evidente nesse cenário?",
            options: [
                "Recursividade e tratamento de exceções.",
                "Importação e escopo global.",
                "Estruturas condicionais e repetição apenas.",
                "Tkinter e módulos.",
                "Herança e polimorfismo."
            ],
            _k: "NA==",
            explanation: "💡 <b>[LOG DE POO]</b> A alternativa correta é a <b>E</b>. O cenário explicita o uso de Herança (derivando de uma classe mãe comum) associada ao Polimorfismo (cada filho recalculando o bônus obedecendo suas próprias lógicas)."
        }
    ];
    
    const getAnswer = (q) => parseInt(atob(q._k));

    // ==========================================
    // VARIÁVEIS DE ESTADO E DOM PRINCIPAL
    // ==========================================
    const startScreen = document.getElementById("start-screen");
    const quizScreen = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const skipBtn = document.getElementById("skip-btn");
    const restartBtn = document.getElementById("restart-btn");
    const showReviewBtn = document.getElementById("show-review-btn");
    const shareBtn = document.getElementById("share-btn");
    const homeLink = document.getElementById("home-link");
    const questionAreaContainer = document.querySelector(".question-area");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const progressBar = document.getElementById("progress-bar");
    const questionTracker = document.getElementById("question-tracker");
    const quizActions = document.getElementById("quiz-actions");
    const explanationContainer = document.getElementById("explanation-container");
    const explanationText = document.getElementById("explanation-text");
    const scoreText = document.getElementById("score-text");
    const totalText = document.getElementById("total-text");
    const feedbackText = document.getElementById("feedback-text");
    const reviewContainer = document.getElementById("review-container");
    const reviewContent = document.getElementById("review-content");
    const historyContainer = document.getElementById("historico-container");
    const historyScoreText = document.getElementById("historico-acertos");
    const viewPastReviewBtn = document.getElementById("view-past-review-btn");
    const QUIZ_HISTORY_KEY = "lstechinfo_python_simulado";

    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];
    let isReviewVisible = false;
    let timerInterval;
    let secondsElapsed = 0;
    let isTransitioning = false;

    const iconCheck = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const iconX = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const iconArrow = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    // ==========================================
    // LÓGICA DO QUIZ E TRANSIÇÕES SEGURAS
    // ==========================================
    function startTimer() {
        secondsElapsed = 0;
        const timerElement = document.getElementById('quiz-timer');
        if (timerElement) timerElement.textContent = "00:00";
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            if (timerElement) {
                const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
                const s = (secondsElapsed % 60).toString().padStart(2, '0');
                timerElement.textContent = `${m}:${s}`;
            }
        }, 1000);
    }
    function stopTimer() { clearInterval(timerInterval); }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') return;

        if (quizScreen.classList.contains('active')) {
            const key = e.key.toLowerCase();
            const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };

            if (!quizActions.classList.contains('is-answered')) {
                if (keyMap[key] !== undefined && optionsContainer.children[keyMap[key]]) {
                    e.preventDefault();
                    initAudio();
                    optionsContainer.children[keyMap[key]].click();
                    return;
                }
                if (key === 's') {
                    e.preventDefault();
                    initAudio();
                    skipBtn.click();
                    return;
                }
            } else if (e.code === 'Enter' || e.code === 'ArrowRight') {
                e.preventDefault();
                initAudio();
                if (!nextBtn.classList.contains("hidden-btn")) {
                    nextBtn.click();
                }
                return;
            }
        } else if (startScreen.classList.contains('active') && e.code === 'Enter') {
            e.preventDefault();
            initAudio();
            startBtn.click();
        }
    });

    startBtn.addEventListener("click", () => { playSound('pop'); startQuiz(); });
    nextBtn.addEventListener("click", () => { playSound('pop'); loadNextQuestion(); });
    skipBtn.addEventListener("click", () => { playSound('pop'); skipQuestion(); });
    restartBtn.addEventListener("click", () => { playSound('pop'); resetQuiz(); });
    showReviewBtn.addEventListener("click", () => { playSound('pop'); toggleReview(); });
    if (shareBtn) {
        shareBtn.addEventListener("click", () => {
            playSound('pop');
            exportReport();
        });
    }
    if (viewPastReviewBtn) {
        viewPastReviewBtn.addEventListener("click", () => {
            playSound('pop');
            openStoredReview();
        });
    }
    homeLink.addEventListener("click", () => window.location.reload());

    renderHistoryCard();

    function scrambleText(element, newText) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iterations = 0;
        const step = Math.max(1, Math.floor(newText.length / 20));

        const interval = setInterval(() => {
            element.innerText = newText.split('').map((letter, index) => {
                if (index < iterations) return newText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            if (iterations >= newText.length) {
                element.innerText = newText;
                clearInterval(interval);
            }
            iterations += step;
        }, 30);
    }

    function startQuiz() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("hidden", "active");
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = Array(questions.length).fill(null);
        isTransitioning = false;
        isReviewVisible = false;
        updateScoreUI(0, questions.length);
        progressBar.style.background = `linear-gradient(90deg, var(--primary), var(--accent))`;
        progressBar.style.boxShadow = `0 0 10px var(--primary-glow)`;
        scoreText.classList.remove("pop-success");
        reviewContainer.classList.add("hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        startTimer();
        renderQuestion();
    }

    function renderQuestion() {
        isTransitioning = false;
        questionAreaContainer.classList.remove("slide-out-left");
        questionAreaContainer.classList.add("slide-in-right");
        quizActions.classList.remove("is-answered");

        nextBtn.classList.add("hidden-btn");
        skipBtn.classList.remove("hidden-btn");

        nextBtn.disabled = false;
        skipBtn.disabled = false;

        explanationContainer.classList.add("hidden");
        explanationContainer.style.display = "none";
        explanationText.innerHTML = "";

        optionsContainer.innerHTML = "";

        const stamp = document.getElementById("access-stamp");
        if (stamp) {
            stamp.classList.remove("show-granted", "show-denied");
            stamp.classList.add("hidden");
        }

        const currentQuestion = questions[currentQuestionIndex];

        if (isEffectsEnabled) {
            scrambleText(questionText, currentQuestion.question);
        } else {
            questionText.innerText = currentQuestion.question;
        }

        questionTracker.textContent = `Varredura de Nó ${currentQuestionIndex + 1} de ${questions.length}`;
        progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");

            button.setAttribute("role", "radio");
            button.setAttribute("aria-checked", "false");
            button.setAttribute("aria-label", `Opção ${String.fromCharCode(65 + index)}: ${option}`);

            button.innerHTML = `<strong class="opt-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</strong> <span>${option}</span>`;
            button.classList.add("option-btn");

            if (isEffectsEnabled) {
                button.style.opacity = "0";
                button.style.transform = "translateY(10px)";
                button.style.animation = `fadeIn 0.3s ease ${index * 0.08}s forwards`;
            } else {
                button.style.opacity = "1";
                button.style.transform = "none";
                button.style.animation = "none";
            }

            button.addEventListener("click", () => { playSound('pop'); selectAnswer(button, index); });
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(selectedButton, selectedIndex) {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return;

        const correctIndex = getAnswer(currentQuestion);
        const isCorrect = selectedIndex === correctIndex;
        userAnswers[currentQuestionIndex] = selectedIndex;

        explanationText.innerHTML = currentQuestion.explanation;
        explanationContainer.classList.remove("hidden");
        explanationContainer.style.display = "block";

        Array.from(optionsContainer.children).forEach((btn) => {
            btn.disabled = true;
            btn.setAttribute("aria-disabled", "true");
        });
        selectedButton.setAttribute("aria-checked", "true");

        const stamp = document.getElementById("access-stamp");

        if (isCorrect) {
            playSound('correct');
            selectedButton.classList.add("correct");
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO CONCEDIDO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-granted");
                setTimeout(() => stamp.classList.remove("show-granted"), 1500);
            }
        } else {
            playSound('wrong');
            selectedButton.classList.add("wrong");
            if (optionsContainer.children[correctIndex]) {
                optionsContainer.children[correctIndex].classList.add("correct");
            }
            if (stamp && isEffectsEnabled) {
                stamp.textContent = "ACESSO NEGADO";
                stamp.classList.remove("hidden");
                stamp.classList.add("show-denied");
                setTimeout(() => stamp.classList.remove("show-denied"), 1500);
            }
        }

        score = calculateFinalScore();
        const answeredSoFar = userAnswers.filter(answer => answer !== null).length || 1;
        const accuracy = score / answeredSoFar;

        if (accuracy >= 0.8) {
            progressBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            progressBar.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
        } else if (accuracy >= 0.5) {
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            progressBar.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.5)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            progressBar.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
        }

        skipBtn.classList.add("hidden-btn");
        nextBtn.classList.remove("hidden-btn");

        nextBtn.innerHTML = currentQuestionIndex < questions.length - 1 ? 'Próxima ➔ <span class="kbd-shortcut" aria-hidden="true">(Enter)</span>' : "Descriptografar Relatório";
        nextBtn.focus();
    }

    function skipQuestion() {
        if (isTransitioning || quizActions.classList.contains("is-answered")) return;
        quizActions.classList.add("is-answered");
        userAnswers[currentQuestionIndex] = -1;
        triggerNextAnimation();
    }

    function loadNextQuestion() {
        if (isTransitioning) return;
        triggerNextAnimation();
    }

    function triggerNextAnimation() {
        if (isTransitioning) return;
        isTransitioning = true;
        nextBtn.disabled = true;
        skipBtn.disabled = true;

        if (isEffectsEnabled) {
            questionAreaContainer.classList.remove("slide-in-right");
            questionAreaContainer.classList.add("slide-out-left");
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    renderQuestion();
                } else {
                    stopTimer();
                    showResults();
                }
            }, 300);
        } else {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                renderQuestion();
            } else {
                stopTimer();
                showResults();
            }
        }
    }

    function calculateFinalScore() {
        return questions.reduce((total, q, index) => {
            return total + (userAnswers[index] === getAnswer(q) ? 1 : 0);
        }, 0);
    }

    function updateScoreUI(finalScore, totalQuestions) {
        if (scoreText) scoreText.textContent = String(finalScore);
        if (totalText) totalText.textContent = String(totalQuestions);

        const totalWrapper = totalText ? totalText.parentElement : null;
        if (totalWrapper) {
            totalWrapper.style.whiteSpace = "nowrap";
            totalWrapper.style.display = "inline-flex";
            totalWrapper.style.alignItems = "baseline";
            totalWrapper.style.justifyContent = "center";
            totalWrapper.style.gap = "0.25rem";
        }
    }

    function showResults() {
        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        resultScreen.classList.replace("hidden", "active");
        progressBar.style.width = "100%";

        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto dos paradigmas em Python!";
            feedbackText.classList.add("perfect-score-text");
            playSound('victory');
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
            if (typeof confetti === 'function' && isEffectsEnabled) confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#10b981', '#00ff88', '#00cc6a'] });
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em programação Python está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz do simulado. 📚";
        }

        saveQuizHistory();
        generateReviewContent();

        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        renderHistoryCard();
    }

    function generateReviewContent() {
        reviewContent.innerHTML = "";
        questions.forEach((q, index) => {
            const userAnswerIndex = userAnswers[index];
            const correctIndex = getAnswer(q);
            const isCorrect = userAnswerIndex === correctIndex;
            const skipped = userAnswerIndex === -1;
            const reviewBox = document.createElement("div");
            reviewBox.classList.add("review-item");

            let htmlContent = `<h4 style="white-space: pre-wrap; line-height: 1.6;">${q.question}</h4><div class="review-ans-group">`;
            
            if (isCorrect) {
                htmlContent += `<div class="review-ans-text correct">${iconCheck} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div>`;
            } else if (skipped) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Questão pulada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else if (userAnswerIndex === null || userAnswerIndex === undefined || !q.options[userAnswerIndex]) {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span>Sem resposta registrada.</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            } else {
                htmlContent += `<div class="review-ans-text wrong">${iconX} <span><b>Resposta enviada: ${String.fromCharCode(65 + userAnswerIndex)})</b> ${q.options[userAnswerIndex]}</span></div><div class="review-ans-text ref">${iconArrow} <span><b>Resposta correta: ${String.fromCharCode(65 + correctIndex)})</b> ${q.options[correctIndex]}</span></div>`;
            }
            htmlContent += `</div><div class="review-exp"><strong>💡 Output Técnico:</strong><p>${q.explanation}</p></div>`;
            reviewBox.innerHTML = htmlContent;
            reviewContent.appendChild(reviewBox);
        });
    }

    function getStoredHistory() {
        try {
            const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !Array.isArray(data.answers)) return null;
            return data;
        } catch (error) {
            console.warn("Não foi possível ler o histórico do quiz.", error);
            return null;
        }
    }

    function saveQuizHistory() {
        try {
            const safeAnswers = questions.map((_, index) => {
                const value = userAnswers[index];
                return Number.isInteger(value) ? value : null;
            });

            const payload = {
                score: calculateFinalScore(),
                total: questions.length,
                answers: safeAnswers,
                secondsElapsed,
                completedAt: new Date().toISOString(),
                pageUrl: window.location.href
            };

            localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(payload));
        } catch (error) {
            console.warn("Não foi possível salvar o histórico do quiz.", error);
        }
    }

    function renderHistoryCard() {
        if (!historyContainer || !historyScoreText) return;

        const history = getStoredHistory();
        if (!history) {
            historyContainer.classList.add("hidden");
            return;
        }

        const storedScore = Number.isFinite(Number(history.score)) ? Number(history.score) : 0;
        historyScoreText.textContent = String(storedScore);
        historyContainer.classList.remove("hidden");
    }

    function fillResultScreenFromCurrentState() {
        score = calculateFinalScore();
        updateScoreUI(score, questions.length);

        const m = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
        const s = (secondsElapsed % 60).toString().padStart(2, '0');
        document.getElementById('time-total-text').textContent = `${m}m ${s}s`;
        const avg = secondsElapsed > 0 ? (secondsElapsed / questions.length).toFixed(1) : 0;
        document.getElementById('time-avg-text').textContent = `${avg}s`;

        const scoreCircleUI = document.getElementById("score-circle-ui");
        if (scoreCircleUI) scoreCircleUI.classList.remove("gold-glow");
        feedbackText.classList.remove("perfect-score-text");

        if (score === questions.length) {
            feedbackText.textContent = "🏆 Auditoria impecável! Domínio absoluto dos paradigmas em Python!";
            feedbackText.classList.add("perfect-score-text");
            if (scoreCircleUI) scoreCircleUI.classList.add("gold-glow");
        } else if (score >= questions.length * 0.7) {
            feedbackText.textContent = "Build resistente! Sua base teórica em programação Python está bem sólida. 👍";
        } else {
            feedbackText.textContent = "Foram detectadas vulnerabilidades nos seus conhecimentos. Recomendo repassar a matriz do simulado. 📚";
        }

        generateReviewContent();
    }

    function openStoredReview() {
        const history = getStoredHistory();
        if (!history) {
            alert("Ainda não existe um gabarito salvo. Finalize uma simulação primeiro.");
            renderHistoryCard();
            return;
        }

        stopTimer();
        secondsElapsed = Number.isFinite(Number(history.secondsElapsed)) ? Number(history.secondsElapsed) : 0;
        userAnswers = questions.map((_, index) => {
            const value = history.answers[index];
            return Number.isInteger(value) ? value : null;
        });
        currentQuestionIndex = questions.length;
        isTransitioning = false;

        startScreen.classList.replace("active", "hidden");
        quizScreen.classList.replace("active", "hidden");
        quizScreen.classList.add("hidden");
        resultScreen.classList.replace("hidden", "active");

        fillResultScreenFromCurrentState();
        reviewContainer.classList.remove("hidden");
        isReviewVisible = true;
        showReviewBtn.textContent = "Ocultar logs";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function toggleReview() {
        isReviewVisible = !isReviewVisible;
        if (isReviewVisible) {
            reviewContainer.classList.remove("hidden");
            showReviewBtn.textContent = "Ocultar logs";
        } else {
            reviewContainer.classList.add("hidden");
            showReviewBtn.textContent = "Ver logs detalhados";
        }
    }

    // ==========================================
    // EXPORTAÇÃO INTELIGENTE (WHATSAPP + TEXTO DINÂMICO)
    // ==========================================
    async function exportReport() {
        const reportArea = document.getElementById("print-area");
        if (!reportArea) {
            showToast("Erro: Área de relatório não encontrada.");
            return;
        }

        if (typeof html2canvas !== "function") {
            showToast("Erro: Biblioteca html2canvas offline.");
            return;
        }

        const originalHTML = shareBtn.innerHTML;
        shareBtn.disabled = true;
        shareBtn.innerHTML = "Processando pacote...";

        try {
            const finalScore = calculateFinalScore();
            updateScoreUI(finalScore, questions.length);

            const categories = {
                'Fundamentos e Variáveis Python': [1, 3, 5, 7, 8, 12, 13, 16, 20, 21, 22],
                'Orientação a Objetos': [0, 2, 4, 6, 9, 10, 11, 14, 15, 23, 26, 27, 29],
                'Tkinter e Exceções': [17, 18, 24, 25, 28]
            };

            let missedCats = new Set();
            userAnswers.forEach((ans, i) => {
                if (ans !== getAnswer(questions[i])) {
                    for (let cat in categories) {
                        if (categories[cat].includes(i)) missedCats.add(cat);
                    }
                }
            });

            let improvementText = "";
            if (missedCats.size > 0) {
                improvementText = `⚠️ *Identifiquei vulnerabilidades nos seguintes tópicos:*\n- ${Array.from(missedCats).join('\n- ')}\n\n`;
            } else {
                improvementText = `🏆 *Build de sucesso! Nenhuma vulnerabilidade detectada.* Python master!\n\n`;
            }

            const pageUrl = window.location.href;
            const shareText = `🛡️ *Relatório LSTECHINFO TI | Python* 🛡️\n\n🎯 *Meu Desempenho:* ${finalScore} de ${questions.length} acertos!\n\n${improvementText}🔗 *Acesse o motor e teste seus conhecimentos:* ${pageUrl}`;

            const surfaceColor = getComputedStyle(document.body).getPropertyValue("--surface").trim() || null;
            const canvas = await html2canvas(reportArea, {
                backgroundColor: surfaceColor,
                scale: Math.min(2, window.devicePixelRatio || 1),
                useCORS: true
            });

            const fileName = `simulado-python-${finalScore}-de-${questions.length}.png`;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png", 1));
            if (!blob) throw new Error("Falha ao renderizar a imagem.");

            const file = new File([blob], fileName, { type: "image/png" });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Relatório Python V2",
                    text: shareText,
                    files: [file]
                });
                return;
            }

            downloadCanvasImage(canvas, fileName);
            window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText), '_blank');
            showToast("Relatório salvo e texto copiado para o Zap!");

        } catch (error) {
            if (error && (error.name === "AbortError" || error.name === "NotAllowedError")) {
                console.info("Compartilhamento cancelado.");
            } else {
                console.error("Erro no export:", error);
                showToast("Erro ao compartilhar o relatório.");
            }
        } finally {
            shareBtn.disabled = false;
            shareBtn.innerHTML = originalHTML;
        }
    }

    function downloadCanvasImage(canvas, fileName) {
        const imageUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function resetQuiz() {
        resultScreen.classList.replace("active", "hidden");
        showReviewBtn.textContent = "Ver logs detalhados";
        isReviewVisible = false;
        reviewContainer.classList.add("hidden");
        startQuiz();
    }

    // ==========================================
    // ANIMAÇÃO DE FUNDO (CYBER TOPO)
    // ==========================================
    function initNetworkCanvas() {
        const canvas = document.getElementById('network-bg');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height, particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = document.body.hasAttribute('data-theme') ? '#00ff88' : '#94a3b8';
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        function animate() {
            if (!document.body.classList.contains('no-effects')) {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    for (let j = i; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 120) {
                            ctx.beginPath();
                            ctx.strokeStyle = document.body.hasAttribute('data-theme') ? `rgba(0, 255, 136, ${1 - distance / 120})` : `rgba(148, 163, 184, ${1 - distance / 120})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            } else {
                ctx.clearRect(0, 0, width, height);
            }
            requestAnimationFrame(animate);
        }
        animate();
    }

    window.addEventListener('load', initNetworkCanvas);

})();