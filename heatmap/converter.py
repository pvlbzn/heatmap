import json
import geocoder


def zip_to_point(zip):
    try:
        g = geocoder.google(zip)
        print(g.latlng)
        return {'lat': g.latlng[0], 'lng': g.latlng[1]}
    except IndexError as err:
        print(err)


if __name__ == '__main__':
    # Open given data file
    with open('events/multiple_events.json', 'r') as f:
        data = json.load(f)

    res = []

    for item in data['events'][0]['zips']:
        res.insert(0, zip_to_point(item))

    with open('events/latlng', 'w') as w:
        for point in res:
            w.write(', ' + str(point))
