function toggleColDisplay(_col) {

    var headercol = document.getElementById("header-col-"+ _col);

    var child = headercol.childNodes[1];
    var colname = child.innerHTML;
    var bodycols = Array.from(document.getElementsByClassName("col-" + colname));
    var button = document.getElementById("display-row-" + _col);

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