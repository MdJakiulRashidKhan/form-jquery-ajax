$(document).ready(function () {
  // Initialize Select2 for the languages dropdown
  $("#languages").select2({
    placeholder: "Select language",
    allowClear: true,
  });

  // Add Education row
  $("#addEducationRow").click(function () {
    var newRow = $("#education-table tbody .education-row").first().clone(); // Ensure only the first row is cloned
    var rowCount = $("#education-table tbody .education-row").length + 1;

    // Clear input values for the new row
    newRow.find("input").val("");

    // Update names for the new row
    newRow
      .find("[name='qualification1']")
      .attr("name", "qualification" + rowCount);
    newRow.find("[name='institution1']").attr("name", "institution" + rowCount);
    newRow
      .find("[name='graduation_year1']")
      .attr("name", "graduation_year" + rowCount);

    // Add delete button functionality for the new row
    newRow.find(".delete-row").click(function () {
      $(this).closest("tr").remove();
    });

    // Append the new row to the table
    $("#education-table tbody").append(newRow);
  });

  // Add Work Experience row
  $("#addWorkExperienceRow").click(function () {
    var newRow = $("#work-experience-table tbody .work-experience-row")
      .first()
      .clone(); // Ensure only the first row is cloned
    var rowCount =
      $("#work-experience-table tbody .work-experience-row").length + 1;

    // Clear input values for the new row
    newRow.find("input").val("");

    // Update names for the new row
    newRow.find("[name='job_title1']").attr("name", "job_title" + rowCount);
    newRow
      .find("[name='company_name1']")
      .attr("name", "company_name" + rowCount);
    newRow.find("[name='duration1']").attr("name", "duration" + rowCount);

    // Add delete button functionality for the new row
    newRow.find(".delete-row").click(function () {
      $(this).closest("tr").remove();
    });

    // Append the new row to the table
    $("#work-experience-table tbody").append(newRow);
  });

  // Delete Education or Work Experience row functionality
  $(document).on("click", ".delete-row", function () {
    $(this).closest("tr").remove();
  });

  // Define sub-skills for each skill category
  const skillOptions = {
    Programming: ["JavaScript", "Python", "Java", "C#", "Ruby"],
    Design: ["Photoshop", "Illustrator", "Figma", "Sketch", "InDesign"],
    Marketing: [
      "SEO",
      "Content Writing",
      "Social Media",
      "PPC",
      "Email Marketing",
    ],
  };

  // Store the original row template on page load
  const originalRowTemplate = $(
    "#skills-table tbody tr.skills-row:first"
  ).clone(true);

  // Initialize Select2 for all existing rows
  function initializeSelect2(row) {
    row.find(".skill-category").select2({
      placeholder: "Select Skill Category",
      width: "100%",
      allowClear: true,
    });

    row.find(".sub-skills").select2({
      placeholder: "Select Sub-skills",
      width: "100%",
      allowClear: true,
    });
  }

  // Handle skill category changes
  $(document).on("change", ".skill-category", function () {
    const selectedCategory = $(this).val();
    const subSkillsDropdown = $(this).closest("tr").find(".sub-skills").empty();

    if (selectedCategory && skillOptions[selectedCategory]) {
      skillOptions[selectedCategory].forEach((skill) => {
        subSkillsDropdown.append(new Option(skill, skill));
      });
      subSkillsDropdown.trigger("change");
    }
  });

  // Add new skill row
  $("#addSkillRow").click(function () {
    // Clone the original template (not the visible rows)
    const newRow = originalRowTemplate.clone(true);

    // Clear existing selections in the clone
    newRow.find(".skill-category").val("").trigger("change");
    newRow.find(".sub-skills").val(null).trigger("change");

    // Initialize Select2 for the new row
    initializeSelect2(newRow);

    // Append to table
    $("#skills-table tbody").append(newRow);
  });

  // Delete row handler
  $(document).on("click", ".delete-skill-row", function () {
    $(this).closest("tr").remove();
  });

  // Initial page setup
  $(document).ready(function () {
    // Initialize Select2 for the first row
    initializeSelect2($("#skills-table tbody tr"));
  });

  // Initialize Select2
  $(".select2").select2();

  // Fetch Divisions
  $.ajax({
    url: "https://bdapis.com/api/v1.2/divisions",
    type: "GET",
    success: function (response) {
      if (response.status && response.status.code === 200 && response.data) {
        let divisions = response.data;
        $("#division").html('<option value="">Select a division...</option>'); // Reset and add placeholder
        divisions.forEach((division) => {
          $("#division").append(
            `<option value="${division.division}">${division.division}</option>`
          );
        });
      } else {
        console.error("Invalid response structure for divisions");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching divisions:", error);
      $("#division").html('<option value="">Failed to load divisions</option>');
    },
  });

  // Fetch Districts Based on Division Selection
  $("#division").change(function () {
    let divisionName = $(this).val();
    $("#district")
      .html('<option value="">Loading districts...</option>')
      .prop("disabled", true);
    $("#upazila")
      .html('<option value="">Select an upazila...</option>')
      .prop("disabled", true); // Clear upazila dropdown

    if (divisionName) {
      $.ajax({
        url: `https://bdapis.com/api/v1.2/division/${divisionName}`,
        type: "GET",
        success: function (response) {
          if (
            response.status &&
            response.status.code === 200 &&
            response.data
          ) {
            let districts = response.data;
            $("#district").html(
              '<option value="">Select a district...</option>'
            ); // Reset and add placeholder
            districts.forEach((districtObj) => {
              $("#district").append(
                `<option value="${districtObj.district}">${districtObj.district}</option>`
              );
            });
            $("#district").prop("disabled", false); // Enable district dropdown
          } else {
            console.error("No districts found for the selected division");
            $("#district").html(
              '<option value="">No districts available</option>'
            );
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching districts:", error);
          $("#district").html(
            '<option value="">Failed to load districts</option>'
          );
        },
      });
    } else {
      $("#district")
        .html('<option value="">Select a division first</option>')
        .prop("disabled", true);
      $("#upazila")
        .html('<option value="">Select a district first</option>')
        .prop("disabled", true);
    }
  });

  // Fetch Upazilas Based on District Selection
  $("#district").change(function () {
    let districtName = $(this).val();
    $("#upazila")
      .html('<option value="">Loading upazilas...</option>')
      .prop("disabled", true);

    if (districtName) {
      $.ajax({
        url: `https://bdapis.com/api/v1.2/division/${$("#division").val()}`, // Fetch division data to find district and upazila
        type: "GET",
        success: function (response) {
          if (
            response.status &&
            response.status.code === 200 &&
            response.data
          ) {
            let districts = response.data;
            let selectedDistrict = districts.find(
              (districtObj) => districtObj.district === districtName
            );

            if (selectedDistrict && selectedDistrict.upazilla) {
              let upazilas = selectedDistrict.upazilla;
              $("#upazila").html(
                '<option value="">Select an upazila...</option>'
              ); // Reset and add placeholder
              upazilas.forEach((upazila) => {
                $("#upazila").append(
                  `<option value="${upazila}">${upazila}</option>`
                );
              });
              $("#upazila").prop("disabled", false); // Enable upazila dropdown
            } else {
              console.error("No upazilas found for the selected district");
              $("#upazila").html(
                '<option value="">No upazilas available</option>'
              );
            }
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching upazilas:", error);
          $("#upazila").html(
            '<option value="">Failed to load upazilas</option>'
          );
        },
      });
    } else {
      $("#upazila")
        .html('<option value="">Select a district first</option>')
        .prop("disabled", true);
    }
  });
});
