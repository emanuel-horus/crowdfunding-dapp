// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);

function onDocumentLoad() {
    DApp.init();
}

function renderProjects(projects) {
    const itemsList = document.getElementById('items-list');

    itemsList.innerHTML = '';

    if (projects.length === 0) {
        const noProjectsMessage = document.createElement('div');
        noProjectsMessage.classList.add('project-item', 'center-vertically');
        noProjectsMessage.innerHTML = `
            <span>Ainda não há projetos cadastrados</span>
        `;
        itemsList.appendChild(noProjectsMessage);
    } else {
        projects.forEach((project, index) => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project-item');
            projectDiv.innerHTML = `
            <span>${project.id}</span>
            <h3 class="project-title">${project.title}</h3>
            <button class="btn" data-bs-toggle="modal" data-bs-target="#projectDetailsModal" data-id="${project.id}">
                <img src="/dapp/assets/visibility.svg" alt="View">
            </button>
        `;
            itemsList.appendChild(projectDiv);

            // Correção: Seleciona o botão ao invés de um link
            const viewButton = projectDiv.querySelector(`button[data-id="${project.id}"]`);
            if (viewButton) {
                viewButton.addEventListener('click', () => openProjectDetailsModal(project.id));
            }
        });

    }
}

document.getElementById('new-project-register').addEventListener('click', () => {
    const form = document.getElementById('addProjectForm');

    const name = form.querySelector('input[name="name"]').value;
    const description = form.querySelector('textarea[name="description"]').value;
    const goalAmount = form.querySelector('input[name="goalAmount"]').value;
    const endDate =  Date.parse(form.querySelector('input[name="endDate"]').value);

    const projectData = {
        nome: name,
        descricao: description,
        metaFinanceira: goalAmount,
        dataFinalizacao: endDate,
    };

    DApp.createProject(projectData).then(() => {
        closeModal();
    });

    console.log(projectData);
});

function closeModal() {
    window.location.reload();
}

function openProjectDetailsModal(projectId) {
    DApp.viewProject(projectId).then(projectData => {

        // Preenche os detalhes do modal com os dados do projeto
        document.getElementById('projectName').textContent = projectData._nome;
        document.getElementById('projectDescription').textContent = projectData._descricao;
        document.getElementById('projectGoal').textContent = projectData._metaFinanceira + ' Wei'; // Exemplo de formatação
        document.getElementById('projectEndDate').textContent = new Date(parseInt(projectData._dataFinalizacao)).toLocaleDateString();
        document.getElementById('projectCreator').textContent = projectData._donoProjeto;
        document.getElementById('projectCreator').href = 'https://sepolia.etherscan.io/address/' +  projectData._donoProjeto;
        document.getElementById('projectFundsRaised').textContent = projectData._totalArrecadado + ' Wei'; // Exemplo de formatação
        document.getElementById('hiddenProjectId').value = projectData._id;
        document.getElementById('statusProject').textContent = projectData._status ? 'Projeto finalizado' : 'Projeto em andamento';

        updateProgressBar(projectData._totalArrecadado, projectData._metaFinanceira);

        listGoals(projectId, projectData._totalArrecadado, projectData._status);

        if (projectData._status) { // Assumindo que _status é verdadeiro quando o projeto está finalizado
            document.getElementById('finalizeProjectButton').style.display = 'none';
            document.getElementById('donateButton').style.display = 'none';
            document.getElementById('addGoalButton').style.display = 'none';
        } else {
            document.getElementById('finalizeProjectButton').style.display = 'block';
            document.getElementById('donateButton').style.display = 'block';
            document.getElementById('addGoalButton').style.display = 'block';
        }


    }).catch(error => {
        console.error('Erro ao buscar detalhes do projeto:', error);
    });
}

function listGoals(projectId, projectValue, projectStatus) {
    DApp.listGoals(projectId).then(goals => {
        var goalsList = document.getElementById('projectGoalsList');
        goalsList.innerHTML = '';

        goals.forEach(goal => {
            var card = document.createElement('div');
            card.className = 'card mb-2';

            var cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            var header = document.createElement('div');
            header.className = 'd-flex justify-content-between';

            var goalId = document.createElement('h5');
            goalId.className = 'card-subtitle mb-2 bold';
            goalId.textContent = `#${goal.id} - ${goal.title}`;

            var status = document.createElement('p');
            status.className = 'badge';
            if (parseInt(projectValue) >= parseInt(goal.value)) {
                status.classList.add('badge-success');
                status.textContent = 'Meta atingida';
            } else if (parseInt(projectValue) < parseInt(goal.value) && !projectStatus){
                status.classList.add('badge-warning');
                status.textContent = 'Em progresso';
            } else {
                status.classList.add('badge-error');
                status.textContent = 'Meta não alcançada';
            }

            header.appendChild(goalId);
            header.appendChild(status); // Adicionando o status ao header

            var goalDescription = document.createElement('p');
            goalDescription.className = 'card-text';
            goalDescription.textContent = goal.description;

            var goalValue = document.createElement('p');
            goalValue.className = 'card-text';
            goalValue.innerHTML = `<strong>Valor para atingir:</strong> ${goal.value} Wei`;

            cardBody.appendChild(header); // Adicionando o header ao cardBody
            cardBody.appendChild(goalDescription);
            cardBody.appendChild(goalValue);
            card.appendChild(cardBody);

            document.getElementById('projectGoalsList').appendChild(card);
        });

    }).catch(error => {
        console.error('Erro ao listar metas:', error);
    });
}


function setProjectId() {
    console.log("setProjectId chamada");
    var projectId = document.getElementById('hiddenProjectId').value;
    console.log("projectId: ", projectId);
    document.getElementById('projectId').value = projectId;
}

document.addEventListener('DOMContentLoaded', function() {
    var donationForm = document.getElementById('donationForm');

    donationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var projectId = document.getElementById('projectId').value;
        var donationAmount = document.getElementById('donationAmount').value;

        console.log('ID do Projeto:', projectId);
        console.log('Valor da Doação:', donationAmount);

        DApp.donate(projectId, donationAmount).then(r => {
            closeModal();
        });
    });
});

function updateProgressBar(totalArrecadado, metaFinanceira) {
    // Convertendo BigInt para Number, se necessário
    var total = typeof totalArrecadado === 'bigint' ? Number(totalArrecadado) : totalArrecadado;
    var meta = typeof metaFinanceira === 'bigint' ? Number(metaFinanceira) : metaFinanceira;

    var percentual = (total / meta) * 100;
    percentual = Math.min(Math.max(percentual, 0), 100); // Garante que o valor está entre 0 e 100

    var progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentual + '%';
    progressBar.setAttribute('aria-valuenow', percentual);
    progressBar.textContent = percentual.toFixed(2) + '%';
}

function finalizeProject() {
    var projectId = document.getElementById('hiddenProjectId').value;

    console.log("Finalizando o projeto com ID:", projectId);

    DApp.finish(projectId).then(r => {
        console.log("Deu certo papai");
        closeModal();
    }).catch(error => {
        console.error("Erro ao finalizar o projeto:", error);
        Swal.fire({
            title: 'Erro!',
            text: 'Não foi possível finalizar o projeto.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    });
}

function prepareGoalModal() {
    var projectId = document.getElementById('hiddenProjectId').value;
    document.getElementById('goalProjectId').value = projectId;
}

function submitGoalForm() {
    var projectId = document.getElementById('goalProjectId').value;
    var title = document.getElementById('goalTitle').value;
    var description = document.getElementById('goalDescription').value;
    var value = document.getElementById('goalValue').value;

    console.log("Enviando metas para o projeto ID:", projectId);

    DApp.createGoal(projectId, title, description, value).then(r => {
        console.log("Meta cadastrada com sucesso");
        closeModal();
    }).catch(error => {
        console.error("Erro ao cadastrar meta:", error);
    });
}























