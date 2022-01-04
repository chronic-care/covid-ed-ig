import pandas as pd
import json


def read_input(path_to_input):
    return pd.read_csv(path_to_input)


def create_file(group, data):
    name = group['Code Title'].tolist()[0];
    print("creating file for "+name);
    dashed_name = name.lower().replace(" ", "-");
    names = name.split(" ");
    capitalize_name = ' '.join([x.capitalize() for x in names])
    concat_capitalize_name = ''.join([x.capitalize() for x in names])

    #read data from file

    #replace variable in the file with names
    data['id'] = data['id'].replace('$dashedName', dashed_name);
    data['url'] = data['url'].replace('$dashedName', dashed_name);
    data['name'] = data['name'].replace('$concatName', concat_capitalize_name);
    data['title'] = data['title'].replace('$name', capitalize_name);
    data['description'] = data['description'].replace('$name', capitalize_name);
    
    #Write codes for each group
    for code in group['Code'].tolist():
        data['compose']['include'][0]['concept'].append( 
            {
                "code": f"{code}"
            }
        );
        data['expansion']['contains'].append( 
            {
                "system": "http://loinc.org",
                "code": f"{code}"
            }
        );


    return { "data" : data,
             "name" : dashed_name
    };    


def create_lab_value_set_file(df):
    
    #Remove any Unnamed column
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    
    #Group by raw data element
    grouped = df.groupby('Raw Data Element  Unique ID for CPM');
    
    for  g in grouped.groups:
       
        group = grouped.get_group(g);
        #Read lab valueset file template
        f = open("input/template-valueset-lab.json", "r");
        data = json.load(f)
        
        #Create lab file for each group
        file = create_file(group, data);
        data = file['data']
        
         #Write file   
        json_object = json.dumps(data, indent = 4)
        file_name = "output/valueset-covid-19-lab-"+file['name']+".json"
        with open(file_name, "w") as outfile:
            outfile.write(json_object)
    
if __name__ == "__main__":
    df = read_input("input/lab-valueset.csv")
    create_lab_value_set_file(df)