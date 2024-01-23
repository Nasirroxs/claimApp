let uploadedFiles = []; // Array to store uploaded files

let UploadArea = document.getElementById('Upload_Window');
let UploadContainer = document.getElementById('Upload_Container');
let Progress = document.getElementById('Progress');

UploadArea.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
});

UploadArea.addEventListener("dragenter", (e) => {
    e.stopPropagation();
    e.preventDefault();
    UploadContainer.classList.add("dragover");
    UploadContainer.classList.remove("drag");
    UploadArea.style.transform = "scale(1.2)";
});

UploadArea.addEventListener("dragleave", (e) => {
    UploadContainer.classList.remove("dragover");
    UploadContainer.classList.add("drag");
    UploadArea.style.transform = "scale(1)";
});

UploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    UploadArea.style.transform = "perspective(700px) rotateX(15deg) scale(1)";
    setTimeout(() => {
        UploadArea.style.transform = "scale(1)";
    }, 1000);
    UploadFile(e.dataTransfer.files[0]);
});

function SelectFile() {
    document.getElementById("upload").click();
}

function UploadFile(file) {
    uploadedFiles.push(file);
    displayUploadedFiles();

    // Your existing code for progress bar and cleanup
  document.getElementById("Progess_Bar_Container").style.display = "block";
  $(".progress-bar").animate({
      width: "100%"
  }, 500);
  $(".progress-bar").animate({
      width: "0%"
  }, 0);
  setTimeout(function() {
      document.getElementById("Progess_Bar_Container").style.display = "none";
      //document.querySelector(".progress-bar").style.width = "1%";
      UploadContainer.classList.remove("dragover");
      UploadContainer.classList.add("drag");
  }, 500);
}

function displayUploadedFiles() {
    const filesContainer = document.getElementById('uploaded-files-container');
    filesContainer.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const removeButton = document.createElement('button');
        removeButton.innerHTML = '&#128465;'; 
        removeButton.addEventListener('click', () => {
            uploadedFiles.splice(index, 1);
            displayUploadedFiles();
            location.reload();
        });

        fileItem.appendChild(fileName);
        fileItem.appendChild(removeButton);
        filesContainer.appendChild(fileItem);
    });
}


document.getElementById('upload').addEventListener('change', handleFile);

function handleFile() {
    const fileInput = document.getElementById('upload');
    const tableContainer = document.getElementById('table-container');
    const rawDataContainer = document.getElementById('rawData');

    const file = fileInput.files[0];
    if (file) {
        readWordDocument(file)
            .then(data => {
                // Display the raw data on the page
                rawDataContainer.innerText = data;

                // Save the raw data to a text file
                saveRawDataToFile(data, 'output.txt');

                // Your existing code to display data in a table
                // ...

                // Show the table
                tableContainer.style.display = 'block';
            })
            .catch(error => console.error(error));
    }
}

function readWordDocument(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const arrayBuffer = event.target.result;

            mammoth.extractRawText({
                    arrayBuffer: arrayBuffer
                })
                .then(result => {
                    resolve(result.value);
                })
                .catch(error => {
                    reject(error);
                });
        };

        reader.readAsArrayBuffer(file);
    });
}

function saveRawDataToFile(rawData, fileName) {
    const cleanedData = rawData.replace(/^\s*[\r\n]/gm, '');
    const file = new File([cleanedData], fileName, {
        type: 'text/plain;charset=utf-8'
    });

    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.send(formData);

    xhr.onload = function() {
        if (xhr.status === 200) {
            // If the request was successful, parse the JSON response
            var response = JSON.parse(xhr.responseText);
            displayResponseTable(response);
        }
    }
}

function displayResponseTable(response) {
    // Create a table element
    var table = document.createElement("table");
    table.style.marginLeft = "-250px";
    table.style.marginTop = "60px"; // Add top padding
    table.style.borderCollapse = "collapse"; // Collapse borders for better styling

    // Create the table header
    var thead = document.createElement("thead");
    var headerRow = thead.insertRow();
    for (var key in response[0]) {
        var th = document.createElement("th");
        th.textContent = key;
        th.style.border = "1px solid #ddd"; // Add border to header cells
        headerRow.appendChild(th);
    }
    table.appendChild(thead);

    // Create the table body
    var tbody = document.createElement("tbody");
    for (var i = 0; i < response.length; i++) {
        var row = tbody.insertRow();
        for (var key in response[i]) {
            var cell = row.insertCell();
            cell.textContent = response[i][key];
            cell.style.border = "1px solid #ddd"; // Add border to data cells
        }
    }
    table.appendChild(tbody);

    // Append the table directly below the "Upload_Window" container
    var uploadWindow = document.getElementById("Upload_Window");
    uploadWindow.appendChild(table);
}
