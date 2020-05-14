var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3,velocidade = 6,
estadoAtual, record,

estados = {
    jogar: 0,
    jogando:1,
    perdeu:2
},
chao = {
    //atributos da variavel
    y: 550,
    altura:50,
    cor:'#716978',
    
    //metodos
    desenha: function (){
        ctx.fillStyle = this.cor; //informando que vamos usar a cor especifica do atributo
        ctx.fillRect(0, this.y, LARGURA, this.altura);
    }
},

bloco = {
    x: 50,
    y:0,
    altura:50,
    largura:50,
    cor: "#ff4e4e",
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo: 20,
    qntPulos: 0,
    
    score: 0,

    atualiza: function(){
        this.velocidade += this.gravidade; // a medida que a velocidade vai aumentando vai incorporando a gravidade.
        this.y += this.velocidade;

        if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu)
            {
            this.y = chao.y - this.altura; //se o y do bloco for maior que o y do chão e altura do bloco
            this.qntPulos = 0;
            this.velocidade = 0;
        }
    },
    pula: function(){
        if(this.qntPulos < maxPulos){
            this.velocidade = -this.forcaDoPulo;
            this.qntPulos++;
        }
    },
    reset: function(){
        this.velocidade = 0;
        this.y = 0;
        if (this.score > record){
            localStorage.setItem("record", this.score);
            record = this.score;
        }
        this.score = 0;
    },
    desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.altura, this.largura);
    }
},
obstaculo = {
    _obs: [],
    cores:["#FF6347","#FF6A6A","#C1FFC1","#FFA500","#3CB371"],
    tempoInsere:0,

    insere: function(){
        this._obs.push({
            x:ALTURA,
            //largura: 30 + Math.floor(21 * Math.random()), // somar 30px + retonar um numero inteiro + (randomicamente um numero menor que 21)
            largura:50,
            altura: 30 + Math.floor(120 * Math.random()),
            cor:this.cores[Math.floor(5 * Math.random())]
        });
            this.tempoInsere = 40 + Math.floor(30* Math.random());
    },

    atualiza: function(){

        if (this.tempoInsere == 0)
            obstaculo.insere();

        
        else
        this.tempoInsere--;

        for (var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];

            obs.x -= velocidade;

            if (bloco.x < obs.x + obs.largura &&  bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura )
                estadoAtual = estados.perdeu;
            
            else if (obs.x == 0)
                bloco.score++;

            else if (obs.x <= - obs.largura){
                this._obs.splice(i,1);    
                tam--;
                i--;
            }   
        }

    },

    limpa: function(){
        this._obs = [];
    },

    desenha: function(){
        for (var i = 0, tam = this._obs.length; i < tam; i++){
            var obs = this._obs[i];
            ctx.fillStyle = obs.cor;
            ctx.fillRect (obs.x, chao.y - obs.altura, obs.largura, obs.altura);

        }
    }
}; 

// Para saber quando o usuario clica
function clique (event){

    if (estadoAtual == estados.jogando)
    bloco.pula();

    else if (estadoAtual == estados.jogar){
        estadoAtual = estados.jogando;
    }

    else if (estadoAtual == estados.perdeu){
        estadoAtual = estados.jogar;
        obstaculo.limpa();
        bloco.reset();
    }
};
//Função principal
function main (){
    ALTURA = window.innerHeight; // vai devolver o tamanho da janela do usuário
    LARGURA= window.innerWidth;

    if (LARGURA >= 500){
        LARGURA = 600;
        ALTURA = 600;
    }

    canvas = document.createElement("canvas");
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";
    
    ctx = canvas.getContext('2d'); //permite desenhar em 2d: circulo, retangulo
    document.body.appendChild(canvas);

    document.addEventListener("mousedown", clique);

    estadoAtual = estados.jogar;
    
    record = localStorage.getItem("record");
    if (record == null)
        record = 0;

    roda();
};

// Para rodar o jogo (loop).
function roda (){

        atualiza();
        desenha();

        window.requestAnimationFrame(roda);
};

//atualizar os status do personagem . status dos blocos.
function atualiza (){

     frames++;

     bloco.atualiza();

     if (estadoAtual == estados.jogando)
       
        obstaculo.atualiza();
        
    
};

//desenhar os personagem e cenário.
function desenha(){

    ctx.fillStyle = ('#7DA4C5');
    //pegando x=0 , y=0 sempre ao contrario topo direito descento ao inferior esquerdo.
    ctx.fillRect (0,0,LARGURA, ALTURA);

    ctx.fillStyle = "#fff";
    ctx.font ="50px Arial";
    ctx.fillText(bloco.score, 30, 38);

    if (estadoAtual == estados.jogar){
        ctx.fillStyle = "green",
        ctx.fillRect(LARGURA/ 2 - 50, ALTURA / 2 - 50 , 100,100)
    }

    else if(estadoAtual == estados.perdeu){
        ctx.fillStyle = "red",
        ctx.fillRect(LARGURA/ 2 - 50, ALTURA / 2 - 50 , 100,100)

        ctx.save();
        ctx.translate(LARGURA/ 2, ALTURA / 2);
        ctx.fillStyle="#fff";

        if (bloco.score < 10)
            ctx.fillText(bloco.score, -13, 19);


        else if (bloco.score >= 10  && bloco.score < 100)
            ctx.fillText(bloco.score, -26, 19);

        else 
            ctx.fillText(bloco.score, -45, 19);

        ctx.restore();
    }
    else if (estadoAtual == estados.jogando)
        obstaculo.desenha();
    

    chao.desenha (); //acessa a variavel chão e o metodo desenha.
    bloco.desenha();
};

//Inicializa o jogo
main ();