
document.addEventListener("DOMContentLoaded", async function () {
    
    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';
    
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");
    const token = localStorage.getItem("jwtToken"); // Recupera o token salvo no localStorage

    if (!token) {
        console.error("Token não encontrado. O usuário precisa estar autenticado.");
        mostrarMensagemErro("Erro: Sessão expirada. Faça login novamente.");
        return;
    }

    if (userId) {
        try {
            // Buscar informações do usuário
            const userResponse = await fetch(`${BASE_URL}/users/id/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const userResult = await userResponse.json();

            if (!userResult.ok) {
                throw new Error(userResult.message || "Erro ao buscar usuário.");
            }

            preencherDadosUsuario(userResult.data);

            // Buscar logs do usuário
            const logsResponse = await fetch(`${BASE_URL}/logs/user/${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const logsResult = await logsResponse.json();

            if (!logsResult.ok) {
                throw new Error(logsResult.message || "Erro ao buscar logs.");
            }

            preencherLogsUsuario(logsResult.data);

            const editUserLink = document.querySelector(".link-block-6.bilial.w-inline-block");

            if (editUserLink) {
                editUserLink.href = `../user/edit-user.html?id=${userId}`;
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            mostrarMensagemErro(error.message);
        }
    }
});

// Função para preencher os dados do usuário no HTML
function preencherDadosUsuario(user) {
    document.getElementById("name").textContent = user.name || "N/A";
    document.getElementById("position").textContent = user.position || "N/A";
    document.getElementById("telefone").textContent = user.phoneNumber || "N/A";
    document.getElementById("email").textContent = user.email || "N/A";

    // Preencher o avatar
    const avatarElement = document.querySelector(".parceiro-avatar");
    if (user.imageUrl) {
        avatarElement.style.backgroundImage = `url('${user.imageUrl}')`;
        avatarElement.style.backgroundSize = "cover";
        avatarElement.style.backgroundPosition = "center";
        avatarElement.style.borderRadius = "50%"; // Deixa a imagem redonda, se necessário
    }
}
// Função para preencher os logs do usuário no HTML (mantendo o mesmo estilo)
function preencherLogsUsuario(logs) {
    const logsContainer = document.querySelector(".column._80 .div-block-91");

    logsContainer.innerHTML = ""; // Limpa logs antigos

    if (!logs || logs.length === 0) {
        logsContainer.style.display = "none"; // Oculta a área de logs se não houver dados
        return;
    }

    logsContainer.style.display = "block"; // Garante que a área apareça se houver logs

    logs.forEach(log => {
        const logElement = document.createElement("div");
        logElement.classList.add("div-block-91", "w-clearfix");

        const dateElement = document.createElement("div");
        dateElement.classList.add("text-block-106");
        dateElement.textContent = `Data: ${formatarData(log.timestamp)}`;

        const descriptionElement = document.createElement("div");
        descriptionElement.classList.add("text-block-107");
        descriptionElement.textContent = `${log.details} - ${log.fileName} (${log.folderName})`;

        logElement.appendChild(dateElement);
        logElement.appendChild(descriptionElement);
        logsContainer.appendChild(logElement);
    });
}

// Função para formatar a data no padrão DD/MM/YYYY HH:mm:ss
function formatarData(timestamp) {
    const data = new Date(timestamp);
    return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR");
}

// Função para exibir mensagens de erro no HTML
function mostrarMensagemErro(mensagem) {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-message");
    errorContainer.style.color = "red";
    errorContainer.style.fontWeight = "bold";
    errorContainer.textContent = mensagem;

    document.body.prepend(errorContainer);
}