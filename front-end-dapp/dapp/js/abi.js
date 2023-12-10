const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "apoiar",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "idProjeto",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "titulo",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "descricao",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "valorMeta",
                "type": "uint256"
            }
        ],
        "name": "cadastrarMeta",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "nome",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "descricao",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "dataFinalizacao",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "metaFinanceira",
                "type": "uint256"
            }
        ],
        "name": "cadastrarProjeto",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "detalharProjeto",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_nome",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_descricao",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_dataFinalizacao",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_metaFinanceira",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalArrecadado",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_status",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "_donoProjeto",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "finalizarProjeto",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "idProjeto",
                "type": "uint256"
            }
        ],
        "name": "listarMetas",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "listarProjetos",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]