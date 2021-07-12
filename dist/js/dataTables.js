$(function () {
  $("#myTable")
    .DataTable({
      responsive: true,
      lengthChange: true,
      autoWidth: false,
      buttons: ["copy", "csv", "excel", "pdf", "print"],
    })
    .buttons()
    .container()
    .appendTo("#funcMenu");
});
