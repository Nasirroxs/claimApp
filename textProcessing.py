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


def extract_patient_details(element):
  # Define the pattern for extracting details
  pattern = r'(?P<Gender>[A-Za-z]+)\s+(?P<Race>[A-Za-z]+)\s+(?P<DOB>\d{2}/\d{2}/\d{2})\s+Fee:\s+\$?(?P<Fee>[\d.]+)\s+C:\s+(?P<Consultation>[\d.]+)\s+M:\s+(?P<Medicine>[\d.]+)\s+I:\s+(?P<Investigation>[\d.]+)'

  # Use regex to find matches
  match = re.match(pattern, element)

  # Check if a match is found
  if match:
    details = match.groupdict()
  else:
    # Set default values if no match is found
    details = {
        'Gender': 'Unknown',
        'Race': 'Unknown',
        'DOB': 'Unknown',
        'Fee': 'Unknown',
        'Consultation': 'Unknown',
        'Medicine': 'Unknown',
        'Investigation': 'Unknown'
    }

  return details


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


