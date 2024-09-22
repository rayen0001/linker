from flask import Flask, render_template, request, jsonify
import requests
import qrcode

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/shorten', methods=['POST'])
def shorten_url():
    data = request.json
    original_url = data.get('url')

    # Use TinyURL to shorten the URL
    try:
        tiny_url_response = requests.get(f'http://tinyurl.com/api-create.php?url={original_url}')
        shortened_url = tiny_url_response.text
    except Exception as e:
        return jsonify({'error': f'Failed to shorten URL: {str(e)}'}), 500

    # Generate QR code as text art
    qr = qrcode.QRCode(border=1, box_size=10)  # Adjust box size for smaller QR
    qr.add_data(shortened_url)
    qr.make(fit=True)

    # Convert the QR matrix to ASCII art
    ascii_qr = generate_ascii_qr(qr.get_matrix())

    return jsonify({'shortened': shortened_url, 'qr_code': ascii_qr})


def generate_ascii_qr(matrix):
    """Convert a QR code matrix to ASCII art."""
    ascii_art = ''
    for row in matrix:
        for col in row:
            ascii_art += '██' if col else '  '  # Use double block for better appearance
        ascii_art += '\n'
    return ascii_art


if __name__ == '__main__':
    app.run(debug=True)
