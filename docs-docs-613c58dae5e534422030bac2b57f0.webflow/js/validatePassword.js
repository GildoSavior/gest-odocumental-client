document.addEventListener("DOMContentLoaded", function () {

  const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';

  localStorage.removeItem("selectedFileId");
  localStorage.removeItem("selectedFolderId");
  localStorage.removeItem("selectedFilePath");

  const closeButton = document.getElementById("close-password-wrapper");  // Verifica se o botão de fechar existe

  // Verifica se o botão de fechar existe antes de adicionar o evento
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      const passwordWrapper = document.querySelector(".password-wrapper");
      if (passwordWrapper) {
        passwordWrapper.style.display = "none";  // Torna a div .password-wrapper invisível
      }
    });
  }

  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.value = "";
  }

  const passwordWrapper = document.querySelector(".password-wrapper");

  if (passwordWrapper) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function () {
        if (passwordWrapper.style.display === "none") {
          passwordWrapper.style.display = "flex";
        }
      });
    });

    observer.observe(passwordWrapper, { attributes: true, attributeFilter: ["style"] });
  }

  const abrirButton = document.querySelector(".button.blue");

  abrirButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const fileId = localStorage.getItem("selectedFileId");
    const folderId = localStorage.getItem("selectedFolderId");
    const filePath = localStorage.getItem("selectedFilePath");

    if (!fileId && !folderId) {
      alert("Erro: Nenhum arquivo ou pasta selecionado.");
      return;
    }

    const password = passwordInput.value;
    if (!password) {
      document.querySelector(".w-form-fail").style.display = "block";
      document.querySelector(".w-form-fail div").textContent = "Por favor, digite a senha";
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      document.querySelector(".w-form-fail").style.display = "block";
      document.querySelector(".w-form-fail div").textContent = "Erro: Usuário não autenticado";
      return;
    }

    const urlAtual = window.location.href;
    const isMainFolder = urlAtual.includes("main-dashboard.html") || urlAtual.includes("inside-folder.html");

    let apiUrl = "";
    let sucessoCallback;

    if (fileId) {
      apiUrl = `${BASE_URL}/files/${fileId}/password/${password}`;

      sucessoCallback = () => {
        document.querySelector(".w-form-done").style.display = "block";
        document.querySelector(".w-form-done div").textContent = "Arquivo aberto com sucesso!";
        window.open(filePath, "_blank");
      };
    } else {
      apiUrl = `${BASE_URL}/folders/${folderId}/password/${password}`;

      sucessoCallback = () => {
        document.querySelector(".w-form-done").style.display = "block";
        document.querySelector(".w-form-done div").textContent = "Pasta aberta com sucesso!";
        setTimeout(() => {
          const destino = isMainFolder
            ? `pastas/inside-folder.html?id=${folderId}`
            : `inside-sub-folder.html?id=${folderId}`;
          window.location.href = destino;
        }, 2000);
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (result.data === true) {
        sucessoCallback();
      } else {
        document.querySelector(".w-form-fail").style.display = "block";
        document.querySelector(".w-form-fail div").textContent = result.message;

        setTimeout(() => {
          document.querySelector(".w-form-fail").style.display = "none";
          passwordInput.value = "";  // Limpa o campo de senha
        }, 2000);
      }

    } catch (error) {
      console.error("Erro ao verificar senha:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
