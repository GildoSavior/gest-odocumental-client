document.addEventListener("DOMContentLoaded", function () {
    const folderName = localStorage.getItem("selectedFolderName") || "Pasta desconhecida";
    const folderYear = localStorage.getItem("selectedFolderYear") || "Ano desconhecido";
    const subFolderName = localStorage.getItem("selectedSubFolderName") || "Subpasta desconhecida";
    const breadcrumb = document.querySelector(".text-block-113");
    const dropdownToggleText = document.querySelector(".dropdown-toggle div:nth-child(2)");
    const dropdownList = document.querySelector(".dropdown-list-4");



    const sucesso = document.querySelector(".sucesso");
    const erro = document.querySelector(".erro");
    const loading = document.querySelector(".loading");

    const isLoading = () => {
        loading.style.display = "block";
    }

    const closeLoading = () => {
        loading.style.display = "none";
    }

    if (dropdownList && dropdownToggleText) {
        dropdownList.innerHTML = "";

        const allLink = document.createElement("a");
        allLink.href = "#";
        allLink.className = "droplink-anos w-dropdown-link";
        allLink.textContent = "Todos";

        allLink.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("selectedFilterYear");
            dropdownToggleText.textContent = "Todos";
            location.reload();
        });

        dropdownList.appendChild(allLink);

        for (let year = 2025; year >= 2000; year--) {
            const link = document.createElement("a");
            link.href = "#";
            link.className = "droplink-anos w-dropdown-link";
            link.textContent = year;

            link.addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.setItem("selectedFilterYear", year);
                dropdownToggleText.textContent = year;
                location.reload();
            });

            dropdownList.appendChild(link);
        }

        const savedYear = localStorage.getItem("selectedFilterYear");
        dropdownToggleText.textContent = savedYear || "Todos";
    }

    const searchForm = document.querySelector(".search-3");
    const searchInput = document.getElementById("search");

    // Preencher o input com o valor salvo
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
        searchInput.value = savedQuery;
    }

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const searchQuery = searchInput.value.trim().toLowerCase();
            localStorage.setItem("searchQuery", searchQuery);
            location.reload(); // Recarrega a página para aplicar o filtro
        });
    }

    if (!breadcrumb) return;

    if (window.location.href.includes("inside-sub-folder")) {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName} > ${subFolderName}`;
    } else {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName}`;
    }
});
