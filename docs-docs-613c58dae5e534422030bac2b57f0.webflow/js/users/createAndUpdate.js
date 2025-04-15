document.addEventListener("DOMContentLoaded", async function () {
    const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';
    const apiBaseUrl = `${BASE_URL}/users`;
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");
    const token = localStorage.getItem("jwtToken");


    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    const isLoading = () => loading.style.display = "block";
    const closeLoading = () => loading.style.display = "none";

    const allPermissions = [
        "allPermissions",
        "editOwnProfile",
        "manageUsers",
        "createDocuments",
        "editAndDeleteDocuments",
        "shareDocumentsInternally",
        "shareDocumentsExternally",
        "protectDocumentsAndFolders",
        "viewLogs"
    ];

    if (userId) {
        isLoading();
        try {
            const response = await fetch(`${apiBaseUrl}/id/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                const userData = result.data;

                document.getElementById("name").value = userData.name;
                document.getElementById("position").value = userData.position;
                document.getElementById("email").value = userData.email;
                document.getElementById("telefone").value = userData.phoneNumber;

                // Preenche permissões (radio buttons)
                const selectedPermissionKey = Object.entries(userData.permissions).find(([key, value]) => value === true)?.[0];

                if (selectedPermissionKey) {
                    const radio = document.querySelector(`input[name="permissions"][value="${selectedPermissionKey}"]`);
                    if (radio) radio.checked = true;
                }
            }

            closeLoading();
        } catch (error) {
            closeLoading();
            erro.style.display = "block";
            erro.querySelector(".paragraph-2").textContent = "Erro ao carregar usuário: " + error.message;
        }
    }

    // Evento de clique no botão de salvar/criar
    document.querySelector(".button-2.blue").addEventListener("click", async function (event) {
        event.preventDefault();
        isLoading();

        // Monta objeto de permissões baseado no radio selecionado
        const selectedPermission = document.querySelector('input[name="permissions"]:checked')?.value;
        const permissions = {};
        allPermissions.forEach(permission => {
            permissions[permission] = (permission === selectedPermission);
        });

        const user = {
            id: null,
            name: document.getElementById("name").value,
            position: document.getElementById("position").value,
            role: "USER",
            email: document.getElementById("email").value,
            phoneNumber: document.getElementById("telefone").value,
            enabled: true,
            isFirstLogin: true,
            permissions: permissions
        };

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        console.log(JSON.stringify(user))

        try {
            let response;
            if (userId) {
                response = await fetch(`${apiBaseUrl}/${user.email}`, {
                    method: "PUT",
                    headers,
                    body: JSON.stringify(user)
                });
            } else {
                response = await fetch(apiBaseUrl, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(user)
                });
            }

            const result = await response.json();

            if (response.ok && result.ok) {
                const fileInput = document.getElementById("image");
                if (fileInput && fileInput.files.length > 0) {
                    const formData = new FormData();
                    formData.append("file", fileInput.files[0]);

                    const uploadResponse = await fetch(`${apiBaseUrl}/upload/${result.data.email}`, {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${token}` },
                        body: formData
                    });

                    if (!uploadResponse.ok) {
                        closeLoading();
                        erro.style.display = "block";
                        erro.querySelector(".paragraph-2").textContent = "Erro ao criar utilizador: Não foi possível enviar a imagem.";
                        return;
                    }
                }

                closeLoading();
                sucesso.style.display = "block";
                sucesso.querySelector(".paragraph-2").textContent = "Utilizador criado com sucesso!";

                setTimeout(() => sucesso.style.display = "none", 1000);
                setTimeout(() => {
                    window.location.href = "../main-dashboard.html";
                }, 1000);
            } else {
                closeLoading();
                erro.style.display = "block";
                erro.querySelector(".paragraph-2").textContent = "Erro ao salvar usuário: " + result.message;
            }
        } catch (error) {
            closeLoading();
            erro.style.display = "block";
            erro.querySelector(".paragraph-2").textContent = "Erro ao salvar usuário: " + error.message;
        }
    });
});
