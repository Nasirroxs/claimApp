from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import pandas as pd
from textProcessing import *

app = Flask(__name__, static_url_path='/static')

UPLOAD_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
  return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
  try:
    # Get the file from the request
    uploaded_file = request.files['file']

    # Specify the directory where you want to save the uploaded files
    upload_directory = 'static'

    # Save the file to the specified directory
    uploaded_file.save(os.path.join(upload_directory, uploaded_file.filename))

    file_path = os.path.join('static', 'output.txt')

    # Open the file
    with open(file_path) as f:
      found_dr_lui = False
      found_dr_jam = False
      patient_records = []
      current_lines = []

      # Read through the file line by line
      for line in f:
        if 'Dr Jam' in line:
          found_dr_jam = True
          break
        if found_dr_lui and not found_dr_jam:
          current_lines.append(line.strip())
          if len(current_lines) == 3:
            # Append the three lines to patient_records
            patient_records.append(current_lines.copy())
            current_lines = []
        elif 'Dr Lui' in line:
          found_dr_lui = True

    # Create an empty list to store the results
    results_list = []

    # Iterate over each patient record in patient_records
    for record in patient_records:
      result = extract_patient_record(record)
      results_list.append(result)

    # Convert the list of dictionaries to a DataFrame
    df = pd.DataFrame(results_list)

    df_json = df.to_json(orient='records')


    # Redirect to the display_table route with df_json as an argument
    return df_json

  except Exception as e:
    return jsonify({'error': str(e)}), 500


app.run(host='0.0.0.0', port=81)

if __name__ == '__main__':
  app.run(debug=True)
