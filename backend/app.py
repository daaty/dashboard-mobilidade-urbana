import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from src.routes.dashboard import dashboard_bp

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Configurar CORS
CORS(app)

app.register_blueprint(dashboard_bp, url_prefix='/api')

@app.route('/api/test')
def test():
    return jsonify({'status': 'ok', 'message': 'API funcionando'})

if __name__ == '__main__':
    print("Iniciando Flask na porta 5003...")
    app.run(host='0.0.0.0', port=5003, debug=True)
