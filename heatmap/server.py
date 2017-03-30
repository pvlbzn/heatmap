from flask import Flask

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/api/v1/<event>')
def event_handler(event):
    with open('events/event_sample.json', 'r') as container:
        data = container.read()

    return data


if __name__ == '__main__':
    app.run(debug=True)