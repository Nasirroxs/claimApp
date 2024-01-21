        let UploadArea = document.getElementById('Upload_Window')

        let UploadContainer = document.getElementById('Upload_Container')

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
            //console.log(e.dataTransfer.files);
            //add file to input
            UploadFile(e.dataTransfer.files[0]);
        });

        function SelectFile(){
            document.getElementById("upload").click();
        }

        function UploadFile(event){
            console.log(event);
            document.getElementById("Progess_Bar_Container").style.display = "block";
            $(".progress-bar").animate({
                width: "100%"
            }, 2500);
            $(".progress-bar").animate({
                width: "0%"
            }, 0);
            setTimeout(function(){
                document.getElementById("Progess_Bar_Container").style.display = "none";
                //document.querySelector(".progress-bar").style.width = "1%";
                UploadContainer.classList.remove("dragover");
                UploadContainer.classList.add("drag");
            }, 2500);
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
        
                reader.onload = function (event) {
                    const arrayBuffer = event.target.result;
        
                    mammoth.extractRawText({ arrayBuffer: arrayBuffer })
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
            const file = new File([rawData], fileName, { type: 'text/plain;charset=utf-8' });
        
            // Create a hidden link to trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
        
            // Trigger the download
            link.click();
        
            // Remove the link from the DOM
            document.body.removeChild(link);
        
            // Clean up by revoking the object URL to free up resources
            URL.revokeObjectURL(link.href);
        }
        
