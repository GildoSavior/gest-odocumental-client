document.addEventListener("DOMContentLoaded", function () {

    const folderName = localStorage.getItem("selectedFolderName") || "Pasta desconhecida";
    const folderYear = localStorage.getItem("selectedFolderYear") || "Ano desconhecido";
    const subFolderName = localStorage.getItem("selectedSubFolderName") || "Subpasta desconhecida";
    const breadcrumb = document.querySelector(".text-block-113");

    if (!breadcrumb) return;

    if (window.location.href.includes("inside-sub-folder")) {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName} > ${subFolderName}`;
    } else {
        breadcrumb.textContent = `Início > ${folderYear} > ${folderName}`;
    }

});
