## Valueset Creation

`program.py` scripts takes in a csv of codes and code titles and outputs a json file with the codes in the valueset format. 

#### Example Input (csv format)
```
Code,Code Title
237620003,Abnormal metabolic state due to diabetes mellitus (disorder)
735200002,Absence of lower limb due to diabetes mellitus (disorder)
...
```

#### Example Output (json)
```
[
    {
        "system": "http://snomed.info/sct", 
        "code": "237620003", "display": 
        "Abnormal metabolic state due to diabetes mellitus (disorder)"
    }, 
    {
        "system": "http://snomed.info/sct", 
        "code": "735200002", 
        "display": "Absence of lower limb due to diabetes mellitus (disorder)"
    }
    ...
]
```

### Developer Setup
#### Set up with `virtualenv`
1. Install Python 3.8 on your machine
2. Create a virtualenv for your installation
```shell script
cd valueset-creation
virtualenv --python=python3 .venv
source .venv/bin/activate
```
3. Install Requirements
```shell script
pip3 install -r requirements.txt
```


#### Set up with `pyenv`
1. `pyenv install 3.8.0`
2. `pyenv virtualenv 3.8.0 <name_of_environment>`
3. `source ~/.pyenv/versions/<name_of_environment>/bin/activate`
4. `pip3 install -r requirements.txt`

### Steps to generate valueset output
1. Create a csv of Codes & Code Titles and put it in the `valueset-creation/input` folder.
2. Update the filename on line 25 of `program.py` to the name of the csv you just created.   
3. Run `python3 program.py` from the `valueset-creation` directory.
4. Output will appear here: `valueset-creation/output/data.json`.
5. You can then use the output when creating a valueset in the `input/vocabulary/ValueSet` directory by copying and pasting it into the `"contains"` array of the valueset.
```
{
...
    "contains": [
            {
                "system": "http://snomed.info/sct", 
                "code": "237620003", "display": 
                "Abnormal metabolic state due to diabetes mellitus (disorder)"
            }, 
            {
                "system": "http://snomed.info/sct", 
                "code": "735200002", 
                "display": "Absence of lower limb due to diabetes mellitus (disorder)"
            }
            ...
        ]
}
```
*See other valuesets to reference how they are structured and where to copy/paste the output, i.e.: `input/vocabulary/ValueSet/valueset-covid-19-condition-risk-obstructive-sleep-apnea-icd10.json`

##### Note:
This program hard-codes the `"system"` value in the output to `"http://snomed.info/sct"` but it can be updated on line 13 of `program.py`

### Create lab value-set files.

Whenever we have an ACEP update we might need to create new lab value-set files. 

`createLabValuesetFile.py` reads a file as an input argument and outputs a new lab value-set json file(s) for each raw data elements (`RDEs`).
The script groups the data by RDEs (`Raw Data Element Unique ID for CPM`) column and creates new json file for each unique RDEs. It uses `Code Title` column
of the input file to name and create the json files, so make sure to update `Code Title` column values as required.

#### Sample Lab Value-Set File.
```
Raw Data Element  Unique ID for CPM,Raw data element name,Coding System,Code,Code Title
RDE0028,Arterial partial pressure of oxygen,LOINC,2703-7,Oxygen
```

#### Steps

1) Get the latest raw data elements lab file (CPM value set-Laboratory Results) from [here](https://github.com/department-of-veterans-affairs/covid-patient-manager/tree/main/docs/terminology-project-documents).
2) Add a `Name` column which will contain the name of the lab observation. This name is used inside the template which creates the valueset json file.
3) Convert the file to CSV.
4) Run the below command. Replace `path_to_file.csv` with the path of the downloaded file. The new files generated can be found in the [output](output/) folder. You may then copy the generate files to the [ValueSet](../input/vocabulary/ValueSet) folder.


```renderscript
python3 ./valuesset-creation/createLabValuesetFile.py  <path_to_file.csv> 
```
