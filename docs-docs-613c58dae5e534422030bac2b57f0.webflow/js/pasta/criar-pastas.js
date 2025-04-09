document.addEventListener("DOMContentLoaded", function () {
  const selectAno = document.getElementById("categoria-3");
  const sucesso = document.querySelector(".sucesso");
  const erro = document.querySelector(".erro");
  const loading = document.querySelector(".loading");


  isLoading = () => {
      loading.style.display = "block";
  }

  closeLoading = () => {
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
    event.preventDefault(); // Evita o comportamento padrão do link

    // Capturar os valores do formulário
    const nome = document.getElementById("nome-do-an-ncio").value;
    const senha = document.getElementById("link-do-anuncio-2").value;
    const ano = document.getElementById("categoria-3").value;
    const token = localStorage.getItem("jwtToken");


    // Criar o objeto JSON para envio
    const data = {
      name: nome,
      year: parseInt(ano),
      password: senha
    };

    // Fazer o POST para a rota
    fetch("http://localhost:8080/api/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        console.log("Sucesso:", result);
        alert("Pasta criada com sucesso!");
        setTimeout(() => {
          window.location.href = "../main-dashboard.html";
        }, 1000);
      })
      .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao criar a pasta!");
      });
  });
});
