function toggleRowDisplay(_row) {

    var row = document.getElementById("row-"+ _row);
    var bodyrows = Array.from(document.getElementsByClassName("row-"+_row));
    var button = document.getElementById("display-row-" + _row);

    if (row.style.display === "none") 
    {
        row.style.display = "block";
        bodyrows.forEach((element) => element.style.display="block");
        button.classList.remove("button-activated");
    } 
    else 
    {
        row.style.display = "none";
        bodyrows.forEach((element) => element.style.display="none");
        button.classList.add("button-activated");
    }
}