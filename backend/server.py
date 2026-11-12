"""
Wanderlust Travel & Tour Booking Platform - Flask Backend API
Provides RESTful endpoints for Destinations, Tour Packages, Bookings, Reviews, and Newsletter.
Run with: python server.py
"""

import os
import json
from datetime import datetime
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

def read_json(filename):
    file_path = os.path.join(DATA_DIR, filename)
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

def write_json(filename, data):
    file_path = os.path.join(DATA_DIR, filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "service": "Wanderlust Travel API (Flask)",
        "version": "1.0.0"
    })

@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    destinations = read_json('destinations.json')
    continent = request.args.get('continent')
    popular = request.args.get('popular')

    filtered = destinations
    if continent:
        filtered = [d for d in filtered if d.get('continent', '').lower() == continent.lower()]
    if popular == 'true':
        filtered = [d for d in filtered if d.get('popular') is True]

    return jsonify({
        "success": True,
        "total": len(filtered),
        "data": filtered
    })

@app.route('/api/destinations/<dest_id>', methods=['GET'])
def get_destination(dest_id):
    destinations = read_json('destinations.json')
    item = next((d for d in destinations if d['id'] == dest_id), None)
    if not item:
        return jsonify({"success": False, "message": "Destination not found"}), 404
    return jsonify({"success": True, "data": item})

@app.route('/api/packages', methods=['GET'])
def get_packages():
    packages = read_json('packages.json')
    result = packages

    q = request.args.get('q', '').lower()
    category = request.args.get('category', '').lower()
    max_price = request.args.get('maxPrice')
    destination_id = request.args.get('destinationId')
    featured = request.args.get('featured')

    if q:
        result = [p for p in result if (
            q in p.get('title', '').lower() or
            q in p.get('destinationName', '').lower() or
            q in p.get('summary', '').lower()
        )]

    if category and category != 'all':
        result = [p for p in result if category in p.get('category', '').lower()]

    if destination_id:
        result = [p for p in result if p.get('destinationId') == destination_id]

    if max_price:
        try:
            cap = float(max_price)
            result = [p for p in result if (p.get('discountPriceUSD') or p.get('priceUSD', 0)) <= cap]
        except ValueError:
            pass

    if featured == 'true':
        result = [p for p in result if p.get('featured') is True]

    return jsonify({
        "success": True,
        "total": len(result),
        "data": result
    })

@app.route('/api/packages/<pkg_id>', methods=['GET'])
def get_package(pkg_id):
    packages = read_json('packages.json')
    item = next((p for p in packages if p['id'] == pkg_id), None)
    if not item:
        return jsonify({"success": False, "message": "Package not found"}), 404
    return jsonify({"success": True, "data": item})

@app.route('/api/reviews', methods=['GET', 'POST'])
def handle_reviews():
    if request.method == 'GET':
        reviews = read_json('reviews.json')
        pkg_id = request.args.get('packageId')
        if pkg_id:
            reviews = [r for r in reviews if r.get('packageId') == pkg_id]
        return jsonify({"success": True, "total": len(reviews), "data": reviews})

    data = request.get_json() or {}
    author = data.get('author')
    rating = data.get('rating')
    comment = data.get('comment')

    if not author or not rating or not comment:
        return jsonify({
            "success": False,
            "message": "Author name, rating (1-5), and review comment are required."
        }), 400

    reviews = read_json('reviews.json')
    new_review = {
        "id": f"rev-{int(datetime.now().timestamp() * 1000)}",
        "packageId": data.get('packageId', 'general'),
        "author": author.strip(),
        "avatar": f"https://images.unsplash.com/photo-{1534528741775 + random.randint(1, 999)}?auto=format&fit=crop&w=200&q=80",
        "location": data.get('location', 'Verified Explorer').strip(),
        "rating": max(1, min(5, int(rating))),
        "date": datetime.now().strftime("%Y-%m-%d"),
        "trip": data.get('trip', 'Curated Journey'),
        "comment": comment.strip()
    }

    reviews.insert(0, new_review)
    write_json('reviews.json', reviews)

    return jsonify({
        "success": True,
        "message": "Review submitted successfully!",
        "data": new_review
    }), 201

@app.route('/api/bookings', methods=['GET', 'POST'])
def handle_bookings():
    if request.method == 'GET':
        bookings = read_json('bookings.json')
        code = request.args.get('code')
        email = request.args.get('email')

        if code:
            b = next((x for x in bookings if x['id'].lower() == code.lower()), None)
            if not b:
                return jsonify({"success": False, "message": "Booking not found"}), 404
            return jsonify({"success": True, "data": b})

        if email:
            filtered = [x for x in bookings if x.get('email', '').lower() == email.lower()]
            return jsonify({"success": True, "data": filtered})

        return jsonify({"success": True, "total": len(bookings), "data": bookings})

    data = request.get_json() or {}
    traveler_name = data.get('travelerName')
    email = data.get('email')
    travel_date = data.get('travelDate')
    package_id = data.get('packageId')

    if not traveler_name or not email or not travel_date or not package_id:
        return jsonify({
            "success": False,
            "message": "Missing required booking details: travelerName, email, travelDate, packageId."
        }), 400

    ref_num = random.randint(1000, 9999)
    current_year = datetime.now().year
    booking_id = f"TRV-{current_year}-{ref_num}"

    new_booking = {
        "id": booking_id,
        "packageId": package_id,
        "packageTitle": data.get('packageTitle', 'Custom Vacation Package'),
        "travelerName": traveler_name.strip(),
        "email": email.strip(),
        "phone": data.get('phone', 'N/A').strip(),
        "travelDate": travel_date,
        "guests": data.get('guests', {"adults": 1, "children": 0}),
        "roomType": data.get('roomType', 'standard'),
        "selectedAddons": data.get('selectedAddons', []),
        "totalPriceUSD": data.get('totalPriceUSD', 0),
        "specialRequests": data.get('specialRequests', '').strip(),
        "status": "Confirmed",
        "createdAt": datetime.now().isoformat()
    }

    bookings = read_json('bookings.json')
    bookings.insert(0, new_booking)
    write_json('bookings.json', bookings)

    return jsonify({
        "success": True,
        "message": "Booking confirmed successfully!",
        "voucherCode": booking_id,
        "data": new_booking
    }), 201

@app.route('/api/newsletter', methods=['POST'])
def newsletter():
    data = request.get_json() or {}
    email = data.get('email', '')
    if not email or '@' not in email:
        return jsonify({"success": False, "message": "Valid email address is required."}), 400

    return jsonify({
        "success": True,
        "message": "Welcome to the Wanderlust Explorer Club! Your $150 gift voucher code is WANDER150.",
        "voucherCode": "WANDER150",
        "discountAmount": 150
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"==================================================")
    print(f"  Wanderlust Travel Flask Server Running!         ")
    print(f"  URL: http://127.0.0.1:{port}/api/health         ")
    print(f"==================================================")
    app.run(host='0.0.0.0', port=port, debug=True)
