from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from task_queue import DistributedTaskQueue, TASK_TYPES
from config import Config

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

queue = DistributedTaskQueue(num_workers=Config.MAX_WORKERS, socketio=socketio)


@app.route('/api/health', methods=['GET'])
def health():
    stats = queue.get_stats()
    return jsonify({
        'status': 'healthy',
        'workers': stats['total_workers'],
        'tasks_processed': stats['completed'],
    })


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = queue.get_all_tasks()
    status_filter = request.args.get('status')
    if status_filter:
        tasks = [t for t in tasks if t['status'] == status_filter]
    tasks.sort(key=lambda t: t['created_at'], reverse=True)
    return jsonify({'tasks': tasks})


@app.route('/api/tasks', methods=['POST'])
def submit_task():
    data = request.get_json()
    if not data or 'type' not in data:
        return jsonify({'error': 'Task type is required'}), 400

    task_type = data['type']
    if task_type not in TASK_TYPES:
        return jsonify({'error': f'Unknown task type: {task_type}'}), 400

    task = queue.submit_task(
        task_type=task_type,
        params=data.get('params', {}),
        priority=data.get('priority', 'NORMAL'),
        max_retries=data.get('max_retries', Config.MAX_RETRIES),
    )
    return jsonify({'task': task}), 201


@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    task = queue.get_task(task_id)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify({'task': task})


@app.route('/api/tasks/<task_id>/cancel', methods=['POST'])
def cancel_task(task_id):
    success = queue.cancel_task(task_id)
    if success:
        return jsonify({'message': 'Task cancelled'})
    return jsonify({'error': 'Cannot cancel task'}), 400


@app.route('/api/tasks/clear', methods=['POST'])
def clear_tasks():
    count = queue.clear_completed()
    return jsonify({'cleared': count})


@app.route('/api/tasks/batch', methods=['POST'])
def batch_submit():
    data = request.get_json()
    if not data or 'tasks' not in data:
        return jsonify({'error': 'Tasks array required'}), 400

    results = []
    for task_data in data['tasks']:
        task = queue.submit_task(
            task_type=task_data.get('type', 'simulate_io'),
            params=task_data.get('params', {}),
            priority=task_data.get('priority', 'NORMAL'),
        )
        results.append(task)
    return jsonify({'tasks': results}), 201


@app.route('/api/workers', methods=['GET'])
def get_workers():
    return jsonify({'workers': queue.get_workers()})


@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify(queue.get_stats())


@app.route('/api/task-types', methods=['GET'])
def get_task_types():
    return jsonify({'task_types': TASK_TYPES})


@socketio.on('connect')
def handle_connect():
    socketio.emit('stats', queue.get_stats())
    socketio.emit('workers', {'workers': queue.get_workers()})


if __name__ == '__main__':
    socketio.run(app, host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
