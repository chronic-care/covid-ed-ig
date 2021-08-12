## Valueset Creation
This little python program takes in a csv of codes and code titles and outputs a json file with the codes in the valueset format. 

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
