var contractAddress = "0x01f69a26B043ffBBf8DB750FF936fE8Bb44ffDF7"; //V1.7.1

const DApp = {
    web3: null,
    contracts: {},
    account: null,

    init: function () {
        return DApp.initWeb3();
    },

    initWeb3: async function () {
        if (typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                DApp.account = accounts[0];
                window.ethereum.on('accountsChanged', DApp.updateAccount);
            } catch (error) {
                console.error("Usuário negou acesso ao web3!");
                return;
            }
            DApp.web3 = new Web3(window.ethereum);
        } else {
            console.error("Instalar MetaMask!");
            return;
        }
        return DApp.initContract();
    },

    updateAccount: async function () {
        DApp.account = (await DApp.web3.eth.getAccounts())[0];
        atualizaInterface();
    },

    initContract: async function () {
        DApp.contracts.Contrato = new DApp.web3.eth.Contract(abi, contractAddress);
        return DApp.render();
    },

    render: async function () {
        try {
            const projectList = await this.listProjects();
            renderProjects(projectList);
        } catch (error) {
            console.error("Não foi possível listar os projetos:", error);
        }
    },

    listProjects: async function () {
        try {
            let projectData = await DApp.contracts.Contrato.methods.listarProjetos().call();

            if (typeof projectData !== 'object' || !projectData.hasOwnProperty('0') || !projectData.hasOwnProperty('1')) {
                throw new Error('A estrutura dos dados retornados não é a esperada.');
            }

            const ids = projectData['0'];
            const names = projectData['1'];

            if (!Array.isArray(ids) || !Array.isArray(names)) {
                throw new Error('Os dados retornados não são arrays.');
            }

            const projects = ids.map((id, index) => {
                return {id: id, title: names[index]};
            });

            return projects;
        } catch (error) {
            console.error("Erro ao listar projetos:", error);
            throw error;
        }
    },

    createProject: async function (dados) {
        const { nome, descricao, metaFinanceira, dataFinalizacao } = dados;

        try {
            await DApp.contracts.Contrato.methods.cadastrarProjeto(
                nome,
                descricao,
                dataFinalizacao,
                metaFinanceira
            ).send({
                from: DApp.account
            }).then(() => {
                this.render();
            });
        } catch (error) {
            console.error("Erro ao cadastrar projeto:", error);
        }
    },

    viewProject: async function (id) {
        try {
            const projectDetails = await DApp.contracts.Contrato.methods.detalharProjeto(id).call({
                from: DApp.account
            });

            return projectDetails;

        } catch (error) {
            console.error("Erro ao visualizar detalhes do projeto:", error);
        }
    },

    donate: async function (id, value) {
        try {
            await DApp.contracts.Contrato.methods.apoiar(id).send({
                from: DApp.account,
                value: value
            }).then(() => {
                this.render();
            });

        } catch (error) {
            console.error("Erro ao doar para o projeto:", error);
        }
    },

    finish: async function (id) {
        try {
            await DApp.contracts.Contrato.methods.finalizarProjeto(id).send({
                from: DApp.account
            }).then(() => {
                this.render();
            }).catch(e => console.error("Erro ao finalizar projeto:", e));
        } catch (error) {
            console.error("Erro ao finalizar projeto:", error);
        }
    },

    createGoal: async function (idProjeto, titulo, descricao, valorMeta) {
        try {
            await DApp.contracts.Contrato.methods.cadastrarMeta(
                idProjeto,
                titulo,
                descricao,
                valorMeta
            ).send({
                from: DApp.account
            }).then(() => {
                this.render();
            });
        } catch (error) {
            console.error("Erro ao cadastrar meta:", error);
        }
    },

    listGoals: async function (idProjeto) {
        try {
            let projectData = await DApp.contracts.Contrato.methods.listarMetas(idProjeto).call();

            if (typeof projectData !== 'object' || !projectData.hasOwnProperty('0') || !projectData.hasOwnProperty('1')) {
                throw new Error('A estrutura dos dados retornados não é a esperada.');
            }

            const ids = projectData['0'];
            const titles = projectData['1'];
            const descriptions = projectData['2'];
            const values = projectData['3'];

            if (!Array.isArray(ids) || !Array.isArray(titles) || !Array.isArray(descriptions) || !Array.isArray(values)) {
                throw new Error('Os dados retornados não são arrays.');
            }

            const goals = ids.map((id, index) => {
                return {
                    id: id,
                    title: titles[index],
                    description: descriptions[index],
                    value: values[index]
                };
            });

            return goals;
        } catch (error) {
            console.error("Erro ao listar projetos:", error);
            throw error;
        }
    },

};