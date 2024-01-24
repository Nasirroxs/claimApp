import pandas as pd
import re
import os


def extract_info(element):
  # Define the pattern for extracting Name, NRIC, Color, and Receipt No
  pattern = r'(?P<Name>.*?)\s+(?P<NRIC>[A-Z]\d+[A-Z]?)\s+\((?P<Color>\w+)\)\s+(?P<ReceiptNo>C\d+)'

  # Use regex to find matches
  match = re.match(pattern, element)

  # Check if a match is found
  if match:
    info = match.groupdict()
  else:
    # Set default values if no match is found
    info = {
        'Name': 'Unknown',
        'NRIC': 'Unknown',
        'Color': 'Unknown',
        'ReceiptNo': 'Unknown'
    }

  return info


def extract_patient_details(data):
    # Define a more flexible regex pattern to extract information
    pattern = re.compile(r"(?i)(\w+)\s+(\w+)\s+(\d+/\d+/\d+)\s+Fee:\s+(\$\d+\.\d+)\s+C:\s+(\d+\.\d+)\s+M:\s*(\d+\.\d+)\s+I:\s+(\d+\.\d+)")

    # Match the pattern in the input data
    match = pattern.match(data)

    # Set default values
    gender = "Unknown"
    race = "Unknown"
    dob = "Unknown"
    fee = "Unknown"
    consultation = "Unknown"
    medicine = "Unknown"
    investigation = "Unknown"

    # If there is a match, extract information
    if match:
        gender, race, dob, fee, consultation, medicine, investigation = match.groups()

    # Create a dictionary
    patient_info = {
        'Gender': gender,
        'Race': race,
        'DOB': dob,
        'Fee': fee,
        'Consultation': consultation,
        'Medicine': medicine,
        'Investigation': investigation
    }

    return patient_info


def extract_illness_details(element):
  # Define the pattern for extracting Illness, Tier, and Subsidy
  pattern = r'(?P<Illness>.*?)\s+Tier\s+(?P<Tier>\d+)\s+Subsidy:\s+\$(?P<Subsidy>[\d.]+)'

  # Use regex to find the first match
  match = re.search(pattern, element)

  # Check if a match is found
  if match:
    details = match.groupdict()
  else:
    # Set default values if no match is found
    details = {'Illness': 'Unknown', 'Tier': 'Unknown', 'Subsidy': 'Unknown'}

  return details


def extract_patient_record(record):
  # Extract Name, NRIC, Color, and Receipt No
  name_element = " ".join(record[0].split())
  name_info = extract_info(name_element)

  # Extract Gender, Race, DOB, Fee, Consultation, Medicine, and Investigation
  patient_details_element = " ".join(record[1].split())
  patient_details = extract_patient_details(patient_details_element)

  # Extract Illness, Tier, and Subsidy
  illness_element = " ".join(record[2].split())
  illness_details = extract_illness_details(illness_element)

  # Combine all extracted information into a single dictionary
  combined_info = {**name_info, **patient_details, **illness_details}

  return combined_info


