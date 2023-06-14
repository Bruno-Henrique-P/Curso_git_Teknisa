function validaCPF(){
    const cpformatado = document.getElementById('cpf').value;

    const cpf = limpaFomatacao(cpformatado);
    
    if(cpf.length != 11){
        mostraResultado('CPF deve conter 11 digitos','red');
        return;
    }
    if(verificaDigitosRepetidos(cpf)){
        mostraResultado('CPF tem todos os digitos repetidos','red');
        return
    }

    if(!(calcularDigitoVerificador(cpf,1))){
        mostraResultado(`CPF invalido ${cpf}`,'red');
        return;
    }
    if(!(calcularDigitoVerificador(cpf,2))){
        mostraResultado(`CPF invalido ${cpf}`,'red');
        return;
    }
    mostraResultado(`CPF valido ${cpf}` ,'green');
    
}

function calcularDigitoVerificador(cpf,posicao){
    const sequencia = cpf.slice(0,8 + posicao).split('');

    let soma = 0;
    let multiplicador = 9 + posicao;

    for(const numero of sequencia){
        soma += multiplicador* Number(numero);
        multiplicador--;
    }

    const restoDivisao = (soma*10) % 11;
    const digito = cpf.slice(8+posicao,9+posicao);

    return restoDivisao == digito;
}

function limpaFomatacao(cpf){
    cpf = cpf.replace(/\D/g,'');
    return cpf;
}

function mostraResultado(texto,cor){
    const span = document.getElementById('resultado');

    span.innerHTML = texto;
    span.style.color = cor;
}

function verificaDigitosRepetidos(cpf){
    return cpf.split('').every((d) => d == cpf[0]);
}