from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from google.oauth2 import service_account
from google.cloud import storage, billing
from google.cloud.billing import v1
import datetime
import logging
from config import current_config

app = Flask(__name__)
app.config.from_object(current_config)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure upload folder exists
UPLOAD_FOLDER = app.config['UPLOAD_FOLDER']
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/api/authenticate/gcp', methods=['POST'])
def authenticate_gcp():
    """
    Endpoint to handle GCP authentication with JSON credentials file.
    """
    try:
        # Check if file was uploaded
        if 'credential_file' not in request.files:
            return jsonify({'error': 'No credential file uploaded'}), 400
        
        file = request.files['credential_file']
        
        # Check if file is empty
        if file.filename == '':
            return jsonify({'error': 'Empty file'}), 400
            
        # Save the file temporarily
        temp_path = os.path.join(UPLOAD_FOLDER, 'temp_creds.json')
        file.save(temp_path)
        
        logger.info(f"Credential file saved to {temp_path}")
        
        # Validate the credential file structure
        try:
            with open(temp_path, 'r') as f:
                creds_data = json.load(f)
                
            # Check for required keys in the credentials file
            required_keys = ['type', 'project_id', 'private_key_id', 'private_key', 
                            'client_email', 'client_id']
            
            for key in required_keys:
                if key not in creds_data:
                    os.remove(temp_path)  # Clean up
                    return jsonify({'error': f'Invalid credentials file: missing {key}'}), 400
                
            # Try to authenticate with the credentials
            credentials = service_account.Credentials.from_service_account_file(
                temp_path, 
                scopes=["https://www.googleapis.com/auth/cloud-platform"]
            )
            
            # Test the credentials by listing buckets in GCS
            storage_client = storage.Client(credentials=credentials, project=creds_data['project_id'])
            buckets = list(storage_client.list_buckets(max_results=1))
            
            # Clean up the temporary file
            os.remove(temp_path)
            
            return jsonify({
                'success': True,
                'message': 'Successfully authenticated with GCP',
                'project_id': creds_data['project_id'],
                'client_email': creds_data['client_email']
            }), 200
            
        except json.JSONDecodeError:
            os.remove(temp_path)  # Clean up
            return jsonify({'error': 'Invalid JSON format in credentials file'}), 400
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            os.remove(temp_path)  # Clean up
            return jsonify({'error': f'Authentication failed: {str(e)}'}), 401
    
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/gcp/unused-resources', methods=['GET'])
def get_unused_resources():
    """
    Endpoint to get unused GCP resources with associated billing information.
    """
    project_id = request.args.get('project_id')
    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400
        
    # In a real app, you would use stored credentials to query GCP APIs
    # For this example, we return realistic mock data for various resource types
    
    # Current date/time for age calculation
    now = datetime.datetime.now()
    
    # Mock data for unused resources
    unused_resources = [
        {
            'id': 'vm-instance-1',
            'name': 'idle-vm-instance',
            'type': 'compute',
            'zone': 'us-central1-a',
            'status': 'RUNNING',
            'last_used': (now - datetime.timedelta(days=45)).isoformat(),
            'machine_type': 'n1-standard-2',
            'monthly_cost': 73.42,
            'daily_cost': 2.43,
            'recommendation': 'Terminate or downsize',
            'potential_savings': 73.42,
            'creation_date': (now - datetime.timedelta(days=180)).isoformat(),
            'usage_metrics': {
                'cpu_utilization': '3%',
                'memory_utilization': '12%',
                'disk_utilization': '25%'
            }
        },
        {
            'id': 'persistent-disk-1',
            'name': 'unused-persistent-disk',
            'type': 'storage',
            'zone': 'us-west1-b',
            'status': 'READY',
            'size_gb': 500,
            'disk_type': 'pd-standard',
            'last_attached': (now - datetime.timedelta(days=90)).isoformat(),
            'monthly_cost': 20.00,
            'daily_cost': 0.67,
            'recommendation': 'Delete or resize',
            'potential_savings': 20.00,
            'creation_date': (now - datetime.timedelta(days=120)).isoformat(),
            'attached_to': 'None'
        },
        {
            'id': 'cloud-sql-1',
            'name': 'legacy-database',
            'type': 'database',
            'region': 'us-east1',
            'status': 'RUNNING',
            'instance_type': 'db-n1-standard-1',
            'last_connection': (now - datetime.timedelta(days=30)).isoformat(),
            'monthly_cost': 103.72,
            'daily_cost': 3.46,
            'recommendation': 'Downsize or move to serverless',
            'potential_savings': 73.72,
            'creation_date': (now - datetime.timedelta(days=210)).isoformat(),
            'usage_metrics': {
                'cpu_utilization': '5%',
                'memory_utilization': '15%',
                'storage_utilization': '40%',
                'connections_per_day': 3
            }
        },
        {
            'id': 'static-ip-1',
            'name': 'unused-reserved-ip',
            'type': 'network',
            'region': 'europe-west1',
            'status': 'RESERVED',
            'in_use': False,
            'monthly_cost': 7.30,
            'daily_cost': 0.24,
            'recommendation': 'Release IP address',
            'potential_savings': 7.30,
            'creation_date': (now - datetime.timedelta(days=160)).isoformat(),
            'attached_to': 'None'
        },
        {
            'id': 'snapshot-1',
            'name': 'old-system-snapshot',
            'type': 'snapshot',
            'location': 'multi-regional',
            'status': 'READY',
            'size_gb': 250,
            'monthly_cost': 10.00,
            'daily_cost': 0.33,
            'recommendation': 'Delete old snapshot',
            'potential_savings': 10.00,
            'creation_date': (now - datetime.timedelta(days=240)).isoformat(),
            'source_disk': 'deleted-disk-1'
        },
        {
            'id': 'cloudfunc-1',
            'name': 'deprecated-function',
            'type': 'serverless',
            'region': 'us-central1',
            'status': 'ACTIVE',
            'last_invoked': (now - datetime.timedelta(days=80)).isoformat(),
            'monthly_cost': 5.84,
            'daily_cost': 0.19,
            'recommendation': 'Delete unused function',
            'potential_savings': 5.84,
            'creation_date': (now - datetime.timedelta(days=150)).isoformat(),
            'invocations_per_month': 2
        },
        {
            'id': 'gcs-bucket-1',
            'name': 'old-backup-bucket',
            'type': 'storage',
            'location': 'us-multi-regional',
            'status': 'ACTIVE',
            'storage_class': 'Standard',
            'size_gb': 1500,
            'last_accessed': (now - datetime.timedelta(days=150)).isoformat(),
            'monthly_cost': 30.00,
            'daily_cost': 1.00,
            'recommendation': 'Move to cold storage or delete',
            'potential_savings': 25.50,
            'creation_date': (now - datetime.timedelta(days=300)).isoformat(),
            'object_count': 15420
        },
        {
            'id': 'loadbalancer-1',
            'name': 'staging-loadbalancer',
            'type': 'network',
            'region': 'global',
            'status': 'ACTIVE',
            'monthly_cost': 18.26,
            'daily_cost': 0.61,
            'recommendation': 'Delete unused load balancer',
            'potential_savings': 18.26,
            'creation_date': (now - datetime.timedelta(days=120)).isoformat(),
            'traffic': 'minimal',
            'frontend_ips': 1
        }
    ]
    
    # Summary statistics
    total_monthly_waste = sum(resource['monthly_cost'] for resource in unused_resources)
    total_potential_savings = sum(resource['potential_savings'] for resource in unused_resources)
    
    return jsonify({
        'unused_resources': unused_resources,
        'summary': {
            'total_resource_count': len(unused_resources),
            'total_monthly_waste': round(total_monthly_waste, 2),
            'total_potential_savings': round(total_potential_savings, 2),
            'currency': 'USD',
            'generated_at': now.isoformat(),
            'project_id': project_id
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=current_config.DEBUG, host='0.0.0.0', port=5000)