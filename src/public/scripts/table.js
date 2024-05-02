function toggleColDisplay(_col) {

    var headercol = document.getElementById("header-col-"+ _col);

    var child = headercol.childNodes[1];
    var colname = child.innerHTML;
    var bodycols = Array.from(document.getElementsByClassName("table-cell-" + colname));
    var button = document.getElementById("display-row-" + _col);

    console.log(bodycols[0]);

    if (headercol.style.display === "none") 
    {
        headercol.style.display = "block";
        bodycols.forEach((element) => element.style.display="block");
        button.classList.remove("button-activated");
    } 
    else 
    {
        headercol.style.display = "none";
        bodycols.forEach((element) => element.style.display="none");
        button.classList.add("button-activated");
    }
}

function toggleColDisplayMenu()
{
    var button = document.getElementById("toggle-row-menu-button");
    var container = document.getElementById("toggle-row-button-container");

    if (container.style.display === "none") 
    {
        container.style.display = "flex";
        button.classList.add("button-activated");
    } 
    else 
    {
        container.style.display = "none";
        button.classList.remove("button-activated");
    }
}