""" Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
           https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied. 
"""


import os
import requests
from rich import print
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Function to fetch API key from environment variables
def get_api_key():
    api_key = os.getenv("MERAKI_API_KEY")
    if not api_key:
        print("[bold red]Error:[/bold red] MERAKI_API_KEY not found in .env file.")
        exit(1)
    return api_key

# Function to fetch organizations and their networks
def get_orgs_and_networks(api_key):
    headers = {
        "X-Cisco-Meraki-API-Key": api_key,
        "Content-Type": "application/json",
    }

    try:
        # Fetch organizations
        orgs_response = requests.get("https://api.meraki.com/api/v1/organizations", headers=headers)
        orgs_response.raise_for_status()
        orgs_data = orgs_response.json()

        # Iterate over organizations
        for org in orgs_data:
            org_id = org["id"]
            org_name = org["name"]
            print("\n[bold]Organization[/bold]")
            print(f"ID: {org_id}")
            print(f"Name: {org_name}")

            # Fetch networks for the organization
            networks_response = requests.get(f"https://api.meraki.com/api/v1/organizations/{org_id}/networks", headers=headers)
            networks_response.raise_for_status()
            networks_data = networks_response.json()

            # Iterate over networks
            print("\n[bold]Networks[/bold]")
            for network in networks_data:
                network_id = network["id"]
                network_name = network["name"]
                print(f"ID: {network_id}")
                print(f"Name: {network_name}")

    except requests.exceptions.RequestException as e:
        print(f"[bold red]Error:[/bold red] An error occurred while fetching data from Meraki API: {str(e)}")
    except KeyboardInterrupt:
        print("\n[bold yellow]Script terminated by user.[/bold yellow]")
    except Exception as e:
        print(f"[bold red]Error:[/bold red] An unexpected error occurred: {str(e)}")

def main():
    try:
        api_key = get_api_key()
        get_orgs_and_networks(api_key)
    except KeyboardInterrupt:
        print("\n[bold yellow]Script terminated by user.[/bold yellow]")

if __name__ == "__main__":
    main()
