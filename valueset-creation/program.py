import pandas as pd


def read_input(path_to_input):
    return pd.read_csv(path_to_input)


def create_json_from_df(df):
    output = []
    for index, row in df.iterrows():
        output.append({
            "system": "http://snomed.info/sct",
            "code": f"{row['Code']}",
            "display": row["Code Title"]
        })
    return output


if __name__ == "__main__":
    import json
    df = read_input("input/example-input.csv")
    output = create_json_from_df(df)
    with open('output/data.json', 'w') as f:
        json.dump(output, f)
