from flask import Flask, render_template, request, jsonify
from geopy.distance import geodesic
import random

app = Flask(__name__)

TOLL_RATE_PER_KM = 1.5 


SPEED_LIMIT = 80 


city_coords = {
    'Mumbai': (19.0760, 72.8777),
    'Pune': (18.5204, 73.8567),
    'Delhi': (28.7041, 77.1025),
    'Bangalore': (12.9716, 77.5946),
    'Chennai': (13.0827, 80.2707),
    'Kolkata': (22.5726, 88.3639)
}


toll_booths_data = {

}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/calculate_toll', methods=['POST'])
def calculate_toll():
    data = request.get_json()
    source = data['source']
    destination = data['destination']
    if source in city_coords and destination in city_coords:
        source_coords = city_coords[source]
        destination_coords = city_coords[destination]
        distance_km = geodesic(source_coords, destination_coords).kilometers
        toll = distance_km * TOLL_RATE_PER_KM
        return jsonify({'toll': round(toll, 2), 'distance': round(distance_km, 2)})
    else:
        return jsonify({'toll': 0, 'distance': 0, 'error': 'Invalid cities'})

@app.route('/simulate_speed', methods=['POST'])
def simulate_speed():
    speeds = [random.randint(60, 100) for _ in range(10)]  # Simulate 10 speed readings
    average_speed = sum(speeds) / len(speeds)
    points = sum(1 for speed in speeds if speed <= SPEED_LIMIT)
    return jsonify({'speeds': speeds, 'average_speed': round(average_speed, 2), 'points': points})

@app.route('/get_toll_booths', methods=['POST'])
def get_toll_booths():
    data = request.get_json()
    source = data['source']
    destination = data['destination']
    route = f"{source}-{destination}"
    toll_booths = toll_booths_data.get(route, [])
    return jsonify({'toll_booths': toll_booths})

if __name__ == '__main__':
    app.run(debug=True)
