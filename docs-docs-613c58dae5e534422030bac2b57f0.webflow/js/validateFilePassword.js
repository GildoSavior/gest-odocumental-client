document.addEventListener("DOMContentLoaded", function () {

  localStorage.removeItem("selectedFileId");
  localStorage.removeItem("selectedFolderId");
  localStorage.removeItem("selectedFilePath");



  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.value = "";
    passwordInput.addEventListener("input", () => {
      console.log("Senha digitada:", passwordInput.value);
    });
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
      alert("Por favor, digite a senha.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Erro: Usuário não autenticado.");
      return;
    }

    const urlAtual = window.location.href;
    const isMainFolder = urlAtual.includes("main-dashboard.html") || urlAtual.includes("inside-folder.html");

    let apiUrl = "";
    let sucessoCallback;

    if (fileId) {
      apiUrl = `http://localhost:8080/api/files/${fileId}/password/${password}`;

      sucessoCallback = () => {
        document.querySelector(".w-form-done").style.display = "block";
        document.querySelector(".w-form-done div").textContent = "Arquivo aberto com sucesso!";
        window.open(filePath, "_blank");
      };
    } else {
      apiUrl = `http://localhost:8080/api/folders/${folderId}/password/${password}`;
      
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
          if (fileId) {          
            window.location.reload();
            return;
          }
          window.location.href = isMainFolder ? "main-dashboard.html" : "../main-dashboard.html";
        }, 2000);
      }

    } catch (error) {
      console.error("Erro ao verificar senha:", error);
      alert("Erro ao conectar com o servidor.");
    }
  });
});
