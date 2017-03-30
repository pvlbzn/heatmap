import json
import requests


def zip_to_point(zip):
    url = 'http://nominatim.openstreetmap.org/search/?'
    query = 'country=US&limit=1&format=json&postalcode=' + str(zip)

    try:
        reqJSON = requests.get(url + query).json()
        point = {"lat": reqJSON[0]["lat"], "lng": reqJSON[0]["lon"]}
        print(str(zip) + ' -> ' + str(point))
        return point

    except IndexError as error:
        print('ERROR: ' + str(error) + ' with zip: ' + str(zip))


def extract_zips(data):
    res = []

    for item in data['events'][0]['zips']:
        res.append(zip_to_point(item))

    return res


def write_data(data, path):
    with open(path, 'w') as container:
        for point in data:
            container.write(', ' + str(point))


if __name__ == '__main__':
    with open('events/multiple_events.json', 'r') as f:
        data = json.load(f)

    res = extract_zips(data)

    write_data(res, 'events/latlng_small')
