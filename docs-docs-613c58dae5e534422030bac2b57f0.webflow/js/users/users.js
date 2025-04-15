document.addEventListener("DOMContentLoaded", async () => {

  const BASE_URL = window.BASE_URL || 'https://gest-odocumental.onrender.com/api';

  const sucesso = document.querySelector(".sucesso");
  const erro = document.querySelector(".erro");
  const loading = document.querySelector(".loading");

  const isLoading = () => {
    loading.style.display = "block";
  }

  const closeLoading = () => {
    loading.style.display = "none";
  }

  const container = document.querySelector(".columns-3.w-row");


  const token = localStorage.getItem("jwtToken");// Substitua pelo token real

  try {

    isLoading(); // Inicia o loading
    const response = await fetch(`${BASE_URL}/users`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      closeLoading();  
      erro.style.display = "block";
      erro.querySelector(".paragraph-2").textContent = "Erro ao carregar utilizadores: " + error.message;
      return      
    }

    closeLoading(); 

    const users = result.data.content;

    container.innerHTML = ""; 

    users.forEach(user => {
      const column = document.createElement("div");
      column.className = "new-column w-col w-col-3";

      column.innerHTML = `
          <a href="../user/user-log.html?id=${user.id}" class="c-funcionario w-inline-block">
            <div class="c-funcionario-foto" style="background-image: url('${user.imageUrl}'); background-size: cover; background-position: center;"></div>
            <div>
              <h1 class="c-funcionario_name">${user.name}</h1>
              <div class="text-block-102">${user.position}</div>
            </div>
          </a>
        `;

      container.appendChild(column);
    });

  } catch (error) {
    closeLoading();  
    erro.style.display = "block";
    erro.querySelector(".paragraph-2").textContent = "Não foi possível carregar os utilizadores: " + error.message;    
  }
});