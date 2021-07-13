// $(".btnAssessment").click(function () {
//   $(this)
//     .parents(".row")
//     .find(".dynamic-row-1")
//     .toggleClass("col-md-6 col-md-12");
// });

// $(".btnMap").click(function () {
//   $(this)
//     .parents(".row")
//     .find(".dynamic-row-2")
//     .toggleClass("col-md-6 col-md-12");
// });

// $(".btnPopulation").click(function () {
//   $(this)
//     .parents(".row")
//     .find(".dynamic-row-3")
//     .toggleClass("col-md-8 col-md-12");
// });
// $("btnPopulation").click(function () {
//     $(".dynamic-columns .col:first").toggleClass("col-md-2 col-md-12");
// });

// $(".btnPieChart").click(function () {
//   $(this)
//     .parents(".row")
//     .find(".dynamic-row-4")
//     .toggleClass("col-md-4 col-md-12");
// });

// $(".btnGantt").click(function () {
//   $(this)
//     .parents(".row")
//     .find(".dynamic-row")
//     .toggleClass("col-md-12 col-md-3");
// });

$(".btnTable").click(function () {
  $(".dynamic-row-1").toggleClass("col-md-6 col-md-12");
});

$(".btnMap").click(function () {
  $(".dynamic-row-2").toggleClass("col-md-6 col-md-12");
});

$(".btnPopulation").click(function () {
  $(".dynamic-row-3").toggleClass("col-md-8 col-md-12");
});

$(".btnPieChart").click(function () {
  $(".dynamic-row-4").toggleClass("col-md-4 col-md-12");
});

$(document).ready(function () {
  $(".noArrays").removeClass("sorting");
});
