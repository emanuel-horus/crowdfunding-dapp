// SPDX-License-Identifier: MIT
// Aluno 01: Emanuel Targino Barbosa
// Aluno 02: João Vitor de Oliveira Santos
// Contrato deployado: 0x01f69a26B043ffBBf8DB750FF936fE8Bb44ffDF7

pragma solidity ^0.8.20;

contract Crowdfunding {
    struct Projeto {
        uint256 id;
        string nome;
        string descricao;
        uint dataFinalizacao;
        uint metaFinanceira;
        uint totalArrecadado;
        bool status;
        address donoProjeto;
        mapping(address => uint) apoiadores;
        uint contadorMetas;
        mapping(uint => Meta) metas;
    }

    struct Meta {
        uint256 id;
        string titulo;
        string descricao;
        uint valorMeta;
    }

    address private dono;
    uint256 private taxa = 10;
    uint private contadorProjetos;
    mapping(uint => Projeto) private projetos;

    constructor() {
        dono = msg.sender;
    }

    function cadastrarProjeto(string memory nome, string memory descricao, uint dataFinalizacao, uint metaFinanceira) public {
        Projeto storage novoProjeto = projetos[contadorProjetos];
        novoProjeto.id = contadorProjetos;
        novoProjeto.nome = nome;
        novoProjeto.descricao = descricao;
        novoProjeto.dataFinalizacao = dataFinalizacao;
        novoProjeto.metaFinanceira = metaFinanceira;
        novoProjeto.totalArrecadado = 0;
        novoProjeto.status = false;
        novoProjeto.donoProjeto = msg.sender;
        novoProjeto.contadorMetas = 0;
        contadorProjetos++;
    }

    function listarProjetos() public view returns (uint256[] memory, string[] memory) {
        uint256[] memory ids = new uint256[](contadorProjetos);
        string[] memory nomes = new string[](contadorProjetos);

        for (uint i = 0; i < contadorProjetos; i++) {
            Projeto storage projeto = projetos[i];
            ids[i] = projeto.id;
            nomes[i] = projeto.nome;
        }

        return (ids, nomes);
    }

    function detalharProjeto(uint id) public view returns (uint _id, string memory _nome, string memory _descricao, uint _dataFinalizacao, uint _metaFinanceira, uint _totalArrecadado, bool _status, address _donoProjeto) {
        Projeto storage projeto = projetos[id];
        require(projeto.donoProjeto != address(0), "Erro ID do projeto invalido ou projeto nao encontrado");
        return (
            projeto.id,
            projeto.nome,
            projeto.descricao,
            projeto.dataFinalizacao,
            projeto.metaFinanceira,
            projeto.totalArrecadado,
            projeto.status,
            projeto.donoProjeto
        );
    }

    function apoiar(uint id) public payable {
        Projeto storage projeto = projetos[id];
        require(projeto.donoProjeto != address(0), "Erro ID do projeto invalido ou projeto nao encontrado");
        require(!projeto.status, "Erro Nao eh possivel apoiar um projeto finalizado");
        require(block.timestamp < projeto.dataFinalizacao, "Erro So eh possivel apoiar projetos ativos");

        projeto.totalArrecadado += msg.value;
        projeto.apoiadores[msg.sender] += msg.value;
    }

    function finalizarProjeto(uint id) public payable {
        Projeto storage projeto = projetos[id];
        
        require(projeto.donoProjeto != address(0), "Erro ID do projeto invalido ou projeto nao encontrado");
        require(projeto.donoProjeto == msg.sender, "Erro Somente o dono do projeto pode finalizar o projeto");
        require(!projeto.status, "Erro Este projeto ja foi finalizado");
        require(projeto.totalArrecadado >= projeto.metaFinanceira || block.timestamp > projeto.dataFinalizacao, "Erro Projeto nao pode ser finalizado ate que a meta financeira seja atingida ou a data de finalizacao seja ultrapassada");

        uint valorDonoContrato = projeto.totalArrecadado / taxa;
        uint valorDonoProjeto = projeto.totalArrecadado - valorDonoContrato;

        payable(dono).transfer(valorDonoContrato);
        payable(projeto.donoProjeto).transfer(valorDonoProjeto);

        projeto.status = true;
    }

    function cadastrarMeta(uint idProjeto, string memory titulo, string memory descricao, uint valorMeta) public {
        Projeto storage projeto =  projetos[idProjeto];
        require(projeto.donoProjeto != address(0), "Erro ID do projeto invalido ou projeto nao encontrado");
        require(projeto.donoProjeto == msg.sender, "Erro Somente o dono do projeto pode adicionar metas");
        require(!projeto.status, "Erro Nao e possivel adicionar metas a um projeto finalizado");
        require(block.timestamp < projeto.dataFinalizacao, "Erro Metas so podem ser adicionadas a projetos ativos");
        require(valorMeta <= projeto.metaFinanceira, "Erro Valor da meta nao pode exceder a meta financeira total do projeto");
        Meta storage novaMeta = projeto.metas[projeto.contadorMetas];
        novaMeta.id = projeto.contadorMetas;
        novaMeta.titulo = titulo;
        novaMeta.descricao = descricao;
        novaMeta.valorMeta = valorMeta;
        projeto.contadorMetas += 1;
    }

    function listarMetas(uint idProjeto) public view returns (uint256[] memory, string[] memory, string[] memory, uint256[] memory) {
        Projeto storage projeto =  projetos[idProjeto];
        require(projeto.donoProjeto != address(0), "Erro ID do projeto invalido ou projeto nao encontrado");
        uint quantidadeMetas = projeto.contadorMetas;
        uint256[] memory ids = new uint256[](quantidadeMetas);
        string[] memory titulos = new string[](quantidadeMetas);
        string[] memory descricoes = new string[](quantidadeMetas);
        uint256[] memory valores = new uint256[](quantidadeMetas);

        for (uint i = 0; i < quantidadeMetas; i++) {
            Meta storage meta = projeto.metas[i];
            ids[i] = meta.id;
            titulos[i] = meta.titulo;
            descricoes[i] = meta.descricao;
            valores[i] = meta.valorMeta;
        }

        return (ids, titulos, descricoes, valores);
    }
}
