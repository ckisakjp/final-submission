import json
from bs4 import BeautifulSoup

# Load your HTML file
with open('climatechange.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

# Parse the HTML with Beautiful Soup
soup = BeautifulSoup(html_content, 'html.parser')

# Find all rows in the table
rows = soup.find_all('tr', class_='epi-countryrow')

# Initialize a list to hold the country data
air_quality_data = []

# Iterate through each row and extract data
for row in rows:
    # Extract country name
    country = row.find('td', class_='views-field-field-country').get_text(strip=True)
    
    # Extract rank
    rank = int(row.find('td', class_='views-field-field-rank').get_text(strip=True))
    
    # Extract current air quality score
    current = float(row.find('td', class_='views-field-field-current').get_text(strip=True))
    
    # Extract delta value (if applicable, else set to None)
    delta_td = row.find('td', class_='views-field-field-deltaval')
    delta = float(delta_td.get_text(strip=True)) if delta_td else None
    
    # Create a dictionary for the current row
    country_data = {
        'country': country,
        'rank': rank,
        'current': current,
        'delta': delta
    }
    
    # Append the dictionary to the list
    air_quality_data.append(country_data)

# Write the data to a JSON file
with open('climatechange.json', 'w', encoding='utf-8') as json_file:
    json.dump(air_quality_data, json_file, ensure_ascii=False, indent=2)

print("Data has been sfasdfasdfasd written to airquality.json")
