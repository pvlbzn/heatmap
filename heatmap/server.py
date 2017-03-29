from flask import Flask, render_template
from geopy.geocoders import Nominatim

# Initializers
app = Flask(__name__)
locator = Nominatim()


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api/v1/<string:event>')
def event_handler(event):
    if event == 'small':
        fname = 'small_event.json'
    elif event == 'multiple':
        fname = 'multiple_events.json'
    else:
        return 'Unknow Request'

    with open('events/' + fname, 'r') as container:
        data = container.read()

    return data


if __name__ == '__main__':
    app.run(debug=True)