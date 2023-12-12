toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

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
                <img src="assets/visibility.svg" alt="View">
            </button>
        `;
            itemsList.appendChild(projectDiv);

            const viewButton = projectDiv.querySelector(`button[data-id="${project.id}"]`);
            if (viewButton) {
                viewButton.addEventListener('click', () => openProjectDetailsModal(project.id));
            }
        });

    }
}

document.getElementById('new-project-register').addEventListener('click', (e) => {
    e.preventDefault()
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

    if (validateProjectData(projectData)) {
        DApp.createProject(projectData).then(() => {
            closeModal();
        });
    }
});

function validateProjectData(data) {
    if (!data.nome || !data.descricao || data.metaFinanceira === undefined || data.metaFinanceira === '' || !data.dataFinalizacao) {
        toastr.error("Todos os campos devem ser preenchidos.", "Erro de Validação");
        return false;
    }
    const currentDate = new Date();
    const endDate = new Date(data.dataFinalizacao);
    if (endDate < currentDate) {
        toastr.error("A data de finalização não pode ser anterior à data atual.", "Erro de Validação");
        return false;
    }
    return true;
}

function closeModal() {
    window.location.reload();
}

function openProjectDetailsModal(projectId) {
    DApp.viewProject(projectId).then(projectData => {

        document.getElementById('projectName').textContent = projectData._nome;
        document.getElementById('projectDescription').textContent = projectData._descricao;
        document.getElementById('projectGoal').textContent = projectData._metaFinanceira + ' Wei';
        document.getElementById('projectEndDate').textContent = new Date(parseInt(projectData._dataFinalizacao)).toLocaleDateString();
        document.getElementById('projectCreator').textContent = projectData._donoProjeto;
        document.getElementById('projectCreator').href = 'https://sepolia.etherscan.io/address/' +  projectData._donoProjeto;
        document.getElementById('projectFundsRaised').textContent = projectData._totalArrecadado + ' Wei';
        document.getElementById('hiddenProjectId').value = projectData._id;
        document.getElementById('statusProject').textContent = projectData._status ? 'Projeto finalizado' : 'Projeto em andamento';

        updateProgressBar(projectData._totalArrecadado, projectData._metaFinanceira);

        listGoals(projectId, projectData._totalArrecadado, projectData._status);

        if (projectData._status) {
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

        const sortedGoals = goals.sort((a, b) => {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
            }
            return 0;
        });
        sortedGoals.forEach(goal => {
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
            header.appendChild(status);

            var goalDescription = document.createElement('p');
            goalDescription.className = 'card-text';
            goalDescription.textContent = goal.description;

            var goalValue = document.createElement('p');
            goalValue.className = 'card-text';
            goalValue.innerHTML = `<strong>Valor para atingir:</strong> ${goal.value} Wei`;

            cardBody.appendChild(header);
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
    var projectId = document.getElementById('hiddenProjectId').value;
    document.getElementById('projectId').value = projectId;
}

document.addEventListener('DOMContentLoaded', function() {
    var donationForm = document.getElementById('donationForm');

    donationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var projectId = document.getElementById('projectId').value;
        var donationAmount = document.getElementById('donationAmount').value;

        if (validateDonationData(donationAmount)) {
            DApp.donate(projectId, donationAmount).then(r => {
                closeModal();
            });
        }
    });
});

function validateDonationData(data) {
    if (data === undefined || data === '') {
        toastr.error("Por favor, preencha o campo Valor da Doação.", "Erro de Validação");
        return false;
    }
    return true;
}

function updateProgressBar(totalArrecadado, metaFinanceira) {
    var total = typeof totalArrecadado === 'bigint' ? Number(totalArrecadado) : totalArrecadado;
    var meta = typeof metaFinanceira === 'bigint' ? Number(metaFinanceira) : metaFinanceira;

    var percentual = (total / meta) * 100;
    percentual = Math.min(Math.max(percentual, 0), 100);

    var progressBar = document.getElementById('progressBar');
    progressBar.style.width = percentual + '%';
    progressBar.setAttribute('aria-valuenow', percentual);
    progressBar.textContent = percentual.toFixed(2) + '%';
}

function finalizeProject() {
    var projectId = document.getElementById('hiddenProjectId').value;

    DApp.finish(projectId).then(r => {
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

    if (validateGoal(title, description, value)) {
        DApp.createGoal(projectId, title, description, value).then(r => {
            closeModal();
        }).catch(error => {
            console.error("Erro ao cadastrar meta:", error);
        });
    }
}

function validateGoal(title, description, value) {
    if (!title || !description || value === undefined || value === '') {
        toastr.error("Todos os campos devem ser preenchidos.", "Erro de Validação");
        return false;
    }
    return true;
}
