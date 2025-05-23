document.addEventListener("DOMContentLoaded", function () {

  const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';

  const selectAno = document.getElementById("categoria-3");
  const sucesso = document.querySelector(".sucesso");
  const erro = document.querySelector(".erro");
  const loading = document.querySelector(".loading");

  const isLoading = () => {
    loading.style.display = "block";
  }

  const closeLoading = () => {
    loading.style.display = "none";
  }

  selectAno.innerHTML = ""; // Limpa opções iniciais

  for (let ano = 2000; ano <= 2025; ano++) {
    const option = document.createElement("option");
    option.value = ano;
    option.textContent = ano;
    selectAno.appendChild(option);
  }

  // Capturar o clique no botão Criar Pasta
  document.querySelector(".button.blue").addEventListener("click", function (event) {
    event.preventDefault();

    isLoading();
    const nome = document.getElementById("nome-do-an-ncio").value;
    const senha = document.getElementById("link-do-anuncio-2").value;
    const ano = document.getElementById("categoria-3").value;
    const token = localStorage.getItem("jwtToken");


    const data = {
      name: nome,
      year: parseInt(ano),
      password: senha
    };

    fetch(`${BASE_URL}/folders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        closeLoading();
        if (result.ok) {
          sucesso.style.display = "block";
          setTimeout(() => {
            window.location.href = "../main-dashboard.html";
          }, 500);
        } else {
          erro.style.display = "block";
          erro.querySelector(".paragraph-2").textContent = result.message || "Erro ao criar pasta";
        }
      })
      .catch(error => {
        closeLoading();
        erro.style.display = "block";
      });
  });
});
